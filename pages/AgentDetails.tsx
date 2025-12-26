
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

type TabType = 'geral' | 'modelo' | 'logs';

const AgentDetails: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('geral');
  const [temp, setTemp] = useState(0.3);

  const tabs = [
    { id: 'geral', label: 'Geral', icon: 'tune' },
    { id: 'modelo', label: 'Inteligência & Modelo', icon: 'psychology' },
    { id: 'logs', label: 'Logs & Histórico', icon: 'terminal' },
  ];

  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', desc: 'Raciocínio complexo. Ideal para negociações.', price: '$5.00', icon: 'bolt' },
    { id: 'gpt-4o-mini', name: 'GPT-4o-mini', desc: 'Rápido e econômico. Perfeito para triagem.', price: '$0.15', icon: 'speed', active: true },
    { id: 'claude-3-5', name: 'Claude 3.5 Sonnet', desc: 'Linguagem natural superior.', price: '$3.00', icon: 'article' },
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/" className="text-text-secondary hover:text-primary transition-colors font-medium">Home</Link>
        <span className="text-surface-border material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-white font-medium">Solar Lead Qualifier - Alpha</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-display">Solar Lead Qualifier - Alpha</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              Ativo
            </span>
          </div>
          <p className="text-text-secondary text-sm md:text-base max-w-2xl font-light">
            Agente especializado na triagem inicial de leads inbound via WhatsApp e Webchat.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button className="flex items-center justify-center gap-2 rounded-xl h-12 px-4 bg-surface-dark border border-surface-border hover:bg-[#354a3d] text-white text-sm font-bold transition-all">
            <span className="material-symbols-outlined text-[20px]">pause_circle</span>
            <span className="hidden sm:inline">Pausar Agente</span>
          </button>
          <Link to={`/agents/${id}/flow`} className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-[#0fd650] text-background-dark text-sm font-black transition-all shadow-[0_0_20px_-5px_rgba(19,236,91,0.5)] active:scale-95">
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
            Launch Flow Editor
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-surface-border gap-8 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all relative whitespace-nowrap group ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTab === tab.id ? 'fill' : 'group-hover:scale-110 transition-transform'}`}>
              {tab.icon}
            </span>
            <span className="text-sm font-bold tracking-wide uppercase">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute inset-x-0 -bottom-[2px] h-1 bg-primary blur-[4px] opacity-50"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <main className="flex-1 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* ABA: GERAL */}
        {activeTab === 'geral' && (
          <div className="flex flex-col gap-8 max-w-5xl">
            <section className="bg-surface-dark rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-2xl">badge</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Identidade do Agente</h3>
                  <p className="text-sm text-text-secondary">Defina como seu agente se apresenta aos leads e clientes.</p>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">Nome de Exibição</label>
                    <input className="bg-[#0b140e] border border-surface-border rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="text" defaultValue="Solar Lead Qualifier - Alpha"/>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">Tom de Voz</label>
                    <select className="bg-[#0b140e] border border-surface-border rounded-xl px-4 py-3 text-white focus:border-primary outline-none appearance-none cursor-pointer">
                      <option>Profissional & Consultivo</option>
                      <option>Amigável & Casual</option>
                      <option>Técnico & Direto</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest px-1">Prompt do Sistema (Persona)</label>
                  <div className="relative group">
                    <textarea className="w-full h-48 bg-[#0b140e] border border-surface-border rounded-xl px-5 py-4 text-white focus:border-primary outline-none font-mono text-sm leading-relaxed resize-none transition-all">Você é um consultor especialista em energia solar da SolarAI. Seu objetivo é qualificar leads residenciais perguntando sobre o valor médio da conta de luz, tipo de telhado e localização. Seja sempre cordial, mas mantenha o foco em agendar uma visita técnica.</textarea>
                    <div className="absolute bottom-4 right-4 text-[10px] text-primary font-bold bg-primary/10 px-2 py-1 rounded border border-primary/20 backdrop-blur-md">
                      342 tokens
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary italic px-1">Dica: Descreva o comportamento esperado do agente em detalhes para melhores resultados.</p>
                </div>
              </div>
            </section>
            
            <div className="flex justify-end pt-4 mb-10">
              <button className="flex items-center gap-2 bg-primary text-background-dark font-black py-4 px-10 rounded-xl hover:bg-green-400 transition-all shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95">
                <span className="material-symbols-outlined text-[22px]">save</span>
                Salvar Alterações
              </button>
            </div>
          </div>
        )}

        {/* ABA: INTELIGÊNCIA & MODELO */}
        {activeTab === 'modelo' && (
          <div className="flex flex-col gap-8 max-w-5xl">
            <section className="bg-surface-dark rounded-2xl border border-surface-border p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-2xl">neurology</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Configuração do Motor</h3>
                  <p className="text-sm text-text-secondary">Selecione a LLM que processará as intenções do agente.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${
                      model.active ? 'border-primary bg-primary/5 shadow-[0_0_20px_-10px_rgba(19,236,91,0.2)]' : 'border-surface-border hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-2 rounded-lg ${model.active ? 'bg-primary text-background-dark' : 'bg-white/5 text-white'}`}>
                        <span className="material-symbols-outlined text-2xl">{model.icon}</span>
                      </div>
                      {model.active && <span className="material-symbols-outlined text-primary text-xl">check_circle</span>}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{model.name}</h4>
                      <p className="text-[11px] text-text-secondary leading-tight mt-1">{model.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t border-white/5 pt-8">
                <div className="flex flex-col gap-4">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest">Temperatura ({temp.toFixed(1)})</label>
                  <input 
                    className="w-full h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-primary" 
                    max="1" min="0" step="0.1" type="range" 
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase">
                    <span>Analítico</span>
                    <span>Equilibrado</span>
                    <span>Criativo</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-black text-text-secondary uppercase tracking-widest">OpenAI API Key</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">key</span>
                    <input className="w-full bg-[#0b140e] border border-surface-border rounded-xl px-10 py-3 text-white focus:border-primary outline-none text-sm" type="password" value="sk-proj-****************************" readOnly/>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="flex justify-end pt-4 mb-10">
              <button className="flex items-center gap-2 bg-primary text-background-dark font-black py-4 px-10 rounded-xl hover:bg-green-400 transition-all shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95">
                <span className="material-symbols-outlined text-[22px]">save</span>
                Aplicar Configurações
              </button>
            </div>
          </div>
        )}

        {/* ABA: LOGS & HISTÓRICO */}
        {activeTab === 'logs' && (
          <div className="flex flex-col gap-6 max-w-5xl">
            <section className="bg-surface-dark rounded-2xl border border-surface-border overflow-hidden shadow-xl">
              <div className="p-6 border-b border-surface-border flex items-center justify-between bg-white/5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">event_list</span>
                  Atividade em Tempo Real
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  Monitorando Live
                </div>
              </div>
              
              <div className="flex flex-col divide-y divide-white/5 font-mono text-xs">
                {[
                  { time: '14:55:02', user: 'Roberto M.', event: 'QUALIFICADO', detail: 'Consumo: R$ 850,00 | Tipo: Residencial', color: 'text-primary' },
                  { time: '14:52:10', user: 'Ana Clara', event: 'MENSAGEM', detail: 'Lead perguntou sobre garantias dos painéis.', color: 'text-blue-400' },
                  { time: '14:48:44', user: 'Sistema', event: 'UPDATE', detail: 'Prompt atualizado com sucesso.', color: 'text-purple-400' },
                  { time: '14:45:01', user: 'Joao Paulo', event: 'DESQUALIFICADO', detail: 'Motivo: Localização fora da área de cobertura.', color: 'text-red-400' },
                  { time: '14:39:20', user: 'SolarBot', event: 'START', detail: 'Iniciando nova triagem via WhatsApp.', color: 'text-text-secondary' },
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-4 hover:bg-white/5 transition-colors group">
                    <span className="text-text-secondary opacity-50 shrink-0">{log.time}</span>
                    <span className={`font-bold w-24 shrink-0 truncate ${log.color}`}>{log.event}</span>
                    <span className="text-white font-bold w-28 shrink-0 truncate">{log.user}</span>
                    <span className="text-text-secondary truncate group-hover:text-white transition-colors">{log.detail}</span>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-white/5 flex justify-center">
                <button className="text-xs font-bold text-text-secondary hover:text-primary transition-colors flex items-center gap-2">
                  Ver histórico completo no Monitoramento
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AgentDetails;
