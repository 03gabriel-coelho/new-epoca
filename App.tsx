import React, { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ClientDashboard, { ClientOrdersPage, ClientProfilePage } from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import ProductsPage from './components/ProductsPage';
import CombosPage from './components/CombosPage';
import SuppliersPage from './components/SuppliersPage';
import InstitutionalPage from './components/InstitutionalPage';
import AuthPage from './components/AuthPage';
import CheckoutPage from './components/CheckoutPage';
import ProductDetailPage from './components/ProductDetailPage';
import ComboDetailPage from './components/ComboDetailPage';
import FavoritesPage from './components/FavoritesPage';
import { Button } from './components/ui/Layout';
import { AuthUser, CartItem, StoredOrder } from './types';
import { clearStoredSession, getStoredSession } from './lib/authStorage';
import { getStoredFavorites, saveStoredFavorites } from './lib/favoritesStorage';
import { mockCombos } from './lib/mockCombos';
import { ComboSelections, createDefaultComboSelections, resolveComboQualifyingItems } from './lib/comboUtils';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [nextPathAfterLogin, setNextPathAfterLogin] = useState<string | null>(null);

  const upsertCartItem = (
    items: CartItem[],
    productId: string,
    quantityDelta: number,
    comboEntry?: { combo_id: string; role: 'trigger' | 'reward'; quantity: number }
  ) => {
    const existingIndex = items.findIndex((item) => item.product_id === productId);

    if (existingIndex < 0) {
      if (quantityDelta <= 0) {
        return items;
      }

      return [
        ...items,
        {
          product_id: productId,
          quantity: quantityDelta,
          combo_breakdown: comboEntry ? [comboEntry] : [],
        },
      ];
    }

    const existingItem = items[existingIndex];
    const nextQuantity = existingItem.quantity + quantityDelta;
    const nextBreakdown = [...(existingItem.combo_breakdown || [])];

    if (comboEntry) {
      const breakdownIndex = nextBreakdown.findIndex(
        (entry) => entry.combo_id === comboEntry.combo_id && entry.role === comboEntry.role
      );

      if (breakdownIndex >= 0) {
        nextBreakdown[breakdownIndex] = {
          ...nextBreakdown[breakdownIndex],
          quantity: nextBreakdown[breakdownIndex].quantity + comboEntry.quantity,
        };
      } else {
        nextBreakdown.push(comboEntry);
      }
    }

    if (nextQuantity <= 0) {
      return items.filter((_, index) => index !== existingIndex);
    }

    return items.map((item, index) =>
      index === existingIndex
        ? {
            ...item,
            quantity: nextQuantity,
            combo_breakdown: nextBreakdown,
          }
        : item
    );
  };

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
  const navigateToCombos = () => navigate('/combos');
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
      return upsertCartItem(prev, productId, 1);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (!existing) {
        return prev;
      }

      const rewardEntries = (existing.combo_breakdown || []).filter((entry) => entry.role === 'reward');
      const triggerEntries = (existing.combo_breakdown || []).filter((entry) => entry.role === 'trigger');
      const rewardQuantity = rewardEntries.reduce((total, entry) => total + entry.quantity, 0);
      const triggerQuantity = triggerEntries.reduce((total, entry) => total + entry.quantity, 0);
      const regularQuantity = Math.max(existing.quantity - rewardQuantity - triggerQuantity, 0);

      if (regularQuantity > 0) {
        return upsertCartItem(prev, productId, -1);
      }

      if (triggerEntries.length > 0) {
        const triggerEntry = triggerEntries[0];
        return prev
          .map((item) => {
            if (item.product_id !== productId) {
              return item;
            }

            const nextBreakdown = (item.combo_breakdown || [])
              .map((entry) =>
                entry.combo_id === triggerEntry.combo_id && entry.role === 'trigger'
                  ? { ...entry, quantity: entry.quantity - 1 }
                  : entry
              )
              .filter((entry) => entry.quantity > 0);

            return {
              ...item,
              quantity: item.quantity - 1,
              combo_breakdown: nextBreakdown,
            };
          })
          .filter((item) => item.quantity > 0);
      }

      if (rewardEntries.length > 0) {
        const rewardEntry = rewardEntries[0];
        return prev
          .map((item) => {
            if (item.product_id !== productId) {
              return item;
            }

            const nextBreakdown = (item.combo_breakdown || [])
              .map((entry) =>
                entry.combo_id === rewardEntry.combo_id && entry.role === 'reward'
                  ? { ...entry, quantity: entry.quantity - 1 }
                  : entry
              )
              .filter((entry) => entry.quantity > 0);

            return {
              ...item,
              quantity: item.quantity - 1,
              combo_breakdown: nextBreakdown,
            };
          })
          .filter((item) => item.quantity > 0);
      }

      return prev;
    });
  };

  const addComboToCart = (comboId: string, selections?: ComboSelections) => {
    const combo = mockCombos.find((entry) => entry.id === comboId);
    if (!combo) {
      return;
    }

    setCart((prev) => {
      let nextCart = [...prev];

      resolveComboQualifyingItems(combo, selections || createDefaultComboSelections(combo)).forEach((comboItem) => {
        nextCart = upsertCartItem(nextCart, comboItem.product_id, comboItem.quantity, {
          combo_id: combo.id,
          role: 'trigger',
          quantity: comboItem.quantity,
        });
      });

      (combo.reward_items || []).forEach((comboItem) => {
        nextCart = upsertCartItem(nextCart, comboItem.product_id, comboItem.quantity, {
          combo_id: combo.id,
          role: 'reward',
          quantity: comboItem.quantity,
        });
      });

      return nextCart;
    });
  };

  const removeComboFromCart = (comboId: string) => {
    const combo = mockCombos.find((entry) => entry.id === comboId);
    if (!combo) {
      return;
    }

    setCart((prev) => {
      return prev
        .map((item) => {
          const removedQuantity = (item.combo_breakdown || [])
            .filter((entry) => entry.combo_id === combo.id)
            .reduce((total, entry) => total + entry.quantity, 0);

          if (removedQuantity <= 0) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - removedQuantity,
            combo_breakdown: (item.combo_breakdown || []).filter((entry) => entry.combo_id !== combo.id),
          };
        })
        .filter((item) => item.quantity > 0);
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

  const handleNavigateToOrders = () => {
    if (isLoggedIn) {
      navigate('/cliente/pedidos');
      return;
    }

    setNextPathAfterLogin('/cliente/pedidos');
    navigate('/auth');
  };

  const handleComboClick = (comboId: string) => {
    navigate(`/combo/${comboId}`);
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

  const handleOrderPlaced = (_order: StoredOrder) => {
    setCart([]);
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

  const ComboDetailRoute = () => {
    const { comboId } = useParams();
    if (!comboId) {
      return <Navigate to="/combos" replace />;
    }

    return (
      <ComboDetailPage
        comboId={comboId}
        currentUser={currentUser}
        cart={cart}
        favoriteIds={favoriteIds}
        onNavigateToHome={navigateToHome}
        onNavigateToClient={handleClientAreaClick}
        onNavigateToFavorites={navigateToFavorites}
        onNavigateToCheckout={handleCartClick}
        onProductClick={handleProductClick}
        addComboToCart={addComboToCart}
        removeComboFromCart={removeComboFromCart}
      />
    );
  };

  const ClientAreaLayout = () => (
    <div className="h-screen overflow-hidden bg-slate-100 animate-in fade-in">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-800 bg-slate-900 p-4 text-slate-300 shadow-2xl">
        <div className="mb-8 flex cursor-pointer items-center gap-1 px-2 text-xl font-bold text-white" onClick={navigateToHome}>
          Epoca <span className="text-[#be342e]">B2B</span>
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
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
          <NavLink
            to="/cliente/pedidos"
            className={({ isActive }) =>
              `block rounded-md px-4 py-2 transition-colors ${isActive ? 'bg-slate-800 text-white' : 'hover:bg-slate-800'}`
            }
          >
            Meus Pedidos
          </NavLink>
          <a href="#" className="block rounded-md px-4 py-2 hover:bg-slate-800">Financeiro</a>
          <a href="#" className="block rounded-md px-4 py-2 hover:bg-slate-800">Catalogo</a>
        </nav>
        <div className="mt-4 border-t border-slate-800 pt-4">
          <Button variant="ghost" className="w-full justify-start text-slate-400" onClick={handleClientLogout}>
            Sair
          </Button>
        </div>
      </aside>
      <main className="ml-64 h-screen overflow-y-auto p-4 md:p-8">
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
              onNavigateToCombos={navigateToCombos}
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
        <Route
          path="/combos"
          element={
            <CombosPage
              currentUser={currentUser}
              cart={cart}
              favoriteIds={favoriteIds}
              onNavigateToHome={navigateToHome}
              onNavigateToClient={handleClientAreaClick}
              onNavigateToFavorites={navigateToFavorites}
              onNavigateToCheckout={handleCartClick}
              onComboClick={handleComboClick}
              addComboToCart={addComboToCart}
              removeComboFromCart={removeComboFromCart}
            />
          }
        />
        <Route path="/produto/:productId" element={<ProductDetailRoute />} />
        <Route path="/combo/:comboId" element={<ComboDetailRoute />} />
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
                currentUser={currentUser}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onNavigateToHome={navigateToHome}
                onNavigateToOrders={handleNavigateToOrders}
                onOrderPlaced={handleOrderPlaced}
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
          <Route
            path="pedidos"
            element={
              <ClientOrdersPage
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
