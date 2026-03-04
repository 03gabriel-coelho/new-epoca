
// Enums mirroring the SQL schema
export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  MARKETING = 'marketing',
  SALES = 'sales'
}

export enum OrderStatus {
  ABERTO = 'A',
  BLOQUEADO = 'B',
  LIBERADO = 'L',
  FATURADO = 'F',
  CANCELADO = 'C'
}

// Interfaces
export interface TechnicalDetails {
  weight: string; // e.g., "2.5 kg"
  height: string; // e.g., "30 cm"
  width: string;  // e.g., "10 cm"
  length: string; // e.g., "10 cm"
  unit: string;   // e.g., "UN", "CX", "FD"
  ean: string;
  brand: string;
  stock_quantity: number;
  manufacturer: string;
}

export interface Product {
  id: string;
  winthor_codprod: number;
  description: string;
  department: 'Bazar' | 'Bebidas' | 'Limpeza';
  price: number;
  image_path: string;
  details?: TechnicalDetails; // Extended details
  long_description?: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface FraudAnalysis {
  provider: 'CLEARSALE';
  score: number; // 0-100 (High is bad)
  status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  transaction_id: string;
}

export interface Order {
  id: string;
  winthor_numped: number;
  date: string;
  total_value: number;
  status: OrderStatus;
  items_count: number;
  fraud_analysis?: FraudAnalysis;
}

export interface BankIntegration {
  bank_name: 'ITAÚ' | 'BRADESCO' | 'SANTANDER';
  registration_id: string;
  our_number: string; // Nosso Número
  registered_at: string;
}

export interface FinancialTitle {
  id: string;
  doc_number: string;
  due_date: string;
  value: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  pdf_url?: string;
  bank_data?: BankIntegration;
}

export interface SalesMetric {
  name: string;
  value: number;
  [key: string]: any;
}

export interface SalesData {
  date: string;
  amount: number;
  [key: string]: any;
}

export interface InstitutionalVideo {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
}

export interface Customer {
  id: string;
  cnpj: string;
  company_name: string;
  status: 'ACTIVE' | 'BLOCKED';
  credit_limit: number;
  last_order_date: string;
  is_online?: boolean; // New field for live status
  cart?: CartItem[];   // New field for cart inspection
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SALES' | 'MARKETING' | 'SUPPORT';
  status: 'ACTIVE' | 'INACTIVE';
  last_login: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}
