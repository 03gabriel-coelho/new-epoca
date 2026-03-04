
import React, { useState, useRef, useEffect } from 'react';
import { Button, Badge, Card, CardContent } from './ui/Layout';
import { ArrowLeft, Search, Filter, ChevronRight, ShoppingCart, Package, X, ChevronDown, History, Zap, Heart } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { CartItem } from '../types';

interface ProductsPageProps {
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
  onNavigateToCheckout: () => void;
  onProductClick: (id: string) => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
}

const CATEGORIES = [
  "BAZAR",
  "BEBIDAS",
  "BOMBONIERE",
  "FARMACIA",
  "LIMPEZA",
  "MERCEARIA",
  "PAPELARIA",
  "PERFUMARIA",
  "PROMOÇÕES"
];

const ProductsPage: React.FC<ProductsPageProps> = ({ 
  onNavigateToHome, 
  onNavigateToClient, 
  onNavigateToCheckout,
  onProductClick,
  cart,
  addToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("PROMOÇÕES");
  
  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [searchScope, setSearchScope] = useState("ALL"); // 'ALL' or specific category
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
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

  // Filter Logic
  // 1. Suggestions (Autocomplete)
  const suggestions = mockProducts.filter(p => {
    if (!searchTerm) return false;
    const matchesTerm = p.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.winthor_codprod.toString().includes(searchTerm);
    const matchesScope = searchScope === "ALL" || p.department.toUpperCase() === searchScope;
    return matchesTerm && matchesScope;
  }).slice(0, 5); // Limit to 5 suggestions

  // 2. Main Grid Filter
  const filteredProducts = mockProducts.filter(p => {
    // If searching, prioritize search params
    if (searchTerm) {
      const matchesTerm = p.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.winthor_codprod.toString().includes(searchTerm);
      const matchesScope = searchScope === "ALL" || p.department.toUpperCase() === searchScope;
      return matchesTerm && matchesScope;
    }
    // Else, filter by Sidebar Category
    const matchesCategory = selectedCategory === "PROMOÇÕES" || p.department.toUpperCase() === selectedCategory;
    return matchesCategory;
  });

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 flex flex-col">
      {/* WALMART STYLE HEADER */}
      <header className="sticky top-0 z-50 bg-[#be342e] text-white shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
          
          {/* Brand & Back */}
          <div className="flex items-center gap-6 flex-shrink-0">
             <Button variant="ghost" onClick={onNavigateToHome} className="pl-0 hover:bg-[#b70e0c] text-white rounded-full px-4">
               <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
             </Button>
             
             <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
                <span className="text-xl md:text-2xl font-bold tracking-tight">Época</span>
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#FFC220] fill-[#FFC220]" />
             </div>
          </div>
          
          {/* Enhanced Search Bar (Pill Shape) */}
          <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchContainerRef}>
             <div className="flex h-11 w-full rounded-full bg-white transition-all shadow-sm items-center">
                
                {/* Scope Selector */}
                <div className="relative border-r border-slate-200 hidden sm:block h-full">
                   <select 
                      className="h-full pl-4 pr-8 bg-transparent text-xs font-bold text-slate-600 uppercase tracking-wide focus:outline-none cursor-pointer appearance-none rounded-l-full hover:bg-slate-100 transition-colors"
                      value={searchScope}
                      onChange={(e) => setSearchScope(e.target.value)}
                   >
                      <option value="ALL">Todos</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                   <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                {/* Text Input */}
                <div className="flex-1 relative h-full">
                  <input 
                    type="text" 
                    placeholder="Buscar por nome, código RCA ou marca..." 
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
                  {/* Search Button (Yellow) */}
                  <button className="absolute right-1 top-1 h-9 w-9 bg-[#FFC220] hover:bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 transition-colors">
                      <Search className="w-5 h-5" />
                  </button>
                </div>
             </div>

             {/* Autocomplete Suggestions Dropdown */}
             {showSuggestions && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 text-slate-900">
                   {suggestions.length > 0 ? (
                     <ul>
                       <li className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                          Sugestões
                       </li>
                       {suggestions.map((product) => (
                         <li 
                            key={product.id} 
                            onClick={() => handleSuggestionClick(product.description)}
                            className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors group"
                         >
                            <img src={product.image_path} alt="" className="w-10 h-10 rounded-md object-cover bg-white border border-slate-100" />
                            <div className="flex-1">
                               <p className="text-sm font-bold text-slate-700 group-hover:text-[#be342e]">{product.description}</p>
                               <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <span>{product.department}</span>
                                  <span>•</span>
                                  <span>Cód: {product.winthor_codprod}</span>
                               </div>
                            </div>
                            <span className="font-bold text-[#be342e] text-sm">R$ {product.price.toFixed(2)}</span>
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

          <button onClick={onNavigateToCheckout} className="flex flex-col items-center justify-center px-3 hover:bg-[#b70e0c] rounded-full py-1 text-white relative">
              <ShoppingCart className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="absolute top-0 right-1 w-4 h-4 bg-[#FFC220] text-slate-900 rounded-full text-[10px] flex items-center justify-center font-bold">{cartCount}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6">
        {/* Sidebar Categories */}
        <aside className="w-64 hidden lg:block flex-shrink-0">
           <div className="sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 px-2 flex items-center gap-2 uppercase text-xs tracking-wider text-slate-500">
                <Filter className="w-3 h-3" /> Departamentos
              </h3>
              <nav className="space-y-1">
                 {CATEGORIES.map(cat => (
                   <button
                     key={cat}
                     onClick={() => {
                       setSelectedCategory(cat);
                       setSearchTerm(""); // Clear search to show category view
                       setSearchScope("ALL");
                     }}
                     className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex justify-between items-center group ${
                       selectedCategory === cat && !searchTerm
                         ? "bg-white text-[#be342e] border-l-4 border-[#be342e] shadow-sm" 
                         : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-[#be342e]"
                     }`}
                   >
                     {cat}
                     {selectedCategory === cat && !searchTerm && <ChevronRight className="w-4 h-4" />}
                   </button>
                 ))}
              </nav>

              <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                 <p className="font-bold text-lg mb-2 text-slate-800">Ajuda B2B</p>
                 <p className="text-slate-500 text-sm mb-4">Precisa de uma cotação especial para grandes volumes?</p>
                 <Button 
                   className="w-full bg-[#be342e] hover:bg-[#b70e0c] text-white rounded-full font-bold text-xs h-9"
                   onClick={() => window.open('https://wa.me/5531999999999', '_blank')}
                 >
                   Falar com Consultor
                 </Button>
              </div>
           </div>
        </aside>

        {/* Product Grid */}
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
                   {filteredProducts.length} itens encontrados 
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   Sync ERP WinThor
                </p>
              </div>
              <div className="flex gap-2">
                 <select className="h-10 rounded-full border border-slate-300 bg-white text-sm px-4 focus:outline-none focus:ring-2 focus:ring-[#be342e] cursor-pointer shadow-sm text-slate-700 font-medium">
                    <option>Relevância</option>
                    <option>Menor Preço</option>
                    <option>Maior Preço</option>
                    <option>Mais Vendidos</option>
                 </select>
              </div>
           </div>

           {filteredProducts.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col min-h-[390px] border border-transparent hover:border-[#be342e] group">
                      <div 
                        className="h-44 mb-4 relative flex items-center justify-center cursor-pointer"
                        onClick={() => onProductClick(product.id)}
                      >
                         <div className="w-full h-full p-3 bg-slate-50 rounded-xl border border-slate-100">
                           <img
                             src={product.image_path}
                             alt={product.description}
                             className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                           />
                         </div>
                         <button className="absolute top-0 right-0 p-2 text-slate-300 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                            <Heart className="w-5 h-5" />
                         </button>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900">R$ {Math.floor(product.price)}</span>
                            <span className="text-sm font-bold text-slate-900">,{(product.price % 1).toFixed(2).split('.')[1]}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">cada</span>
                      </div>

                      <a 
                        className="text-sm text-slate-700 hover:underline line-clamp-2 mt-2 mb-4 cursor-pointer min-h-[40px]"
                        onClick={() => onProductClick(product.id)}
                      >
                            {product.description}
                      </a>

                      <p className="text-[10px] text-slate-400 mb-3 font-mono">CÓD: {product.winthor_codprod}</p>

                      <Button onClick={() => addToCart(product.id)} variant="outline" className="w-full rounded-full border-[#be342e] text-[#be342e] hover:bg-[#be342e] hover:text-white font-bold h-9 text-xs transition-colors">
                          Adicionar
                      </Button>
                  </div>
                ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum resultado encontrado</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-6">Não encontramos produtos correspondentes à sua busca em "{selectedCategory}".</p>
                <Button className="bg-[#be342e] text-white rounded-full" onClick={clearSearch}>Limpar Filtros</Button>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
