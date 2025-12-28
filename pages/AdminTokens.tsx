
import React from 'react';

const AdminTokens: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative font-display">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-semibold tracking-tight text-white/90">Uso de Tokens</h2>
                        <p className="text-gray-500 text-sm font-light">Monitoramento detalhado do consumo de IA e custos operacionais.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">download</span>
                            <span>Relatório Detalhado</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Total Tokens */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-primary font-light">token</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Total Tokens (Mês)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">45.2M</h3>
                                <span className="text-primary text-[10px] font-bold flex items-center bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                    <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                    +15%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cost KPI */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-red-400 font-light">monetization_on</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Custo Estimado (OpenAI)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">$ 2,450</h3>
                                <span className="text-red-400 text-[10px] font-bold flex items-center bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
                                    <span className="material-symbols-outlined text-xs mr-0.5">arrow_upward</span>
                                    +12%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Avg per Agent */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-blue-400 font-light">smart_toy</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Média / Agente</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">318k</h3>
                                <span className="text-gray-500 text-[10px] font-bold flex items-center bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                    Estável
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* API Status */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-emerald-400 font-light">api</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Status da API</p>
                            <div className="flex items-center gap-2">
                                <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <h3 className="text-xl font-semibold text-emerald-500">Operacional</h3>
                            </div>
                            <p className="text-[10px] text-gray-500">Latência média: 245ms</p>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consumo Diário</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">Volume de tokens nas últimas 2 semanas</p>
                            </div>
                        </div>
                        <div className="w-full h-64 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                <div className="w-full h-px bg-gray-200 dark:bg-white/5"></div>
                                <div className="w-full h-px bg-gray-200 dark:bg-white/5"></div>
                                <div className="w-full h-px bg-gray-200 dark:bg-white/5"></div>
                                <div className="w-full h-px bg-gray-200 dark:bg-white/5"></div>
                                <div className="w-full h-px bg-gray-200 dark:bg-white/5"></div>
                            </div>
                            {/* SVG Chart */}
                            <svg className="w-full h-full overflow-visible z-10 relative" preserveAspectRatio="none" viewBox="0 0 800 200">
                                <defs>
                                    <linearGradient id="tokenChartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#13ec5b" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,180 C50,160 100,140 150,150 C200,160 250,120 300,100 C350,80 400,90 450,110 C500,100 550,60 600,40 C650,20 700,40 750,30 C780,25 800,20 800,20 V200 H0 Z" fill="url(#tokenChartGradient)"></path>
                                <path d="M0,180 C50,160 100,140 150,150 C200,160 250,120 300,100 C350,80 400,90 450,110 C500,100 550,60 600,40 C650,20 700,40 750,30 C780,25 800,20 800,20" fill="none" stroke="#13ec5b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.8"></path>
                            </svg>
                        </div>
                        <div className="flex justify-between px-2 text-xs font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wide">
                            <span>14 Set</span>
                            <span>16 Set</span>
                            <span>18 Set</span>
                            <span>20 Set</span>
                            <span>22 Set</span>
                            <span>24 Set</span>
                            <span>26 Set</span>
                        </div>
                    </div>

                    {/* Breakdown by Model */}
                    <div className="xl:col-span-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-4 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Consumo por Modelo</h3>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">GPT-4 Turbo</p>
                                    <span className="text-xs font-mono text-slate-500 dark:text-gray-400">65%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">GPT-3.5 Turbo</p>
                                    <span className="text-xs font-mono text-slate-500 dark:text-gray-400">25%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">Claude 3.5 Sonnet</p>
                                    <span className="text-xs font-mono text-slate-500 dark:text-gray-400">10%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-6">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-1">Otimização de Custos</h4>
                                <p className="text-[11px] text-gray-500 leading-relaxed">
                                    O modelo GPT-4 Turbo representa a maior fatia de custo. Considere migrar tarefas simples para o 3.5 Turbo para reduzir custos em até 30%.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTokens;
