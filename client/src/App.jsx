import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { WhatsAppButton } from "./components/layout/WhatsAppButton";
import { AuthProvider } from "./context/AdminAuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import { StoreProvider } from "./context/StoreContext";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Brand from "./pages/Brand";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function LayoutWrapper({ children }) {
  const { pathname } = useLocation();
  const isAdminDashboard = pathname.startsWith("/admin/dashboard");
  // Home page: hero extends under the transparent fixed navbar — no top padding needed.
  // All other pages: add padding-top so content isn't hidden behind the fixed navbar.
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isAdminDashboard && <Navbar />}
      <main className={`flex-1${!isAdminDashboard && !isHome ? " pt-16" : ""}`}>{children}</main>
      {!isAdminDashboard && <Footer />}
      {!isAdminDashboard && <WhatsAppButton />}
    </div>
  );
}

export function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <UserAuthProvider>
          <StoreProvider>
            <CartProvider>
              <LayoutWrapper>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/brand/:slug" element={<Brand />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/admin/login" element={<Login />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route
                    path="*"
                    element={
                      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
                        <h1 className="text-7xl font-bold text-foreground">404</h1>
                        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
                        <p className="mt-2 text-sm text-muted-foreground">The page you are looking for does not exist.</p>
                        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft">
                          Go Home
                        </Link>
                      </div>
                    }
                  />
                </Routes>
              </LayoutWrapper>
              <Toaster position="top-right" richColors duration={2000} />
            </CartProvider>
          </StoreProvider>
        </UserAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
