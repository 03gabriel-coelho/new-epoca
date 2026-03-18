import React, { useMemo } from 'react';
import { Button } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { AuthUser, CartItem } from '../types';
import { getPricedProducts } from '../lib/pricing';
import Logo from "../lib/images/logo1.webp";

interface FavoritesPageProps {
  currentUser: AuthUser | null;
  currentZipCode: string;
  favoriteIds: string[];
  cart: CartItem[];
  onNavigateToHome: () => void;
  onNavigateToCheckout: () => void;
  onProductClick: (id: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  currentUser,
  currentZipCode,
  favoriteIds,
  cart,
  onNavigateToHome,
  onNavigateToCheckout,
  onProductClick,
  addToCart,
  removeFromCart,
  toggleFavorite
}) => {
  const pricedProducts = useMemo(() => getPricedProducts(mockProducts, currentZipCode || currentUser?.zipCode), [currentUser?.zipCode, currentZipCode]);
  const favoriteProducts = pricedProducts.filter(product => favoriteIds.includes(product.id));
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const product = pricedProducts.find(p => p.id === item.product_id);
    return acc + (item.quantity * (product?.price || 0));
  }, 0);
  const title = currentUser ? `Favoritos de ${currentUser.companyName}` : 'Meus Favoritos';

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-[#be342e] text-white shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-shrink-0">
            <Button variant="primary" onClick={onNavigateToHome} className="pl-0 hover:bg-[#b70e0c] text-white rounded-full px-4">
              <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
            </Button>
            <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
              <img className="h-12" src={Logo} />
            </div>
          </div>

          <button onClick={onNavigateToCheckout} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1 text-white relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="absolute top-0 right-1 w-4 h-4 bg-[#FFC220] text-slate-900 rounded-full text-[10px] flex items-center justify-center font-bold">{cartCount}</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 mt-1">{favoriteProducts.length} itens salvos na sua lista.</p>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {favoriteProducts.map((product) => {
              const quantityInCart = cart.find(item => item.product_id === product.id)?.quantity || 0;

              return (
                <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col min-h-[390px] border border-transparent hover:border-[#be342e] group">
                  <div className="h-44 mb-4 relative flex items-center justify-center cursor-pointer" onClick={() => onProductClick(product.id)}>
                    <div className="w-full h-full p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <ProductImage
                        src={product.image_path}
                        alt={product.description}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <button
                      className="absolute top-0 right-0 p-2 text-red-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-900">R$ {Math.floor(product.price)}</span>
                      <span className="text-sm font-bold text-slate-900">,{(product.price % 1).toFixed(2).split('.')[1]}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">cada</span>
                  </div>

                  <a className="text-sm text-slate-700 hover:underline line-clamp-2 mt-2 mb-4 cursor-pointer min-h-[40px]" onClick={() => onProductClick(product.id)}>
                    {product.description}
                  </a>

                  <p className="text-[10px] text-slate-400 mb-3 font-mono">COD: {product.winthor_codprod}</p>

                  {quantityInCart > 0 ? (
                    <div className="flex items-center justify-between rounded-full border border-[#be342e] bg-[#fff5f5] px-2 py-1">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#be342e] hover:bg-[#be342e] hover:text-white transition-colors"
                        aria-label={`Remover uma unidade de ${product.description}`}
                      >
                        {quantityInCart === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      </button>
                      <span className="text-sm font-bold text-[#be342e]">{quantityInCart}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c] transition-colors"
                        aria-label={`Adicionar uma unidade de ${product.description}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <Button onClick={() => addToCart(product.id)} variant="outline" className="w-full rounded-full border-[#be342e] text-[#be342e] hover:bg-[#be342e] font-bold h-9 text-xs transition-colors">
                      Adicionar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#fff0f0] flex items-center justify-center mx-auto mb-4 text-[#be342e]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sua lista de favoritos está vazia</h2>
            <p className="text-slate-500 mb-6">Clique no coração dos produtos para salvar itens e acompanhar depois.</p>
            <Button onClick={onNavigateToHome} className="bg-[#be342e] hover:bg-[#b70e0c] text-white">
              Explorar produtos
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
