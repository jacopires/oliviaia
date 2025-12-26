
import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'agent';
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  status: string;
  score: string;
  color: string;
  messages: Message[];
}

const Monitor: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState('1');
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: '1', name: 'Marcos Oliveira', avatar: 'MO', status: 'Qualificado', score: 'Potencial Alto', color: 'bg-green-500/20 text-green-500',
      messages: [
        { id: 'm1', sender: 'ai', text: 'Olá Marcos! Sou o assistente virtual da SolarEnergy. Qual o valor médio da sua conta?', time: '14:30' },
        { id: 'm2', sender: 'user', text: 'Vem uns R$ 600,00 por mês.', time: '14:31' },
        { id: 'm3', sender: 'ai', text: 'Entendi. E para qual tipo de imóvel seria a instalação? Residencial ou comercial?', time: '14:32' },
        { id: 'm4', sender: 'user', text: 'É residencial, em uma casa em Campinas.', time: '14:35' },
        { id: 'm5', sender: 'ai', text: 'Ótimo! Campinas tem uma excelente incidência solar. Você sabe me dizer se o seu telhado é de fibrocimento ou cerâmico?', time: '14:36' }
      ]
    },
    {
      id: '2', name: 'Julia Santos', avatar: 'JS', status: 'Desqualificado', score: 'Baixo', color: 'bg-red-500/20 text-red-500',
      messages: [
        { id: 'm1', sender: 'ai', text: 'Olá Julia, como posso ajudar hoje?', time: '13:10' },
        { id: 'm2', sender: 'user', text: 'Não tenho interesse agora, só estava curiosa.', time: '13:15' }
      ]
    },
    {
      id: '3', name: 'Roberto Costa', avatar: 'RC', status: 'Em Análise', score: 'Médio', color: 'bg-amber-500/20 text-amber-500',
      messages: [
        { id: 'm1', sender: 'ai', text: 'Oi Roberto! Já conhece nossos planos de financiamento?', time: '12:40' },
        { id: 'm2', sender: 'user', text: 'Estou agendando uma visita...', time: '12:45' }
      ]
    }
  ]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeChat.messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: isHumanMode ? 'agent' : 'ai',
      text: inputText,
      time: currentTime
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      }
      return chat;
    });
    setChats(updatedChats);
    setInputText('');
  };

  const toggleHumanMode = () => {
    setIsHumanMode(!isHumanMode);
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
      {/* Sidebar de Conversas */}
      <aside className="hidden md:flex flex-col w-[380px] lg:w-[400px] border-r border-slate-200 dark:border-[#282e39] bg-white dark:bg-[#111318] shrink-0 z-30">
        <div className="p-6 border-b border-slate-200 dark:border-[#282e39]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white font-display">Monitoramento</h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black text-primary uppercase">Live</span>
            </div>
          </div>

          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
            <input
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-100 dark:bg-[#1e242e] border border-transparent focus:border-primary/50 text-sm text-white outline-none transition-all shadow-inner"
              placeholder="Pesquisar leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex gap-3 p-4 rounded-2xl border transition-all cursor-pointer relative group ${activeChatId === chat.id
                  ? 'bg-primary/5 border-primary/30 shadow-lg'
                  : 'border-transparent hover:bg-white/5'
                }`}
            >
              <div className="relative shrink-0">
                <div className="size-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-sm border border-white/10 group-hover:border-primary/50 transition-all">
                  {chat.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-full border-2 border-[#111318]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold truncate text-white tracking-tight">{chat.name}</h3>
                  <span className="text-[10px] text-text-secondary font-mono opacity-50">{chat.messages[chat.messages.length - 1]?.time}</span>
                </div>
                <p className="text-xs text-text-secondary truncate leading-relaxed">
                  {chat.messages[chat.messages.length - 1]?.text}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${chat.color}`}>
                    {chat.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area Container */}
      <main className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden relative">

        {/* FIXED TOP LEAD INFO */}
        <header className="shrink-0 h-20 border-b border-white/5 bg-[#111318]/90 backdrop-blur-xl flex items-center justify-between px-8 z-40 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-white text-lg shadow-[0_8px_16px_rgba(0,0,0,0.4)] border border-white/10">
                {activeChat.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-[#111318] shadow-lg"></div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-tight font-display">{activeChat.name}</h2>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Score:</span>
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest">{activeChat.score}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${activeChat.color}`}>
                  {activeChat.status}
                </span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  Conexão Via WhatsApp
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${isHumanMode ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-text-secondary'}`}>
              <span className="material-symbols-outlined text-[20px]">{isHumanMode ? 'person_search' : 'precision_manufacturing'}</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Status de Controle</span>
                <span className="text-[11px] font-bold mt-1">{isHumanMode ? 'OPERADOR HUMANO' : 'SISTEMA AUTÔNOMO'}</span>
              </div>
            </div>

            <button
              onClick={toggleHumanMode}
              className={`h-12 px-6 rounded-xl font-black text-xs transition-all flex items-center gap-2 group shadow-xl ${isHumanMode
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
                  : 'bg-primary text-[#111318] hover:bg-green-400 shadow-primary/20 hover:scale-105'
                }`}
            >
              <span className="material-symbols-outlined text-[22px] transition-transform group-hover:scale-110">
                {isHumanMode ? 'cancel' : 'pan_tool'}
              </span>
              {isHumanMode ? 'DEVOLVER PARA IA' : 'ASSUMIR CONVERSA'}
            </button>
          </div>
        </header>

        {/* EXPANSIVE MESSAGES AREA */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-8 md:px-12 py-10 flex flex-col gap-8 custom-scrollbar bg-[radial-gradient(circle_at_center,_#121814_0%,_#0b0e14_100%)] scroll-smooth"
        >
          {activeChat.messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-start' : 'justify-end'} gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              {m.sender === 'user' && (
                <div className="size-10 rounded-xl bg-slate-800 shrink-0 flex items-center justify-center font-bold text-white text-xs border border-white/10 self-end mb-4 shadow-lg">
                  {activeChat.avatar}
                </div>
              )}

              <div className={`max-w-[70%] flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}>
                <div className={`px-6 py-4 rounded-3xl text-[15px] leading-relaxed shadow-2xl relative transition-all hover:scale-[1.01] ${m.sender === 'user'
                    ? 'bg-[#1e242e] text-white rounded-bl-none border border-white/5'
                    : m.sender === 'agent'
                      ? 'bg-primary text-[#102216] font-bold rounded-br-none shadow-primary/10'
                      : 'bg-white/5 border border-white/10 text-white rounded-br-none backdrop-blur-md'
                  }`}>
                  {m.text}
                  {m.sender === 'agent' && (
                    <div className="absolute -top-6 right-0 flex items-center gap-1.5 px-2 py-0.5 bg-primary/20 rounded-md border border-primary/20">
                      <span className="material-symbols-outlined text-[14px] text-primary">support_agent</span>
                      <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Human Takeover</span>
                    </div>
                  )}
                  {m.sender === 'ai' && (
                    <div className="absolute -top-6 right-0 flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
                      <span className="material-symbols-outlined text-[14px] text-text-secondary">smart_toy</span>
                      <span className="text-[9px] font-black text-text-secondary uppercase tracking-tighter">SolarAI Agent</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 px-2 opacity-40">
                  <span className="text-[10px] text-text-secondary font-mono">{m.time}</span>
                  {m.sender !== 'user' && <span className="material-symbols-outlined text-[12px] text-primary">done_all</span>}
                </div>
              </div>

              {m.sender !== 'user' && (
                <div className={`size-10 rounded-xl shrink-0 flex items-center justify-center border self-end mb-4 shadow-lg ${m.sender === 'agent' ? 'bg-primary border-primary text-[#111318]' : 'bg-surface-dark border-white/10 text-primary'}`}>
                  <span className="material-symbols-outlined text-[20px]">{m.sender === 'agent' ? 'person' : 'smart_toy'}</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-end gap-3 px-14">
              <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl rounded-tr-none flex items-center gap-1.5 shadow-inner">
                <span className="size-1.5 bg-primary rounded-full animate-bounce"></span>
                <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <footer className="shrink-0 p-8 bg-[#111318]/95 backdrop-blur-2xl border-t border-white/5 z-40">
          <div className="max-w-5xl mx-auto flex gap-4 items-center">
            <div className="flex items-center gap-1.5">
              <button className="size-12 rounded-2xl bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group">
                <span className="material-symbols-outlined transition-transform group-hover:rotate-12">attach_file</span>
              </button>
              <button className="size-12 rounded-2xl bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10 transition-all flex items-center justify-center group">
                <span className="material-symbols-outlined transition-transform group-hover:scale-110">mic</span>
              </button>
            </div>

            <div className="flex-1 relative">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className={`w-full h-14 px-7 rounded-2xl bg-[#1e242e] border border-transparent focus:border-primary/40 text-[15px] text-white outline-none transition-all placeholder:text-text-secondary/30 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)] ${isHumanMode ? 'ring-2 ring-primary/20' : ''}`}
                placeholder={isHumanMode ? "Escreva uma resposta para o lead..." : "Comande a IA ou assuma para responder manualmente..."}
              />
              {!inputText && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-20">
                  <span className="text-[10px] font-black border border-white/20 rounded-md px-2 py-1 uppercase tracking-tighter">Enter para enviar</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="size-14 rounded-2xl bg-primary text-[#111318] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_-5px_rgba(19,236,91,0.4)] disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
            >
              <span className="material-symbols-outlined font-black text-2xl">send</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Monitor;
