
import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative font-display">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-semibold tracking-tight text-white/90">Métricas & Performance</h2>
                        <p className="text-gray-500 text-sm font-light">Visão consolidada de consumo de tokens, receita e retenção de clientes.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">download</span>
                            <span>Exportar Relatório</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Clients KPI */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-primary font-light">groups</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Clientes Ativos</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">142</h3>
                                <span className="text-primary text-[10px] font-bold flex items-center bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                    <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                    +5
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tokens KPI */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-primary font-light">generating_tokens</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Tokens Usados (Total)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">45.2M</h3>
                                <span className="text-primary text-[10px] font-bold flex items-center bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                    <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                    +15%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Revenue KPI */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-primary font-light">attach_money</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Receita de Tokens (Mês)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">R$ 128.4k</h3>
                                <span className="text-primary text-[10px] font-bold flex items-center bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                    <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                    +8.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* LTV KPI */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-primary font-light">savings</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">LTV Médio / Cliente</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">R$ 15.2k</h3>
                                <span className="text-gray-600 text-[10px] font-bold flex items-center bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                    <span className="material-symbols-outlined text-xs mr-0.5">remove</span>
                                    0%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main Chart */}
                    <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tendência de Consumo de Tokens</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">Volume diário de tokens processados pela IA</p>
                            </div>
                            <select className="bg-slate-100 dark:bg-background-dark border-none rounded-lg text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-primary py-2 px-3 outline-none">
                                <option>Últimos 30 dias</option>
                                <option>Último trimestre</option>
                                <option>Este ano</option>
                            </select>
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
                                    <linearGradient id="adminChartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#13ec5b" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 C50,140 100,100 150,110 C200,120 250,90 300,70 C350,50 400,60 450,50 C500,40 550,30 600,20 C650,10 700,30 750,25 C780,22 800,15 800,15 V200 H0 Z" fill="url(#adminChartGradient)"></path>
                                <path d="M0,150 C50,140 100,100 150,110 C200,120 250,90 300,70 C350,50 400,60 450,50 C500,40 550,30 600,20 C650,10 700,30 750,25 C780,22 800,15 800,15" fill="none" stroke="#13ec5b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.8"></path>
                                <circle cx="600" cy="20" fill="#13ec5b" r="3" stroke="#0a0f0d" strokeWidth="1.5"></circle>
                                <circle cx="800" cy="15" fill="#13ec5b" r="3" stroke="#0a0f0d" strokeWidth="1.5"></circle>
                            </svg>
                        </div>
                        <div className="flex justify-between px-2 text-xs font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wide">
                            <span>01 Ago</span>
                            <span>05 Ago</span>
                            <span>10 Ago</span>
                            <span>15 Ago</span>
                            <span>20 Ago</span>
                            <span>25 Ago</span>
                            <span>30 Ago</span>
                        </div>
                    </div>

                    {/* Top Consumers */}
                    <div className="xl:col-span-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-4 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Maiores Consumidores (24h)</h3>
                        <div className="flex flex-col gap-5 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">SolarMinds Ltda.</p>
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">125k Tokens</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-primary to-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 text-right">85% do limite diário</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">Energia Verde Sul</p>
                                    <span className="text-xs font-mono text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">98k Tokens</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 text-right">65% do limite diário</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">SunPower Brasil</p>
                                    <span className="text-xs font-mono text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">45k Tokens</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full opacity-60" style={{ width: '30%' }}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 text-right">30% do limite diário</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">EcoSolar</p>
                                    <span className="text-xs font-mono text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">32k Tokens</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full opacity-40" style={{ width: '22%' }}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 text-right">22% do limite diário</p>
                            </div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
                            <button className="w-full py-2 text-xs font-medium text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <span>Ver todos os limites</span>
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Clients Table */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detalhamento Financeiro por Cliente</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Relação de uso de tokens, gasto mensal e LTV.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-gray-300 hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">Maiores Gastos</button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 transition-colors">Maior Consumo</button>
                            <button className="px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 transition-colors">Recentes</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 font-medium uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4">Tokens Usados (Mês)</th>
                                    <th className="px-6 py-4 text-center">Valor Gasto (Mês)</th>
                                    <th className="px-6 py-4 text-center">LTV (Lifetime Value)</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">SM</div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">SolarMinds Ltda.</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">ID: #C-8492</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs font-bold border border-purple-500/20">Enterprise</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 dark:text-white font-bold">2.4 Milhões</span>
                                            <span className="text-xs text-red-400 flex items-center"><span className="material-symbols-outlined text-[10px]">arrow_upward</span> 12%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-slate-900 dark:text-white font-mono">R$ 4.500,00</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-primary font-bold font-mono">R$ 85.200</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-green-700 dark:text-primary border border-primary/20">
                                            Ativo
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">EV</div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Energia Verde Sul</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">ID: #C-3321</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-bold border border-blue-500/20">Pro</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 dark:text-white font-bold">850k</span>
                                            <span className="text-xs text-green-400 flex items-center"><span class="material-symbols-outlined text-[10px]">arrow_downward</span> 2%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-slate-900 dark:text-white font-mono">R$ 1.700,00</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-primary font-bold font-mono">R$ 12.450</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-green-700 dark:text-primary border border-primary/20">
                                            Ativo
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-xs shadow-lg">IS</div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Instalações Silva</p>
                                                <p className="text-xs text-slate-500 dark:text-gray-400">ID: #C-1102</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-500/10 text-slate-500 rounded text-xs font-bold border border-slate-500/20">Starter</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 dark:text-white font-bold">120k</span>
                                            <span className="text-xs text-slate-500 flex items-center">Estável</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-slate-900 dark:text-white font-mono">R$ 240,00</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-primary font-bold font-mono">R$ 900</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                                            Pendente
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex justify-center">
                        <button className="text-xs font-bold text-primary hover:text-green-400 uppercase tracking-wide">Ver todos os clientes</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
