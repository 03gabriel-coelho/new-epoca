
import React, { useEffect, useState } from 'react';
import { Button, Badge } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import PixBadge from './ui/PixBadge';
import { ArrowLeft, ShoppingCart, MapPin, Ruler, Scale, Box, Info, Heart, Share2, Zap, Check, Star, Minus, Plus, User } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { AuthUser, CartItem } from '../types';
import Logo from "../lib/images/logo1.webp";

interface ProductDetailPageProps {
  productId: string;
  currentUser: AuthUser | null;
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToCheckout: () => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  currentUser,
  onNavigateToHome,
  onNavigateToClient,
  onNavigateToFavorites,
  onNavigateToCheckout,
  cart,
  addToCart,
  removeFromCart,
  favoriteIds,
  toggleFavorite
}) => {
  const product = mockProducts.find(p => p.id === productId);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Produto não encontrado</h2>
          <Button onClick={onNavigateToHome} className="mt-4">Voltar para Loja</Button>
        </div>
      </div>
    );
  }

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const p = mockProducts.find(prod => prod.id === item.product_id);
    return acc + (item.quantity * (p?.price || 0));
  }, 0);

  const itemInCart = cart.find(item => item.product_id === product.id);
  const quantityInCart = itemInCart?.quantity || 0;
  const isFavorite = favoriteIds.includes(product.id);
  const displayName = currentUser?.companyName?.split(' ')[0] || 'Entrar';
  const productImages = product.gallery_images?.length ? product.gallery_images : [product.image_path];
  const [selectedImage, setSelectedImage] = useState(productImages[0]);

  useEffect(() => {
    setSelectedImage(productImages[0]);
  }, [product.id]);

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 pb-20">
      {/* HEADER (Standard) */}
      <header className="sticky top-0 z-50 bg-[#be342e] text-white shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 flex-shrink-0">
             <Button variant="primary" onClick={onNavigateToHome} className="pl-0 hover:bg-[#b70e0c] text-white rounded-full px-4">
               <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
             </Button>
             
             <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
                <img className="h-12" src={Logo}/>
             </div>
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

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
           <span className="cursor-pointer hover:underline" onClick={onNavigateToHome}>Home</span>
           <span>/</span>
           <span className="cursor-pointer hover:underline">{product.department}</span>
           <span>/</span>
           <span className="font-bold text-slate-800">{product.description}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Images */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
               <div className="aspect-square w-full h-[390px] flex items-center justify-center relative group">
                  <ProductImage
                    src={selectedImage}
                    alt={product.description}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-contain"
                    loading="eager"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                     <button
                       className={`p-2 rounded-full bg-slate-50 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:bg-slate-100 hover:text-red-500'}`}
                       onClick={() => toggleFavorite(product.id)}
                     >
                        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                     </button>
                     <button className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-[#be342e] transition-colors">
                        <Share2 className="w-6 h-6" />
                     </button>
                  </div>
               </div>
               {/* Thumbnail strip */}
               <div className="flex gap-4 mt-6 justify-center">
                  {productImages.map((image, index) => (
                     <button
                       type="button"
                       key={`${product.id}-${index}`}
                       onClick={() => setSelectedImage(image)}
                       className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer overflow-hidden ${selectedImage === image ? 'border-[#be342e]' : 'border-slate-100 hover:border-slate-300'}`}
                     >
                         <ProductImage
                           src={image}
                           alt={product.description}
                           className="w-full h-full"
                           imgClassName="w-full h-full object-contain"
                         />
                     </button>
                  ))}
               </div>
            </div>

            {/* Right Column: Buy Box & Info */}
            <div className="lg:col-span-5 space-y-6">
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <Badge variant="brand" className="mb-2 uppercase text-[10px] tracking-wider bg-blue-50 text-[#be342e] border-blue-100">Cód: {product.winthor_codprod}</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 leading-tight">{product.description}</h1>
                  
                  <div className="flex items-center gap-2 mb-6">
                     <div className="flex text-[#FFC220]">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                     </div>
                     <span className="text-xs text-slate-500">(12 avaliações)</span>
                     <span className="text-slate-300">|</span>
                     <span className="text-xs text-[#be342e] font-bold">Marca: {product.details?.brand || 'Genérica'}</span>
                  </div>

                  <div className="mb-6">
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span className="text-sm text-slate-500">/{product.details?.unit || 'un'}</span>
                     </div>
                     <div className="mt-2">
                        <PixBadge label="preco valido no PIX" className="text-[11px]" />
                     </div>
                  </div>

                  <div className="space-y-4">
                     {quantityInCart > 0 ? (
                        <div className="flex items-center justify-between rounded-full border border-[#be342e] bg-[#fff5f5] px-3 py-2">
                           <button
                             onClick={() => removeFromCart(product.id)}
                             className="flex h-10 w-10 items-center justify-center rounded-full text-[#be342e] hover:bg-[#be342e] hover:text-white transition-colors"
                             aria-label={`Remover uma unidade de ${product.description}`}
                           >
                             <Minus className="w-5 h-5" />
                           </button>
                           <div className="flex items-center gap-2 text-[#be342e]">
                             <ShoppingCart className="w-5 h-5" />
                             <span className="text-lg font-bold">{quantityInCart}</span>
                           </div>
                           <button
                             onClick={() => addToCart(product.id)}
                             className="flex h-10 w-10 items-center justify-center rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c] transition-colors"
                             aria-label={`Adicionar uma unidade de ${product.description}`}
                           >
                             <Plus className="w-5 h-5" />
                           </button>
                        </div>
                     ) : (
                        <Button 
                           onClick={() => addToCart(product.id)}
                           className="w-full h-12 rounded-full bg-[#be342e] hover:bg-[#b70e0c] text-white font-bold text-lg shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                        >
                           <ShoppingCart className="w-5 h-5" />
                           Adicionar ao Carrinho
                        </Button>
                     )}
                     
                     <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-2">
                           <MapPin className="w-4 h-4" /> Entrega regionalizada
                        </p>
                        <p className="text-sm text-slate-600">
                           O valor deste item ja considera a politica comercial da sua regiao. No checkout voce apenas confirma o endereco de entrega.
                        </p>
                        <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" className="text-[10px] text-[#be342e] underline mt-2 block">Não sei meu CEP</a>
                     </div>
                  </div>
               </div>

               {/* Quick Specs Card */}
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#be342e]" /> Destaques
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                         <Box className="w-5 h-5 text-slate-400 mt-1" />
                         <div>
                            <p className="text-xs text-slate-500">Estoque</p>
                            <p className="text-sm font-bold text-slate-800">{product.details?.stock_quantity || 0} disponíveis</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <Scale className="w-5 h-5 text-slate-400 mt-1" />
                         <div>
                            <p className="text-xs text-slate-500">Peso Líq.</p>
                            <p className="text-sm font-bold text-slate-800">{product.details?.weight || '-'}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <Ruler className="w-5 h-5 text-slate-400 mt-1" />
                         <div>
                            <p className="text-xs text-slate-500">Dimensões</p>
                            <p className="text-sm font-bold text-slate-800">{product.details?.height} x {product.details?.width}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-green-500 mt-1" />
                         <div>
                            <p className="text-xs text-slate-500">Garantia</p>
                            <p className="text-sm font-bold text-slate-800">30 dias direto</p>
                         </div>
                      </div>
                   </div>
               </div>
            </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="flex border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('desc')}
                className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'desc' ? 'border-b-4 border-[#be342e] text-[#be342e] bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                 Descrição do Produto
              </button>
              <button 
                onClick={() => setActiveTab('specs')}
                className={`px-8 py-4 font-bold text-sm transition-colors ${activeTab === 'specs' ? 'border-b-4 border-[#be342e] text-[#be342e] bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                 Especificações Técnicas
              </button>
           </div>
           
           <div className="p-8">
              {activeTab === 'desc' ? (
                 <div className="prose max-w-none text-slate-600">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Sobre o produto</h3>
                    <p className="leading-relaxed">
                       {product.long_description || product.description}
                    </p>
                    <p className="mt-4 leading-relaxed">
                       Ideal para abastecimento de gôndolas de varejo, mercearias e supermercados. Produto de alto giro com validade estendida e garantia de procedência direto da indústria. Acondicionado em embalagem resistente para transporte logístico.
                    </p>
                 </div>
              ) : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                       <tbody className="divide-y divide-slate-100">
                          <tr className="bg-slate-50/50">
                             <td className="py-3 px-4 font-bold text-slate-700 w-1/3">Código WinThor</td>
                             <td className="py-3 px-4 text-slate-600">{product.winthor_codprod}</td>
                          </tr>
                          <tr>
                             <td className="py-3 px-4 font-bold text-slate-700">Fabricante</td>
                             <td className="py-3 px-4 text-slate-600">{product.details?.manufacturer || '-'}</td>
                          </tr>
                          <tr className="bg-slate-50/50">
                             <td className="py-3 px-4 font-bold text-slate-700">Marca</td>
                             <td className="py-3 px-4 text-slate-600">{product.details?.brand || '-'}</td>
                          </tr>
                          <tr>
                             <td className="py-3 px-4 font-bold text-slate-700">EAN / Código de Barras</td>
                             <td className="py-3 px-4 text-slate-600 font-mono">{product.details?.ean || '-'}</td>
                          </tr>
                          <tr className="bg-slate-50/50">
                             <td className="py-3 px-4 font-bold text-slate-700">Unidade de Venda</td>
                             <td className="py-3 px-4 text-slate-600">{product.details?.unit || 'UN'}</td>
                          </tr>
                          <tr>
                             <td className="py-3 px-4 font-bold text-slate-700">Peso Bruto</td>
                             <td className="py-3 px-4 text-slate-600">{product.details?.weight || '-'}</td>
                          </tr>
                          <tr className="bg-slate-50/50">
                             <td className="py-3 px-4 font-bold text-slate-700">Dimensões (AxLxC)</td>
                             <td className="py-3 px-4 text-slate-600">{product.details?.height} x {product.details?.width} x {product.details?.length}</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              )}
           </div>
        </div>

      </main>
    </div>
  );
};

export default ProductDetailPage;
