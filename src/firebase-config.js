// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "@firebase/auth"


// CREDENCIALES DE PRUEBASs
const firebaseConfig = {
  apiKey: "AIzaSyCsRRa53MPjVGoYkwaPVzBslb1FNVl95eA",
  authDomain: "hielitos---tasks.firebaseapp.com",
  projectId: "hielitos---tasks",
  storageBucket: "hielitos---tasks.appspot.com",
  messagingSenderId: "725085689661",
  appId: "1:725085689661:web:f766a396c2b3eb270b1754"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)