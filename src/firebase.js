import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB8iRX_jGS6UPsih2a7eExWzL8Ai4k9pbg",
    authDomain: "chatapp-500be.firebaseapp.com",
    projectId: "chatapp-500be",
    storageBucket: "chatapp-500be.firebasestorage.app",
    messagingSenderId: "781310497517",
    appId: "1:781310497517:web:1b752f96ee990a557df2e4",
    measurementId: "G-ZZTS3GP0MM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (err) {
    console.error(err);
  }
};

export { auth, db, signInWithGoogle };