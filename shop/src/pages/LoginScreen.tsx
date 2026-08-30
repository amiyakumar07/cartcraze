import React, { useState } from 'react';
import { Store, TrendingUp, Box, BarChart3, ArrowRight, Lock, Eye, EyeOff, HelpCircle, UserPlus, LogIn } from 'lucide-react';
import { supabase } from '../services/supabase';
import { signInWithGoogle } from '../services/firebase';

interface Props {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<'landing' | 'login'>('landing');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [storeId, setStoreId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!storeId.trim()) {
      setError('Please enter Store ID or Email');
      return;
    }

    if (!password) {
      setError('Please enter your account password');
      return;
    }

    setLoading(true);
    const email = storeId.includes('@') ? storeId.trim() : `${storeId.trim().toLowerCase()}@cartcrazepartner.app`;

    try {
      if (isRegisterMode) {
        // STRICT Supabase User Registration
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
        });

        setLoading(false);

        if (signUpErr) {
          setError(signUpErr.message || 'Failed to register store account.');
          return;
        }

        if (data.user) {
          setSuccessMsg('Account registered successfully! Logging you in...');
          setTimeout(() => {
            onLoginSuccess();
          }, 1000);
        } else {
          setError('Registration pending confirmation.');
        }
      } else {
        // STRICT Supabase Login Authentication
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        setLoading(false);

        if (authError) {
          setError(`Authentication Failed: ${authError.message}`);
          return;
        }

        if (data.session || data.user) {
          onLoginSuccess();
        } else {
          setError('Invalid login credentials. Please try again or click Register.');
        }
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Authentication service error.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { user, error: gError } = await signInWithGoogle();
      setLoading(false);
      if (user) {
        onLoginSuccess();
      } else if (gError) {
        setError(`Google Auth Error: ${gError}`);
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Google Auth Error');
    }
  };

  /* ─── SCREEN 1: LANDING / ONBOARDING ─── */
  if (step === 'landing') {
    return (
      <div className="bg-[#f9f9f9] min-h-screen px-6 pt-10 pb-10 flex flex-col justify-between font-sans">
        <div>
          {/* Top Logo */}
          <div className="flex items-center gap-2 mb-6">
            <Store className="w-6 h-6 text-[#7a6000]" />
            <span className="text-xl font-black text-[#7a6000] tracking-tight">CartCraze Partner</span>
          </div>

          {/* Slogan & Subheading */}
          <div className="mb-6">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-[1.1] mb-4">
              Grow Your<br />Business with<br />CartCraze
            </h1>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Join our network of premium retail partners and reach thousands of customers in minutes.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="space-y-3 mb-6">
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
              <div className="w-10 h-10 bg-[#ffc800] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <TrendingUp className="w-5 h-5 text-gray-900 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Boost Daily Sales</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
                  Access a massive local customer base looking for fast delivery.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
              <div className="w-10 h-10 bg-[#ffc800] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <Box className="w-5 h-5 text-gray-900 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Efficient Inventory Tools</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
                  Manage your stock seamlessly with our dedicated partner app.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-start gap-3.5">
              <div className="w-10 h-10 bg-[#ffc800] rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <BarChart3 className="w-5 h-5 text-gray-900 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Real-time Analytics</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mt-0.5">
                  Track performance and optimize your operations with live data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              setIsRegisterMode(true);
              setStep('login');
            }}
            className="w-full bg-[#ffc800] hover:bg-[#ebd000] active:scale-[0.98] text-gray-900 font-black text-sm py-4 rounded-full shadow-md shadow-[#ffc800]/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Register New Partner Store</span>
          </button>

          <button
            onClick={() => {
              setIsRegisterMode(false);
              setStep('login');
            }}
            className="w-full bg-[#181d24] hover:bg-black active:scale-[0.98] text-white font-black text-sm py-4 rounded-full transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Existing Store</span>
          </button>

          <p className="text-[11px] text-center text-gray-500 font-medium leading-relaxed pt-1">
            By joining, you agree to our{' '}
            <a href="#terms" className="underline font-bold text-gray-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#privacy" className="underline font-bold text-gray-700">Privacy Policy</a>.
          </p>
        </div>
      </div>
    );
  }

  /* ─── SCREEN 2: STORE MANAGER LOGIN ─── */
  return (
    <div className="bg-[#f9f9f9] min-h-screen font-sans pb-10 flex flex-col justify-between">
      {/* Top Header */}
      <div className="bg-white px-6 pt-6 pb-4 flex items-center justify-center border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-[#7a6000]" />
          <span className="text-xl font-black text-[#7a6000] tracking-tight">CartCraze Partner</span>
        </div>
      </div>

      {/* Main Login Container */}
      <div className="flex-1 px-5 pt-6 pb-6 flex flex-col justify-between">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          {/* Top Yellow Circle Icon */}
          <div className="w-14 h-14 bg-[#ffc800] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#ffc800]/30">
            <Store className="w-7 h-7 text-gray-900 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 text-center tracking-tight mb-1">
            {isRegisterMode ? 'Register New Store Account' : 'Store Manager Login'}
          </h2>
          <p className="text-xs text-gray-500 font-medium text-center leading-relaxed mb-5">
            {isRegisterMode
              ? 'Create your Supabase store credentials to join CartCraze.'
              : 'Access your darkstore dashboard with Supabase Auth.'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold px-4 py-3 rounded-2xl mb-4 text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-3 rounded-2xl mb-4 text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input 1: Store ID or Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Store ID or Email</label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-3 focus-within:border-[#ffc800] transition">
                <input
                  type="text"
                  value={storeId}
                  onChange={e => setStoreId(e.target.value)}
                  placeholder="e.g. store14@cartcraze.com or DS-14"
                  className="w-full bg-transparent text-xs font-bold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Password</label>
              </div>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-3 focus-within:border-[#ffc800] transition">
                <Lock className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-transparent text-xs font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 ml-2 shrink-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ffc800] hover:bg-[#ebd000] active:scale-[0.98] text-gray-900 font-black text-sm py-4 rounded-full shadow-md shadow-[#ffc800]/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>
                {loading
                  ? 'Authenticating with Supabase...'
                  : isRegisterMode
                  ? 'Create Store Account & Enter'
                  : 'Login with Supabase Auth'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Toggle Register vs Login */}
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setError('');
                setIsRegisterMode(!isRegisterMode);
              }}
              className="text-xs font-bold text-[#7a6000] hover:underline cursor-pointer"
            >
              {isRegisterMode
                ? 'Already have an account? Login here'
                : "Don't have a store account? Register here"}
            </button>
          </div>

          {/* Social Sign-In with Google */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
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
        </div>

        {/* Footer Support Links */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-gray-500 font-medium">Need help accessing your account?</p>
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#7a6000]">
            <a href="#support" className="flex items-center gap-1 hover:underline">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Partner Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
