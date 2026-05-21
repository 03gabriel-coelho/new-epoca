
import { Order, OrderStatus, FinancialTitle, SalesMetric, SalesData, InstitutionalVideo, Customer, AdminUser, ActivityLog, SalesStatisticEntry, StoredOrder } from '../types';
import { mockProductsFromERP } from './mockProducts';

export const mockProducts = mockProductsFromERP;

export const mockOrders: Order[] = [
  { 
    id: '01', 
    winthor_numped: 50231, 
    date: '2023-10-25', 
    total_value: 1250.00, 
    status: OrderStatus.FATURADO, 
    items_count: 45,
    fraud_analysis: { provider: 'CLEARSALE', score: 2.5, status: 'APPROVED', transaction_id: 'CS-998811' }
  },
  { 
    id: '02', 
    winthor_numped: 50235, 
    date: '2023-10-26', 
    total_value: 340.50, 
    status: OrderStatus.LIBERADO, 
    items_count: 12,
    fraud_analysis: { provider: 'CLEARSALE', score: 1.0, status: 'APPROVED', transaction_id: 'CS-998812' }
  },
  { 
    id: '03', 
    winthor_numped: 50240, 
    date: '2023-10-27', 
    total_value: 8900.00, 
    status: OrderStatus.BLOQUEADO, 
    items_count: 150,
    fraud_analysis: { provider: 'CLEARSALE', score: 85.0, status: 'MANUAL_REVIEW', transaction_id: 'CS-998813' }
  },
  { 
    id: '04', 
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

const salesHistoryReferenceDate = new Date('2026-04-06T00:00:00');

export const salesHistory: SalesData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(salesHistoryReferenceDate);
  date.setDate(salesHistoryReferenceDate.getDate() - (29 - i));

  return {
    date: date.toISOString().slice(0, 10),
    amount: Math.floor(Math.random() * 5000) + 2000,
  };
});

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
  title: 'Conheça nossa Operação Logística',
  url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Public placeholder video
  thumbnail: 'https://placehold.co/1920x1080/022c22/ffffff?text=Video+Institucional+Thumb',
  description: 'Um tour completo pelo nosso Centro de Distribuição e processos de qualidade.'
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
    company_name: 'Mercearia do João', 
    status: 'BLOCKED', 
    credit_limit: 5000, 
    last_order_date: '2023-09-10',
    is_online: false,
    cart: []
  },
  { 
    id: 'c3', 
    cnpj: '11.222.333/0001-55', 
    company_name: 'Farmácia Saúde', 
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
  { id: 'u1', name: 'Admin Master', email: 'admin@epoca.com.br', default_password: 'Admin@123', role: 'ADMIN', status: 'ACTIVE', last_login: 'Hoje, 09:00', permissions: ['overview', 'products', 'orders', 'content', 'customers', 'statistics', 'fraud', 'settings'] },
  { id: 'u2', name: 'Carlos Vendas', email: 'carlos@epoca.com.br', default_password: 'Admin@123', role: 'SALES', status: 'ACTIVE', last_login: 'Ontem, 14:30', permissions: ['overview', 'customers', 'statistics', 'fraud'] },
  { id: 'u3', name: 'Ana Marketing', email: 'ana@epoca.com.br', default_password: 'Admin@123', role: 'MARKETING', status: 'ACTIVE', last_login: '2 dias atrás', permissions: ['overview', 'products', 'content', 'statistics'] },
];

export const mockActivities: ActivityLog[] = [
  { id: 'a1', user: 'Carlos Silva (Vendas)', action: 'Aprovou pedido #50242', timestamp: '10 min atrás' },
  { id: 'a2', user: 'Ana Souza (Marketing)', action: 'Atualizou Banner "Ofertas Natal"', timestamp: '1 hora atrás' },
  { id: 'a3', user: 'Sistema (n8n)', action: 'Sync de Boletos Itaú processado', timestamp: '2 horas atrás' },
];

export const mockSalesStatistics: SalesStatisticEntry[] = [
  { id: 'ss7', customer_id: 'c4', customer_name: 'Rede Bom Preco', state: 'Minas Gerais', city: 'Belo Horizonte', region: 'Sudeste', channel: 'ORGANIC', revenue: 141000, orders: 31, avg_ticket: 4548.39, period_label: 'Mar/2026' },
  { id: 'ss8', customer_id: 'c4', customer_name: 'Rede Bom Preco', state: 'Minas Gerais', city: 'Belo Horizonte', region: 'Sudeste', channel: 'SALES_ASSISTED', revenue: 119000, orders: 24, avg_ticket: 4958.33, period_label: 'Mar/2026' },
  { id: 'ss11', customer_id: 'c6', customer_name: 'Emporio Vila Nova', state: 'Minas Gerais', city: 'Uberlandia', region: 'Interior', channel: 'ORGANIC', revenue: 71000, orders: 18, avg_ticket: 3944.44, period_label: 'Mar/2026' },
  { id: 'ss12', customer_id: 'c6', customer_name: 'Emporio Vila Nova', state: 'Minas Gerais', city: 'Uberlandia', region: 'Interior', channel: 'SALES_ASSISTED', revenue: 58000, orders: 14, avg_ticket: 4142.86, period_label: 'Mar/2026' },
  { id: 'ss13', customer_id: 'c7', customer_name: 'Mercadinho Horizonte', state: 'Espirito Santo', city: 'Vitoria', region: 'Sudeste', channel: 'ORGANIC', revenue: 46000, orders: 13, avg_ticket: 3538.46, period_label: 'Mar/2026' },
  { id: 'ss14', customer_id: 'c7', customer_name: 'Mercadinho Horizonte', state: 'Espirito Santo', city: 'Vitoria', region: 'Sudeste', channel: 'SALES_ASSISTED', revenue: 97000, orders: 21, avg_ticket: 4619.05, period_label: 'Mar/2026' },
  { id: 'ss15', customer_id: 'c8', customer_name: 'Distribuidora Leste', state: 'Espirito Santo', city: 'Vila Velha', region: 'Litoral', channel: 'ORGANIC', revenue: 118000, orders: 26, avg_ticket: 4538.46, period_label: 'Mar/2026' },
  { id: 'ss16', customer_id: 'c8', customer_name: 'Distribuidora Leste', state: 'Espirito Santo', city: 'Vila Velha', region: 'Litoral', channel: 'SALES_ASSISTED', revenue: 83000, orders: 17, avg_ticket: 4882.35, period_label: 'Mar/2026' }
];

export const mockAdminStoredOrders: StoredOrder[] = [
  {
    id: 'mock-ord-01', winthor_numped: 50301, date: '2026-05-21',
    total_value: 2340.80, status: OrderStatus.ABERTO, items_count: 48,
    customer_id: 'c4', company_name: 'Rede Bom Preço Ltda', address: 'Av. Afonso Pena, 1500 - BH/MG',
    payment_method: 'PIX', freight_cost: 0, combo_savings_total: 120.00, payment_adjustment_value: -23.41,
    tracking_message: 'Pedido recebido e em análise.',
    items: [
      { product_id: 'prod_30481', quantity: 24, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
      { product_id: 'prod_30512', quantity: 12, unit_price: 34.90, description: 'AZEITE EXTRAVIRGEM GALLO 500ML', image_path: '', winthor_codprod: 30512 },
      { product_id: 'prod_30588', quantity: 12, unit_price: 8.99, description: 'MACARRAO PARAFUSO ISABELA 500G', image_path: '', winthor_codprod: 30588 },
    ],
  },
  {
    id: 'mock-ord-02', winthor_numped: 50299, date: '2026-05-20',
    total_value: 5870.50, status: OrderStatus.LIBERADO, items_count: 130,
    customer_id: 'c6', company_name: 'Empório Vila Nova Comércio', address: 'Rua Goiás, 800 - Uberlândia/MG',
    payment_method: 'BOLETO', freight_cost: 85.00, combo_savings_total: 0, payment_adjustment_value: 0,
    tracking_message: 'Pedido liberado. Separação em andamento.',
    items: [
      { product_id: 'prod_30481', quantity: 48, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
      { product_id: 'prod_30620', quantity: 36, unit_price: 22.50, description: 'DETERGENTE LIMPOL NEUTRO 500ML CX 24UN', image_path: '', winthor_codprod: 30620 },
      { product_id: 'prod_30755', quantity: 24, unit_price: 45.80, description: 'SABAO PO OMO MULTIACAO 1,6KG', image_path: '', winthor_codprod: 30755 },
      { product_id: 'prod_30801', quantity: 22, unit_price: 12.30, description: 'ACHOCOLATADO NESCAU 400G', image_path: '', winthor_codprod: 30801 },
    ],
  },
  {
    id: 'mock-ord-03', winthor_numped: 50295, date: '2026-05-18',
    total_value: 980.00, status: OrderStatus.FATURADO, items_count: 20,
    customer_id: 'c7', company_name: 'Mercadinho Horizonte ME', address: 'Rua da Paz, 320 - Vitória/ES',
    payment_method: 'CREDIT_CARD', freight_cost: 0, combo_savings_total: 50.00, payment_adjustment_value: 0,
    tracking_message: 'Nota fiscal emitida. Entrega prevista em 2 dias úteis.',
    items: [
      { product_id: 'prod_30801', quantity: 12, unit_price: 12.30, description: 'ACHOCOLATADO NESCAU 400G', image_path: '', winthor_codprod: 30801 },
      { product_id: 'prod_30512', quantity: 8, unit_price: 34.90, description: 'AZEITE EXTRAVIRGEM GALLO 500ML', image_path: '', winthor_codprod: 30512 },
    ],
  },
  {
    id: 'mock-ord-04', winthor_numped: 50290, date: '2026-05-16',
    total_value: 12450.00, status: OrderStatus.FATURADO, items_count: 280,
    customer_id: 'c8', company_name: 'Distribuidora Leste S/A', address: 'Rod. ES 060, Km 12 - Vila Velha/ES',
    payment_method: 'TWO_CARDS', freight_cost: 220.00, combo_savings_total: 380.00, payment_adjustment_value: 0,
    tracking_message: 'Mercadoria despachada. Código de rastreio: EPC2026051600.',
    items: [
      { product_id: 'prod_30481', quantity: 96, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
      { product_id: 'prod_30755', quantity: 72, unit_price: 45.80, description: 'SABAO PO OMO MULTIACAO 1,6KG', image_path: '', winthor_codprod: 30755 },
      { product_id: 'prod_30620', quantity: 60, unit_price: 22.50, description: 'DETERGENTE LIMPOL NEUTRO 500ML CX 24UN', image_path: '', winthor_codprod: 30620 },
      { product_id: 'prod_30588', quantity: 52, unit_price: 8.99, description: 'MACARRAO PARAFUSO ISABELA 500G', image_path: '', winthor_codprod: 30588 },
    ],
  },
  {
    id: 'mock-ord-05', winthor_numped: 50285, date: '2026-05-13',
    total_value: 3210.75, status: OrderStatus.BLOQUEADO, items_count: 75,
    customer_id: 'c5', company_name: 'Supermercado Central EIRELI', address: 'Av. Brasil, 2200 - Contagem/MG',
    payment_method: 'BOLETO', freight_cost: 60.00, combo_savings_total: 0, payment_adjustment_value: 0,
    tracking_message: 'Pedido bloqueado para análise de crédito.',
    items: [
      { product_id: 'prod_30801', quantity: 36, unit_price: 12.30, description: 'ACHOCOLATADO NESCAU 400G', image_path: '', winthor_codprod: 30801 },
      { product_id: 'prod_30512', quantity: 24, unit_price: 34.90, description: 'AZEITE EXTRAVIRGEM GALLO 500ML', image_path: '', winthor_codprod: 30512 },
      { product_id: 'prod_30481', quantity: 15, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
    ],
  },
  {
    id: 'mock-ord-06', winthor_numped: 50278, date: '2026-05-09',
    total_value: 1780.20, status: OrderStatus.FATURADO, items_count: 42,
    customer_id: 'c4', company_name: 'Rede Bom Preço Ltda', address: 'Av. Afonso Pena, 1500 - BH/MG',
    payment_method: 'PIX', freight_cost: 0, combo_savings_total: 88.00, payment_adjustment_value: -17.80,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30620', quantity: 48, unit_price: 22.50, description: 'DETERGENTE LIMPOL NEUTRO 500ML CX 24UN', image_path: '', winthor_codprod: 30620 },
      { product_id: 'prod_30588', quantity: 24, unit_price: 8.99, description: 'MACARRAO PARAFUSO ISABELA 500G', image_path: '', winthor_codprod: 30588 },
    ],
  },
  {
    id: 'mock-ord-07', winthor_numped: 50270, date: '2026-05-03',
    total_value: 4560.00, status: OrderStatus.FATURADO, items_count: 96,
    customer_id: 'c9', company_name: 'Atacarejo Mineiro Ltda', address: 'Rua Cambuí, 55 - Betim/MG',
    payment_method: 'BOLETO', freight_cost: 120.00, combo_savings_total: 200.00, payment_adjustment_value: 0,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30755', quantity: 48, unit_price: 45.80, description: 'SABAO PO OMO MULTIACAO 1,6KG', image_path: '', winthor_codprod: 30755 },
      { product_id: 'prod_30481', quantity: 48, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
    ],
  },
  {
    id: 'mock-ord-08', winthor_numped: 50261, date: '2026-04-26',
    total_value: 880.50, status: OrderStatus.CANCELADO, items_count: 18,
    customer_id: 'c7', company_name: 'Mercadinho Horizonte ME', address: 'Rua da Paz, 320 - Vitória/ES',
    payment_method: 'PIX', freight_cost: 0, combo_savings_total: 0, payment_adjustment_value: 0,
    tracking_message: 'Pedido cancelado a pedido do cliente.',
    items: [
      { product_id: 'prod_30512', quantity: 12, unit_price: 34.90, description: 'AZEITE EXTRAVIRGEM GALLO 500ML', image_path: '', winthor_codprod: 30512 },
      { product_id: 'prod_30801', quantity: 6, unit_price: 12.30, description: 'ACHOCOLATADO NESCAU 400G', image_path: '', winthor_codprod: 30801 },
    ],
  },
  {
    id: 'mock-ord-09', winthor_numped: 50253, date: '2026-04-16',
    total_value: 7200.00, status: OrderStatus.FATURADO, items_count: 160,
    customer_id: 'c8', company_name: 'Distribuidora Leste S/A', address: 'Rod. ES 060, Km 12 - Vila Velha/ES',
    payment_method: 'BOLETO', freight_cost: 200.00, combo_savings_total: 460.00, payment_adjustment_value: 0,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30481', quantity: 72, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
      { product_id: 'prod_30755', quantity: 48, unit_price: 45.80, description: 'SABAO PO OMO MULTIACAO 1,6KG', image_path: '', winthor_codprod: 30755 },
      { product_id: 'prod_30620', quantity: 40, unit_price: 22.50, description: 'DETERGENTE LIMPOL NEUTRO 500ML CX 24UN', image_path: '', winthor_codprod: 30620 },
    ],
  },
  {
    id: 'mock-ord-10', winthor_numped: 50244, date: '2026-04-06',
    total_value: 2100.00, status: OrderStatus.FATURADO, items_count: 55,
    customer_id: 'c6', company_name: 'Empório Vila Nova Comércio', address: 'Rua Goiás, 800 - Uberlândia/MG',
    payment_method: 'CREDIT_CARD', freight_cost: 75.00, combo_savings_total: 0, payment_adjustment_value: 0,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30588', quantity: 36, unit_price: 8.99, description: 'MACARRAO PARAFUSO ISABELA 500G', image_path: '', winthor_codprod: 30588 },
      { product_id: 'prod_30801', quantity: 19, unit_price: 12.30, description: 'ACHOCOLATADO NESCAU 400G', image_path: '', winthor_codprod: 30801 },
    ],
  },
  {
    id: 'mock-ord-11', winthor_numped: 50235, date: '2026-03-22',
    total_value: 9800.00, status: OrderStatus.FATURADO, items_count: 210,
    customer_id: 'c4', company_name: 'Rede Bom Preço Ltda', address: 'Av. Afonso Pena, 1500 - BH/MG',
    payment_method: 'BOLETO', freight_cost: 300.00, combo_savings_total: 600.00, payment_adjustment_value: 0,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30755', quantity: 96, unit_price: 45.80, description: 'SABAO PO OMO MULTIACAO 1,6KG', image_path: '', winthor_codprod: 30755 },
      { product_id: 'prod_30481', quantity: 72, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
      { product_id: 'prod_30512', quantity: 42, unit_price: 34.90, description: 'AZEITE EXTRAVIRGEM GALLO 500ML', image_path: '', winthor_codprod: 30512 },
    ],
  },
  {
    id: 'mock-ord-12', winthor_numped: 50220, date: '2026-03-07',
    total_value: 3450.00, status: OrderStatus.FATURADO, items_count: 80,
    customer_id: 'c9', company_name: 'Atacarejo Mineiro Ltda', address: 'Rua Cambuí, 55 - Betim/MG',
    payment_method: 'PIX', freight_cost: 0, combo_savings_total: 150.00, payment_adjustment_value: -34.50,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30620', quantity: 60, unit_price: 22.50, description: 'DETERGENTE LIMPOL NEUTRO 500ML CX 24UN', image_path: '', winthor_codprod: 30620 },
      { product_id: 'prod_30801', quantity: 20, unit_price: 12.30, description: 'ACHOCOLATADO NESCAU 400G', image_path: '', winthor_codprod: 30801 },
    ],
  },
  {
    id: 'mock-ord-13', winthor_numped: 50205, date: '2026-02-22',
    total_value: 6100.00, status: OrderStatus.FATURADO, items_count: 135,
    customer_id: 'c5', company_name: 'Supermercado Central EIRELI', address: 'Av. Brasil, 2200 - Contagem/MG',
    payment_method: 'BOLETO', freight_cost: 180.00, combo_savings_total: 320.00, payment_adjustment_value: 0,
    tracking_message: 'Entregue com sucesso.',
    items: [
      { product_id: 'prod_30481', quantity: 60, unit_price: 16.68, description: 'MAIONESE HELLMANN´S DOY-PACK TRADICIONAL 1KG', image_path: '', winthor_codprod: 30481 },
      { product_id: 'prod_30755', quantity: 36, unit_price: 45.80, description: 'SABAO PO OMO MULTIACAO 1,6KG', image_path: '', winthor_codprod: 30755 },
      { product_id: 'prod_30512', quantity: 24, unit_price: 34.90, description: 'AZEITE EXTRAVIRGEM GALLO 500ML', image_path: '', winthor_codprod: 30512 },
      { product_id: 'prod_30588', quantity: 15, unit_price: 8.99, description: 'MACARRAO PARAFUSO ISABELA 500G', image_path: '', winthor_codprod: 30588 },
    ],
  },
];

