import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Eye } from 'lucide-react';
import { Order } from '../types';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusChange = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Order Management</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-bold text-sm text-gray-500">Order ID</th>
                <th className="py-3 font-bold text-sm text-gray-500">Customer</th>
                <th className="py-3 font-bold text-sm text-gray-500">Date</th>
                <th className="py-3 font-bold text-sm text-gray-500">Total</th>
                <th className="py-3 font-bold text-sm text-gray-500">Payment</th>
                <th className="py-3 font-bold text-sm text-gray-500">Status</th>
                <th className="py-3 font-bold text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="py-4 text-gray-600">{order.shippingAddress.name}</td>
                  <td className="py-4 text-gray-500 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="py-4 font-bold text-gray-900">৳{order.total.toLocaleString()}</td>
                  <td className="py-4">
                    <span className="text-sm font-medium">{order.paymentMethod}</span>
                  </td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`text-xs font-bold rounded-full px-2 py-1 outline-none cursor-pointer ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="text-gray-500 hover:text-orange-600 p-2 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Details #{selectedOrder.id}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-2 border-b pb-2">Customer Information</h3>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Name:</span> {selectedOrder.shippingAddress.name}</p>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}</p>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Address:</span> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.upazila}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.division}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 border-b pb-2">Payment Information</h3>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Method:</span> {selectedOrder.paymentMethod}</p>
                {selectedOrder.paymentDetails && (
                  <>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Sender:</span> {selectedOrder.paymentDetails.senderNumber}</p>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">TrxID:</span> {selectedOrder.paymentDetails.trxId}</p>
                  </>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Update Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                    className="w-full border rounded p-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Order Items</h3>
              <div className="space-y-4 mb-6">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                        <p className="text-sm font-medium mt-1">Qty: {item.quantity} × ৳{item.discountPrice || item.price}</p>
                      </div>
                    </div>
                    <div className="font-black text-gray-900">
                      ৳{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-900">৳{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-bold">-৳{selectedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-bold text-gray-900">৳{selectedOrder.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-black text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">৳{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
