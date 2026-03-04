
import { Order, OrderStatus, Product, FinancialTitle, SalesMetric, SalesData, InstitutionalVideo, Customer, AdminUser, ActivityLog } from '../types';

export const mockProducts: Product[] = [
  { 
    id: '1', 
    winthor_codprod: 101, 
    description: 'Coca-Cola 2L', 
    department: 'Bebidas', 
    price: 8.50, 
    image_path: 'https://picsum.photos/500/500?random=1',
    long_description: 'Refrigerante Coca-Cola Garrafa 2L. O sabor original e inconfundível. Ideal para compartilhar com a família e amigos.',
    details: {
      weight: '2.1 kg',
      height: '35 cm',
      width: '10 cm',
      length: '10 cm',
      unit: 'UN',
      ean: '7894900011517',
      brand: 'Coca-Cola',
      manufacturer: 'Coca-Cola FEMSA',
      stock_quantity: 1500
    }
  },
  { 
    id: '2', 
    winthor_codprod: 102, 
    description: 'Heineken Long Neck', 
    department: 'Bebidas', 
    price: 6.90, 
    image_path: 'https://picsum.photos/500/500?random=2',
    long_description: 'Cerveja Heineken Premium Long Neck 330ml. Puro Malte, refrescante e de alta qualidade.',
    details: {
      weight: '0.6 kg',
      height: '22 cm',
      width: '6 cm',
      length: '6 cm',
      unit: 'UN',
      ean: '7890001112223',
      brand: 'Heineken',
      manufacturer: 'Heineken Brasil',
      stock_quantity: 5000
    }
  },
  { 
    id: '3', 
    winthor_codprod: 201, 
    description: 'Sabão em Pó Omo 1kg', 
    department: 'Limpeza', 
    price: 14.90, 
    image_path: 'https://picsum.photos/500/500?random=3',
    long_description: 'Sabão em Pó Omo Lavagem Perfeita 1kg. Remove as manchas mais difíceis, cuida das cores e deixa um perfume duradouro.',
    details: {
      weight: '1.0 kg',
      height: '18 cm',
      width: '12 cm',
      length: '6 cm',
      unit: 'CX',
      ean: '7891000200300',
      brand: 'OMO',
      manufacturer: 'Unilever',
      stock_quantity: 800
    }
  },
  { 
    id: '4', 
    winthor_codprod: 202, 
    description: 'Detergente Ypê', 
    department: 'Limpeza', 
    price: 2.50, 
    image_path: 'https://picsum.photos/500/500?random=4',
    long_description: 'Detergente Líquido Ypê Neutro 500ml. Eficiência na limpeza e rendimento que impressiona.',
    details: {
      weight: '0.55 kg',
      height: '20 cm',
      width: '7 cm',
      length: '5 cm',
      unit: 'UN',
      ean: '7891000400500',
      brand: 'Ypê',
      manufacturer: 'Química Amparo',
      stock_quantity: 3000
    }
  },
  { 
    id: '5', 
    winthor_codprod: 301, 
    description: 'Conjunto de Copos', 
    department: 'Bazar', 
    price: 29.90, 
    image_path: 'https://picsum.photos/500/500?random=5',
    long_description: 'Jogo de Copos de Vidro Nadir Figueiredo 6 Peças. Design clássico e resistente, ideal para o dia a dia.',
    details: {
      weight: '1.2 kg',
      height: '15 cm',
      width: '25 cm',
      length: '18 cm',
      unit: 'CX',
      ean: '7891000600700',
      brand: 'Nadir',
      manufacturer: 'Nadir Figueiredo',
      stock_quantity: 200
    }
  },
];

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
  "Unilever", "Nestlé", "Coca-Cola", "Ambev", "P&G", 
  "Colgate", "3M", "Johnson & Johnson", "Danone", "PepsiCo"
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
      { product_id: '1', quantity: 20 },
      { product_id: '2', quantity: 5 }
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
      { product_id: '3', quantity: 10 }
    ]
  },
];

export const mockAdminUsers: AdminUser[] = [
  { id: 'u1', name: 'Admin Master', email: 'admin@epoca.com.br', role: 'ADMIN', status: 'ACTIVE', last_login: 'Hoje, 09:00' },
  { id: 'u2', name: 'Carlos Vendas', email: 'carlos@epoca.com.br', role: 'SALES', status: 'ACTIVE', last_login: 'Ontem, 14:30' },
  { id: 'u3', name: 'Ana Marketing', email: 'ana@epoca.com.br', role: 'MARKETING', status: 'ACTIVE', last_login: '2 dias atrás' },
];

export const mockActivities: ActivityLog[] = [
  { id: 'a1', user: 'Carlos Silva (Vendas)', action: 'Aprovou pedido #50242', timestamp: '10 min atrás' },
  { id: 'a2', user: 'Ana Souza (Marketing)', action: 'Atualizou Banner "Ofertas Natal"', timestamp: '1 hora atrás' },
  { id: 'a3', user: 'Sistema (n8n)', action: 'Sync de Boletos Itaú processado', timestamp: '2 horas atrás' },
];
