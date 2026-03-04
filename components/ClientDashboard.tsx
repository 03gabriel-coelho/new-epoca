
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tooltip } from './ui/Layout';
import { mockOrders, mockFinancials } from '../lib/mockData';
import { OrderStatus } from '../types';
import { FileText, RefreshCw, AlertCircle, CheckCircle, Clock, Bell, X, ShieldCheck, CreditCard, Truck, Store, ShoppingCart } from 'lucide-react';

// --- Mock Notification Data ---
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'Pedido Faturado', message: 'Seu pedido #50231 foi faturado e saiu para entrega.', time: '2 min atrás', type: 'success', read: false },
  { id: '2', title: 'Oferta Relâmpago', message: '5% de desconto em toda a linha de Limpeza até as 18h.', time: '1 hora atrás', type: 'info', read: false },
  { id: '3', title: 'Boleto Próximo ao Vencimento', message: 'O título #102030 vence em 2 dias. Evite juros.', time: '3 horas atrás', type: 'warning', read: true },
  { id: '4', title: 'Novo Produto Disponível', message: 'A linha premium de vinhos chilenos acabou de chegar.', time: '1 dia atrás', type: 'info', read: true },
];

// --- Components Specific to Client Dashboard ---

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleOpen = () => setIsOpen(!isOpen);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip content="Notificações">
        <Button 
          variant="outline" 
          className="relative h-10 w-10 p-0 rounded-full border-slate-200 hover:bg-slate-100 hover:text-[#0071DC]" 
          onClick={toggleOpen}
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white transform translate-x-[-2px] translate-y-[2px]"></span>
          )}
        </Button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
           <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
             <h4 className="font-semibold text-sm text-slate-900">Notificações</h4>
             {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-medium text-[#0071DC] hover:underline">
                  Marcar todas como lidas
                </button>
             )}
           </div>
           
           <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-2">
             {notifications.length === 0 ? (
               <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center">
                 <Bell className="h-8 w-8 text-slate-200 mb-2" />
                 <p>Nenhuma notificação.</p>
               </div>
             ) : (
               notifications.map(notification => (
                 <div 
                    key={notification.id} 
                    className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group relative cursor-default ${!notification.read ? 'bg-blue-50/30' : ''}`}
                 >
                    <div className="flex gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-[#0071DC]' : 'bg-slate-200'}`}></div>
                      <div className="flex-1 space-y-1">
                         <div className="flex justify-between items-start">
                            <span className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                              {notification.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notification.time}</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed pr-6">{notification.message}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => deleteNotification(notification.id, e)}
                      className="absolute right-2 top-2 p-1 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                 </div>
               ))
             )}
           </div>
           <div className="p-2 border-t border-slate-50 bg-slate-50/50 rounded-b-xl text-center">
             <button className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Ver histórico completo</button>
           </div>
        </div>
      )}
    </div>
  );
};

const CreditLimitCard = () => {
  const limit = 15000;
  const used = 12400;
  const percentage = (used / limit) * 100;

  // Determine color based on threshold (Green < 50%, Yellow < 80%, Red > 80%)
  let barColor = "bg-green-500";
  if (percentage > 80) barColor = "bg-red-500";
  else if (percentage > 50) barColor = "bg-yellow-500";

  return (
    <Card className="col-span-1 md:col-span-1 shadow-md border-t-4 border-t-[#0071DC]">
      <CardHeader className="bg-gradient-to-r from-slate-100 via-slate-50 to-white rounded-t-xl border-b border-slate-100/50">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>Limite de Crédito</span>
          <span className="text-sm font-normal text-slate-500">Atualizado agora</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Utilizado: R$ {used.toLocaleString('pt-BR')}</span>
            <span className="text-slate-500">Total: R$ {limit.toLocaleString('pt-BR')}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${barColor}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 pt-1">
            {100 - percentage < 10 ? 
              "Atenção: Seu limite está próximo do fim." : 
              "Você possui limite disponível para novas compras."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface OrdersTableProps {
  onNavigateToCheckout: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ onNavigateToCheckout }) => {
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.LIBERADO: return <Badge variant="success">Liberado</Badge>;
      case OrderStatus.BLOQUEADO: return <Badge variant="destructive">Bloqueado</Badge>;
      case OrderStatus.FATURADO: return <Badge variant="default">Faturado</Badge>; // Blueish/Dark
      case OrderStatus.ABERTO: return <Badge variant="warning">Em Aberto</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleTrackOrder = (orderId: string) => {
    alert(`Rastreamento do pedido ${orderId} aberto.`);
  };

  return (
    <Card className="col-span-1 md:col-span-2 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-slate-100 via-slate-50 to-white rounded-t-xl border-b border-slate-100/50">
        <CardTitle>Meus Pedidos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b bg-slate-50/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Nº Pedido (RCA)</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Itens</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Valor Total</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-6 align-middle font-medium">{order.winthor_numped}</td>
                  <td className="p-6 align-middle">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-6 align-middle">{order.items_count}</td>
                  <td className="p-6 align-middle">R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-6 align-middle">{getStatusBadge(order.status)}</td>
                  <td className="p-6 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        className="h-8 text-xs text-slate-500 hover:text-slate-900 rounded-full"
                        onClick={() => handleTrackOrder(order.id)}
                      >
                        <Truck className="w-3 h-3 mr-1" /> Rastrear
                      </Button>
                      <Button variant="outline" className="h-8 text-xs rounded-full border-[#0071DC] text-[#0071DC] hover:bg-blue-50" onClick={onNavigateToCheckout}>
                        Repetir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 text-xs text-slate-400 bg-slate-50/30 rounded-b-xl">
             <ShieldCheck className="w-4 h-4 text-[#0071DC]" />
             <span>Transações protegidas por ClearSale Antifraude</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FinancialTitles = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleGetBoleto = (id: string) => {
    setLoadingId(id);
    // Simulation of n8n webhook call latency -> Itaú API
    setTimeout(() => {
      setLoadingId(null);
      alert(`[INTEGRAÇÃO ITAÚ]\nSolicitação enviada via n8n.\nBoleto registrado no Itaú Shopline.\nPDF gerado com sucesso.`);
    }, 1500);
  };

  return (
    <Card className="col-span-1 md:col-span-3 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-slate-100 via-slate-50 to-white rounded-t-xl border-b border-slate-100/50">
        <CardTitle className="flex items-center gap-2">
            Central Financeira
            <span className="text-xs font-normal text-slate-400 ml-2 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Integração Banco Itaú
            </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
         <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b bg-slate-50/50">
              <tr className="border-b">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Documento</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Vencimento</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Valor</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Banco</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground text-right">2ª Via</th>
              </tr>
            </thead>
            <tbody>
              {mockFinancials.map((title) => (
                <tr key={title.id} className="border-b hover:bg-muted/50">
                  <td className="p-6 align-middle">{title.doc_number}</td>
                  <td className="p-6 align-middle">{new Date(title.due_date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-6 align-middle">R$ {title.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-6 align-middle">
                     {title.bank_data?.bank_name === 'ITAÚ' ? (
                         <div className="flex items-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-orange-500"></span> Itaú
                         </div>
                     ) : 'Outros'}
                  </td>
                  <td className="p-6 align-middle">
                    {title.status === 'PAID' && <div className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1"/> Pago</div>}
                    {title.status === 'OVERDUE' && <div className="flex items-center text-red-600"><AlertCircle className="w-4 h-4 mr-1"/> Vencido</div>}
                    {title.status === 'PENDING' && <div className="flex items-center text-yellow-600"><Clock className="w-4 h-4 mr-1"/> A Vencer</div>}
                  </td>
                  <td className="p-6 align-middle text-right">
                    {title.status !== 'PAID' && (
                      <Tooltip content="Gerar 2ª via Itaú (API)">
                        <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 rounded-full" 
                            onClick={() => handleGetBoleto(title.id)}
                            disabled={loadingId === title.id}
                        >
                            {loadingId === title.id ? <RefreshCw className="h-4 w-4 animate-spin"/> : <FileText className="h-4 w-4" />}
                        </Button>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

interface ClientDashboardProps {
  onNavigateToHome: () => void;
  onNavigateToCheckout: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigateToHome, onNavigateToCheckout }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Área do Cliente</h2>
          <p className="text-muted-foreground">Bem-vindo de volta, Supermercado Exemplo LTDA.</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" onClick={onNavigateToHome} className="text-[#0071DC] hover:bg-blue-50 rounded-full">
            <Store className="w-4 h-4 mr-2" /> Ir para Loja
          </Button>
          <NotificationCenter />
          <Button variant="outline" className="rounded-full">Falar com Vendedor</Button>
          <Button className="rounded-full bg-[#0071DC] hover:bg-[#004F9A] text-white" onClick={onNavigateToCheckout}>
            <ShoppingCart className="w-4 h-4 mr-2" /> Novo Pedido
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CreditLimitCard />
        <OrdersTable onNavigateToCheckout={onNavigateToCheckout} />
        <FinancialTitles />
      </div>
    </div>
  );
};

export default ClientDashboard;
