import React from 'react';

export const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-8">About Us</h1>
    <div className="prose prose-lg text-gray-600">
      <p className="mb-4">Welcome to Premium E-commerce. We are dedicated to providing you with the best quality products at affordable prices.</p>
      <p className="mb-4">Our journey started with a simple idea: to make online shopping seamless and enjoyable for everyone in Bangladesh.</p>
      <p>We source our products carefully and ensure top-notch customer service.</p>
    </div>
  </div>
);

export const ContactPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-8">Contact Us</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-6">Have questions or feedback? We'd love to hear from you.</p>
        <div className="space-y-4 text-gray-600">
          <p><strong>Email:</strong> support@ecommerce.com</p>
          <p><strong>Phone:</strong> +880 1700-000000</p>
          <p><strong>Address:</strong> Dhaka, Bangladesh</p>
        </div>
      </div>
      <form className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
            <textarea rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <button type="button" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors">
            Send Message
          </button>
        </div>
      </form>
    </div>
  </div>
);

export const PrivacyPolicyPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-8">Privacy Policy</h1>
    <div className="prose prose-lg text-gray-600 space-y-6">
      <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
      <p>We collect information you provide directly to us when creating an account, placing an order, or contacting customer support.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
      <p>We use the information to process your orders, communicate with you, and improve our services.</p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
      <p>We implement security measures to maintain the safety of your personal information.</p>
    </div>
  </div>
);

export const TermsPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-8">Terms and Conditions</h1>
    <div className="prose prose-lg text-gray-600 space-y-6">
      <p>Please read these terms and conditions carefully before using our service.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
      <p>By accessing or using our website, you agree to be bound by these Terms.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Purchases</h2>
      <p>If you wish to purchase any product, you may be asked to supply certain information relevant to your Purchase.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Changes</h2>
      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
    </div>
  </div>
);
