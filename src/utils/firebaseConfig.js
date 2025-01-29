/* ************************************/
/* Connexion aux services de Firebase */
/* ************************************/
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyA6D9V69AsdySjhnbFrDlYfKpLF1xWC8jQ',
    authDomain: 'dashboard-v3-f39d5.firebaseapp.com',
    projectId: 'dashboard-v3-f39d5',
    storageBucket: 'dashboard-v3-f39d5.firebasestorage.app',
    messagingSenderId: '813089160404',
    appId: '1:813089160404:web:1c8fe67ee23bc25e4d4f41',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };