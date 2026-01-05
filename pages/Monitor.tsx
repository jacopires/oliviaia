
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useToast } from '../components/ToastProvider';
import { syncChatsFromEvolution, updateChatProfilePicture } from '../services/evolutionService';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ChatListItem } from '../components/ui/ChatListItem';
import { MessageBubble } from '../components/ui/MessageBubble';
import { GlassCard } from '../components/ui/GlassCard';

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
  is_typing?: boolean; // New: Typing status from realtime?
}

const AVAILABLE_LABELS = ['Lead', 'Venda', 'Suporte', 'Urgente', 'Frio'];

const Monitor: React.FC = () => {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  // Audio Recorder Ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { showToast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Realtime Subscription
  useEffect(() => {
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
  }, [activeChatId]);

  // Auto Scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeMessages]);

  const fetchChats = async () => {
    const { data } = await supabase
      .from('chats')
      .select('*')
      .ilike('whatsapp_id', '%@s.whatsapp.net')
      .order('last_message_at', { ascending: false });

    if (data) {
      const mapped = data.map((d: any) => ({
        ...d,
        avatar: d.avatar_url || d.avatar
      }));
      setChats(mapped);

      if (!activeChatId && mapped.length > 0) setActiveChatId(mapped[0].id);
    }
  };

  const fetchMessages = async (chatId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (data) setActiveMessages(data as any);
  };

  useEffect(() => {
    if (activeChatId) fetchMessages(activeChatId);
    setShowLabelMenu(false); // Close menus on chat switch
    setShowEmojiPicker(false);
  }, [activeChatId]);

  const handleSync = async () => {
    setIsSyncing(true);
    showToast('Sincronizando conversas...', 'info');
    try {
      const { data: integrations } = await supabase.from('integrations_whatsapp').select('instance_id').limit(1);
      const instanceId = integrations?.[0]?.instance_id;

      if (!instanceId) {
        showToast('⚠️ Nenhuma instância do WhatsApp conectada. Vá em Integrações para conectar.', 'error');
        return;
      }

      const count = await syncChatsFromEvolution(instanceId);
      showToast(`Sincronização concluída! ${count} chats atualizados.`, 'success');
      fetchChats();
    } catch (err: any) {
      console.error(err);
      showToast('Erro ao sincronizar: ' + err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('chat-media').upload(fileName, file);
    if (error) { showToast("Erro upload", "error"); return; }

    const { data: { publicUrl } } = supabase.storage.from('chat-media').getPublicUrl(fileName);

    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    let type = 'document';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.type.startsWith('audio/')) type = 'audio';

    await supabase.functions.invoke('whatsapp-manager', {
      body: { action: 'send-media', remoteJid: currentChat.whatsapp_id, mediaUrl: publicUrl, mediaType: type, caption: inputText }
    });
    setInputText('');
    showToast("Mídia enviada!", "success");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.onstop = sendAudioRecording;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) { showToast("Erro microfone", "error"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); }
  };

  const sendAudioRecording = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
    const fileName = `audio-${Date.now()}.mp3`;
    const { error } = await supabase.storage.from('chat-media').upload(fileName, audioBlob);
    if (error) { showToast("Erro upload áudio", "error"); return; }
    const { data: { publicUrl } } = supabase.storage.from('chat-media').getPublicUrl(fileName);

    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    await supabase.functions.invoke('whatsapp-manager', {
      body: { action: 'send-audio', remoteJid: currentChat.whatsapp_id, mediaUrl: publicUrl }
    });
    showToast("Áudio enviado!", "success");
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeChatId) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;
    const msgText = inputText;
    setInputText('');
    const { error } = await supabase.functions.invoke('whatsapp-manager', {
      body: { action: 'send-message', remoteJid: currentChat.whatsapp_id, message: msgText }
    });
    if (error) showToast("Erro ao enviar mensagem", "error");
  };

  const handleEncerrar = async () => {
    if (!activeChatId) return;
    await supabase.from('chats').update({ status: 'Encerrado', created_at: new Date() }).eq('id', activeChatId);
    showToast("Atendimento encerrado", "info");
  };

  const toggleLabel = async (label: string) => {
    if (!activeChatId) return;
    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;
    const currentLabels = currentChat.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter(l => l !== label)
      : [...currentLabels, label];

    await supabase.from('chats').update({ labels: newLabels }).eq('id', activeChatId);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const filteredChats = chats.filter(chat => chat.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[350px] border-r border-slate-200 dark:border-[#282e39] bg-white dark:bg-[#111318] shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-[#282e39]">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Monitoramento Ao Vivo</h1>
            <button onClick={handleSync} disabled={isSyncing} className="text-xs bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-600 dark:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 flex items-center gap-2">
              <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
              {isSyncing ? '...' : 'Sync'}
            </button>
          </div>
          <input className="w-full bg-slate-100 dark:bg-[#1e242e] border-none rounded-lg px-4 py-2 text-slate-800 dark:text-white text-sm outline-none" placeholder="Buscar conversa..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.map(chat => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
              onClick={() => setActiveChatId(chat.id)}
              hasNewMessage={false}
            />
          ))}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0b0c10] relative">
        {!activeChatId ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">Selecione um chat para monitorar</div>
        ) : (
          <>
            {/* HEADER */}
            <div className="h-16 px-6 border-b border-slate-200 dark:border-[#282e39] flex items-center justify-between bg-white dark:bg-[#111318]">
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                    {activeChat?.avatar ? <img src={activeChat.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white font-bold">{activeChat?.name?.substring(0, 2).toUpperCase()}</span>}
                  </div>
                  {/* Botão para atualizar foto de perfil */}
                  {!activeChat?.avatar && (
                    <button
                      onClick={async () => {
                        if (!activeChat || isLoadingPhoto) return;
                        setIsLoadingPhoto(true);
                        try {
                          const { data: integrations } = await supabase.from('integrations_whatsapp').select('instance_id').limit(1);
                          const instanceId = integrations?.[0]?.instance_id;
                          if (instanceId) {
                            const success = await updateChatProfilePicture(instanceId, activeChat.id, activeChat.whatsapp_id);
                            if (success) {
                              showToast('Foto de perfil atualizada!', 'success');
                              fetchChats();
                            } else {
                              showToast('Foto de perfil não disponível', 'info');
                            }
                          }
                        } catch (err) {
                          showToast('Erro ao buscar foto', 'error');
                        } finally {
                          setIsLoadingPhoto(false);
                        }
                      }}
                      disabled={isLoadingPhoto}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 hover:bg-indigo-600 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                      title="Buscar foto do WhatsApp"
                    >
                      <span className={`material-symbols-outlined text-white text-[12px] ${isLoadingPhoto ? 'animate-spin' : ''}`}>
                        {isLoadingPhoto ? 'sync' : 'photo_camera'}
                      </span>
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-white">{activeChat?.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activeChat?.whatsapp_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative">
                {/* LABELS BUTTON */}
                <div className="relative">
                  <button onClick={() => setShowLabelMenu(!showLabelMenu)} className="p-2 text-slate-400 hover:text-indigo-500 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">label</span>
                  </button>
                  {showLabelMenu && (
                    <div className="absolute right-0 top-10 w-48 bg-white dark:bg-[#1e242e] shadow-xl border border-slate-200 dark:border-white/10 rounded-xl z-20 p-2">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">Etiquetas</h4>
                      {AVAILABLE_LABELS.map(label => (
                        <button
                          key={label}
                          onClick={() => toggleLabel(label)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg flex justify-between items-center hover:bg-slate-100 dark:hover:bg-white/5 ${activeChat?.labels?.includes(label) ? 'text-indigo-500 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                          {label}
                          {activeChat?.labels?.includes(label) && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={handleEncerrar} className="px-3 py-1 text-xs bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg">Encerrar</button>

                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isHumanMode ? 'bg-indigo-500/10 text-indigo-500' : 'bg-green-500/10 text-green-500'}`}>
                  {isHumanMode ? 'HUMANO' : 'IA'}
                </div>

                <button onClick={() => setIsHumanMode(!isHumanMode)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isHumanMode ? 'bg-indigo-500' : 'bg-green-500'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isHumanMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* MESSAGES */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map(msg => {
                const isAgent = msg.sender === 'agent' || msg.sender === 'ai';
                const renderContent = () => {
                  if (msg.media_type === 'image') return <img src={msg.media_url} alt="Media" className="max-w-[200px] rounded-lg mb-2" />;
                  if (msg.media_type === 'audio') return <audio controls src={msg.media_url} className="mb-2 w-[240px]" />;
                  if (msg.media_type === 'video') return <video controls src={msg.media_url} className="max-w-[200px] rounded-lg mb-2" />;
                  return null;
                };
                return (
                  <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${isAgent ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-[#1e242e] text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-white/5'}`}>
                      {renderContent()}
                      {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                      <div className={`text-[10px] mt-2 flex items-center justify-end gap-1 ${isAgent ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {msg.sender === 'agent' && <span className="uppercase">Você</span>}
                        {msg.sender === 'ai' && <span className="uppercase">IA</span>}
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white dark:bg-[#111318] border-t border-slate-200 dark:border-[#282e39] relative">
              {/* EMOJI PICKER POPUP */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-4 z-20 shadow-xl rounded-xl overflow-hidden">
                  <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" width={300} height={400} />
                </div>
              )}

              <div className="flex gap-2 max-w-4xl mx-auto items-end">
                <div className="flex gap-1 pb-2">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-slate-400 hover:text-yellow-500 transition-colors rounded-full hover:bg-slate-100">
                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                  </button>
                  <label className="p-2 text-slate-400 hover:text-indigo-500 cursor-pointer transition-colors rounded-full hover:bg-slate-100">
                    <span className="material-symbols-outlined">attach_file</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*,audio/*" />
                  </label>
                  <button onClick={isRecording ? stopRecording : startRecording} className={`p-2 transition-colors rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'}`}>
                    <span className="material-symbols-outlined">{isRecording ? 'stop' : 'mic'}</span>
                  </button>
                </div>

                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-slate-100 dark:bg-[#1e242e] border-none rounded-2xl px-4 py-3 text-slate-800 dark:text-white outline-none resize-none h-[50px] min-h-[50px] max-h-[120px]"
                />
                <button onClick={handleSendMessage} disabled={!inputText.trim()} className="mb-1 w-[46px] h-[42px] bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-green-500/20">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Monitor;
