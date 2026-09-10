import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Lock, Mail, Phone, MessageCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';
import { signInWithGoogle, signInWithFirebaseEmail, signUpWithFirebaseEmail } from '../services/firebase';
import { AppLogo } from '../components/AppLogo';
import { PolicyModal } from '../components/PolicyModal';

const API_BASE = 'http://localhost:4000';

export const LoginScreen: React.FC = () => {
  const { setUserProfile, setActiveTab } = useApp();
  const [authTab, setAuthTab] = useState<'phone' | 'email' | 'google'>('phone');

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [waDeepLink, setWaDeepLink] = useState('');

  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Status & Modal States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [policyType, setPolicyType] = useState<'terms' | 'privacy' | null>(null);

  // Phone / WhatsApp OTP
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/whatsapp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.whatsappDeepLink) setWaDeepLink(data.whatsappDeepLink);
        setSuccess(data.message || 'Verification code sent successfully!');
      } else {
        setSuccess('Verification code sent! Please check your phone.');
      }
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the verification code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/whatsapp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Invalid verification code.');
      }

      setUserProfile((prev) => ({
        ...prev,
        phone: phone.trim(),
        name: `Customer (${phone.slice(-4)})`,
        email: `${phone.replace(/\D/g, '')}@cartcraze.com`,
        isLoggedIn: true
      }));
      setActiveTab('home');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email Authentication via Firebase Auth
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both Email and Password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        // Firebase Auth Create User
        const { user: fbUser, error: fbErr } = await signUpWithFirebaseEmail(email.trim(), password.trim());
        if (fbErr && !fbErr.includes('email-already-in-use')) {
          // Fallback to Supabase
          const { error: sbErr } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
          });
          if (sbErr && !sbErr.message.includes('already registered')) throw sbErr;
        }
      } else {
        // Firebase Auth Sign In
        const { user: fbUser, error: fbErr } = await signInWithFirebaseEmail(email.trim(), password.trim());
        if (fbErr) {
          // If login fails, try Supabase or create user
          const { error: sbErr } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          });
          if (sbErr) {
            throw new Error(fbErr || sbErr.message || 'Invalid credentials');
          }
        }
      }

      setLoading(false);
      setUserProfile((prev) => ({
        ...prev,
        email: email.trim(),
        name: email.split('@')[0] || 'Customer User',
        phone: prev.phone || '',
        isLoggedIn: true
      }));
      setActiveTab('home');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  // Google Sign-In via Firebase Auth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { user, error: googleErr } = await signInWithGoogle();
      setLoading(false);
      if (googleErr) {
        setError(googleErr);
        return;
      }
      if (user) {
        setUserProfile((prev) => ({
          ...prev,
          name: user.displayName || 'Customer User',
          email: user.email || '',
          phone: user.phoneNumber || prev.phone || '',
          isLoggedIn: true
        }));
        setActiveTab('home');
        return;
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Google Sign-In failed. Please try again.');
    }
  };

  // Skip & Explore as Guest
  const handleGuestExplore = () => {
    setUserProfile((prev) => ({
      ...prev,
      name: 'Guest Shopper',
      email: 'guest@cartcraze.com',
      phone: '',
      isLoggedIn: true
    }));
    setActiveTab('home');
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
            Log in or sign up to experience 8-minute delivery
          </p>
        </div>

        {/* Auth Method Navigation: Phone | Email | Google */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-[11px] font-black">
          <button
            type="button"
            onClick={() => { setAuthTab('phone'); setError(''); setSuccess(''); }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              authTab === 'phone' ? 'bg-[#00676d] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>Phone</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('email'); setError(''); setSuccess(''); }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              authTab === 'email' ? 'bg-[#00676d] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('google'); setError(''); setSuccess(''); }}
            className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all ${
              authTab === 'google' ? 'bg-[#00676d] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
              <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.81 14.08H2.13V16.94C3.96 20.57 7.69 23 12 23Z" fill="#34A853" />
              <path d="M5.81 14.08C5.58 13.39 5.45 12.66 5.45 11.91C5.45 11.16 5.58 10.43 5.81 9.74V6.88H2.13C1.38 8.38 0.95 10.09 0.95 11.91C0.95 13.73 1.38 15.44 2.13 16.94L5.81 14.08Z" fill="#FBBC05" />
              <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.38 3.86C17.45 2.06 14.96 0.95 12 0.95C7.69 0.95 3.96 3.38 2.13 7.02L5.81 9.88C6.7 7.27 9.13 5.38 12 5.38Z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-2xl font-semibold text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-3 rounded-2xl font-semibold text-center">
            {success}
          </div>
        )}

        {/* 1. PHONE TAB */}
        {authTab === 'phone' && (
          <form onSubmit={otpSent ? handleVerifyPhoneOtp : handleSendPhoneOtp} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#00676d]" />
                <span>Mobile Number</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-[#00676d] transition"
              />
            </div>

            {otpSent && (
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-center tracking-widest text-slate-900 outline-none focus:border-[#00676d] transition"
                  />
                </div>

                {waDeepLink && (
                  <a
                    href={waDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open WhatsApp to Confirm OTP</span>
                  </a>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb7800] hover:bg-[#e06b00] text-white font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>{otpSent ? 'Verify OTP & Continue' : 'Continue'}</span>
              )}
            </button>
          </form>
        )}

        {/* 2. EMAIL TAB */}
        {authTab === 'email' && (
          <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-[#00676d] transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-[#00676d] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fb7800] hover:bg-[#e06b00] text-white font-black text-xs py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer active:scale-98"
            >
              {loading ? 'Authenticating...' : isRegisterMode ? 'Create New Account' : 'Continue'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline transition cursor-pointer"
              >
                {isRegisterMode ? 'Already have an account? Sign In' : 'New to CartCraze? Create an Account'}
              </button>
            </div>
          </form>
        )}

        {/* 3. GOOGLE TAB */}
        {authTab === 'google' && (
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.81 14.08H2.13V16.94C3.96 20.57 7.69 23 12 23Z" fill="#34A853" />
                <path d="M5.81 14.08C5.58 13.39 5.45 12.66 5.45 11.91C5.45 11.16 5.58 10.43 5.81 9.74V6.88H2.13C1.38 8.38 0.95 10.09 0.95 11.91C0.95 13.73 1.38 15.44 2.13 16.94L5.81 14.08Z" fill="#FBBC05" />
                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.38 3.86C17.45 2.06 14.96 0.95 12 0.95C7.69 0.95 3.96 3.38 2.13 7.02L5.81 9.88C6.7 7.27 9.13 5.38 12 5.38Z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Skip for now & explore as Guest */}
        <button
          type="button"
          onClick={handleGuestExplore}
          className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 py-2 transition-colors cursor-pointer"
        >
          Skip for now &amp; explore as Guest
        </button>
      </div>

      {/* Footer / Terms & Privacy Policy */}
      <div className="pt-4 text-center space-y-2">
        <p className="text-[11px] text-slate-400 font-medium">
          By continuing, you agree to our{' '}
          <button
            type="button"
            onClick={() => setPolicyType('terms')}
            className="text-[#00676d] font-bold underline hover:text-slate-800 transition-colors"
          >
            Terms
          </button>{' '}
          &amp;{' '}
          <button
            type="button"
            onClick={() => setPolicyType('privacy')}
            className="text-[#00676d] font-bold underline hover:text-slate-800 transition-colors"
          >
            Privacy Policy
          </button>
        </p>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Secured by CartCraze SSL • 8-Minute Instant Delivery</span>
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
