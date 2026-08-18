import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, Order, User, Review } from '../types';
import toast from 'react-hot-toast';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseErrors';
import { useAuth } from './AuthContext';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  reviews: Review[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addReview: (review: Omit<Review, 'id' | 'status' | 'date'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Listen to Products
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(d => d.data() as Product));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));
    return () => unsub();
  }, []);

  // Listen to Categories
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(d => d.data() as Category));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));
    return () => unsub();
  }, []);

  // Listen to Orders
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const q = user.role === 'admin' 
      ? collection(db, 'orders') 
      : query(collection(db, 'orders'), where('userId', '==', user.id));
      
    const unsub = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(d => d.data() as Order));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));
    return () => unsub();
  }, [user]);

  // Listen to Users (Admin only)
  useEffect(() => {
    if (user?.role !== 'admin') {
      setUsers([]);
      return;
    }
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(d => d.data() as User));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
    return () => unsub();
  }, [user]);

  // Listen to Reviews
  useEffect(() => {
    const q = user?.role === 'admin'
      ? collection(db, 'reviews')
      : query(collection(db, 'reviews'), where('status', '==', 'Approved'));

    const unsub = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(d => d.data() as Review));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'reviews'));
    return () => unsub();
  }, [user]);

  const addProduct = async (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    try {
      const id = `p${Date.now()}`;
      const newProduct: Product = { ...product, id, rating: 0, reviews: 0, featured: product.featured || false };
      await setDoc(doc(db, 'products', id), newProduct);
      toast.success('Product added successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { ...product });
      toast.success('Product updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${product.id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const id = `c${Date.now()}`;
      const newCategory: Category = { ...category, id };
      await setDoc(doc(db, 'categories', id), newCategory);
      toast.success('Category added successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'date'>) => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      ...order,
      id: orderId,
      date: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      return newOrder;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'status' | 'date'>) => {
    try {
      const id = `r${Date.now()}`;
      const newReview: Review = { ...review, id, status: 'Pending', date: new Date().toISOString() };
      await setDoc(doc(db, 'reviews', id), newReview);
      toast.success('Review submitted for approval!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    }
  };

  const approveReview = async (id: string) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status: 'Approved' });
      toast.success('Review approved!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reviews/${id}`);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
      toast.success('Review deleted!');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `reviews/${id}`);
    }
  };

  return (
    <StoreContext.Provider value={{
      products, categories, orders, users, reviews,
      addProduct, updateProduct, deleteProduct,
      addCategory, deleteCategory,
      addOrder, updateOrderStatus,
      addReview, approveReview, deleteReview
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
