import React, { useMemo, useState } from 'react';
import { ArrowLeft, Gift, Heart, Minus, Package2, Percent, Plus, Search, ShoppingCart, Tags, User } from 'lucide-react';
import { Button, Badge } from './ui/Layout';
import ComboImage from './ui/ComboImage';
import PixBadge from './ui/PixBadge';
import { AuthUser, CartItem } from '../types';
import { mockProducts } from '../lib/mockData';
import { mockCombos } from '../lib/mockCombos';
import {
  getAllComboVisualProducts,
  getComboPrice,
  getComboProducts,
  getComboQuantityInCart,
  getComboRewardProducts,
  getComboSummaryLabel
} from '../lib/comboUtils';
import Logo from "../lib/images/logo1.webp";

interface CombosPageProps {
  currentUser: AuthUser | null;
  cart: CartItem[];
  favoriteIds: string[];
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToCheckout: () => void;
  onComboClick: (comboId: string) => void;
  addComboToCart: (comboId: string) => void;
  removeComboFromCart: (comboId: string) => void;
}

const ruleIconMap = {
  discount_percentage: Percent,
  buy_x_get_y: Gift,
  combo_bundle: Package2,
  value_threshold_bonus: Tags,
} as const;

const CombosPage: React.FC<CombosPageProps> = ({
  currentUser,
  cart,
  favoriteIds,
  onNavigateToHome,
  onNavigateToClient,
  onNavigateToFavorites,
  onNavigateToCheckout,
  onComboClick,
  addComboToCart,
  removeComboFromCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const displayName = currentUser?.companyName?.split(' ')[0] || 'Entrar';

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const product = mockProducts.find((entry) => entry.id === item.product_id);
    return acc + item.quantity * (product?.price || 0);
  }, 0);

  const visibleCombos = useMemo(
    () =>
      mockCombos.filter(
        (combo) =>
          combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          combo.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          combo.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-[#be342e] text-white shadow-md">
        <div className="container mx-auto flex h-20 items-center justify-between gap-6 px-4">
          <div className="flex flex-shrink-0 items-center gap-6">
            <Button variant="ghost" onClick={onNavigateToHome} className="rounded-full px-4 pl-0 text-white hover:bg-[#b70e0c]">
              <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
            </Button>
            <div className="flex cursor-pointer items-center gap-1" onClick={onNavigateToHome}>
              <img className="h-12" src={Logo} />
            </div>
          </div>

          <div className="hidden max-w-xl flex-1 md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar combos por nome, premio ou categoria..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-full bg-white px-5 pr-12 text-slate-900 outline-none focus:ring-2 focus:ring-[#FFC220]"
              />
              <Search className="absolute right-4 top-3 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onNavigateToClient} className="flex flex-col items-center justify-center rounded-full px-3 py-1 text-white hover:bg-[#b70e0c]">
              <User className="mb-0.5 h-5 w-5" />
              <span className="text-[10px] font-bold">{displayName}</span>
            </button>
            <button onClick={onNavigateToFavorites} className="flex flex-col items-center justify-center rounded-full px-3 py-1 text-white hover:bg-[#b70e0c]">
              <Heart className="mb-0.5 h-5 w-5" />
              <span className="text-[10px] font-bold">Favoritos</span>
            </button>
            <button onClick={onNavigateToCheckout} className="relative flex flex-col items-center justify-center rounded-full px-3 py-1 text-white hover:bg-[#b70e0c]">
              <ShoppingCart className="mb-0.5 h-5 w-5" />
              <span className="text-[10px] font-bold">
                R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="absolute right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC220] text-[10px] font-bold text-slate-900">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="brand" className="mb-3 bg-[#fff4f3] text-[#be342e]">
              Regras Comerciais
            </Badge>
            <h1 className="text-3xl font-bold text-slate-900">Combos com varios tipos de beneficio</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Desconto por linha, compre e ganhe, combo casado e meta por valor. Confira as regras comerciais disponiveis para sua compra.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">{visibleCombos.length} regras disponiveis</div>
        </div>

        {visibleCombos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCombos.map((combo) => {
              const qualifyingProducts = getComboProducts(combo, mockProducts);
              const rewardProducts = getComboRewardProducts(combo, mockProducts);
              const visualProducts = getAllComboVisualProducts(combo, mockProducts);
              const comboPrice = getComboPrice(combo, mockProducts);
              const quantityInCart = getComboQuantityInCart(combo, cart);
              const RuleIcon = ruleIconMap[combo.rule_type];

              return (
                <div key={combo.id} className="flex min-h-[480px] flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="warning" className="border-none bg-[#FFC220] text-slate-900">
                        {combo.benefit_label}
                      </Badge>
                      <h2 className="mt-3 text-xl font-bold text-slate-900">{combo.name}</h2>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      <RuleIcon className="h-3.5 w-3.5" />
                      {combo.category}
                    </div>
                  </div>

                  <div className="cursor-pointer" onClick={() => onComboClick(combo.id)}>
                    <ComboImage products={visualProducts} alt={combo.name} className="h-56 w-full" />
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-slate-500">{combo.description}</p>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Regra</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{getComboSummaryLabel(combo)}</p>
                    <div className="mt-3 space-y-2">
                      {qualifyingProducts.slice(0, 3).map((item) => (
                        <p key={item.product.id} className="text-xs text-slate-500">
                          Gatilho: <span className="font-semibold text-slate-700">{item.quantity}x {item.product.description}</span>
                        </p>
                      ))}
                      {rewardProducts.slice(0, 2).map((item) => (
                        <p key={item.product.id} className="text-xs text-slate-500">
                          Premio: <span className="font-semibold text-[#be342e]">{item.quantity}x {item.product.description}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="mb-2">
                          <PixBadge label="valor do combo no PIX" className="text-[10px]" />
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-slate-900">
                            R$ {comboPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{qualifyingProducts.length} gatilho(s)</p>
                        <p>{rewardProducts.length} premio(s)</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-4 h-10 w-full rounded-full border-[#be342e] text-[#be342e] hover:bg-[#fff4f3]"
                      onClick={() => onComboClick(combo.id)}
                    >
                      Ver detalhes do combo
                    </Button>

                    {quantityInCart > 0 ? (
                      <div className="mt-3 flex items-center justify-between rounded-full border border-[#be342e] bg-[#fff5f5] px-2 py-1">
                        <button
                          onClick={() => removeComboFromCart(combo.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#be342e] transition-colors hover:bg-[#be342e] hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-bold text-[#be342e]">{quantityInCart}</span>
                        <button
                          onClick={() => addComboToCart(combo.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#be342e] text-white transition-colors hover:bg-[#b70e0c]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <Button className="mt-3 h-10 w-full rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c]" onClick={() => addComboToCart(combo.id)}>
                        <Package2 className="mr-2 h-4 w-4" /> Adicionar combo
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-20 text-center">
            <Package2 className="mx-auto mb-4 h-10 w-10 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900">Nenhuma regra encontrada</h3>
            <p className="mt-2 text-sm text-slate-500">Tente outro termo para localizar o combo desejado.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CombosPage;
