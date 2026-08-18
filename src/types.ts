export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

export interface CartItem extends Product {
  cartItemId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    name: string;
    phone: string;
    division: string;
    district: string;
    upazila: string;
    address: string;
  };
  paymentMethod: string;
  paymentDetails?: {
    senderNumber?: string;
    trxId?: string;
  };
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Pending Verification' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Pending' | 'Approved';
}
