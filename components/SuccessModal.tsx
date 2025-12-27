
import React, { useState } from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    password?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    password
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-surface-hover/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <p className="text-white/70 text-sm leading-relaxed">{message}</p>

                    {password && (
                        <div className="mt-2 bg-background-dark border border-white/10 rounded-lg p-3 flex items-center gap-3">
                            <div className="bg-surface-hover/30 p-2 rounded text-white/50">
                                <span className="material-symbols-outlined text-[20px]">key</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs text-white/40 mb-0.5 uppercase tracking-wider font-bold">Senha Gerada</p>
                                <p className="text-white font-mono text-lg tracking-wide truncate">
                                    {showPassword ? password : '••••••••••••'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                    title={showPassword ? "Ocultar" : "Mostrar"}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className={`p-2 rounded-lg transition-all flex items-center justify-center ${copied
                                            ? 'text-green-500 bg-green-500/10'
                                            : 'text-white/40 hover:text-primary hover:bg-primary/10'
                                        }`}
                                    title="Copiar"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {copied ? 'check' : 'content_copy'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {password && (
                        <p className="text-xs text-white/40 text-center mt-1">
                            ⚠️ Copie a senha agora. Por segurança, ela não será exibida novamente dessa forma.
                        </p>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end bg-surface-hover/30">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg bg-primary text-background-dark hover:bg-green-400 font-bold text-sm shadow-[0_0_15px_rgba(19,236,91,0.2)] transition-all"
                    >
                        Concluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
