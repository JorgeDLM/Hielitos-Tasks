// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "@firebase/auth"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD_gSBFBxj_UoaSEGaMDYuh1eW6crhQHQU",
  authDomain: "mercado-libre-2.firebaseapp.com",
  projectId: "mercado-libre-2",
  storageBucket: "mercado-libre-2.appspot.com",
  messagingSenderId: "285091232336",
  appId: "1:285091232336:web:d8d49c0e1e2b0217bdef55",
  measurementId: "G-9KLQGYCFZJ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)