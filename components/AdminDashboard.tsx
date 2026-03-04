
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tooltip } from './ui/Layout';
import { mockProducts, mockCustomers, mockActivities, salesByDept, salesHistory, mockOrders, mockAdminUsers } from '../lib/mockData';
import { SalesData, Customer, AdminUser } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  UploadCloud, Image as ImageIcon, Check, Search, X, 
  LayoutDashboard, ShoppingBag, Users, FileText, Settings, LogOut,
  TrendingUp, AlertTriangle, ShieldCheck, Activity, Server, CreditCard, Video, Plus, UserPlus, Eye, Globe
} from 'lucide-react';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

interface SalesChartsProps {
  data: SalesData[];
}

// ... existing SalesCharts component ...
const SalesCharts: React.FC<SalesChartsProps> = ({ data }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Vendas Diárias (Últimos 30 dias)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis />
            <RechartsTooltip 
              formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Vendas']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="amount" fill="#0f172a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Mix por Departamento</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={salesByDept}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {salesByDept.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

const IntegrationsHealth = () => {
  const services = [
    { name: 'n8n Workflow Engine', status: 'online', ping: '45ms', icon: Activity },
    { name: 'WinThor ERP (Oracle)', status: 'online', ping: '12ms', icon: Server },
    { name: 'Banco Itaú API', status: 'online', ping: '88ms', icon: CreditCard },
    { name: 'ClearSale Antifraude', status: 'online', ping: '150ms', icon: ShieldCheck },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Activity className="w-5 h-5 text-emerald-600" /> Saúde das Integrações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
           {services.map((svc) => (
             <div key={svc.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-full ${svc.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      <svc.icon className="w-4 h-4" />
                   </div>
                   <div>
                      <p className="font-medium text-sm text-slate-900">{svc.name}</p>
                      <p className="text-xs text-slate-500">Latência: {svc.ping}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                   </span>
                   <span className="text-xs font-bold text-emerald-700 uppercase">Online</span>
                </div>
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ... BannerUpload component ...
const BannerUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploaded(true);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload();
    }
  };

  const handleButtonClick = () => {
    simulateUpload();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gestão de Banners (Marketing)</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4 h-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Título da Campanha</label>
            <input type="text" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" placeholder="Ex: Ofertas de Natal" />
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors flex-1 min-h-[150px] ${
              dragActive ? "border-emerald-600 bg-emerald-50" : "border-slate-200"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isUploading ? (
               <div className="w-full max-w-xs space-y-3 animate-in fade-in bg-white/50 p-4 rounded-lg border border-slate-100 shadow-sm">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Enviando mídia...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 ease-out" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Aguarde a sincronização com o Storage</p>
               </div>
            ) : uploaded ? (
              <div className="text-emerald-600 flex flex-col items-center animate-in zoom-in">
                <Check className="h-10 w-10 mb-2" />
                <p className="font-medium">Sucesso!</p>
                <Button variant="ghost" className="mt-2 h-8 px-3 text-xs" onClick={() => { setUploaded(false); setUploadProgress(0); }}>Novo Upload</Button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                <p className="font-medium text-sm">Arraste a imagem</p>
                <Button variant="outline" type="button" onClick={handleButtonClick} className="mt-2 h-8 px-3 text-xs">Selecionar</Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

const VideoUploadManagement = () => {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" /> Vídeo Institucional
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">Alterar Vídeo</Button>
                        </div>
                        <p className="text-slate-500 text-sm">Preview Atual</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Status do Player</p>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-slate-500">Ativo na página Institucional</span>
                        </div>
                    </div>
                    <Button className="w-full" variant="outline">Gerenciar no YouTube/Vimeo</Button>
                </div>
            </CardContent>
        </Card>
    )
}

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void }) => {
  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'products', label: 'Catálogo ERP', icon: ShoppingBag },
    { id: 'content', label: 'Marketing / CMS', icon: ImageIcon },
    { id: 'customers', label: 'Gestão de Usuários', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex-col hidden lg:flex h-full">
       <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Época <span className="text-emerald-600">Admin</span></h2>
          <p className="text-xs text-slate-500 mt-1">v2.4.0 (Connected to WinThor)</p>
       </div>
       <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id 
                  ? "bg-emerald-50 text-emerald-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? "text-emerald-600" : "text-slate-400"}`} />
              {item.label}
            </button>
          ))}
       </nav>
       <div className="p-4 border-t border-slate-100 space-y-1">
          <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors">
             <Globe className="w-5 h-5 mr-3" /> Ir para Loja
          </button>
          <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
             <LogOut className="w-5 h-5 mr-3" /> Sair
          </button>
       </div>
    </div>
  );
};

interface AdminDashboardProps {
  onNavigateToHome: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for Customer Management Tab
  const [userTab, setUserTab] = useState<'clients' | 'admins'>('clients');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdminUsers);
  
  // Temporary State for forms
  const [newClient, setNewClient] = useState({ company_name: '', cnpj: '', email: '' });
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'SALES' });

  // State for Cart Inspection
  const [viewingCart, setViewingCart] = useState<Customer | null>(null);

  // Filtering Logic for Overview
  const filteredHistory = salesHistory.filter(item => 
    item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.amount.toString().includes(searchTerm)
  );

  const handleCreateClient = (e: React.FormEvent) => {
      e.preventDefault();
      const client: Customer = {
          id: `c${Date.now()}`,
          company_name: newClient.company_name,
          cnpj: newClient.cnpj,
          status: 'ACTIVE',
          credit_limit: 0,
          last_order_date: '-'
      };
      setCustomers([...customers, client]);
      setIsCreatingUser(false);
      setNewClient({ company_name: '', cnpj: '', email: '' });
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      const admin: AdminUser = {
          id: `u${Date.now()}`,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role as any,
          status: 'ACTIVE',
          last_login: '-'
      };
      setAdmins([...admins, admin]);
      setIsCreatingUser(false);
      setNewAdmin({ name: '', email: '', role: 'SALES' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                 <h2 className="text-2xl font-bold tracking-tight">Dashboard Executivo</h2>
                 <p className="text-slate-500">Acompanhamento em tempo real da operação.</p>
               </div>
               
               {/* Global Search Bar */}
               <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                      type="text"
                      placeholder="Buscar métricas..."
                      className="flex h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-10 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  )}
               </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-slate-500">Vendas Hoje</p>
                       <h3 className="text-2xl font-bold text-slate-900">R$ 45.231</h3>
                     </div>
                     <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                        <TrendingUp className="w-5 h-5" />
                     </div>
                  </div>
                  <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> +15% vs ontem
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-slate-500">Pedidos Pendentes</p>
                       <h3 className="text-2xl font-bold text-slate-900">12</h3>
                     </div>
                     <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                        <FileText className="w-5 h-5" />
                     </div>
                  </div>
                  <p className="text-xs text-amber-600 mt-2 font-medium">Aguardando Aprovação</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-slate-500">Score Antifraude</p>
                       <h3 className="text-2xl font-bold text-slate-900">98.5%</h3>
                     </div>
                     <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">ClearSale Safe</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-medium text-slate-500">Novos Clientes</p>
                       <h3 className="text-2xl font-bold text-slate-900">8</h3>
                     </div>
                     <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                        <Users className="w-5 h-5" />
                     </div>
                  </div>
                  <p className="text-xs text-purple-600 mt-2 font-medium">Cadastros via Site</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  <SalesCharts data={filteredHistory} />
               </div>
               <div className="space-y-6">
                  <IntegrationsHealth />
                  <Card>
                    <CardHeader><CardTitle>Atividade Recente</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockActivities.map(activity => (
                          <div key={activity.id} className="flex gap-3 text-sm border-b border-slate-50 last:border-0 pb-2">
                             <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                             <div>
                               <p className="font-medium text-slate-900">{activity.user}</p>
                               <p className="text-slate-500">{activity.action}</p>
                               <p className="text-xs text-slate-400 mt-1">{activity.timestamp}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
               </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Catálogo de Produtos</h2>
                <Button>Sincronizar WinThor</Button>
             </div>
             <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-medium text-slate-500">Código</th>
                        <th className="px-6 py-3 font-medium text-slate-500">Produto</th>
                        <th className="px-6 py-3 font-medium text-slate-500">Departamento</th>
                        <th className="px-6 py-3 font-medium text-slate-500">Preço</th>
                        <th className="px-6 py-3 font-medium text-slate-500 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.map(product => (
                        <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-3 font-mono text-slate-500">{product.winthor_codprod}</td>
                          <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-3">
                             <img src={product.image_path} className="w-8 h-8 rounded object-cover bg-white border border-slate-200" alt="" />
                             {product.description}
                          </td>
                          <td className="px-6 py-3"><Badge variant="default">{product.department}</Badge></td>
                          <td className="px-6 py-3 text-slate-900 font-bold">R$ {product.price.toFixed(2)}</td>
                          <td className="px-6 py-3 text-right">
                             <Button variant="ghost" className="h-8 text-xs">Editar</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
             </Card>
          </div>
        );
      case 'content':
        return (
           <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-bold">Gerenciamento de Conteúdo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <BannerUpload />
                 <VideoUploadManagement />
              </div>
           </div>
        );
      case 'customers':
         return (
            <div className="space-y-6 animate-in fade-in relative">
              {/* Cart Inspection Overlay */}
              {viewingCart && (
                 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                               <ShoppingBag className="w-5 h-5 text-emerald-600" />
                               Carrinho: {viewingCart.company_name}
                            </h3>
                            <button onClick={() => setViewingCart(null)} className="p-1 hover:bg-slate-200 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-0 max-h-[60vh] overflow-y-auto">
                           {viewingCart.cart && viewingCart.cart.length > 0 ? (
                             <table className="w-full text-sm">
                                <thead className="bg-slate-50/50">
                                   <tr>
                                      <th className="px-4 py-2 text-left text-slate-500">Produto</th>
                                      <th className="px-4 py-2 text-center text-slate-500">Qtd</th>
                                      <th className="px-4 py-2 text-right text-slate-500">Subtotal</th>
                                   </tr>
                                </thead>
                                <tbody>
                                   {viewingCart.cart.map((item, idx) => {
                                      const product = mockProducts.find(p => p.id === item.product_id);
                                      if (!product) return null;
                                      return (
                                          <tr key={idx} className="border-b border-slate-50">
                                              <td className="px-4 py-3 font-medium">
                                                  <div className="flex items-center gap-2">
                                                      <img src={product.image_path} className="w-8 h-8 rounded bg-slate-100" />
                                                      <span className="line-clamp-1">{product.description}</span>
                                                  </div>
                                              </td>
                                              <td className="px-4 py-3 text-center">{item.quantity}</td>
                                              <td className="px-4 py-3 text-right">R$ {(item.quantity * product.price).toFixed(2)}</td>
                                          </tr>
                                      )
                                   })}
                                </tbody>
                             </table>
                           ) : (
                               <div className="p-8 text-center text-slate-500">
                                   <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                   <p>Carrinho vazio no momento.</p>
                               </div>
                           )}
                        </div>
                        {viewingCart.cart && viewingCart.cart.length > 0 && (
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center font-bold">
                                <span>Total do Carrinho:</span>
                                <span className="text-lg text-emerald-600">
                                    R$ {viewingCart.cart.reduce((acc, item) => {
                                        const product = mockProducts.find(p => p.id === item.product_id);
                                        return acc + (item.quantity * (product?.price || 0));
                                    }, 0).toFixed(2)}
                                </span>
                            </div>
                        )}
                     </div>
                 </div>
              )}

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
                  <div className="flex gap-2 p-1 bg-slate-200 rounded-lg">
                      <button 
                          onClick={() => { setUserTab('clients'); setIsCreatingUser(false); }}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${userTab === 'clients' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                          Clientes B2B
                      </button>
                      <button 
                          onClick={() => { setUserTab('admins'); setIsCreatingUser(false); }}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${userTab === 'admins' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                          Equipe Interna
                      </button>
                  </div>
              </div>

              {!isCreatingUser ? (
                  <>
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                        <div>
                            <p className="font-bold text-slate-700">{userTab === 'clients' ? 'Carteira de Clientes' : 'Administradores e Operadores'}</p>
                            <p className="text-xs text-slate-400">{userTab === 'clients' ? 'Gestão de acesso para empresas parceiras.' : 'Controle de permissões da equipe Época.'}</p>
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setIsCreatingUser(true)}>
                            <Plus className="w-4 h-4 mr-2" /> {userTab === 'clients' ? 'Novo Cliente' : 'Novo Usuário'}
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        {userTab === 'clients' ? (
                                            <>
                                                <th className="px-6 py-3 font-medium text-slate-500">Empresa</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">CNPJ</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Sessão</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Limite</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3 font-medium text-slate-500">Nome</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Email</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Cargo</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                                                <th className="px-6 py-3 font-medium text-slate-500">Último Acesso</th>
                                            </>
                                        )}
                                        <th className="px-6 py-3 font-medium text-slate-500 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userTab === 'clients' ? (
                                        customers.map(c => (
                                            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium text-slate-900">{c.company_name}</td>
                                                <td className="px-6 py-3 text-slate-500 font-mono">{c.cnpj}</td>
                                                <td className="px-6 py-3">
                                                   <div className="flex items-center gap-2">
                                                      <div className={`w-2.5 h-2.5 rounded-full ${c.is_online ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                                      <span className={`text-xs font-medium ${c.is_online ? 'text-green-700' : 'text-slate-400'}`}>
                                                        {c.is_online ? 'Online' : 'Offline'}
                                                      </span>
                                                   </div>
                                                </td>
                                                <td className="px-6 py-3">{c.status === 'ACTIVE' ? <Badge variant="success">Ativo</Badge> : <Badge variant="destructive">Bloqueado</Badge>}</td>
                                                <td className="px-6 py-3">R$ {c.credit_limit.toLocaleString()}</td>
                                                <td className="px-6 py-3 text-right">
                                                   <div className="flex justify-end gap-2">
                                                       <Tooltip content="Espiar Carrinho">
                                                          <Button 
                                                            variant="ghost" 
                                                            className={`h-8 w-8 p-0 ${c.is_online ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
                                                            onClick={() => setViewingCart(c)}
                                                          >
                                                              <ShoppingBag className="h-4 w-4" />
                                                          </Button>
                                                       </Tooltip>
                                                       <Button variant="ghost" className="h-8 text-xs">Editar</Button>
                                                   </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        admins.map(a => (
                                            <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">
                                                        {a.name.charAt(0)}
                                                    </div>
                                                    {a.name}
                                                </td>
                                                <td className="px-6 py-3 text-slate-500">{a.email}</td>
                                                <td className="px-6 py-3"><Badge variant="default">{a.role}</Badge></td>
                                                <td className="px-6 py-3">{a.status === 'ACTIVE' ? <Badge variant="success">Ativo</Badge> : <Badge variant="destructive">Inativo</Badge>}</td>
                                                <td className="px-6 py-3 text-slate-400 text-xs">{a.last_login}</td>
                                                <td className="px-6 py-3 text-right"><Button variant="ghost" className="h-8 text-xs">Editar</Button></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {userTab === 'clients' && (
                        <div className="mt-8">
                             <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600"/> Monitoramento de Fraude (ClearSale)</h3>
                             <Card>
                                <CardContent className="p-0">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-3">Pedido</th>
                                                <th className="px-6 py-3">Data</th>
                                                <th className="px-6 py-3">Valor</th>
                                                <th className="px-6 py-3">Score Fraude</th>
                                                <th className="px-6 py-3">Status CS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockOrders.filter(o => o.fraud_analysis).map(order => (
                                                <tr key={order.id} className="border-b border-slate-100">
                                                    <td className="px-6 py-3 font-mono">#{order.winthor_numped}</td>
                                                    <td className="px-6 py-3">{new Date(order.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-3 font-bold">R$ {order.total_value.toLocaleString()}</td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                <div className={`h-full ${order.fraud_analysis?.score! > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${order.fraud_analysis?.score}%`}}></div>
                                                            </div>
                                                            <span className="text-xs font-mono">{order.fraud_analysis?.score.toFixed(1)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {order.fraud_analysis?.status === 'APPROVED' && <Badge variant="success">Aprovado</Badge>}
                                                        {order.fraud_analysis?.status === 'MANUAL_REVIEW' && <Badge variant="warning">Revisão Manual</Badge>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                             </Card>
                        </div>
                    )}
                  </>
              ) : (
                  <div className="max-w-2xl mx-auto">
                      <Button variant="ghost" onClick={() => setIsCreatingUser(false)} className="mb-4 pl-0 text-slate-500 hover:text-slate-900">
                          <X className="w-4 h-4 mr-2" /> Cancelar Criação
                      </Button>
                      <Card>
                          <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                  <UserPlus className="w-5 h-5 text-emerald-600" />
                                  {userTab === 'clients' ? 'Cadastrar Novo Cliente B2B' : 'Adicionar Usuário Administrativo'}
                              </CardTitle>
                          </CardHeader>
                          <CardContent>
                              {userTab === 'clients' ? (
                                  <form onSubmit={handleCreateClient} className="space-y-4">
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Razão Social</label>
                                          <input required type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.company_name} onChange={e => setNewClient({...newClient, company_name: e.target.value})} placeholder="Ex: Supermercado Silva LTDA" />
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">CNPJ</label>
                                          <input required type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.cnpj} onChange={e => setNewClient({...newClient, cnpj: e.target.value})} placeholder="00.000.000/0001-00" />
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Email de Acesso</label>
                                          <input required type="email" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} placeholder="compras@cliente.com.br" />
                                      </div>
                                      <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Criar Cliente e Enviar Convite</Button>
                                  </form>
                              ) : (
                                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Nome Completo</label>
                                          <input required type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} placeholder="Ex: João da Silva" />
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Email Corporativo</label>
                                          <input required type="email" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} placeholder="joao@epoca.com.br" />
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Função</label>
                                          <select className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newAdmin.role} onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}>
                                              <option value="ADMIN">Administrador</option>
                                              <option value="SALES">Vendas</option>
                                              <option value="MARKETING">Marketing</option>
                                              <option value="SUPPORT">Suporte</option>
                                          </select>
                                      </div>
                                      <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Criar Usuário</Button>
                                  </form>
                              )}
                          </CardContent>
                      </Card>
                  </div>
              )}
            </div>
         );
      default:
        return <div>Em construção...</div>;
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden font-sans text-slate-900">
       <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onNavigateToHome} />
       <main className="flex-1 overflow-auto p-8 relative">
          {renderContent()}
       </main>
    </div>
  );
};

export default AdminDashboard;
