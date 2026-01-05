
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';
import {
  syncChatsFromEvolution,
  updateChatProfile,
  sendTextMessage
} from '../services/evolutionService';
import {
  Send, Smile, Paperclip, MoreVertical, RefreshCw, Search,
  Tag, Camera, Pencil, Check
} from 'lucide-react';

// Tipagem
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
  status: string;
  score: string;
  last_message_at: string;
  labels?: string[];
  is_typing?: boolean;
}

// Fallback de Instância
const ENV_INSTANCE_NAME = import.meta.env.VITE_EVOLUTION_INSTANCE_NAME || 'MyInstance';

const Monitor: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Controle
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [instanceName, setInstanceName] = useState<string | null>(null);

  // Edição de Perfil
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const { showToast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 1. Setup Inicial
  useEffect(() => {
    const fetchInstance = async () => {
      const { data } = await supabase.from('integrations_whatsapp').select('instance_id').limit(1);
      if (data?.[0]?.instance_id) {
        setInstanceName(data[0].instance_id);
      } else {
        setInstanceName(ENV_INSTANCE_NAME);
      }
    };
    fetchInstance();
    fetchChats();
  }, []);

  // 2. Realtime Listeners
  useEffect(() => {
    const chatSub = supabase.channel('monitor_chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, fetchChats)
      .subscribe();

    const msgSub = supabase.channel('monitor_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (activeChatId && payload.new.chat_id === activeChatId) {
          setActiveMessages(prev => [...prev, payload.new as Message]);
          scrollToBottom();
        }
        fetchChats();
      })
      .subscribe();

    return () => { supabase.removeChannel(chatSub); supabase.removeChannel(msgSub); };
  }, [activeChatId]);

  // 3. Scroll Automático
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
      scrollToBottom();
      setIsEditingName(false);
    }
  }, [activeChatId]);

  // --- Data Fetching ---

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
      setIsLoadingChats(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (chatId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    setActiveMessages(data || []);
  };

  // --- Actions ---

  const handleSync = async () => {
    if (!instanceName) {
      showToast('⚠️ Nome da instância não configurado.', 'error');
      return;
    }
    setIsSyncing(true);
    try {
      const count = await syncChatsFromEvolution(instanceName);
      showToast(`✅ ${count} conversas sincronizadas!`, 'success');
      fetchChats();
    } catch (err: any) {
      showToast(`Erro ao sincronizar: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId || !instanceName) return;

    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    const textToSend = inputText;
    setInputText('');
    setIsSending(true);

    try {
      await sendTextMessage(instanceName, chat.whatsapp_id, textToSend);

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
      console.error(err);
      showToast('❌ Falha ao enviar: ' + err.message, 'error');
      setInputText(textToSend);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const handleSaveName = async () => {
    if (!activeChatId || !tempName.trim()) return;
    try {
      await supabase.from('chats').update({ name: tempName }).eq('id', activeChatId);
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, name: tempName } : c));
      setIsEditingName(false);
      showToast('Nome atualizado!', 'success');
    } catch (err) {
      showToast('Erro ao salvar nome', 'error');
    }
  };

  const handleRefreshProfile = async () => {
    if (!activeChatId || !instanceName) return;
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    showToast('Atualizando perfil...', 'info');
    try {
      const result = await updateChatProfile(instanceName, activeChatId, chat.whatsapp_id);
      if (result.success) {
        if (result.name) setTempName(result.name);
        showToast('Perfil atualizado com sucesso!', 'success');
        fetchChats();
      } else {
        showToast('Nenhuma informação nova encontrada.', 'info');
      }
    } catch (err) {
      showToast('Erro ao atualizar perfil', 'error');
    }
  };

  const formatPhoneNumber = (jid: string) => {
    return jid.split('@')[0].replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '+$1 ($2) $3-$4');
  };

  // --- Renders ---

  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.whatsapp_id.includes(searchQuery)
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background-dark p-4 gap-4">

      {/* SIDEBAR - ANTIGRAVITY STYLE */}
      <motion.aside
        className="w-96 flex flex-col bg-black/20 backdrop-blur-3xl rounded-3xl border border-white/5 overflow-hidden"
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      >
        <div className="p-6 border-b border-white/5 shrink-0 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Conversas</h2>
            <motion.button
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              onClick={handleSync} disabled={isSyncing}
              className={`p-2 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-all ${isSyncing ? 'animate-spin text-primary' : 'text-gray-400'}`}
            >
              <RefreshCw size={18} />
            </motion.button>
          </div>
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:bg-black/60 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {isLoadingChats ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredChats.map(chat => (
            <motion.div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border border-transparent relative group ${activeChatId === chat.id
                  ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-l-primary shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]'
                  : 'hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {chat.avatar_url ? (
                    <img src={chat.avatar_url} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                      {chat.name?.slice(0, 2).toUpperCase() || '?'}
                    </div>
                  )}
                  {/* Status Indicator */}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${activeChatId === chat.id ? 'bg-primary shadow-glow-green' : 'bg-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm font-semibold truncate ${activeChatId === chat.id ? 'text-white' : 'text-gray-300'}`}>
                      {chat.name || formatPhoneNumber(chat.whatsapp_id)}
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-primary/80' : 'text-gray-500'}`}>
                    {chat.status}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* MAIN CHAT AREA - ANTIGRAVITY STYLE */}
      <main className="flex-1 flex flex-col bg-black/40 backdrop-blur-3xl rounded-3xl border border-white/5 relative overflow-hidden">
        {activeChat ? (
          <>
            {/* HEADER */}
            <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={handleRefreshProfile}>
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    {activeChat.avatar_url ? (
                      <img src={activeChat.avatar_url} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center ring-2 ring-white/10">
                        <span className="text-lg font-bold text-white">{activeChat.name?.[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera size={18} className="text-white drop-shadow-lg" />
                    </div>
                  </motion.div>
                </div>

                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        className="bg-transparent border-b-2 border-primary text-xl font-bold outline-none text-white min-w-[200px] placeholder-white/20"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                        onBlur={handleSaveName}
                      />
                      <button onClick={handleSaveName} className="text-primary hover:text-emerald-300 transition-colors"><Check size={20} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setTempName(activeChat.name); setIsEditingName(true); }}>
                      <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                        {activeChat.name || formatPhoneNumber(activeChat.whatsapp_id)}
                      </h2>
                      <Pencil size={14} className="opacity-0 group-hover:opacity-100 text-gray-400 group-hover:text-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  )}
                  <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {formatPhoneNumber(activeChat.whatsapp_id)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-3 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><Search size={20} /></button>
                <button className="p-3 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
              </div>
            </header>

            {/* MESSAGE LIST - NEON STYLE */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/50 via-black to-black"
            >
              <AnimatePresence>
                {activeMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[70%] p-5 rounded-2xl relative group backdrop-blur-sm transition-all hover:scale-[1.01] ${msg.sender === 'user'
                        ? 'bg-white/5 text-gray-100 rounded-bl-sm border border-white/5'
                        : 'bg-gradient-to-br from-emerald-500/10 to-teal-900/20 text-emerald-100 border border-emerald-500/20 rounded-br-sm shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]'
                      }`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-[15px] cursor-text selection:bg-primary/30">{msg.text}</p>
                      <div className="flex justify-end items-center gap-1 mt-2 opacity-50 text-[10px] font-medium tracking-wide">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {msg.sender === 'agent' && <Check size={12} className="text-primary" />}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* INPUT AREA - DYNAMIC ISLAND */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30">
              <motion.div
                className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl shadow-black/50 ring-1 ring-white/5"
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              >
                <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-primary transition-colors"><Smile size={22} /></button>
                <button className="p-3 hover:bg-white/10 rounded-xl text-gray-400 hover:text-primary transition-colors"><Paperclip size={22} /></button>

                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 px-2 text-base"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isSending || !inputText.trim()}
                  className="p-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-xl text-black shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all font-bold"
                >
                  {isSending ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                </motion.button>
              </motion.div>
            </div>

          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/5"
            >
              <Smile size={48} className="text-gray-600" />
            </motion.div>
            <p className="text-lg font-light tracking-wide">Selecione uma conversa para conectar</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Monitor;