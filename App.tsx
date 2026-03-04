import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import ProductsPage from './components/ProductsPage';
import SuppliersPage from './components/SuppliersPage';
import InstitutionalPage from './components/InstitutionalPage';
import AuthPage from './components/AuthPage';
import CheckoutPage from './components/CheckoutPage';
import ProductDetailPage from './components/ProductDetailPage';
import { Button } from './components/ui/Layout';
import { User, Globe, Package, Lock } from 'lucide-react';
import { CartItem } from './types';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [nextPathAfterLogin, setNextPathAfterLogin] = useState<string | null>(null);

  const navigateToHome = () => navigate('/');

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    navigateToHome();
  };

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (existing) {
        return prev.map(item => item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product_id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.product_id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.product_id !== productId);
    });
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      setNextPathAfterLogin('/checkout');
      navigate('/auth');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    if (nextPathAfterLogin) {
      navigate(nextPathAfterLogin);
      setNextPathAfterLogin(null);
    } else {
      navigate('/cliente');
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin');
  };

  const ProductDetailRoute = () => {
    const { productId } = useParams();
    if (!productId) {
      return <Navigate to="/produtos" replace />;
    }

    return (
      <ProductDetailPage
        productId={productId}
        cart={cart}
        addToCart={addToCart}
        onNavigateToHome={navigateToHome}
        onNavigateToClient={handleCartClick}
        onNavigateToCheckout={handleCartClick}
      />
    );
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 p-4 bg-white/90 backdrop-blur rounded-xl border border-slate-200 shadow-2xl scale-75 origin-bottom-right hover:scale-100 transition-transform hidden md:flex">
        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Demo Navigation</p>
        <Button
          variant={isActive('/') ? 'primary' : 'outline'}
          className="w-full justify-start h-8 text-xs"
          onClick={() => navigate('/')}
        >
          <Globe className="w-3 h-3 mr-2" /> Home
        </Button>
        <Button
          variant={isActive('/produtos') ? 'primary' : 'outline'}
          className="w-full justify-start h-8 text-xs"
          onClick={() => navigate('/produtos')}
        >
          <Package className="w-3 h-3 mr-2" /> Produtos
        </Button>
        <div className="h-px bg-slate-200 my-1"></div>
        <Button
          variant={isActive('/auth') ? 'primary' : 'outline'}
          className="w-full justify-start h-8 text-xs"
          onClick={() => navigate('/auth')}
        >
          <Lock className="w-3 h-3 mr-2" /> Login/Register
        </Button>
        <Button
          variant={isActive('/cliente') ? 'primary' : 'outline'}
          className="w-full justify-start h-8 text-xs"
          onClick={() => navigate('/cliente')}
        >
          <User className="w-3 h-3 mr-2" /> Client Area
        </Button>
        <Button
          variant={isActive('/admin') ? 'primary' : 'outline'}
          className="w-full justify-start h-8 text-xs"
          onClick={handleAdminClick}
        >
          <Lock className="w-3 h-3 mr-2" /> Admin Area
        </Button>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              cart={cart}
              addToCart={addToCart}
              onNavigateToClient={handleCartClick}
              onNavigateToAdmin={handleAdminClick}
              onNavigateToProducts={() => navigate('/produtos')}
              onNavigateToSuppliers={() => navigate('/fornecedores')}
              onNavigateToInstitutional={() => navigate('/institucional')}
              onNavigateToCheckout={handleCartClick}
              onProductClick={handleProductClick}
            />
          }
        />
        <Route
          path="/auth"
          element={<AuthPage onLoginSuccess={handleLoginSuccess} onNavigateToHome={navigateToHome} />}
        />
        <Route
          path="/admin/login"
          element={<AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} onNavigateToHome={navigateToHome} />}
        />
        <Route
          path="/produtos"
          element={
            <ProductsPage
              cart={cart}
              addToCart={addToCart}
              onNavigateToHome={navigateToHome}
              onNavigateToClient={handleCartClick}
              onNavigateToCheckout={handleCartClick}
              onProductClick={handleProductClick}
            />
          }
        />
        <Route path="/produto/:productId" element={<ProductDetailRoute />} />
        <Route
          path="/fornecedores"
          element={<SuppliersPage cart={cart} onNavigateToHome={navigateToHome} onNavigateToClient={handleCartClick} />}
        />
        <Route
          path="/institucional"
          element={<InstitutionalPage onNavigateToHome={navigateToHome} onNavigateToClient={handleCartClick} />}
        />
        <Route
          path="/checkout"
          element={
            isLoggedIn ? (
              <CheckoutPage
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onNavigateToHome={navigateToHome}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/cliente"
          element={
            <div className="min-h-screen flex animate-in fade-in">
              <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col p-4">
                <div className="mb-8 px-2 font-bold text-white text-xl cursor-pointer flex items-center gap-1" onClick={navigateToHome}>
                  Epoca <span className="text-[#0071DC]">B2B</span>
                </div>
                <nav className="space-y-1">
                  <a href="#" className="block px-4 py-2 bg-slate-800 text-white rounded-md">Dashboard</a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-md">Meus Pedidos</a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-md">Financeiro</a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-md">Catalogo</a>
                </nav>
                <div className="mt-auto pt-4 border-t border-slate-800">
                  <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white" onClick={navigateToHome}>
                    Sair
                  </Button>
                </div>
              </aside>
              <main className="flex-1 p-8 overflow-auto">
                <ClientDashboard
                  onNavigateToHome={navigateToHome}
                  onNavigateToCheckout={() => navigate('/checkout')}
                />
              </main>
            </div>
          }
        />
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <div className="min-h-screen flex animate-in fade-in">
                <AdminDashboard onNavigateToHome={handleAdminLogout} />
              </div>
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
