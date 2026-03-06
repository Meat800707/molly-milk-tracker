const firebaseConfig = {
  apiKey: "AIzaSyCF2l0CjfSajeBqyOFAQmW5gpZyAlelNCI",
  authDomain: "molly-milk.firebaseapp.com",
  projectId: "molly-milk",
  storageBucket: "molly-milk.firebasestorage.app",
  messagingSenderId: "512902247574",
  appId: "1:512902247574:web:4ee65d7e36e952e477beb7",
  measurementId: "G-XFPFF891VG"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();