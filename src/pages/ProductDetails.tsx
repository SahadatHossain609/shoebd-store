import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  
  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.images[0]);
  const [activeTab, setActiveTab] = useState<'description'|'specs'|'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-orange-600">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-orange-600">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="bg-white rounded-3xl p-6 lg:p-12 shadow-sm border border-gray-100 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 relative">
                <img 
                  src={mainImage || product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
                {product.discountPrice && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                    SALE -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`w-24 h-24 rounded-xl flex-shrink-0 border-2 overflow-hidden bg-gray-50 ${mainImage === img ? 'border-orange-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-bold text-orange-600 uppercase tracking-wider">{product.brand}</p>
                <div className="flex items-center text-yellow-400">
                  <Star size={16} className="fill-current" />
                  <span className="text-sm text-gray-600 ml-1 font-medium">{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-4">{product.name}</h1>
              
              <div className="flex items-baseline space-x-4 mb-6">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-black text-orange-600">৳{product.discountPrice.toLocaleString()}</span>
                    <span className="text-xl text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-gray-900">৳{product.price.toLocaleString()}</span>
                )}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="h-px bg-gray-100 w-full mb-8"></div>

              {/* Selections */}
              <div className="space-y-6 mb-8">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-900">Size</span>
                    <button className="text-sm text-gray-500 hover:text-orange-600 underline">Size Guide</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                          selectedSize === size 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-900 block mb-3">Color: <span className="font-normal text-gray-600">{selectedColor}</span></span>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                          selectedColor === color
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-gray-900 block mb-3">Quantity</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock > 0 ? `${product.stock} items available` : <span className="text-red-500 font-bold">Out of stock</span>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-black text-white h-14 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={20} className="mr-2" /> Add to Cart
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`w-full sm:w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-colors ${
                    isWishlisted 
                      ? 'border-orange-500 bg-orange-50 text-orange-500' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck size={20} className="mr-3 text-orange-500" /> Free Delivery above ৳5000
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheck size={20} className="mr-3 text-orange-500" /> 100% Authentic
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-16 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'description' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'specs' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Specifications
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Reviews ({product.reviews})
            </button>
          </div>
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600">
                <p>{product.description}</p>
                <p className="mt-4">Designed for maximum comfort and style, these shoes are perfect for any occasion. The premium materials ensure durability, while the modern design keeps you looking fresh.</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium text-gray-900">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Available Sizes</span>
                  <span className="font-medium text-gray-900">{product.sizes.join(', ')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Available Colors</span>
                  <span className="font-medium text-gray-900">{product.colors.join(', ')}</span>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center mb-8 bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center mr-8">
                    <span className="text-4xl font-black text-gray-900">{product.rating}</span>
                    <span className="text-gray-500 block">out of 5</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex text-yellow-400 mb-1">
                      {[1,2,3,4,5].map(star => <Star key={star} className="fill-current" size={20} />)}
                    </div>
                    <span className="text-sm text-gray-500">Based on {product.reviews} reviews</span>
                  </div>
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                    Write a Review
                  </button>
                </div>
                {/* Mock Review */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">Rahim Islam</h4>
                      <div className="flex text-yellow-400 text-sm mt-1">
                        <Star className="fill-current" size={14} /><Star className="fill-current" size={14} /><Star className="fill-current" size={14} /><Star className="fill-current" size={14} /><Star className="fill-current" size={14} />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 days ago</span>
                  </div>
                  <p className="text-gray-600 text-sm">Excellent quality and perfect fit. Delivery was very fast. Highly recommended!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
