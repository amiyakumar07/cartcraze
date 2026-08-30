import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYOW5zjKdUQ65Fqf0-06qsfZQa44OREVQ",
  authDomain: "quicksmarts.firebaseapp.com",
  projectId: "quicksmarts",
  storageBucket: "quicksmarts.firebasestorage.app",
  messagingSenderId: "724081937412",
  appId: "1:724081937412:web:f5cfc8f639537de65fb951",
  measurementId: "G-Q586WWPTRD"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutFirebase = async () => {
  await signOut(auth);
};
