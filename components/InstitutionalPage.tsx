
import React from 'react';
import { Button, Badge } from './ui/Layout';
import { ArrowLeft, Leaf, ShieldCheck, Target, Heart, History, Play, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockInstitutionalVideo } from '../lib/mockData';
import { AuthUser } from '../types';
import Logo from "../lib/images/logo1.webp";

interface InstitutionalPageProps {
  currentUser: AuthUser | null;
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
}

const InstitutionalPage: React.FC<InstitutionalPageProps> = ({ currentUser, onNavigateToHome, onNavigateToClient }) => {
  const buttonLabel = currentUser ? currentUser.companyName.split(' ')[0] : 'Acessar Portal';

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900">
      {/* WALMART STYLE HEADER */}
      <header className="sticky top-0 z-50 bg-[#be342e] text-white shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <Button variant="ghost" onClick={onNavigateToHome} className="pl-0 hover:bg-[#b70e0c] text-white rounded-full px-4">
               <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
             </Button>
             
             <div className="flex items-center gap-1 cursor-pointer" onClick={onNavigateToHome}>
               <img className="h-12" src={Logo}/>
             </div>
          </div>
          <Button onClick={onNavigateToClient} className="bg-[#FFC220] hover:bg-yellow-400 text-slate-900 rounded-full font-bold">
             {buttonLabel}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#e6f1fc] pt-16 pb-20 rounded-b-[3rem]">
         <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge variant="brand" className="mb-6 bg-white text-[#be342e] border-none shadow-sm px-4 py-1 text-xs uppercase tracking-widest">
                Nossa História
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-[#2e2f32] mb-6 leading-tight">
                Construindo parcerias <br/> sólidas há 30 anos.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Nascemos com o propósito de conectar a indústria ao varejo com eficiência, transparência e tecnologia de ponta.
              </p>
            </motion.div>
         </div>
      </div>

      {/* Mission, Vision, Values */}
      <section className="py-12 relative -mt-16 z-10">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
               <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-14 h-14 mx-auto bg-[#e6f1fc] rounded-full flex items-center justify-center text-[#be342e] mb-6">
                     <Target className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Missão</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    Abastecer o varejo com excelência logística e mix assertivo, impulsionando o crescimento dos nossos clientes.
                  </p>
               </div>
               <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-14 h-14 mx-auto bg-[#FFF3C2] rounded-full flex items-center justify-center text-yellow-700 mb-6">
                     <History className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Visão</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    Ser reconhecida como a distribuidora mais tecnológica e humana do país até 2030.
                  </p>
               </div>
               <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-14 h-14 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mb-6">
                     <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Valores</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">
                    Ética inegociável, Foco no Cliente, Inovação Constante e Respeito às Pessoas.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Institutional Video Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">{mockInstitutionalVideo.title}</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">{mockInstitutionalVideo.description}</p>
                </div>
                
                <div className="max-w-4xl mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl relative group aspect-video">
                {mockInstitutionalVideo.url ? (
                    <div className="relative w-full h-full group">
                    <video 
                        controls 
                        className="w-full h-full object-cover" 
                        poster={mockInstitutionalVideo.thumbnail}
                    >
                        <source src={mockInstitutionalVideo.url} type="video/mp4" />
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-400 flex-col">
                        <Play className="w-16 h-16 opacity-50 mb-4 fill-current" />
                        <p className="font-bold text-lg">Vídeo Institucional</p>
                    </div>
                )}
                </div>
                
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6f1fc] rounded-full text-[#be342e] text-xs font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        Conteúdo gerenciável via Admin
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Responsibility Section */}
      <section className="py-16 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 text-green-600 font-bold uppercase tracking-widest text-xs mb-4">
                     <Leaf className="w-4 h-4" /> Sustentabilidade
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-800 leading-tight">
                    Compromisso com o <br/> <span className="text-[#be342e]">Futuro do Planeta</span>
                  </h2>
                  <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                     <p>
                       Na Época, entendemos que logística gera impacto. Por isso, renovamos nossa frota anualmente para reduzir emissões de CO2 e mantemos um programa rigoroso de reciclagem em nossos CDs.
                     </p>
                     <ul className="space-y-3 mt-4">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-base">Iluminação 100% LED nos armazéns</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-base">Reuso de água da chuva</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-base">Logística reversa de embalagens</span>
                        </li>
                     </ul>
                  </div>
               </div>
               <div className="lg:w-1/2 relative">
                  <div className="relative bg-[#F2F2F2] p-10 rounded-3xl border border-slate-100">
                     <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-slate-800">
                        <ShieldCheck className="w-6 h-6 text-[#be342e]" /> Compliance & Ética
                     </h4>
                     <p className="text-slate-600 mb-6 leading-relaxed">
                        Operamos em total conformidade com a legislação fiscal e trabalhista. Nosso canal de ética é aberto e garantimos transparência total nas negociações B2B.
                     </p>
                     <Button className="w-full bg-[#be342e] hover:bg-[#b70e0c] text-white rounded-full h-12">
                        Baixar Código de Conduta
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer (Matches Landing Page) */}
      <footer className="bg-[#b70e0c] text-white pt-10 pb-6 mt-12">
         <div className="container mx-auto px-4 text-center md:text-left">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h4 className="font-bold mb-4">Ajuda</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li><a href="#" className="hover:underline">Central de Atendimento</a></li>
                        <li><a href="#" className="hover:underline">Política de Trocas</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Serviços</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li><a href="#" className="hover:underline">Cartão Época</a></li>
                        <li><a href="#" className="hover:underline">Vendas Corporativas</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Institucional</h4>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li><a href="#" className="hover:underline">Sobre Nós</a></li>
                        <li><a href="#" className="hover:underline">Relação com Investidores</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Receba Ofertas</h4>
                    <div className="flex bg-white rounded-full p-1">
                        <input type="email" placeholder="Seu e-mail" className="flex-1 bg-transparent px-3 text-slate-900 text-sm focus:outline-none" />
                        <button className="bg-[#be342e] text-white rounded-full px-4 py-1 text-sm font-bold">OK</button>
                    </div>
                </div>
            </div>
            <div className="border-t border-blue-400/30 pt-6 text-xs text-blue-200 flex flex-col md:flex-row justify-between items-center">
                <p>© {new Date().getFullYear()} Época Distribuição. Todos os direitos reservados.</p>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <span>Privacidade</span>
                    <span>Termos de Uso</span>
                </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default InstitutionalPage;
    
