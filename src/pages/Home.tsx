import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useStore } from '../context/StoreContext';

const Home = () => {
  const { products, categories } = useStore();
  
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = [...products].reverse().slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32 pb-40">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
              STEP INTO <br/><span className="text-orange-500">GREATNESS.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-lg">
              Discover the latest premium footwear collection in Bangladesh. Unbeatable style, unmatched comfort.
            </p>
            <div className="flex space-x-4">
              <Link to="/shop" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center">
                Shop Now <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link to="/shop?category=Men" className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-bold text-lg transition-all">
                Men's Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Truck size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-500">All over Bangladesh</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Authentic</h3>
              <p className="text-sm text-gray-500">Guaranteed original brands</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <RefreshCw size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-500">7-day return policy</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4">
                <Clock size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-500">Always here for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Featured Products</h2>
              <p className="text-gray-500">Handpicked selections just for you.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex text-orange-600 hover:text-orange-700 font-bold items-center transition-colors">
              View All <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/shop?category=Sports" className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="https://cdn.pixabay.com/photo/2017/07/25/14/50/shoes-2538424_1280.jpg" alt="Sports" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white mb-2">Sports Collection</h3>
                <p className="text-white flex items-center font-medium">Shop Now <ArrowRight size={18} className="ml-2" /></p>
              </div>
            </Link>
            <Link to="/shop?category=Casual" className="relative h-80 rounded-2xl overflow-hidden group">
              <img src="https://cdn.pixabay.com/photo/2013/07/12/18/20/shoes-153310_1280.png" alt="Casual" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white mb-2">Casual Everyday</h3>
                <p className="text-white flex items-center font-medium">Shop Now <ArrowRight size={18} className="ml-2" /></p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">New Arrivals</h2>
              <p className="text-gray-500">Fresh drops, straight to your closet.</p>
            </div>
            <Link to="/shop?sort=newest" className="hidden sm:flex text-orange-600 hover:text-orange-700 font-bold items-center transition-colors">
              View All <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">Join the Sneakerhead Community</h2>
          <p className="text-orange-100 mb-10 text-lg">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4" onSubmit={(e) => { e.preventDefault(); }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-orange-200 border border-orange-400"
              required
            />
            <button type="submit" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
