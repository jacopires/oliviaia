
import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-surface-hover/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {isDestructive && <span className="material-symbols-outlined text-red-500">warning</span>}
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-white/70 text-sm leading-relaxed">{message}</p>
                </div>

                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-end gap-3 bg-surface-hover/30">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all ${isDestructive
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
                                : 'bg-primary text-background-dark hover:bg-green-400 shadow-primary/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
