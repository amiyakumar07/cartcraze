import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA32Q0rN71YkZmRIs9Th3TmajNZbzDwvTQ",
  authDomain: "cartcraze-user.firebaseapp.com",
  projectId: "cartcraze-user",
  storageBucket: "cartcraze-user.firebasestorage.app",
  messagingSenderId: "438473527527",
  appId: "1:438473527527:android:372b2b194523172444d242",
  measurementId: "G-P8T10Z4124"
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
