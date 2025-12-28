
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';

interface WhatsAppInstance {
  id: string;
  instance_name: string;
  instance_id: string;
  status: string;
  phone: string | null;
}

const Integrations: React.FC = () => {
  const [instances, setInstances] = useState<WhatsAppInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [connectingInstanceId, setConnectingInstanceId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Limit Logic (Mocked for now, assuming Starter = 1 free, others paid)
  const FREE_LIMIT = 1;

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    const { data } = await supabase.from('integrations_whatsapp').select('*');
    if (data) setInstances(data);
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      // 1. Create Instance via Edge Function
      const { data, error } = await supabase.functions.invoke('whatsapp-manager', {
        body: { action: 'create-instance', instanceName: newInstanceName }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const { instanceId } = data;
      setConnectingInstanceId(instanceId);

      showToast('Instância criada com sucesso! Gerando QR Code...', 'info');

      // 2. Fetch QR Code immediately
      await fetchQrCode(instanceId);

      // Refresh list
      fetchInstances();

    } catch (err: any) {
      console.error(err);
      showToast('Erro ao criar instância: ' + (err.message || 'Falha desconhecida'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async (instanceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-manager', {
        body: { action: 'get-qrcode', instanceId }
      });

      if (error) throw error;

      if (data?.base64) {
        setQrCodeData(data.base64);
      } else if (data?.code) {
        // Evolution sometimes returns 'code' ? Adjust based on response inspection if needed
        setQrCodeData(data.code);
      }

    } catch (err) {
      console.error(err);
    }
  }

  const handleDelete = async (instanceId: string) => {
    if (!confirm('Tem certeza? Isso irá desconectar o WhatsApp.')) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('whatsapp-manager', {
        body: { action: 'delete-instance', instanceId }
      });
      if (error) throw error;
      showToast('Instância removida com sucesso.', 'success');
      fetchInstances();
    } catch (err) {
      showToast('Erro ao deletar instância.', 'error');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="p-10 max-w-6xl mx-auto flex flex-col gap-8 text-white">
      <Header
        title="Integrações da Plataforma"
        subtitle="Gerencie as conexões dos seus agentes de IA com CRMs e mensageiros."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* WhatsApp Card */}
        <div className={`flex flex-col rounded-xl bg-surface-dark border p-5 gap-5 group relative overflow-hidden transition-all border-primary/20 hover:border-primary/50`}>
          <div className="flex items-start justify-between z-10">
            <div className="size-12 rounded-lg flex items-center justify-center border bg-[#25D366]/20 border-[#25D366]/20 text-[#25D366]">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <div className="px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
              {instances.length > 0 ? `${instances.length} Conectado(s)` : 'Disponível'}
            </div>
          </div>
          <div className="flex flex-col gap-1 z-10">
            <h3 className="text-white text-lg font-display font-bold">WhatsApp Business</h3>
            <p className="text-text-secondary text-sm leading-relaxed">Conecte seus números via QR Code (Evolution API).</p>
          </div>

          {/* Instance List */}
          <div className="flex flex-col gap-2 mt-2">
            {instances.map(inst => (
              <div key={inst.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                <span className="text-xs font-mono">{inst.instance_name}</span>
                <button onClick={() => handleDelete(inst.instance_id)} className="text-red-400 hover:text-red-300">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-end z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 rounded-lg font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
            >
              {instances.length >= FREE_LIMIT ? 'Nova Instância (+R$ 20)' : 'Conectar Novo'}
            </button>
          </div>
        </div>

        {/* Other Placeholders (HubSpot, Google, Salesforce) - Static for now */}
        {/* HubSpot */}
        <div className="flex flex-col rounded-xl bg-surface-dark border border-white/5 p-5 gap-5 group relative overflow-hidden opacity-70">
          <div className="flex items-start justify-between z-10">
            <div className="size-12 rounded-lg flex items-center justify-center border bg-[#FF7A59]/20 border-[#FF7A59]/20 text-[#FF7A59]">
              <span className="material-symbols-outlined text-3xl">hub</span>
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-display font-bold">HubSpot CRM</h3>
            <p className="text-text-secondary text-sm leading-relaxed">Sincronização de contatos (Em breve).</p>
          </div>
          <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-end z-10">
            <button disabled className="h-9 px-4 rounded-lg font-bold text-sm bg-transparent border border-white/10 text-gray-500 cursor-not-allowed">Em Breve</button>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-6 shadow-2xl relative">
            <button onClick={() => { setIsModalOpen(false); setQrCodeData(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white">Conectar WhatsApp</h3>
              <p className="text-gray-400 text-sm mt-1">Escaneie o QR Code com seu celular.</p>
            </div>

            {!qrCodeData ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-left">
                  <label className="text-xs uppercase font-bold text-gray-500">Nome da Instância (Identificação)</label>
                  <input
                    value={newInstanceName}
                    onChange={e => setNewInstanceName(e.target.value)}
                    placeholder="Ex: Vendas 01"
                    className="bg-background-dark border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                  />
                  {instances.length >= FREE_LIMIT && (
                    <p className="text-xs text-yellow-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      Custo adicional: R$ 20,00/mês
                    </p>
                  )}
                </div>
                <button
                  onClick={handleConnect}
                  disabled={loading || !newInstanceName}
                  className="w-full py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-green-400 transition-all disabled:opacity-50"
                >
                  {loading ? 'Gerando QR Code...' : 'Gerar QR Code'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-in fade-in">
                <div className="p-4 bg-white rounded-xl">
                  <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
                </div>
                <p className="text-xs text-center text-gray-400 max-w-xs">
                  Abra o WhatsApp {'>'} Configurações {'>'} Aparelhos Conectados {'>'} Conectar Aparelho
                </p>
                <button
                  onClick={() => { setIsModalOpen(false); setQrCodeData(null); fetchInstances(); }}
                  className="text-primary text-sm font-bold hover:underline"
                >
                  Concluir e Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
