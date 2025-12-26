
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sendMessageToGemini } from '../services/geminiService';
import { Message } from '../types';

const FlowEditor: React.FC = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Olá! Sou o assistente virtual da SolarTech. ☀️\nEstou aqui para calcular quanto você pode economizar com energia solar.\nPara começarmos, você poderia me dizer qual é o valor médio da sua conta de luz?', timestamp: '10:42' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
        role: m.sender === 'ai' ? 'model' : 'user' as any,
        parts: [{ text: m.text }]
    }));

    const response = await sendMessageToGemini(input, history);
    
    setIsTyping(false);
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: response || '', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] bg-background-dark">
      {/* Steps Sidebar */}
      <aside className="w-80 border-r border-surface-border bg-[#111813] flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-border">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider text-text-secondary">Etapas do Fluxo</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
          <div className="group flex items-center gap-3 bg-surface-dark border border-primary/50 px-3 py-3 rounded-lg cursor-pointer relative overflow-hidden transition-all">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div className="text-white flex items-center justify-center rounded bg-[#28392e] shrink-0 size-8 text-primary">
              <span className="material-symbols-outlined text-[18px]">handshake</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">1. Saudação</p>
              <p className="text-text-secondary text-xs truncate">Prompt de boas-vindas</p>
            </div>
          </div>
          {['Valor da Conta', 'Tipo de Telhado', 'Localização', 'Dados de Contato'].map((step, i) => (
             <div key={i} className="group flex items-center gap-3 bg-transparent border border-transparent hover:border-surface-border hover:bg-surface-dark px-3 py-3 rounded-lg cursor-pointer transition-all">
                <div className="text-text-secondary flex items-center justify-center rounded bg-[#1a261e] shrink-0 size-8 group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">adjust</span>
                </div>
                <p className="text-gray-300 text-sm font-medium truncate group-hover:text-white">{i + 2}. {step}</p>
             </div>
          ))}
        </div>
        <div className="p-4 border-t border-surface-border">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#28392e] py-2 text-sm font-bold text-primary hover:bg-[#344a3c] transition-colors border border-dashed border-primary/30">
            <span className="material-symbols-outlined">add_circle</span> Adicionar Etapa
          </button>
        </div>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 flex flex-col overflow-hidden relative p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 w-full z-10">
          <div className="bg-surface-dark border border-surface-border rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded text-primary">
                <span className="material-symbols-outlined fill">chat</span>
              </div>
              <h3 className="text-lg font-bold text-white">Prompt do Agente</h3>
            </div>
            <textarea className="w-full h-48 bg-[#101813] border border-surface-border rounded-lg p-4 text-white text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none leading-relaxed" placeholder="O que o agente deve dizer nessa etapa?">Olá! Sou o assistente virtual da SolarTech. ☀️
Estou aqui para calcular quanto você pode economizar com energia solar. 

Para começarmos, você poderia me dizer qual é o valor médio da sua conta de luz?</textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-dark border border-surface-border rounded-xl p-6 shadow-lg">
              <h3 className="text-base font-bold text-white mb-4">Extração de Dados</h3>
              <input className="w-full bg-[#101813] border border-surface-border rounded-lg px-4 py-2 text-primary font-mono text-sm focus:border-primary outline-none" type="text" defaultValue="valor_conta"/>
              <select className="w-full mt-4 bg-[#101813] border border-surface-border rounded-lg px-4 py-2 text-white text-sm focus:border-primary outline-none appearance-none">
                <option>Moeda (R$)</option>
                <option>Número</option>
                <option>Texto</option>
              </select>
            </div>
            <div className="bg-surface-dark border border-surface-border rounded-xl p-6 shadow-lg flex flex-col">
              <h3 className="text-base font-bold text-white mb-4">Lógica de Avanço</h3>
              <div className="p-3 rounded-lg border border-surface-border bg-[#101813] flex flex-col gap-2">
                <div className="flex justify-between items-center"><span className="text-xs font-bold text-text-secondary">SE RESPOSTA VÁLIDA</span><span className="material-symbols-outlined text-primary text-xs">check_circle</span></div>
                <div className="flex items-center gap-2 text-sm text-white"><span className="material-symbols-outlined text-text-secondary">arrow_forward</span> Ir para: <span className="text-primary font-bold">2. Valor da Conta</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Preview Sidebar */}
      <aside className="w-[420px] border-l border-surface-border bg-[#111813] flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-white text-sm font-bold uppercase tracking-wider text-text-secondary">Preview em Tempo Real</h3>
          <button onClick={() => setMessages([messages[0]])} className="text-text-secondary hover:text-white transition-colors"><span className="material-symbols-outlined text-[20px]">refresh</span></button>
        </div>
        
        <div className="flex-1 bg-[#0d110f] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === 'ai' ? 'bg-surface-dark border border-surface-border text-primary' : 'bg-primary text-[#111813]'}`}>
                <span className="material-symbols-outlined text-[16px]">{m.sender === 'ai' ? 'smart_toy' : 'person'}</span>
              </div>
              <div className={`flex flex-col gap-1 max-w-[80%] ${m.sender === 'user' ? 'items-end' : ''}`}>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === 'ai' ? 'bg-surface-dark border border-surface-border text-gray-200 rounded-tl-none' : 'bg-primary text-[#0a1810] font-medium rounded-tr-none'}`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-text-secondary">{m.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center text-primary"><span className="material-symbols-outlined text-[16px]">smart_toy</span></div>
              <div className="bg-surface-dark border border-surface-border p-3 rounded-2xl rounded-tl-none text-sm w-16 flex items-center justify-center gap-1">
                <span className="w-1 h-1 bg-text-secondary rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-text-secondary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1 h-1 bg-text-secondary rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-surface-border bg-[#111813]">
          <div className="flex gap-2 items-center bg-[#1c2e23] rounded-full px-4 py-2 border border-surface-border focus-within:border-primary transition-colors">
            <input 
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-text-secondary/50" 
              placeholder="Digite uma resposta de teste..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="text-primary hover:text-white transition-colors" onClick={handleSend}><span className="material-symbols-outlined">send</span></button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default FlowEditor;
