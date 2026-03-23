
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tooltip } from './ui/Layout';
import AdminStatisticsPage from './AdminStatisticsPage';
import ProductImage from './ui/ProductImage';
import { mockProducts, mockCustomers, mockActivities, salesByDept, salesHistory, mockOrders, mockAdminUsers } from '../lib/mockData';
import { SalesData, Customer, AdminUser, Product, AuthUser } from '../types';
import { getStoredUsers, saveStoredUsers, updateStoredUser } from '../lib/authStorage';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  UploadCloud, Image as ImageIcon, Check, Search, X, 
  LayoutDashboard, ShoppingBag, Users, FileText, Settings, LogOut,
  TrendingUp, AlertTriangle, ShieldCheck, Activity, Server, CreditCard, Video, Plus, UserPlus, Eye, Globe, BarChart3
} from 'lucide-react';
import Logo from "../lib/images/logo1.webp";

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

const ProductImageEditModal = ({
  product,
  imageDraft,
  onImageDraftChange,
  onClose,
  onSave,
  onFileChange
}: {
  product: Product;
  imageDraft: string;
  onImageDraftChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const slotLabels = ['FOTO_CAPA', 'IMAGE2', 'IMAGE3', 'IMAGE4', 'IMAGE5'];
  const initialSlots = slotLabels.map((label, index) => ({
    label,
    image: product.gallery_images?.[index] || (index === 0 ? imageDraft || product.image_path : ''),
  }));
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [slotDrafts, setSlotDrafts] = useState(initialSlots);
  const activeSlot = slotDrafts[selectedSlot];
  const previewImage = activeSlot?.image || product.image_path;

  const handleSlotDraftChange = (value: string) => {
    setSlotDrafts((prev) =>
      prev.map((slot, index) => (index === selectedSlot ? { ...slot, image: value } : slot))
    );

    if (selectedSlot === 0) {
      onImageDraftChange(value);
    }
  };

  const handleSlotFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event);

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setSlotDrafts((prev) =>
      prev.map((slot, index) => (index === selectedSlot ? { ...slot, image: localPreview } : slot))
    );
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
    <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Catalogo ERP</p>
          <h3 className="text-2xl font-bold text-slate-900">Editar imagem do produto</h3>
          <p className="mt-1 text-sm text-slate-500">{product.description}</p>
        </div>
        <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-6 p-6 xl:grid-cols-[320px,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Preview</p>
          <div className="flex aspect-square max-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-4">
            <ProductImage
              src={previewImage}
              alt={product.description}
              className="h-full w-full"
              imgClassName="h-full w-full object-contain"
            />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs">
              <span className="font-bold text-slate-600">{activeSlot.label}</span>
              <Badge variant="success" className="border border-emerald-200 bg-emerald-50 text-emerald-700">Ativa</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Simulacao visual da galeria do produto no ERP com capa principal e imagens complementares.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Galeria ERP</label>
              <span className="text-xs font-medium text-slate-400">5 posicoes de imagem</span>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              {slotDrafts.map((slot, index) => (
                <button
                  key={slot.label}
                  type="button"
                  onClick={() => setSelectedSlot(index)}
                  className={`rounded-2xl border p-2 text-left transition-all ${
                    selectedSlot === index
                      ? 'border-emerald-400 bg-white shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                    <ProductImage
                      src={slot.image || product.image_path}
                      alt={`${product.description} ${slot.label}`}
                      className="h-full w-full"
                      imgClassName="h-full w-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-700">{slot.label}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {slot.image ? 'Configurada' : 'Disponivel'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700">URL da imagem selecionada</label>
              <input
                type="text"
                value={activeSlot.image}
                onChange={(event) => handleSlotDraftChange(event.target.value)}
                placeholder="https://exemplo.com/imagem-do-produto.webp"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="text-xs text-slate-500">Cole uma URL publica para a {activeSlot.label.toLowerCase()} ou selecione um arquivo.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Enviar nova imagem</p>
                <p className="mt-1 text-sm text-slate-500">Arquivos locais atualizam o preview imediatamente.</p>
              </div>
            </div>
            <label className="mt-4 flex h-24 cursor-pointer flex-col items-center justify-center rounded-2xl bg-slate-50 text-center transition-colors hover:bg-slate-100">
              <span className="text-sm font-semibold text-slate-700">Selecionar arquivo</span>
              <span className="mt-1 text-xs text-slate-500">PNG, JPG ou WEBP</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleSlotFileChange} />
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Mapa de campos do ERP</p>
              <Badge variant="default" className="bg-slate-100 text-slate-700">Simulado</Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              {slotDrafts.map((slot, index) => (
                <div key={slot.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{slot.label}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {index === 0 ? 'Imagem principal do produto' : `Imagem complementar ${index}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${slot.image ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {slot.image ? 'Preenchido' : 'Sem imagem'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Codigo</p>
                <p className="mt-1 font-semibold text-slate-900">{product.winthor_codprod}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Departamento</p>
                <p className="mt-1 font-semibold text-slate-900">{product.department}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} disabled={!slotDrafts[0]?.image?.trim()}>Salvar galeria</Button>
      </div>
    </div>
  </div>
  );
};

const OnDemandImageImportModal = ({
  summary,
  onClose,
  onConfirm
}: {
  summary: {
    totalFiles: number;
    matchedFiles: number;
    unmatchedFiles: string[];
    sampleMatches: string[];
  };
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
    <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Carga sob demanda</p>
          <h3 className="text-2xl font-bold text-slate-900">Revisar pasta de imagens</h3>
          <p className="mt-1 text-sm text-slate-500">
            Confira os arquivos identificados antes de enviar a carga para processamento.
          </p>
        </div>
        <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Arquivos lidos</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{summary.totalFiles}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Correspondencias</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{summary.matchedFiles}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Pendencias</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{summary.totalFiles - summary.matchedFiles}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Arquivos identificados por codigo</p>
              <Badge variant="success" className="border border-emerald-200 bg-emerald-50 text-emerald-700">
                Prontos para envio
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {summary.sampleMatches.length > 0 ? (
                summary.sampleMatches.map((fileName) => (
                  <div key={fileName} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {fileName}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Nenhum arquivo identificado.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Arquivos para revisao</p>
              <Badge variant="warning" className="border border-amber-200 bg-amber-50 text-amber-700">
                Validacao manual
              </Badge>
            </div>
            <div className="mt-4 space-y-2">
              {summary.unmatchedFiles.length > 0 ? (
                summary.unmatchedFiles.map((fileName) => (
                  <div key={fileName} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {fileName}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">Nenhuma pendencia nesta carga.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={onConfirm}>
          Enviar imagens
        </Button>
      </div>
    </div>
  </div>
);

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void }) => {
  const menuItems = [
    { id: 'statistics', label: 'Estatisticas', icon: BarChart3 },
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'products', label: 'Catálogo ERP', icon: ShoppingBag },
    { id: 'content', label: 'Marketing / CMS', icon: ImageIcon },
    { id: 'customers', label: 'Gestão de Usuários', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex-col hidden lg:flex h-full">
       <div className="p-6">
          <img className="h-12" src={Logo}/>
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

const CLIENT_DEFAULT_PASSWORD = 'Epoca@123';
const ADMIN_DEFAULT_PASSWORD = 'Admin@123';

interface OpenCnpjPhone {
  ddd?: string;
  numero?: string;
  is_fax?: boolean;
}

interface OpenCnpjResponse {
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  email?: string;
  telefones?: OpenCnpjPhone[];
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  cidade?: string;
  uf?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    cidade?: string;
    uf?: string;
  };
  estabelecimento?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    municipio?: string;
    cidade?: string;
    uf?: string;
  };
}

const getDigits = (value: string) => value.replace(/\D/g, '');

const formatCnpj = (value: string) => {
  const digits = getDigits(value).slice(0, 14);

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

const formatZipCode = (value: string) => {
  const digits = getDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatPhone = (phone?: OpenCnpjPhone) => {
  const digits = `${phone?.ddd ?? ''}${phone?.numero ?? ''}`.replace(/\D/g, '');

  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  return digits;
};

const extractAddressFromCnpj = (data: OpenCnpjResponse) => {
  const address = data.estabelecimento || data.endereco || data;
  return {
    zip_code: formatZipCode(address.cep || ''),
    street: address.logradouro || '',
    address_number: address.numero || '',
    address_complement: address.complemento || '',
    district: address.bairro || '',
    city: address.municipio || address.cidade || '',
    state: address.uf || '',
    reference_point: '',
  };
};

const emptyClientForm = () => ({
  company_name: '',
  trade_name: '',
  cnpj: '',
  email: '',
  email2: '',
  phone: '',
  phone2: '',
  zip_code: '',
  street: '',
  district: '',
  address_number: '',
  address_complement: '',
  city: '',
  state: '',
  reference_point: '',
  credit_limit: '0',
  status: 'ACTIVE' as Customer['status'],
  default_password: CLIENT_DEFAULT_PASSWORD,
});

const emptyAdminForm = () => ({
  name: '',
  email: '',
  phone: '',
  role: 'SALES' as AdminUser['role'],
  status: 'ACTIVE' as AdminUser['status'],
  default_password: ADMIN_DEFAULT_PASSWORD,
});

const toAuthUserFromCustomerForm = (form: ReturnType<typeof emptyClientForm>, customerId: string): AuthUser => {
  const fullAddress = [
    [form.street, form.address_number].filter(Boolean).join(', '),
    [form.district, form.city, form.state].filter(Boolean).join(' - '),
    form.zip_code,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    id: customerId,
    cnpj: form.cnpj,
    companyName: form.company_name,
    tradeName: form.trade_name || form.company_name,
    legalName: form.company_name,
    email: form.email,
    email2: form.email2 || '',
    phone: form.phone,
    phone2: form.phone2 || '',
    password: form.default_password,
    createdAt: new Date().toISOString(),
    fullAddress,
    referencePoint: form.reference_point || '',
    zipCode: form.zip_code || '',
    street: form.street || '',
    district: form.district || '',
    addressNumber: form.address_number || '',
    addressComplement: form.address_complement || '',
    city: form.city || '',
    state: form.state || '',
  };
};

const UserFormModal: React.FC<{
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
    <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <Button variant="ghost" className="rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[80vh] overflow-y-auto p-6">
        {children}
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateToHome }) => {
  const PRODUCT_BATCH_SIZE = 80;
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImageDraft, setProductImageDraft] = useState('');
  const [visibleProductCount, setVisibleProductCount] = useState(PRODUCT_BATCH_SIZE);
  const bulkImageInputRef = useRef<HTMLInputElement | null>(null);
  const productLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const [onDemandUploadSummary, setOnDemandUploadSummary] = useState<null | {
    totalFiles: number;
    matchedFiles: number;
    unmatchedFiles: string[];
    sampleMatches: string[];
  }>(null);
  
  // States for Customer Management Tab
  const [userTab, setUserTab] = useState<'clients' | 'admins'>('clients');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(() => {
      const storedUsers = getStoredUsers();
      const storedCustomers: Customer[] = storedUsers.map((user) => ({
          id: user.id,
          company_name: user.companyName,
          trade_name: user.tradeName || user.companyName,
          cnpj: user.cnpj,
          email: user.email,
          email2: user.email2,
          phone: user.phone,
          phone2: user.phone2,
          zip_code: user.zipCode,
          street: user.street,
          district: user.district,
          address_number: user.addressNumber,
          address_complement: user.addressComplement,
          city: user.city,
          state: user.state,
          reference_point: user.referencePoint,
          default_password: user.password,
          status: 'ACTIVE',
          credit_limit: 0,
          last_order_date: '-',
      }));

      return [...mockCustomers, ...storedCustomers.filter((stored) => !mockCustomers.some((customer) => customer.id === stored.id))];
  });
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdminUsers);
  
  // Temporary State for forms
  const [newClient, setNewClient] = useState(emptyClientForm);
  const [newAdmin, setNewAdmin] = useState(emptyAdminForm);
  const [editingClient, setEditingClient] = useState<Customer | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editClientForm, setEditClientForm] = useState(emptyClientForm);
  const [editAdminForm, setEditAdminForm] = useState(emptyAdminForm);
  const [createdCredential, setCreatedCredential] = useState<null | {
      type: 'client' | 'admin';
      name: string;
      identifier: string;
      password: string;
  }>(null);
  const [isFetchingClientCnpj, setIsFetchingClientCnpj] = useState(false);
  const [clientCnpjFeedback, setClientCnpjFeedback] = useState<null | { type: 'success' | 'error'; message: string }>(null);

  // State for Cart Inspection
  const [viewingCart, setViewingCart] = useState<Customer | null>(null);

  // Filtering Logic for Overview
  const filteredHistory = salesHistory.filter(item => 
    item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.amount.toString().includes(searchTerm)
  );

  const filteredProducts = products.filter((product) => {
      const query = productSearchTerm.trim().toLowerCase();
      if (!query) return true;

      const searchableFields = [
          product.description,
          product.department,
          product.winthor_codprod.toString(),
          product.details?.manufacturer,
          product.details?.brand,
          product.details?.ean
      ]
        .filter(Boolean)
        .map((value) => value!.toLowerCase());

      return searchableFields.some((value) => value.includes(query));
  });

  const visibleProducts = filteredProducts.slice(0, visibleProductCount);

  useEffect(() => {
      setVisibleProductCount(PRODUCT_BATCH_SIZE);
  }, [productSearchTerm, activeTab]);

  useEffect(() => {
      if (activeTab !== 'products') return;
      if (visibleProductCount >= filteredProducts.length) return;
      if (!productLoadMoreRef.current) return;

      const observer = new IntersectionObserver(
          (entries) => {
              const firstEntry = entries[0];
              if (firstEntry?.isIntersecting) {
                  setVisibleProductCount((prev) => Math.min(prev + PRODUCT_BATCH_SIZE, filteredProducts.length));
              }
          },
          { rootMargin: '320px 0px' }
      );

      observer.observe(productLoadMoreRef.current);
      return () => observer.disconnect();
  }, [activeTab, filteredProducts.length, visibleProductCount]);

  useEffect(() => {
      if (!isCreatingUser || userTab !== 'clients') {
          return;
      }

      const cnpjDigits = getDigits(newClient.cnpj);

      if (cnpjDigits.length !== 14) {
          setIsFetchingClientCnpj(false);
          setClientCnpjFeedback(null);
          return;
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(async () => {
          setIsFetchingClientCnpj(true);
          setClientCnpjFeedback(null);

          try {
              const response = await fetch(`https://api.opencnpj.org/${cnpjDigits}`, {
                  signal: controller.signal,
              });

              if (!response.ok) {
                  if (response.status === 404) {
                      throw new Error('CNPJ nao encontrado na base publica.');
                  }

                  if (response.status === 429) {
                      throw new Error('Limite de consultas atingido. Tente novamente em instantes.');
                  }

                  throw new Error('Nao foi possivel consultar o CNPJ agora.');
              }

              const data = (await response.json()) as OpenCnpjResponse;
              const companyName = data.razao_social || data.nome_fantasia || '';
              const phone = formatPhone(data.telefones?.find(item => !item.is_fax) || data.telefones?.[0]);
              const addressData = extractAddressFromCnpj(data);

              setNewClient((current) => ({
                  ...current,
                  company_name: companyName || current.company_name,
                  trade_name: data.nome_fantasia || companyName || current.trade_name,
                  email: data.email || current.email,
                  phone: phone || current.phone,
                  ...addressData,
              }));
              setClientCnpjFeedback({
                  type: 'success',
                  message: 'Dados da empresa preenchidos automaticamente.',
              });
          } catch (error) {
              if (controller.signal.aborted) {
                  return;
              }

              setClientCnpjFeedback({
                  type: 'error',
                  message: error instanceof Error ? error.message : 'Falha ao consultar o CNPJ.',
              });
          } finally {
              if (!controller.signal.aborted) {
                  setIsFetchingClientCnpj(false);
              }
          }
      }, 500);

      return () => {
          controller.abort();
          window.clearTimeout(timeoutId);
      };
  }, [isCreatingUser, newClient.cnpj, userTab]);

  const handleCreateClient = (e: React.FormEvent) => {
      e.preventDefault();
      const customerId = `c${Date.now()}`;
      const authUser = toAuthUserFromCustomerForm(newClient, customerId);

      const existingUsers = getStoredUsers();
      const normalizedEmail = authUser.email.trim().toLowerCase();
      const normalizedCnpj = authUser.cnpj.replace(/\D/g, '');
      const alreadyExists = existingUsers.some((storedUser) => {
          const sameEmail = storedUser.email.trim().toLowerCase() === normalizedEmail;
          const sameCnpj = storedUser.cnpj.replace(/\D/g, '') === normalizedCnpj;
          return sameEmail || sameCnpj;
      });

      if (alreadyExists) {
          window.alert('Ja existe uma empresa cadastrada com este CNPJ ou email.');
          return;
      }

      saveStoredUsers([...existingUsers, authUser]);

      const client: Customer = {
          id: customerId,
          company_name: newClient.company_name,
          trade_name: newClient.trade_name,
          cnpj: newClient.cnpj,
          email: newClient.email,
          email2: newClient.email2,
          phone: newClient.phone,
          phone2: newClient.phone2,
          zip_code: newClient.zip_code,
          street: newClient.street,
          district: newClient.district,
          address_number: newClient.address_number,
          address_complement: newClient.address_complement,
          city: newClient.city,
          state: newClient.state,
          reference_point: newClient.reference_point,
          default_password: newClient.default_password,
          status: 'ACTIVE',
          credit_limit: Number(newClient.credit_limit) || 0,
          last_order_date: '-'
      };
      setCustomers((prev) => [...prev, client]);
      setCreatedCredential({
          type: 'client',
          name: client.company_name,
          identifier: client.email || client.cnpj,
          password: newClient.default_password,
      });
      setIsCreatingUser(false);
      setNewClient(emptyClientForm());
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      const admin: AdminUser = {
          id: `u${Date.now()}`,
          name: newAdmin.name,
          email: newAdmin.email,
          phone: newAdmin.phone,
          default_password: newAdmin.default_password,
          role: newAdmin.role as any,
          status: newAdmin.status,
          last_login: '-'
      };
      setAdmins((prev) => [...prev, admin]);
      setCreatedCredential({
          type: 'admin',
          name: admin.name,
          identifier: admin.email,
          password: newAdmin.default_password,
      });
      setIsCreatingUser(false);
      setNewAdmin(emptyAdminForm());
  };

  const handleOpenClientEditor = (client: Customer) => {
      setEditingAdmin(null);
      setEditingClient(client);
      setEditClientForm({
          company_name: client.company_name,
          trade_name: client.trade_name || '',
          cnpj: client.cnpj,
          email: client.email || '',
          email2: client.email2 || '',
          phone: client.phone || '',
          phone2: client.phone2 || '',
          zip_code: client.zip_code || '',
          street: client.street || '',
          district: client.district || '',
          address_number: client.address_number || '',
          address_complement: client.address_complement || '',
          city: client.city || '',
          state: client.state || '',
          reference_point: client.reference_point || '',
          credit_limit: String(client.credit_limit || 0),
          status: client.status,
          default_password: client.default_password || CLIENT_DEFAULT_PASSWORD,
      });
  };

  const handleOpenAdminEditor = (admin: AdminUser) => {
      setEditingClient(null);
      setEditingAdmin(admin);
      setEditAdminForm({
          name: admin.name,
          email: admin.email,
          phone: admin.phone || '',
          role: admin.role,
          status: admin.status,
          default_password: admin.default_password || ADMIN_DEFAULT_PASSWORD,
      });
  };

  const handleSaveClientEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingClient) return;

      const nextCustomer: Customer = {
          ...editingClient,
          company_name: editClientForm.company_name,
          trade_name: editClientForm.trade_name,
          email: editClientForm.email,
          email2: editClientForm.email2,
          phone: editClientForm.phone,
          phone2: editClientForm.phone2,
          zip_code: editClientForm.zip_code,
          street: editClientForm.street,
          district: editClientForm.district,
          address_number: editClientForm.address_number,
          address_complement: editClientForm.address_complement,
          city: editClientForm.city,
          state: editClientForm.state,
          reference_point: editClientForm.reference_point,
          credit_limit: Number(editClientForm.credit_limit) || 0,
          status: editClientForm.status,
          default_password: editClientForm.default_password,
      };

      setCustomers((prev) => prev.map((customer) => (customer.id === editingClient.id ? nextCustomer : customer)));

      try {
          updateStoredUser(editingClient.id, {
              companyName: editClientForm.company_name,
              tradeName: editClientForm.trade_name || editClientForm.company_name,
              legalName: editClientForm.company_name,
              email: editClientForm.email,
              email2: editClientForm.email2 || '',
              phone: editClientForm.phone,
              phone2: editClientForm.phone2 || '',
              referencePoint: editClientForm.reference_point || '',
              zipCode: editClientForm.zip_code || '',
              street: editClientForm.street || '',
              district: editClientForm.district || '',
              addressNumber: editClientForm.address_number || '',
              addressComplement: editClientForm.address_complement || '',
              city: editClientForm.city || '',
              state: editClientForm.state || '',
          });
      } catch {
          // Mock customers may not exist in local auth storage yet.
      }

      setEditingClient(null);
  };

  const handleSaveAdminEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingAdmin) return;

      setAdmins((prev) =>
          prev.map((admin) =>
              admin.id === editingAdmin.id
                  ? {
                        ...admin,
                        name: editAdminForm.name,
                        email: editAdminForm.email,
                        phone: editAdminForm.phone,
                        role: editAdminForm.role,
                        status: editAdminForm.status,
                        default_password: editAdminForm.default_password,
                    }
                  : admin
          )
      );

      setEditingAdmin(null);
  };

  const handleOpenProductEditor = (product: Product) => {
      setEditingProduct(product);
      setProductImageDraft(product.image_path);
  };

  const handleCloseProductEditor = () => {
      setEditingProduct(null);
      setProductImageDraft('');
  };

  const handleProductImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setProductImageDraft(previewUrl);
  };

  const handleSaveProductImage = () => {
      if (!editingProduct || !productImageDraft.trim()) return;

      setProducts(prev =>
          prev.map(product =>
              product.id === editingProduct.id
                  ? { ...product, image_path: productImageDraft.trim() }
                  : product
          )
      );
      handleCloseProductEditor();
  };

  const handleOpenOnDemandImageImport = () => {
      bulkImageInputRef.current?.click();
  };

  const handleOnDemandImageFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      const productCodeSet = new Set(products.map((product) => String(product.winthor_codprod)));
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      const matchedFiles: string[] = [];
      const unmatchedFiles: string[] = [];

      imageFiles.forEach((file) => {
          const fileNameWithoutExtension = file.name.replace(/\.[^.]+$/, '');
          const normalizedCode = fileNameWithoutExtension.replace(/-(2|3|4|5)$/, '');

          if (productCodeSet.has(normalizedCode)) {
              matchedFiles.push(file.name);
          } else {
              unmatchedFiles.push(file.name);
          }
      });

      setOnDemandUploadSummary({
          totalFiles: imageFiles.length,
          matchedFiles: matchedFiles.length,
          unmatchedFiles: unmatchedFiles.slice(0, 5),
          sampleMatches: matchedFiles.slice(0, 5),
      });

      event.target.value = '';
  };

  const handleCloseOnDemandImageImport = () => {
      setOnDemandUploadSummary(null);
  };

  const handleConfirmOnDemandImageImport = () => {
      setOnDemandUploadSummary(null);
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
             <div className="hidden">
                <h2 className="text-2xl font-bold">Catálogo de Produtos</h2>
                <Button>Sincronizar WinThor</Button>
             </div>
             <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Catálogo de Produtos</h2>
                  <p className="text-sm text-slate-500">Busque por nome, código, departamento, fabricante, marca ou EAN.</p>
                </div>
                <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                  <div className="relative w-full lg:w-[420px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      placeholder="Pesquisar no catÃ¡logo ERP..."
                      className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                    {productSearchTerm && (
                      <button
                        onClick={() => setProductSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={bulkImageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleOnDemandImageFolderChange}
                    {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
                  />
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={handleOpenOnDemandImageImport}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Imagens sob demanda
                  </Button>
                  <Button>Sincronizar WinThor</Button>
                </div>
             </div>
             <Card>
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 text-sm">
                  <span className="font-medium text-slate-500">
                    Mostrando {visibleProducts.length} de {filteredProducts.length} produto{filteredProducts.length === 1 ? '' : 's'}
                  </span>
                  {productSearchTerm && (
                    <span className="text-xs text-slate-400">
                      Filtro ativo: <span className="font-semibold text-slate-600">{productSearchTerm}</span>
                    </span>
                  )}
                </div>
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
                      {visibleProducts.map(product => (
                        <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="px-6 py-3 font-mono text-slate-500">{product.winthor_codprod}</td>
                          <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-3">
                             <ProductImage
                               src={product.image_path}
                               alt={product.description}
                               className="w-8 h-8 rounded border border-slate-200"
                               imgClassName="w-full h-full object-cover"
                             />
                             {product.description}
                          </td>
                          <td className="px-6 py-3"><Badge variant="default">{product.department}</Badge></td>
                          <td className="px-6 py-3 text-slate-900 font-bold">R$ {product.price.toFixed(2)}</td>
                          <td className="px-6 py-3 text-right">
                             <Button variant="ghost" className="h-8 text-xs" onClick={() => handleOpenProductEditor(product)}>Editar</Button>
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            Nenhum produto encontrado para a pesquisa informada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
             </Card>
             {visibleProductCount < filteredProducts.length && (
               <div ref={productLoadMoreRef} className="flex items-center justify-center py-4">
                 <span className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow-sm">
                   Carregando mais produtos...
                 </span>
               </div>
             )}
          </div>
        );
      case 'statistics':
        return <AdminStatisticsPage />;
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
                                                      <ProductImage
                                                        src={product.image_path}
                                                        alt={product.description}
                                                        className="w-8 h-8 rounded"
                                                        imgClassName="w-full h-full object-cover"
                                                      />
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
                                                       <Button variant="ghost" className="h-8 text-xs" onClick={() => handleOpenClientEditor(c)}>Editar</Button>
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
                                                <td className="px-6 py-3 text-right"><Button variant="ghost" className="h-8 text-xs" onClick={() => handleOpenAdminEditor(a)}>Editar</Button></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {createdCredential && (
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-sm font-bold text-emerald-800">
                                {createdCredential.type === 'client' ? 'Cliente criado com sucesso.' : 'Usuario criado com sucesso.'}
                            </p>
                            <p className="mt-1 text-sm text-emerald-700">
                                Login: {createdCredential.identifier} | Senha padrao: <span className="font-mono font-bold">{createdCredential.password}</span>
                            </p>
                        </div>
                    )}
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
                                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                          Senha padrao do cliente: <span className="font-mono font-bold">{newClient.default_password}</span>
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">CNPJ</label>
                                          <input required type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.cnpj} onChange={e => setNewClient({...newClient, cnpj: formatCnpj(e.target.value)})} placeholder="00.000.000/0001-00" />
                                      </div>
                                      {isFetchingClientCnpj && <p className="text-xs text-slate-500">Consultando dados do CNPJ...</p>}
                                      {clientCnpjFeedback && (
                                          <p className={`text-xs ${clientCnpjFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                              {clientCnpjFeedback.message}
                                          </p>
                                      )}
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Razão Social</label>
                                          <input required type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.company_name} onChange={e => setNewClient({...newClient, company_name: e.target.value})} placeholder="Nome da empresa" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Nome Fantasia</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.trade_name} onChange={e => setNewClient({...newClient, trade_name: e.target.value})} placeholder="Ex: Supermercado Silva" />
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Email de Acesso</label>
                                          <input required type="email" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} placeholder="compras@cliente.com.br" />
                                      </div>
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Telefone</label>
                                          <input required type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} placeholder="(31) 99999-0000" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Email Secundario</label>
                                          <input type="email" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.email2} onChange={e => setNewClient({...newClient, email2: e.target.value})} placeholder="financeiro@cliente.com.br" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Telefone 2</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.phone2} onChange={e => setNewClient({...newClient, phone2: e.target.value})} placeholder="(31) 3333-0000" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">CEP</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.zip_code} onChange={e => setNewClient({...newClient, zip_code: e.target.value})} placeholder="00000-000" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Rua</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.street} onChange={e => setNewClient({...newClient, street: e.target.value})} placeholder="Rua, avenida..." />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Bairro</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.district} onChange={e => setNewClient({...newClient, district: e.target.value})} placeholder="Bairro" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Numero</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.address_number} onChange={e => setNewClient({...newClient, address_number: e.target.value})} placeholder="123" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Complemento</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.address_complement} onChange={e => setNewClient({...newClient, address_complement: e.target.value})} placeholder="Sala, bloco..." />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Cidade</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.city} onChange={e => setNewClient({...newClient, city: e.target.value})} placeholder="Cidade" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Estado</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.state} onChange={e => setNewClient({...newClient, state: e.target.value})} placeholder="UF" />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Ponto de Referencia</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.reference_point} onChange={e => setNewClient({...newClient, reference_point: e.target.value})} placeholder="Portao lateral, esquina..." />
                                      </div>
                                      <div className="hidden grid gap-2">
                                          <label className="text-sm font-medium">Limite de Credito</label>
                                          <input type="number" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newClient.credit_limit} onChange={e => setNewClient({...newClient, credit_limit: e.target.value})} placeholder="0" />
                                      </div>
                                      <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">Criar Cliente</Button>
                                  </form>
                              ) : (
                                  <form onSubmit={handleCreateAdmin} className="space-y-4">
                                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                          Senha padrao do usuario: <span className="font-mono font-bold">{newAdmin.default_password}</span>
                                      </div>
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
                                      <div className="grid gap-2">
                                          <label className="text-sm font-medium">Telefone</label>
                                          <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={newAdmin.phone} onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})} placeholder="(31) 99999-0000" />
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
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden font-sans text-slate-900">
       {editingClient && (
          <UserFormModal
            title="Editar Cliente"
            subtitle="Atualize os dados cadastrais e de acesso do cliente."
            onClose={() => setEditingClient(null)}
          >
            <form onSubmit={handleSaveClientEdit} className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Senha padrao atual: <span className="font-mono font-bold">{editClientForm.default_password}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input required type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.company_name} onChange={e => setEditClientForm({...editClientForm, company_name: e.target.value})} placeholder="Razao social" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.trade_name} onChange={e => setEditClientForm({...editClientForm, trade_name: e.target.value})} placeholder="Nome fantasia" />
                <input required type="email" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.email} onChange={e => setEditClientForm({...editClientForm, email: e.target.value})} placeholder="Email de acesso" />
                <input type="email" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.email2} onChange={e => setEditClientForm({...editClientForm, email2: e.target.value})} placeholder="Email secundario" />
                <input required type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.phone} onChange={e => setEditClientForm({...editClientForm, phone: e.target.value})} placeholder="Telefone" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.phone2} onChange={e => setEditClientForm({...editClientForm, phone2: e.target.value})} placeholder="Telefone 2" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.zip_code} onChange={e => setEditClientForm({...editClientForm, zip_code: e.target.value})} placeholder="CEP" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.street} onChange={e => setEditClientForm({...editClientForm, street: e.target.value})} placeholder="Rua" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.district} onChange={e => setEditClientForm({...editClientForm, district: e.target.value})} placeholder="Bairro" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.address_number} onChange={e => setEditClientForm({...editClientForm, address_number: e.target.value})} placeholder="Numero" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.address_complement} onChange={e => setEditClientForm({...editClientForm, address_complement: e.target.value})} placeholder="Complemento" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.city} onChange={e => setEditClientForm({...editClientForm, city: e.target.value})} placeholder="Cidade" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.state} onChange={e => setEditClientForm({...editClientForm, state: e.target.value})} placeholder="Estado" />
                <input type="number" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.credit_limit} onChange={e => setEditClientForm({...editClientForm, credit_limit: e.target.value})} placeholder="Limite de credito" />
                <select className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.status} onChange={e => setEditClientForm({...editClientForm, status: e.target.value as Customer['status']})}>
                  <option value="ACTIVE">Ativo</option>
                  <option value="BLOCKED">Bloqueado</option>
                </select>
              </div>
              <input type="text" className="h-10 w-full rounded-md border border-slate-200 px-3 bg-slate-50" value={editClientForm.reference_point} onChange={e => setEditClientForm({...editClientForm, reference_point: e.target.value})} placeholder="Ponto de referencia" />
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setEditingClient(null)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">Salvar Cliente</Button>
              </div>
            </form>
          </UserFormModal>
       )}
       {editingAdmin && (
          <UserFormModal
            title="Editar Usuário"
            subtitle="Atualize os dados e permissões do usuário interno."
            onClose={() => setEditingAdmin(null)}
          >
            <form onSubmit={handleSaveAdminEdit} className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Senha padrao atual: <span className="font-mono font-bold">{editAdminForm.default_password}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input required type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editAdminForm.name} onChange={e => setEditAdminForm({...editAdminForm, name: e.target.value})} placeholder="Nome completo" />
                <input required type="email" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editAdminForm.email} onChange={e => setEditAdminForm({...editAdminForm, email: e.target.value})} placeholder="Email corporativo" />
                <input type="text" className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editAdminForm.phone} onChange={e => setEditAdminForm({...editAdminForm, phone: e.target.value})} placeholder="Telefone" />
                <select className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editAdminForm.role} onChange={e => setEditAdminForm({...editAdminForm, role: e.target.value as AdminUser['role']})}>
                  <option value="ADMIN">Administrador</option>
                  <option value="SALES">Vendas</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="SUPPORT">Suporte</option>
                </select>
                <select className="h-10 rounded-md border border-slate-200 px-3 bg-slate-50" value={editAdminForm.status} onChange={e => setEditAdminForm({...editAdminForm, status: e.target.value as AdminUser['status']})}>
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setEditingAdmin(null)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">Salvar Usuário</Button>
              </div>
            </form>
          </UserFormModal>
       )}
       {editingProduct && (
          <ProductImageEditModal
            product={editingProduct}
            imageDraft={productImageDraft}
            onImageDraftChange={setProductImageDraft}
            onClose={handleCloseProductEditor}
            onSave={handleSaveProductImage}
            onFileChange={handleProductImageFileChange}
          />
       )}
       {onDemandUploadSummary && (
          <OnDemandImageImportModal
            summary={onDemandUploadSummary}
            onClose={handleCloseOnDemandImageImport}
            onConfirm={handleConfirmOnDemandImageImport}
          />
       )}
       <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onNavigateToHome} />
       <main className="flex-1 overflow-auto p-8 relative">
          {renderContent()}
       </main>
    </div>
  );
};

export default AdminDashboard;
