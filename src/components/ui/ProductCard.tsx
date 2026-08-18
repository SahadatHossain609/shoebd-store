import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    addToCart(product, size, color, 1);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 relative">
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlistClick}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-sm hover:bg-orange-50 transition-colors"
      >
        <Heart size={20} className={isWishlisted ? 'fill-orange-500 text-orange-500' : 'text-gray-400 hover:text-orange-500'} />
      </button>

      {/* Sale Badge */}
      {product.discountPrice && (
        <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
          SALE
        </div>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden rounded-xl mb-4 bg-gray-50">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Quick Add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-black font-bold py-2 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
          >
            <ShoppingCart size={18} className="mr-2" /> Quick Add
          </button>
        </div>
      </Link>

      {/* Content */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{product.brand}</p>
          <div className="flex items-center text-yellow-400">
            <Star size={14} className="fill-current" />
            <span className="text-xs text-gray-600 ml-1 font-medium">{product.rating}</span>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center space-x-2">
          {product.discountPrice ? (
            <>
              <span className="font-black text-lg text-orange-600">৳{product.discountPrice.toLocaleString()}</span>
              <span className="text-sm text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="font-black text-lg text-gray-900">৳{product.price.toLocaleString()}</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
