import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode === 'DISCOUNT10') {
      setDiscount(cartSubtotal * 0.1);
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
      setDiscount(0);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added anything to your cart yet. Let's get you some fresh kicks.</p>
        <Link to="/shop" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-colors flex items-center shadow-lg shadow-orange-600/30">
          Start Shopping <ArrowRight size={20} className="ml-2" />
        </Link>
      </div>
    );
  }

  const shippingFee = 100; // Flat rate
  const finalTotal = cartSubtotal - discount + shippingFee;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-1 text-right"></div>
              </div>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 last:border-0 last:pb-0">
                    
                    {/* Product Info */}
                    <div className="col-span-6 w-full flex items-center">
                      <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-gray-50 mr-4" />
                      <div className="flex-1">
                        <Link to={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">{item.name}</Link>
                        <p className="text-sm text-gray-500 mt-1">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        <p className="text-sm font-bold text-orange-600 mt-1 sm:hidden">৳{(item.discountPrice || item.price).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-3 w-full flex justify-between sm:justify-center items-center mt-4 sm:mt-0">
                      <span className="text-sm text-gray-500 sm:hidden">Quantity:</span>
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="col-span-2 hidden sm:block text-right font-bold text-gray-900">
                      ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                    
                    {/* Remove */}
                    <div className="col-span-1 text-right mt-4 sm:mt-0 absolute top-4 right-4 sm:static">
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-gray-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-bold">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Shipping</span>
                  <span className="font-bold text-gray-900">৳{shippingFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="h-px bg-gray-100 w-full mb-6"></div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-orange-600">৳{finalTotal.toLocaleString()}</span>
              </div>
              
              <form onSubmit={handleApplyCoupon} className="mb-8 flex gap-2">
                <input 
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 uppercase"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </form>
              
              <button 
                onClick={() => navigate('/checkout', { state: { discount, shippingFee, finalTotal } })}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors flex items-center justify-center shadow-lg shadow-orange-600/30"
              >
                Proceed to Checkout <ArrowRight size={20} className="ml-2" />
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm text-gray-500 hover:text-orange-600 font-medium">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Cart;
