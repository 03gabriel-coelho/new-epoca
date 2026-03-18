import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import { CreditCard, Barcode, MapPin, ShieldCheck, CheckCircle, AlertCircle, Plus, Trash2, Minus, ShoppingCart, Loader2, Zap, Copy, QrCode, Gift, Tags, Percent } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { mockCombos } from '../lib/mockCombos';
import { AuthUser, CartItem, CheckoutPaymentMethod, OrderStatus, StoredOrder } from '../types';
import { createStoredOrder } from '../lib/ordersStorage';
import {
  getAppliedComboQualifyingItemsFromCart,
  getAppliedComboRewardItemsFromCart,
  getCartComboDiscountValue,
  getCartComboRewardValue,
  getComboQuantityInCart,
  getComboSummaryLabel,
  mapComboItemsWithProducts,
} from '../lib/comboUtils';
import Logo from "../lib/images/logo1.webp";

const buildAddressLabel = (currentUser: AuthUser | null) => {
  if (!currentUser) {
    return '';
  }

  const streetLine = [currentUser.street, currentUser.addressNumber].filter(Boolean).join(', ');
  const complement = currentUser.addressComplement ? ` - ${currentUser.addressComplement}` : '';
  const cityLine = [currentUser.district, currentUser.city, currentUser.state].filter(Boolean).join(' - ');
  const zipCode = currentUser.zipCode ? `, ${currentUser.zipCode}` : '';
  const reference = currentUser.referencePoint ? ` (${currentUser.referencePoint})` : '';

  return `${streetLine}${complement}${streetLine && cityLine ? ', ' : ''}${cityLine}${zipCode}${reference}`.trim();
};

interface CheckoutPageProps {
  onNavigateToHome: () => void;
  onNavigateToOrders: () => void;
  currentUser: AuthUser | null;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  onOrderPlaced: (order: StoredOrder) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateToHome,
  onNavigateToOrders,
  currentUser,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  onOrderPlaced
}) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('PIX');
  const [address, setAddress] = useState<string | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    zipCode: '',
    street: '',
    district: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    referencePoint: '',
  });
  const [card1Amount, setCard1Amount] = useState('');
  const [pixCopied, setPixCopied] = useState(false);
  const [pixPaid, setPixPaid] = useState(false);
  const [isProcessingPix, setIsProcessingPix] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<StoredOrder | null>(null);

  const productSubtotal = cart.reduce((acc, item) => {
    const product = mockProducts.find(p => p.id === item.product_id);
    return acc + (item.quantity * (product?.price || 0));
  }, 0);

  const appliedCombos = useMemo(() => {
    return mockCombos
      .map((combo) => {
        const appliedCount = getComboQuantityInCart(combo, cart);
        if (appliedCount <= 0) {
          return null;
        }

        const qualifyingItems = mapComboItemsWithProducts(getAppliedComboQualifyingItemsFromCart(combo, cart), mockProducts);
        const rewardItems = mapComboItemsWithProducts(getAppliedComboRewardItemsFromCart(combo, cart), mockProducts);
        const discountValue = getCartComboDiscountValue(combo, mockProducts, cart);
        const rewardValue = getCartComboRewardValue(combo, mockProducts, cart);

        return {
          combo,
          appliedCount,
          qualifyingItems,
          rewardItems,
          discountValue,
          rewardValue,
          savingsValue: Number((discountValue + rewardValue).toFixed(2)),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  }, [cart]);

  const rewardQuantitiesByProductId = useMemo(() => {
    const quantities = new Map<string, number>();

    appliedCombos.forEach((appliedCombo) => {
      appliedCombo.rewardItems.forEach((item) => {
        quantities.set(item.product.id, (quantities.get(item.product.id) || 0) + item.quantity);
      });
    });

    return quantities;
  }, [appliedCombos]);

  const recordedRewardQuantitiesByProductId = useMemo(() => {
    const quantities = new Map<string, number>();

    cart.forEach((item) => {
      (item.combo_breakdown || [])
        .filter((entry) => entry.role === 'reward')
        .forEach((entry) => {
          quantities.set(item.product_id, (quantities.get(item.product_id) || 0) + entry.quantity);
        });
    });

    return quantities;
  }, [cart]);

  const getDisplayQuantity = (item: CartItem) => {
    const appliedRewardQuantity = rewardQuantitiesByProductId.get(item.product_id) || 0;
    const recordedRewardQuantity = recordedRewardQuantitiesByProductId.get(item.product_id) || 0;
    const virtualRewardExtra = Math.max(appliedRewardQuantity - recordedRewardQuantity, 0);

    return item.quantity + virtualRewardExtra;
  };

  const displayItemCount = cart.reduce((total, item) => total + getDisplayQuantity(item), 0);

  const comboSavingsTotal = appliedCombos.reduce((total, combo) => total + combo.savingsValue, 0);
  const pixTotal = Math.max(productSubtotal - comboSavingsTotal, 0);
  const paymentAdjustmentRate =
    paymentMethod === 'CREDIT_CARD' ? 0.035 :
    paymentMethod === 'TWO_CARDS' ? 0.045 :
    paymentMethod === 'BOLETO' ? 0.02 :
    0;
  const paymentAdjustmentLabel =
    paymentMethod === 'CREDIT_CARD' ? 'Acrescimo do cartao' :
    paymentMethod === 'TWO_CARDS' ? 'Acrescimo dos cartoes' :
    paymentMethod === 'BOLETO' ? 'Taxa do boleto' :
    'Pagamento via PIX';
  const paymentAdjustedTotal = Number((pixTotal * (1 + paymentAdjustmentRate)).toFixed(2));
  const paymentAdjustmentValue = Number((paymentAdjustedTotal - pixTotal).toFixed(2));

  useEffect(() => {
    if (!card1Amount) {
      setCard1Amount((paymentAdjustedTotal / 2).toFixed(2));
    }
  }, [paymentAdjustedTotal, card1Amount]);

  useEffect(() => {
    setPixCopied(false);
    setPixPaid(false);
    setIsProcessingPix(false);
  }, [paymentMethod, paymentAdjustedTotal]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const initialForm = {
      zipCode: currentUser.zipCode || '',
      street: currentUser.street || '',
      district: currentUser.district || '',
      number: currentUser.addressNumber || '',
      complement: currentUser.addressComplement || '',
      city: currentUser.city || '',
      state: currentUser.state || '',
      referencePoint: currentUser.referencePoint || '',
    };

    setAddressForm(initialForm);
    setAddress(buildAddressLabel(currentUser));
  }, [currentUser]);

  const card2Amount = (paymentAdjustedTotal - (parseFloat(card1Amount) || 0)).toFixed(2);
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136epoca-b2b-${cart.length || 1}-${pixTotal.toFixed(2).replace('.', '')}520400005303986540${pixTotal.toFixed(2).length}${pixTotal.toFixed(2)}5802BR5925EPOCA DISTRIBUICAO LTDA6009SAO PAULO62070503***6304ABCD`;

  const handleAddressFieldChange = (field: keyof typeof addressForm, value: string) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmEditedAddress = () => {
    const streetLine = [addressForm.street, addressForm.number].filter(Boolean).join(', ');
    const complement = addressForm.complement ? ` - ${addressForm.complement}` : '';
    const cityLine = [addressForm.district, addressForm.city, addressForm.state].filter(Boolean).join(' - ');
    const zipCode = addressForm.zipCode ? `, ${addressForm.zipCode}` : '';
    const reference = addressForm.referencePoint ? ` (${addressForm.referencePoint})` : '';

    const nextAddress = `${streetLine}${complement}${streetLine && cityLine ? ', ' : ''}${cityLine}${zipCode}${reference}`.trim();
    setAddress(nextAddress);
    setIsEditingAddress(false);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'PIX' && !pixPaid) {
      return;
    }

    if (!currentUser || !address || cart.length === 0) {
      return;
    }

    const order = createStoredOrder({
      customer_id: currentUser.id,
      company_name: currentUser.companyName,
      date: new Date().toISOString(),
      total_value: paymentAdjustedTotal,
      status: paymentMethod === 'BOLETO' ? OrderStatus.ABERTO : OrderStatus.LIBERADO,
      items_count: displayItemCount,
      address,
      payment_method: paymentMethod,
      freight_cost: 0,
      combo_savings_total: comboSavingsTotal,
      payment_adjustment_value: paymentAdjustmentValue,
      tracking_message:
        paymentMethod === 'PIX'
          ? 'Pagamento confirmado e pedido encaminhado para separacao.'
          : paymentMethod === 'BOLETO'
            ? 'Pedido recebido e aguardando compensacao do boleto.'
            : 'Pedido aprovado e encaminhado para separacao.',
      items: cart
        .map((item) => {
          const product = mockProducts.find((entry) => entry.id === item.product_id);
          if (!product) {
            return null;
          }

          return {
            product_id: product.id,
            quantity: getDisplayQuantity(item),
            unit_price: product.price,
            description: product.description,
            image_path: product.image_path,
            winthor_codprod: product.winthor_codprod,
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    });

    setCreatedOrder(order);
    onOrderPlaced(order);
    setStep(4);
  };

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setPixCopied(true);
    } catch (error) {
      console.error('Nao foi possivel copiar o codigo PIX.', error);
    }
  };

  const handleSimulatePixPayment = () => {
    setIsProcessingPix(true);
    window.setTimeout(() => {
      setIsProcessingPix(false);
      setPixPaid(true);
    }, 1800);
  };

  const renderCartReviewStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <ShoppingCart className="text-[#be342e]" /> Revisão do Carrinho
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cart.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {cart.map((item) => {
                const product = mockProducts.find(p => p.id === item.product_id);
                if (!product) {
                  return null;
                }

                const displayQuantity = getDisplayQuantity(item);

                return (
                  <div key={item.product_id} className="p-4 flex flex-col sm:flex-row items-center gap-4">
                    <ProductImage
                      src={product.image_path}
                      alt={product.description}
                      className="w-20 h-20 rounded-md border border-slate-100"
                      imgClassName="w-full h-full object-contain"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-slate-800 line-clamp-2">{product.description}</h4>
                      <p className="text-xs text-slate-500 mb-1">Cod: {product.winthor_codprod}</p>
                      {rewardQuantitiesByProductId.get(product.id) ? (
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge className="bg-[#fff4f3] text-[#be342e] border border-[#f3c1bd]">
                            <Gift className="mr-1 h-3 w-3" /> {rewardQuantitiesByProductId.get(product.id)} un em premio
                          </Badge>
                        </div>
                      ) : null}
                      <p className="text-[#be342e] font-bold">R$ {product.price.toFixed(2)} / un</p>
                      <p className="text-[10px] text-slate-400">Preco base em PIX</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-300 rounded-full h-10 w-32 justify-between px-1">
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                        </button>
                        <span className="font-bold text-slate-900">{displayQuantity}</span>
                        <button
                          onClick={() => addToCart(item.product_id)}
                          className="w-8 h-8 rounded-full bg-[#be342e] hover:bg-[#b70e0c] flex items-center justify-center text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="text-xs text-slate-500">Subtotal</p>
                      <p className="font-bold text-lg text-slate-900">R$ {(product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Seu carrinho esta vazio.</p>
              <Button variant="ghost" onClick={onNavigateToHome} className="mt-4 text-[#be342e]">
                Voltar a comprar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {appliedCombos.length > 0 && (
        <Card className="border-none shadow-sm">
          <CardHeader className="bg-[#fff4f3] border-b border-[#f3d2cf]">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Tags className="text-[#be342e]" /> Combos aplicados ao pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {appliedCombos.map((appliedCombo) => (
              <div key={appliedCombo.combo.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-[#FFC220] text-slate-900 border-none">{appliedCombo.combo.benefit_label}</Badge>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        {getComboSummaryLabel(appliedCombo.combo)}
                      </span>
                    </div>
                    <h4 className="mt-2 font-bold text-slate-900">{appliedCombo.combo.name}</h4>
                    <p className="mt-1 text-sm text-slate-500">Aplicado {appliedCombo.appliedCount}x neste pedido.</p>
                  </div>
                  <div className="rounded-2xl bg-green-50 px-4 py-3 text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-green-700">Beneficio total</p>
                    <p className="mt-1 text-lg font-bold text-green-700">
                      R$ {appliedCombo.savingsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Produtos gatilho</p>
                    <div className="space-y-2">
                      {appliedCombo.qualifyingItems.map((item) => (
                        <p key={`${appliedCombo.combo.id}-${item.product.id}`} className="text-sm text-slate-700">
                          <span className="font-semibold">{item.quantity}x</span> {item.product.description}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Premio / Beneficio</p>
                    <div className="space-y-2">
                      {appliedCombo.rewardItems.length > 0 ? (
                        appliedCombo.rewardItems.map((item) => (
                          <p key={`${appliedCombo.combo.id}-reward-${item.product.id}`} className="text-sm text-slate-700">
                            <span className="font-semibold">{item.quantity}x</span> {item.product.description}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-slate-700">{appliedCombo.combo.benefit_label}</p>
                      )}
                      {appliedCombo.discountValue > 0 && (
                        <p className="flex items-center gap-2 text-sm font-semibold text-green-700">
                          <Percent className="h-4 w-4" />
                          Desconto aplicado: R$ {appliedCombo.discountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {cart.length > 0 && (
          <Button
            variant="outline"
            onClick={clearCart}
            className="h-12 rounded-full border-red-200 px-8 font-bold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Esvaziar carrinho
          </Button>
        )}
        <Button
          disabled={cart.length === 0}
          onClick={() => setStep(2)}
          className="h-12 px-8 rounded-full text-slate-900 font-bold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar para endereço
        </Button>
      </div>
    </div>
  );

  const renderAddressStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <MapPin className="text-[#be342e]" /> Endereco de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Endereco cadastrado</p>
              <p className="mt-2 text-sm text-slate-700">
                {address || 'Nenhum endereco cadastrado. Informe abaixo o endereco para entrega.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c]"
                  onClick={() => {
                    if (address) {
                      setStep(3);
                    } else {
                      setIsEditingAddress(true);
                    }
                  }}
                >
                  Enviar neste endereco
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-[#be342e] text-[#be342e] hover:bg-blue-50"
                  onClick={() => setIsEditingAddress((prev) => !prev)}
                >
                  {isEditingAddress ? 'Fechar edicao' : 'Trocar endereco'}
                </Button>
              </div>
            </div>

            {isEditingAddress && (
              <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-slate-800">Alterar endereco de entrega</p>
                  <p className="mt-1 text-sm text-slate-500">Use este formulario apenas se quiser receber em outro endereco neste pedido.</p>
                </div>
                <input
                  type="text"
                  value={addressForm.zipCode}
                  onChange={(e) => handleAddressFieldChange('zipCode', e.target.value)}
                  placeholder="CEP"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => handleAddressFieldChange('street', e.target.value)}
                  placeholder="Rua / Logradouro"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.district}
                  onChange={(e) => handleAddressFieldChange('district', e.target.value)}
                  placeholder="Bairro"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.number}
                  onChange={(e) => handleAddressFieldChange('number', e.target.value)}
                  placeholder="Numero"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.complement}
                  onChange={(e) => handleAddressFieldChange('complement', e.target.value)}
                  placeholder="Complemento"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                  placeholder="Cidade"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => handleAddressFieldChange('state', e.target.value)}
                  placeholder="Estado"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e]"
                />
                <input
                  type="text"
                  value={addressForm.referencePoint}
                  onChange={(e) => handleAddressFieldChange('referencePoint', e.target.value)}
                  placeholder="Ponto de referencia"
                  className="h-11 rounded-xl border border-slate-300 px-4 outline-none focus:border-[#be342e] md:col-span-2"
                />
                <div className="md:col-span-2 flex justify-end">
                  <Button
                    className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c]"
                    onClick={handleConfirmEditedAddress}
                  >
                    Confirmar novo endereco
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-500">Voltar</Button>
        <Button
          disabled={!address}
          onClick={() => setStep(3)}
          className="h-12 px-8 rounded-full bg-[#FFC220] hover:bg-yellow-400 text-slate-900 font-bold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ir para Pagamento
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <CreditCard className="text-[#be342e]" /> Forma de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'CREDIT_CARD', label: 'Cartao de Credito', icon: CreditCard },
              { id: 'TWO_CARDS', label: 'Dois Cartoes', icon: Plus },
              { id: 'PIX', label: 'PIX', icon: QrCode },
              { id: 'BOLETO', label: 'Boleto Bancario', icon: Barcode },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as 'CREDIT_CARD' | 'TWO_CARDS' | 'PIX' | 'BOLETO')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${
                  paymentMethod === method.id
                    ? 'bg-[#e6f1fc] text-[#be342e] border-[#be342e]'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <method.icon className="w-4 h-4" />
                {method.label}
              </button>
            ))}
          </div>

          {paymentMethod === 'CREDIT_CARD' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Cartao Principal</p>
                <div className="flex gap-4">
                  <input type="text" placeholder="Numero do Cartao" className="flex-1 h-10 rounded-lg border px-3" />
                  <input type="text" placeholder="MM/AA" className="w-24 h-10 rounded-lg border px-3" />
                  <input type="text" placeholder="CVV" className="w-16 h-10 rounded-lg border px-3" />
                </div>
                <input type="text" placeholder="Nome no Cartao" className="w-full h-10 rounded-lg border px-3 mt-3" />
              </div>
            </div>
          )}

          {paymentMethod === 'TWO_CARDS' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4" />
                Divida o valor total entre dois cartoes de credito.
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <Badge className="absolute -top-2 -left-2 bg-[#be342e] text-white">Cartao 1</Badge>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">Valor a Cobrar</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500 font-bold">R$</span>
                      <input
                        type="number"
                        value={card1Amount}
                        onChange={(e) => setCard1Amount(e.target.value)}
                        className="w-full h-10 pl-10 rounded-lg border border-slate-300 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 opacity-50 pointer-events-none">
                    <input type="text" value="•••• •••• •••• 4242" className="w-full h-10 rounded-lg border px-3 bg-white" readOnly />
                    <div className="flex gap-2">
                      <input type="text" value="12/28" className="w-1/2 h-10 rounded-lg border px-3 bg-white" readOnly />
                      <input type="text" value="•••" className="w-1/2 h-10 rounded-lg border px-3 bg-white" readOnly />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <Badge className="absolute -top-2 -left-2 bg-[#FFC220] text-slate-900">Cartao 2</Badge>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-500 uppercase">Valor Restante</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500 font-bold">R$</span>
                      <input
                        type="text"
                        value={card2Amount}
                        readOnly
                        className="w-full h-10 pl-10 rounded-lg border border-slate-200 bg-slate-100 font-bold text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Numero do Cartao" className="w-full h-10 rounded-lg border px-3" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="MM/AA" className="w-1/2 h-10 rounded-lg border px-3" />
                      <input type="text" placeholder="CVV" className="w-1/2 h-10 rounded-lg border px-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'PIX' && (
            <div className="max-w-2xl space-y-5 animate-in fade-in">
              <div className="grid md:grid-cols-[220px,1fr] gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-36 h-36 rounded-2xl bg-slate-900 text-white grid grid-cols-6 gap-1 p-3">
                    {Array.from({ length: 36 }).map((_, index) => (
                      <div key={index} className={`${(index + (index % 3)) % 2 === 0 ? 'bg-white' : 'bg-slate-900'} rounded-sm`} />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-4">Escaneie o QR Code</p>
                  <p className="text-[11px] text-slate-500 mt-1">Pagamento identificado automaticamente apos a confirmacao.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Pague com PIX</p>
                    <p className="text-sm text-slate-500 mt-1">Abra o app do banco, copie o codigo abaixo e conclua o pagamento no valor de PIX.</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase text-slate-500 mb-2">Codigo copia e cola</p>
                    <p className="text-xs text-slate-600 break-all font-mono leading-5">{pixCode}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleCopyPixCode}
                      variant="outline"
                      className="rounded-full border-[#be342e] text-[#be342e]"
                    >
                      <Copy className="w-4 h-4 mr-2" /> {pixCopied ? 'Codigo copiado' : 'Copiar codigo PIX'}
                    </Button>
                    <Button
                      onClick={handleSimulatePixPayment}
                      disabled={pixPaid || isProcessingPix}
                      className="rounded-full bg-[#be342e] hover:bg-[#b70e0c] text-white"
                    >
                      {isProcessingPix ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Confirmando pagamento...
                        </>
                      ) : pixPaid ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" /> PIX aprovado
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" /> Confirmar pagamento PIX
                        </>
                      )}
                    </Button>
                  </div>

                  <div className={`rounded-xl border p-4 ${pixPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                    <p className="text-sm font-bold">{pixPaid ? 'Pagamento confirmado' : 'Aguardando pagamento'}</p>
                    <p className="text-xs mt-1">
                      {pixPaid
                        ? 'O valor foi reconhecido e o pedido ja pode ser finalizado.'
                        : 'Clique em "Confirmar pagamento PIX" para concluir a compra.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'BOLETO' && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center animate-in fade-in">
              <Barcode className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <p className="font-bold text-slate-700">Boleto Bancario Itau</p>
              <p className="text-sm text-slate-500">O boleto sera gerado apos a confirmacao do pedido.</p>
              <p className="text-xs text-slate-400 mt-2">Vencimento em 3 dias uteis.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => setStep(2)} className="text-slate-500">Voltar</Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={paymentMethod === 'PIX' && !pixPaid}
          className="h-12 px-8 rounded-full bg-[#FFC220] hover:bg-yellow-400 text-slate-900 font-bold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paymentMethod === 'PIX' && !pixPaid ? 'Aguardando PIX' : 'Finalizar Pedido'}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-12 animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Pedido Confirmado!</h2>
      <p className="text-slate-500 mb-8 text-lg">
        {paymentMethod === 'PIX'
          ? 'Pagamento PIX confirmado e pedido enviado para separacao.'
          : `Seu pedido #${createdOrder?.winthor_numped || '--'} foi enviado para separacao.`}
      </p>

      <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 text-left">
        <p className="font-bold text-slate-700 mb-4 border-b pb-2">Resumo da Entrega</p>
        <p className="text-sm text-slate-600 mb-1"><span className="font-bold">Pedido:</span> #{createdOrder?.winthor_numped || '--'}</p>
        <p className="text-sm text-slate-600 mb-1"><span className="font-bold">Endereco:</span> {createdOrder?.address || address}</p>
        <p className="text-sm text-slate-600 mb-1"><span className="font-bold">Previsao:</span> 3 dias uteis</p>
        <p className="text-sm text-slate-600 mb-1"><span className="font-bold">Pagamento:</span> {paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'BOLETO' ? 'Boleto' : 'Cartao'}</p>
        <p className="text-sm text-slate-600"><span className="font-bold">Total Pago:</span> R$ {(createdOrder?.total_value || paymentAdjustedTotal).toFixed(2)}</p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={onNavigateToHome} variant="outline" className="rounded-full h-10">Voltar para Loja</Button>
        <Button className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c] h-10" onClick={onNavigateToOrders}>Acompanhar Pedido</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-20 flex items-center shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl flex items-center bg-[#be342e] p-2 gap-1 cursor-pointer" onClick={onNavigateToHome}>
              <img className="h-12" src={Logo} />
            </div>
            <div className="h-6 w-px bg-slate-300 mx-2 hidden md:block"></div>
            <h1 className="text-lg font-bold text-slate-600 hidden md:block">Checkout Seguro</h1>
          </div>

          {step < 4 && (
            <div className="flex items-center gap-2 md:gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#be342e] font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#be342e] text-white' : 'bg-slate-200'}`}>1</div>
                <span className="hidden md:inline">Carrinho</span>
              </div>
              <div className="w-8 h-px bg-slate-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#be342e] font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#be342e] text-white' : 'bg-slate-200'}`}>2</div>
                <span className="hidden md:inline">Endereco</span>
              </div>
              <div className="w-8 h-px bg-slate-300"></div>
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-[#be342e] font-bold' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#be342e] text-white' : 'bg-slate-200'}`}>3</div>
                <span className="hidden md:inline">Pagamento</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === 4 ? (
          renderSuccessStep()
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 ? renderCartReviewStep() : step === 2 ? renderAddressStep() : renderPaymentStep()}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Resumo do Pedido</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({displayItemCount} itens)</span>
                    <span className="font-bold">R$ {productSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total em PIX</span>
                    <span className="font-bold">R$ {pixTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {appliedCombos.length > 0 && (
                    <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-green-700">Beneficios de combos</span>
                        <span className="font-bold text-green-700">- R$ {comboSavingsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {appliedCombos.map((appliedCombo) => (
                          <p key={appliedCombo.combo.id} className="text-xs text-green-700">
                            {appliedCombo.combo.name}: R$ {appliedCombo.savingsValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {paymentMethod !== 'PIX' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{paymentAdjustmentLabel}</span>
                      <span className="font-bold">R$ {paymentAdjustmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-3 flex justify-between text-lg">
                    <span className="font-bold text-slate-800">Total</span>
                    <span className="font-bold text-[#be342e]">R$ {paymentAdjustedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="bg-[#e6f1fc] p-4 rounded-xl mb-4">
                  <p className="text-xs font-bold text-[#be342e] mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Compra Garantida
                  </p>
                  <p className="text-xs text-slate-600 leading-tight">
                    Seus dados estao protegidos com criptografia de ponta a ponta.
                  </p>
                </div>

                <Button variant="outline" onClick={onNavigateToHome} className="w-full text-x text-slate-500">
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
