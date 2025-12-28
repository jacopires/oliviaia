
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Header from '../components/Header';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types (Duplicate from AdminClients for now, should centralize later)
interface Plan {
    id: string;
    name: string;
    price: number;
    credits_limit?: number;
}

interface Client {
    id: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending' | 'blocked';
    plan_id: string;
    plan?: Plan;
    image_url?: string;
    created_at: string;
    credits_used?: number;
    last_active_at?: string;
}

// Mock Invoices
const mockInvoices = [
    { id: 'INV-001', date: '2023-10-01', amount: 450.00, status: 'paid' },
    { id: 'INV-002', date: '2023-11-01', amount: 450.00, status: 'paid' },
    { id: 'INV-003', date: '2023-12-01', amount: 450.00, status: 'pending' },
];

const ClientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'financial' | 'settings'>('overview');

    useEffect(() => {
        const fetchClient = async () => {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('clients')
                .select(`*, plan:plans(*)`)
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching client:', error);
                navigate('/admin-clients'); // Redirect if not found
            } else {
                setClient(data as any);
            }
            setLoading(false);
        };

        fetchClient();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
                <span className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    if (!client) return null;

    const creditsLimit = client.plan?.credits_limit || 1000;
    const usagePercentage = Math.round(((client.credits_used || 0) / creditsLimit) * 100);

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark min-h-screen pb-12">

            {/* Top Navigation Bar */}
            <div className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-white/5 py-4 px-8 flex items-center gap-4 sticky top-0 z-20">
                <button
                    onClick={() => navigate('/admin-clients')}
                    className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs">
                        {client.company_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{client.company_name}</h1>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {client.id.split('-')[0]}</p>
                    </div>
                </div>

                <div className="ml-auto flex gap-2">
                    <button className="px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors border border-transparent dark:border-white/5">
                        <span className="material-symbols-outlined text-sm align-middle mr-1">key</span>
                        Resetar Senha
                    </button>
                    <button className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-sm align-middle mr-1">edit</span>
                        Editar
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto w-full p-8 flex flex-col gap-8">

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-6 rounded-2xl relative overflow-hidden">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Status da Conta</p>
                        <div className="flex items-center gap-2">
                            <span className={`size-2.5 rounded-full ${client.status === 'active' ? 'bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
                            <span className="text-xl font-bold text-slate-900 dark:text-white capitalize">{client.status}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Plano Atual</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-slate-900 dark:text-white">{client.plan?.name || 'Sem Plano'}</span>
                            <span className="text-xs text-gray-400">R$ {client.plan?.price}/mês</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Consumo (Mês)</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-slate-900 dark:text-white">{client.credits_used?.toLocaleString() ?? 0}</span>
                            <span className="text-xs text-gray-400">/ {creditsLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${usagePercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 p-6 rounded-2xl">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-2">Última Atividade</p>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {client.last_active_at ? formatDistanceToNow(new Date(client.last_active_at), { addSuffix: true, locale: ptBR }) : 'Nunca'}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-1">{client.last_active_at ? format(new Date(client.last_active_at), "dd/MM/yyyy HH:mm") : '-'}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-200 dark:border-white/5">
                    {[
                        { id: 'overview', label: 'Visão Geral', icon: 'dashboard' },
                        { id: 'usage', label: 'Uso & Tokens', icon: 'data_usage' },
                        { id: 'financial', label: 'Financeiro', icon: 'receipt_long' },
                        { id: 'settings', label: 'Configurações', icon: 'settings' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${activeTab === tab.id
                                    ? 'text-primary'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">business</span>
                                    Dados da Empresa
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Nome da Empresa</span>
                                        <span className="text-base text-slate-800 dark:text-white font-medium mt-1">{client.company_name}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-white/5"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Contato Principal</span>
                                        <span className="text-base text-slate-800 dark:text-white font-medium mt-1">{client.contact_name}</span>
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-white/5"></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">E-mail</span>
                                            <span className="text-sm text-slate-800 dark:text-white font-medium mt-1">{client.email}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Telefone</span>
                                            <span className="text-sm text-slate-800 dark:text-white font-medium mt-1">{client.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'financial' && (
                        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-white/5 text-xs text-gray-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-semibold">Fatura</th>
                                        <th className="p-4 font-semibold">Data</th>
                                        <th className="p-4 font-semibold">Valor</th>
                                        <th className="p-4 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                                    {mockInvoices.map(inv => (
                                        <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-mono text-slate-700 dark:text-gray-300">{inv.id}</td>
                                            <td className="p-4 text-slate-700 dark:text-gray-300">{format(new Date(inv.date), 'dd/MM/yyyy')}</td>
                                            <td className="p-4 font-medium text-slate-900 dark:text-white">R$ {inv.amount.toFixed(2)}</td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                                                    }`}>
                                                    {inv.status === 'paid' ? 'Pago' : 'Pendente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Placeholder for real API */}
                            <div className="p-4 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-white/5">
                                Em breve: Integração com Gateway de Pagamento
                            </div>
                        </div>
                    )}

                    {(activeTab === 'usage' || activeTab === 'settings') && (
                        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-2xl text-center">
                            <div className="size-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-3xl text-gray-400">construction</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Módulo em Desenvolvimento</h3>
                            <p className="text-gray-500 text-sm max-w-md">
                                As métricas detalhadas de uso e configurações avançadas estarão disponíveis na próxima atualização do sistema.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ClientDetails;
