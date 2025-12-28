
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';
import ClientModal from '../components/ClientModal';
import ConfirmModal from '../components/ConfirmModal';
import SuccessModal from '../components/SuccessModal';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types matching DB
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
    plan?: Plan; // Joined
    image_url?: string;
    created_at: string;
    stored_password?: string;
    credits_used?: number;
    last_active_at?: string;
}

const AdminClients: React.FC = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [revealedPasswords, setRevealedPasswords] = useState<{ [key: string]: boolean }>({});

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    // Success Modal State
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [createdPassword, setCreatedPassword] = useState<string>('');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Plans
            const { data: plansData } = await supabase.from('plans').select('*');
            if (plansData) setPlans(plansData);

            // Fetch Clients with Plan info
            const { data: clientsData, error } = await supabase
                .from('clients')
                .select(`
                *,
                plan:plans (
                    id, name, price, credits_limit
                )
            `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (clientsData) setClients(clientsData as any);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setSelectedClient(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (client: Client) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (e: React.MouseEvent, client: Client) => {
        e.stopPropagation(); // Prevent row click
        setClientToDelete(client);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;

        try {
            const { error } = await supabase.functions.invoke('delete-client', {
                body: {
                    id: clientToDelete.id,
                    email: clientToDelete.email
                }
            });

            if (error) throw error;

            await fetchData();
            showToast('Cliente excluído com sucesso.', 'success');
        } catch (error: any) {
            console.error('Erro ao excluir:', error);
            showToast(`Erro ao excluir: ${error.message}`, 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setClientToDelete(null);
        }
    };

    const togglePasswordVisibility = (e: React.MouseEvent, clientId: string) => {
        e.stopPropagation(); // Prevent row click
        setRevealedPasswords(prev => ({
            ...prev,
            [clientId]: !prev[clientId]
        }));
    };

    const handleSave = async (data: any) => {
        setLoading(true);
        const payload = { ...data };
        if (!payload.plan_id) delete payload.plan_id;

        try {
            if (selectedClient) {
                // Update
                const { error } = await supabase
                    .from('clients')
                    .update(payload)
                    .eq('id', selectedClient.id);

                if (error) throw error;
                showToast(`Cliente atualizado com sucesso!`, 'success');
            } else {
                // Insert (Create User via Edge Function)
                const { data: responseData, error: fnError } = await supabase.functions.invoke('create-client', {
                    body: payload
                });

                if (fnError) throw fnError;
                if (responseData.error) throw new Error(responseData.error);

                if (responseData.password) {
                    setCreatedPassword(responseData.password);
                    setIsSuccessModalOpen(true);
                } else if (responseData.message) {
                    showToast(`Cliente criado com sucesso! ${responseData.message}`, 'success');
                }
            }
            await fetchData();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Supabase Error:", error);
            showToast(`Erro ao salvar: ${error.message || error.details || JSON.stringify(error)}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-primary text-primary';
            case 'inactive': return 'bg-red-500 text-red-500';
            case 'pending': return 'bg-yellow-500 text-yellow-500';
            case 'blocked': return 'bg-gray-500 text-gray-500';
            default: return 'bg-white text-white';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Ativo';
            case 'inactive': return 'Inativo';
            case 'pending': return 'Pendente';
            case 'blocked': return 'Bloqueado';
            default: return status;
        }
    };

    // --- UX Metrics Helpers ---

    const getPlanBadgeColor = (planName?: string) => {
        if (!planName) return 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-white/40';
        const name = planName.toLowerCase();
        if (name.includes('enterprise')) return 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20';
        if (name.includes('pro')) return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20';
        return 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-white/60 border border-gray-200 dark:border-white/10';
    };

    const getUsageColor = (percentage: number) => {
        if (percentage > 85) return 'bg-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'; // Upsell
        if (percentage < 30) return 'bg-yellow-400 text-yellow-500'; // Churn Risk
        return 'bg-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]'; // Healthy 30-85%
    };

    const getRelativeTime = (dateString?: string) => {
        if (!dateString) return { text: 'Nunca acessou', isRisk: true };
        const date = new Date(dateString);
        const text = formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
        const daysInactive = differenceInDays(new Date(), date);
        return { text, isRisk: daysInactive > 7 };
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scroll-smooth custom-scrollbar relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full blur-[100px] pointer-events-none"></div>

            <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto w-full relative z-10">

                <Header
                    title="Gerenciamento de Clientes"
                    subtitle="Visualize métricas de saúde, uso e acesse dados críticos da carteira de clientes."
                    actions={
                        <button
                            onClick={handleAddClick}
                            className="flex items-center justify-center gap-2 h-12 px-6 bg-primary text-background-dark hover:bg-green-400 active:scale-95 transition-all rounded-lg font-bold shadow-[0_0_20px_rgba(19,236,91,0.2)] shrink-0"
                        >
                            <span className="material-symbols-outlined">add</span>
                            <span>Adicionar Novo Cliente</span>
                        </button>
                    }
                />

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col lg:flex-row gap-4 bg-surface-dark/50 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
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
                </div>

                {/* Main Data Table */}
                <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden shadow-xl min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 text-slate-500 dark:text-white/50 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-5 font-semibold">Empresa & Plano</th>
                                    <th className="px-6 py-5 font-semibold w-[30%]">Saúde do Uso</th>
                                    <th className="px-6 py-5 font-semibold">Engajamento</th>
                                    <th className="px-6 py-5 font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-white/50">Carregando métricas da carteira...</td>
                                    </tr>
                                ) : clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-white/50">Nenhum cliente ativo encontrado.</td>
                                    </tr>
                                ) : (
                                    clients.map(client => {
                                        // Calculate Usage Metrics
                                        const creditsUsed = client.credits_used || 0;
                                        const limit = client.plan?.credits_limit || 1000;
                                        const usagePercentage = Math.min(100, Math.round((creditsUsed / limit) * 100));
                                        const usageColorClass = getUsageColor(usagePercentage);

                                        // Calculate Activity Metrics
                                        const activityInfo = getRelativeTime(client.last_active_at);

                                        return (
                                            <tr
                                                key={client.id}
                                                onClick={() => navigate(`/admin-clients/${client.id}`)}
                                                className="group border-b border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                                            >

                                                {/* Col 1: Identity & Plan */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-sm uppercase shadow-inner shrink-0">
                                                            {client.company_name.substring(0, 2)}
                                                        </div>
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-slate-900 dark:text-white font-bold text-[15px]">
                                                                    {client.company_name}
                                                                </p>
                                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wide ${getPlanBadgeColor(client.plan?.name)}`}>
                                                                    {client.plan?.name || 'Sem Plano'}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-400 dark:text-white/40 font-medium">
                                                                {client.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Col 2: Usage Health */}
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex justify-between items-end">
                                                            <span className="text-[10px] font-medium text-slate-400 dark:text-white/40 uppercase tracking-wider">Tokens</span>
                                                            <span className={`text-xs font-bold ${usageColorClass.split(' ')[1]}`}>
                                                                {usagePercentage}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${usageColorClass.split(' ')[0]} ${usagePercentage > 85 ? 'animate-pulse' : ''}`}
                                                                style={{ width: `${usagePercentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 dark:text-white/30 truncate">
                                                            {creditsUsed.toLocaleString()} / <span className="text-white/50">{limit.toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Col 3: Engagement (Risk) */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        {activityInfo.isRisk && (
                                                            <span className="material-symbols-outlined text-red-500 text-[18px]">warning</span>
                                                        )}
                                                        <p className={`text-sm font-medium ${activityInfo.isRisk ? 'text-red-500' : 'text-slate-500 dark:text-white/70'}`}>
                                                            {activityInfo.text}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Col 4: Status (Action implicit via row click) */}
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`size-2 rounded-full ${getStatusColor(client.status).split(' ')[0]} ${client.status === 'active' ? 'shadow-[0_0_8px_rgba(19,236,91,0.4)]' : ''}`}></div>
                                                            <span className={`text-xs font-bold uppercase tracking-wide ${getStatusColor(client.status).split(' ')[1]}`}>{getStatusLabel(client.status)}</span>
                                                        </div>

                                                        {/* Small Helper Actions (hidden by default, visible on hover) - Optional, but keeping 'delete' accessible can be useful. 
                                                            Actually user said "Eliminate unnecessary columns", "Remove Actions column". 
                                                            So I will keep it purely implicit or maybe just a very subtle delete inside the modal. 
                                                            For now, adhere to explicit instruction: Remove Actions Column.
                                                        */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={selectedClient}
                plans={plans}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Excluir Cliente"
                message={`Tem certeza que deseja excluir o cliente "${clientToDelete?.company_name}"? Essa ação removerá permanentemente o acesso e os dados do banco de dados.`}
                confirmText="Excluir Cliente"
                cancelText="Cancelar"
                isDestructive={true}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Cliente Criado com Sucesso"
                message="O acesso do cliente foi configurado corretamente. Envie as credenciais abaixo para que ele possa acessar a plataforma."
                password={createdPassword}
            />
        </div>
    );
};

export default AdminClients;
