import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Link as LinkIcon, MessageCircle, Plus, Search, Tag, X } from 'lucide-react';
import { Button, Badge } from './ui/Layout';
import { AuthUser } from '../types';
import Logo from "../lib/images/logo1.webp";

const WHATSAPP_PRODUCT_REQUEST_PHONE = '5531997935059';

interface ProductRequestPageProps {
  currentUser: AuthUser | null;
  onNavigateToHome: () => void;
  onNavigateToClient: () => void;
}

const ProductRequestPage: React.FC<ProductRequestPageProps> = ({ currentUser, onNavigateToHome, onNavigateToClient }) => {
  const location = useLocation();
  const initialProductName = useMemo(() => new URLSearchParams(location.search).get('q') || '', [location.search]);
  const [productName, setProductName] = useState(initialProductName);
  const [description, setDescription] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentLink, setCurrentLink] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const userButtonLabel = currentUser ? currentUser.companyName.split(' ')[0] : 'Entrar';

  const addTag = () => {
    const normalizedTag = currentTag.trim();
    if (!normalizedTag || tags.includes(normalizedTag)) {
      setCurrentTag('');
      return;
    }

    setTags((prev) => [...prev, normalizedTag]);
    setCurrentTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const addLink = () => {
    const normalizedLink = currentLink.trim();
    if (!normalizedLink || links.includes(normalizedLink)) {
      setCurrentLink('');
      return;
    }

    setLinks((prev) => [...prev, normalizedLink]);
    setCurrentLink('');
  };

  const removeLink = (linkToRemove: string) => {
    setLinks((prev) => prev.filter((link) => link !== linkToRemove));
  };

  const whatsappMessage = useMemo(() => {
    const sections = [
      'Olá! Quero solicitar um produto que não encontrei no site.',
      productName ? `Produto desejado: ${productName}` : '',
      tags.length > 0 ? `Tags: ${tags.join(', ')}` : '',
      links.length > 0 ? `Links de referência: ${links.join(' | ')}` : '',
      description.trim() ? `Detalhes: ${description.trim()}` : '',
      currentUser ? `Cliente: ${currentUser.companyName}` : '',
    ].filter(Boolean);

    return sections.join('\n');
  }, [currentUser, description, links, productName, tags]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addTag();
    addLink();
    setSubmitted(true);
  };

  const openWhatsapp = () => {
    window.open(
      `https://api.whatsapp.com/send/?phone=${WHATSAPP_PRODUCT_REQUEST_PHONE}&text=${encodeURIComponent(whatsappMessage)}&type=phone_number&app_absent=0`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-[#13733D] text-white shadow-md">
        <div className="container mx-auto flex h-20 items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <Button variant="ghost" onClick={onNavigateToHome} className="rounded-full px-4 pl-0 text-white hover:bg-[#0F5C31]">
              <ArrowLeft className="mr-2 h-5 w-5" /> Voltar
            </Button>

            <div className="flex cursor-pointer items-center gap-1" onClick={onNavigateToHome}>
              <img className="h-12" src={Logo} />
            </div>
          </div>

          <Button onClick={onNavigateToClient} className="rounded-full bg-[#FFC220] font-bold text-slate-900 hover:bg-yellow-400">
            {userButtonLabel}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] bg-white p-8 shadow-sm border border-slate-100">
            <Badge variant="brand" className="border-none bg-[#E7F5EC] px-4 py-1 text-xs uppercase tracking-[0.18em] text-[#13733D]">
              Busca assistida
            </Badge>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900">
              Não encontrou o produto que precisava?
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Preencha o formulário com o nome do item, links de referência e tags que ajudem nosso time a localizar ou cotar o produto para você.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Produto procurado
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    placeholder="Ex.: Sabão líquido 5L neutro"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#13733D] focus:bg-white focus:ring-4 focus:ring-[#13733D]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Tags de apoio
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(event) => setCurrentTag(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="Ex.: limpeza, 5 litros, hospitalar"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#13733D] focus:bg-white focus:ring-4 focus:ring-[#13733D]/10"
                    />
                  </div>
                  <Button type="button" className="h-14 rounded-2xl bg-[#13733D] px-5 text-white hover:bg-[#0F5C31]" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-[#E7F5EC] px-3 py-1.5 text-xs font-bold text-[#13733D]">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Links de referência
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={currentLink}
                      onChange={(event) => setCurrentLink(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          addLink();
                        }
                      }}
                      placeholder="https://exemplo.com/produto"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#13733D] focus:bg-white focus:ring-4 focus:ring-[#13733D]/10"
                    />
                  </div>
                  <Button type="button" className="h-14 rounded-2xl bg-[#13733D] px-5 text-white hover:bg-[#0F5C31]" onClick={addLink}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {links.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {links.map((link) => (
                      <div key={link} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                        <span className="truncate text-slate-600">{link}</span>
                        <button type="button" onClick={() => removeLink(link)} className="text-slate-400 hover:text-slate-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Observações
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Descreva marca, embalagem, volume, aplicação ou qualquer detalhe que ajude nossa equipe."
                  className="min-h-[160px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition-all focus:border-[#13733D] focus:bg-white focus:ring-4 focus:ring-[#13733D]/10"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="rounded-full bg-[#13733D] px-6 text-white hover:bg-[#0F5C31]">
                  Enviar solicitação
                </Button>
                <Button type="button" variant="outline" className="rounded-full border-[#13733D] text-[#13733D] hover:bg-[#EEF8F1]" onClick={openWhatsapp}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar no WhatsApp
                </Button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] bg-[#0F5C31] p-7 text-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Atendimento rápido</p>
              <h2 className="mt-3 text-2xl font-bold">Envie a demanda do jeito que for mais fácil</h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Você pode mandar nome do item, categorias, links de marketplaces, fabricante ou termos que descrevam o produto.
              </p>
              <Button type="button" className="mt-6 rounded-full bg-[#FFC220] text-slate-900 hover:bg-yellow-400" onClick={openWhatsapp}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Abrir WhatsApp
              </Button>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Como preencher</p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-800">1. Informe o nome do item</p>
                  <p className="mt-1">Use o nome comercial, a marca ou o tipo de embalagem que você procura.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-800">2. Adicione tags</p>
                  <p className="mt-1">Inclua palavras-chave como volume, categoria, público, aplicação ou linha do produto.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-800">3. Compartilhe links</p>
                  <p className="mt-1">Links de fabricantes, concorrentes ou referências ajudam o time comercial a identificar o item mais rápido.</p>
                </div>
              </div>
            </div>

            {submitted && (
              <div className="rounded-[28px] border border-[#cfe9d8] bg-[#EEF8F1] p-7 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#13733D]">Solicitação registrada</p>
                <h3 className="mt-3 text-xl font-bold text-slate-900">{productName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sua intenção de busca foi capturada de forma demonstrativa. Se quiser acelerar o atendimento, envie agora a mesma solicitação pelo WhatsApp.
                </p>
                <Button type="button" className="mt-5 rounded-full bg-[#13733D] text-white hover:bg-[#0F5C31]" onClick={openWhatsapp}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar para o WhatsApp
                </Button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ProductRequestPage;
