
import React from 'react';

const AdminInfra: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative font-display">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-semibold tracking-tight text-white/90">Infraestrutura</h2>
                        <p className="text-gray-500 text-sm font-light">Monitoramento de servidores, latência e saúde dos serviços.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-all shadow-sm">
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            <span>Atualizar Status</span>
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* System Status */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-emerald-400 font-light">check_circle</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Status do Sistema</p>
                            <div className="flex items-center gap-2">
                                <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <h3 className="text-3xl font-semibold text-emerald-500">Online</h3>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-emerald-500/20 rounded-full mt-2">
                            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    {/* Latency */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-blue-400 font-light">speed</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Latência Média API</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">42ms</h3>
                                <span className="text-green-500 text-[10px] font-bold flex items-center bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                    <span className="material-symbols-outlined text-xs mr-0.5">arrow_downward</span>
                                    -5ms
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* DB Load */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-purple-400 font-light">database</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Carga do Banco</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">24%</h3>
                                <span className="text-gray-500 text-[10px] font-bold flex items-center bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                    Estável
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Errors */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-2 top-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <span className="material-symbols-outlined text-5xl text-orange-400 font-light">bug_report</span>
                        </div>
                        <div className="flex flex-col gap-3 relative z-10">
                            <p className="text-gray-500 font-medium text-[10px] uppercase tracking-[0.2em]">Taxa de Erros (24h)</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">0.05%</h3>
                                <span className="text-green-500 text-[10px] font-bold flex items-center bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                    Normal
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Latency History Chart */}
                    <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Latência em Tempo Real</h3>
                                <p className="text-sm text-slate-500 dark:text-gray-400">Tempo de resposta dos endpoints principais.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs text-green-500 font-bold uppercase tracking-wider">Live</span>
                            </div>
                        </div>
                        <div className="w-full h-64 relative bg-black/20 rounded-xl overflow-hidden border border-white/5">
                            {/* Detailed Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4">
                                <div className="w-full h-px bg-white/5"></div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div className="w-full h-px bg-white/5"></div>
                                <div className="w-full h-px bg-white/5"></div>
                            </div>

                            {/* Simulated Heartbeat Chart */}
                            <svg className="w-full h-full overflow-visible z-10 relative" preserveAspectRatio="none" viewBox="0 0 800 200">
                                <defs>
                                    <linearGradient id="infraChartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"></stop>
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0,100 L50,110 L100,90 L150,100 L200,100 L250,50 L300,120 L350,100 L400,100 L450,110 L500,90 L550,100 L600,100 L650,100 L700,40 L750,110 L800,100 V200 H0 Z" fill="url(#infraChartGradient)"></path>
                                <path d="M0,100 L50,110 L100,90 L150,100 L200,100 L250,50 L300,120 L350,100 L400,100 L450,110 L500,90 L550,100 L600,100 L650,100 L700,40 L750,110 L800,100" fill="none" stroke="#3b82f6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Services Health List */}
                    <div className="xl:col-span-1 bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-4 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Saúde dos Serviços</h3>
                        <div className="flex flex-col gap-3">
                            {[
                                { name: 'Authentication (Supabase)', status: 'Operational', latency: '45ms' },
                                { name: 'Database (PostgreSQL)', status: 'Operational', latency: '120ms' },
                                { name: 'Storage Bucket', status: 'Operational', latency: '80ms' },
                                { name: 'Edge Functions', status: 'Operational', latency: '210ms' },
                                { name: 'OpenAI Gateway', status: 'Degraded Performance', latency: '850ms', warning: true },
                                { name: 'Webhooks Service', status: 'Operational', latency: '60ms' },
                            ].map((service, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white">{service.name}</span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className={`size-1.5 rounded-full ${service.warning ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                                            <span className={`text-[10px] uppercase font-medium ${service.warning ? 'text-orange-400' : 'text-emerald-500'}`}>{service.status}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-mono font-medium ${service.warning ? 'text-orange-400' : 'text-gray-500'}`}>{service.latency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Database & Logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">database</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Uso do Banco de Dados</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 text-gray-400 font-medium uppercase tracking-wide">
                                    <span>Armazenamento (12GB / 50GB)</span>
                                    <span>24%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 text-gray-400 font-medium uppercase tracking-wide">
                                    <span>Memória (RAM)</span>
                                    <span>45%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 text-gray-400 font-medium uppercase tracking-wide">
                                    <span>CPU Usage</span>
                                    <span>12%</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-gray-400">history</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Alertas Recentes</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg items-start">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">error</span>
                                <div>
                                    <p className="text-xs font-bold text-red-400">Falha no Backup Automático</p>
                                    <p className="text-[10px] text-red-300/70 mt-0.5">Há 2 horas • Database Cluster 1</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg items-start">
                                <span className="material-symbols-outlined text-yellow-500 text-sm mt-0.5">warning</span>
                                <div>
                                    <p className="text-xs font-bold text-yellow-400">Latência Alta no OpenAI Gateway</p>
                                    <p className="text-[10px] text-yellow-300/70 mt-0.5">Há 45 min • API Gateway</p>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg items-start">
                                <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">info</span>
                                <div>
                                    <p className="text-xs font-bold text-blue-400">Deploy da v2.4.1 concluído</p>
                                    <p className="text-[10px] text-blue-300/70 mt-0.5">Há 6 horas • CI/CD Pipeline</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminInfra;
