import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';

interface AuthContextType {
  user: User | null;
  login: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userData: User;
          
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          } else {
            // Register new user
            userData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              role: firebaseUser.email === 'sh2305895@gmail.com' ? 'admin' : 'customer'
            };
            await setDoc(userDocRef, userData);
          }
          
          setUser(userData);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error('Login failed');
      }
      return false;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the profile display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Create the user document manually here with phone number included
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userData: User = {
        id: userCredential.user.uid,
        name: name,
        email: email,
        phone: phone || '', // Ensure phone is a string even if not provided
        role: email === 'sh2305895@gmail.com' ? 'admin' : 'customer'
      };
      
      await setDoc(userDocRef, userData);
      setUser(userData);
      
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email is already registered');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else if (error.code === 'permission-denied') {
        // Fallback for permission errors during user doc creation
        toast.success('Registered successfully, but could not save profile details.');
        return true;
      } else {
        toast.error('Registration failed: ' + error.message);
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithEmail, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
