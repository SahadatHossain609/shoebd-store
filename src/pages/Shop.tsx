import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useStore } from '../context/StoreContext';

const Shop = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category');
  const searchFilter = searchParams.get('search');
  const sortParam = searchParams.get('sort');

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(20000);
  const [showFilters, setShowFilters] = useState(false);

  const allBrands = Array.from(new Set<string>(products.map(p => p.brand)));

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryFilter) {
      if (['Men', 'Women', 'Kids', 'Unisex', 'Sports', 'Casual'].includes(categoryFilter)) {
        filtered = filtered.filter(p => {
          if (Array.isArray(p.section)) {
            return p.section.includes(categoryFilter) || p.category === categoryFilter;
          }
          return p.section === categoryFilter || p.category === categoryFilter;
        });
      } else {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }
    }
    
    if (searchFilter) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.brand.toLowerCase().includes(searchFilter.toLowerCase()));
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    filtered = filtered.filter(p => (p.discountPrice || p.price) <= priceRange);

    if (sortParam === 'price-low') {
      filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortParam === 'price-high') {
      filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortParam === 'newest') {
      // Assuming mock data is somewhat ordered, just reverse for newest
      filtered.reverse();
    } else if (sortParam === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [products, categoryFilter, searchFilter, selectedBrands, priceRange, sortParam]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('sort', e.target.value);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {searchFilter ? `Search: "${searchFilter}"` : categoryFilter ? `${categoryFilter} Collection` : 'All Products'}
            </h1>
            <p className="text-gray-500 mt-2">Showing {filteredProducts.length} results</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              <Filter size={20} className="mr-2" /> Filters
            </button>
            
            <div className="relative">
              <select 
                value={sortParam || ''}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
              >
                <option value="">Sort by: Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center mb-6 text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
                <SlidersHorizontal size={20} className="mr-2 text-orange-600" /> Filters
              </div>

              {/* Brands */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Brands</h3>
                <div className="space-y-3">
                  {allBrands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-3 text-gray-600 group-hover:text-gray-900">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">Max Price: ৳{priceRange.toLocaleString()}</h3>
                <input 
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>৳500</span>
                  <span>৳20,000</span>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${!categoryFilter ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setSearchParams({ category: cat.name })}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${categoryFilter === cat.name ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange(20000);
                    setSearchParams({});
                  }}
                  className="bg-orange-600 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
