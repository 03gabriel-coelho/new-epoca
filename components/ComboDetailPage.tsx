import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Gift, Heart, Info, Minus, Package2, Percent, Plus, ShoppingCart, Star, Tags, User } from 'lucide-react';
import { Button, Badge } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import PixBadge from './ui/PixBadge';
import { AuthUser, CartItem } from '../types';
import { mockCombos } from '../lib/mockCombos';
import { mockProducts } from '../lib/mockData';
import { getPricedProducts } from '../lib/pricing';
import {
  ComboSelections,
  createDefaultComboSelections,
  getAllComboVisualProducts,
  getComboDiscountValue,
  getComboPrice,
  getComboProducts,
  getComboQuantityInCart,
  getComboRewardProducts,
  getComboRewardValue,
  getComboSummaryLabel,
  getSelectionGroupQuantity,
  isComboSelectionComplete
} from '../lib/comboUtils';
import Logo from "../lib/images/logo1.webp";

interface ComboDetailPageProps {
  comboId: string;
  currentUser: AuthUser | null;
  currentZipCode: string;
  cart: CartItem[];
  favoriteIds: string[];
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToCheckout: () => void;
  onProductClick: (productId: string) => void;
  addComboToCart: (comboId: string, selections?: ComboSelections) => void;
  removeComboFromCart: (comboId: string) => void;
}

const ComboDetailPage: React.FC<ComboDetailPageProps> = ({
  comboId,
  currentUser,
  currentZipCode,
  cart,
  favoriteIds,
  onNavigateToHome,
  onNavigateToClient,
  onNavigateToFavorites,
  onNavigateToCheckout,
  onProductClick,
  addComboToCart,
  removeComboFromCart
}) => {
  const combo = mockCombos.find((entry) => entry.id === comboId);
  const [comboSelections, setComboSelections] = useState<ComboSelections>(() => (combo ? createDefaultComboSelections(combo) : {}));

  if (!combo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Combo nao encontrado</h2>
          <Button onClick={onNavigateToHome} className="mt-4">Voltar para Loja</Button>
        </div>
      </div>
    );
  }

  const pricedProducts = useMemo(() => getPricedProducts(mockProducts, currentZipCode || currentUser?.zipCode), [currentUser?.zipCode, currentZipCode]);

  const qualifyingProducts = getComboProducts(combo, pricedProducts, comboSelections);
  const rewardProducts = getComboRewardProducts(combo, pricedProducts);
  const comboPrice = getComboPrice(combo, pricedProducts, comboSelections);
  const discountValue = getComboDiscountValue(combo, pricedProducts, comboSelections);
  const rewardValue = getComboRewardValue(combo, pricedProducts);
  const displayName = currentUser?.companyName?.split(' ')[0] || 'Entrar';
  const quantityInCart = getComboQuantityInCart(combo, cart);
  const isSelectionComplete = isComboSelectionComplete(combo, comboSelections);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => {
    const product = pricedProducts.find((entry) => entry.id === item.product_id);
    return acc + item.quantity * (product?.price || 0);
  }, 0);

  const updateSelection = (groupId: string, productId: string, nextQuantity: number) => {
    setComboSelections((prev) => ({
      ...prev,
      [groupId]: {
        ...(prev[groupId] || {}),
        [productId]: Math.max(0, nextQuantity),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 pb-20">
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
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <span className="cursor-pointer hover:underline" onClick={onNavigateToHome}>Home</span>
          <span>/</span>
          <span className="cursor-pointer hover:underline" onClick={onNavigateToHome}>Combos</span>
          <span>/</span>
          <span className="font-bold text-slate-800">{combo.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <Tags className="h-5 w-5 text-[#be342e]" /> Produtos Gatilho
              </h3>

              <div className="space-y-6">
                {combo.selection_groups?.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{group.label}</h4>
                        {group.helper_text ? <p className="mt-1 text-sm text-slate-500">{group.helper_text}</p> : null}
                      </div>
                      <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#be342e]">
                        {getSelectionGroupQuantity(group.id, comboSelections)} / {group.required_quantity}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {group.eligible_product_ids.map((productId) => {
                        const product = pricedProducts.find((entry) => entry.id === productId);
                        if (!product) {
                          return null;
                        }

                        const selectedQuantity = comboSelections[group.id]?.[productId] || 0;

                        return (
                          <div key={product.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                            <div className="flex items-center gap-4">
                              <button type="button" onClick={() => onProductClick(product.id)} className="shrink-0">
                                <ProductImage
                                  src={product.image_path}
                                  alt={product.description}
                                  className="h-20 w-20 rounded-xl border border-slate-100"
                                  imgClassName="h-full w-full object-contain"
                                />
                              </button>
                              <div className="flex-1">
                                <button type="button" onClick={() => onProductClick(product.id)} className="text-left">
                                  <p className="font-semibold text-slate-800">{product.description}</p>
                                </button>
                                <p className="mt-1 text-sm font-bold text-[#be342e]">
                                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-full border border-[#be342e] bg-[#fff5f5] px-2 py-1">
                              <button
                                onClick={() => updateSelection(group.id, product.id, selectedQuantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#be342e] transition-colors hover:bg-[#be342e] hover:text-white"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="text-sm font-bold text-[#be342e]">{selectedQuantity}</span>
                              <button
                                onClick={() => updateSelection(group.id, product.id, selectedQuantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#be342e] text-white transition-colors hover:bg-[#b70e0c]"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {qualifyingProducts.filter((item) => !combo.selection_groups?.some((group) => group.eligible_product_ids.includes(item.product.id))).length > 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {qualifyingProducts
                      .filter((item) => !combo.selection_groups?.some((group) => group.eligible_product_ids.includes(item.product.id)))
                      .map((item) => (
                        <button
                          key={item.product.id}
                          type="button"
                          onClick={() => onProductClick(item.product.id)}
                          className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 text-left transition-colors hover:bg-slate-50"
                        >
                          <ProductImage
                            src={item.product.image_path}
                            alt={item.product.description}
                            className="h-20 w-20 rounded-xl border border-slate-100"
                            imgClassName="h-full w-full object-contain"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">{item.product.description}</p>
                            <p className="mt-1 text-xs text-slate-400">Quantidade exigida: {item.quantity}</p>
                            <p className="mt-2 text-sm font-bold text-[#be342e]">
                              R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <Gift className="h-5 w-5 text-[#be342e]" /> Premio / Beneficio
              </h3>

              {rewardProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {rewardProducts.map((item) => (
                    <button
                      key={item.product.id}
                      type="button"
                      onClick={() => onProductClick(item.product.id)}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <ProductImage
                        src={item.product.image_path}
                        alt={item.product.description}
                        className="h-20 w-20 rounded-xl border border-slate-100"
                        imgClassName="h-full w-full object-contain"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{item.product.description}</p>
                        <p className="mt-1 text-xs text-slate-400">Quantidade premio: {item.quantity}</p>
                        <p className="mt-2 text-sm font-bold text-[#be342e]">
                          R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <Gift className="h-4 w-4 text-[#be342e]" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
                  <p>{combo.benefit_label}</p>
                  {combo.discount_percentage ? (
                    <p className="mt-2 font-semibold text-green-700">
                      Desconto aplicado: {combo.discount_percentage}% sobre os itens elegiveis.
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="warning" className="border-none bg-[#FFC220] text-slate-900">
                  {combo.benefit_label}
                </Badge>
                <Badge variant="brand" className="bg-[#fff4f3] text-[#be342e]">
                  {combo.category}
                </Badge>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{combo.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{combo.description}</p>

              <div className="mb-6 mt-4 flex items-center gap-2">
                <div className="flex text-[#FFC220]">
                  {[1, 2, 3, 4, 5].map((item) => <Star key={item} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-xs text-slate-500">Regra vigente no cadastro comercial</span>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Resumo</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{getComboSummaryLabel(combo)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Validade</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{combo.valid_until || 'Sem data'}</p>
                </div>
              </div>

              <div className="mb-6 mt-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    R$ {comboPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <PixBadge label="valor do combo no PIX" className="text-[11px]" />
                </div>
                {discountValue > 0 && (
                  <p className="mt-1 text-xs font-bold text-green-600">
                    Economia de R$ {discountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}
                {rewardValue > 0 && (
                  <p className="mt-1 text-xs font-bold text-[#be342e]">
                    Premio estimado em R$ {rewardValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}
              </div>

              {quantityInCart > 0 ? (
                <div className="flex items-center justify-between rounded-full border border-[#be342e] bg-[#fff5f5] px-3 py-2">
                  <button
                    onClick={() => removeComboFromCart(combo.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#be342e] transition-colors hover:bg-[#be342e] hover:text-white"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2 text-[#be342e]">
                    <Package2 className="h-5 w-5" />
                    <span className="text-lg font-bold">{quantityInCart}</span>
                  </div>
                  <button
                    onClick={() => addComboToCart(combo.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#be342e] text-white transition-colors hover:bg-[#b70e0c]"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Button
                  className="h-12 w-full rounded-full bg-[#be342e] text-lg font-bold text-white hover:bg-[#b70e0c] disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => addComboToCart(combo.id, comboSelections)}
                  disabled={!isSelectionComplete}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar combo ao carrinho
                </Button>
              )}

              {combo.selection_groups?.length ? (
                <p className="mt-3 text-xs font-medium text-slate-500">
                  Complete a quantidade minima dos grupos flexiveis para liberar a compra.
                </p>
              ) : null}

              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  <Info className="h-4 w-4 text-[#be342e]" /> Leitura da regra
                </p>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-green-600" />
                    <span>Itens que precisam ser comprados: {qualifyingProducts.length}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-4 w-4 text-[#be342e]" />
                    <span>Itens premio: {rewardProducts.length > 0 ? rewardProducts.length : 'nao se aplica'}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Percent className="mt-0.5 h-4 w-4 text-[#be342e]" />
                    <span>Desconto: {combo.discount_percentage ? `${combo.discount_percentage}%` : 'nao se aplica'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">
                <Tags className="h-5 w-5 text-[#be342e]" /> Premio cadastrado
              </h3>
              <p className="text-sm text-slate-600">{combo.prize_text || combo.benefit_label}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComboDetailPage;
