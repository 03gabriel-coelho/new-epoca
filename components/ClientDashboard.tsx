import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tooltip } from './ui/Layout';
import { mockOrders, mockFinancials } from '../lib/mockData';
import ProductImage from './ui/ProductImage';
import { AuthUser, OrderStatus, StoredOrder } from '../types';
import { updateStoredUser } from '../lib/authStorage';
import { getStoredOrdersByCustomer } from '../lib/ordersStorage';
import {
  FileText,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  Store,
  ShoppingCart,
  Building2,
  MapPin,
  Phone,
  Mail,
  Save,
  PackageSearch
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'Pedido Faturado', message: 'Seu pedido #50231 foi faturado e saiu para entrega.', time: '2 min atras', type: 'success', read: false },
  { id: '2', title: 'Oferta Relampago', message: '5% de desconto em toda a linha de Limpeza ate as 18h.', time: '1 hora atras', type: 'info', read: false },
  { id: '3', title: 'Boleto Proximo ao Vencimento', message: 'O titulo #102030 vence em 2 dias. Evite juros.', time: '3 horas atras', type: 'warning', read: true },
  { id: '4', title: 'Novo Produto Disponivel', message: 'A linha premium de vinhos chilenos acabou de chegar.', time: '1 dia atras', type: 'info', read: true }
];

interface ClientDashboardProps {
  currentUser: AuthUser | null;
  onNavigateToHome: () => void;
  onNavigateToCheckout: () => void;
  onCurrentUserUpdate?: (user: AuthUser) => void;
}

interface ClientProfileFormData {
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  telefone1: string;
  telefone2: string;
  email1: string;
  email2: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  pontoReferencia: string;
}

const DEFAULT_ZIP_CODE = '32150-240';

const getOrderStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.LIBERADO:
      return <Badge variant="success">Liberado</Badge>;
    case OrderStatus.BLOQUEADO:
      return <Badge variant="destructive">Bloqueado</Badge>;
    case OrderStatus.FATURADO:
      return <Badge variant="default">Faturado</Badge>;
    case OrderStatus.ABERTO:
      return <Badge variant="warning">Em Aberto</Badge>;
    case OrderStatus.CANCELADO:
      return <Badge variant="destructive">Cancelado</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getClientOrders = (currentUser: AuthUser | null) => {
  const storedOrders = currentUser ? getStoredOrdersByCustomer(currentUser.id) : [];
  return [...storedOrders, ...mockOrders].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
};

const formatZipCode = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) {
    return digits;
  }

  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
};

const buildInitialProfileData = (currentUser: AuthUser | null): ClientProfileFormData => ({
  cnpj: currentUser?.cnpj || '12.345.678/0001-90',
  nomeFantasia: currentUser?.tradeName || currentUser?.companyName || 'Cliente B2B',
  razaoSocial: currentUser?.legalName || currentUser?.companyName || 'Cliente B2B LTDA',
  telefone1: currentUser?.phone || '(31) 3333-4444',
  telefone2: currentUser?.phone2 || '(31) 98888-7777',
  email1: currentUser?.email || 'compras@cliente.com.br',
  email2: currentUser?.email2 || 'financeiro@cliente.com.br',
  cep: currentUser?.zipCode || DEFAULT_ZIP_CODE,
  logradouro: currentUser?.street || 'Av. dos Parceiros',
  numero: currentUser?.addressNumber || '1500',
  complemento: currentUser?.addressComplement || '',
  cidade: currentUser?.city || 'Belo Horizonte',
  estado: currentUser?.state || 'MG',
  pontoReferencia: currentUser?.referencePoint || 'Ao lado da praca principal'
});

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

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
      <Tooltip content="Notificacoes">
        <Button
          variant="outline"
          className="relative h-10 w-10 rounded-full border-slate-200 p-0 hover:bg-slate-100 hover:text-[#be342e]"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Bell className="h-5 w-5 text-slate-600 absolute"/>
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 h-3 w-3 translate-x-[-2px] translate-y-[2px] rounded-full border-2 border-white bg-red-500" />
          )}
        </Button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right animate-in zoom-in-95 rounded-xl border border-slate-100 bg-white shadow-2xl duration-200 sm:w-96">
          <div className="flex items-center justify-between rounded-t-xl border-b border-slate-50 bg-slate-50/50 p-4">
            <h4 className="text-sm font-semibold text-slate-900">Notificacoes</h4>
            {unreadCount > 0 && (
              <button
                onClick={() => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))}
                className="text-xs font-medium text-[#be342e] hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto py-2 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center p-8 text-center text-sm text-slate-500">
                <Bell className="mb-2 h-8 w-8 text-slate-200" />
                <p>Nenhuma notificacao.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative cursor-default border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!notification.read ? 'bg-[#be342e]' : 'bg-slate-200'}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <span className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </span>
                        <span className="ml-2 whitespace-nowrap text-[10px] text-slate-400">{notification.time}</span>
                      </div>
                      <p className="pr-6 text-xs leading-relaxed text-slate-500">{notification.message}</p>
                    </div>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setNotifications((prev) => prev.filter((item) => item.id !== notification.id));
                    }}
                    className="absolute right-2 top-2 p-1 text-slate-300 opacity-0 transition-opacity hover:text-slate-500 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="rounded-b-xl border-t border-slate-50 bg-slate-50/50 p-2 text-center">
            <button className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-900">Ver historico completo</button>
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

  let barColor = 'bg-green-500';
  if (percentage > 80) barColor = 'bg-red-500';
  else if (percentage > 50) barColor = 'bg-yellow-500';

  return (
    <Card className="col-span-1 border-t-4 border-t-[#be342e] shadow-md md:col-span-1">
      <CardHeader className="rounded-t-xl border-b border-slate-100/50 bg-gradient-to-r from-slate-100 via-slate-50 to-white">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Limite de Credito</span>
          <span className="text-sm font-normal text-slate-500">Atualizado agora</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Utilizado: R$ {used.toLocaleString('pt-BR')}</span>
            <span className="text-slate-500">Total: R$ {limit.toLocaleString('pt-BR')}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full transition-all duration-1000 ease-out ${barColor}`} style={{ width: `${percentage}%` }} />
          </div>
          <p className="pt-1 text-xs text-slate-500">
            {100 - percentage < 10
              ? 'Atencao: Seu limite esta proximo do fim.'
              : 'Voce possui limite disponivel para novas compras.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const OrdersTable: React.FC<{ currentUser: AuthUser | null; onNavigateToCheckout: () => void }> = ({
  currentUser,
  onNavigateToCheckout
}) => {
  const orders = getClientOrders(currentUser).slice(0, 6);

  return (
    <Card className="col-span-1 shadow-sm md:col-span-2">
      <CardHeader className="rounded-t-xl border-b border-slate-100/50 bg-gradient-to-r from-slate-100 via-slate-50 to-white">
        <CardTitle>Meus Pedidos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-left text-sm">
            <thead className="[&_tr]:border-b bg-slate-50/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Nº Pedido (RCA)</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Data</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Itens</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Valor Total</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-6 align-middle text-right font-medium text-muted-foreground">Acoes</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {orders.map((order) => (
                <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-6 align-middle font-medium">{order.winthor_numped}</td>
                  <td className="p-6 align-middle">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                  <td className="p-6 align-middle">{order.items_count}</td>
                  <td className="p-6 align-middle">R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-6 align-middle">{getOrderStatusBadge(order.status)}</td>
                  <td className="p-6 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="h-8 rounded-full text-xs text-slate-500 hover:text-slate-900"
                        onClick={() => alert(`Pedido #${order.winthor_numped}: ${'tracking_message' in order ? order.tracking_message : 'Pedido em acompanhamento logistico.'}`)}
                      >
                        <Truck className="mr-1 h-3 w-3" /> Rastrear
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 rounded-full border-[#be342e] text-xs text-[#be342e] hover:bg-blue-50"
                        onClick={onNavigateToCheckout}
                      >
                        Repetir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end gap-2 rounded-b-xl border-t border-slate-100 bg-slate-50/30 p-4 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-[#be342e]" />
            <span>Transacoes protegidas por ClearSale Antifraude</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FinancialTitles = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return (
    <Card className="col-span-1 shadow-sm md:col-span-3">
      <CardHeader className="rounded-t-xl border-b border-slate-100/50 bg-gradient-to-r from-slate-100 via-slate-50 to-white">
        <CardTitle className="flex items-center gap-2">
          Central Financeira
          <span className="ml-2 flex items-center gap-1 text-xs font-normal text-slate-400">
            <CreditCard className="h-3 w-3" /> Integracao Banco Itau
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-left text-sm">
            <thead className="[&_tr]:border-b bg-slate-50/50">
              <tr className="border-b">
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Documento</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Vencimento</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Valor</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Banco</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-6 align-middle text-right font-medium text-muted-foreground">2a Via</th>
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
                        <span className="h-2 w-2 rounded-full bg-orange-500" /> Itau
                      </div>
                    ) : (
                      'Outros'
                    )}
                  </td>
                  <td className="p-6 align-middle">
                    {title.status === 'PAID' && <div className="flex items-center text-green-600"><CheckCircle className="mr-1 h-4 w-4" /> Pago</div>}
                    {title.status === 'OVERDUE' && <div className="flex items-center text-red-600"><AlertCircle className="mr-1 h-4 w-4" /> Vencido</div>}
                    {title.status === 'PENDING' && <div className="flex items-center text-yellow-600"><Clock className="mr-1 h-4 w-4" /> A Vencer</div>}
                  </td>
                  <td className="p-6 align-middle text-right">
                    {title.status !== 'PAID' && (
                      <Tooltip content="Gerar 2a via Itau (API)">
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0"
                          onClick={() => {
                            setLoadingId(title.id);
                            setTimeout(() => {
                              setLoadingId(null);
                              alert('[INTEGRACAO ITAU]\nSolicitacao enviada via n8n.\nBoleto registrado no Itau Shopline.\nPDF gerado com sucesso.');
                            }, 1500);
                          }}
                          disabled={loadingId === title.id}
                        >
                          {loadingId === title.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
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

const ProfileField = ({
  label,
  value,
  onChange,
  icon: Icon,
  disabled = false,
  type = 'text',
  placeholder,
  multiline = false
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) => {
  const sharedClassName = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
    disabled
      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
      : 'border-slate-200 bg-white text-slate-900 focus:border-[#be342e] focus:ring-4 focus:ring-[#be342e]/10'
  }`;

  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <div className="relative">
        <Icon className={`absolute left-3 top-3.5 h-4 w-4 ${disabled ? 'text-slate-400' : 'text-[#be342e]'}`} />
        {multiline ? (
          <textarea
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            rows={4}
            className={`${sharedClassName} min-h-[112px] resize-none pl-10`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className={`${sharedClassName} h-12 pl-10`}
          />
        )}
      </div>
    </label>
  );
};

const ClientProfileCard: React.FC<{ currentUser: AuthUser | null; onCurrentUserUpdate?: (user: AuthUser) => void }> = ({
  currentUser,
  onCurrentUserUpdate
}) => {
  const [formData, setFormData] = useState<ClientProfileFormData>(() => buildInitialProfileData(currentUser));
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isFetchingZipCode, setIsFetchingZipCode] = useState(false);

  useEffect(() => {
    setFormData(buildInitialProfileData(currentUser));
    setSaveStatus('idle');
    setFeedbackMessage('');
  }, [currentUser]);

  const updateField = (field: keyof ClientProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus('idle');
    setFeedbackMessage('');
  };

  const handleZipCodeChange = async (value: string) => {
    const formattedZipCode = formatZipCode(value);
    updateField('cep', formattedZipCode);

    if (formattedZipCode.replace(/\D/g, '').length !== 8) {
      return;
    }

    setIsFetchingZipCode(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${formattedZipCode.replace(/\D/g, '')}/json/`);
      const data = await response.json();

      if (data?.erro) {
        throw new Error('CEP nao encontrado.');
      }

      setFormData((prev) => ({
        ...prev,
        cep: formattedZipCode,
        logradouro: data.logradouro || prev.logradouro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }));
      setFeedbackMessage('Endereco preenchido automaticamente a partir do CEP.');
    } catch (error) {
      setSaveStatus('error');
      setFeedbackMessage(error instanceof Error ? error.message : 'Falha ao consultar o CEP.');
    } finally {
      setIsFetchingZipCode(false);
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      setSaveStatus('error');
      setFeedbackMessage('Nao foi possivel identificar o usuario logado.');
      return;
    }

    setSaveStatus('saving');
    setFeedbackMessage('Salvando dados...');

    window.setTimeout(() => {
      try {
        const updatedUser = updateStoredUser(currentUser.id, {
          companyName: formData.nomeFantasia || currentUser.companyName,
          tradeName: formData.nomeFantasia,
          legalName: formData.razaoSocial,
          phone: formData.telefone1,
          phone2: formData.telefone2,
          email: formData.email1,
          email2: formData.email2,
          fullAddress: `${formData.logradouro}, ${formData.numero}${formData.complemento ? ` - ${formData.complemento}` : ''}, ${formData.cidade} - ${formData.estado}, ${formData.cep}`,
          referencePoint: formData.pontoReferencia,
          zipCode: formData.cep,
          street: formData.logradouro,
          addressNumber: formData.numero,
          addressComplement: formData.complemento,
          city: formData.cidade,
          state: formData.estado,
        });

        onCurrentUserUpdate?.(updatedUser);
        setSaveStatus('saved');
        setFeedbackMessage('Dados salvos com sucesso.');
      } catch (error) {
        setSaveStatus('error');
        setFeedbackMessage(error instanceof Error ? error.message : 'Falha ao salvar os dados.');
      }
    }, 1200);
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#fff4f3] via-white to-slate-50">
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#be342e] text-white">
            <Building2 className="h-5 w-5" />
          </span>
          Dados do Cliente
        </CardTitle>
        <p className="text-sm text-slate-500">
          Mantenha os contatos e o endereco da empresa atualizados para agilizar atendimento e entrega.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ProfileField label="CNPJ" value={formData.cnpj} icon={Building2} disabled />
          <ProfileField label="Nome Fantasia" value={formData.nomeFantasia} icon={Building2} disabled />
          <ProfileField label="Razao Social" value={formData.razaoSocial} icon={Building2} disabled />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProfileField label="Telefone 1" value={formData.telefone1} onChange={(value) => updateField('telefone1', value)} icon={Phone} placeholder="(00) 0000-0000" />
          <ProfileField label="Telefone 2" value={formData.telefone2} onChange={(value) => updateField('telefone2', value)} icon={Phone} placeholder="(00) 00000-0000" />
          <ProfileField label="Email 1" value={formData.email1} onChange={(value) => updateField('email1', value)} icon={Mail} type="email" placeholder="compras@empresa.com.br" />
          <ProfileField label="Email 2" value={formData.email2} onChange={(value) => updateField('email2', value)} icon={Mail} type="email" placeholder="financeiro@empresa.com.br" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ProfileField
            label="CEP"
            value={formData.cep}
            onChange={handleZipCodeChange}
            icon={MapPin}
            placeholder="00000-000"
          />
          <ProfileField
            label="Rua / Logradouro"
            value={formData.logradouro}
            onChange={(value) => updateField('logradouro', value)}
            icon={MapPin}
            placeholder="Rua, avenida, etc."
          />
          <ProfileField
            label="Numero"
            value={formData.numero}
            onChange={(value) => updateField('numero', value)}
            icon={Building2}
            placeholder="Numero"
          />
          <ProfileField
            label="Complemento"
            value={formData.complemento}
            onChange={(value) => updateField('complemento', value)}
            icon={Building2}
            placeholder="Sala, bloco, apartamento"
          />
          <ProfileField
            label="Cidade"
            value={formData.cidade}
            onChange={(value) => updateField('cidade', value)}
            icon={MapPin}
            placeholder="Cidade"
          />
          <ProfileField
            label="Estado"
            value={formData.estado}
            onChange={(value) => updateField('estado', value)}
            icon={MapPin}
            placeholder="UF"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <ProfileField
            label="Ponto de Referencia"
            value={formData.pontoReferencia}
            onChange={(value) => updateField('pontoReferencia', value)}
            icon={MapPin}
            multiline
            placeholder="Ex.: Portao lateral, esquina com..."
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Os dados fiscais ficam bloqueados nesta tela. Para alteracoes cadastrais, fale com seu consultor Epoca.
          </p>
          <div className="flex items-center gap-3">
            {isFetchingZipCode && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Buscando endereco pelo CEP...
              </span>
            )}
            {saveStatus !== 'idle' && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  saveStatus === 'saved'
                    ? 'bg-green-100 text-green-700'
                    : saveStatus === 'saving'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                }`}
              >
                {feedbackMessage}
              </span>
            )}
            <Button
              className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c]"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar dados
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ClientHeader: React.FC<ClientDashboardProps> = ({ currentUser, onNavigateToHome, onNavigateToCheckout }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">Area do Cliente</h2>
      <p className="text-muted-foreground">Bem-vindo de volta, {currentUser?.companyName || 'Cliente B2B'}.</p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={onNavigateToHome} className="rounded-full text-[#be342e] hover:bg-blue-50">
        <Store className="mr-2 h-4 w-4" /> Ir para Loja
      </Button>
      <NotificationCenter />
      <Button variant="outline" className="rounded-full">Falar com Vendedor</Button>
      <Button className="rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c]" onClick={onNavigateToCheckout}>
        <ShoppingCart className="mr-2 h-4 w-4" /> Novo Pedido
      </Button>
    </div>
  </div>
);

const ClientDashboard: React.FC<ClientDashboardProps> = ({ currentUser, onNavigateToHome, onNavigateToCheckout }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <CreditLimitCard />
        <OrdersTable currentUser={currentUser} onNavigateToCheckout={onNavigateToCheckout} />
        <FinancialTitles />
      </div>
    </div>
  );
};

export const ClientOrdersPage: React.FC<ClientDashboardProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToCheckout
}) => {
  const orders = useMemo(() => (currentUser ? getStoredOrdersByCustomer(currentUser.id) : []), [currentUser?.id]);
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);

  useEffect(() => {
    setSelectedOrder(orders[0] || null);
  }, [currentUser?.id, orders]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#fff4f3] via-white to-slate-50">
            <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#be342e] text-white">
                <PackageSearch className="h-5 w-5" />
              </span>
              Meus Pedidos
            </CardTitle>
            <p className="text-sm text-slate-500">Acompanhe pedidos confirmados no checkout e seu historico recente.</p>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrder('customer_id' in order ? order : null)}
                    className="flex w-full flex-col gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-base font-bold text-slate-900">Pedido #{order.winthor_numped}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(order.date).toLocaleDateString('pt-BR')} • {order.items_count} itens
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Valor total</p>
                      <p className="text-lg font-bold text-[#be342e]">
                        R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-900">Nenhum pedido encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">Assim que um pedido for finalizado no checkout, ele aparecera aqui para acompanhamento.</p>
                <Button className="mt-5 rounded-full bg-[#be342e] text-white hover:bg-[#b70e0c]" onClick={onNavigateToCheckout}>
                  Fazer novo pedido
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50">
            <CardTitle className="text-lg text-slate-900">Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {selectedOrder ? (
              <>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-900">#{selectedOrder.winthor_numped}</span>
                    {getOrderStatusBadge(selectedOrder.status)}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{selectedOrder.tracking_message}</p>
                </div>

                <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p><span className="font-bold text-slate-800">Data:</span> {new Date(selectedOrder.date).toLocaleString('pt-BR')}</p>
                  <p><span className="font-bold text-slate-800">Pagamento:</span> {selectedOrder.payment_method === 'PIX' ? 'PIX' : selectedOrder.payment_method === 'BOLETO' ? 'Boleto' : 'Cartao'}</p>
                  <p><span className="font-bold text-slate-800">Entrega:</span> {selectedOrder.address}</p>
                </div>

                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Itens do pedido</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={`${selectedOrder.id}-${item.product_id}`} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
                        <ProductImage
                          src={item.image_path}
                          alt={item.description}
                          className="h-14 w-14 rounded-xl border border-slate-100"
                          imgClassName="h-full w-full object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-slate-800">{item.description}</p>
                          <p className="text-xs text-slate-400">Cod. {item.winthor_codprod}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">{item.quantity}x</p>
                          <p className="text-xs text-slate-500">R$ {item.unit_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-700">Beneficio de combos</span>
                    <span className="font-bold text-green-700">
                      R$ {selectedOrder.combo_savings_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-green-100 pt-3">
                    <span className="text-sm font-bold text-slate-800">Total do pedido</span>
                    <span className="text-lg font-bold text-[#be342e]">
                      R$ {selectedOrder.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
                <p className="max-w-xs text-sm text-slate-500">Selecione um pedido finalizado no checkout para ver os detalhes completos e acompanhar a entrega.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ClientProfilePage: React.FC<ClientDashboardProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToCheckout,
  onCurrentUserUpdate
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />
      <ClientProfileCard currentUser={currentUser} onCurrentUserUpdate={onCurrentUserUpdate} />
    </div>
  );
};

export default ClientDashboard;
