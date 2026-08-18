import React from 'react';
import { useStore } from '../context/StoreContext';
import { Ban, CheckCircle } from 'lucide-react';

const AdminCustomers = () => {
  const { users } = useStore();
  const customers = users.filter(u => u.role === 'customer');

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Customers</h1>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 font-bold text-sm text-gray-500">Name</th>
                <th className="py-3 font-bold text-sm text-gray-500">Email</th>
                <th className="py-3 font-bold text-sm text-gray-500">Phone</th>
                <th className="py-3 font-bold text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="py-4 text-gray-600">{c.email}</td>
                  <td className="py-4 text-gray-600">{c.phone}</td>
                  <td className="py-4 text-right">
                    <button className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center justify-end w-full">
                      <Ban size={16} className="mr-1" /> Block
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
