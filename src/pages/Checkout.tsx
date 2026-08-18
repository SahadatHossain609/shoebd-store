import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Truck, CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import toast from 'react-hot-toast';

// -------------------------------------------------------------
// UPDATE YOUR PAYMENT NUMBERS HERE
// -------------------------------------------------------------
const PAYMENT_NUMBERS = {
  bKash: '01873477802',
  Nagad: '01873477802',
  Rocket: '01873477802'
};
// -------------------------------------------------------------

const Checkout = () => {
  const { cart, clearCart, cartSubtotal } = useCart();
  const { user } = useAuth();
  const { addOrder } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { discount = 0, shippingFee = 100, finalTotal = cartSubtotal + 100 } = location.state || {};

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment, 3: Success
  const [orderId, setOrderId] = useState<string | null>(null);

  // Address State
  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    division: '',
    district: '',
    upazila: '',
    address: ''
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'COD' | 'Card'>('COD');
  const [paymentDetails, setPaymentDetails] = useState({
    senderNumber: '',
    trxId: ''
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.division || !address.district || !address.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (['bKash', 'Nagad', 'Rocket'].includes(paymentMethod)) {
      if (!paymentDetails.senderNumber || !paymentDetails.trxId) {
        toast.error('Please enter Sender Number and Transaction ID');
        return;
      }
    }

    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    try {
      // Place Order
      const status = paymentMethod === 'COD' ? 'Processing' : 'Pending Verification';
      
      const newOrder = await addOrder({
        userId: user.id,
        items: cart,
        shippingAddress: address,
        paymentMethod,
        paymentDetails: paymentMethod !== 'COD' ? paymentDetails : undefined,
        subtotal: cartSubtotal,
        shippingFee,
        discount,
        total: finalTotal,
        status
      });

      setOrderId(newOrder.id);
      clearCart();
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
        <div className="bg-white px-6 py-3 rounded-lg border border-gray-200 mb-8 font-mono text-lg font-bold text-gray-800">
          Order ID: {orderId}
        </div>
        <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
          We have received your order. {paymentMethod !== 'COD' ? 'We will verify your payment shortly.' : 'You will pay upon delivery.'} You can track your order status in your account dashboard.
        </p>
        <div className="flex gap-4">
          <Link to="/shop" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
          {user && (
            <Link to="/dashboard" className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              View Dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="flex-1">
            
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                  <Truck className="text-orange-600 mr-3" size={24} />
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Address</h2>
                </div>
                
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input 
                        type="text" required
                        value={address.name} onChange={e => setAddress({...address, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                      <input 
                        type="tel" required
                        value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Division *</label>
                      <select 
                        required value={address.division} onChange={e => setAddress({...address, division: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                      >
                        <option value="">Select Division</option>
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chattogram">Chattogram</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">District *</label>
                      <input 
                        type="text" required
                        value={address.district} onChange={e => setAddress({...address, district: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Address (Street, House/Apt) *</label>
                    <textarea 
                      required rows={3}
                      value={address.address} onChange={e => setAddress({...address, address: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <Link to="/cart" className="text-gray-500 hover:text-gray-900 font-medium flex items-center">
                      <ArrowLeft size={18} className="mr-2" /> Return to Cart
                    </Link>
                    <button type="submit" className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                  <CreditCard className="text-orange-600 mr-3" size={24} />
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Payment Method</h2>
                </div>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  
                  {/* Payment Options */}
                  <div className="space-y-4">
                    {/* bKash */}
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}>
                      <div className="flex items-center">
                        <input 
                          type="radio" name="payment" value="bKash" 
                          checked={paymentMethod === 'bKash'} onChange={() => setPaymentMethod('bKash')}
                          className="w-5 h-5 text-pink-600 accent-pink-600"
                        />
                        <span className="ml-4 font-bold text-gray-900">bKash</span>
                      </div>
                      {paymentMethod === 'bKash' && (
                        <div className="mt-4 pl-9 space-y-4">
                          <p className="text-sm text-gray-600">Please send <strong>৳{finalTotal}</strong> to our merchant number: <strong className="text-pink-600">{PAYMENT_NUMBERS.bKash}</strong></p>
                          <input 
                            type="text" placeholder="Your bKash Number" required
                            value={paymentDetails.senderNumber} onChange={e => setPaymentDetails({...paymentDetails, senderNumber: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                          />
                          <input 
                            type="text" placeholder="Transaction ID (TrxID)" required
                            value={paymentDetails.trxId} onChange={e => setPaymentDetails({...paymentDetails, trxId: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      )}
                    </label>

                    {/* Nagad */}
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                      <div className="flex items-center">
                        <input 
                          type="radio" name="payment" value="Nagad" 
                          checked={paymentMethod === 'Nagad'} onChange={() => setPaymentMethod('Nagad')}
                          className="w-5 h-5 text-orange-600 accent-orange-600"
                        />
                        <span className="ml-4 font-bold text-gray-900">Nagad</span>
                      </div>
                      {paymentMethod === 'Nagad' && (
                        <div className="mt-4 pl-9 space-y-4">
                          <p className="text-sm text-gray-600">Please send <strong>৳{finalTotal}</strong> to our merchant number: <strong className="text-orange-600">{PAYMENT_NUMBERS.Nagad}</strong></p>
                          <input 
                            type="text" placeholder="Your Nagad Number" required
                            value={paymentDetails.senderNumber} onChange={e => setPaymentDetails({...paymentDetails, senderNumber: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                          <input 
                            type="text" placeholder="Transaction ID (TrxID)" required
                            value={paymentDetails.trxId} onChange={e => setPaymentDetails({...paymentDetails, trxId: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      )}
                    </label>

                    {/* Rocket */}
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'Rocket' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                      <div className="flex items-center">
                        <input 
                          type="radio" name="payment" value="Rocket" 
                          checked={paymentMethod === 'Rocket'} onChange={() => setPaymentMethod('Rocket')}
                          className="w-5 h-5 text-purple-600 accent-purple-600"
                        />
                        <span className="ml-4 font-bold text-gray-900">Rocket</span>
                      </div>
                      {paymentMethod === 'Rocket' && (
                        <div className="mt-4 pl-9 space-y-4">
                          <p className="text-sm text-gray-600">Please send <strong>৳{finalTotal}</strong> to our merchant number: <strong className="text-purple-600">{PAYMENT_NUMBERS.Rocket}</strong></p>
                          <input 
                            type="text" placeholder="Your Rocket Number" required
                            value={paymentDetails.senderNumber} onChange={e => setPaymentDetails({...paymentDetails, senderNumber: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                          <input 
                            type="text" placeholder="Transaction ID (TrxID)" required
                            value={paymentDetails.trxId} onChange={e => setPaymentDetails({...paymentDetails, trxId: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      )}
                    </label>

                    {/* COD */}
                    <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <div className="flex items-center">
                        <input 
                          type="radio" name="payment" value="COD" 
                          checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')}
                          className="w-5 h-5 text-green-600 accent-green-600"
                        />
                        <span className="ml-4 font-bold text-gray-900">Cash on Delivery (COD)</span>
                      </div>
                      {paymentMethod === 'COD' && (
                        <p className="mt-2 pl-9 text-sm text-gray-500">Pay with cash upon delivery.</p>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-900 font-medium flex items-center">
                      <ArrowLeft size={18} className="mr-2" /> Back
                    </button>
                    <button type="submit" className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30 flex items-center">
                      <ShieldCheck size={20} className="mr-2" /> Place Order
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-black text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="relative">
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-50" />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.selectedSize} | {item.selectedColor}</p>
                      <p className="text-sm font-bold text-orange-600">৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="h-px bg-gray-100 w-full mb-4"></div>
              
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-bold">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-bold text-gray-900">৳{shippingFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="h-px bg-gray-100 w-full mb-4"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total to Pay</span>
                <span className="text-2xl font-black text-orange-600">৳{finalTotal.toLocaleString()}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
