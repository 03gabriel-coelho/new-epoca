import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Building2, Mail, Phone, Key, ShieldCheck, User, Zap } from 'lucide-react';
import { loginStoredUser, registerStoredUser } from '../lib/authStorage';
import { AuthUser } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateToHome: () => void;
}

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

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onNavigateToHome }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);
  const [cnpjFeedback, setCnpjFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const lastFetchedCnpjRef = useRef<string>('');

  const [registerData, setRegisterData] = useState({
    cnpj: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  useEffect(() => {
    if (activeTab !== 'register') {
      return;
    }

    const cnpjDigits = getDigits(registerData.cnpj);

    if (cnpjDigits.length !== 14) {
      setIsFetchingCnpj(false);
      setCnpjFeedback(null);
      if (cnpjDigits.length === 0) {
        lastFetchedCnpjRef.current = '';
      }
      return;
    }

    if (lastFetchedCnpjRef.current === cnpjDigits) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsFetchingCnpj(true);
      setCnpjFeedback(null);

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

        setRegisterData(prev => ({
          ...prev,
          companyName: companyName || prev.companyName,
          email: data.email || prev.email,
          phone: phone || prev.phone,
        }));
        lastFetchedCnpjRef.current = cnpjDigits;
        setCnpjFeedback({
          type: 'success',
          message: 'Dados da empresa encontrados e preenchidos automaticamente.',
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        lastFetchedCnpjRef.current = '';
        setCnpjFeedback({
          type: 'error',
          message: error instanceof Error ? error.message : 'Falha ao consultar o CNPJ.',
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsFetchingCnpj(false);
        }
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [activeTab, registerData.cnpj]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);

    if (registerData.password !== registerData.confirmPassword) {
      setAuthFeedback({ type: 'error', message: 'A confirmacao de senha nao confere.' });
      return;
    }

    if (registerData.password.length < 8) {
      setAuthFeedback({ type: 'error', message: 'A senha deve ter pelo menos 8 caracteres.' });
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => {
      try {
        const user = registerStoredUser({
          id: '123',
          cnpj: registerData.cnpj,
          companyName: registerData.companyName,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password,
          createdAt: new Date().toISOString(),
        });

        setAuthFeedback({ type: 'success', message: 'Cadastro salvo localmente e sessao iniciada.' });
        setIsLoading(false);
        onLoginSuccess(user);
      } catch (error) {
        setAuthFeedback({
          type: 'error',
          message: error instanceof Error ? error.message : 'Nao foi possivel concluir o cadastro.',
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback(null);
    setIsLoading(true);

    window.setTimeout(() => {
      try {
        const user = loginStoredUser(loginData.identifier, loginData.password);
        setAuthFeedback({ type: 'success', message: 'Login realizado com sucesso.' });
        setIsLoading(false);
        onLoginSuccess(user);
      } catch (error) {
        setAuthFeedback({
          type: 'error',
          message: error instanceof Error ? error.message : 'Falha ao fazer login.',
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <header className="bg-[#be342e] text-white shadow-md flex-shrink-0">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
            <img className="h-12" src="./lib/images/logo1.webp" />
          </div>
          <Button variant="ghost" onClick={onNavigateToHome} className="text-white hover:bg-[#b70e0c] rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Loja
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="hidden lg:flex w-1/2 bg-[#be342e] relative overflow-hidden flex-col justify-between p-12 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#b70e0c] to-[#be342e] opacity-90"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#FFC220] rounded-full flex items-center justify-center text-[#be342e] font-bold text-2xl shadow-lg mb-6">
              <Zap className="w-7 h-7 fill-[#be342e]" />
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Potencialize o seu <br /> varejo com a Epoca.
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              A plataforma B2B mais completa do mercado. Estoque em tempo real, credito pre-aprovado e logistica expressa.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#FFC220]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Cadastro Seguro</h3>
                <p className="text-sm text-blue-100">Validacao automatica de CNPJ e Sintegra.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[#FFC220]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">Protecao de Dados</h3>
                <p className="text-sm text-blue-100">Ambiente criptografado e seguro.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-12 lg:p-24 bg-white overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {activeTab === 'register' ? 'Criar Conta Empresarial' : 'Acesse sua Conta'}
              </h2>
              <p className="text-slate-500">
                {activeTab === 'register' ? 'Preencha os dados da sua empresa para comecar.' : 'Bem-vindo de volta ao portal B2B.'}
              </p>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-full mb-8">
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'register' ? 'bg-white text-[#be342e] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Primeiro Acesso
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'login' ? 'bg-white text-[#be342e] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Ja sou Cliente
              </button>
            </div>

            <AnimatePresence mode="wait">
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
                        className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={registerData.cnpj}
                        onChange={e => setRegisterData({ ...registerData, cnpj: formatCnpj(e.target.value) })}
                      />
                    </div>
                    {isFetchingCnpj && <p className="text-xs text-slate-500">Consultando dados do CNPJ...</p>}
                    {cnpjFeedback && (
                      <p className={`text-xs ${cnpjFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {cnpjFeedback.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-slate-700">Razao Social</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Nome da Empresa"
                        className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={registerData.companyName}
                        onChange={e => setRegisterData({ ...registerData, companyName: e.target.value })}
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
                          className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          value={registerData.email}
                          onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
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
                          className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          value={registerData.phone}
                          onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
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
                        placeholder="Minimo 8 caracteres"
                        className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={registerData.password}
                        onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-slate-700">Confirmar Senha</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Repita sua senha"
                        className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={registerData.confirmPassword}
                        onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  {authFeedback && activeTab === 'register' && (
                    <p className={`text-xs ${authFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {authFeedback.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base rounded-full bg-[#be342e] hover:bg-[#b70e0c] text-white mt-4 font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        Validando CNPJ...
                      </span>
                    ) : 'Cadastrar Empresa'}
                  </Button>

                  <p className="text-xs text-center text-slate-400 mt-4">
                    Ao se cadastrar, voce concorda com nossos Termos de Uso e Politica de Privacidade.
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
                        className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={loginData.identifier}
                        onChange={e => setLoginData({ ...loginData, identifier: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Senha</label>
                      <a href="#" className="text-xs font-bold text-[#be342e] hover:underline">Esqueceu a senha?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="password"
                        required
                        placeholder="Senha cadastrada"
                        className="w-full pl-11 h-11 rounded-full border border-slate-300 focus:border-[#be342e] focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={loginData.password}
                        onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  {authFeedback && activeTab === 'login' && (
                    <p className={`text-xs ${authFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {authFeedback.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base rounded-full bg-[#be342e] hover:bg-[#b70e0c] text-white mt-4 font-bold shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        Entrando...
                      </span>
                    ) : 'Acessar Painel'}
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
