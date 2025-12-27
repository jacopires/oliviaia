
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard: React.FC = () => {

  // Mock Data for Real-time Feed
  const feedEvents = [
    { id: 1, type: 'success', title: 'Lead Qualificado', desc: 'Construtora XYZ (Agente Solar01)', time: 'há 2 min', icon: 'check_circle' },
    { id: 2, type: 'warning', title: 'Intervenção Humana', desc: 'Cliente pediu desconto (Suporte N1)', time: 'há 15 min', icon: 'warning' },
    { id: 3, type: 'info', title: 'Novo Lead Iniciado', desc: 'Padaria Central (LeadGen)', time: 'há 42 min', icon: 'person' },
    { id: 4, type: 'error', title: 'Falha de Conexão', desc: 'WhatsApp API (Agente Financeiro)', time: 'há 1h', icon: 'error' },
    { id: 5, type: 'success', title: 'Agendamento Confirmado', desc: 'Residencial Green Park (Solar01)', time: 'há 2h', icon: 'event_available' },
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
          title="Inteligência Operacional"
          subtitle="Monitoramento estratégico em tempo real."
        />

        {/* SECTION 1 - O PULSO DO NEGÓCIO (KPIs) - MANTIDO */}
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

        {/* SECTION 2 - INTELIGÊNCIA OPERACIONAL (Colunas) */}
        <section className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[500px]">

          {/* COLUNA ESQUERDA (2/3): Gráfico de Volume */}
          <div className="w-full lg:w-2/3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-8 flex flex-col shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume de Interações</h3>
                <p className="text-sm text-slate-500 dark:text-white/40">Últimos 7 dias</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +24%
                </span>
              </div>
            </div>

            {/* Visual Chart Mock (CSS/SVG) */}
            <div className="flex-1 relative flex items-end justify-between gap-2 px-4 pb-4 border-b border-l border-gray-200 dark:border-white/5 border-dashed">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="w-full h-px bg-slate-500"></div>
                <div className="w-full h-px bg-slate-500"></div>
                <div className="w-full h-px bg-slate-500"></div>
                <div className="w-full h-px bg-slate-500"></div>
                <div className="w-full h-px bg-slate-500"></div>
              </div>

              {/* SVG Area Curve */}
              <svg className="absolute inset-0 h-full w-full overflow-visible z-10" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Path for the line */}
                <path
                  d="M0 350 C 100 320, 200 380, 300 250 S 500 150, 600 200 S 800 50, 1000 80 L 1000 450 L 0 450 Z"
                  fill="url(#gradient)"
                  className="text-emerald-500"
                />
                <path
                  d="M0 350 C 100 320, 200 380, 300 250 S 500 150, 600 200 S 800 50, 1000 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-emerald-500 shadow-lg drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Axis Labels */}
              <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-slate-400 dark:text-white/30 font-mono">
                <span>SEG</span>
                <span>TER</span>
                <span>QUA</span>
                <span>QUI</span>
                <span>SEX</span>
                <span>SÁB</span>
                <span>DOM</span>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA (1/3): Feed em Tempo Real */}
          <div className="w-full lg:w-1/3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-3 bg-red-500"></span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Feed em Tempo Real</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {feedEvents.map((event) => (
                <div key={event.id} className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent dark:hover:border-white/5 cursor-default">
                  <div className={`shrink-0 size-10 rounded-full flex items-center justify-center border ${event.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    event.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      event.type === 'info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                    <span className="material-symbols-outlined text-[20px]">{event.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-bold truncate ${event.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                        event.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          event.type === 'info' ? 'text-blue-600 dark:text-blue-400' :
                            'text-red-500 dark:text-red-400'
                        }`}>{event.title}</p>
                      <span className="text-[10px] text-slate-400 dark:text-white/30 font-mono whitespace-nowrap ml-2">{event.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-white/60 leading-relaxed line-clamp-2">
                      {event.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};

export default Dashboard;
