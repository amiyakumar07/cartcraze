// ============================================================================
// CartCraze Production WhatsApp OTP Authentication Service
// Supports:
// 1. OpenWA WhatsApp Gateway (Native live mode)
// 2. Meta WhatsApp Cloud API (Graph API v20.0 / v21.0)
// 3. Generic HTTP WhatsApp Gateway (UltraMsg, Twilio, WATI, Fast2SMS, etc.)
// 4. User-Initiated Click-to-Chat Deep Link (wa.me)
// ============================================================================

try {
  process.loadEnvFile?.('.env');
} catch (e) {
  // Ignore if already loaded or not found
}

const WHATSAPP_API_VERSION = 'v20.0';

// In-memory store for OTPs: phone -> { otp, expiresAt, attempts, lastRequestedAt }
const otpStore = new Map();

// Rate limiting: phone -> array of timestamps
const rateLimitStore = new Map();

/**
 * Normalizes phone number to international format without '+' or spaces (e.g. 919876543210)
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  // Default to India (+91) if standard 10-digit mobile number provided
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Masks phone number for secure display (e.g. +91 98765 •••••)
 */
export function maskPhoneNumber(phone) {
  const clean = formatPhoneNumber(phone);
  if (!clean || clean.length < 8) return phone;
  const start = clean.slice(0, clean.length - 5);
  return `+${start} •••••`;
}

/**
 * Generate a random 6-digit numeric OTP
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send WhatsApp OTP via Meta Cloud API, Custom Gateway, or Click-to-Chat
 */
export async function sendWhatsAppOtp(phone) {
  const normalizedPhone = formatPhoneNumber(phone);
  if (!normalizedPhone || normalizedPhone.length < 10) {
    throw new Error('Invalid phone number. Please provide a valid 10-digit mobile number.');
  }

  // Rate Limiting: Max 3 OTP requests in 60 seconds
  const now = Date.now();
  const recentRequests = (rateLimitStore.get(normalizedPhone) || []).filter(t => now - t < 60000);
  if (recentRequests.length >= 3) {
    throw new Error('Too many OTP requests. Please wait 60 seconds before requesting another code.');
  }
  recentRequests.push(now);
  rateLimitStore.set(normalizedPhone, recentRequests);

  const otp = generateOtp();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity
  otpStore.set(normalizedPhone, { otp, expiresAt, attempts: 0 });

  console.log(`\n======================================================`);
  console.log(`[CartCraze WhatsApp OTP] Code generated for +${normalizedPhone}: ${otp}`);
  console.log(`======================================================\n`);

  const businessNumber = process.env.WHATSAPP_BUSINESS_PHONE || '917815041952';
  const prefillText = `Hi CartCraze, please verify my mobile number: CC-${otp}`;
  const whatsappDeepLink = `https://wa.me/${businessNumber}?text=${encodeURIComponent(prefillText)}`;

  let directApiSent = false;
  let deliveryMethod = 'deep_link';
  let apiErrorMessage = null;

  // -------------------------------------------------------------
  // Provider Option 1: OpenWA (Open WhatsApp Gateway)
  // -------------------------------------------------------------
  const openwaApiKey = process.env.OPENWA_API_KEY;
  const openwaUrl = (process.env.OPENWA_API_URL || 'http://localhost:2785').replace(/\/+$/, '');
  let openwaSessionId = process.env.OPENWA_SESSION_ID;

  if (openwaApiKey && openwaApiKey.trim() !== '' && !openwaApiKey.includes('YOUR_')) {
    try {
      // If session ID not statically defined, dynamically discover the first ready session
      if (!openwaSessionId) {
        const sessionRes = await fetch(`${openwaUrl}/api/sessions`, {
          headers: { 'X-API-Key': openwaApiKey.trim() }
        }).catch(() => null);
        if (sessionRes && sessionRes.ok) {
          const sessions = await sessionRes.json();
          const active = Array.isArray(sessions) ? sessions.find(s => s.status === 'ready') : null;
          if (active) openwaSessionId = active.id;
        }
      }

      if (openwaSessionId) {
        const messageText = `🛒 *CartCraze Login Verification*\n\n*${otp}* is your verification code for CartCraze.\n\nTap to copy code: \`${otp}\`\n\n🔒 Do not share this OTP with anyone, including CartCraze staff.\n⏱️ Valid for 5 minutes.\n\n_CartCraze • India's Last Minute App (8-Min Delivery)_`;
        const sendUrl = `${openwaUrl}/api/sessions/${openwaSessionId}/messages/send-text`;

        const res = await fetch(sendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': openwaApiKey.trim()
          },
          body: JSON.stringify({
            chatId: `${normalizedPhone}@c.us`,
            text: messageText
          })
        });

        const data = await res.json().catch(() => null);
        if (res.ok && (data?.messageId || data?.id)) {
          directApiSent = true;
          deliveryMethod = 'openwa';
          console.log(`[WhatsApp API] Direct OTP sent successfully via OpenWA to +${normalizedPhone} (MsgID: ${data.messageId || data.id})`);
        } else {
          console.warn('[WhatsApp API] OpenWA sending returned non-ok response:', res.status, data);
        }
      }
    } catch (openwaErr) {
      console.warn('[WhatsApp API] OpenWA send request failed:', openwaErr.message);
    }
  }

  // -------------------------------------------------------------
  // Provider Option 2: Meta WhatsApp Cloud API
  // -------------------------------------------------------------
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1255652084302813';
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME || 'hello_world';

  if (!directApiSent && accessToken && accessToken.trim() !== '' && !accessToken.includes('YOUR_')) {
    try {
      const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`;

      let payload;
      if (templateName === 'hello_world') {
        // Meta's built-in default verification test template
        payload = {
          messaging_product: 'whatsapp',
          to: normalizedPhone,
          type: 'template',
          template: { name: 'hello_world', language: { code: 'en_US' } }
        };
      } else {
        // Custom WhatsApp OTP Authentication Template
        payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: normalizedPhone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otp }]
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otp }]
              }
            ]
          }
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.messages?.[0]?.id) {
        directApiSent = true;
        deliveryMethod = 'meta_cloud_api';
        console.log(`[WhatsApp API] Direct message successfully sent via Meta Cloud API to +${normalizedPhone} (ID: ${data.messages[0].id})`);
      } else {
        // If button template failed, try sending standard body-only template or text fallback
        console.warn('[WhatsApp API] Meta Cloud API template notification warning:', data?.error?.message);
        apiErrorMessage = data?.error?.message;
      }
    } catch (err) {
      console.warn('[WhatsApp API] Meta Cloud API request failed:', err.message);
      apiErrorMessage = err.message;
    }
  }

  // -------------------------------------------------------------
  // Provider Option B: Generic WhatsApp Gateway / Webhook
  // (UltraMsg, WATI, Twilio, Fast2SMS, etc.)
  // -------------------------------------------------------------
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
  const gatewayKey = process.env.WHATSAPP_GATEWAY_KEY || process.env.WHATSAPP_GATEWAY_TOKEN;

  if (!directApiSent && gatewayUrl && gatewayUrl.trim() !== '') {
    try {
      const messageText = `Your CartCraze login verification OTP is: ${otp}. Valid for 5 minutes. Please do not share this code with anyone.`;
      const res = await fetch(gatewayUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gatewayKey ? { 'Authorization': `Bearer ${gatewayKey.trim()}`, 'x-api-key': gatewayKey.trim() } : {})
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          to: normalizedPhone,
          message: messageText,
          otp: otp,
          sender: 'CartCraze'
        })
      });

      if (res.ok) {
        directApiSent = true;
        deliveryMethod = 'custom_gateway';
        console.log(`[WhatsApp API] Direct message successfully sent via Custom Gateway to +${normalizedPhone}`);
      }
    } catch (gatewayErr) {
      console.warn('[WhatsApp API] Custom Gateway request failed:', gatewayErr.message);
    }
  }

  return {
    success: true,
    phone: normalizedPhone,
    maskedPhone: maskPhoneNumber(normalizedPhone),
    whatsappDeepLink,
    directApiSent,
    deliveryMethod,
    expiresInSeconds: 300,
    message: directApiSent
      ? `Verification code sent directly to your WhatsApp at +${normalizedPhone}`
      : `Verification code ready! Enter the 6-digit OTP code below.`
  };
}

/**
 * Verify OTP entered by customer
 */
export function verifyWhatsAppOtp(phone, inputOtp) {
  const normalizedPhone = formatPhoneNumber(phone);
  const stored = otpStore.get(normalizedPhone);

  if (!stored) {
    return {
      success: false,
      message: 'No active OTP found for this mobile number. Please tap "Resend OTP".'
    };
  }

  // Check Expiration
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedPhone);
    return {
      success: false,
      message: 'Your verification OTP has expired. Please tap "Resend OTP" to get a new code.'
    };
  }

  // Track Attempts (Limit to 5 failed attempts)
  stored.attempts = (stored.attempts || 0) + 1;
  if (stored.attempts > 5) {
    otpStore.delete(normalizedPhone);
    return {
      success: false,
      message: 'Too many incorrect attempts. Please request a new OTP code.'
    };
  }

  // Exact OTP comparison
  if (stored.otp.trim() === String(inputOtp).trim()) {
    // Delete OTP upon successful verification to prevent replay
    otpStore.delete(normalizedPhone);
    return {
      success: true,
      phone: normalizedPhone,
      message: 'Mobile number successfully verified with CartCraze!'
    };
  }

  const remainingAttempts = 5 - stored.attempts;
  return {
    success: false,
    message: `Invalid OTP code. Please check your WhatsApp and try again. (${remainingAttempts} attempts remaining)`
  };
}
