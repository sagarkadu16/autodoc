import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCklDzWvsafDpg2jIc4GiMm9zbm-T8RCIM",
    authDomain: "autodoc-9a334.firebaseapp.com",
    projectId: "autodoc-9a334",
    storageBucket: "autodoc-9a334.appspot.com",
    messagingSenderId: "973075003281",
    appId: "1:973075003281:web:95a5149a4476e0bed2cc30",
    measurementId: "G-F150YMQ7GN"
};

// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    if (error.code === 'app/duplicate-app') {
        // If the app is already initialized, get the existing instance
        app = getApp();
    } else {
        console.error('Error initializing Firebase:', error);
        throw error;
    }
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app; 