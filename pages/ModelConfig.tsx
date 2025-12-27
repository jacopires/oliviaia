
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

const ModelConfig: React.FC = () => {
  const { id } = useParams();
  const [temp, setTemp] = useState(0.3);
  const [markup, setMarkup] = useState(50); // Initial 50%

  // Define base prices as numbers for calculation
  const models = [
    { name: 'GPT-4o', desc: 'Raciocínio complexo. Ideal para negociações.', basePrice: 5.00, tag: 'Mais Potente', icon: 'bolt' },
    { name: 'GPT-4o-mini', desc: 'Rápido e econômico. Perfeito para triagem.', basePrice: 0.15, tag: 'Melhor Custo', icon: 'speed', active: true },
    { name: 'Claude 3.5 Sonnet', desc: 'Linguagem natural superior.', basePrice: 3.00, tag: 'Alta Precisão', icon: 'article' },
  ];

  // Helper to format currency
  const formatMoney = (val: number) => `$${val.toFixed(2)}`;

  // Helper to get markup color
  const getMarkupColor = (val: number) => {
    if (val <= 30) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (val <= 100) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'; // Healthy
    return 'text-purple-500 bg-purple-500/10 border-purple-500/20'; // Aggressive
  };

  const calculateClientPrice = (base: number) => {
    return base * (1 + markup / 100);
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-dark scroll-smooth">
      <div className="flex-1 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-2 mb-8 text-sm">
          <Link to="/" className="text-text-secondary hover:text-primary transition-colors font-medium">Home</Link>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">chevron_right</span>
          <Link to={`/agents/${id}`} className="text-text-secondary hover:text-primary transition-colors font-medium">Agente Alpha</Link>
          <span className="material-symbols-outlined text-text-secondary text-[16px]">chevron_right</span>
          <span className="text-primary font-medium">Modelo</span>
        </div>

        <Header
          title="Configuração do Modelo de LLM"
          subtitle="Escolha o motor de inteligência e ajuste a estratégia de precificação."
          tag={{ label: 'Sistema Online', active: true }}
        />

        {/* 1. SELEÇÃO DE MODELO + DATAS FINANCEIROS */}
        <section className="mb-10">
          <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Selecione o Modelo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, i) => {
              const clientPrice = calculateClientPrice(model.basePrice);

              return (
                <div key={i} className={`relative flex flex-col rounded-xl border-2 p-6 transition-all hover:-translate-y-1 cursor-pointer ${model.active ? 'border-primary bg-[#13ec5b]/5' : 'border-[#3b5443] bg-card-dark hover:border-primary/50'}`}>
                  {model.active && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[#102216] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg whitespace-nowrap z-10">
                      <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      Margem Atual: +{markup}%
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-lg ${model.active ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>
                      <span className="material-symbols-outlined text-3xl">{model.icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${model.active ? 'bg-[#28392e] text-primary border-primary/20' : 'bg-[#13ec5b] text-[#102216]'}`}>{model.tag}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-1">{model.name}</h3>
                  <p className="text-text-secondary text-sm mb-4 min-h-[40px]">{model.desc}</p>

                  {/* PRECIFICAÇÃO DETALHADA */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-secondary uppercase">Custo Base</span>
                        <span className="text-slate-400 font-medium">{formatMoney(model.basePrice)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-primary uppercase font-bold">Preço Cliente</span>
                        <span className="text-emerald-400 text-xl font-bold">{formatMoney(clientPrice)}</span>
                      </div>
                    </div>
                    <button className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${model.active ? 'bg-primary text-background-dark font-bold' : 'bg-[#28392e] text-white border border-[#3b5443]'}`}>
                      {model.active ? 'Ativo' : 'Selecionar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. ESTRATÉGIA DE PRECIFICAÇÃO + CONTROLES TÉCNICOS */}
        <section className="bg-card-dark border border-[#3b5443] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* COLUNA ESQUERDA: MARGEM E FINANCEIRO */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500">payments</span>
                  Estratégia de Precificação
                </h3>
                <p className="text-sm text-text-secondary">Defina sua margem de lucro sobre o consumo de API.</p>
              </div>

              <div className="bg-[#111813] border border-[#28392e] rounded-xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-white uppercase tracking-wider">Margem (Markup)</label>
                  <span className={`px-2 py-0.5 rounded text-sm font-bold border ${getMarkupColor(markup)}`}>
                    {markup}%
                  </span>
                </div>

                <input
                  className="w-full h-3 bg-[#28392e] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  max="500" min="0" step="5" type="range"
                  value={markup}
                  onChange={(e) => setMarkup(parseInt(e.target.value))}
                />

                <div className="bg-white/5 rounded-lg p-3 text-sm text-center border border-white/5">
                  <p className="text-text-secondary">
                    Para cada <span className="text-white font-bold">$1.00</span> de custo, seu cliente paga <span className="text-emerald-400 font-bold">${(1 * (1 + markup / 100)).toFixed(2)}</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: TÉCNICO (API & TEMP) */}
            <div className="flex flex-col gap-6 opacity-80 hover:opacity-100 transition-opacity">
              {/* API Key Discreta */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex justify-between">Chave de API OpenAI</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50 material-symbols-outlined text-[18px]">lock</span>
                  <input
                    className="w-full bg-black/20 border border-white/5 text-text-secondary text-sm rounded-lg pl-10 p-2.5 outline-none focus:border-white/10 transition-colors placeholder-white/10"
                    type="password"
                    value="sk-proj-****************************"
                    disabled
                  />
                </div>
              </div>

              {/* Temperatura Reduzida */}
              <div className="flex flex-col gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Criatividade (Temperatura)</label>
                  <span className="text-xs font-mono text-white bg-white/10 px-1.5 rounded">{temp}</span>
                </div>
                <input
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-slate-400"
                  max="1" min="0" step="0.1" type="range"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-text-secondary/50 uppercase font-bold tracking-widest">
                  <span>Preciso</span>
                  <span>Criativo</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default ModelConfig;
