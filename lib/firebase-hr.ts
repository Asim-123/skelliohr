import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';

const firebaseHRConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_HR_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_HR_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_HR_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_HR_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_HR_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_HR_APP_ID,
};

let hrApp: FirebaseApp;
let hrAuth: Auth;

// Initialize Firebase app
if (!getApps().length) {
  hrApp = initializeApp(firebaseHRConfig, 'hr-system');
} else {
  hrApp = getApps().find(app => app.name === 'hr-system') || getApps()[0];
}

hrAuth = getAuth(hrApp);

// Set persistence to LOCAL immediately and synchronously if possible
// This ensures auth state persists across page reloads
if (typeof window !== 'undefined') {
  setPersistence(hrAuth, browserLocalPersistence).catch((error) => {
    console.error('Error setting Firebase persistence:', error);
  });
}

export { hrApp, hrAuth };
