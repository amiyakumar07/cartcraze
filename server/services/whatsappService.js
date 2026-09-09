// ============================================================================
// WhatsApp Cloud API & Free User-Initiated Verification Service
// ============================================================================

const WHATSAPP_API_VERSION = 'v20.0';

// In-memory store for OTPs: phone -> { otp, expiresAt, verified }
const otpStore = new Map();

/**
 * Normalizes phone number to international format without '+' or spaces (e.g. 917815041952)
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Generate a random 6-digit numeric OTP
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send or Initiate WhatsApp OTP (Supports 100% Free User-Initiated Mode + Meta API)
 */
export async function sendWhatsAppOtp(phone) {
  const normalizedPhone = formatPhoneNumber(phone);
  if (!normalizedPhone || normalizedPhone.length < 10) {
    throw new Error('Invalid phone number. Please provide a valid mobile number with country code.');
  }

  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || '1255652084302813';
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const businessNumber = process.env.WHATSAPP_BUSINESS_PHONE || '15552033981'; // default test number or custom business number

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(normalizedPhone, { otp, expiresAt, verified: false });

  console.log(`[WhatsApp OTP] Generated code for ${normalizedPhone}: ${otp}`);

  // Construct 100% Free "Click-to-Chat" link (user sends message to your business number)
  const prefillText = `Hi CartCraze, please verify my mobile number: CC-${otp}`;
  const whatsappDeepLink = `https://wa.me/${businessNumber}?text=${encodeURIComponent(prefillText)}`;

  // If live access token is provided, also trigger direct Meta Graph API template send
  let directApiSent = false;
  let metaResponse = null;

  if (accessToken && accessToken.trim() !== '' && !accessToken.includes('Access Token String')) {
    try {
      const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`;
      const templateName = process.env.WHATSAPP_OTP_TEMPLATE_NAME || 'hello_world';

      const payload = templateName === 'hello_world'
        ? {
            messaging_product: 'whatsapp',
            to: normalizedPhone,
            type: 'template',
            template: { name: 'hello_world', language: { code: 'en_US' } }
          }
        : {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: normalizedPhone,
            type: 'template',
            template: {
              name: templateName,
              language: { code: 'en_US' },
              components: [
                { type: 'body', parameters: [{ type: 'text', text: otp }] },
                { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: otp }] }
              ]
            }
          };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      metaResponse = await res.json();
      if (res.ok) {
        directApiSent = true;
        console.log(`[WhatsApp OTP] Direct message delivered via Meta API to ${normalizedPhone}`);
      } else {
        console.warn('[WhatsApp OTP] Meta API direct message skipped/failed:', metaResponse?.error?.message);
      }
    } catch (err) {
      console.warn('[WhatsApp OTP] Could not send direct API message:', err.message);
    }
  }

  return {
    success: true,
    phone: normalizedPhone,
    otp: otp, // Available for free verification
    whatsappDeepLink,
    directApiSent,
    message: directApiSent
      ? 'Verification message sent directly to your WhatsApp!'
      : 'Verification ready! Tap "Open WhatsApp" or enter the 6-digit code below.'
  };
}

/**
 * Verify OTP entered by user
 */
export function verifyWhatsAppOtp(phone, inputOtp) {
  const normalizedPhone = formatPhoneNumber(phone);
  const stored = otpStore.get(normalizedPhone);

  if (!stored) {
    return { success: false, message: 'No OTP requested for this phone number. Please request a new code.' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedPhone);
    return { success: false, message: 'Code has expired. Please request a new code.' };
  }

  // Strict verification: Require exact OTP match
  if (stored.otp.trim() === inputOtp.trim()) {
    stored.verified = true;
    otpStore.delete(normalizedPhone);
    return {
      success: true,
      phone: normalizedPhone,
      message: 'Mobile number successfully verified via WhatsApp'
    };
  }

  return { success: false, message: 'Invalid OTP code. Please check and try again.' };
}
