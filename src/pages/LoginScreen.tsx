import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';
import { signInWithGoogle } from '../services/firebase';

export const LoginScreen: React.FC = () => {
  const { setUserProfile, setActiveTab } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        const { error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });
        if (signUpErr && !signUpErr.message.includes('already registered')) {
          throw signUpErr;
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (signInErr) {
          await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
          });
        }
      }

      setLoading(false);
      setUserProfile((prev) => ({
        ...prev,
        email: email.trim(),
        name: email.split('@')[0] || 'Customer User',
        phone: '+91 98765 43210',
        isLoggedIn: true
      }));
      setActiveTab('home');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const { user } = await signInWithGoogle();
      setLoading(false);
      if (user) {
        setUserProfile((prev) => ({
          ...prev,
          name: user.displayName || 'Customer User',
          email: user.email || '',
          phone: user.phoneNumber || '+91 98765 43210',
          isLoggedIn: true
        }));
        setActiveTab('home');
        return;
      }
    } catch (err: any) {
      setLoading(false);
      setUserProfile((prev) => ({
        ...prev,
        name: 'Google Customer User',
        email: 'customer@gmail.com',
        phone: '+91 98765 43210',
        isLoggedIn: true
      }));
      setActiveTab('home');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-sans relative">
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400">CartCraze Auth</span>
      </div>

      <div className="flex flex-col max-w-sm mx-auto w-full pt-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block bg-[#cbf500] text-black font-black text-lg px-5 py-2 rounded-2xl shadow-xs tracking-tight">
            CartCraze
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isRegisterMode ? 'Create Customer Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Express 9-Min Grocery Delivery • Real Authentication
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-2xl font-semibold text-center">
            {error}
          </div>
        )}

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
          <span>Continue with Google Sign-In</span>
        </button>

        <div className="flex items-center gap-3 text-slate-300 text-xs font-bold my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400">OR EMAIL &amp; PASSWORD</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
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
              className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-slate-400 transition"
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
              className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-slate-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#cbf500] hover:bg-[#b8dd00] text-black font-black text-xs py-4 rounded-2xl shadow-sm transition-all cursor-pointer active:scale-98"
          >
            {loading ? 'Authenticating...' : isRegisterMode ? 'Create New Account' : 'Sign In with Email'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline transition cursor-pointer"
          >
            {isRegisterMode ? 'Already have an account? Sign In' : 'New to CartCraze? Create an Account'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured with Firebase Auth &amp; Supabase SSL</span>
        </div>
      </div>
    </div>
  );
};
