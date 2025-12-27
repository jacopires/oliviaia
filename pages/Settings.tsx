
import React from 'react';
import Header from '../components/Header';

const Settings: React.FC = () => {
    return (
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
            <Header
                title="Configurações"
                subtitle="Gerencie as configurações do sistema."
            />
            <div className="mt-8 p-8 bg-surface-dark rounded-xl border border-white/5 text-center text-slate-500 dark:text-white/50">
                <span className="material-symbols-outlined text-4xl mb-4">settings</span>
                <p>Configurações em desenvolvimento.</p>
            </div>
        </div>
    );
};

export default Settings;
