
import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Agents: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative font-display">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">

                {/* Header (Custom for this page) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-3xl font-semibold text-white/90 tracking-tight">Monitoramento</h2>
                        <p className="text-gray-500 text-sm font-light mt-1">Visão geral dos agentes de IA e performance em tempo real.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/create-agent" className="bg-primary hover:bg-primary/90 text-[#0a0f0d] font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all text-sm shadow-lg shadow-primary/5">
                            <span className="material-symbols-outlined text-lg font-light">add</span>
                            <span>Novo Agente</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1 */}
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl p-6 relative overflow-hidden group shadow-sm transition-all hover:border-primary/20">
                        <div className="flex flex-col gap-4 relative z-10 text-left">
                            <div className="flex items-center justify-between">
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Agentes Online</p>
                                <span className="material-symbols-outlined text-xl text-primary font-light">smart_toy</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-semibold text-white/90">142</h3>
                                <span className="text-primary text-[10px] font-bold bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 flex items-center">
                                    <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span> 12%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white">token</span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Tokens Hoje</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">845.2k</h3>
                            <span className="text-primary text-xs font-bold bg-primary/10 px-1.5 py-0.5 rounded flex items-center">
                                <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 5%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full w-[60%]"></div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white">forum</span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Conversas Ativas</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">38</h3>
                            <span className="text-primary text-xs font-bold bg-primary/10 px-1.5 py-0.5 rounded flex items-center">
                                <span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span> 2%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full w-[45%]"></div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-4xl text-slate-900 dark:text-white">check_circle</span>
                        </div>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Taxa de Sucesso</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">18.5%</h3>
                            <span className="text-red-500 text-xs font-bold bg-red-500/10 px-1.5 py-0.5 rounded flex items-center">
                                <span className="material-symbols-outlined text-[12px] mr-0.5">trending_down</span> 1%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full w-[85%]"></div>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Consumo de Tokens (24h)</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm font-body">Análise de tendência de uso da API</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-medium bg-primary text-black rounded hover:bg-green-400 transition shadow-sm">1H</button>
                            <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition">24H</button>
                            <button className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition">7D</button>
                        </div>
                    </div>
                    {/* SVG Chart */}
                    <div className="h-48 w-full relative">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.2"></stop>
                                    <stop offset="100%" stopColor="#13ec5b" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" x1="0" x2="1000" y1="150" y2="150" className="text-slate-500"></line>
                            <line stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" x1="0" x2="1000" y1="100" y2="100" className="text-slate-500"></line>
                            <line stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4" x1="0" x2="1000" y1="50" y2="50" className="text-slate-500"></line>
                            {/* Area Path */}
                            <path d="M0,150 C100,140 200,80 300,90 C400,100 500,40 600,50 C700,60 800,20 900,40 L1000,30 L1000,200 L0,200 Z" fill="url(#chartGradient)"></path>
                            {/* Line Path */}
                            <path d="M0,150 C100,140 200,80 300,90 C400,100 500,40 600,50 C700,60 800,20 900,40 L1000,30" fill="none" stroke="#13ec5b" strokeWidth="1.2" opacity="0.8"></path>
                            {/* Data Point */}
                            <circle className="animate-pulse" cx="1000" cy="30" fill="#13ec5b" r="3" stroke="#0a0f0d" strokeWidth="1"></circle>
                        </svg>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 dark:text-gray-500 mt-2 font-body">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>Agora</span>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-sm">filter_alt</span>
                            <select className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-white/10 text-slate-700 dark:text-white text-sm rounded-lg pl-9 pr-8 py-2 focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-body outline-none">
                                <option>Todos os Status</option>
                                <option>Online</option>
                                <option>Ocupado</option>
                                <option>Offline</option>
                                <option>Erro</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-sm pointer-events-none">expand_more</span>
                        </div>
                        <div className="relative flex-1 md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-sm">sort</span>
                            <select className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-white/10 text-slate-700 dark:text-white text-sm rounded-lg pl-9 pr-8 py-2 focus:ring-1 focus:ring-primary focus:border-primary appearance-none font-body outline-none">
                                <option>Ordenar por: Mais Recente</option>
                                <option>Maior Consumo</option>
                                <option>Menor Taxa de Sucesso</option>
                                <option>Nome (A-Z)</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500 text-sm pointer-events-none">expand_more</span>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" title="Exportar CSV">
                            <span className="material-symbols-outlined">download</span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" title="Visualização em Grade">
                            <span className="material-symbols-outlined">grid_view</span>
                        </button>
                        <button className="p-2 text-primary border border-primary/30 bg-primary/10 rounded-lg transition-colors" title="Visualização em Lista">
                            <span className="material-symbols-outlined">view_list</span>
                        </button>
                    </div>
                </div>

                {/* Agents List Table */}
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-surface-darker text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider font-display">
                                <tr>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5">Status</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5">Agente</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5">Cliente</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5">Consumo (Tokens)</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5 text-center">Conversas</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5 text-center">Sucesso</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/5 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-body text-sm text-slate-600 dark:text-gray-300">
                                {/* Row 1 */}
                                <tr className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                            </span>
                                            <span className="text-slate-900 dark:text-white font-medium">Online</span>
                                        </div>
                                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1 pl-5">Há 2 min</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium">SolarBot Alpha</p>
                                                <p className="text-xs text-slate-400 dark:text-gray-500">ID: #AG-8821</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-slate-700 dark:text-white">EcoEnergy Solutions</p>
                                    </td>
                                    <td className="p-4 w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-700 dark:text-white font-mono">15,420</span>
                                            <span className="text-slate-400 dark:text-gray-500">Alto</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[80%] rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                            5 Ativas
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-primary font-bold">24%</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                            </span>
                                            <span className="text-slate-700 dark:text-gray-300 font-medium">Ocupado</span>
                                        </div>
                                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1 pl-5">Triagem...</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium">LeadGen X</p>
                                                <p className="text-xs text-slate-400 dark:text-gray-500">ID: #AG-3392</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-slate-700 dark:text-white">SunPower Brasil</p>
                                    </td>
                                    <td className="p-4 w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-700 dark:text-white font-mono">8,200</span>
                                            <span className="text-slate-400 dark:text-gray-500">Médio</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-yellow-500 h-full w-[45%] rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-slate-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600/30">
                                            1 Ativa
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-yellow-500 font-bold">18%</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </span>
                                            <span className="text-slate-700 dark:text-gray-300 font-medium">Erro</span>
                                        </div>
                                        <p className="text-xs text-red-500 dark:text-red-400 mt-1 pl-5">Timeout API</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30">
                                                <span className="material-symbols-outlined text-sm">warning</span>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium">Closer Bot V2</p>
                                                <p className="text-xs text-slate-400 dark:text-gray-500">ID: #AG-9912</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-slate-700 dark:text-white">GreenVolt Ltda</p>
                                    </td>
                                    <td className="p-4 w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-700 dark:text-white font-mono">0</span>
                                            <span className="text-slate-400 dark:text-gray-500">Parado</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-red-500 h-full w-[0%] rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-slate-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600/30">
                                            0 Ativas
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-slate-400 dark:text-gray-500 font-bold">--</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:text-green-600 dark:hover:text-green-300 text-xs font-bold uppercase tracking-wide mr-2">Restart</button>
                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 inline-block align-middle">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 4 */}
                                <tr className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                            </span>
                                            <span className="text-slate-900 dark:text-white font-medium">Online</span>
                                        </div>
                                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1 pl-5">Há 45s</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
                                                <span className="material-symbols-outlined text-sm">smart_toy</span>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium">Support AI</p>
                                                <p className="text-xs text-slate-400 dark:text-gray-500">ID: #AG-1029</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-slate-700 dark:text-white">Future Solar</p>
                                    </td>
                                    <td className="p-4 w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-700 dark:text-white font-mono">3,450</span>
                                            <span className="text-slate-400 dark:text-gray-500">Baixo</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[20%] rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                            2 Ativas
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-primary font-bold">95%</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                {/* Row 5 */}
                                <tr className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-400 dark:bg-gray-500"></span>
                                            </span>
                                            <span className="text-slate-500 dark:text-gray-400 font-medium">Offline</span>
                                        </div>
                                        <p className="text-xs text-slate-400 dark:text-gray-600 mt-1 pl-5">Visto há 1h</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-500 border border-gray-200 dark:border-gray-600/30">
                                                <span className="material-symbols-outlined text-sm">power_off</span>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 dark:text-gray-400 font-medium">Night Owl</p>
                                                <p className="text-xs text-slate-400 dark:text-gray-600">ID: #AG-0042</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-slate-500 dark:text-gray-400">SolarMax</p>
                                    </td>
                                    <td className="p-4 w-48">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400 dark:text-gray-500 font-mono">0</span>
                                            <span className="text-slate-400 dark:text-gray-600">--</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-slate-300 dark:bg-gray-600 h-full w-[0%] rounded-full"></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-slate-500 dark:text-gray-500 border border-gray-200 dark:border-gray-700">
                                            0 Ativas
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-slate-400 dark:text-gray-500 font-bold">--</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-surface-darker">
                        <span className="text-sm text-slate-500 dark:text-gray-400">Mostrando <span className="text-slate-900 dark:text-white font-medium">1-5</span> de <span className="text-slate-900 dark:text-white font-medium">142</span> agentes</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-white/10 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 transition-colors">Anterior</button>
                            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-white/10 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">Próximo</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Agents;
