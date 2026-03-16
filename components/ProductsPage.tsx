import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import PixBadge from './ui/PixBadge';
import { ArrowLeft, Search, Filter, ChevronRight, ShoppingCart, Package, X, ChevronDown, Heart, User, Minus, Plus } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { AuthUser, CartItem, Product } from '../types';

interface ProductsPageProps {
  currentUser: AuthUser | null;
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToCheckout: () => void;
  onProductClick: (id: string) => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
}

const CATEGORIES = [
  'BAZAR',
  'BEBIDAS',
  'BOMBONIERE',
  'FARMACIA',
  'LIMPEZA',
  'MERCEARIA',
  'PAPELARIA',
  'PERFUMARIA',
  'PROMOÇÕES'
];

const getBestSellerScore = (product: Product) => {
  const stockWeight = product.details?.stock_quantity ?? 0;
  const codeWeight = Number(product.winthor_codprod) % 1000;
  return stockWeight + codeWeight;
};

const ProductsPage: React.FC<ProductsPageProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToClient,
  onNavigateToFavorites,
  onNavigateToCheckout,
  onProductClick,
  cart,
  addToCart,
  removeFromCart,
  favoriteIds,
  toggleFavorite
}) => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>('PROMOÇÕES');
  const [sortOrder, setSortOrder] = useState<'RELEVANCE' | 'LOWEST_PRICE' | 'HIGHEST_PRICE' | 'BEST_SELLERS'>('RELEVANCE');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchScope, setSearchScope] = useState('ALL');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const displayName = currentUser?.companyName?.split(' ')[0] || 'Entrar';

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const product = mockProducts.find(p => p.id === item.product_id);
    return acc + (item.quantity * (product?.price || 0));
  }, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const departmentParam = params.get('departamento')?.toUpperCase();

    if (departmentParam && CATEGORIES.includes(departmentParam)) {
      setSelectedCategory(departmentParam);
      setSearchTerm('');
      setSearchScope('ALL');
      return;
    }

    setSelectedCategory('PROMOÇÕES');
  }, [location.search]);

  const suggestions = mockProducts.filter(product => {
    if (!searchTerm) {
      return false;
    }

    const matchesTerm = product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.winthor_codprod.toString().includes(searchTerm);
    const matchesScope = searchScope === 'ALL' || product.department.toUpperCase() === searchScope;

    return matchesTerm && matchesScope;
  }).slice(0, 5);

  const filteredProducts = mockProducts.filter(product => {
    if (searchTerm) {
      const matchesTerm = product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.winthor_codprod.toString().includes(searchTerm);
      const matchesScope = searchScope === 'ALL' || product.department.toUpperCase() === searchScope;
      return matchesTerm && matchesScope;
    }

    return selectedCategory === 'PROMOÇÕES' || product.department.toUpperCase() === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'LOWEST_PRICE':
        return a.price - b.price;
      case 'HIGHEST_PRICE':
        return b.price - a.price;
      case 'BEST_SELLERS':
        return getBestSellerScore(b) - getBestSellerScore(a);
      default:
        return 0;
    }
  });

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-[#be342e] text-white shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-shrink-0">
            <Button variant="ghost" onClick={onNavigateToHome} className="pl-0 hover:bg-[#b70e0c] text-white rounded-full px-4">
              <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
            </Button>

            <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
              <img className="h-12" src="./lib/images/logo1.webp" />
            </div>
          </div>

          <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchContainerRef}>
            <div className="flex h-11 w-full rounded-full bg-white transition-all shadow-sm items-center">
              <div className="relative border-r border-slate-200 hidden sm:block h-full">
                <select
                  className="h-full pl-4 pr-8 bg-transparent text-xs font-bold text-slate-600 uppercase tracking-wide focus:outline-none cursor-pointer appearance-none rounded-l-full hover:bg-slate-100 transition-colors"
                  value={searchScope}
                  onChange={(e) => setSearchScope(e.target.value)}
                >
                  <option value="ALL">Todos</option>
                  {CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>

              <div className="flex-1 relative h-full">
                <input
                  type="text"
                  placeholder="Buscar por nome, codigo RCA ou marca..."
                  className="w-full h-full pl-4 pr-12 bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400 rounded-r-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button className="absolute right-1 top-1 h-9 w-9 bg-[#FFC220] hover:bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showSuggestions && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 text-slate-900">
                {suggestions.length > 0 ? (
                  <ul>
                    <li className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                      Sugestoes
                    </li>
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleSuggestionClick(product.description)}
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors group"
                      >
                        <ProductImage
                          src={product.image_path}
                          alt={product.description}
                          className="w-10 h-10 rounded-md border border-slate-100"
                          imgClassName="w-full h-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700 group-hover:text-[#be342e]">{product.description}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>{product.department}</span>
                            <span>•</span>
                            <span>Cod: {product.winthor_codprod}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#be342e] text-sm">R$ {product.price.toFixed(2)}</span>
                          <div className="mt-1">
                            <PixBadge />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Nenhum produto encontrado.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onNavigateToClient} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1 text-white">
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">{displayName}</span>
            </button>
            <button onClick={onNavigateToFavorites} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1 text-white">
              <Heart className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Favoritos</span>
            </button>
            <button onClick={onNavigateToCheckout} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1 text-white relative">
              <ShoppingCart className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="absolute top-0 right-1 w-4 h-4 bg-[#FFC220] text-slate-900 rounded-full text-[10px] flex items-center justify-center font-bold">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6">
        <aside className="w-64 hidden lg:block flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4 px-2 flex items-center gap-2 uppercase text-xs tracking-wider text-slate-500">
              <Filter className="w-3 h-3" /> Departamentos
            </h3>
            <nav className="space-y-1">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchTerm('');
                    setSearchScope('ALL');
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex justify-between items-center group ${
                    selectedCategory === category && !searchTerm
                      ? 'bg-white text-[#be342e] border-l-4 border-[#be342e] shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-[#be342e]'
                  }`}
                >
                  {category}
                  {selectedCategory === category && !searchTerm && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </nav>

            <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <p className="font-bold text-lg mb-2 text-slate-800">Ajuda B2B</p>
              <p className="text-slate-500 text-sm mb-4">Precisa de uma cotacao especial para grandes volumes?</p>
              <Button
                className="w-full bg-[#be342e] hover:bg-[#b70e0c] text-white rounded-full font-bold text-xs h-9"
                onClick={() => window.open('https://wa.me/5531999999999', '_blank')}
              >
                Falar com Consultor
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {searchTerm ? (
                  <>Resultados para <span className="text-[#be342e]">"{searchTerm}"</span></>
                ) : (
                  selectedCategory
                )}
              </h1>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                {sortedProducts.length} itens encontrados
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Sync ERP WinThor
              </p>
            </div>
            <div className="flex gap-2">
              <select
                className="h-10 rounded-full border border-slate-300 bg-white text-sm px-4 focus:outline-none focus:ring-2 focus:ring-[#be342e] cursor-pointer shadow-sm text-slate-700 font-medium"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'RELEVANCE' | 'LOWEST_PRICE' | 'HIGHEST_PRICE' | 'BEST_SELLERS')}
              >
                <option value="RELEVANCE">Relevancia</option>
                <option value="LOWEST_PRICE">Menor Preco</option>
                <option value="HIGHEST_PRICE">Maior Preco</option>
                <option value="BEST_SELLERS">Mais Vendidos</option>
              </select>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {sortedProducts.map((product) => {
                const quantityInCart = cart.find(item => item.product_id === product.id)?.quantity || 0;
                const isFavorite = favoriteIds.includes(product.id);

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
                        className={`absolute top-0 right-0 p-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-slate-900">R$ {Math.floor(product.price)}</span>
                        <span className="text-sm font-bold text-slate-900">,{(product.price % 1).toFixed(2).split('.')[1]}</span>
                      </div>
                      <div className="mt-1">
                        <PixBadge label="no PIX" />
                      </div>
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
                          <Minus className="w-4 h-4" />
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
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum resultado encontrado</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-6">Nao encontramos produtos correspondentes a sua busca em "{selectedCategory}".</p>
              <Button className="bg-[#be342e] text-white rounded-full" onClick={clearSearch}>Limpar Filtros</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
