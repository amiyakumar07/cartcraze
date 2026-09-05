import React, { type FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Mail, Lock, Bike } from 'lucide-react';
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface Props {
  onGoogleLogin?: () => void;
  onEmailLogin?: (email: string, pass: string, isRegister: boolean) => void;
  onBackToLanding?: () => void;
}

export const FreshCartRiderLogin: React.FC<Props> = ({
  onGoogleLogin,
  onEmailLogin,
  onBackToLanding
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onEmailLogin) {
      onEmailLogin(email || "rider@cartcraze.app", password || "password123", isRegisterMode);
    }
  };

  const inputClass = "w-full bg-fleet-900 border border-fleet-700 rounded-xl px-4 py-3.5 text-sm font-semibold text-fleet-100 placeholder:text-fleet-600 focus:outline-none focus:border-amber-500 transition";
  const labelClass = "text-xs font-bold text-fleet-400 uppercase tracking-wider mb-2 block";

  return (
    <div className="min-h-full bg-fleet-950 text-fleet-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <Card variant="elevated" className="w-full max-w-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

        <div className="relative">
          {onBackToLanding && (
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-xs font-bold text-fleet-500 hover:text-fleet-300 transition mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <Bike className="w-8 h-8 text-fleet-950" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">CartCraze</h1>
            <p className="text-sm text-fleet-500 mt-1">Rider Partner Portal</p>
          </div>

          <h2 className="text-lg font-bold text-fleet-100 text-center mb-1">
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-fleet-500 text-center mb-6">
            Earn up to ₹35,000/mo delivering instant groceries
          </p>

          {/* Mode Toggle */}
          <div className="flex bg-fleet-900 rounded-xl p-1 mb-6 border border-fleet-800">
            <button
              type="button"
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isRegisterMode ? 'bg-fleet-800 text-fleet-100 shadow-sm' : 'text-fleet-500'
              }`}
              onClick={() => setIsRegisterMode(false)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isRegisterMode ? 'bg-fleet-800 text-fleet-100 shadow-sm' : 'text-fleet-500'
              }`}
              onClick={() => setIsRegisterMode(true)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fleet-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@cartcraze.app"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-fleet-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <Button variant="primary" fullWidth type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {isRegisterMode ? 'Register as Rider' : 'Sign In'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-fleet-800" />
            <span className="text-[10px] font-bold text-fleet-600 uppercase">Or</span>
            <div className="flex-1 h-px bg-fleet-800" />
          </div>

          <Button 
            variant="secondary" 
            fullWidth 
            onClick={onGoogleLogin}
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.73 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.73 17.57C14.74 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.81 14.08H2.13V16.94C3.96 20.57 7.69 23 12 23Z" fill="#34A853" />
                <path d="M5.81 14.08C5.58 13.39 5.45 12.66 5.45 11.91C5.45 11.16 5.58 10.43 5.81 9.74V6.88H2.13C1.38 8.38 0.95 10.09 0.95 11.91C0.95 13.73 1.38 15.44 2.13 16.94L5.81 14.08Z" fill="#FBBC05" />
                <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.38 3.86C17.45 2.06 14.96 0.95 12 0.95C7.69 0.95 3.96 3.38 2.13 7.02L5.81 9.88C6.7 7.27 9.13 5.38 12 5.38Z" fill="#EA4335" />
              </svg>
            }
          >
            Continue with Google
          </Button>

          <p className="text-[10px] text-fleet-600 text-center mt-6 leading-relaxed">
            Protected by CartCraze Security. By signing in, you agree to our Terms and Partner Policy.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FreshCartRiderLogin;
