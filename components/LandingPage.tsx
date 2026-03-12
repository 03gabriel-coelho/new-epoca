
import React, { useState, useEffect, useRef } from 'react';
import { mockProducts, vendorLogos } from '../lib/mockData';
import { Button, Badge } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import { ArrowRight, Box, ShieldCheck, Truck, Menu, X, Lock, Search, ChevronLeft, ChevronRight, User, ShoppingCart, Heart, Grid, Zap, MapPin, Loader2, Minus, Plus } from 'lucide-react';
import { AuthUser, CartItem } from '../types';
import bannerTopo1 from '../lib/images/banner_topo_1.webp';
import bannerTopo2 from '../lib/images/banner_topo_2.webp';
import bannerTopo3 from '../lib/images/banner_topo_3.webp';

interface LandingPageProps {
  currentUser: AuthUser | null;
  onNavigateToClient: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToProducts: () => void;
  onNavigateToSuppliers: () => void;
  onNavigateToInstitutional: () => void;
  onNavigateToCheckout: () => void;
  onProductClick: (id: string) => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
}

const VendorTicker = () => {
  const activeVendors = vendorLogos
    .filter((vendor) => vendor.ativo === 'S')
    .sort((a, b) => a.ordem - b.ordem);
  const getVendorImageSrc = (imageName: string) =>
    `https://storage.epocaonline.com.br/fornecedores/${imageName}`;

  return (
    <div className="w-full bg-white border-y border-slate-200 py-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
      <div className="flex w-[200%] animate-[marquee_40s_linear_infinite] items-center">
        {[...activeVendors, ...activeVendors].map((vendor, index) => (
          <a
            key={`${vendor.codmarca}-${index}`}
            href={vendor.url}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex justify-center items-center min-w-[150px] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer group px-4"
            title={vendor.nome}
          >
            <img
              src={getVendorImageSrc(vendor.img)}
              alt={vendor.nome}
              className="h-12 max-w-[140px] object-contain"
              loading="lazy"
              onError={(event) => {
                const target = event.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span className="hidden text-sm font-bold text-slate-700">{vendor.nome}</span>
          </a>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const MainCarousel = ({
  onNavigateToProducts
}: {
  onNavigateToProducts: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      id: 1,
      image: bannerTopo1,
      alt: 'Banner principal Epoca 1'
    },
    {
      id: 2,
      image: bannerTopo2,
      alt: 'Banner principal Epoca 2'
    },
    {
      id: 3,
      image: bannerTopo3,
      alt: 'Banner principal Epoca 3'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!document.hidden) {
        nextSlide();
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group bg-white">
      <div className="relative w-full aspect-[21/9] md:aspect-[3/1] lg:h-[400px]">
        <button
          type="button"
          className="absolute inset-0 w-full h-full cursor-pointer"
          onClick={onNavigateToProducts}
        >
          <img
            src={banners[currentIndex].image}
            alt={banners[currentIndex].alt}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </button>
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <Button
            onClick={onNavigateToProducts}
            className="bg-[#FFC220] hover:bg-yellow-400 text-slate-900 rounded-full px-6 h-11 text-sm shadow-lg"
          >
            Ver produtos <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-brand-blue p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-brand-blue p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-brand-blue w-6' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const LocationModal = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialCep
}: {
  isOpen: boolean,
  onClose: () => void,
  onLocationSelect: (cep: string) => void,
  initialCep: string
}) => {
  const [cep, setCep] = useState(initialCep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCep(initialCep);
      setError('');
    }
  }, [initialCep, isOpen]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    // Mask 00000-000
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setCep(value);
    setError('');
  };

  const handleSearch = async () => {
    const cleanCep = cep.replace('-', '');
    if (cleanCep.length !== 8) {
      setError('Digite um CEP vÃ¡lido com 8 dÃ­gitos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP nÃ£o encontrado.');
      } else {
        onLocationSelect(cleanCep.replace(/^(\d{5})(\d{3})$/, '$1-$2'));
        onClose();
      }
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">Informe seu CEP</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        
        <p className="text-slate-500 text-sm mb-6">
          Insira seu CEP para ver a disponibilidade de produtos e prazos de entrega para sua regiÃ£o.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CEP de Entrega</label>
            <div className="relative">
              <input 
                type="text" 
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                className={`w-full h-12 rounded-lg border px-4 pl-11 outline-none focus:ring-2 transition-all font-mono text-lg ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:border-[#be342e] focus:ring-blue-100'}`}
              />
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={loading || cep.length < 8}
            className="w-full h-12 rounded-full bg-[#be342e] hover:bg-[#b70e0c] text-white font-bold text-base shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Buscando...
              </div>
            ) : "Confirmar LocalizaÃ§Ã£o"}
          </Button>

          <button className="w-full text-center text-xs text-[#be342e] font-bold hover:underline">
            NÃ£o sei meu CEP
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ 
  currentUser,
  onNavigateToClient, 
  onNavigateToAdmin,
  onNavigateToFavorites,
  onNavigateToProducts,
  onNavigateToSuppliers,
  onNavigateToInstitutional,
  onNavigateToCheckout,
  onProductClick,
  cart,
  addToCart,
  removeFromCart,
  favoriteIds,
  toggleFavorite
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const displayName = currentUser?.companyName?.split(' ')[0] || 'Entrar';
  const cartTotal = cart.reduce((acc, item) => {
    const product = mockProducts.find(p => p.id === item.product_id);
    return acc + (item.quantity * (product?.price || 0));
  }, 0);

  // Close suggestions when clicking outside
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
    const detectedCep = '32150-240';
    setUserLocation(detectedCep);
  }, []);

  const suggestions = mockProducts.filter(p => {
    if (!searchTerm) return false;
    return p.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
           p.winthor_codprod.toString().includes(searchTerm);
  }).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 pb-20">
      
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        onLocationSelect={setUserLocation}
        initialCep={userLocation}
      />

      {/* WALMART STYLE HEADER */}
      <header className="bg-[#be342e] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center gap-6">
            
            {/* Logo */}
            <div className="flex items-center gap-1 cursor-pointer shrink-0" onClick={() => window.location.reload()}>
                {/* <span className="text-2xl font-bold tracking-tight">Ã‰poca</span>
                <Zap className="w-6 h-6 text-[#FFC220] fill-[#FFC220]" /> */}
                <img className="h-12" src="./lib/images/logo1.webp"/>
            </div>

            {/* Department Trigger */}
            <button 
              className="hidden lg:flex items-center gap-2 font-bold hover:bg-[#b70e0c] px-4 py-2 rounded-full transition-colors"
              onClick={onNavigateToProducts}
            >
                <Grid className="w-5 h-5" />
                <span>Departamentos</span>
            </button>
            <button 
              className="hidden lg:flex items-center gap-2 font-bold hover:bg-[#b70e0c] px-4 py-2 rounded-full transition-colors"
              onClick={onNavigateToSuppliers}
            >
                <Box className="w-5 h-5" />
                <span>Fornecedores</span>
            </button>

            {/* Search Bar (Pill Shape with Autocomplete) */}
            <div className="flex-1 max-w-3xl relative hidden md:block" ref={searchContainerRef}>
                <div className="relative">
                  <input 
                      type="text" 
                      placeholder="O que sua empresa precisa hoje?"
                      className="w-full h-11 rounded-full pl-5 pr-12 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FFC220]"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                  />
                  {searchTerm && (
                      <button 
                        onClick={() => { setSearchTerm(''); setShowSuggestions(false); }} 
                        className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                          <X className="w-4 h-4" />
                      </button>
                  )}
                  <button className="absolute right-1 top-1 h-9 w-9 bg-[#FFC220] hover:bg-yellow-400 rounded-full flex items-center justify-center text-slate-900">
                      <Search className="w-5 h-5" />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchTerm && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                      <ul>
                          <li className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                             Produtos Sugeridos
                          </li>
                          {suggestions.map((product) => (
                              <li 
                                  key={product.id} 
                                  onClick={() => {
                                      onProductClick(product.id);
                                      setShowSuggestions(false);
                                  }}
                                  className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors group"
                              >
                                  <ProductImage
                                    src={product.image_path}
                                    alt={product.description}
                                    className="w-10 h-10 rounded-md border border-slate-100"
                                    imgClassName="w-full h-full object-contain"
                                  />
                                  <div className="flex-1">
                                      <p className="text-sm font-bold text-slate-700 group-hover:text-[#be342e] line-clamp-1">{product.description}</p>
                                      <div className="flex items-center gap-2 text-xs text-slate-400">
                                         <span>{product.department}</span>
                                         <span>â€¢</span>
                                         <span>CÃ³d: {product.winthor_codprod}</span>
                                      </div>
                                  </div>
                                  <span className="font-bold text-[#be342e] text-sm whitespace-nowrap">R$ {product.price.toFixed(2)}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
                <button onClick={onNavigateToClient} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1">
                    <User className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-bold">{currentUser ? displayName : 'Entrar'}</span>
                </button>
                <button onClick={onNavigateToFavorites} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1">
                    <Heart className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-bold">Favoritos</span>
                </button>
                <button onClick={onNavigateToCheckout} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1 relative">
                    <ShoppingCart className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-bold">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="absolute top-0 right-1 w-4 h-4 bg-[#FFC220] text-slate-900 rounded-full text-[10px] flex items-center justify-center font-bold">{cartCount}</span>
                </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
        </div>

        {/* Subheader / Quick Links */}
        <div className="bg-[#e6f1fc] text-slate-800 py-2 border-b border-white/50">
            <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto text-xs font-bold scrollbar-hide">
                 <div 
                   className="flex items-center gap-3 mr-4 text-slate-900 bg-white/50 px-3 py-1 rounded-full hover:bg-white cursor-pointer transition-colors shrink-0"
                   onClick={() => setIsLocationModalOpen(true)}
                 >
                    <MapPin className="w-4 h-4 text-[#be342e]" />
                    <span>Receber em:</span>
                    <span className="text-[#be342e]">{userLocation || 'Buscando CEP...'}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-[#be342e]">
                      Alterar
                    </span>
                 </div>
                 <span className="w-px h-4 bg-slate-300 hidden md:block"></span>
                 <button onClick={onNavigateToProducts} className="whitespace-nowrap hover:underline">Ofertas da Semana</button>
                 <button onClick={onNavigateToSuppliers} className="whitespace-nowrap hover:underline">Marcas Parceiras</button>
                 <button onClick={onNavigateToInstitutional} className="whitespace-nowrap hover:underline">Institucional</button>
                 <button onClick={onNavigateToClient} className="whitespace-nowrap hover:underline text-[#be342e]">Recompra Fácil</button>
                 <div className="flex-1"></div>
                 <div className="flex items-center gap-4">
                    <button onClick={onNavigateToAdmin} className="whitespace-nowrap text-slate-500 hover:text-slate-800 flex items-center gap-1 group">
                        <Lock className="w-3 h-3 group-hover:text-[#be342e]" /> 
                        <span className="group-hover:text-[#be342e]">Admin</span>
                    </button>
                 </div>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white text-slate-900 border-b shadow-xl p-4 flex flex-col gap-4 z-50">
                <input type="text" placeholder="Buscar..." className="w-full h-10 border rounded px-3" />
                <button onClick={onNavigateToProducts} className="font-bold text-left py-2 border-b">Departamentos</button>
                <button onClick={onNavigateToSuppliers} className="font-bold text-left py-2 border-b">Fornecedores</button>
                <button onClick={onNavigateToClient} className="font-bold text-left py-2 border-b text-[#be342e]">Minha Conta</button>
            </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        
        {/* Hero Section (Contained) */}
        <MainCarousel onNavigateToProducts={onNavigateToProducts} />

        {/* Benefits Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: "Entrega Expressa", sub: "Em até 24h", icon: Truck },
                { label: "Compra Segura", sub: "Dados protegidos", icon: ShieldCheck },
                { label: "Atacado Online", sub: "Preço de gôndola", icon: Box },
                { label: "Mix Completo", sub: "+5.000 itens", icon: Grid },
            ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 border border-transparent hover:border-[#be342e] cursor-pointer transition-all">
                    <div className="text-[#be342e]"><item.icon className="w-6 h-6" /></div>
                    <div>
                        <p className="font-bold text-sm leading-tight">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.sub}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Products Grid (Walmart Style) */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Ofertas para seu Varejo</h2>
                <a onClick={onNavigateToProducts} className="text-[#be342e] text-sm font-medium hover:underline cursor-pointer">Ver tudo</a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {mockProducts.slice(0, 5).map((product) => {
                    const quantityInCart = cart.find(item => item.product_id === product.id)?.quantity || 0;
                    const isFavorite = favoriteIds.includes(product.id);

                    return (
                    <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 relative group flex flex-col h-full min-h-[370px] border border-slate-100">
                        {/* Image */}
                        <div 
                          className="h-44 mb-4 relative flex items-center justify-center cursor-pointer"
                          onClick={() => onProductClick(product.id)}
                        >
                            <div className="w-full h-full p-3 bg-slate-50 rounded-xl border border-slate-100">
                              <ProductImage
                                src={product.image_path}
                                alt={product.description}
                                className="w-full h-full"
                                imgClassName="w-full h-full object-contain group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <button
                              className={`absolute top-0 right-0 p-2 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product.id);
                              }}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                        
                        {/* Price */}
                        <div className="mt-auto">
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-900">R$ {Math.floor(product.price)}</span>
                                <span className="text-sm font-bold text-slate-900">,{(product.price % 1).toFixed(2).split('.')[1]}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">cada</span>
                        </div>

                        {/* Description */}
                        <a 
                          className="text-sm text-slate-700 hover:underline line-clamp-2 min-h-[40px] mt-1 mb-4 cursor-pointer"
                          onClick={() => onProductClick(product.id)}
                        >
                            {product.description} - {product.department}
                        </a>

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
                            <Button onClick={() => addToCart(product.id)} variant="outline" className="w-full rounded-full border-[#be342e] text-[#be342e] hover:bg-[#be342e] hover:text-[#be342e] font-bold h-9 text-xs">
                                Adicionar
                            </Button>
                        )}
                    </div>
                )})}
            </div>
        </section>

        {/* Vendor Ticker */}
        <VendorTicker />

        {/* Promo Grid (Bento Box style) */}
        <section className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#e6f1fc] rounded-2xl p-8 flex flex-col justify-center items-start min-h-[250px] relative overflow-hidden group">
                 <div className="relative z-10">
                    <Badge variant="brand" className="mb-2 bg-white">Campanha Sazonal</Badge>
                    <h3 className="text-2xl font-bold mb-2">Especial de Pascoa</h3>
                    <p className="mb-6 text-slate-600 max-w-xs">Reforce bomboniere e mercearia com itens de alto giro para a Semana Santa.</p>
                    <Button onClick={onNavigateToProducts} className="rounded-full text-[#be342e] bg-white text-slate-900 hover:bg-slate-100">Montar Pedido</Button>
                 </div>
                 <img src="https://placehold.co/420x420/e6f1fc/be342e?text=Pascoa" className="absolute bottom-0 right-0 w-48 h-48 object-contain mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform" />
            </div>
            <div className="bg-slate-900 rounded-2xl p-8 flex flex-col justify-center items-start min-h-[250px] relative overflow-hidden group text-white">
                 <div className="relative z-10">
                    <Badge variant="warning" className="mb-2 border-none">Abastecimento Inteligente</Badge>
                    <h3 className="text-2xl font-bold mb-2">Reposicao de Alto Giro</h3>
                    <p className="mb-6 text-slate-300 max-w-xs">Mercearia, limpeza e perfumaria com condicoes comerciais para recompra rapida.</p>
                    <Button onClick={onNavigateToProducts} className="rounded-full bg-[#FFC220] text-slate-900 hover:bg-yellow-400 border-none">Ver Departamentos</Button>
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#b70e0c] text-white pt-10 pb-6 mt-12 relative">
         <div className="container mx-auto px-4 text-center md:text-left">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h4 className="font-bold mb-4">Ajuda</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li><a href="#" className="hover:underline">Central de Atendimento</a></li>
                        <li><a href="#" className="hover:underline">Política de Trocas</a></li>
                        <li><a href="#" className="hover:underline">Cancelamento</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Serviços</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li><a href="#" className="hover:underline">Cartão Época</a></li>
                        <li><a href="#" className="hover:underline">Vendas Corporativas</a></li>
                        <li><a href="#" className="hover:underline">Garantia Estendida</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Institucional</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li><a href="#" className="hover:underline">Sobre Nós</a></li>
                        <li><a href="#" className="hover:underline">Trabalhe Conosco</a></li>
                        <li><a href="#" className="hover:underline">Relação com Investidores</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Receba Ofertas</h4>
                    <div className="flex bg-white rounded-full p-1">
                        <input type="email" placeholder="Seu e-mail" className="flex-1 bg-transparent px-3 text-slate-900 text-sm focus:outline-none" />
                        <button className="bg-[#be342e] text-white rounded-full px-4 py-1 text-sm font-bold">OK</button>
                    </div>
                </div>
            </div>
            <div className="border-t border-blue-400/30 pt-6 text-xs text-blue-200 flex flex-col md:flex-row justify-between items-center pb-12 md:pb-0">
                <p>© 2024 Época Online. Todos os direitos reservados.</p>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <span>Privacidade</span>
                    <span>Termos de Uso</span>
                    <span>Segurança</span>
                </div>
            </div>
         </div>
         {/* Admin Access Button in Footer */}
         <div className="absolute bottom-4 right-4 md:hidden">
             <button onClick={onNavigateToAdmin} className="p-2 bg-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/20">
                 <Lock className="w-4 h-4" />
             </button>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
