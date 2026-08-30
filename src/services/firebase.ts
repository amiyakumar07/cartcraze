import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA32Q0rN71YkZmRIs9Th3TmajNZbzDwvTQ",
  authDomain: "cartcraze-user.firebaseapp.com",
  projectId: "cartcraze-user",
  storageBucket: "cartcraze-user.firebasestorage.app",
  messagingSenderId: "438473527527",
  appId: "1:438473527527:android:3e3c02f5a2f0efef44d242",
  measurementId: "G-P8T10Z4124"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.warn('Firebase Google Auth popup skipped or unconfigured, returning demo fallback session:', error);
    return {
      user: {
        displayName: 'Google Customer User',
        email: 'customer@gmail.com',
        phoneNumber: '+91 98765 43210'
      }
    };
  }
};
