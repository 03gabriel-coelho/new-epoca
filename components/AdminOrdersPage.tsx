import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StoredOrder, OrderStatus } from '../types';
import { getStoredOrders } from '../lib/ordersStorage';
import { mockAdminStoredOrders } from '../lib/mockData';
import { Card, CardContent, Badge, Button } from './ui/Layout';
import { Search, X, Calendar, Package, ShoppingCart, TrendingUp, Download, Loader2, CheckCircle2 } from 'lucide-react';

type DateFilterKey = 'today' | '7d' | '30d' | '90d' | 'custom';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.ABERTO]: 'Aberto',
  [OrderStatus.BLOQUEADO]: 'Bloqueado',
  [OrderStatus.LIBERADO]: 'Liberado',
  [OrderStatus.FATURADO]: 'Faturado',
  [OrderStatus.CANCELADO]: 'Cancelado',
};

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'brand';

const STATUS_VARIANTS: Record<OrderStatus, BadgeVariant> = {
  [OrderStatus.ABERTO]: 'default',
  [OrderStatus.BLOQUEADO]: 'warning',
  [OrderStatus.LIBERADO]: 'brand',
  [OrderStatus.FATURADO]: 'success',
  [OrderStatus.CANCELADO]: 'default',
};

const STATUS_CANCELLED_CLASS = 'bg-red-100 text-red-700';

const PAYMENT_LABELS: Record<string, string> = {
  CREDIT_CARD: 'Cartão de Crédito',
  TWO_CARDS: 'Dois Cartões',
  PIX: 'PIX',
  BOLETO: 'Boleto',
};

const DATE_FILTER_OPTIONS: { key: DateFilterKey; label: string }[] = [
  { key: 'today', label: 'Hoje' },
  { key: '7d', label: '7 dias' },
  { key: '30d', label: '30 dias' },
  { key: '90d', label: '90 dias' },
];

const getDateRange = (
  filter: DateFilterKey,
  customStart: string,
  customEnd: string,
): { start: Date; end: Date } => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (filter === 'today') return { start, end };
  if (filter === '7d') { start.setDate(start.getDate() - 6); return { start, end }; }
  if (filter === '30d') { start.setDate(start.getDate() - 29); return { start, end }; }
  if (filter === '90d') { start.setDate(start.getDate() - 89); return { start, end }; }
  if (filter === 'custom' && customStart && customEnd) {
    return {
      start: new Date(`${customStart}T00:00:00`),
      end: new Date(`${customEnd}T23:59:59`),
    };
  }
  return { start: new Date(0), end };
};

const AdminOrdersPage: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterKey>('30d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowCustomPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allOrders = useMemo(() => {
    const stored = getStoredOrders();
    const storedIds = new Set(stored.map((o) => o.id));
    const mocks = mockAdminStoredOrders.filter((o) => !storedIds.has(o.id));
    return [...stored, ...mocks].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, []);

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRange(dateFilter, customStart, customEnd);
    return allOrders.filter((order) => {
      const orderDate = new Date(`${order.date}T00:00:00`);
      if (orderDate < start || orderDate > end) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          String(order.winthor_numped).includes(q) ||
          order.company_name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allOrders, dateFilter, customStart, customEnd, searchQuery]);

  const stats = useMemo(
    () => ({
      orders: filteredOrders.length,
      items: filteredOrders.reduce((sum, o) => sum + o.items_count, 0),
      revenue: filteredOrders.reduce((sum, o) => sum + o.total_value, 0),
    }),
    [filteredOrders],
  );

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setDateFilter('custom');
      setShowCustomPicker(false);
    }
  };

  const customLabel =
    dateFilter === 'custom' && customStart && customEnd
      ? `${customStart.split('-').reverse().join('/')} → ${customEnd.split('-').reverse().join('/')}`
      : 'Intervalo';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
          <p className="text-slate-500">Gerencie e acompanhe todos os pedidos da plataforma.</p>
        </div>

        {/* Filters + search row */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {DATE_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { setDateFilter(opt.key); setShowCustomPicker(false); }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  dateFilter === opt.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}

            {/* Custom range picker */}
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowCustomPicker((v) => !v)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  dateFilter === 'custom'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                {customLabel}
              </button>

              {showCustomPicker && (
                <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Selecionar intervalo</p>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">De</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-500">Até</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="ghost"
                        className="flex-1 h-9 text-sm"
                        onClick={() => setShowCustomPicker(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="flex-1 h-9 text-sm bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={handleCustomApply}
                        disabled={!customStart || !customEnd}
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pedido ou cliente..."
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-9 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pedidos</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{stats.orders}</p>
              </div>
              <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Itens Vendidos</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {stats.items.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Receita</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {currencyFormatter.format(stats.revenue)}
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders list */}
      <Card>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <span className="text-sm font-medium text-slate-500">
            {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado
            {filteredOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">Nenhum pedido encontrado</p>
              <p className="mt-1 text-xs text-slate-400">
                Tente ajustar os filtros ou o período selecionado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Pedido</th>
                    <th className="px-6 py-3 text-left font-medium">Data</th>
                    <th className="px-6 py-3 text-left font-medium">Cliente</th>
                    <th className="px-6 py-3 text-left font-medium">Pagamento</th>
                    <th className="px-6 py-3 text-right font-medium">Itens</th>
                    <th className="px-6 py-3 text-right font-medium">Valor</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                        #{order.winthor_numped}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {dateFormatter.format(new Date(`${order.date}T00:00:00`))}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{order.company_name}</p>
                        <p className="text-xs text-slate-400">{order.customer_id}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-700">{order.items_count}</td>
                      <td className="px-6 py-4 text-right font-semibold text-slate-900">
                        {currencyFormatter.format(order.total_value)}
                      </td>
                      <td className="px-6 py-4">
                        {order.status === OrderStatus.CANCELADO ? (
                          <Badge className={STATUS_CANCELLED_CLASS}>Cancelado</Badge>
                        ) : (
                          <Badge variant={STATUS_VARIANTS[order.status]}>
                            {STATUS_LABELS[order.status]}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

type BoletoState = 'idle' | 'loading' | 'done';

const OrderDetailModal: React.FC<{ order: StoredOrder; onClose: () => void }> = ({
  order,
  onClose,
}) => {
  const subtotal = order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const [boletoState, setBoletoState] = useState<BoletoState>('idle');

  const handleBoleto = () => {
    if (boletoState !== 'idle') return;
    setBoletoState('loading');
    setTimeout(() => setBoletoState('done'), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Pedido #{order.winthor_numped}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {dateFormatter.format(new Date(`${order.date}T00:00:00`))}
              {' · '}
              {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {order.status === OrderStatus.CANCELADO ? (
              <Badge className={STATUS_CANCELLED_CLASS}>Cancelado</Badge>
            ) : (
              <Badge variant={STATUS_VARIANTS[order.status]}>
                {STATUS_LABELS[order.status]}
              </Badge>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Customer info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Informações do Cliente
            </p>
            <p className="font-semibold text-slate-900">{order.company_name}</p>
            <p className="mt-0.5 text-sm text-slate-500">ID: {order.customer_id}</p>
            {order.address && (
              <p className="mt-0.5 text-sm text-slate-500">{order.address}</p>
            )}
          </div>

          {/* Items */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Itens do Pedido
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-500">Produto</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-500">Qtd</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-500">Unitário</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-500">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <p className="line-clamp-1 font-medium text-slate-900">{item.description}</p>
                        <p className="text-xs text-slate-400">Cód. {item.winthor_codprod}</p>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {currencyFormatter.format(item.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {currencyFormatter.format(item.unit_price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial summary */}
          <div className="space-y-2 rounded-2xl border border-slate-200 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Resumo Financeiro
            </p>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal dos itens</span>
              <span>{currencyFormatter.format(subtotal)}</span>
            </div>
            {order.freight_cost > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Frete</span>
                <span>{currencyFormatter.format(order.freight_cost)}</span>
              </div>
            )}
            {order.combo_savings_total > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Desconto em combos</span>
                <span>-{currencyFormatter.format(order.combo_savings_total)}</span>
              </div>
            )}
            {order.payment_adjustment_value !== 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Desconto PIX (1%)</span>
                <span>{currencyFormatter.format(order.payment_adjustment_value)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{currencyFormatter.format(order.total_value)}</span>
            </div>
          </div>

          {/* Segunda via do boleto */}
          {order.payment_method === 'BOLETO' && (
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Segunda Via do Boleto</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Gere uma nova via do boleto para este pedido.
                </p>
              </div>
              <button
                onClick={handleBoleto}
                disabled={boletoState === 'loading'}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  boletoState === 'done'
                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                    : boletoState === 'loading'
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {boletoState === 'loading' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {boletoState === 'done' && (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {boletoState === 'idle' && (
                  <Download className="h-4 w-4" />
                )}
                {boletoState === 'loading' ? 'Gerando...' : boletoState === 'done' ? 'Gerado!' : 'Gerar Boleto'}
              </button>
            </div>
          )}

          {/* Tracking */}
          {order.tracking_message && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Rastreamento
              </p>
              <p className="text-sm text-emerald-800">{order.tracking_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
