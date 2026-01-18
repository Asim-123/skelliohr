'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { hrAuth } from '@/lib/firebase-hr';

interface HRUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: 'hr_admin' | 'hr_manager' | 'hr_staff';
  companyId?: string;
}

interface HRAuthContextType {
  user: HRUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string, companyId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const HRAuthContext = createContext<HRAuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useHRAuth = () => useContext(HRAuthContext);

export const HRAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<HRUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync HR user data with retry logic
  const syncHRUserData = async (firebaseUser: FirebaseUser, retryCount = 0): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const hrUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: data.user?.displayName || firebaseUser.email?.split('@')[0] || null,
          role: data.user?.role || 'hr_staff' as 'hr_admin' | 'hr_manager' | 'hr_staff',
          companyId: data.user?.companyId,
        };
        setUser(hrUser);
        return true;
      } else {
        console.error('Failed to sync user:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error syncing HR user:', error);
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Retrying HR sync in ${delay}ms... (attempt ${retryCount + 1}/3)`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return syncHRUserData(firebaseUser, retryCount + 1);
      }
      
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(hrAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const syncSuccess = await syncHRUserData(firebaseUser);
        
        if (!syncSuccess) {
          // If sync fails after retries, try to load from localStorage as fallback
          const cachedUser = localStorage.getItem('hr_user_cache');
          if (cachedUser) {
            try {
              const parsedUser = JSON.parse(cachedUser);
              if (parsedUser.uid === firebaseUser.uid) {
                console.log('Using cached HR user data');
                setUser(parsedUser);
              }
            } catch (e) {
              console.error('Error parsing cached HR user:', e);
            }
          }
        } else {
          // Cache user data on successful sync
          if (user) {
            localStorage.setItem('hr_user_cache', JSON.stringify(user));
          }
        }
      } else {
        setUser(null);
        localStorage.removeItem('hr_user_cache');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update cache when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('hr_user_cache', JSON.stringify(user));
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(hrAuth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(hrAuth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, companyId: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(hrAuth, email, password);
      
      // Create HR user in database
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName,
          companyId,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create HR user');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(hrAuth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <HRAuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signUp, signOut }}>
      {children}
    </HRAuthContext.Provider>
  );
};
