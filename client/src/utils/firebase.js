import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-9485e.firebaseapp.com",
  projectId: "interviewiq-9485e",
  storageBucket: "interviewiq-9485e.firebasestorage.app",
  messagingSenderId: "624138917073",
  appId: "1:624138917073:web:290159b6cec94d5a71e1f0",
  measurementId: "G-F5LBFNMTHD"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth, provider}
