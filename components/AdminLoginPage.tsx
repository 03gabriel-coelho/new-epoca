
import React, { useState } from 'react';
import { Button } from './ui/Layout';
import { Lock, Server, User, ArrowLeft, Key, ShieldCheck, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from "../lib/images/logo1.webp";

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateToHome: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigateToHome }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    branch: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation of WinThor Authentication API
    setTimeout(() => {
      // Mock validation (accepts any non-empty input for demo purposes)
      if (formData.username && formData.password) {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Credenciais inválidas. Verifique usuário e senha do WinThor.');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
             <img className="h-12" src={Logo}/>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
             <Server className="w-3 h-3" /> Conexão Segura WinThor
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
             <div>
                <h2 className="text-lg font-bold text-slate-800">Acesso Administrativo</h2>
                <p className="text-xs text-slate-500">Backoffice & Gestão ERP</p>
             </div>
             <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                <Lock className="w-5 h-5" />
             </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Filial WinThor</label>
                <div className="relative">
                  <Database className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input 
                    type="number" 
                    placeholder="Ex: 1"
                    className="w-full pl-10 h-11 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all font-mono text-slate-800"
                    value={formData.branch}
                    onChange={e => setFormData({...formData, branch: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Usuário</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="Usuário ERP"
                    className="w-full pl-10 h-11 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase">Senha</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 h-11 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autenticando no Oracle...
                  </span>
                ) : "Acessar Painel"}
              </Button>
            </form>
          </div>
          
          <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
             <Button variant="ghost" onClick={onNavigateToHome} className="text-xs text-slate-500 hover:text-slate-800">
                <ArrowLeft className="w-3 h-3 mr-1" /> Voltar para Loja
             </Button>
          </div>
        </motion.div>

        <p className="text-center text-slate-500 text-xs mt-6">
           Acesso restrito. Todas as atividades são monitoradas.<br/>
           &copy; {new Date().getFullYear()} Época Distribuição.
        </p>

      </div>
    </div>
  );
};

export default AdminLoginPage;
