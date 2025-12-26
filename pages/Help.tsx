
import React, { useState } from 'react';
import Header from '../components/Header';

const Help: React.FC = () => {
  const [search, setSearch] = useState('');

  const categories = [
    { title: 'Primeiros Passos', icon: 'rocket_launch', desc: 'Aprenda a configurar seu primeiro agente em minutos.', count: 5 },
    { title: 'Fluxo & I.A.', icon: 'account_tree', desc: 'Dicas avançadas de prompts e encadeamento lógico.', count: 8 },
    { title: 'Faturamento', icon: 'payments', desc: 'Gestão de créditos, tokens e planos de assinatura.', count: 3 },
    { title: 'API & Webhooks', icon: 'code', desc: 'Integre o SolarAI com seu CRM via Webhooks.', count: 12 },
  ];

  const faqs = [
    { q: 'Como os créditos de tokens são descontados?', a: 'Os créditos são descontados com base no modelo de LLM escolhido (GPT-4o, Gemini, etc.) e na quantidade de tokens de entrada e saída por conversa.' },
    { q: 'Posso usar meu próprio número de WhatsApp?', a: 'Sim, através de nossa integração oficial com o WhatsApp Business API ou via Provedores BSP parceiros.' },
    { q: 'O agente pode agendar visitas automaticamente?', a: 'Sim, você pode configurar o Flow Editor para extrair data/hora e enviar um comando para sua agenda do Google ou CRM.' },
    { q: 'Como melhorar a precisão do agente?', a: 'Recomendamos ajustar o System Prompt e utilizar a aba "Logs" para identificar onde o agente está falhando na qualificação.' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth custom-scrollbar">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 flex flex-col gap-12">

        {/* Hero Section */}
        <section className="flex flex-col gap-6">
          <Header
            title="Central de Ajuda"
            subtitle="Estamos aqui para ajudar você a maximizar a conversão dos seus leads de energia solar."
          />

          <div className="w-full max-w-2xl relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="O que você está procurando?"
              className="w-full h-16 pl-14 pr-6 rounded-2xl bg-surface-dark border border-white/5 focus:border-primary/50 text-white outline-none shadow-2xl transition-all placeholder:text-text-secondary/30"
            />
          </div>
        </section>

        {/* Categories Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-surface-dark/40 border border-white/5 p-6 rounded-3xl hover:border-primary/30 transition-all cursor-pointer group hover:-translate-y-1">
              <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-black transition-all">
                <span className="material-symbols-outlined">{cat.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{cat.desc}</p>
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">{cat.count} Artigos</span>
            </div>
          ))}
        </section>

        {/* FAQ & Quick Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <section className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-display">
              <span className="material-symbols-outlined text-primary">quiz</span>
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className="group bg-surface-dark/20 border border-white/5 rounded-2xl overflow-hidden transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
                    <span className="text-white font-bold text-sm md:text-base pr-4">{f.q}</span>
                    <span className="material-symbols-outlined text-text-secondary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-text-secondary text-sm leading-relaxed border-t border-white/5 pt-4">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-display">
              <span className="material-symbols-outlined text-primary">contact_support</span>
              Suporte Direto
            </h2>
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-8 rounded-3xl flex flex-col gap-6">
              <p className="text-white text-sm font-medium leading-relaxed">
                Não encontrou o que precisava? Nossa equipe de especialistas está disponível para ajudar na implementação técnica.
              </p>

              <div className="flex flex-col gap-3">
                <button className="w-full h-12 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  Iniciar Chat Live
                </button>
                <button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Abrir Ticket
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest opacity-60">Status do Suporte</p>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-emerald-500">Online agora (tempo médio 5m)</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Help */}
        <footer className="mt-10 p-10 bg-surface-dark border border-white/5 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-white">Documentação para Desenvolvedores</h3>
            <p className="text-text-secondary text-sm">Integre o SolarAI via REST API e gerencie múltiplos agentes via código.</p>
          </div>
          <button className="px-8 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shrink-0">
            Acessar Docs API
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Help;
