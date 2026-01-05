
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';
import { syncChatsFromEvolution, updateChatProfilePicture } from '../services/evolutionService';
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  MoreVertical,
  RefreshCw,
  Search,
  Tag,
  X,
  Camera
} from 'lucide-react';

interface Message {
  id: string;
  chat_id: string;
  sender: 'ai' | 'user' | 'agent';
  text: string;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio' | 'document';
  created_at: string;
}

interface ChatSession {
  id: string;
  whatsapp_id: string;
  name: string;
  avatar_url?: string;
  avatar?: string;
  status: string;
  score: string;
  last_message_at: string;
  labels?: string[];
  is_typing?: boolean;
}

const AVAILABLE_LABELS = ['Lead', 'Venda', 'Suporte', 'Urgente', 'Frio'];

// Mock data para demonstração
const MOCK_CHATS: ChatSession[] = [
  {
    id: '1',
    whatsapp_id: '5511999999999@s.whatsapp.net',
    name: 'João Silva',
    status: 'Novo Lead',
    score: 'A',
    last_message_at: new Date().toISOString(),
    labels: ['Lead', 'Urgente'],
  },
  {
    id: '2',
    whatsapp_id: '5511888888888@s.whatsapp.net',
    name: 'Maria Santos',
    status: 'Em Atendimento',
    score: 'B',
    last_message_at: new Date(Date.now() - 300000).toISOString(),
    labels: ['Venda'],
  },
  {
    id: '3',
    whatsapp_id: '5511777777777@s.whatsapp.net',
    name: 'Pedro Costa',
    status: 'Aguardando',
    score: 'C',
    last_message_at: new Date(Date.now() - 600000).toISOString(),
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    chat_id: '1',
    sender: 'user',
    text: 'Olá, gostaria de saber mais sobre os serviços',
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '2',
    chat_id: '1',
    sender: 'agent',
    text: 'Olá! Fico feliz em ajudar. Temos diversas soluções disponíveis. Qual área te interessa mais?',
    created_at: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '3',
    chat_id: '1',
    sender: 'user',
    text: 'Estou interessado em automação de atendimento',
    created_at: new Date(Date.now() - 30000).toISOString(),
  },
];

const Monitor: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const { showToast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Realtime Subscription
  useEffect(() => {
    if (useMockData) {
      setChats(MOCK_CHATS);
      setIsLoading(false);
      return;
    }

    const chatSubscription = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        fetchChats();
      })
      .subscribe();

    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (activeChatId && payload.new.chat_id === activeChatId) {
          setActiveMessages((prev) => [...prev, payload.new as Message]);
        }
        fetchChats();
      })
      .subscribe();

    fetchChats();

    return () => {
      supabase.removeChannel(chatSubscription);
      supabase.removeChannel(messageSubscription);
    };
  }, [activeChatId, useMockData]);

  // Auto Scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeMessages]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (activeChatId) {
      if (useMockData) {
        setActiveMessages(MOCK_MESSAGES.filter(m => m.chat_id === activeChatId));
      } else {
        fetchMessages(activeChatId);
      }
    }
  }, [activeChatId, useMockData]);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .ilike('whatsapp_id', '%@s.whatsapp.net')
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const mapped = data.map((d: any) => ({
          ...d,
          avatar: d.avatar_url || d.avatar
        }));
        setChats(mapped);

        if (!activeChatId && mapped.length > 0) {
          setActiveChatId(mapped[0].id);
        }
      }
    } catch (error: any) {
      console.error('Erro ao buscar chats:', error);
      showToast('Erro ao carregar conversas. Usando dados de demonstração.', 'warning');
      setUseMockData(true);
      setChats(MOCK_CHATS);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setActiveMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setActiveMessages([]);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    showToast('🔄 Sincronizando via servidor...', 'info');

    try {
      const { data: integrations, error: integrationsError } = await supabase
        .from('integrations_whatsapp')
        .select('instance_id')
        .limit(1);

      if (integrationsError) throw integrationsError;

      const instanceId = integrations?.[0]?.instance_id;

      if (!instanceId) {
        showToast('⚠️ Nenhuma instância do WhatsApp conectada. Vá em Integrações para conectar.', 'error');
        return;
      }

      const count = await syncChatsFromEvolution(instanceId);
      showToast(`✅ Sincronização concluída! ${count} chats atualizados.`, 'success');
      fetchChats();
    } catch (err: any) {
      console.error('Erro na sincronização:', err);

      // Tratamento granular de erros
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        showToast(
          '❌ Não foi possível conectar ao servidor. Verifique se a Edge Function "whatsapp-manager" está ativa.',
          'error'
        );

        // Oferecer fallback
        const useMock = window.confirm(
          'Deseja carregar Dados de Demonstração para visualizar a interface?'
        );
        if (useMock) {
          setUseMockData(true);
          setChats(MOCK_CHATS);
          showToast('📊 Modo Demonstração ativado', 'info');
        }
      } else if (err.message?.includes('FunctionsRelayError') || err.message?.includes('FunctionsFetchError')) {
        showToast(
          '⚠️ Edge Function não configurada. Configure a integração WhatsApp primeiro.',
          'warning'
        );
      } else {
        showToast(`Erro ao sincronizar: ${err.message}`, 'error');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;

    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    const msgText = inputText;
    setInputText('');

    if (useMockData) {
      // Mock send
      const newMsg: Message = {
        id: Date.now().toString(),
        chat_id: activeChatId,
        sender: 'agent',
        text: msgText,
        created_at: new Date().toISOString(),
      };
      setActiveMessages(prev => [...prev, newMsg]);
      showToast('✅ Mensagem enviada (modo demo)', 'success');
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('whatsapp-manager', {
        body: { action: 'send-message', remoteJid: currentChat.whatsapp_id, message: msgText }
      });

      if (error) throw error;
      showToast('✅ Mensagem enviada', 'success');
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      showToast('❌ Erro ao enviar mensagem', 'error');
    }
  };

  const handleUpdatePhoto = async () => {
    if (!activeChatId) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    setIsLoadingPhoto(true);
    try {
      const { data: integrations } = await supabase
        .from('integrations_whatsapp')
        .select('instance_id')
        .limit(1);

      const instanceId = integrations?.[0]?.instance_id;
      if (!instanceId) {
        showToast('Nenhuma instância conectada', 'error');
        return;
      }

      await updateChatProfilePicture(instanceId, activeChatId, currentChat.whatsapp_id);
      showToast('✅ Foto atualizada', 'success');
      fetchChats();
    } catch (error) {
      showToast('❌ Erro ao atualizar foto', 'error');
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  const toggleLabel = async (label: string) => {
    if (!activeChatId) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    const currentLabels = currentChat.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter(l => l !== label)
      : [...currentLabels, label];

    if (useMockData) {
      setChats(prev => prev.map(c =>
        c.id === activeChatId ? { ...c, labels: newLabels } : c
      ));
      return;
    }

    await supabase.from('chats').update({ labels: newLabels }).eq('id', activeChatId);
    fetchChats();
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background-dark">
      {/* SIDEBAR - Scroll Independente */}
      <aside className="w-96 flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-xl">
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-white/5 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-text-primary">Conversas</h1>
            <motion.button
              onClick={handleSync}
              disabled={isSyncing}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw
                size={18}
                className={`text-primary ${isSyncing ? 'animate-spin' : ''}`}
              />
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-primary/50 transition-all"
              placeholder="Buscar conversa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Chats - SCROLL INDEPENDENTE */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {isLoading ? (
            // Skeleton Loading
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <p className="text-text-secondary mb-4">Nenhuma conversa encontrada</p>
              <motion.button
                onClick={handleSync}
                className="px-4 py-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Sincronizar Agora
              </motion.button>
            </div>
          ) : (
            <AnimatePresence>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all mb-2 ${activeChatId === chat.id
                    ? 'bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary shadow-glow-green'
                    : 'hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent'
                    }`}
                  onClick={() => setActiveChatId(chat.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      {chat.avatar ? (
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent-blue/20 border-2 border-primary/30 flex items-center justify-center">
                          <span className="text-text-primary font-bold text-sm">
                            {getInitials(chat.name)}
                          </span>
                        </div>
                      )}
                      {chat.is_typing && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background-dark" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {chat.name}
                        </p>
                        <span className="text-[10px] text-text-tertiary font-mono whitespace-nowrap ml-2">
                          {new Date(chat.last_message_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-secondary">
                          {chat.status}
                        </span>

                        {chat.labels && chat.labels.length > 0 && (
                          <div className="flex gap-1">
                            {chat.labels.slice(0, 2).map((label, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </aside>

      {/* ÁREA DE CHAT - WhatsApp Experience */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background-dark via-background-dark to-surface-dark">
        {activeChat ? (
          <>
            {/* 1. Header Fixo */}
            <header className="h-20 shrink-0 z-20 bg-black/10 backdrop-blur-md border-b border-white/5 flex items-center px-6">
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className="relative group">
                  {activeChat.avatar ? (
                    <img
                      src={activeChat.avatar}
                      alt={activeChat.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent-blue/20 border-2 border-primary/30 flex items-center justify-center">
                      <span className="text-text-primary font-bold">
                        {getInitials(activeChat.name)}
                      </span>
                    </div>
                  )}

                  {/* Update Photo Button */}
                  <motion.button
                    onClick={handleUpdatePhoto}
                    disabled={isLoadingPhoto}
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Camera size={20} className="text-white" />
                  </motion.button>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-text-primary">{activeChat.name}</h2>
                  <p className="text-sm text-text-secondary">{activeChat.status}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <motion.button
                    onClick={() => setShowLabelMenu(!showLabelMenu)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Tag size={18} className="text-text-primary" />
                  </motion.button>

                  {/* Label Menu */}
                  {showLabelMenu && (
                    <motion.div
                      className="absolute right-0 top-12 bg-surface-dark border border-white/10 rounded-xl p-2 shadow-glass z-10 min-w-[150px]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {AVAILABLE_LABELS.map((label) => (
                        <button
                          key={label}
                          onClick={() => toggleLabel(label)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeChat.labels?.includes(label)
                            ? 'bg-primary/20 text-primary'
                            : 'hover:bg-white/5 text-text-secondary'
                            }`}
                        >
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <MoreVertical size={18} className="text-text-primary" />
                </motion.button>
              </div>
            </header>

            {/* 2. Lista de Mensagens - SCROLL ZONE (pb-40 obrigatório) */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 pb-40 space-y-6 custom-scrollbar"
            >
              <AnimatePresence>
                {activeMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-white/5 text-text-primary rounded-bl-sm'
                        : 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-br-sm shadow-glow-green'
                        }`}
                    >
                      {msg.media_url && (
                        <div className="mb-2">
                          {msg.media_type === 'image' && (
                            <img
                              src={msg.media_url}
                              alt="Media"
                              className="max-w-full rounded-lg"
                            />
                          )}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      <span className="text-[10px] opacity-60 mt-1 block">
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 3. Input Flutuante - Dynamic Island (z-30) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30">
              <motion.div
                className="bg-black/60 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="p-2 rounded-xl hover:bg-white/5 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Smile size={20} className="text-text-secondary" />
                </motion.button>

                <motion.button
                  className="p-2 rounded-xl hover:bg-white/5 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Paperclip size={20} className="text-text-secondary" />
                </motion.button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-tertiary px-2 text-sm"
                />

                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-primary to-emerald-400 text-background-dark disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600 shadow-glow-green"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-secondary mb-4">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Monitor;
