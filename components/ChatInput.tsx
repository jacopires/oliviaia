
import React, { useState } from 'react';
import { Smile, Paperclip, Send, RefreshCw } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    isSending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSending }) => {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-30">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 flex items-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <button
                    className="p-3 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
                    title="Emojis"
                >
                    <Smile size={20} />
                </button>
                <button
                    className="p-3 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
                    title="Anexar arquivo"
                >
                    <Paperclip size={20} />
                </button>

                <input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 px-2 font-medium"
                    maxLength={4096}
                    disabled={isSending}
                />

                {inputText.length > 0 && (
                    <span className={`text-xs font-medium ${inputText.length > 4000 ? 'text-red-400' : 'text-gray-500'}`}>
                        {inputText.length}/4096
                    </span>
                )}

                <button
                    onClick={handleSend}
                    disabled={isSending || !inputText.trim()}
                    className="p-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-black shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                >
                    {isSending ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
            </div>
        </div>
    );
};
