import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { Cpu, Menu, X, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAdminAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 py-4 px-6 md:px-12 flex items-center justify-between text-gray-200">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
        <Cpu className="text-primary w-6 h-6 animate-pulse" />
        <span>Smart<span className="text-primary">Nest</span></span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 font-medium">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `transition-colors duration-250 ${
                isActive ? "text-primary font-semibold" : "hover:text-primary-light text-gray-400"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Admin actions / Call To Action */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/25 transition text-sm text-primary font-medium"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 transition text-sm text-red-400 font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link
            to="/products"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition text-sm text-white font-medium shadow-glass hover:shadow-glass-hover"
          >
            Explore Catalog
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-1 text-gray-300 hover:text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="absolute top-[65px] left-0 w-full glass p-6 flex flex-col gap-6 md:hidden border-b border-dark-border">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors ${
                  isActive ? "text-primary" : "text-gray-400"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <hr className="border-gray-800" />
          {user ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-medium text-center"
              >
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium w-full text-center"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="px-5 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium text-center"
            >
              Explore Catalog
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
