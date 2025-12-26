
import React from 'react';
import Header from '../components/Header';

const AdminClients: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth custom-scrollbar relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full blur-[100px] pointer-events-none"></div>

            <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto w-full relative z-10">

                <Header
                    title="Gerenciamento de Clientes"
                    subtitle="Visualize, monitore e gerencie o acesso de empresas à plataforma de agentes solares."
                    actions={
                        <button className="flex items-center justify-center gap-2 h-12 px-6 bg-primary text-background-dark hover:bg-green-400 active:scale-95 transition-all rounded-lg font-bold shadow-[0_0_20px_rgba(19,236,91,0.2)] shrink-0">
                            <span className="material-symbols-outlined">add</span>
                            <span>Adicionar Novo Cliente</span>
                        </button>
                    }
                />

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col lg:flex-row gap-4 bg-surface-dark/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                    {/* Search */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-black dark:text-white/40 group-focus-within:text-primary transition-colors">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-lg leading-5 bg-white dark:bg-background-dark text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                            placeholder="Buscar por nome, e-mail ou empresa..."
                            type="text"
                        />
                    </div>
                    {/* Filters */}
                    <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 hover:border-primary/50 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">
                            <span className="text-sm font-medium">Status: Todos</span>
                            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 hover:border-primary/50 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">
                            <span className="text-sm font-medium">Plano: Todos</span>
                            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 hover:border-primary/50 text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap">
                            <span className="text-sm font-medium">Ordenação: Recentes</span>
                            <span className="material-symbols-outlined text-[20px]">sort</span>
                        </button>
                    </div>
                </div>

                {/* Main Data Table */}
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-slate-500 dark:text-white/50 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Cliente / Empresa</th>
                                    <th className="px-6 py-4 font-semibold">Plano Atual</th>
                                    <th className="px-6 py-4 font-semibold">Agentes Ativos</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Última Atividade</th>
                                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {/* Row 1 */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                SE
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium text-sm group-hover:text-primary transition-colors">Solar Energy Ltda</p>
                                                <p className="text-slate-500 dark:text-white/40 text-xs">contato@solarenergy.com.br</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                                            Enterprise
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-white/40 text-[18px]">smart_toy</span>
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">12</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-primary text-sm font-medium">Ativo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-white/60 text-sm">
                                        Há 2 horas
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-gray-200 dark:bg-surface-dark border border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9TyS_Vqy_t4yEue0PcyIHuCfDI_P8PZtrmKLmRQS7-dP__4nSPz5uClzrlufPuw_rwItJdqlX3bBk-Sxl-5A2yhzsEJzc_H8Cq2vwuC-soStXmhxaOWqS2yIIzZ40zy4jIziuRs3CtDS8UgO6eeTbMVSCI-Ls3k0fQShfDDgcH6brr5kgTZJ94DlSNpP2ZQesS0ZXD8yzNlagpOis2c39zxoCjxmi78LqKVTCQ00_IV24Eskw7fQRrtHEerKIAk5ONYRE03IQmCV2')" }}></div>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium text-sm group-hover:text-primary transition-colors">GreenTech Solutions</p>
                                                <p className="text-slate-500 dark:text-white/40 text-xs">financeiro@greentech.io</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                            Pro
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-white/40 text-[18px]">smart_toy</span>
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">3</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-yellow-500"></div>
                                            <span className="text-yellow-500 text-sm font-medium">Pagamento Pendente</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-white/60 text-sm">
                                        Ontem, 14:30
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                                                RS
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium text-sm group-hover:text-primary transition-colors">Renova Solar</p>
                                                <p className="text-slate-500 dark:text-white/40 text-xs">admin@renovasolar.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border border-gray-200 dark:border-white/10">
                                            Starter
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-white/40 text-[18px]">smart_toy</span>
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">1</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-primary"></div>
                                            <span className="text-primary text-sm font-medium">Ativo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-white/60 text-sm">
                                        23 Out, 2023
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-gray-200 dark:bg-surface-dark border border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBF64PPGAM4LcQeZzGwbwqATejPYm8EHGAs8G5KdYpxa6rnz5keHYU2R6LtI-YjORUT2JnTBP4vMqpIYsXllYF2KyixBHaOzfJ9Mr4yIZbVKr272LdzpNJyB4pi5jAQaP6iUNeOXcWKvr-ioYYDDhW0Behzupfrbg99oFlb0kgqfTDn7lXg3lD4A2xBx3EkaKUmoseONdX36oOIwpAffnJxu1B4HXgPYkUpr38osSSssLQnbmpf3PzHczBQdyhKN6Q8vjmSW9co-rS5')" }}></div>
                                            </div>
                                            <div>
                                                <p className="text-slate-900 dark:text-white font-medium text-sm group-hover:text-primary transition-colors">EcoPower Brasil</p>
                                                <p className="text-slate-500 dark:text-white/40 text-xs">suporte@ecopower.com.br</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                            Pro
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-slate-400 dark:text-white/40 text-[18px]">smart_toy</span>
                                            <span className="text-slate-700 dark:text-white text-sm font-medium">5</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-red-500"></div>
                                            <span className="text-red-500 text-sm font-medium">Cancelado</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-white/60 text-sm">
                                        01 Set, 2023
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="bg-gray-50 dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
                        <div className="text-xs text-slate-500 dark:text-white/40">
                            Mostrando <span className="text-slate-900 dark:text-white font-medium">1</span> a <span class="text-slate-900 dark:text-white font-medium">4</span> de <span class="text-slate-900 dark:text-white font-medium">28</span> clientes
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-white/10 text-slate-500 dark:text-white/60 text-xs hover:bg-gray-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50" disabled>
                                Anterior
                            </button>
                            <button className="px-3 py-1.5 rounded border border-gray-200 dark:border-white/10 text-slate-500 dark:text-white/60 text-xs hover:bg-gray-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminClients;
