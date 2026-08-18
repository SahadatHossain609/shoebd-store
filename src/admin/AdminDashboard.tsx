import React from 'react';
import { useStore } from '../context/StoreContext';
import { DollarSign, ShoppingBag, Package, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { orders, products, users } = useStore();

  const totalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.total, 0);
    
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => ['Pending Verification', 'Processing'].includes(o.status)).length;

  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Sales</p>
            <h3 className="text-2xl font-black text-gray-900">৳{totalSales.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-900">{totalOrders}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Products</p>
            <h3 className="text-2xl font-black text-gray-900">{products.length}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Customers</p>
            <h3 className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'customer').length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-orange-600 hover:text-orange-700">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 font-bold text-sm text-gray-500">Order ID</th>
                  <th className="py-3 font-bold text-sm text-gray-500">Customer</th>
                  <th className="py-3 font-bold text-sm text-gray-500">Amount</th>
                  <th className="py-3 font-bold text-sm text-gray-500">Status</th>
                  <th className="py-3 font-bold text-sm text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">#{order.id}</td>
                      <td className="py-4 text-gray-600">{order.shippingAddress.name}</td>
                      <td className="py-4 font-bold text-gray-900">৳{order.total.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Needed */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Action Needed</h2>
          
          <div className="space-y-4">
            <Link to="/admin/orders" className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors border border-orange-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center mr-3">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-orange-900">Pending Orders</h4>
                  <p className="text-xs text-orange-700">Needs verification/processing</p>
                </div>
              </div>
              <span className="text-2xl font-black text-orange-700">{pendingOrders}</span>
            </Link>
            
            <Link to="/admin/products" className="flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors border border-red-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-200 text-red-700 flex items-center justify-center mr-3">
                  <Package size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-red-900">Low Stock</h4>
                  <p className="text-xs text-red-700">Products with &lt; 10 items</p>
                </div>
              </div>
              <span className="text-2xl font-black text-red-700">{products.filter(p => p.stock < 10).length}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
