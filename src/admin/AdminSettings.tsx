import React from 'react';

const AdminSettings = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Settings</h1>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-8">
        
        <div>
          <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">bKash Merchant Number</label>
              <input type="text" defaultValue="01700-000000" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nagad Merchant Number</label>
              <input type="text" defaultValue="01900-000000" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Rocket Merchant Number</label>
              <input type="text" defaultValue="01800-000000" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h2 className="text-xl font-bold mb-4">Change Admin Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
