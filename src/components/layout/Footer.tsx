import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div>
            <Link to="/" className="text-3xl font-black tracking-tighter text-white mb-6 block">
              SHOE<span className="text-orange-500">BD</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your ultimate destination for premium footwear in Bangladesh. We offer the best quality shoes from top brands worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-orange-500 transition-colors">Shop Collection</Link></li>
              <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-orange-500 transition-colors">FAQs</Link></li>
              <li><Link to="/admin/login" className="hover:text-gray-400 transition-colors text-sm">Admin Login</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-4">
              <li><Link to="/account" className="hover:text-orange-500 transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-orange-500 transition-colors">Order Tracking</Link></li>
              <li><Link to="/wishlist" className="hover:text-orange-500 transition-colors">Wishlist</Link></li>
              <li><Link to="/shipping" className="hover:text-orange-500 transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 text-orange-500 flex-shrink-0 mt-1" />
                <span>123 ShoeBD Tower, Banani<br/>Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-orange-500 flex-shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-orange-500 flex-shrink-0" />
                <span>support@shoebd.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-bold text-white mb-3">Accepted Payments</h4>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-pink-600 text-white text-xs font-bold rounded">bKash</span>
                <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded">Nagad</span>
                <span className="px-2 py-1 bg-purple-700 text-white text-xs font-bold rounded">Rocket</span>
                <span className="px-2 py-1 bg-blue-800 text-white text-xs font-bold rounded">Card</span>
                <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">COD</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShoeBD. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">Designed & Developed for Bangladesh</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
