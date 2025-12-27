
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
  // Mock Data for Hybrid Control Center
  const agents = [
    { id: '1', name: 'Agente Solar01', model: 'GPT-4o', status: 'online', type: 'Triagem' },
    { id: '2', name: 'Suporte Nível 1', model: 'Sonnet 3.5', status: 'online', type: 'Atendimento' },
    { id: '3', name: 'LeadGen WhatsApp', model: 'GPT-4o-mini', status: 'paused', type: 'Prospecção' },
    { id: '4', name: 'Agente Financeiro', model: 'GPT-4o', status: 'offline', type: 'Cobrança' },
    { id: '5', name: 'Onboarding Cliente', model: 'GPT-4o', status: 'online', type: 'Boas-vindas' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative">

      {/* Top Action Button (Floating/Highlight) */}
      <div className="absolute top-8 right-8 z-20">
        <Link to="/create-agent" className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-dark text-[#102216] font-bold py-3 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(19,236,91,0.3)] hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined">add</span>
          Novo Agente
        </Link>
      </div>

      <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-10">

        <Header
          title="Painel de Controle"
          subtitle="Visão geral do seu império de automação."
        // Mobile-only action button (Header handles display logic usually, but we inject mainly for desktop structure above)
        />

        {/* SECTION 1 - O PULSO DO NEGÓCIO (KPIs) */}
        <section>
          <h3 className="text-slate-500 dark:text-white/60 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">ecg_heart</span>
            Pulso do Negócio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* KPI 1: LEADS (Verde) */}
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute -right-4 -top-4 bg-emerald-500/5 size-32 rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
              <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 w-fit rounded-xl">
                  <span className="material-symbols-outlined text-3xl">filter_alt</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-white/60 font-medium text-sm">Total de Leads Hoje</p>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mt-1">42</h2>
                </div>
              </div>
            </div>

            {/* KPI 2: AGENTES (Azul) */}
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute -right-4 -top-4 bg-blue-500/5 size-32 rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 w-fit rounded-xl">
                  <span className="material-symbols-outlined text-3xl">smart_toy</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-white/60 font-medium text-sm">Agentes Ativos</p>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mt-1">3<span className="text-xl text-slate-400 font-normal">/5</span></h2>
                </div>
              </div>
            </div>

            {/* KPI 3: ECONOMIA (Dourado) */}
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
              <div className="absolute -right-4 -top-4 bg-yellow-500/5 size-32 rounded-full group-hover:bg-yellow-500/10 transition-colors"></div>
              <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 w-fit rounded-xl">
                  <span className="material-symbols-outlined text-3xl">savings</span>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-white/60 font-medium text-sm">Economia Gerada</p>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mt-1">R$ 1.250</h2>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2 - MINHA FORÇA DE TRABALHO (GRID) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-500 dark:text-white/60 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">groups</span>
              Minha Força de Trabalho
            </h3>
            <span className="text-xs font-bold bg-white/5 px-3 py-1 rounded-full text-slate-400 border border-white/5">
              5 Robôs Instalados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-0 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group flex flex-col">
                {/* HEADER CARD */}
                <div className="p-6 pb-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-slate-600 dark:text-white/80 border border-white/10 shadow-inner">
                      <span className="material-symbols-outlined">smart_toy</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{agent.name}</h4>
                      <span className="text-[10px] uppercase font-bold tracking-wide text-slate-400 dark:text-white/40">{agent.type}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono border border-gray-200 dark:border-white/10 px-1.5 py-0.5 rounded text-slate-400 dark:text-white/30 truncate max-w-[60px]">
                    {agent.model}
                  </span>
                </div>

                {/* BODY CARD (STATUS) */}
                <div className="p-6 flex-1 flex flex-col items-center justify-center gap-2 min-h-[140px] bg-gray-50/50 dark:bg-black/20">
                  <div className={`relative flex items-center justify-center size-16 rounded-full border-4 transition-all duration-500 ${agent.status === 'online' ? 'border-emerald-500/20 bg-emerald-500/5' :
                      agent.status === 'paused' ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-red-500/20 bg-red-500/5'
                    }`}>
                    {agent.status === 'online' && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
                    )}
                    <span className={`material-symbols-outlined text-3xl ${agent.status === 'online' ? 'text-emerald-500' :
                        agent.status === 'paused' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                      {agent.status === 'online' ? 'bolt' : agent.status === 'paused' ? 'pause' : 'power_off'}
                    </span>
                  </div>
                  <p className={`font-bold uppercase tracking-widest text-xs mt-2 ${agent.status === 'online' ? 'text-emerald-500' :
                      agent.status === 'paused' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                    {agent.status === 'online' ? 'Trabalhando' : agent.status === 'paused' ? 'Pausado' : 'Desligado'}
                  </p>
                </div>

                {/* FOOTER CARD (ACTIONS) */}
                <div className="p-4 grid grid-cols-2 gap-3">
                  <Link to="/monitor" className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-slate-700 dark:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    Monitorar
                  </Link>
                  <Link to={`/agents/${agent.id}`} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors shadow-lg shadow-black/20">
                    <span className="material-symbols-outlined text-sm">settings</span>
                    Configurar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
