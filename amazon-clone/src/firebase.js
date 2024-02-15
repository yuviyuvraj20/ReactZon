// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBWJODWC4IDrft_iO5LfFdCE5M6ndNXGfI",
    authDomain: "clone-46091.firebaseapp.com",
    projectId: "clone-46091",
    storageBucket: "clone-46091.appspot.com",
    messagingSenderId: "513806497166",
    appId: "1:513806497166:web:303cd1272df14c0cb4e0df",
    measurementId: "G-DJCJ3TE79M"
  };
  const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
export {db};