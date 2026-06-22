import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Globe, MessageCircle, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark/50 border-t border-slate-900 text-gray-400 py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <Cpu className="text-primary w-6 h-6" />
            <span>Smart<span className="text-primary">Nest</span></span>
          </Link>
          <p className="text-sm">
            Elevating everyday spaces with next-generation smart home tech, sensors, and intelligent automation systems.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-primary transition">Products</Link></li>
            <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition">F.A.Q</a></li>
            <li><Link to="/contact" className="hover:text-primary transition">Enquiries</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold">Stay Connected</h4>
          <p className="text-sm">Subscribe to receive smart home tips, product updates, and exclusive guides.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-dark-card border border-dark-border px-3 py-2 text-sm rounded-l-lg focus:outline-none focus:border-primary w-full text-white"
            />
            <button type="submit" className="bg-primary hover:bg-primary-hover px-4 rounded-r-lg text-dark font-semibold text-sm transition">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs gap-4">
        <div>
          &copy; {new Date().getFullYear()} SmartNest. All rights reserved.
        </div>
        <div className="flex items-center gap-2">
          <span>Designed with</span>
          <Heart size={12} className="text-primary fill-primary animate-pulse" />
          <span>for smarter spaces.</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <a href="#" className="hover:text-white transition"><MessageCircle size={16} /></a>
          <a href="#" className="hover:text-white transition"><Globe size={16} /></a>
          <a href="#" className="hover:text-white transition"><ExternalLink size={16} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
