import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tooltip } from './ui/Layout';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ProductImage from './ui/ProductImage';
import { AuthUser, OrderStatus, StoredOrder } from '../types';
import { updateStoredUser } from '../lib/authStorage';
import { DEFAULT_ZIP_CODE, formatPartialZipCode, resolveZipCodeFromIp } from '../lib/location';
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
  PackageSearch,
  ArrowLeft
} from 'lucide-react';

const WHATSAPP_SUPPORT_URL = 'https://api.whatsapp.com/send/?phone=5531997935059&text&type=phone_number&app_absent=0';

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

type OrderHelpTopicId =
  | 'problema-produto'
  | 'pacote-sem-produto'
  | 'envio-nao-chegou'
  | 'opinar-entrega'
  | 'cuidar-produto-devolver'
  | 'ajuda-nfe'
  | 'pagamento-duplicado';

interface OrderHelpTopic {
  id: OrderHelpTopicId;
  title: string;
  description: string;
  expectedResponse: string;
  messageLabel: string;
  messagePlaceholder: string;
  attachmentLabel?: string;
  allowAttachment?: boolean;
  tips: string[];
}

const orderHelpTopics: OrderHelpTopic[] = [
  {
    id: 'problema-produto',
    title: 'Recebi o produto com um problema',
    description: 'Abra um chamado de avaria, vencimento, embalagem danificada ou item divergente.',
    expectedResponse: 'Analise do time de atendimento em ate 1 dia util.',
    messageLabel: 'Descreva o problema encontrado',
    messagePlaceholder: 'Ex.: A caixa chegou amassada e 3 unidades vieram vazando. Gostaria de orientacao para troca.',
    attachmentLabel: 'Anexar fotos do produto ou da embalagem',
    allowAttachment: true,
    tips: ['Informe quais itens foram afetados.', 'Se puder, adicione fotos mostrando lote, validade ou dano visivel.']
  },
  {
    id: 'pacote-sem-produto',
    title: 'Recebi um pacote sem o produto',
    description: 'Registre falta de item ou volume com conferencia de embalagem e nota.',
    expectedResponse: 'Conferencia com logistica e retorno em ate 24 horas.',
    messageLabel: 'Conte o que faltou no pacote',
    messagePlaceholder: 'Ex.: O volume 2 chegou lacrado, mas o item detergente 5L nao veio dentro da caixa.',
    attachmentLabel: 'Anexar foto do pacote e da NF-e',
    allowAttachment: true,
    tips: ['Informe o nome do item faltante.', 'Se houver divergencia entre volumes e nota, mencione isso na mensagem.']
  },
  {
    id: 'envio-nao-chegou',
    title: 'Nao chegou o envio',
    description: 'Simule uma solicitacao de atraso ou pedido nao entregue.',
    expectedResponse: 'Acionamento da transportadora e atualizacao do rastreio.',
    messageLabel: 'Informe o que aconteceu com a entrega',
    messagePlaceholder: 'Ex.: A previsao era ontem, mas o pedido ainda nao chegou e nao houve tentativa registrada.',
    tips: ['Confirme se houve tentativa de entrega.', 'Se o endereco ou contato mudou, sinalize no texto.']
  },
  {
    id: 'opinar-entrega',
    title: 'Opinar sobre a entrega e o entregador',
    description: 'Compartilhe elogio, reclamacao ou comentario sobre a experiencia da entrega.',
    expectedResponse: 'Registro enviado para a central de qualidade e operacao.',
    messageLabel: 'Como foi sua experiencia?',
    messagePlaceholder: 'Ex.: O entregador foi muito atencioso e chegou dentro da janela combinada.',
    tips: ['Voce pode registrar elogios ou pontos de melhoria.', 'Use este canal para feedback sobre atendimento na entrega.']
  },
  {
    id: 'cuidar-produto-devolver',
    title: 'Como cuidar do produto se precisar devolver',
    description: 'Mostra orientacoes praticas antes da coleta ou devolucao do item.',
    expectedResponse: 'Fluxo guiado com orientacoes de armazenamento e preparo para coleta.',
    messageLabel: 'Se quiser, deixe uma observacao adicional',
    messagePlaceholder: 'Ex.: Preciso devolver alimentos refrigerados e quero confirmar como armazenar ate a coleta.',
    tips: ['Mantenha o produto nas condicoes originais de armazenamento.', 'Nao descarte embalagem, lote nem etiqueta ate receber retorno.']
  },
  {
    id: 'ajuda-nfe',
    title: 'Preciso de ajuda com a NF-e',
    description: 'Solicite segunda via, correcao de dados ou esclarecimentos sobre a nota fiscal.',
    expectedResponse: 'Encaminhamento para o fiscal com retorno pelo protocolo do pedido.',
    messageLabel: 'Qual ajuda voce precisa com a NF-e?',
    messagePlaceholder: 'Ex.: Preciso da chave de acesso e do XML da nota para conferencia no financeiro.',
    attachmentLabel: 'Anexar comprovante ou documento de apoio',
    allowAttachment: true,
    tips: ['Mencione se precisa de XML, DANFE ou correcao cadastral.', 'Se houver divergencia fiscal, descreva exatamente o dado incorreto.']
  },
  {
    id: 'pagamento-duplicado',
    title: 'O pagamento foi duplicado no meu cartao',
    description: 'Abra uma contestacao para cobranca em duplicidade.',
    expectedResponse: 'Triagem financeira com validacao das capturas do cartao.',
    messageLabel: 'Descreva a cobranca duplicada',
    messagePlaceholder: 'Ex.: A compra apareceu duas vezes na fatura com o mesmo valor e mesma data.',
    attachmentLabel: 'Anexar print da fatura ou comprovante',
    allowAttachment: true,
    tips: ['Informe os ultimos 4 digitos do cartao, se quiser.', 'Anexe print com data e valor para agilizar a conferencia.']
  }
];

const getOrderHelpTopicById = (topicId?: string) =>
  orderHelpTopics.find((topic) => topic.id === topicId);

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
  bairro: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  pontoReferencia: string;
}

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

const getPaymentMethodLabel = (paymentMethod: StoredOrder['payment_method']) => {
  return paymentMethod === 'PIX' ? 'PIX' : paymentMethod === 'BOLETO' ? 'Boleto' : 'Cartao';
};

const getPaymentStatusLabel = (order: StoredOrder) => {
  if (order.payment_method === 'PIX') {
    return 'Pagamento confirmado';
  }

  if (order.payment_method === 'BOLETO') {
    return 'Aguardando pagamento do boleto';
  }

  return 'Aguardando confirmacao do pagamento';
};

const getOrderHelpTopicIcon = (topicId: OrderHelpTopicId) => {
  switch (topicId) {
    case 'problema-produto':
      return AlertCircle;
    case 'pacote-sem-produto':
      return PackageSearch;
    case 'envio-nao-chegou':
      return Truck;
    case 'opinar-entrega':
      return CheckCircle;
    case 'cuidar-produto-devolver':
      return ShieldCheck;
    case 'ajuda-nfe':
      return FileText;
    case 'pagamento-duplicado':
      return CreditCard;
    default:
      return FileText;
  }
};

const OrderHelpButton: React.FC<{
  orderId: string;
  className?: string;
}> = ({ orderId, className }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className={className ?? 'rounded-full border-[#13733D] text-[#13733D] hover:bg-[#EEF8F1]'}
      onClick={() => navigate(`/cliente/pedidos/${orderId}/ajuda`)}
    >
      <FileText className="mr-2 h-4 w-4" />
      Ajuda com o pedido
    </Button>
  );
};

const OrderHelpOptionCard: React.FC<{
  orderId: string;
  topic: OrderHelpTopic;
}> = ({ orderId, topic }) => {
  const navigate = useNavigate();
  const Icon = getOrderHelpTopicIcon(topic.id);

  return (
    <button
      type="button"
      onClick={() => navigate(`/cliente/pedidos/${orderId}/ajuda/${topic.id}`)}
      className="group flex w-full items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#13733D]/30 hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF8F1] text-[#13733D]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-slate-900">{topic.title}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-500">{topic.description}</span>
        <span className="mt-3 inline-flex items-center text-xs font-bold uppercase tracking-[0.14em] text-[#13733D]">
          Ver atendimento
        </span>
      </span>
    </button>
  );
};

const OrderHelpTopicFlow: React.FC<{
  order: StoredOrder;
  topic: OrderHelpTopic;
}> = ({ order, topic }) => {
  const navigate = useNavigate();
  const Icon = getOrderHelpTopicIcon(topic.id);
  const [message, setMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#EEF8F1] via-white to-slate-50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#13733D] text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Ajuda com o pedido #{order.winthor_numped}</p>
                <CardTitle className="mt-1 text-2xl text-slate-900">{topic.title}</CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{topic.description}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate(`/cliente/pedidos/${order.id}/ajuda`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para categorias
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Descreva a solicitacao</p>
              <label className="mt-4 block text-sm font-semibold text-slate-800">{topic.messageLabel}</label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={topic.messagePlaceholder}
                className="mt-2 min-h-[160px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-[#13733D] focus:ring-4 focus:ring-[#13733D]/10"
              />

              {topic.allowAttachment && (
                <label className="mt-4 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition-colors hover:border-[#13733D]/40 hover:bg-[#EEF8F1]/40">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#13733D] shadow-sm">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{topic.attachmentLabel}</p>
                      <p className="text-xs text-slate-500">Envie foto, print, XML ou documento de apoio.</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#13733D]/20 bg-white px-3 py-1 text-xs font-bold text-[#13733D]">
                    Escolher arquivo
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.xml,.doc,.docx"
                    onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name || '')}
                  />
                </label>
              )}

              {selectedFileName && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                  <FileText className="h-3.5 w-3.5 text-[#13733D]" />
                  {selectedFileName}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  className="rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]"
                  onClick={() => setSubmitted(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Enviar solicitacao
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setMessage('');
                    setSelectedFileName('');
                    setSubmitted(false);
                  }}
                >
                  Limpar formulario
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">O que acontece depois</p>
                <p className="mt-3 text-sm font-semibold text-slate-800">{topic.expectedResponse}</p>
                <div className="mt-4 space-y-3">
                  {topic.tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#13733D]" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-700">Dados do atendimento</p>
                <div className="mt-3 space-y-2">
                  <p><span className="font-bold">Pedido:</span> #{order.winthor_numped}</p>
                  <p><span className="font-bold">Entrega:</span> {order.address}</p>
                  <p><span className="font-bold">Pagamento:</span> {getPaymentMethodLabel(order.payment_method)}</p>
                </div>
              </div>
            </div>
          </div>

          {submitted && (
            <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white">
                  <CheckCircle className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-green-700">Chamado criado</p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">Protocolo #{order.winthor_numped}-{topic.id.toUpperCase()}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Sua mensagem foi registrada com sucesso{selectedFileName ? ` e o arquivo "${selectedFileName}" foi anexado.` : '.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ClientOrderDetailsContent: React.FC<{
  order: StoredOrder;
}> = ({ order }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Detalhes do Pedido</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-lg font-bold text-slate-900">#{order.winthor_numped}</span>
          {getOrderStatusBadge(order.status)}
        </div>
      </div>
    </div>

    <div className="space-y-5 p-6">
      <div>
        <p className="text-sm text-slate-500">{order.tracking_message}</p>
      </div>

      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
        <p><span className="font-bold text-slate-800">Data:</span> {new Date(order.date).toLocaleString('pt-BR')}</p>
        <p><span className="font-bold text-slate-800">Pagamento:</span> {getPaymentMethodLabel(order.payment_method)}</p>
        <p><span className="font-bold text-slate-800">Status do pagamento:</span> {getPaymentStatusLabel(order)}</p>
        <p><span className="font-bold text-slate-800">Entrega:</span> {order.address}</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Itens do pedido</p>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={`${order.id}-${item.product_id}`} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
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
            R$ {order.combo_savings_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-green-100 pt-3">
          <span className="text-sm font-bold text-slate-800">Total do pedido</span>
          <span className="text-lg font-bold text-[#13733D]">
            R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Precisa resolver algo neste pedido?</p>
          <p className="text-sm text-slate-500">Abra uma jornada de ajuda para entrega, NF-e, pagamento e devolucao.</p>
        </div>
        <OrderHelpButton orderId={order.id} />
      </div>
    </div>
  </div>
);

const buildInitialProfileData = (currentUser: AuthUser | null): ClientProfileFormData => ({
  cnpj: currentUser?.cnpj || '',
  nomeFantasia: currentUser?.tradeName || currentUser?.companyName || '',
  razaoSocial: currentUser?.legalName || currentUser?.companyName || '',
  telefone1: currentUser?.phone || '',
  telefone2: currentUser?.phone2 || '',
  email1: currentUser?.email || '',
  email2: currentUser?.email2 || '',
  cep: currentUser?.zipCode || '',
  logradouro: currentUser?.street || '',
  bairro: currentUser?.district || '',
  numero: currentUser?.addressNumber || '',
  complemento: currentUser?.addressComplement || '',
  cidade: currentUser?.city || '',
  estado: currentUser?.state || '',
  pontoReferencia: currentUser?.referencePoint || ''
});

const buildFullAddress = (formData: ClientProfileFormData) => {
  const streetLine = [formData.logradouro, formData.numero].filter(Boolean).join(', ');
  const complement = formData.complemento ? ` - ${formData.complemento}` : '';
  const locationLine = [formData.bairro, formData.cidade, formData.estado].filter(Boolean).join(' - ');

  return [streetLine ? `${streetLine}${complement}` : '', locationLine, formData.cep].filter(Boolean).join(', ');
};

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
          className="relative h-10 w-10 rounded-full border-slate-200 p-0 hover:bg-slate-100 hover:text-[#13733D]"
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
                className="text-xs font-medium text-[#13733D] hover:underline"
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
                  className={`group relative cursor-default border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-slate-50 ${!notification.read ? 'bg-[#EEF8F1]/30' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${!notification.read ? 'bg-[#13733D]' : 'bg-slate-200'}`} />
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
    <Card className="col-span-1 border-t-4 border-t-[#13733D] shadow-md md:col-span-1">
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

const OrdersTable: React.FC<{
  currentUser: AuthUser | null;
  onNavigateToCheckout: () => void;
}> = ({
  currentUser,
  onNavigateToCheckout
}) => {
  const navigate = useNavigate();
  const orders = useMemo(() => (currentUser ? getStoredOrdersByCustomer(currentUser.id) : []), [currentUser?.id]);

  return (
    <Card className="col-span-1 shadow-sm md:col-span-2">
      <CardHeader className="rounded-t-xl border-b border-slate-100/50 bg-gradient-to-r from-slate-100 via-slate-50 to-white">
        <CardTitle>Meus Pedidos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length > 0 ? (
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-left text-sm">
              <thead className="[&_tr]:border-b bg-slate-50/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Nº Pedido (RCA)</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Data</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Itens</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Valor Total</th>
                  <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-6 align-middle text-right font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
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
                          onClick={() => navigate(`/cliente/pedidos/${order.id}`)}
                        >
                          <Truck className="mr-1 h-3 w-3" /> Ver detalhes
                        </Button>
                        <OrderHelpButton
                          orderId={order.id}
                          className="h-8 rounded-full border-[#13733D] text-xs text-[#13733D] hover:bg-[#EEF8F1]"
                        />
                        <Button
                          variant="outline"
                          className="h-8 rounded-full border-[#13733D] text-xs text-[#13733D] hover:bg-[#EEF8F1]"
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
              <ShieldCheck className="h-4 w-4 text-[#13733D]" />
              <span>Transacoes protegidas por ClearSale Antifraude</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-900">Nenhum pedido recente</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">Assim que um pedido for finalizado no checkout, ele aparecera aqui.</p>
            <Button className="mt-5 rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]" onClick={onNavigateToCheckout}>
              Fazer novo pedido
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ClientOrderDetailsPage: React.FC<ClientDashboardProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToCheckout
}) => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const orders = useMemo(() => (currentUser ? getStoredOrdersByCustomer(currentUser.id) : []), [currentUser?.id]);
  const order = orders.find((entry) => entry.id === orderId);

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Meus Pedidos</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {order ? `Pedido #${order.winthor_numped}` : 'Pedido nao encontrado'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {order
                ? 'Consulte os itens, pagamento e status da entrega em uma tela dedicada.'
                : 'Esse pedido nao esta disponivel para o usuario atual.'}
            </p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => navigate('/cliente/pedidos')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para pedidos
          </Button>
        </div>

        {order ? (
          <ClientOrderDetailsContent order={order} />
        ) : (
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-900">Pedido nao encontrado</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Volte para a lista de pedidos para selecionar um pedido valido.
              </p>
              <Button className="mt-5 rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]" onClick={() => navigate('/cliente/pedidos')}>
                Ver meus pedidos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export const ClientOrderHelpPage: React.FC<ClientDashboardProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToCheckout
}) => {
  const navigate = useNavigate();
  const { orderId, topicId } = useParams();
  const orders = useMemo(() => (currentUser ? getStoredOrdersByCustomer(currentUser.id) : []), [currentUser?.id]);
  const order = orders.find((entry) => entry.id === orderId);
  const selectedTopic = getOrderHelpTopicById(topicId);

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Ajuda com o Pedido</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {order ? `Pedido #${order.winthor_numped}` : 'Pedido nao encontrado'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {order
                ? 'Escolha o assunto e siga o fluxo de atendimento com mensagem, anexos e protocolo.'
                : 'Esse pedido nao esta disponivel para o usuario atual.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {order && (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate(`/cliente/pedidos/${order.id}`)}
              >
                Ver detalhes do pedido
              </Button>
            )}
            <Button variant="outline" className="rounded-full" onClick={() => navigate('/cliente/pedidos')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para pedidos
            </Button>
          </div>
        </div>

        {!order ? (
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-900">Pedido nao encontrado</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Volte para a lista de pedidos para selecionar um pedido valido.
              </p>
              <Button className="mt-5 rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]" onClick={() => navigate('/cliente/pedidos')}>
                Ver meus pedidos
              </Button>
            </CardContent>
          </Card>
        ) : selectedTopic ? (
          <OrderHelpTopicFlow order={order} topic={selectedTopic} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="overflow-hidden border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#EEF8F1] via-white to-slate-50">
                <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#13733D] text-white">
                    <FileText className="h-5 w-5" />
                  </span>
                  Como podemos ajudar neste pedido?
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Escolha uma categoria para abrir seu atendimento.
                </p>
              </CardHeader>
              <CardContent className="grid gap-4 p-6">
                {orderHelpTopics.map((topic) => (
                  <OrderHelpOptionCard key={topic.id} orderId={order.id} topic={topic} />
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50">
                  <CardTitle className="text-lg text-slate-900">Resumo do pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-6 text-sm text-slate-600">
                  <p><span className="font-bold text-slate-900">Pedido:</span> #{order.winthor_numped}</p>
                  <p><span className="font-bold text-slate-900">Data:</span> {new Date(order.date).toLocaleDateString('pt-BR')}</p>
                  <p><span className="font-bold text-slate-900">Status:</span> {getPaymentStatusLabel(order)}</p>
                  <p><span className="font-bold text-slate-900">Entrega:</span> {order.address}</p>
                  <p><span className="font-bold text-slate-900">Valor:</span> R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </CardContent>
              </Card>

              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Recursos do atendimento</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#13733D]" />
                    <span>Campos de texto para descrever ocorrencias e observacoes.</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <Save className="mt-0.5 h-4 w-4 shrink-0 text-[#13733D]" />
                    <span>Envio de fotos, prints da fatura, NF-e ou comprovantes.</span>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#13733D]" />
                    <span>Geracao de protocolo e proxima etapa do atendimento.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FinancialTitles = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const installmentRows = useMemo(
    () =>
      [
        { id: 'ped-50231-bol-1', orderNumber: '50231', installmentLabel: 'Parcela 1', dueDate: '2026-03-20', value: 1200, status: 'OVERDUE' as const, paymentMethod: 'Boleto' as const },
        { id: 'ped-50231-bol-2', orderNumber: '50231', installmentLabel: 'Parcela 2', dueDate: '2026-04-20', value: 1200, status: 'PENDING' as const, paymentMethod: 'Boleto' as const },
        { id: 'ped-50231-bol-3', orderNumber: '50231', installmentLabel: 'Parcela 3', dueDate: '2026-05-20', value: 1200, status: 'PENDING' as const, paymentMethod: 'Boleto' as const },
        { id: 'ped-50248-cc-1', orderNumber: '50248', installmentLabel: 'Parcela 1', dueDate: '2026-02-15', value: 980, status: 'PAID' as const, paymentMethod: 'Cartao de Credito' as const },
        { id: 'ped-50248-cc-2', orderNumber: '50248', installmentLabel: 'Parcela 2', dueDate: '2026-03-15', value: 980, status: 'PAID' as const, paymentMethod: 'Cartao de Credito' as const },
        { id: 'ped-50248-cc-3', orderNumber: '50248', installmentLabel: 'Parcela 3', dueDate: '2026-04-15', value: 980, status: 'PENDING' as const, paymentMethod: 'Cartao de Credito' as const },
        { id: 'ped-50263-bol-1', orderNumber: '50263', installmentLabel: 'Parcela 1', dueDate: '2026-04-05', value: 650, status: 'PENDING' as const, paymentMethod: 'Boleto' as const },
      ].sort((left, right) => {
        const getPriority = (item: { status: 'PENDING' | 'PAID' | 'OVERDUE'; paymentMethod: 'Boleto' | 'Cartao de Credito' }) => {
          if (item.status === 'OVERDUE') {
            return 0;
          }

          if (item.status === 'PENDING' && item.paymentMethod === 'Boleto') {
            return 1;
          }

          if (item.status === 'PENDING') {
            return 2;
          }

          return 3;
        };

        const priorityDifference = getPriority(left) - getPriority(right);
        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime();
      }),
    []
  );
  const nextDueInstallmentId = installmentRows.find((item) => item.status === 'PENDING')?.id;

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
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Pedido</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Parcela</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Vencimento</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Valor</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Método de pagamento</th>
                <th className="h-12 px-6 align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-6 align-middle text-right font-medium text-muted-foreground">2a Via</th>
              </tr>
            </thead>
            <tbody>
              {installmentRows.map((title) => (
                <tr key={title.id} className={`border-b hover:bg-muted/50 ${title.id === nextDueInstallmentId ? 'bg-amber-50/60' : ''}`}>
                  <td className="p-6 align-middle">
                    <div className="font-semibold text-slate-800">Pedido #{title.orderNumber}</div>
                    <div className="text-xs text-slate-500">
                      {title.id === nextDueInstallmentId ? 'Proxima parcela a vencer' : title.status === 'PENDING' ? 'Parcela futura' : 'Historico do pedido'}
                    </div>
                  </td>
                  <td className="p-6 align-middle font-medium text-slate-800">
                    {title.installmentLabel} - R$ {title.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-6 align-middle">{new Date(title.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="p-6 align-middle">R$ {title.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-6 align-middle">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${title.paymentMethod === 'Boleto' ? 'bg-amber-500' : 'bg-[#EEF8F1]'}`} />
                      {title.paymentMethod}
                    </div>
                    {false && (title.bank_data?.bank_name === 'ITAÃš' ? (
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-orange-500" /> Itau
                      </div>
                    ) : (
                      'Outros'
                    ))}
                  </td>
                  <td className="p-6 align-middle">
                    {title.status === 'PAID' && <div className="flex items-center text-green-600"><CheckCircle className="mr-1 h-4 w-4" /> Pago</div>}
                    {title.status === 'OVERDUE' && <div className="flex items-center text-red-600"><AlertCircle className="mr-1 h-4 w-4" /> Vencido</div>}
                    {title.status === 'PENDING' && <div className="flex items-center text-yellow-600"><Clock className="mr-1 h-4 w-4" /> A Vencer</div>}
                  </td>
                  <td className="p-6 align-middle text-right">
                    {title.paymentMethod === 'Boleto' ? (
                      <Button
                        variant="outline"
                        className="h-9 rounded-full border-[#13733D] px-4 text-xs font-semibold text-[#13733D] hover:bg-[#EEF8F1]"
                        onClick={() => {
                          setLoadingId(title.id);
                          setTimeout(() => {
                            setLoadingId(null);
                            alert('[BOLETO]\nSegunda via gerada com sucesso.\nDownload iniciado.');
                          }, 1200);
                        }}
                        disabled={loadingId === title.id}
                      >
                        {loadingId === title.id ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Gerando...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" /> Baixar 2a via
                          </>
                        )}
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">Não se aplica</span>
                    )}
                    {false && title.status !== 'PAID' && (
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
  multiline = false,
  required = false
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}) => {
  const sharedClassName = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
    disabled
      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
      : 'border-slate-200 bg-white text-slate-900 focus:border-[#13733D] focus:ring-4 focus:ring-[#13733D]/10'
  }`;

  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}{required ? ' *' : ''}
      </span>
      <div className="relative">
        <Icon className={`absolute left-3 top-3.5 h-4 w-4 ${disabled ? 'text-slate-400' : 'text-[#13733D]'}`} />
        {multiline ? (
          <textarea
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            rows={4}
            required={required}
            className={`${sharedClassName} min-h-[112px] resize-none pl-10`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
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

  useEffect(() => {
    if (currentUser?.zipCode || formData.cep) {
      return;
    }

    let isCancelled = false;

    const loadDefaultZipCode = async () => {
      try {
        const zipCode = await resolveZipCodeFromIp();
        if (!isCancelled) {
          setFormData((prev) => (prev.cep ? prev : { ...prev, cep: zipCode }));
        }
      } catch {
        if (!isCancelled) {
          setFormData((prev) => (prev.cep ? prev : { ...prev, cep: DEFAULT_ZIP_CODE }));
        }
      }
    };

    loadDefaultZipCode();

    return () => {
      isCancelled = true;
    };
  }, [currentUser?.zipCode, formData.cep]);

  const updateField = (field: keyof ClientProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus('idle');
    setFeedbackMessage('');
  };

  const handleZipCodeChange = async (value: string) => {
    const formattedZipCode = formatPartialZipCode(value);
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
        bairro: data.bairro || prev.bairro,
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

    if (!formData.telefone1.trim()) {
      setSaveStatus('error');
      setFeedbackMessage('Telefone 1 e obrigatorio.');
      return;
    }

    if (!formData.email1.trim()) {
      setSaveStatus('error');
      setFeedbackMessage('Email 1 e obrigatorio.');
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
          fullAddress: buildFullAddress(formData),
          referencePoint: formData.pontoReferencia,
          zipCode: formData.cep,
          street: formData.logradouro,
          district: formData.bairro,
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
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#EEF8F1] via-white to-slate-50">
        <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#13733D] text-white">
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
          <ProfileField label="Telefone 1" value={formData.telefone1} onChange={(value) => updateField('telefone1', value)} icon={Phone} placeholder="(00) 0000-0000" required />
          <ProfileField label="Telefone 2" value={formData.telefone2} onChange={(value) => updateField('telefone2', value)} icon={Phone} placeholder="(00) 00000-0000" />
          <ProfileField label="Email 1" value={formData.email1} onChange={(value) => updateField('email1', value)} icon={Mail} type="email" placeholder="compras@empresa.com.br" required />
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
            label="Bairro"
            value={formData.bairro}
            onChange={(value) => updateField('bairro', value)}
            icon={MapPin}
            placeholder="Bairro"
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
          <ProfileField
            label="Ponto de Referencia"
            value={formData.pontoReferencia}
            onChange={(value) => updateField('pontoReferencia', value)}
            icon={MapPin}
            placeholder="Ex.: Portao lateral, esquina com..."
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Os dados fiscais ficam bloqueados nesta tela. Para alteracoes cadastrais,
            {' '}
            <a
              href={WHATSAPP_SUPPORT_URL}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#13733D] underline underline-offset-2"
            >
              fale com seu consultor Epoca
            </a>
            .
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
              className="rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]"
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
      <Button variant="ghost" onClick={onNavigateToHome} className="rounded-full text-[#13733D] hover:bg-[#EEF8F1]">
        <Store className="mr-2 h-4 w-4" /> Ir para Loja
      </Button>
      <NotificationCenter />
      <Button
        variant="outline"
        className="rounded-full"
        onClick={() => window.open(WHATSAPP_SUPPORT_URL, '_blank', 'noopener,noreferrer')}
      >
        Falar com Vendedor
      </Button>
      <Button className="rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]" onClick={onNavigateToCheckout}>
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
      </div>
    </div>
  );
};

export const ClientOrdersPage: React.FC<ClientDashboardProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToCheckout
}) => {
  const navigate = useNavigate();
  const orders = useMemo(() => (currentUser ? getStoredOrdersByCustomer(currentUser.id) : []), [currentUser?.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />

      <div className="grid gap-6">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-[#EEF8F1] via-white to-slate-50">
            <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#13733D] text-white">
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
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-base font-bold text-slate-900">Pedido #{order.winthor_numped}</span>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(order.date).toLocaleDateString('pt-BR')} - {order.items_count} itens
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 text-left md:items-end md:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Valor total</p>
                      <p className="text-lg font-bold text-[#13733D]">
                        R$ {order.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <Button
                          variant="outline"
                          className="w-fit rounded-full border-[#13733D] text-xs text-[#13733D] hover:bg-[#EEF8F1]"
                          onClick={() => navigate(`/cliente/pedidos/${order.id}`)}
                        >
                          Ver detalhes
                        </Button>
                        <OrderHelpButton
                          orderId={order.id}
                          className="w-fit rounded-full border-[#13733D] text-xs text-[#13733D] hover:bg-[#EEF8F1]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <PackageSearch className="mb-4 h-12 w-12 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-900">Nenhum pedido encontrado</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">Assim que um pedido for finalizado no checkout, ele aparecera aqui para acompanhamento.</p>
                <Button className="mt-5 rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]" onClick={onNavigateToCheckout}>
                  Fazer novo pedido
                </Button>
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

export const ClientFinancialPage: React.FC<ClientDashboardProps> = ({
  currentUser,
  onNavigateToHome,
  onNavigateToCheckout
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ClientHeader
        currentUser={currentUser}
        onNavigateToHome={onNavigateToHome}
        onNavigateToCheckout={onNavigateToCheckout}
      />
      <FinancialTitles />
    </div>
  );
};

export default ClientDashboard;


