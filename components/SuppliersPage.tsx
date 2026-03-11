
import React, { useState } from 'react';
import { Button } from './ui/Layout';
import { ArrowLeft, Search, Truck } from 'lucide-react';
import { vendorLogos } from '../lib/mockData';
import { AuthUser, CartItem } from '../types';

interface SuppliersPageProps {
  currentUser: AuthUser | null;
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
  cart: CartItem[];
}

const SuppliersPage: React.FC<SuppliersPageProps> = ({ currentUser, onNavigateToHome, onNavigateToClient, cart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const buttonLabel = currentUser ? currentUser.companyName.split(' ')[0] : 'Acessar Portal B2B';

  const getVendorImageSrc = (imageName: string) =>
    `https://storage.epocaonline.com.br/fornecedores/${imageName}`
  const filteredVendors = vendorLogos
    .filter((vendor) => vendor.ativo === 'S')
    .sort((a, b) => a.ordem - b.ordem)
    .filter((vendor) => vendor.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Button variant="ghost" onClick={onNavigateToHome} className="pl-0 text-slate-500 hover:text-emerald-700">
               <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
             </Button>
             <h1 className="text-xl font-bold tracking-tight">Nossos Fornecedores</h1>
          </div>
          <Button onClick={onNavigateToClient} className="bg-emerald-600 hover:bg-emerald-700 text-white">
             {buttonLabel}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
              <Truck className="w-6 h-6 text-emerald-700" />
           </div>
           <h2 className="text-3xl font-bold text-slate-900 mb-4">Indústrias Parceiras</h2>
           <p className="text-slate-500 max-w-2xl mx-auto">
             Trabalhamos diretamente com as maiores indústrias do mercado para garantir procedência,
             validade e o melhor preço para o seu negócio. Lista sincronizada com ERP WinThor.
           </p>
        </div>

        <div className="max-w-md mx-auto mb-12 relative">
           <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
           <input 
             type="text" 
             placeholder="Buscar fornecedor..." 
             className="w-full h-11 pl-10 pr-4 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all shadow-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {filteredVendors.map((vendor) => (
             <a
               key={vendor.codmarca}
               href={vendor.url}
               target="_blank"
               rel="noreferrer"
               className="bg-white aspect-video rounded-xl border border-slate-200 flex items-center justify-center hover:border-emerald-400 hover:shadow-lg transition-all duration-300 group cursor-pointer p-4"
             >
               <img
                 src={getVendorImageSrc(vendor.img)}
                 alt={vendor.nome}
                 className="max-h-full max-w-full object-contain"
                 loading="lazy"
                 onError={(event) => {
                   const target = event.currentTarget;
                   target.style.display = 'none';
                   const fallback = target.nextElementSibling as HTMLElement | null;
                   if (fallback) fallback.style.display = 'block';
                 }}
               />
               <span className="hidden text-center text-base font-bold text-slate-500 group-hover:text-emerald-700 transition-colors">
                 {vendor.nome}
               </span>
             </a>
           ))}
        </div>
      </main>
    </div>
  );
};

export default SuppliersPage;
    
