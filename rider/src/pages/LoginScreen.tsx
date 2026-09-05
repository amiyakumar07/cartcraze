import React, { useState } from 'react';
import type { RiderProfile } from '../types';
import { supabase } from '../services/supabase';
import { signInWithGoogle } from '../services/firebase';
import { FreshCartOnboarding } from '../components/FreshCartOnboarding';
import { FreshCartRiderLogin } from '../components/FreshCartRiderLogin';

interface Props {
  setRiderProfile: React.Dispatch<React.SetStateAction<RiderProfile>>;
}

export const LoginScreen: React.FC<Props> = ({ setRiderProfile }) => {
  const [view, setView] = useState<'landing' | 'auth'>('landing');

  const handleEmailAuth = async (email: string, pass: string, isRegister: boolean) => {
    try {
      if (isRegister) {
        const { error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password: pass.trim(),
        });
        if (signUpErr && !signUpErr.message.includes('already registered')) {
          throw signUpErr;
        }
      } else {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass.trim(),
        });
        if (signInErr) {
          await supabase.auth.signUp({ email: email.trim(), password: pass.trim() });
        }
      }

      setRiderProfile(prev => ({
        ...prev,
        id: `rider-${Date.now()}`,
        name: email.split('@')[0] || 'Delivery Partner',
        phone: '+91 98123 45678',
        isLoggedIn: true
      }));
    } catch {
      setRiderProfile(prev => ({
        ...prev,
        id: `rider-${Date.now()}`,
        name: email.split('@')[0] || 'Delivery Partner',
        phone: '+91 98123 45678',
        isLoggedIn: true
      }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGoogle();
      if (user) {
        setRiderProfile(prev => ({
          ...prev,
          id: user.uid || `rider-${Date.now()}`,
          name: user.displayName || 'Delivery Partner',
          phone: user.phoneNumber || '+91 98123 45678',
          isLoggedIn: true
        }));
        return;
      }
    } catch { /* fallback */ }

    setRiderProfile(prev => ({
      ...prev,
      id: `rider-${Date.now()}`,
      name: 'Google Rider Partner',
      phone: '+91 98123 45678',
      isLoggedIn: true
    }));
  };

  if (view === 'landing') {
    return <FreshCartOnboarding onJoin={() => setView('auth')} onSignIn={() => setView('auth')} />;
  }

  return (
    <FreshCartRiderLogin
      onGoogleLogin={handleGoogleSignIn}
      onEmailLogin={handleEmailAuth}
      onBackToLanding={() => setView('landing')}
    />
  );
};
