
import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000); // 5 seconds duration
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto min-w-[300px] max-w-sm p-4 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-right-full fade-in duration-300
                            ${toast.type === 'success' ? 'bg-[#0f1d16]/90 border-green-500/30 text-green-100' : ''}
                            ${toast.type === 'error' ? 'bg-[#1c0f0f]/90 border-red-500/30 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-[#0f1115]/90 border-blue-500/30 text-blue-100' : ''}
                        `}
                    >
                        <div className="flex items-start gap-3">
                            <span className={`material-symbols-outlined text-xl ${toast.type === 'success' ? 'text-green-500' :
                                    toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
                                }`}>
                                {toast.type === 'success' ? 'check_circle' :
                                    toast.type === 'error' ? 'error' : 'info'}
                            </span>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm tracking-wide uppercase opacity-80 mb-0.5">
                                    {toast.type === 'success' ? 'Sucesso' :
                                        toast.type === 'error' ? 'Erro' : 'Informação'}
                                </h4>
                                <p className="text-sm font-light leading-snug">{toast.message}</p>
                            </div>
                            <button onClick={() => removeToast(toast.id)} className="text-white/40 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
