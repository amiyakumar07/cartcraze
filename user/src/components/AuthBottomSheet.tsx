import React, { useState } from 'react';
import { User, Phone, CheckCircle, X, LogOut, ArrowRight, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, setUserProfile } = useApp();
  const [phoneInput, setPhoneInput] = useState(userProfile.phone || '');
  const [nameInput, setNameInput] = useState(userProfile.name || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name: nameInput.trim() || 'Amiya Sahoo',
      phone: phoneInput.trim() || '+91 98765 43210'
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn border border-emerald-100">
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

        {userProfile.phone ? (
          /* Logged In View */
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1">
                <div className="font-black text-slate-900 text-base">{userProfile.name || 'Amiya Sahoo'}</div>
                <div className="text-xs text-slate-600 font-semibold">{userProfile.phone}</div>
                <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>CartCraze Verified Customer</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setUserProfile((prev) => ({ ...prev, phone: '', name: '' }));
                setOtpSent(false);
              }}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-red-200 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          </div>
        ) : (
          /* Phone OTP Login Form */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="text-lg font-black text-slate-900">Welcome to CartCraze</div>
              <div className="text-xs text-slate-500 font-medium">Enter your mobile number to order quick commerce essentials</div>
            </div>

            {!otpSent ? (
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
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
                >
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 font-medium flex items-center justify-between">
                  <span>OTP sent to <strong>{phoneInput}</strong></span>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-emerald-700 font-bold underline">Edit</button>
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block mb-1">Enter 4-Digit OTP</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="1234"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-black tracking-widest text-slate-900 focus:outline-none focus:border-emerald-600 text-center"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
                >
                  <span>Verify & Login</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
