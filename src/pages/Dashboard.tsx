import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, User as UserIcon, Settings, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { orders } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'settings'>('orders');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const userOrders = orders.filter(o => o.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-black mr-6">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hello, {user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
          >
            <LogOut size={18} className="mr-2" /> Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 sticky top-28">
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package size={20} className="mr-3" /> My Orders
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <UserIcon size={20} className="mr-3" /> Profile Details
                </button>
                <Link to="/wishlist" className="w-full flex items-center px-4 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Heart size={20} className="mr-3" /> My Wishlist
                </Link>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Settings size={20} className="mr-3" /> Account Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Order History</h2>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-50">
                          <div>
                            <span className="font-bold text-gray-900 block">Order #{order.id}</span>
                            <span className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                            <span className="font-black text-lg text-gray-900">৳{order.total.toLocaleString()}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-lg">
                              <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                              <div>
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Profile Details</h2>
                <form className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" defaultValue={user.phone} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <button type="button" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Account Settings</h2>
                <div className="max-w-xl space-y-8">
                  <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <button type="button" onClick={() => alert("Password functionality is a placeholder in this demo.")} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition-colors">
                        Update Password
                      </button>
                    </form>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <button type="button" onClick={() => alert("Account deletion is disabled in this demo.")} className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-xl font-bold hover:bg-red-100 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
