import React, { useState } from 'react';
import { User, Phone, Mail, CheckCircle, X, LogOut, ArrowRight, Lock, MessageCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = 'http://localhost:4000';

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({ isOpen, onClose }) => {
  const { userProfile, setUserProfile } = useApp();
  const [authMethod, setAuthMethod] = useState<'whatsapp' | 'email'>('whatsapp');

  // Input states
  const [phoneInput, setPhoneInput] = useState(userProfile.phone || '+91 78150 41952');
  const [emailInput, setEmailInput] = useState(userProfile.email || '');
  const [nameInput, setNameInput] = useState(userProfile.name || '');

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Send WhatsApp or Email OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMethod === 'whatsapp') {
        if (!phoneInput.trim()) throw new Error('Please enter your mobile phone number.');
        const res = await fetch(`${API_BASE}/api/auth/whatsapp/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneInput })
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          if (data.whatsappDeepLink) setWhatsappLink(data.whatsappDeepLink);
          setSuccessMsg(data.message || 'OTP code sent via WhatsApp!');
          if (data.otp) {
            // Demo helper note if needed
            console.log('CartCraze WhatsApp OTP:', data.otp);
          }
        } else {
          setSuccessMsg('WhatsApp verification code ready!');
        }
      } else {
        if (!emailInput.trim()) throw new Error('Please enter your email address.');
        const res = await fetch(`${API_BASE}/api/auth/email/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput })
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          setSuccessMsg(data.message || '6-digit OTP code sent to your email!');
        } else {
          setSuccessMsg('Email OTP ready! Check console or enter 123456 in demo mode.');
        }
      }

      setOtpSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (otpInput.trim().length < 4) {
        throw new Error('Please enter a valid 6-digit OTP code.');
      }

      let verifiedUser: any = null;

      if (authMethod === 'whatsapp') {
        const res = await fetch(`${API_BASE}/api/auth/whatsapp/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phoneInput, otp: otpInput, name: nameInput })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Invalid WhatsApp OTP code. Please check and try again.');
        }
        verifiedUser = data.user;
      } else {
        const res = await fetch(`${API_BASE}/api/auth/email/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput, otp: otpInput, name: nameInput })
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Invalid Email OTP code. Please check and try again.');
        }
        verifiedUser = data.user;
      }

      if (verifiedUser) {
        setUserProfile((prev) => ({
          ...prev,
          ...verifiedUser
        }));
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn border border-emerald-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800">
            <User className="w-5 h-5 text-emerald-700" />
            <h3 className="font-extrabold text-base">Account & Security</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {userProfile.phone || userProfile.email ? (
          /* Logged In View */
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-900 text-base">{userProfile.name || 'Verified User'}</div>
                <div className="text-xs text-slate-600 font-semibold">{userProfile.phone || userProfile.email}</div>
                <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>CartCraze Verified Customer</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setUserProfile((prev) => ({ ...prev, phone: '', email: '', name: '' }));
                setOtpSent(false);
                setOtpInput('');
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-200 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          </div>
        ) : (
          /* Login / Signup Flow */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-lg font-black text-slate-900">Welcome to CartCraze</div>
              <div className="text-xs text-slate-500 font-medium">100% Free OTP Login with WhatsApp or Email</div>
            </div>

            {/* Method Tabs */}
            {!otpSent && (
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('whatsapp'); setErrorMsg(''); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                    authMethod === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setErrorMsg(''); }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                    authMethod === 'email'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email OTP</span>
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {!otpSent ? (
              /* Step 1: Input Form */
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {authMethod === 'whatsapp' ? (
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      WhatsApp Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 78150 41952"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Free OTP delivered directly to your WhatsApp</span>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-emerald-700 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Real 6-digit verification code delivered to your Gmail/Inbox</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs ${
                    authMethod === 'whatsapp'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{authMethod === 'whatsapp' ? 'Get OTP on WhatsApp' : 'Send 6-Digit Email Code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: OTP Entry Form */
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {authMethod === 'whatsapp' ? 'WhatsApp Number' : 'Email Address'}
                    </div>
                    <div className="font-extrabold text-slate-800">
                      {authMethod === 'whatsapp' ? phoneInput : emailInput}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpInput(''); }}
                    className="text-emerald-700 font-bold text-xs underline"
                  >
                    Edit
                  </button>
                </div>

                {/* Optional WhatsApp Direct Open button */}
                {authMethod === 'whatsapp' && whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Open WhatsApp App & Send Verification</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-base font-black tracking-widest text-slate-900 focus:outline-none focus:border-emerald-600 text-center"
                      required
                      autoFocus
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block text-center">
                    Enter the code you received (or test code 123456)
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
