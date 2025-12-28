
import React from 'react';

const ComingSoon: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-700">
            <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl shadow-2xl mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
                <span className="material-symbols-outlined text-6xl text-primary font-light relative z-10">
                    construction
                </span>
            </div>
            <h2 className="text-3xl font-semibold text-white/90 mb-2 font-display">{title}</h2>
            <p className="text-gray-500 font-light max-w-md mx-auto">{subtitle || 'Este módulo está em desenvolvimento e estará disponível em breve.'}</p>
        </div>
    );
};

export default ComingSoon;
