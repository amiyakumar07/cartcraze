import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MessageCircle, RefreshCw, ShieldCheck, CheckCircle2, Edit2, Clipboard, Check } from 'lucide-react';
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
    <div className="min-h-screen bg-white flex flex-col justify-between p-6 font-sans relative">
      {/* Top Navigation */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400">CartCraze</span>
      </div>

      {/* Main Form Content */}
      <div className="flex flex-col max-w-sm mx-auto w-full space-y-4 my-auto">
        {/* Real Uploaded CartCraze Logo */}
        <div className="flex justify-center items-center py-2">
          <AppLogo className="h-24 w-auto max-h-24 object-contain" />
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            India's Last Minute App
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Log in with WhatsApp for instant OTP &amp; {deliveryEta || 'express'} delivery
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-2xl font-semibold text-center leading-relaxed">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-2xl font-semibold text-center leading-relaxed flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* WHATSAPP MOBILE OTP AUTH */}
        <div className="space-y-3.5">
          {!otpSent ? (
            /* Step 1: Enter Mobile Number */
            <form onSubmit={handleSendPhoneOtp} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Mobile Number</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full">
                    Instant OTP
                  </span>
                </label>

                <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden focus-within:border-[#00676d] transition bg-white shadow-xs">
                  <div className="px-3.5 py-3 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700 select-none">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    autoFocus
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  We will send a 6-digit verification code directly to your WhatsApp.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Get OTP on WhatsApp</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Enter OTP & Verify */
            <form onSubmit={handleVerifyPhoneOtp} className="space-y-3.5">
              {/* Masked destination with Edit Number button */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    OTP Sent To WhatsApp
                  </span>
                  <span className="text-xs font-black text-slate-800">
                    {maskedPhone || `+91 ${phone}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleEditPhone}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#00676d] hover:text-emerald-800 px-2.5 py-1 rounded-lg hover:bg-white transition cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Enter 6-Digit OTP</span>
                  {countdown > 0 ? (
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Resend in <span className="font-bold text-[#00676d]">{countdown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendPhoneOtp()}
                      className="text-[11px] text-[#00676d] font-bold hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Segmented 6-Box PIN View */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text"
                  />
                  <div className="grid grid-cols-6 gap-2">
                    {[0, 1, 2, 3, 4, 5].map((idx) => {
                      const digit = otp[idx] || '';
                      const isCurrent = otp.length === idx || (idx === 5 && otp.length === 6);
                      return (
                        <div
                          key={idx}
                          className={`h-12 flex items-center justify-center text-xl font-black rounded-xl border-2 transition-all duration-150 ${
                            digit
                              ? 'border-emerald-600 bg-emerald-50/60 text-slate-900 shadow-xs'
                              : isCurrent
                              ? 'border-[#00676d] bg-white ring-2 ring-[#00676d]/20 shadow-xs'
                              : 'border-slate-200 bg-slate-50 text-slate-400'
                          }`}
                        >
                          {digit ? digit : isCurrent ? <span className="w-1.5 h-4 bg-[#00676d] animate-pulse rounded-full" /> : '•'}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Professional Quick Action Buttons: Paste Code & Open WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePasteOtp}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer active:scale-98"
                  >
                    {pasteSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Pasted!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                        <span>Paste Code</span>
                      </>
                    )}
                  </button>

                  {waDeepLink ? (
                    <a
                      href={waDeepLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] border border-[#25D366]/30 text-xs font-bold transition active:scale-98"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>Open WhatsApp</span>
                    </a>
                  ) : (
                    <div />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full bg-[#fb7800] hover:bg-[#e06b00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Verify &amp; Continue</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer / Terms & Privacy Policy */}
      <div className="pt-4 text-center space-y-2">
        <p className="text-[11px] text-slate-400 font-medium">
          By continuing, you agree to our{' '}
          <button
            type="button"
            onClick={() => setPolicyType('terms')}
            className="text-[#00676d] font-bold underline hover:text-slate-800 transition-colors cursor-pointer"
          >
            Terms
          </button>{' '}
          &amp;{' '}
          <button
            type="button"
            onClick={() => setPolicyType('privacy')}
            className="text-[#00676d] font-bold underline hover:text-slate-800 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
        </p>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by CartCraze SSL • Express Hyperlocal Delivery</span>
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
