
import React from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';

const data = [
  { name: 'Seg', leads: 40, qualified: 24 },
  { name: 'Ter', leads: 30, qualified: 13 },
  { name: 'Qua', leads: 20, qualified: 9 },
  { name: 'Qui', leads: 27, qualified: 39 },
  { name: 'Sex', leads: 18, qualified: 48 },
  { name: 'Sab', leads: 23, qualified: 38 },
  { name: 'Dom', leads: 34, qualified: 43 },
];

const StatCard = ({ title, value, change, icon, trend }: { title: string, value: string, change: string, icon: string, trend: 'up' | 'down' }) => (
  <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className="material-symbols-outlined text-6xl text-primary">{icon}</span>
    </div>
    <div className="flex flex-col gap-2 relative z-10">
      <p className="text-slate-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        <span className="text-primary text-sm font-bold flex items-center bg-primary/10 px-1.5 py-0.5 rounded">
          <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span>
          {change}
        </span>
      </div>
      <p className="text-xs text-slate-400 dark:text-gray-500">vs. últimos 7 dias</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-8 max-w-[1600px] mx-auto w-full">
      <Header
        title="Visão Geral"
        subtitle="Monitore o desempenho da sua equipe de IA em tempo real."
        actions={
          <Link to="/create-agent" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold py-3 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(19,236,91,0.2)]">
            <span className="material-symbols-outlined">add_circle</span>
            <span>Criar Novo Agente</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Leads Triados" value="1,240" change="+12%" icon="filter_alt" trend="up" />
        <StatCard title="Leads Qualificados" value="397" change="+8%" icon="check_circle" trend="up" />
        <StatCard title="Taxa de Qualificação" value="32%" change="+2.5%" icon="percent" trend="up" />
        <div className="bg-white dark:bg-card-dark rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl text-primary">smart_toy</span>
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            <p className="text-slate-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">Agentes Ativos</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">3<span className="text-slate-400 dark:text-gray-500 text-xl font-normal">/5</span></h3>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 mt-2">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Performance de Triagem</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400">Total de conversas iniciadas vs. qualificadas</p>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#13ec5b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9db9a6', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c271f', border: '1px solid #28392e', borderRadius: '8px' }}
                  itemStyle={{ color: '#13ec5b' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#13ec5b" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="xl:col-span-1 bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Atividade Recente</h3>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
            {[
              { label: 'Lead Qualificado', desc: 'SolarBot-Alpha qualificou Roberto M.', time: '2 min atrás', icon: 'check', color: 'bg-primary/20 text-primary' },
              { label: 'Nova Conversa', desc: 'LeadGen-Beta iniciou triagem.', time: '15 min atrás', icon: 'chat', color: 'bg-blue-500/20 text-blue-500' },
              { label: 'Lead Desqualificado', desc: 'Telhado incompatível.', time: '1 hora atrás', icon: 'warning', color: 'bg-orange-500/20 text-orange-500' },
              { label: 'Agente Atualizado', desc: 'Prompt atualizado por Admin.', time: '3 horas atrás', icon: 'update', color: 'bg-purple-500/20 text-purple-500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`mt-1 size-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                  <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-slate-800 dark:text-white font-medium">{activity.label}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">{activity.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-1">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
