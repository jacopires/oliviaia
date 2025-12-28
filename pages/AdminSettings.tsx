
import React, { useState } from 'react';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 md:p-8 lg:p-10 min-h-screen relative font-display">
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-semibold tracking-tight text-white/90">Configurações Globais</h2>
                        <p className="text-gray-500 text-sm font-light">Gerencie parâmetros do sistema, chaves de API e políticas de segurança.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center gap-2 bg-primary text-background-dark hover:bg-green-400 font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-sm">save</span>
                            <span>Salvar Alterações</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-white/5">
                    {['general', 'ai-models', 'security', 'notifications'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                    ? 'text-primary'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab === 'general' && 'Geral'}
                            {tab === 'ai-models' && 'Modelos IA'}
                            {tab === 'security' && 'Segurança'}
                            {tab === 'notifications' && 'Notificações'}

                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex flex-col gap-6">

                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">Identidade da Plataforma</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nome da Aplicação</label>
                                        <input type="text" defaultValue="SolarAI Dashboard" className="bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email de Suporte</label>
                                        <input type="email" defaultValue="support@solarai.com" className="bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">Manutenção & Acesso</h3>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 h-fit">
                                            <span className="material-symbols-outlined">build</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Modo de Manutenção</h4>
                                            <p className="text-xs text-gray-500 mt-1 max-w-md">Se ativado, impede o acesso de usuários comuns à plataforma, exibindo uma tela de manutenção.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 h-fit">
                                            <span className="material-symbols-outlined">person_add</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Permitir Novos Cadastros</h4>
                                            <p className="text-xs text-gray-500 mt-1 max-w-md">Controla se novos usuários podem se registrar publicamente na plataforma.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Models Settings */}
                    {activeTab === 'ai-models' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">Provedores de IA</h3>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">OpenAI API Key</label>
                                        <div className="flex gap-2">
                                            <input type="password" defaultValue="sk-proj-****************************" className="flex-1 bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm font-mono tracking-widest" />
                                            <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400">Usada para GPT-4o e GPT-3.5 Turbo.</p>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Anthropic API Key</label>
                                        <div className="flex gap-2">
                                            <input type="password" defaultValue="sk-ant-****************************" className="flex-1 bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm font-mono tracking-widest" />
                                            <button className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-gray-500 transition-colors">
                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-400">Usada para Claude 3.5 Sonnet.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">Parâmetros Padrão</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Temperatura Padrão</label>
                                        <input type="number" defaultValue="0.7" step="0.1" min="0" max="1" className="bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Max Tokens (Output)</label>
                                        <input type="number" defaultValue="2048" className="bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm flex flex-col gap-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">Política de Senhas & Sessão</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Expiração de Sessão (minutos)</label>
                                        <input type="number" defaultValue="60" className="bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tentativas de Login (Max)</label>
                                        <input type="number" defaultValue="5" className="bg-slate-50 dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors text-sm" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 mt-2">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 h-fit">
                                            <span className="material-symbols-outlined">lock</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Exigir Autenticação de Dois Fatores (2FA)</h4>
                                            <p className="text-xs text-gray-500 mt-1 max-w-md">Obrigatório para contas de Administrador e Financeiro.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm flex flex-col gap-6">
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logs de Auditoria Recentes</h3>
                                    <button className="text-xs font-bold text-primary hover:text-green-400">Ver Todos</button>
                                </div>
                                <div className="flex flex-col gap-0 border-l border-gray-200 dark:border-white/10 ml-2">
                                    {[
                                        { action: 'Admin Login', user: 'jaco.pires', time: 'Há 10 min', ip: '192.168.1.1' },
                                        { action: 'Config Change', user: 'jaco.pires', time: 'Há 2 horas', ip: '192.168.1.1' },
                                        { action: 'Failed Login', user: 'unknown', time: 'Há 5 horas', ip: '201.32.11.40' },
                                    ].map((log, idx) => (
                                        <div key={idx} className="relative pl-6 pb-6 last:pb-0">
                                            <div className="absolute left-[-5px] top-1 size-2.5 bg-gray-300 dark:bg-gray-600 rounded-full ring-4 ring-background-light dark:ring-surface-dark"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{log.action}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">User: {log.user} • IP: {log.ip}</p>
                                                </div>
                                                <span className="text-[10px] text-gray-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full">{log.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminSettings;
