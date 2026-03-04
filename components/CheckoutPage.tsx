
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from './ui/Layout';
import ProductImage from './ui/ProductImage';
import { ArrowLeft, CreditCard, Barcode, MapPin, ShieldCheck, CheckCircle, AlertCircle, Plus, Trash2, Minus, ShoppingCart, Loader2, Zap } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { CartItem } from '../types';

interface CheckoutPageProps {
  onNavigateToHome: () => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigateToHome, cart, addToCart, removeFromCart }) => {
  const [step, setStep] = useState(1); // 1: Cart Review, 2: Address, 3: Payment, 4: Success
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'TWO_CARDS' | 'BOLETO'>('CREDIT_CARD');
  
  // Freight State
  const [cep, setCep] = useState('');
  const [freightCost, setFreightCost] = useState(0);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingFreight, setLoadingFreight] = useState(false);
  const [freightError, setFreightError] = useState('');

  // Dynamic Totals
  const cartTotal = cart.reduce((acc, item) => {
    const product = mockProducts.find(p => p.id === item.product_id);
    return acc + (item.quantity * (product?.price || 0));
  }, 0);

  // Split Payment State
  const [card1Amount, setCard1Amount] = useState<string>("");
  
  const totalWithFreight = cartTotal + freightCost;
  
  // Update default split amount when total changes
  useEffect(() => {
    if (!card1Amount) {
        setCard1Amount((totalWithFreight / 2).toFixed(2));
    }
  }, [totalWithFreight]);

  const card2Amount = (totalWithFreight - (parseFloat(card1Amount) || 0)).toFixed(2);

  const calculateSimulatedFreight = (uf: string) => {
     // Lógica de frete mais realista baseada na região
     const sudeste = ['SP', 'RJ', 'MG', 'ES'];
     const sul = ['PR', 'SC', 'RS'];
     
     if (sudeste.includes(uf)) setFreightCost(29.90);
     else if (sul.includes(uf)) setFreightCost(45.50);
     else setFreightCost(89.90);
  };

  const handleCalculateFreight = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
        setFreightError('Digite um CEP válido com 8 dígitos.');
        return;
    }

    setLoadingFreight(true);
    setFreightError('');
    setAddress(null); // Limpa endereço anterior para evitar confusão

    try {
      // 1. Tenta BrasilAPI (Proxy para Correios - Mais assertivo)
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
      
      if (!response.ok) throw new Error('Falha na BrasilAPI');
      
      const data = await response.json();
      
      // Mapeamento BrasilAPI
      const street = data.street ? `${data.street}, ` : '';
      const neighborhood = data.neighborhood ? `${data.neighborhood} - ` : '';
      const city = data.city;
      const state = data.state;
      
      setAddress(`${street}${neighborhood}${city}/${state}`);
      calculateSimulatedFreight(state);

    } catch (err) {
      // 2. Fallback para ViaCEP se BrasilAPI falhar
      console.log('BrasilAPI failed, trying ViaCEP...');
      try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          
          if (data.erro) {
              setFreightError('CEP não encontrado na base dos Correios.');
              setLoadingFreight(false);
              return;
          }

          // Mapeamento ViaCEP (Propriedades diferentes: logradouro vs street)
          const street = data.logradouro ? `${data.logradouro}, ` : '';
          const neighborhood = data.bairro ? `${data.bairro} - ` : '';
          const city = data.localidade;
          const state = data.uf;

          setAddress(`${street}${neighborhood}${city}/${state}`);
          calculateSimulatedFreight(state);

      } catch (viaCepErr) {
          setFreightError('Serviço de CEP indisponível no momento.');
      }
    } finally {
      setLoadingFreight(false);
    }
  };

  const handlePlaceOrder = () => {
    setStep(4);
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
                            if (!product) return null;
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
                                        <p className="text-xs text-slate-500 mb-1">Cód: {product.winthor_codprod}</p>
                                        <p className="text-[#be342e] font-bold">R$ {product.price.toFixed(2)} / un</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-slate-300 rounded-full h-10 w-32 justify-between px-1">
                                            <button 
                                                onClick={() => removeFromCart(item.product_id)}
                                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                                            >
                                                {item.quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
                                            </button>
                                            <span className="font-bold text-slate-900">{item.quantity}</span>
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
                        <p>Seu carrinho está vazio.</p>
                        <Button variant="ghost" onClick={onNavigateToHome} className="mt-4 text-[#be342e]">
                            Voltar a comprar
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>

        <div className="flex justify-end">
             <Button 
                disabled={cart.length === 0} 
                onClick={() => setStep(2)}
                className="h-12 px-8 rounded-full bg-[#FFC220] hover:bg-yellow-400 text-slate-900 font-bold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
             >
                Continuar para Endereço
             </Button>
        </div>
    </div>
  );

  const renderAddressStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
           <CardTitle className="flex items-center gap-2 text-slate-800">
             <MapPin className="text-[#be342e]" /> Endereço de Entrega
           </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
           <div className="grid gap-4 max-w-md">
              <label className="text-sm font-bold text-slate-700">CEP para entrega</label>
              <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={cep}
                   onChange={(e) => setCep(e.target.value)}
                   onBlur={handleCalculateFreight}
                   placeholder="00000-000"
                   className={`flex-1 h-11 rounded-full border px-4 focus:ring-2 outline-none transition-all ${freightError ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:border-[#be342e] focus:ring-blue-100'}`}
                 />
                 <Button 
                   onClick={handleCalculateFreight} 
                   disabled={loadingFreight}
                   className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c] min-w-[100px]"
                 >
                    {loadingFreight ? <Loader2 className="w-5 h-5 animate-spin" /> : "Calcular"}
                 </Button>
              </div>
              
              {freightError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {freightError}
                  </p>
              )}

              {address && (
                <div className="mt-2 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in zoom-in-95">
                   <div className="flex items-start gap-3">
                       <CheckCircle className="w-5 h-5 text-[#be342e] mt-0.5 shrink-0" />
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Endereço Confirmado:</p>
                          <p className="text-slate-600 text-sm mt-1">{address}</p>
                          <div className="mt-3 flex items-center gap-2">
                              <Badge variant="success" className="bg-green-100 text-green-700 border border-green-200">
                                  Frete: R$ {freightCost.toFixed(2)}
                              </Badge>
                              <span className="text-xs text-slate-500">Prazo: 3 dias úteis</span>
                          </div>
                       </div>
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
                 { id: 'CREDIT_CARD', label: 'Cartão de Crédito', icon: CreditCard },
                 { id: 'TWO_CARDS', label: 'Dois Cartões', icon: Plus },
                 { id: 'BOLETO', label: 'Boleto Bancário', icon: Barcode },
               ].map((method) => (
                 <button
                   key={method.id}
                   onClick={() => setPaymentMethod(method.id as any)}
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
               <div className="max-w-md space-y-4 animate-in fade-in">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                     <p className="text-sm font-medium text-slate-700 mb-2">Cartão Principal</p>
                     <div className="flex gap-4">
                        <input type="text" placeholder="Número do Cartão" className="flex-1 h-10 rounded-lg border px-3" />
                        <input type="text" placeholder="MM/AA" className="w-24 h-10 rounded-lg border px-3" />
                        <input type="text" placeholder="CVV" className="w-20 h-10 rounded-lg border px-3" />
                     </div>
                     <input type="text" placeholder="Nome no Cartão" className="w-full h-10 rounded-lg border px-3 mt-3" />
                  </div>
               </div>
            )}

            {paymentMethod === 'TWO_CARDS' && (
               <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                     <AlertCircle className="w-4 h-4" />
                     Divida o valor total entre dois cartões de crédito.
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     {/* Card 1 */}
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                        <Badge className="absolute -top-2 -left-2 bg-[#be342e] text-white">Cartão 1</Badge>
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

                     {/* Card 2 */}
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative">
                        <Badge className="absolute -top-2 -left-2 bg-[#FFC220] text-slate-900">Cartão 2</Badge>
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
                            <input type="text" placeholder="Número do Cartão" className="w-full h-10 rounded-lg border px-3" />
                            <div className="flex gap-2">
                                <input type="text" placeholder="MM/AA" className="w-1/2 h-10 rounded-lg border px-3" />
                                <input type="text" placeholder="CVV" className="w-1/2 h-10 rounded-lg border px-3" />
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {paymentMethod === 'BOLETO' && (
               <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center animate-in fade-in">
                  <Barcode className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                  <p className="font-bold text-slate-700">Boleto Bancário Itaú</p>
                  <p className="text-sm text-slate-500">O boleto será gerado após a confirmação do pedido.</p>
                  <p className="text-xs text-slate-400 mt-2">Vencimento em 3 dias úteis.</p>
               </div>
            )}
         </CardContent>
       </Card>

       <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep(2)} className="text-slate-500">Voltar</Button>
          <Button 
            onClick={handlePlaceOrder}
            className="h-12 px-8 rounded-full bg-[#FFC220] hover:bg-yellow-400 text-slate-900 font-bold text-base shadow-md"
          >
             Finalizar Pedido
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
       <p className="text-slate-500 mb-8 text-lg">Seu pedido #50999 foi enviado para separação.</p>
       
       <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 text-left">
           <p className="font-bold text-slate-700 mb-4 border-b pb-2">Resumo da Entrega</p>
           <p className="text-sm text-slate-600 mb-1"><span className="font-bold">Endereço:</span> {address}</p>
           <p className="text-sm text-slate-600 mb-1"><span className="font-bold">Previsão:</span> 3 dias úteis</p>
           <p className="text-sm text-slate-600"><span className="font-bold">Total Pago:</span> R$ {totalWithFreight.toFixed(2)}</p>
       </div>

       <div className="flex justify-center gap-4">
          <Button onClick={onNavigateToHome} variant="outline" className="rounded-full h-10">Voltar para Loja</Button>
          <Button className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c] h-10">Acompanhar Pedido</Button>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900 pb-20">
       <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-20 flex items-center shadow-sm">
          <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
                    <img className="h-12" src="./lib/images/logo1.webp"/>
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
                        <span className="hidden md:inline">Endereço</span>
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

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                   <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-slate-200">
                      <h3 className="font-bold text-lg mb-4 text-slate-800">Resumo do Pedido</h3>
                      <div className="space-y-3 mb-6">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Subtotal ({cart.reduce((a,c) => a + c.quantity, 0)} itens)</span>
                            <span className="font-bold">R$ {cartTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Frete</span>
                            <span className="font-bold">{freightCost ? `R$ ${freightCost.toFixed(2)}` : '--'}</span>
                         </div>
                         {freightCost === 0 && (
                            <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded">
                               Informe o CEP na próxima etapa.
                            </p>
                         )}
                         <div className="border-t border-slate-100 pt-3 flex justify-between text-lg">
                            <span className="font-bold text-slate-800">Total</span>
                            <span className="font-bold text-[#be342e]">R$ {totalWithFreight.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                         </div>
                      </div>

                      <div className="bg-[#e6f1fc] p-4 rounded-xl mb-4">
                          <p className="text-xs font-bold text-[#be342e] mb-1 flex items-center gap-1">
                             <ShieldCheck className="w-3 h-3" /> Compra Garantida
                          </p>
                          <p className="text-xs text-slate-600 leading-tight">
                             Seus dados estão protegidos com criptografia de ponta a ponta.
                          </p>
                      </div>

                      <Button variant="ghost" onClick={onNavigateToHome} className="w-full text-xs text-slate-500">
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
