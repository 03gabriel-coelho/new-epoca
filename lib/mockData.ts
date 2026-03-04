
import { Order, OrderStatus, FinancialTitle, SalesMetric, SalesData, InstitutionalVideo, Customer, AdminUser, ActivityLog } from '../types';
import { mockProductsFromERP } from './mockProducts';

export const mockProducts = mockProductsFromERP;

export const mockOrders: Order[] = [
  { 
    id: 'o1', 
    winthor_numped: 50231, 
    date: '2023-10-25', 
    total_value: 1250.00, 
    status: OrderStatus.FATURADO, 
    items_count: 45,
    fraud_analysis: { provider: 'CLEARSALE', score: 2.5, status: 'APPROVED', transaction_id: 'CS-998811' }
  },
  { 
    id: 'o2', 
    winthor_numped: 50235, 
    date: '2023-10-26', 
    total_value: 340.50, 
    status: OrderStatus.LIBERADO, 
    items_count: 12,
    fraud_analysis: { provider: 'CLEARSALE', score: 1.0, status: 'APPROVED', transaction_id: 'CS-998812' }
  },
  { 
    id: 'o3', 
    winthor_numped: 50240, 
    date: '2023-10-27', 
    total_value: 8900.00, 
    status: OrderStatus.BLOQUEADO, 
    items_count: 150,
    fraud_analysis: { provider: 'CLEARSALE', score: 85.0, status: 'MANUAL_REVIEW', transaction_id: 'CS-998813' }
  },
  { 
    id: 'o4', 
    winthor_numped: 50242, 
    date: '2023-10-28', 
    total_value: 450.00, 
    status: OrderStatus.ABERTO, 
    items_count: 5 
  },
];

export const mockFinancials: FinancialTitle[] = [
  { 
    id: 'f1', 
    doc_number: '102030', 
    due_date: '2023-11-05', 
    value: 1250.00, 
    status: 'PENDING',
    bank_data: { bank_name: 'ITAÚ', registration_id: 'IT-445511', our_number: '109/88771122', registered_at: '2023-10-25T10:00:00Z' }
  },
  { 
    id: 'f2', 
    doc_number: '101010', 
    due_date: '2023-10-15', 
    value: 500.00, 
    status: 'OVERDUE',
    bank_data: { bank_name: 'ITAÚ', registration_id: 'IT-445500', our_number: '109/88771100', registered_at: '2023-09-15T10:00:00Z' }
  },
  { 
    id: 'f3', 
    doc_number: '090909', 
    due_date: '2023-09-10', 
    value: 2100.00, 
    status: 'PAID',
    bank_data: { bank_name: 'ITAÚ', registration_id: 'IT-444499', our_number: '109/88771099', registered_at: '2023-08-10T10:00:00Z' }
  },
];

export const salesByDept: SalesMetric[] = [
  { name: 'Bebidas', value: 45000 },
  { name: 'Bazar', value: 15000 },
  { name: 'Limpeza', value: 32000 },
  { name: 'Alimentos', value: 58000 },
];

export const salesHistory: SalesData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  amount: Math.floor(Math.random() * 5000) + 2000,
}));

export const vendorLogos = [
  {
    codmarca: 146,
    nome: "SALON LINE",
    ativo: "S",
    img: "SALON LINE.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=1864",
    codfilial: "7",
    ordem: 1
  },
  {
    codmarca: 118,
    nome: "BOREDA",
    ativo: "S",
    img: "BOREDA.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=2074",
    codfilial: "7",
    ordem: 2
  },
  {
    codmarca: 122,
    nome: "SANTHER",
    ativo: "S",
    img: "SANTHER.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=213",
    codfilial: "7",
    ordem: 3
  },
  {
    codmarca: 123,
    nome: "KIMBERLY",
    ativo: "S",
    img: "KIMBERLY.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=132",
    codfilial: "7",
    ordem: 4
  },
  {
    codmarca: 111,
    nome: "CARGILL ",
    ativo: "S",
    img: "CARGILL .png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=408",
    codfilial: "7",
    ordem: 5
  },
  {
    codmarca: 117,
    nome: "PERNOD",
    ativo: "S",
    img: "PERNOD.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=435",
    codfilial: "7",
    ordem: 6
  },
  {
    codmarca: 124,
    nome: "RECKIT",
    ativo: "S",
    img: "RECKIT.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=234",
    codfilial: "7",
    ordem: 7
  },
  {
    codmarca: 143,
    nome: "YPE",
    ativo: "S",
    img: "YPE.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=38",
    codfilial: "7",
    ordem: 8
  },
  {
    codmarca: 115,
    nome: "MONDELIZ",
    ativo: "S",
    img: "MONDELIZ.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=197",
    codfilial: "7",
    ordem: 9
  },
  {
    codmarca: 113,
    nome: "P&G",
    ativo: "S",
    img: "P&G.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=815",
    codfilial: "7",
    ordem: 10
  },
  {
    codmarca: 144,
    nome: "RICLAN",
    ativo: "S",
    img: "Riclan.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=1081",
    codfilial: "7",
    ordem: 11
  },
  {
    codmarca: 116,
    nome: "COTY",
    ativo: "S",
    img: "COTY.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=6375",
    codfilial: "7",
    ordem: 12
  },
  {
    codmarca: 119,
    nome: "SC - JOHNSON",
    ativo: "S",
    img: "SC - JOHNSON.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=2610",
    codfilial: "7",
    ordem: 13
  },
  {
    codmarca: 120,
    nome: "BIC",
    ativo: "S",
    img: "BIC.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=220",
    codfilial: "7",
    ordem: 14
  },
  {
    codmarca: 147,
    nome: "EMBELLEZE",
    ativo: "S",
    img: "EMBELLEZE.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=6641",
    codfilial: "7",
    ordem: 15
  },
  {
    codmarca: 114,
    nome: "COLGATE",
    ativo: "S",
    img: "COLGATE.png",
    url: "https://www.epocaonline.com.br/pesquisa?page=1&fornec=1",
    codfilial: "7",
    ordem: 16
  }
];

export const mockInstitutionalVideo: InstitutionalVideo = {
  id: 'vid-001',
  title: 'ConheÃ§a nossa OperaÃ§Ã£o LogÃ­stica',
  url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Public placeholder video
  thumbnail: 'https://placehold.co/1920x1080/022c22/ffffff?text=Video+Institucional+Thumb',
  description: 'Um tour completo pelo nosso Centro de DistribuiÃ§Ã£o e processos de qualidade.'
};

export const mockCustomers: Customer[] = [
  { 
    id: 'c1', 
    cnpj: '12.345.678/0001-90', 
    company_name: 'Supermercado Modelo', 
    status: 'ACTIVE', 
    credit_limit: 50000, 
    last_order_date: '2023-10-25',
    is_online: true,
    cart: [
      { product_id: '30481', quantity: 20 },
      { product_id: '36827', quantity: 5 }
    ]
  },
  { 
    id: 'c2', 
    cnpj: '98.765.432/0001-10', 
    company_name: 'Mercearia do JoÃ£o', 
    status: 'BLOCKED', 
    credit_limit: 5000, 
    last_order_date: '2023-09-10',
    is_online: false,
    cart: []
  },
  { 
    id: 'c3', 
    cnpj: '11.222.333/0001-55', 
    company_name: 'FarmÃ¡cia SaÃºde', 
    status: 'ACTIVE', 
    credit_limit: 15000, 
    last_order_date: '2023-10-28',
    is_online: true,
    cart: [
      { product_id: '8693', quantity: 10 }
    ]
  },
];

export const mockAdminUsers: AdminUser[] = [
  { id: 'u1', name: 'Admin Master', email: 'admin@epoca.com.br', role: 'ADMIN', status: 'ACTIVE', last_login: 'Hoje, 09:00' },
  { id: 'u2', name: 'Carlos Vendas', email: 'carlos@epoca.com.br', role: 'SALES', status: 'ACTIVE', last_login: 'Ontem, 14:30' },
  { id: 'u3', name: 'Ana Marketing', email: 'ana@epoca.com.br', role: 'MARKETING', status: 'ACTIVE', last_login: '2 dias atrÃ¡s' },
];

export const mockActivities: ActivityLog[] = [
  { id: 'a1', user: 'Carlos Silva (Vendas)', action: 'Aprovou pedido #50242', timestamp: '10 min atrÃ¡s' },
  { id: 'a2', user: 'Ana Souza (Marketing)', action: 'Atualizou Banner "Ofertas Natal"', timestamp: '1 hora atrÃ¡s' },
  { id: 'a3', user: 'Sistema (n8n)', action: 'Sync de Boletos ItaÃº processado', timestamp: '2 horas atrÃ¡s' },
];




