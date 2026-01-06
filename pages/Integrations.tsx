import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Calendar, Mail, Search,
  CheckCircle, AlertCircle, RefreshCw, Server, X, Wifi
} from 'lucide-react';
import { fetchInstanceStatus, createInstance, fetchQRCode, logoutInstance, fetchAllInstances } from '../services/evolutionService';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';

// Mock de Logs para visualização
const MOCK_LOGS = [
  { id: 1, integration: 'WhatsApp', event: 'Sincronização de mensagens', status: 'success', time: 'Agora mesmo' },
  { id: 2, integration: 'HubSpot', event: 'Lead atualizado', status: 'success', time: '5 min atrás' },
  { id: 3, integration: 'SMTP', event: 'Falha no envio de relatório', status: 'error', time: '2h atrás' },
];

const Integrations: React.FC = () => {
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'close' | 'connecting' | 'open' | 'not_found'>('loading');
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputName, setInputName] = useState('');
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'input' | 'qr' | 'success' | 'error'>('input');

  const { showToast } = useToast();

  // Discovery
  const [discoveredInstances, setDiscoveredInstances] = useState<any[]>([]);

  // 1. Check Inicial
  useEffect(() => {
    checkSavedInstance();
    loadDiscoveredInstances();
  }, []);

  const loadDiscoveredInstances = async () => {
    const list = await fetchAllInstances();
    if (list && list.length > 0) {
      setDiscoveredInstances(list);
    }
  };

  const checkSavedInstance = async () => {
    // 1. Tenta recuperar do banco
    const { data } = await supabase.from('integrations_whatsapp').select('instance_id').limit(1).single();

    if (data?.instance_id) {
      setInstanceName(data.instance_id);
      refreshStatus(data.instance_id);
    } else {
      // 2. Fallback: REMOVIDO PARA ARQUITETURA SAAS
      // Se não tem no banco, o usuário PRECISA conectar.
      setStatus('not_found');
    }
  };

  // Polling Inteligente
  useEffect(() => {
    let interval: any;
    // Só faz polling se o modal estiver aberto na etapa de QR ou se estivermos monitorando conexão
    if ((isModalOpen && connectionStep === 'qr') || status === 'connecting') {
      const targetName = instanceName || inputName;
      if (targetName) {
        interval = setInterval(() => refreshStatus(targetName, true), 3000);
      }
    }
    return () => clearInterval(interval);
  }, [isModalOpen, connectionStep, status, instanceName, inputName]);

  const refreshStatus = async (name: string, silent = false) => {
    if (!silent) setStatus('loading');
    try {
      const s = await fetchInstanceStatus(name);

      if (s === 'open') {
        setStatus('open');
        setInstanceName(name);

        // SE O MODAL ESTIVER ABERTO -> MOSTRA SUCESSO
        if (isModalOpen && connectionStep !== 'success') {
          setConnectionStep('success');
          showToast('Dispositivo conectado com sucesso!', 'success');
          setTimeout(() => {
            setIsModalOpen(false);
            setConnectionStep('input'); // Reset para próxima vez
          }, 2500);
        }
      } else if (s === 'close') {
        setStatus('close');
        // Se caiu a conexão e não estamos no modal, avisa
        if (status === 'open' && !isModalOpen) {
          showToast('A conexão com o WhatsApp foi perdida.', 'error');
        }
        // Se está no modal esperando, garante o QR
        if (isModalOpen && connectionStep === 'qr' && !qrCode) {
          loadQR(name);
        }
      } else {
        setStatus('not_found');
      }
    } catch (error) {
      console.error("Erro no polling", error);
    }
  };

  const loadQR = async (name: string) => {
    try {
      const qr = await fetchQRCode(name);
      if (qr) setQrCode(qr);
    } catch (e) {
      console.error(e);
      if (isModalOpen) setConnectionStep('error');
    }
  };

  const handleConnect = async () => {
    if (!inputName.trim()) return showToast('Defina um nome para a instância', 'error');
    setIsLoadingAction(true);
    setConnectionStep('qr');
    setQrCode(null);

    // Se já é a mesma instância salva e estamos apenas reconectando
    if (instanceName && inputName === instanceName) {
      handleConnectExisting(inputName);
      return;
    }

    try {
      // 1. Limpa anteriores
      const { error: delErr } = await supabase.from('integrations_whatsapp').delete().neq('instance_id', 'PLACEHOLDER_NEVER_MATCH');
      if (delErr) throw new Error('Falha ao limpar conexões antigas: ' + delErr.message);

      // 2. Cria na Evolution
      const creationData: any = await createInstance(inputName);

      // 3. Salva Ref no Banco (Insert simples pois já limpamos a tabela)
      const { error: upErr } = await supabase.from('integrations_whatsapp').insert({ instance_id: inputName, status: 'created' });
      if (upErr) throw new Error('Falha ao registrar conexão no banco: ' + upErr.message);

      // 4. Inicia processo de QR (Otimizado)
      if (creationData && (creationData.qrcode?.base64 || creationData.qrcode?.code || creationData.base64 || creationData.code)) {
        setQrCode(creationData.qrcode?.base64 || creationData.qrcode?.code || creationData.base64 || creationData.code);
      } else {
        loadQR(inputName);
      }

    } catch (err: any) {
      console.error(err);
      // Se já existe, tenta conectar mesmo assim
      if (err.message && (err.message.includes('exists') || err.message.includes('409'))) {
        handleConnectExisting(inputName);
      } else {
        setConnectionStep('error');
        showToast('Erro ao criar instância: ' + err.message, 'error');
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleConnectExisting = async (name: string) => {
    setIsLoadingAction(true);
    try {
      // 1. Limpa anteriores
      const { error: delErr } = await supabase.from('integrations_whatsapp').delete().neq('instance_id', 'PLACEHOLDER_NEVER_MATCH');
      if (delErr) throw new Error('Falha ao limpar conexões antigas: ' + delErr.message);

      // 2. Salva no Banco apenas
      const { error: upErr } = await supabase.from('integrations_whatsapp').insert({ instance_id: name, status: 'created' });
      if (upErr) throw new Error('Falha ao registrar conexão no banco: ' + upErr.message);

      setInputName(name);

      // 3. Checa status
      const status = await fetchInstanceStatus(name);
      if (status === 'open') {
        setStatus('open');
        setInstanceName(name);
        setConnectionStep('success');
        showToast('Dispositivo conectado com sucesso!', 'success');
        setTimeout(() => {
          setIsModalOpen(false);
          setConnectionStep('input');
        }, 2000);
      } else {
        setConnectionStep('qr');
        loadQR(name);
      }
    } catch (e) {
      showToast('Erro ao conectar existente', 'error');
      setConnectionStep('error');
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDisconnect = async () => {
    if (!instanceName) return;
    if (!confirm('Tem certeza? Isso irá parar a automação.')) return;

    setIsLoadingAction(true);
    try {
      await logoutInstance(instanceName);
      await supabase.from('integrations_whatsapp').delete().eq('instance_id', instanceName);
      setInstanceName(null);
      setQrCode(null);
      setStatus('not_found');
      setInputName('');
      showToast('Desconectado com sucesso.', 'success');
    } catch (e) {
      showToast('Erro ao desconectar', 'error');
    } finally {
      setIsLoadingAction(false);
    }
  };

  // RENDERIZAÇÃO DO MODAL (Nova Lógica Visual)
  const renderModalContent = () => {
    switch (connectionStep) {
      case 'input':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <Server size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {instanceName && inputName === instanceName ? `Reconectar ${instanceName}` : 'Nova Conexão'}
            </h3>

            {/* LISTA DE INSTÂNCIAS DESCOBERTAS */}
            {discoveredInstances.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2 text-left px-2">Instâncias Encontradas:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar bg-black/30 rounded-xl p-2 mb-4">
                  {discoveredInstances.map((inst: any) => (
                    <button
                      key={inst.instance.instanceName}
                      onClick={() => {
                        handleConnectExisting(inst.instance.instanceName);
                      }}
                      className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${inst.instance.status === 'open' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                        <span className="text-white font-mono text-sm">{inst.instance.instanceName}</span>
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-primary">Conectar</span>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mb-2">Ou digite o nome de uma nova:</div>
              </div>
            )}

            <input
              autoFocus
              value={inputName}
              onChange={e => setInputName(e.target.value.replace(/\s/g, '').toLowerCase())}
              placeholder="nome-da-instancia"
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white mb-6 text-center font-mono focus:border-primary outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
            />
            <button
              onClick={handleConnect}
              disabled={isLoadingAction}
              className="w-full py-3 bg-primary hover:bg-emerald-400 text-black font-bold rounded-xl transition-all flex justify-center gap-2 items-center disabled:opacity-50"
            >
              {isLoadingAction ? <RefreshCw className="animate-spin" /> : 'Criar / Conectar'}
            </button>
          </div>
        );

      case 'qr':
        return (
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-white mb-2">Escaneie o QR Code</h3>
            <p className="text-gray-400 mb-6 text-sm">Abra o WhatsApp → Configurações → Aparelhos Conectados</p>

            {qrCode ? (
              <div className="bg-white p-3 rounded-xl relative group mb-6 shadow-2xl shadow-emerald-500/10">
                <img src={qrCode} className="w-64 h-64 object-contain" alt="QR Code" />
                {/* Scan Line Animation */}
                <div className="absolute top-3 left-3 right-3 h-0.5 bg-emerald-500 animate-[scan_2.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(16,185,129,1)]" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-white/5 rounded-xl flex items-center justify-center mb-6 animate-pulse border border-white/10">
                <RefreshCw className="animate-spin text-gray-500" size={32} />
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse">
              <Wifi size={12} /> Aguardando conexão...
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)]"
            >
              <CheckCircle size={48} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Conectado!</h3>
            <p className="text-emerald-400">Sua instância está ativa e pronta.</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Falha na Conexão</h3>
            <p className="text-gray-400 mb-6">Não foi possível gerar o QR Code ou conectar.</p>
            <button
              onClick={() => {
                setConnectionStep('input');
                setInputName('');
                setQrCode(null);
              }}
              className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 transition-all"
            >
              Tentar Novamente
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-dark p-6 lg:p-10 pb-32">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Integrações</h1>
            <p className="text-gray-400 mt-2 text-lg">Gerencie a conexão da Olivia IA com seus canais de comunicação.</p>
          </div>
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
            Ver Documentação
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 sticky top-0 z-20 bg-background-dark/80 backdrop-blur-xl py-4 border-b border-white/5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              placeholder="Buscar integração..."
              className="w-full bg-black/20 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/20 text-sm font-bold">Todos</button>
            <button className="px-4 py-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/10 text-sm font-medium transition-colors">CRM</button>
            <button className="px-4 py-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/10 text-sm font-medium transition-colors">Mensageria</button>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* --- WHATSAPP CARD (ACTIVE) --- */}
          <div className={`relative group overflow-hidden rounded-2xl border p-6 transition-all ${status === 'open' ? 'bg-emerald-500/5 border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]' : 'bg-surface-dark border-white/5 hover:border-white/10'}`}>
            {status === 'open' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />}

            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border ${status === 'open' ? 'bg-[#25D366]/20 text-[#25D366] border-[#25D366]/20' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                <MessageCircle size={28} />
              </div>

              {/* Badge de Status Melhorado */}
              {status === 'open' ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Online</span>
                </div>
              ) : instanceName ? (
                <div className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-red-500/10 text-red-400 border-red-500/20">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Desconectado
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-white/5 text-gray-500 border-white/10">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  Disponível
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp Business</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {status === 'open'
                  ? <>Instância <span className="text-emerald-400 font-mono font-semibold">"{instanceName}"</span> ativa. Olivia está processando mensagens.</>
                  : instanceName
                    ? <>Instância <span className="text-orange-500 font-mono font-semibold">"{instanceName}"</span> desconectada. Reestabeleça a conexão.</>
                    : 'Conecte seu número para permitir que a IA trie leads automaticamente.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-xs font-mono text-gray-500">v2.0 Evolution</span>
              {status === 'open' ? (
                <button
                  onClick={handleDisconnect}
                  disabled={isLoadingAction}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                >
                  {isLoadingAction ? '...' : 'Desconectar'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (instanceName) setInputName(instanceName);
                    setIsModalOpen(true);
                  }}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-lg ${instanceName ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/10' : 'bg-primary hover:bg-emerald-400 text-black shadow-emerald-500/10'}`}
                >
                  {instanceName ? 'Reconectar' : 'Conectar'}
                </button>
              )}
            </div>
          </div>

          {/* --- MOCK CARDS (HubSpot, Calendar, etc) --- */}
          {[
            { title: 'HubSpot CRM', icon: <Server size={28} />, color: 'text-[#FF7A59]', desc: 'Sincronização de contatos e deals.' },
            { title: 'Google Calendar', icon: <Calendar size={28} />, color: 'text-blue-500', desc: 'Agendamento automático de reuniões.' },
            { title: 'RD Station', icon: <Mail size={28} />, color: 'text-indigo-400', desc: 'Automação de marketing e nutrição.' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl bg-surface-dark border border-white/5 p-6 opacity-60 hover:opacity-100 transition-opacity cursor-not-allowed">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color}`}>
                  {item.icon}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-500 uppercase">Em Breve</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}

        </div>

        {/* LOGS TABLE */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Atividade Recente</h2>
            <button className="text-primary text-sm hover:underline">Ver todos</button>
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-dark/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Integração</th>
                  <th className="px-6 py-4 font-medium">Evento</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Horário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {MOCK_LOGS.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${log.integration === 'WhatsApp' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                      {log.integration}
                    </td>
                    <td className="px-6 py-4">{log.event}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {log.status === 'success' ? 'Sucesso' : 'Falha'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-gray-500">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- MODAL DE CONEXÃO --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => connectionStep === 'input' && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121212] border border-white/10 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-2xl"
            >
              {/* Botão fechar (Esconde no sucesso para evitar quebra de fluxo visual) */}
              {connectionStep !== 'success' && (
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setConnectionStep('input');
                    setInputName('');
                    setQrCode(null);
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}

              {renderModalContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Integrations;
