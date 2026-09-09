import nodemailer from 'nodemailer';

// In-memory store for Email OTPs: email -> { otp, expiresAt, verified }
const emailOtpStore = new Map();

/**
 * Generate a random 6-digit numeric OTP
 */
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Configure Nodemailer Transporter
 * Supports free Gmail with App Password, or custom SMTP
 */
function getTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.trim(),
        pass: pass.trim()
      }
    });
  }

  return null;
}

/**
 * Send 6-digit OTP code to user's email address
 */
export async function sendEmailOtp(email) {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  emailOtpStore.set(cleanEmail, { otp, expiresAt, verified: false });

  console.log(`[Email OTP] Generated code for ${cleanEmail}: ${otp} (expires in 5m)`);

  const transporter = getTransporter();

  // If no Gmail credentials set up yet in .env, run in Free Demo/Console Mode
  if (!transporter) {
    console.warn(`[Email OTP] No GMAIL_USER / GMAIL_APP_PASSWORD configured in server/.env.`);
    console.warn(`[Email OTP] Free Demo OTP for ${cleanEmail} is: ${otp}`);
    return {
      success: true,
      email: cleanEmail,
      message: 'OTP generated! (Set GMAIL_USER & GMAIL_APP_PASSWORD in server/.env for live delivery)',
      demoOtp: otp
    };
  }

  const senderAddress = process.env.GMAIL_USER || 'CartCraze Security <no-reply@cartcraze.com>';

  const mailOptions = {
    from: `"CartCraze Verification" <${senderAddress}>`,
    to: cleanEmail,
    subject: `${otp} is your CartCraze login code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #047857; padding: 24px; text-align: center; color: #ffffff; }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
          .content { padding: 32px 24px; text-align: center; }
          .title { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #0f172a; }
          .subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; }
          .otp-card { background: #f0fdf4; border: 2px dashed #86efac; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #047857; margin: 0; }
          .expiry { font-size: 12px; color: #15803d; font-weight: 600; margin-top: 8px; }
          .warning { font-size: 12px; color: #94a3b8; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
          .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🛒 CartCraze</div>
          </div>
          <div class="content">
            <div class="title">Your Verification Code</div>
            <div class="subtitle">Use this one-time code to sign in to your CartCraze account.</div>
            <div class="otp-card">
              <div class="otp-code">${otp}</div>
              <div class="expiry">⏱️ Valid for 5 minutes</div>
            </div>
            <div class="warning">
              If you didn't request this code, you can safely ignore this email. Never share this code with anyone.
            </div>
          </div>
          <div class="footer">
            CartCraze Quick Commerce • 10-Minute Groceries & Essentials
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);

  return {
    success: true,
    email: cleanEmail,
    message: `Verification code sent to ${cleanEmail}`
  };
}

/**
 * Verify Email OTP entered by user
 */
export function verifyEmailOtp(email, inputOtp) {
  const cleanEmail = email.trim().toLowerCase();
  const stored = emailOtpStore.get(cleanEmail);

  if (!stored) {
    return { success: false, message: 'No OTP requested for this email. Please request a new code.' };
  }

  if (Date.now() > stored.expiresAt) {
    emailOtpStore.delete(cleanEmail);
    return { success: false, message: 'OTP has expired. Please request a new code.' };
  }

  // Strict verification: Require exact OTP match
  if (stored.otp.trim() === inputOtp.trim()) {
    stored.verified = true;
    emailOtpStore.delete(cleanEmail);
    return {
      success: true,
      email: cleanEmail,
      message: 'Email successfully verified'
    };
  }

  return { success: false, message: 'Invalid OTP code. Please check and try again.' };
}
