import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Product } from '../types';

import RichTextEditor from '../components/RichTextEditor';

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    section: ['Men'],
    brand: '',
    sizes: '',
    colors: '',
    stock: '',
    imageUrls: '',
    uploadedImages: [] as string[],
    featured: false
  });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      
      let initialSections = ['Men'];
      if (product.section) {
        if (Array.isArray(product.section)) {
          initialSections = product.section.length > 0 ? product.section : ['Men'];
        } else if (typeof product.section === 'string') {
          initialSections = [product.section];
        }
      }
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discountPrice: product.discountPrice?.toString() || '',
        category: product.category,
        section: initialSections,
        brand: product.brand,
        sizes: product.sizes.join(', '),
        colors: product.colors.join(', '),
        stock: product.stock.toString(),
        imageUrls: product.images.filter(img => !img.startsWith('data:image')).join(', '),
        uploadedImages: product.images.filter(img => img.startsWith('data:image')),
        featured: product.featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: '', discountPrice: '', category: categories[0]?.name || '',
        section: ['Men'],
        brand: '', sizes: '', colors: '', stock: '', imageUrls: '', uploadedImages: [], featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    Promise.all(files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    })).then(base64Images => {
      setFormData(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, ...base64Images]
      }));
    });
  };

  const removeUploadedImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalImages = [
      ...formData.imageUrls.split(',').map(s => s.trim()).filter(Boolean),
      ...formData.uploadedImages
    ];

    if (finalImages.length === 0) {
      alert("Please provide at least one image URL or upload an image.");
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      category: formData.category,
      section: formData.section,
      brand: formData.brand,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(formData.stock),
      images: finalImages,
      featured: formData.featured
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...productData });
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
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
                <th className="py-3 font-bold text-sm text-gray-500">Image</th>
                <th className="py-3 font-bold text-sm text-gray-500">Name</th>
                <th className="py-3 font-bold text-sm text-gray-500">Section</th>
                <th className="py-3 font-bold text-sm text-gray-500">Category</th>
                <th className="py-3 font-bold text-sm text-gray-500">Price</th>
                <th className="py-3 font-bold text-sm text-gray-500">Stock</th>
                <th className="py-3 font-bold text-sm text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded bg-gray-100" />
                  </td>
                  <td className="py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="py-3 text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                      {Array.isArray(product.section) ? product.section.join(', ') : (product.section || 'Men')}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{product.category}</td>
                  <td className="py-3 font-bold text-gray-900">৳{product.price.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:text-blue-700 p-2">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-2 ml-2">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mt-4 sm:mt-10 mb-10 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-gray-900 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Brand</label>
                  <input type="text" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Section (Gender)</label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {['Men', 'Women', 'Kids', 'Unisex'].map(sec => (
                      <label key={sec} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.section.includes(sec)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, section: [...formData.section, sec]});
                            } else {
                              const newSection = formData.section.filter(s => s !== sec);
                              if (newSection.length === 0) newSection.push('Men'); // Ensure at least one is selected
                              setFormData({...formData, section: newSection});
                            }
                          }}
                          className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{sec}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                  <input 
                    type="text" 
                    required 
                    list="category-list"
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                    placeholder="Select or type category"
                  />
                  <datalist id="category-list">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (৳)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount Price (৳)</label>
                  <input type="number" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Sizes (comma separated)</label>
                  <input type="text" required value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} placeholder="40, 41, 42" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Colors (comma separated)</label>
                  <input type="text" required value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} placeholder="Black, White" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Product Images</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Upload Images from Device</label>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" 
                    />
                  </div>
                  
                  {formData.uploadedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 group">
                          <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover rounded-lg border border-gray-200" />
                          <button 
                            type="button" 
                            onClick={() => removeUploadedImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Or add Image URLs (comma separated)</label>
                    <input type="text" value={formData.imageUrls} onChange={e => setFormData({...formData, imageUrls: e.target.value})} placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <div className="bg-white rounded-lg">
                  <RichTextEditor
                    value={formData.description} 
                    onChange={value => setFormData({...formData, description: value})} 
                    className="mb-12"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-orange-600 rounded" />
                <label htmlFor="featured" className="ml-2 text-sm font-bold text-gray-700">Featured Product (Shows on Homepage)</label>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-600 font-bold mr-4">Cancel</button>
                <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex space-x-3 justify-end">
              <button 
                onClick={() => setProductToDelete(null)}
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

export default AdminProducts;
