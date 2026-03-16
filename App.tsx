import React, { useEffect, useState, useMemo } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ClientDashboard, { ClientProfilePage } from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import ProductsPage from './components/ProductsPage';
import SuppliersPage from './components/SuppliersPage';
import InstitutionalPage from './components/InstitutionalPage';
import AuthPage from './components/AuthPage';
import CheckoutPage from './components/CheckoutPage';
import ProductDetailPage from './components/ProductDetailPage';
import FavoritesPage from './components/FavoritesPage';
import { Button } from './components/ui/Layout';
import { User, Globe, Package, Lock } from 'lucide-react';
import { AuthUser, CartItem } from './types';
import { clearStoredSession, getStoredSession } from './lib/authStorage';
import { getStoredFavorites, saveStoredFavorites } from './lib/favoritesStorage';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [nextPathAfterLogin, setNextPathAfterLogin] = useState<string | null>(null);

  useEffect(() => {
    const storedSession = getStoredSession();
    if (storedSession) {
      setCurrentUser(storedSession);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const ownerKey = currentUser?.id || 'guest';
    setFavoriteIds(getStoredFavorites(ownerKey));
  }, [currentUser]);

  const navigateToHome = () => navigate('/');
  const navigateToFavorites = () => navigate('/favoritos');
  const navigateToProducts = () => navigate('/produtos');
  const navigateToDepartment = (department: string) => {
    const params = new URLSearchParams({ departamento: department });
    navigate(`/produtos?${params.toString()}`);
  };
  const favoriteOwnerKey = currentUser?.id || 'guest';

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

  const handleClientLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setNextPathAfterLogin(null);
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
      setNextPathAfterLogin(cart.length > 0 ? '/checkout' : null);
      navigate('/auth');
    }
  };

  const handleClientAreaClick = () => {
    if (isLoggedIn) {
      navigate('/cliente');
    } else {
      setNextPathAfterLogin('/');
      navigate('/auth');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produto/${productId}`);
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteIds(prev => {
      const nextFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];

      saveStoredFavorites(favoriteOwnerKey, nextFavorites);
      return nextFavorites;
    });
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (nextPathAfterLogin) {
      navigate(nextPathAfterLogin);
      setNextPathAfterLogin(null);
    } else {
      navigate('/');
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin');
  };

  const handleCurrentUserUpdate = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const ProductDetailRoute = () => {
    const { productId } = useParams();
    if (!productId) {
      return <Navigate to="/produtos" replace />;
    }

    return (
      <ProductDetailPage
        productId={productId}
        currentUser={currentUser}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        onNavigateToHome={navigateToHome}
        onNavigateToClient={handleClientAreaClick}
        onNavigateToFavorites={navigateToFavorites}
        onNavigateToCheckout={handleCartClick}
        favoriteIds={favoriteIds}
        toggleFavorite={toggleFavorite}
      />
    );
  };

  const ClientAreaLayout = () => (
    <div className="min-h-screen flex animate-in fade-in">
      <aside className="hidden w-64 flex-col bg-slate-900 p-4 text-slate-300 lg:flex">
        <div className="mb-8 flex cursor-pointer items-center gap-1 px-2 text-xl font-bold text-white" onClick={navigateToHome}>
          Epoca <span className="text-[#be342e]">B2B</span>
        </div>
        <nav className="space-y-1">
          <NavLink
            to="/cliente/dashboard"
            className={({ isActive }) =>
              `block rounded-md px-4 py-2 transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/cliente/dados"
            className={({ isActive }) =>
              `block rounded-md px-4 py-2 transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`
            }
          >
            Dados do Cliente
          </NavLink>
          <a href="#" className="block rounded-md px-4 py-2 hover:bg-slate-800">Meus Pedidos</a>
          <a href="#" className="block rounded-md px-4 py-2 hover:bg-slate-800">Financeiro</a>
          <a href="#" className="block rounded-md px-4 py-2 hover:bg-slate-800">Catalogo</a>
        </nav>
        <div className="mt-auto border-t border-slate-800 pt-4">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white" onClick={handleClientLogout}>
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              currentUser={currentUser}
              onNavigateToClient={handleClientAreaClick}
              onNavigateToAdmin={handleAdminClick}
              onNavigateToFavorites={navigateToFavorites}
              onNavigateToProducts={navigateToProducts}
              onNavigateToDepartment={navigateToDepartment}
              onNavigateToSuppliers={() => navigate('/fornecedores')}
              onNavigateToInstitutional={() => navigate('/institucional')}
              onNavigateToCheckout={handleCartClick}
              onProductClick={handleProductClick}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
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
              removeFromCart={removeFromCart}
              currentUser={currentUser}
              onNavigateToHome={navigateToHome}
              onNavigateToClient={handleClientAreaClick}
              onNavigateToFavorites={navigateToFavorites}
              onNavigateToCheckout={handleCartClick}
              onProductClick={handleProductClick}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
            />
          }
        />
        <Route path="/produto/:productId" element={<ProductDetailRoute />} />
        <Route
          path="/favoritos"
          element={
            <FavoritesPage
              currentUser={currentUser}
              favoriteIds={favoriteIds}
              cart={cart}
              onNavigateToHome={navigateToHome}
              onNavigateToCheckout={handleCartClick}
              onProductClick={handleProductClick}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              toggleFavorite={toggleFavorite}
            />
          }
        />
        <Route
          path="/fornecedores"
          element={<SuppliersPage cart={cart} currentUser={currentUser} onNavigateToHome={navigateToHome} onNavigateToClient={handleClientAreaClick} />}
        />
        <Route
          path="/institucional"
          element={<InstitutionalPage currentUser={currentUser} onNavigateToHome={navigateToHome} onNavigateToClient={handleClientAreaClick} />}
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
        <Route path="/cliente" element={isLoggedIn ? <ClientAreaLayout /> : <Navigate to="/auth" replace />}>
          <Route index element={<Navigate to="/cliente/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ClientDashboard
                currentUser={currentUser}
                onNavigateToHome={navigateToHome}
                onNavigateToCheckout={() => navigate('/checkout')}
                onCurrentUserUpdate={handleCurrentUserUpdate}
              />
            }
          />
          <Route
            path="dados"
            element={
              <ClientProfilePage
                currentUser={currentUser}
                onNavigateToHome={navigateToHome}
                onNavigateToCheckout={() => navigate('/checkout')}
                onCurrentUserUpdate={handleCurrentUserUpdate}
              />
            }
          />
        </Route>
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
