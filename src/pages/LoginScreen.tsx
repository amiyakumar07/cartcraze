import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MessageCircle, ShieldCheck, CheckCircle2, Edit2 } from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { PolicyModal } from '../components/PolicyModal';

// Unified API base URL that resolves correctly across localhost, Render, and Android WebView
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : 'https://cartcraze-95gt.onrender.com');

export const LoginScreen: React.FC = () => {
  const { setUserProfile, setActiveTab, deliveryEta } = useApp();

  // WhatsApp Phone OTP States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [waDeepLink, setWaDeepLink] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  // Status & Modal States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [policyType, setPolicyType] = useState<'terms' | 'privacy' | null>(null);

  // Countdown timer effect for OTP resend
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Paste OTP from clipboard helper
  const handlePasteOtp = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, '').slice(0, 6);
      if (digits) {
        setOtp(digits);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2500);
        setError('');
      } else {
        setError('No 6-digit verification code found in your clipboard.');
      }
    } catch {
      setError('Unable to read clipboard. Please enter or paste the 6-digit code manually.');
    }
  };

  // Clean and format phone number
  const handlePhoneChange = (val: string) => {
    const numeric = val.replace(/\D/g, '');
    if (numeric.length <= 10) {
      setPhone(numeric);
    }
  };

  // 1. Send WhatsApp OTP
  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/whatsapp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Failed to send WhatsApp verification code. Please check your network.');
      }

      if (data.whatsappDeepLink) setWaDeepLink(data.whatsappDeepLink);
      setMaskedPhone(data.maskedPhone || `+91 ${cleanPhone}`);
      setSuccess(data.message || 'Verification code sent to your WhatsApp!');
      setOtpSent(true);
      setCountdown(30); // 30 second resend timer
    } catch (err: any) {
      setError(err.message || 'Could not connect to WhatsApp authentication service.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify WhatsApp OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/whatsapp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: cleanOtp })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.message || 'Invalid verification code. Please check and try again.');
      }

      const cleanPhone = phone.replace(/\D/g, '');
      const user = data.user || {
        uid: `usr_wa_${cleanPhone}`,
        phone: `+91 ${cleanPhone}`,
        name: `Customer (${cleanPhone.slice(-4)})`,
        email: `${cleanPhone}@cartcraze.com`,
        isLoggedIn: true
      };

      setUserProfile((prev) => ({
        ...prev,
        ...user,
        phone: `+91 ${cleanPhone}`,
        isLoggedIn: true
      }));

      setActiveTab('home');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset to phone edit
  const handleEditPhone = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
    setSuccess('');
    setCountdown(0);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0a1a 0%, #0d1a2e 40%, #0a1628 70%, #0a0a1a 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');

        @keyframes cc-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-14px) scale(1.02); }
        }
        @keyframes cc-pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes cc-slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cc-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cc-spin { to { transform: rotate(360deg); } }
        @keyframes cc-cursor-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes cc-wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60%,100% { transform: rotate(0deg); }
        }

        .cc-orb {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none; z-index: 0;
        }
        .cc-orb-1 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(37,211,102,0.14) 0%, transparent 70%);
          top: -80px; right: -80px;
        }
        .cc-orb-2 {
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(251,120,0,0.12) 0%, transparent 70%);
          bottom: 80px; left: -60px;
        }
        .cc-orb-3 {
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: 45%; right: 5%;
        }

        .cc-float-bg { position: absolute; z-index: 0; opacity: 0.05; font-size: 52px; }
        .cc-float-1 { top: 12%; left: 6%; animation: cc-float 7s ease-in-out infinite; }
        .cc-float-2 { top: 20%; right: 8%; animation: cc-float 9s ease-in-out infinite 1s; }
        .cc-float-3 { bottom: 30%; left: 10%; animation: cc-float 8s ease-in-out infinite 2s; }

        .cc-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 28px 22px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: cc-slideUp 0.5s ease 0.1s both;
        }

        .cc-phone-input-wrap {
          display: flex;
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          transition: all 0.2s;
        }
        .cc-phone-input-wrap:focus-within {
          border-color: rgba(37,211,102,0.5);
          background: rgba(37,211,102,0.03);
          box-shadow: 0 0 0 3px rgba(37,211,102,0.08);
        }
        .cc-phone-prefix {
          padding: 14px 14px;
          background: rgba(255,255,255,0.05);
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cc-phone-field {
          flex: 1;
          padding: 14px 14px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 15px;
          font-weight: 600;
          color: white;
          font-family: 'Inter', sans-serif;
          width: 100%;
        }
        .cc-phone-field::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; }

        .cc-wa-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(37,211,102,0.35);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .cc-wa-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          animation: cc-shimmer 2s infinite;
        }
        .cc-wa-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(37,211,102,0.45); }
        .cc-wa-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .cc-verify-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #fb7800 0%, #e05500 100%);
          color: white;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(251,120,0,0.35);
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .cc-verify-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          animation: cc-shimmer 2s infinite;
        }
        .cc-verify-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 32px rgba(251,120,0,0.45); }
        .cc-verify-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .cc-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: cc-spin 0.7s linear infinite;
        }

        .cc-otp-box {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 900;
          border-radius: 14px;
          border: 2px solid;
          transition: all 0.15s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .cc-otp-box.empty {
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.2);
        }
        .cc-otp-box.active {
          border-color: rgba(37,211,102,0.6);
          background: rgba(37,211,102,0.05);
          box-shadow: 0 0 0 3px rgba(37,211,102,0.1);
        }
        .cc-otp-box.filled {
          border-color: rgba(37,211,102,0.8);
          background: rgba(37,211,102,0.08);
          color: white;
          box-shadow: 0 0 12px rgba(37,211,102,0.15);
        }
        .cc-cursor {
          width: 2px; height: 22px;
          background: #25D366;
          border-radius: 1px;
          animation: cc-cursor-blink 1s ease-in-out infinite;
        }

        .cc-helper-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .cc-helper-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          color: white;
        }
        .cc-wa-open-btn {
          background: rgba(37,211,102,0.08);
          border-color: rgba(37,211,102,0.25);
          color: #25D366;
        }
        .cc-wa-open-btn:hover {
          background: rgba(37,211,102,0.14);
          border-color: rgba(37,211,102,0.4);
        }

        .cc-error-banner {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
          font-size: 12px;
          font-weight: 600;
          padding: 12px 16px;
          border-radius: 14px;
          text-align: center;
          line-height: 1.5;
        }
        .cc-success-banner {
          background: rgba(37,211,102,0.1);
          border: 1px solid rgba(37,211,102,0.25);
          color: #6ee7b7;
          font-size: 12px;
          font-weight: 600;
          padding: 12px 16px;
          border-radius: 14px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .cc-phone-dest {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cc-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          display: block;
          margin-bottom: 7px;
        }
        .cc-change-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #25D366;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          padding: 4px 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .cc-change-btn:hover { background: rgba(37,211,102,0.1); }
      `}</style>

      {/* Decorative orbs */}
      <div className="cc-orb cc-orb-1" />
      <div className="cc-orb cc-orb-2" />
      <div className="cc-orb cc-orb-3" />

      {/* Floating bg icons */}
      <span className="cc-float-bg cc-float-1">🛒</span>
      <span className="cc-float-bg cc-float-2">⚡</span>
      <span className="cc-float-bg cc-float-3">🥦</span>

      {/* Top Nav */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px 0'
      }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
            transition: 'all 0.2s'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)'
        }}>CartCraze</span>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px 20px 20px',
        animation: 'cc-slideUp 0.5s ease both'
      }}>
        {/* Hero Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 12
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -8,
                borderRadius: 30,
                border: '2px solid rgba(37,211,102,0.3)',
                animation: 'cc-pulse-ring 2.5s ease-out infinite'
              }} />
              <AppLogo style={{ height: 72, width: 'auto' }} />
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 24, fontWeight: 900,
            color: 'white', margin: '0 0 6px',
            letterSpacing: '-0.5px'
          }}>India's Last Minute App</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, fontWeight: 500 }}>
            {deliveryEta || '9-min'} express delivery • WhatsApp OTP login
          </p>
        </div>

        {/* Glass Card */}
        <div className="cc-card" style={{ width: '100%', maxWidth: 400 }}>
          {/* Error / Success */}
          {error && <div className="cc-error-banner" style={{ marginBottom: 16 }}>{error}</div>}
          {success && (
            <div className="cc-success-banner" style={{ marginBottom: 16 }}>
              <CheckCircle2 size={14} />
              <span>{success}</span>
            </div>
          )}

          {!otpSent ? (
            /* Step 1 – Phone number */
            <form onSubmit={handleSendPhoneOtp}>
              <label className="cc-label">
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageCircle size={13} color="#25D366" />
                    WhatsApp Mobile Number
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#6ee7b7',
                    background: 'rgba(37,211,102,0.12)',
                    padding: '2px 8px', borderRadius: 50
                  }}>Instant OTP</span>
                </span>
              </label>

              <div className="cc-phone-input-wrap" style={{ marginBottom: 14 }}>
                <div className="cc-phone-prefix">
                  <span style={{ fontSize: 16 }}>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="cc-phone-field"
                />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '0 0 18px', lineHeight: 1.5 }}>
                We'll send a 6-digit verification code to your WhatsApp.
              </p>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="cc-wa-btn"
              >
                {loading ? <div className="cc-spinner" /> : (
                  <>
                    <MessageCircle size={16} fill="white" />
                    <span>Get OTP on WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2 – OTP verification */
            <form onSubmit={handleVerifyPhoneOtp}>
              {/* Destination display */}
              <div className="cc-phone-dest" style={{ marginBottom: 18 }}>
                <div>
                  <span className="cc-label" style={{ margin: 0, marginBottom: 2 }}>OTP sent to WhatsApp</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>
                    {maskedPhone || `+91 ${phone}`}
                  </span>
                </div>
                <button type="button" onClick={handleEditPhone} className="cc-change-btn">
                  <Edit2 size={11} />
                  Change
                </button>
              </div>

              {/* OTP label + resend */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 10
              }}>
                <span className="cc-label" style={{ margin: 0 }}>Enter 6-Digit OTP</span>
                {countdown > 0 ? (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                    Resend in <span style={{ color: '#25D366', fontWeight: 800 }}>{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendPhoneOtp()}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 11, fontWeight: 800, color: '#25D366',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >Resend OTP</button>
                )}
              </div>

              {/* Segmented OTP boxes */}
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    opacity: 0, zIndex: 20, cursor: 'text'
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {[0,1,2,3,4,5].map((idx) => {
                    const digit = otp[idx] || '';
                    const isCurrent = otp.length === idx || (idx === 5 && otp.length === 6);
                    return (
                      <div
                        key={idx}
                        className={`cc-otp-box ${digit ? 'filled' : isCurrent ? 'active' : 'empty'}`}
                      >
                        {digit ? digit : isCurrent ? <span className="cc-cursor" /> : '·'}
                      </div>
                    );
                  })}
                </div>
              </div>


              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="cc-verify-btn"
              >
                {loading ? <div className="cc-spinner" /> : <span>Verify &amp; Continue →</span>}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24, padding: '0 10px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '0 0 8px', lineHeight: 1.6 }}>
            By continuing, you agree to our{' '}
            <button
              type="button"
              onClick={() => setPolicyType('terms')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(37,211,102,0.7)', fontWeight: 700, fontSize: 11,
                textDecoration: 'underline', fontFamily: 'Inter, sans-serif'
              }}
            >Terms</button>
            {' '}&amp;{' '}
            <button
              type="button"
              onClick={() => setPolicyType('privacy')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(37,211,102,0.7)', fontWeight: 700, fontSize: 11,
                textDecoration: 'underline', fontFamily: 'Inter, sans-serif'
              }}
            >Privacy Policy</button>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={12} color="#25D366" />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
              Secured by CartCraze SSL • Express Hyperlocal Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      <PolicyModal
        isOpen={policyType !== null}
        policyType={policyType}
        onClose={() => setPolicyType(null)}
      />
    </div>
  );
};

export default LoginScreen;
