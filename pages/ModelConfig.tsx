
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

const ModelConfig: React.FC = () => {
  const { id } = useParams();
  const [temp, setTemp] = useState(0.3);

  const models = [
    { name: 'GPT-4o', desc: 'Raciocínio complexo. Ideal para negociações.', price: '$5.00', tag: 'Mais Potente', icon: 'bolt' },
    { name: 'GPT-4o-mini', desc: 'Rápido e econômico. Perfeito para triagem.', price: '$0.15', tag: 'Melhor Custo', icon: 'speed', active: true },
    { name: 'Claude 3.5 Sonnet', desc: 'Linguagem natural superior.', price: '$3.00', tag: 'Alta Precisão', icon: 'article' },
  ];

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
          subtitle="Escolha o motor de inteligência e ajuste os parâmetros técnicos."
          tag={{ label: 'Sistema Online', active: true }}
        />

        <section className="mb-10">
          <h2 className="text-white text-xl font-bold mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Selecione o Modelo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model, i) => (
              <div key={i} className={`relative flex flex-col rounded-xl border-2 p-6 transition-all hover:-translate-y-1 cursor-pointer ${model.active ? 'border-primary bg-[#13ec5b]/5' : 'border-[#3b5443] bg-card-dark hover:border-primary/50'}`}>
                {model.active && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[#102216] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span> Selecionado
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
                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-white text-2xl font-bold">{model.price}</span>
                    <span className="text-text-secondary text-xs mb-1">/ 1M tokens</span>
                  </div>
                  <button className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${model.active ? 'bg-primary text-background-dark font-bold' : 'bg-[#28392e] text-white border border-[#3b5443]'}`}>
                    {model.active ? 'Ativo' : 'Selecionar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card-dark border border-[#3b5443] rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-white flex justify-between">Chave de API OpenAI</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined">key</span>
                  <input className="w-full bg-[#111813] border border-[#3b5443] text-white text-sm rounded-lg pl-10 p-3 outline-none" type="password" value="sk-proj-****************************" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 rounded-xl bg-[#111813] border border-[#28392e]">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-white">Temperatura</label>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-sm font-bold border border-primary/20">{temp}</span>
              </div>
              <input
                className="w-full h-2 bg-[#28392e] rounded-lg appearance-none cursor-pointer"
                max="1" min="0" step="0.1" type="range"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-xs text-text-secondary font-medium mt-1">
                <span>Preciso</span>
                <span>Equilibrado</span>
                <span>Criativo</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ModelConfig;
