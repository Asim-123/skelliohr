import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

// Initialize Firebase Admin
if (!getApps().length) {
  // For production, you should use service account credentials
  // For now, we'll use the Firebase client config
  // Note: In production, add FIREBASE_ADMIN_SERVICE_ACCOUNT to .env
  
  try {
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_HR_PROJECT_ID,
    }, 'admin-hr');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export { adminApp };
