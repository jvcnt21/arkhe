// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyinukt7MjXMKB-PHtSFt5CU88Onhd8mI",
  authDomain: "arkhe-6f247.firebaseapp.com",
  projectId: "arkhe-6f247",
  storageBucket: "arkhe-6f247.firebasestorage.app",
  messagingSenderId: "941813835266",
  appId: "1:941813835266:web:5d24a652dfbb29d496291b",
  measurementId: "G-5XVEBW9DZR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize and get Auth service
export { auth }; // Export auth