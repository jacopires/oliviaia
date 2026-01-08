import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';
import {
  updateChatProfile,
  sendTextMessage,
  sendTyping,
  syncMessages,
  fetchInstanceStatus,
  configureWebhook,
  fetchWebhookConfig
} from '../services/evolutionService';
import {
  Send, Smile, Paperclip, MoreVertical, RefreshCw, Search,
  Camera, Pencil, Check, MessageSquare, Trash2, CheckCheck, ArrowDown
} from 'lucide-react';
import { ChatInput } from '../components/ChatInput';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Controle
  // Sync removido - sistema 100% sob demanda
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSyncingProfiles, setIsSyncingProfiles] = useState(false);
  const [isContactTyping, setIsContactTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [instanceName, setInstanceName] = useState<string | null>(null);


  // Edição de Perfil
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const { showToast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 1. Setup Inicial
  useEffect(() => {
    initInstance();

    // Listener apenas para atualizações de chats (não mensagens)
    const sub = supabase.channel('monitor_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchChats();
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const initInstance = async () => {
    let target = null;

    // 1. PRIORIDADE: Banco de Dados (Intenção do Usuário)
    try {
      const { data } = await supabase.from('integrations_whatsapp').select('instance_id').limit(1).single();
      if (data?.instance_id) {
        target = data.instance_id;
      }
    } catch (e) {
      // Silencioso
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {

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

    const channelName = `messages:${activeChatId}:${Date.now()}`;
    const msgChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${activeChatId}`
        },
        (payload) => {
          console.log('⚡ [Monitor] Realtime msg recebida:', payload.new);
          // Evitar duplicatas
          setActiveMessages((prev) => {
            const exists = prev.some(m => m.id === payload.new.id);
            if (exists) {
              console.log('⚠️ Ignorando duplicata:', payload.new.id);
              return prev;
            }
            return [...prev, payload.new as Message];
          });
          scrollToBottom();
        }
      )
      .subscribe((status) => {
        console.log('🔌 [Monitor] Status Realtime:', status, channelName);
      });

    return () => {
      console.log('🔌 [Monitor] Unsubscribing channel:', channelName);
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

  // Detectar scroll para mostrar/esconder botão "ir para o final"
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeChatId]);

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

  const handleSendMessage = async (text?: string) => {
    // Se vier do botão interno do ChatInput, usa o texto passado
    const textToSend = text;

    if (!textToSend?.trim() || !activeChatId || !instanceName) {
      if (!instanceName) showToast('❌ Erro: Instância não definida no .env', 'error');
      return;
    }

    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

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
      // Enviar indicador de digitação primeiro
      await sendTyping(instanceName, chat.whatsapp_id);

      // Pequeno delay para dar tempo do typing aparecer
      await new Promise(resolve => setTimeout(resolve, 500));

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
      // Não temos mais setInputText aqui pois o input está isolado, mas o erro será mostrado no toast
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

  const handleDeleteChat = async () => {
    if (!activeChatId) return;

    const chatToDelete = chats.find(c => c.id === activeChatId);
    if (!chatToDelete) return;

    const confirmDelete = window.confirm(`Deseja realmente excluir a conversa com "${chatToDelete.name}"?\n\nTodas as mensagens serão perdidas.`);

    if (!confirmDelete) return;

    try {
      // Deletar mensagens primeiro (cascade deveria fazer isso, mas garantir)
      await supabase.from('messages').delete().eq('chat_id', activeChatId);

      // Deletar chat
      await supabase.from('chats').delete().eq('id', activeChatId);

      // Atualizar UI
      setChats(prev => prev.filter(c => c.id !== activeChatId));
      setActiveChatId(null);
      setActiveMessages([]);

      showToast('Conversa excluída!', 'success');
    } catch (err: any) {
      showToast(`❌ Erro ao excluir: ${err.message}`, 'error');
    }
  };

  // Sync manual removido - conversas criadas apenas via webhook ou envio

  // --- Render ---

  const activeChat = chats.find(c => c.id === activeChatId);

  // Filtrar apenas por busca (grupos já são ignorados pela API)
  // useMemo evita recálculo desnecessário quando inputText muda (não relacionado)
  const filteredChats = useMemo(() => {
    return chats.filter(c => {
      const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.whatsapp_id.includes(searchQuery);
      return matchesSearch;
    });
  }, [chats, searchQuery]);

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
                <button
                  onClick={handleDeleteChat}
                  className="p-2 hover:bg-red-500/10 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  title="Excluir conversa"
                >
                  <Trash2 size={20} />
                </button>
                <button
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400"
                  title="Buscar no chat"
                >
                  <Search size={20} />
                </button>
                <button
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400"
                  title="Mais opções"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            </header>

            {/* MESSAGES - Scroll Zone */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar pb-32"
            >
              {activeMessages.map((msg, idx) => {
                const formatDate = (d: string) => {
                  const date = new Date(d);
                  const today = new Date();
                  const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                  if (date.toDateString() === today.toDateString()) return 'Hoje';
                  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
                  return date.toLocaleDateString('pt-BR');
                };

                const showDivider = idx === 0 || formatDate(msg.created_at) !== formatDate(activeMessages[idx - 1].created_at);
                const isAgent = msg.sender === 'agent';

                return (
                  <React.Fragment key={msg.id}>
                    {showDivider && (
                      <div className="flex justify-center my-6">
                        <span className="bg-black/60 px-4 py-1.5 rounded-full text-xs text-gray-400 font-medium border border-white/5">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] p-3 rounded-2xl shadow-lg ${isAgent ? 'bg-primary text-black rounded-tr-sm' : 'bg-gray-800/90 text-gray-100 rounded-tl-sm border border-white/5'}`}>
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1.5">
                          <span className={`text-[11px] font-medium ${isAgent ? 'text-black/50' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAgent && <CheckCheck className={`w-4 h-4 ${msg.id.startsWith('temp-') ? 'text-black/30' : 'text-black/50'}`} />}
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}

              {/* Indicador de Digitação */}
              {isContactTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-800/90 rounded-2xl rounded-tl-sm p-4 px-5 shadow-lg border border-white/5">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Botão Scroll to Bottom */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-24 right-8 p-4 bg-primary text-black rounded-full shadow-2xl hover:bg-primary/90 transition-all z-20 hover:scale-110"
                  title="Ir para o final"
                >
                  <ArrowDown size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* INPUT - Componente Isolado */}
            <ChatInput onSendMessage={handleSendMessage} isSending={isSending} />

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center mb-6 border border-primary/20 shadow-lg shadow-primary/10">
              <MessageSquare size={48} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-gray-200 mb-3">Bem-vindo ao Monitor</h3>
            <p className="text-center text-gray-500 max-w-md leading-relaxed">
              Selecione uma conversa à esquerda para começar a visualizar e responder mensagens do WhatsApp em tempo real.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Mensagens em tempo real
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Sincronização automática
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Monitor;