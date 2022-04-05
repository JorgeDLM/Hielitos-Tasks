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
  apiKey: "AIzaSyAO_etBlded9K8zK42-Vk2NJ0AbRPHjY9Y",
  authDomain: "mercado-libre-65ada.firebaseapp.com",
  projectId: "mercado-libre-65ada",
  storageBucket: "mercado-libre-65ada.appspot.com",
  messagingSenderId: "589897391123",
  appId: "1:589897391123:web:b8240eeb93c1d11d63f3e6",
  measurementId: "G-KGVDN7BTM1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)