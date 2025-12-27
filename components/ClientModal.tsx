
import React, { useState, useEffect } from 'react';

interface Plan {
    id: string;
    name: string;
    price: number;
}

interface ClientData {
    id?: string;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'pending' | 'blocked';
    plan_id: string;
    image_url?: string;
}

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ClientData) => Promise<void>;
    initialData?: ClientData | null;
    plans: Plan[];
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave, initialData, plans }) => {
    const [formData, setFormData] = useState<ClientData>({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        status: 'active',
        plan_id: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                company_name: '',
                contact_name: '',
                email: '',
                phone: '',
                status: 'active',
                plan_id: plans.length > 0 ? plans[0].id : '',
            });
        }
    }, [initialData, isOpen, plans]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error: any) {
            console.error("Error saving:", error);
            // Alert is already likely handled by parent if it throws with message, 
            // but if not, we show generic. 
            // Better pattern: Parent handles logic. If parent throws, we stay on modal.
            // We can alert here if we want.
            // alert("Erro: " + (error.message || "Verifique o console"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="edit-modal">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-surface-hover/50">
                    <div>
                        <h3 className="text-xl font-bold text-white">{initialData ? 'Editar Cliente' : 'Adicionar Cliente'}</h3>
                        <p className="text-white/40 text-sm">Atualize as informações de cadastro e assinatura.</p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-surface-dark custom-scrollbar">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Empresa</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    type="text"
                                    required
                                    value={formData.company_name}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                    placeholder="Ex: Solar Energy Ltda"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Nome do Contato</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    type="text"
                                    value={formData.contact_name}
                                    onChange={e => setFormData({ ...formData, contact_name: e.target.value })}
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">E-mail</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Ex: contato@empresa.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Telefone</label>
                                <input
                                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Ex: (11) 99999-9999"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Status da Conta</label>
                                <select
                                    className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                >
                                    <option value="active">Ativo</option>
                                    <option value="inactive">Inativo</option>
                                    <option value="pending">Pendente</option>
                                    <option value="blocked">Bloqueado</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-white/5 pt-6">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">workspace_premium</span>
                                Plano e Assinatura
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wide">Plano Atual</label>
                                    <select
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                        value={formData.plan_id}
                                        onChange={e => setFormData({ ...formData, plan_id: e.target.value })}
                                    >
                                        <option value="">Selecione um plano</option>
                                        {plans.map(plan => (
                                            <option key={plan.id} value={plan.id}>{plan.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Future field: Next billing date - leaving out for now as it's not in schema yet */}
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3 bg-surface-hover/30 -mx-6 -mb-6 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-primary text-background-dark hover:bg-green-400 font-bold text-sm shadow-[0_0_15px_rgba(19,236,91,0.2)] transition-all disabled:opacity-50"
                            >
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientModal;
