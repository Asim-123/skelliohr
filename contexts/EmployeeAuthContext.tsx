'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword as firebaseUpdatePassword,
  getAuth,
} from 'firebase/auth';
import { hrAuth } from '@/lib/firebase-hr';

interface EmployeeUser {
  uid: string;
  email: string | null;
  employeeId: string;
  firstName: string;
  lastName: string;
  department: string;
  position: string;
  companyId: string;
  _id: string;
  passwordChanged: boolean;
}

interface EmployeeAuthContextType {
  user: EmployeeUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  updatePassword: async () => {},
});

export const useEmployeeAuth = () => useContext(EmployeeAuthContext);

// Helper function to wait for Firebase current user
const waitForCurrentUser = (maxWaitTime = 5000): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    let resolved = false;
    
    // Set a timeout in case auth state never resolves
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        unsubscribe();
        resolve(hrAuth.currentUser);
      }
    }, maxWaitTime);
    
    const unsubscribe = onAuthStateChanged(hrAuth, (user) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        unsubscribe();
        resolve(user);
      }
    });
  });
};

export const EmployeeAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<EmployeeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [syncRetries, setSyncRetries] = useState(0);

  // Sync employee data with retry logic
  const syncEmployeeData = async (fbUser: FirebaseUser, retryCount = 0) => {
    try {
      const response = await fetch('/api/employee/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: fbUser.uid,
          email: fbUser.email,
        }),
      });

      const data = await response.json();

      if (data.success && data.employee) {
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          employeeId: data.employee.employeeId,
          firstName: data.employee.firstName,
          lastName: data.employee.lastName,
          department: data.employee.department,
          position: data.employee.position,
          companyId: data.employee.companyId,
          _id: data.employee._id,
          passwordChanged: data.employee.passwordChanged || false,
        });
        setSyncRetries(0);
        return true;
      } else {
        console.error('Sync failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error syncing employee data:', error);
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Retrying sync in ${delay}ms... (attempt ${retryCount + 1}/3)`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return syncEmployeeData(fbUser, retryCount + 1);
      }
      
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(hrAuth, async (fbUser: FirebaseUser | null) => {
      setFirebaseUser(fbUser); // Store the Firebase user
      
      if (fbUser) {
        // Keep loading true while syncing
        const syncSuccess = await syncEmployeeData(fbUser);
        
        if (!syncSuccess) {
          // If sync fails after retries, try to load from localStorage as fallback
          const cachedUser = localStorage.getItem('employee_user_cache');
          if (cachedUser) {
            try {
              const parsedUser = JSON.parse(cachedUser);
              if (parsedUser.uid === fbUser.uid) {
                console.log('Using cached user data');
                setUser(parsedUser);
              }
            } catch (e) {
              console.error('Error parsing cached user:', e);
            }
          }
        } else {
          // Cache user data on successful sync
          if (user) {
            localStorage.setItem('employee_user_cache', JSON.stringify(user));
          }
        }
      } else {
        setUser(null);
        setFirebaseUser(null);
        localStorage.removeItem('employee_user_cache');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update cache when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('employee_user_cache', JSON.stringify(user));
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(hrAuth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(hrAuth);
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // If we don't have a Firebase user but we have context user,
      // use Firebase REST API to update password instead
      if (!firebaseUser && !hrAuth.currentUser && user) {
        
        // Use Firebase REST API to update password
        const response = await fetch('/api/employee/update-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            newPassword: newPassword,
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to update password');
        }
        
        // Update local user state
        setUser({ ...user, passwordChanged: true });
        return;
      }
      
      // Use the stored firebaseUser from state instead of hrAuth.currentUser
      const currentUser = firebaseUser || hrAuth.currentUser;
      
      if (!currentUser) {
        const waitedUser = await waitForCurrentUser();
        
        if (!waitedUser && user) {
          // Last resort: use REST API
          const response = await fetch('/api/employee/update-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              newPassword: newPassword,
            }),
          });
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error || 'Failed to update password');
          }
          
          setUser({ ...user, passwordChanged: true });
          return;
        }
        
        if (!waitedUser) {
          throw new Error('No user logged in. Please try logging in again.');
        }
        
        // Use the waited user
        await firebaseUpdatePassword(waitedUser, newPassword);
        
        // Mark password as changed in database
        const dbResponse = await fetch('/api/employee/mark-password-changed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firebaseUid: waitedUser.uid }),
        });
        
        const dbData = await dbResponse.json();
        
        if (!dbData.success) {
          throw new Error(dbData.error || 'Failed to update password status in database');
        }
        
        // Update local user state
        if (user) {
          setUser({ ...user, passwordChanged: true });
        }
        return;
      }
      
      // Update password in Firebase
      await firebaseUpdatePassword(currentUser, newPassword);
      
      // Mark password as changed in database
      const response = await fetch('/api/employee/mark-password-changed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: currentUser.uid }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update password status in database');
      }
      
      // Update local user state
      if (user) {
        setUser({ ...user, passwordChanged: true });
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      throw new Error(error.message || 'Failed to update password');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    updatePassword,
  };

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  );
};
