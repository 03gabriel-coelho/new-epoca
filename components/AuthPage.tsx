
import React, { useState } from 'react';
import { Button } from './ui/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Lock, Building2, Mail, Phone, Key, ShieldCheck, User, Zap } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onNavigateToHome: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onNavigateToHome }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    cnpj: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      
      {/* WALMART STYLE HEADER (Simplified for Auth) */}
      <header className="bg-[#0071DC] text-white shadow-md flex-shrink-0">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
                <span className="text-2xl font-bold tracking-tight">Época</span>
                <Zap className="w-6 h-6 text-[#FFC220] fill-[#FFC220]" />
            </div>
            <Button variant="ghost" onClick={onNavigateToHome} className="text-white hover:bg-[#004F9A] rounded-full">
               <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Loja
            </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Side - Visuals (Blue Theme) */}
        <div className="hidden lg:flex w-1/2 bg-[#0071DC] relative overflow-hidden flex-col justify-between p-12 text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#004F9A] to-[#0071DC] opacity-90"></div>
            
            <div className="relative z-10">
            <div className="w-12 h-12 bg-[#FFC220] rounded-full flex items-center justify-center text-[#0071DC] font-bold text-2xl shadow-lg mb-6">
                <Zap className="w-7 h-7 fill-[#0071DC]" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
                Potencialize o seu <br/> varejo com a Época.
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
                A plataforma B2B mais completa do mercado. Estoque em tempo real, crédito pré-aprovado e logística expressa.
            </p>
            </div>

            <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#FFC220]">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold">Cadastro Seguro</h3>
                    <p className="text-sm text-blue-100">Validação automática de CNPJ e Sintegra.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#FFC220]">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold">Proteção de Dados</h3>
                    <p className="text-sm text-blue-100">Ambiente criptografado e seguro.</p>
                </div>
            </div>
            </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 bg-white overflow-y-auto">
            <div className="max-w-md w-full mx-auto">
                <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {activeTab === 'register' ? 'Criar Conta Empresarial' : 'Acesse sua Conta'}
                </h2>
                <p className="text-slate-500">
                    {activeTab === 'register' ? 'Preencha os dados da sua empresa para começar.' : 'Bem-vindo de volta ao portal B2B.'}
                </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-full mb-8">
                <button 
                    onClick={() => setActiveTab('register')}
                    className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'register' ? 'bg-white text-[#0071DC] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Primeiro Acesso
                </button>
                <button 
                    onClick={() => setActiveTab('login')}
                    className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'login' ? 'bg-white text-[#0071DC] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Já sou Cliente
                </button>
                </div>

                <AnimatePresence mode='wait'>
                {activeTab === 'register' ? (
                    <motion.form 
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleRegisterSubmit}
                    className="space-y-4"
                    >
                        <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700">CNPJ</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" 
                                required 
                                placeholder="00.000.000/0001-00"
                                className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                value={registerData.cnpj}
                                onChange={e => setRegisterData({...registerData, cnpj: e.target.value})}
                            />
                        </div>
                        </div>
                        <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700">Razão Social</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" 
                                required 
                                placeholder="Nome da Empresa"
                                className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                value={registerData.companyName}
                                onChange={e => setRegisterData({...registerData, companyName: e.target.value})}
                            />
                        </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                            <label className="text-sm font-bold text-slate-700">Email Corporativo</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="compras@empresa.com"
                                    className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={registerData.email}
                                    onChange={e => setRegisterData({...registerData, email: e.target.value})}
                                />
                            </div>
                            </div>
                            <div className="grid gap-2">
                            <label className="text-sm font-bold text-slate-700">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                                <input 
                                    type="tel" 
                                    required 
                                    placeholder="(00) 00000-0000"
                                    className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    value={registerData.phone}
                                    onChange={e => setRegisterData({...registerData, phone: e.target.value})}
                                />
                            </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700">Definir Senha de Acesso</label>
                        <div className="relative">
                            <Key className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="password" 
                                required 
                                placeholder="Mínimo 8 caracteres"
                                className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                value={registerData.password}
                                onChange={e => setRegisterData({...registerData, password: e.target.value})}
                            />
                        </div>
                        </div>
                        
                        <Button 
                        type="submit" 
                        className="w-full h-12 text-base rounded-full bg-[#0071DC] hover:bg-[#004F9A] text-white mt-4 font-bold"
                        disabled={isLoading}
                        >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                            Validando CNPJ...
                            </span>
                        ) : "Cadastrar Empresa"}
                        </Button>
                        <p className="text-xs text-center text-slate-400 mt-4">
                        Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                        </p>
                    </motion.form>
                ) : (
                    <motion.form 
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleLoginSubmit}
                    className="space-y-4"
                    >
                        <div className="grid gap-2">
                        <label className="text-sm font-bold text-slate-700">CNPJ ou Email</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="text" 
                                required 
                                placeholder="Digite seu acesso"
                                className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                        </div>
                        <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">Senha</label>
                            <a href="#" className="text-xs font-bold text-[#0071DC] hover:underline">Esqueceu a senha?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                            <input 
                                type="password" 
                                required 
                                placeholder="••••••••"
                                className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#0071DC] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            />
                        </div>
                        </div>
                        
                        <Button 
                        type="submit" 
                        className="w-full h-12 text-base rounded-full bg-[#0071DC] hover:bg-[#004F9A] text-white mt-4 font-bold shadow-md hover:shadow-lg"
                        disabled={isLoading}
                        >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                            Entrando...
                            </span>
                        ) : "Acessar Painel"}
                        </Button>
                    </motion.form>
                )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
