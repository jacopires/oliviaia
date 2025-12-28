
import React from 'react';

const AdminFinancial: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative font-display">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-semibold tracking-tight text-white/90">Financeiro & LTV</h2>
                        <p className="text-gray-500 text-sm font-light">Visão global de receita, MRR e saúde financeira do SaaS.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            <span>Filtrar Período</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-primary text-background-dark hover:bg-green-400 font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-sm">download</span>
                            <span>Exportar CSV</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* MRR */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-primary font-light">payments</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">MRR (Receita Recorrente)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">R$ 128.4k</h3>
                                <span className="text-primary text-[10px] font-bold flex items-center bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                    <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                    +8.2%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ARR */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-purple-400 font-light">calendar_month</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">ARR (Projetado)</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">R$ 1.54M</h3>
                                <span className="text-purple-400 text-[10px] font-bold flex items-center bg-purple-400/10 px-1.5 py-0.5 rounded border border-purple-400/20">
                                    <span className="material-symbols-outlined text-xs mr-0.5">arrow_upward</span>
                                    +12%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Subscribers */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-blue-400 font-light">card_membership</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Assinantes Pagantes</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">142</h3>
                                <span className="text-blue-400 text-[10px] font-bold flex items-center bg-blue-400/10 px-1.5 py-0.5 rounded border border-blue-400/20">
                                    <span className="material-symbols-outlined text-xs mr-0.5">add</span>
                                    3 novos
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Churn Rate */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-orange-400 font-light">group_remove</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Churn Rate</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">1.2%</h3>
                                <span className="text-green-500 text-[10px] font-bold flex items-center bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                    Baixo risco
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Revenue Growth Chart */}
                    <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crescimento de Receita</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">Evolução do MRR nos últimos 6 meses</p>
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
                                    <linearGradient id="financialChartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#13ec5b" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 C100,140 200,130 300,100 C400,70 500,60 600,40 C700,20 750,15 800,10 V200 H0 Z" fill="url(#financialChartGradient)"></path>
                                <path d="M0,150 C100,140 200,130 300,100 C400,70 500,60 600,40 C700,20 750,15 800,10" fill="none" stroke="#13ec5b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.8"></path>
                            </svg>
                        </div>
                        <div className="flex justify-between px-2 text-xs font-medium text-slate-400 dark:text-gray-500 uppercase tracking-wide">
                            <span>Abr</span>
                            <span>Mai</span>
                            <span>Jun</span>
                            <span>Jul</span>
                            <span>Ago</span>
                            <span>Set</span>
                        </div>
                    </div>

                    {/* Plan Distribution */}
                    <div className="xl:col-span-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-4 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Distribuição de Planos</h3>
                        <div className="relative h-48 flex items-center justify-center">
                            {/* Simple Pie Chart Representation */}
                            <div className="size-32 rounded-full border-[12px] border-primary border-r-purple-500 border-b-blue-500 rotate-45 transform bg-transparent relative">
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-xl font-bold text-white">142</span>
                                    <span className="text-[9px] uppercase text-gray-500 tracking-wider">Total</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(19,236,91,0.5)]"></div>
                                    <span className="text-xs text-gray-400">Enterprise</span>
                                </div>
                                <span className="text-xs font-bold text-white">45%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                    <span className="text-xs text-gray-400">Pro Plan</span>
                                </div>
                                <span className="text-xs font-bold text-white">30%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                                    <span className="text-xs text-gray-400">Starter</span>
                                </div>
                                <span className="text-xs font-bold text-white">25%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transações Recentes</h3>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Histórico de pagamentos e renovações.</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 font-medium uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">ID Transação</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Plano</th>
                                    <th className="px-6 py-4 text-center">Valor</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {[
                                    { id: '#TRX-9921', client: 'SolarMinds Ltda.', date: '27 Set, 2023', plan: 'Enterprise', amount: 'R$ 4.500,00', status: 'completed' },
                                    { id: '#TRX-9920', client: 'Energia Verde Sul', date: '26 Set, 2023', plan: 'Pro', amount: 'R$ 1.700,00', status: 'completed' },
                                    { id: '#TRX-9919', client: 'EcoPower Brasil', date: '25 Set, 2023', plan: 'Starter', amount: 'R$ 240,00', status: 'pending' },
                                    { id: '#TRX-9918', client: 'TechSolar Inc.', date: '25 Set, 2023', plan: 'Enterprise', amount: 'R$ 4.500,00', status: 'completed' },
                                ].map((trx, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{trx.id}</td>
                                        <td className="px-6 py-4 font-bold text-white">{trx.client}</td>
                                        <td className="px-6 py-4 text-gray-400">{trx.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${trx.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : trx.plan === 'Pro' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                                                {trx.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-white">{trx.amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${trx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                {trx.status === 'completed' ? 'Pago' : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFinancial;
