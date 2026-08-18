import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';

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
    // Check local storage for persistent login
    const storedUser = localStorage.getItem('ecommerce_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('ecommerce_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async () => {
    toast.error('Google login is disabled for this domain.');
    return false;
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const q = query(
        collection(db, 'users'), 
        where('email', '==', email),
        where('password', '==', password)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data() as User;
        setUser(userData);
        localStorage.setItem('ecommerce_user', JSON.stringify(userData));
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error('Login failed due to network error');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      // Check if email exists
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast.error('Email is already registered');
        return false;
      }

      // Generate a simple unique ID
      const userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      
      const userData = {
        id: userId,
        name: name,
        email: email,
        phone: phone || '',
        password: password, // In a real app this would be hashed, but for this custom auth it's plaintext
        role: email === 'sh2305895@gmail.com' ? 'admin' : 'customer'
      };
      
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, userData);
      
      // Don't save password in the context state
      const userState: User = { ...userData, role: userData.role as 'admin' | 'customer' };
      
      setUser(userState);
      localStorage.setItem('ecommerce_user', JSON.stringify(userState));
      
      toast.success('Registration successful!');
      return true;
    } catch (error: any) {
      console.error('Registration Error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('ecommerce_user');
    toast.success('Logged out successfully');
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
