import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';
import {
  updateChatProfile,
  sendTextMessage,
  syncMessages,
  fetchInstanceStatus,
  configureWebhook,
  fetchWebhookConfig
} from '../services/evolutionService';
import {
  Send, Smile, Paperclip, MoreVertical, RefreshCw, Search,
  Camera, Pencil, Check, MessageSquare
} from 'lucide-react';

// Tipagem
interface Message {
  id: string;
  chat_id: string;
  sender: 'ai' | 'user' | 'agent';
  text: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  whatsapp_id: string;
  name: string;
  avatar_url?: string;
  status: string;
  last_message_at: string;
}

// Fallback de Instância (Prioriza o .env)
const ENV_INSTANCE_NAME = import.meta.env.VITE_EVOLUTION_INSTANCE_NAME;

const Monitor: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Controle
  // Sync removido - sistema 100% sob demanda
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSyncingProfiles, setIsSyncingProfiles] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');
  const [instanceName, setInstanceName] = useState<string | null>(null);

  // Edição de Perfil
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const { showToast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 1. Setup Inicial
  // 1. Setup Inicial com Validação de Instância
  // 1. Setup Inicial com Validação de Instância
  useEffect(() => {
    initInstance();

    // Listener para detectar conexão em tempo real (ex: conectou na outra aba)
    const sub = supabase.channel('monitor_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, (payload) => {
        console.log('⚡ [Monitor] Realtime Update (chats):', payload);
        fetchChats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        console.log('⚡ [Monitor] Realtime Update (messages):', payload);
        // Opcional: atualizar mensagens se o chat estiver aberto
      })
      .subscribe((status) => {
        console.log('🔌 [Monitor] Status Realtime:', status);
      });

    return () => { supabase.removeChannel(sub); };
  }, []);

  const initInstance = async () => {
    console.log('🚀 [Monitor] Iniciando busca de instância...');
    let target = null;

    // 1. PRIORIDADE: Banco de Dados (Intenção do Usuário)
    try {
      const { data, error } = await supabase.from('integrations_whatsapp').select('instance_id').limit(1).single();
      console.log('📊 [Monitor] Resultado DB:', { data, error });
      if (data?.instance_id) {
        target = data.instance_id;
      }
    } catch (e) {
      console.error('❌ [Monitor] Erro ao ler banco:', e);
    }

    // 3. Define State
    if (target) {
      console.log('✅ [Monitor] Instância encontrada:', target);
      setInstanceName(target);
      fetchChats();

      // --- AUTO-CHECK WEBHOOK ---
      checkAndFixWebhook(target);

    } else {
      console.warn('⚠️ [Monitor] Nenhuma instância conectada!');
      setInstanceName(null);
      showToast('Nenhuma instância conectada. Vá em Integrações.', 'error');
    }
  };

  const checkAndFixWebhook = async (name: string) => {
    try {
      console.log('🕵️ [Monitor] Verificando integridade do Webhook...');
      const config = await fetchWebhookConfig(name);
      const targetUrl = 'https://kcerrbzfxutquhqbnybo.supabase.co/functions/v1/evolution-webhook';

      const needsConfig = !config?.webhook?.enabled || config?.webhook?.url !== targetUrl;

      if (needsConfig) {
        console.warn('⚠️ [Monitor] Webhook desconfigurado ou incorreto. Corrigindo...');
        await configureWebhook(name, targetUrl);
        console.log('✅ [Monitor] Webhook blindado com sucesso.');
        showToast('Sistema de mensagens reconectado automaticamente.', 'success');
      } else {
        console.log('🛡️ [Monitor] Webhook está operante e correto.');
      }
    } catch (e) {
      console.error('❌ [Monitor] Falha ao verificar webhook:', e);
    }
  };

  // 2. Realtime para Chats
  useEffect(() => {
    let fetchTimeout: NodeJS.Timeout | null = null;

    const chatSub = supabase.channel('monitor_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, (payload) => {
        console.log('⚡ [Monitor] Realtime chats:', payload.eventType);

        // Debounce: aguardar 500ms antes de recarregar para agrupar múltiplos eventos
        if (fetchTimeout) clearTimeout(fetchTimeout);
        fetchTimeout = setTimeout(() => {
          fetchChats();
        }, 500);
      })
      .subscribe();

    return () => {
      if (fetchTimeout) clearTimeout(fetchTimeout);
      supabase.removeChannel(chatSub);
    };
  }, []);

  // 3. Realtime para Mensagens (filtrado por chat ativo)
  useEffect(() => {
    if (!activeChatId) return;

    console.log('🔌 [Monitor] Subscribing to messages for chat:', activeChatId);

    const msgChannel = supabase.channel(`room:${activeChatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${activeChatId}` // Server-side filter
        },
        (payload) => {
          console.log('🔔 [Monitor] Nova mensagem realtime:', payload.new);
          setActiveMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe((status) => {
        console.log('📡 [Monitor] Message subscription status:', status);
      });

    return () => {
      console.log('🔌 [Monitor] Unsubscribing from messages for chat:', activeChatId);
      supabase.removeChannel(msgChannel);
    };
  }, [activeChatId]);

  // 3. Auto Scroll
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);

      // Sync de histórico ao abrir o chat
      const chat = chats.find(c => c.id === activeChatId);
      if (chat && instanceName) {
        // Não bloqueia a UI, faz em background
        syncMessages(instanceName, chat.whatsapp_id).then(count => {
          if (count && count > 0) fetchMessages(activeChatId);
        });
      }

      scrollToBottom();
      setIsEditingName(false);
      if (chat) setTempName(chat.name);
    }
  }, [activeChatId, instanceName]);

  // --- Data Fetching ---

  const fetchChats = async () => {
    console.log('🔍 [Monitor] Buscando chats do Supabase...');
    const { data, error } = await supabase.from('chats').select('*').order('last_message_at', { ascending: false });
    console.log('📦 [Monitor] Chats encontrados:', { count: data?.length, error });
    if (data) setChats(data);
  };

  const fetchMessages = async (chatId: string) => {
    if (!chatId) return;

    console.log('🔍 [Monitor] Buscando mensagens para chat_id:', chatId);
    setIsLoadingMessages(true);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ [Monitor] Erro ao buscar mensagens:', error);
        throw error;
      }

      console.log('✅ [Monitor] Mensagens encontradas:', data?.length);
      setActiveMessages(data || []);
      scrollToBottom();
    } catch (err) {
      console.error('❌ [Monitor] Falha no fetch de mensagens:', err);
      showToast('Erro ao carregar mensagens', 'error');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Sincronizar perfis (nomes e fotos) de todos os chats
  const syncAllProfiles = async () => {
    if (!instanceName) {
      showToast('Instância não conectada', 'error');
      return;
    }

    setIsSyncingProfiles(true);
    console.log('🔄 [Monitor] Iniciando sincronização de perfis...');

    try {
      let updated = 0;

      for (const chat of chats) {
        try {
          const result = await updateChatProfile(instanceName, chat.id, chat.whatsapp_id);
          if (result.success) {
            updated++;
            console.log(`✅ Perfil atualizado: ${chat.whatsapp_id}`);
          }
          // Pequeno delay para não sobrecarregar a API
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (err) {
          console.error(`❌ Erro ao atualizar ${chat.whatsapp_id}:`, err);
        }
      }

      showToast(`${updated} perfis atualizados!`, 'success');
      fetchChats(); // Recarrega a lista
    } catch (err) {
      console.error('❌ Erro na sincronização:', err);
      showToast('Erro ao sincronizar perfis', 'error');
    } finally {
      setIsSyncingProfiles(false);
    }
  };

  // --- Actions ---

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId || !instanceName) {
      if (!instanceName) showToast('❌ Erro: Instância não definida no .env', 'error');
      return;
    }

    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    const textToSend = inputText;
    setInputText('');
    setIsSending(true);

    // Criar mensagem otimista (aparece imediatamente)
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      chat_id: activeChatId,
      sender: 'agent' as const,
      text: textToSend,
      created_at: new Date().toISOString()
    };

    // Adicionar mensagem ao estado imediatamente
    setActiveMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();

    try {
      await sendTextMessage(instanceName, chat.whatsapp_id, textToSend);

      // Inserir no banco (Realtime vai substituir a mensagem otimista)
      await supabase.from('messages').insert({
        chat_id: activeChatId,
        sender: 'agent',
        text: textToSend,
        created_at: new Date().toISOString()
      });

      await supabase.from('chats').update({
        last_message_at: new Date().toISOString()
      }).eq('id', activeChatId);

    } catch (err: any) {
      // Remover mensagem otimista se falhou
      setActiveMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      showToast(`❌ Erro envio: ${err.message}`, 'error');
      setInputText(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveName = async () => {
    if (!activeChatId || !tempName.trim()) return;
    await supabase.from('chats').update({ name: tempName }).eq('id', activeChatId);
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, name: tempName } : c));
    setIsEditingName(false);
    showToast('Nome salvo!', 'success');
  };

  // Sync manual removido - conversas criadas apenas via webhook ou envio

  // --- Render ---

  const activeChat = chats.find(c => c.id === activeChatId);

  // Filtrar por tipo e busca
  const filteredChats = chats.filter(c => {
    const matchesType = c.type === activeTab;
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whatsapp_id.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  // Contadores por tipo
  const individualCount = chats.filter(c => c.type === 'individual').length;
  const groupCount = chats.filter(c => c.type === 'group').length;

  // Debug: Log render state
  console.log('🎨 [Monitor] Renderizando:', { totalChats: chats.length, filteredChats: filteredChats.length, searchQuery, activeTab });

  return (
    <div className="flex h-[calc(100vh-theme(spacing.header))] overflow-hidden bg-background-dark gap-4 p-4">

      {/* SIDEBAR - Frosted Glass */}
      <motion.aside
        className="w-96 flex flex-col bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      >
        <div className="p-5 border-b border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="text-primary" size={20} /> Conversas
            </h2>
            <button
              onClick={syncAllProfiles}
              disabled={isSyncingProfiles || !instanceName}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sincronizar nomes e fotos"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 hover:text-primary transition-colors ${isSyncingProfiles ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* TABS: Contatos / Grupos */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'individual'
                ? 'bg-primary text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
            >
              Contatos ({individualCount})
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'group'
                ? 'bg-primary text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
            >
              Grupos ({groupCount})
            </button>
          </div>

          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-primary transition-colors" />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-black/30 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {filteredChats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border border-transparent flex items-center gap-3 ${activeChatId === chat.id
                ? 'bg-primary/10 border-primary/20 shadow-[0_0_20px_-5px_rgba(16,185,129,0.1)]'
                : 'hover:bg-white/5'
                }`}
            >
              <div className="relative">
                {chat.avatar_url ? (
                  <img src={chat.avatar_url} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/5" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black ring-2 ring-white/5 flex items-center justify-center text-sm font-bold text-gray-400">
                    {(chat.name || chat.whatsapp_id || '??').slice(0, 2).toUpperCase()}
                  </div>
                )}
                {activeChatId === chat.id && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-black" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className={`font-semibold truncate ${activeChatId === chat.id ? 'text-white' : 'text-gray-300'}`}>{chat.name || chat.whatsapp_id?.split('@')[0] || 'Sem Nome'}</h3>
                  <span className="text-[10px] text-gray-500">
                    {chat.last_message_at ? new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.status || 'Ativo'}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* MAIN AREA - Fixed Layout (WhatsApp Style) */}
      <main className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl">
        {activeChat ? (
          <>
            {/* HEADER - Transparent */}
            <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 z-20">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => updateChatProfile(instanceName!, activeChat.id, activeChat.whatsapp_id).then(() => fetchChats())}>
                  {activeChat.avatar_url ? (
                    <img src={activeChat.avatar_url} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold">{activeChat.name[0]}</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>

                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        className="bg-transparent border-b border-primary text-lg font-bold outline-none text-white min-w-[200px]"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                        onBlur={handleSaveName}
                      />
                      <Check size={18} className="text-primary cursor-pointer" onClick={handleSaveName} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setTempName(activeChat.name); setIsEditingName(true); }}>
                      <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {activeChat.name}
                      </h2>
                      <Pencil size={14} className="opacity-0 group-hover:opacity-100 text-gray-500" />
                    </div>
                  )}
                  <p className="text-xs text-emerald-400 font-mono tracking-wide">{activeChat.whatsapp_id.split('@')[0]}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-full text-gray-400"><Search size={20} /></button>
                <button className="p-2 hover:bg-white/5 rounded-full text-gray-400"><MoreVertical size={20} /></button>
              </div>
            </header>

            {/* MESSAGES - Scroll Zone */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32"
            >
              {activeMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] p-4 rounded-2xl relative shadow-lg ${msg.sender === 'user'
                    ? 'bg-[#1f1f1f] text-gray-200 rounded-tl-sm'
                    : 'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20 rounded-tr-sm'
                    }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                    <span className="text-[10px] opacity-40 mt-1 block text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* INPUT - Floating Island */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30">
              <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"><Smile size={20} /></button>
                <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"><Paperclip size={20} /></button>

                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 px-2 font-medium"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="p-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-black shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                  {isSending ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
              <MessageSquare size={40} />
            </div>
            <p className="text-lg">Selecione uma conversa para começar</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Monitor;