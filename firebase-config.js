// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEOTj1avbjprOB0ufqhD_Wtdw98SXlw8g",
  authDomain: "aplikasi-tabungan-6dc68.firebaseapp.com",
  projectId: "aplikasi-tabungan-6dc68",
  storageBucket: "aplikasi-tabungan-6dc68.firebasestorage.app",
  messagingSenderId: "853781990973",
  appId: "1:853781990973:web:b92554d43c54ce92a66454",
  measurementId: "G-D91HBMMHXH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Get a reference to the firestore service
const db = firebase.firestore();