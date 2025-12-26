
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const CreateAgent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex justify-center py-10 px-4 md:px-8 lg:px-40">
      <div className="layout-content-container flex flex-col max-w-[800px] w-full gap-8">
        <div className="flex flex-col gap-3 pb-6 border-b border-slate-200 dark:border-surface-border">
          <Link to="/" className="text-xs font-medium text-slate-500 dark:text-text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar para Agentes
          </Link>

          <Header
            title="Criar Novo Agente"
            subtitle="Configure a identidade básica do seu especialista em triagem solar."
          />
        </div>

        <form className="flex flex-col gap-10" onSubmit={(e) => { e.preventDefault(); navigate('/agents/1'); }}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-slate-700 dark:text-white text-base font-medium leading-normal flex items-center gap-2">
                Nome do Agente <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 material-symbols-outlined">smart_toy</span>
                <input className="w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-[#3b5443] bg-white dark:bg-surface-dark focus:border-primary focus:ring-primary h-14 pl-12 pr-4 outline-none" placeholder="ex: SolarBot Alpha" type="text" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-white text-base font-medium leading-normal">
                Objetivo / Descrição
              </label>
              <textarea className="w-full rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-[#3b5443] bg-white dark:bg-surface-dark focus:border-primary focus:ring-primary min-h-28 p-4 text-base outline-none resize-y" placeholder="ex: Triagem inicial de leads residenciais..."></textarea>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-slate-900 dark:text-white text-lg font-bold">Escolha um ponto de partida</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative flex flex-col p-5 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 cursor-pointer">
                <input defaultChecked className="peer sr-only" name="template" type="radio" value="solar" />
                <div className="mb-3 size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">solar_power</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Template Solar</h3>
                <p className="text-text-secondary text-sm">Scripts pré-configurados para qualificação solar.</p>
              </label>
              <label className="relative flex flex-col p-5 rounded-xl border border-surface-border bg-card-dark cursor-pointer">
                <input className="peer sr-only" name="template" type="radio" value="scratch" />
                <div className="mb-3 size-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">code_blocks</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Começar do Zero</h3>
                <p className="text-text-secondary text-sm">Crie seu agente sem restrições.</p>
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-surface-border">
            <Link to="/" className="w-full sm:w-auto px-6 py-3 rounded-lg border border-transparent text-slate-600 dark:text-text-secondary hover:bg-slate-100 dark:hover:bg-white/5 font-medium text-center transition-colors">Cancelar</Link>
            <button className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-[#102216] font-bold hover:bg-[#0fd650] transition-all flex items-center justify-center gap-2 group">
              Criar Agente
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgent;
