
import React from 'react';
import Header from '../components/Header';

const Integrations: React.FC = () => {
  const platforms = [
    { name: 'WhatsApp Business', desc: 'Conecte seus agentes ao número da empresa.', status: 'Conectado', icon: 'chat', color: '#25D366' },
    { name: 'HubSpot CRM', desc: 'Sincronize contatos automaticamente.', status: 'Conectado', icon: 'hub', color: '#FF7A59' },
    { name: 'Google Calendar', desc: 'Agende visitas técnicas na agenda da equipe.', status: 'Disponível', icon: 'calendar_month', color: '#4285F4' },
    { name: 'Salesforce', desc: 'Gestão de pipeline complexo.', status: 'Disponível', icon: 'cloud', color: '#00A1E0' },
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto flex flex-col gap-8 text-white">
      <Header
        title="Integrações da Plataforma"
        subtitle="Gerencie as conexões dos seus agentes de IA com CRMs e mensageiros."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {platforms.map((p, i) => (
          <div key={i} className={`flex flex-col rounded-xl bg-surface-dark border p-5 gap-5 group relative overflow-hidden transition-all ${p.status === 'Conectado' ? 'border-primary/20 hover:border-primary/50' : 'border-white/5 hover:border-white/20'}`}>
            <div className="flex items-start justify-between z-10">
              <div className="size-12 rounded-lg flex items-center justify-center border" style={{ backgroundColor: p.color + '20', color: p.color, borderColor: p.color + '20' }}>
                <span className="material-symbols-outlined text-3xl">{p.icon}</span>
              </div>
              <div className={`px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${p.status === 'Conectado' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-text-secondary border-white/10'}`}>
                {p.status}
              </div>
            </div>
            <div className="flex flex-col gap-1 z-10">
              <h3 className="text-white text-lg font-display font-bold">{p.name}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{p.desc}</p>
            </div>
            <div className="pt-4 border-t border-white/5 mt-auto flex items-center justify-end z-10">
              <button className={`h-9 px-4 rounded-lg font-bold text-sm transition-all ${p.status === 'Conectado' ? 'bg-surface-dark border border-white/10 text-white' : 'bg-transparent border border-primary text-primary hover:bg-primary/10'}`}>
                {p.status === 'Conectado' ? 'Gerenciar' : 'Conectar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integrations;
