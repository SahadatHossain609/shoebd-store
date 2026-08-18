import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Trash2 } from 'lucide-react';

const AdminCategories = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim()) {
      addCategory({ name: newCat });
      setNewCat('');
    }
  };

  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Categories</h1>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Category Name" 
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-orange-700 transition-colors">
            <Plus size={20} className="mr-2" /> Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Current Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <span className="font-bold text-gray-900">{cat.name}</span>
              <button 
                onClick={() => setCategoryToDelete(cat.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button 
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-gray-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
