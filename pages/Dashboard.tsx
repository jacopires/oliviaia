import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, DollarSign, Activity } from 'lucide-react';
import Header from '../components/Header';
import { GlassCard } from '../components/ui/GlassCard';
import { OrbKPI } from '../components/ui/OrbKPI';
import { FloatingButton } from '../components/ui/FloatingButton';

const Dashboard: React.FC = () => {
  // Mock Data for Real-time Feed
  const feedEvents = [
    { id: 1, type: 'success', title: 'Lead Qualificado', desc: 'Construtora XYZ (Agente Solar01)', time: 'há 2 min', icon: 'check_circle' },
    { id: 2, type: 'warning', title: 'Intervenção Humana', desc: 'Cliente pediu desconto (Suporte N1)', time: 'há 15 min', icon: 'warning' },
    { id: 3, type: 'info', title: 'Novo Lead Iniciado', desc: 'Padaria Central (LeadGen)', time: 'há 42 min', icon: 'person' },
    { id: 4, type: 'error', title: 'Falha de Conexão', desc: 'WhatsApp API (Agente Financeiro)', time: 'há 1h', icon: 'error' },
    { id: 5, type: 'success', title: 'Agendamento Confirmado', desc: 'Residencial Green Park (Solar01)', time: 'há 2h', icon: 'event_available' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 min-h-screen relative">
      {/* Top Action Button (Floating) */}
      <div className="absolute top-8 right-8 z-20">
        <Link to="/create-agent">
          <FloatingButton variant="primary" icon={<Zap size={18} />}>
            Novo Agente
          </FloatingButton>
        </Link>
      </div>

      <motion.div
        className="max-w-[1600px] mx-auto w-full flex flex-col gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header
          title="Inteligência Operacional"
          subtitle="Monitoramento estratégico em tempo real."
        />

        {/* SECTION 1 - KPIs com Orbes Luminosas */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-primary" size={20} />
            <h3 className="text-text-secondary text-sm font-bold uppercase tracking-widest">
              Pulso do Negócio
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <OrbKPI
              value="42"
              label="Leads Hoje"
              color="green"
              size="lg"
              trend="up"
              trendValue="+24%"
            />
            <OrbKPI
              value="3/5"
              label="Agentes Ativos"
              color="blue"
              size="lg"
            />
            <OrbKPI
              value="R$ 1.2K"
              label="Economia Gerada"
              color="amber"
              size="lg"
              trend="up"
              trendValue="+18%"
            />
          </div>
        </motion.section>

        {/* SECTION 2 - Inteligência Operacional */}
        <motion.section
          className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[500px]"
          variants={itemVariants}
        >
          {/* COLUNA ESQUERDA: Gráfico de Volume */}
          <GlassCard className="w-full lg:w-2/3 flex flex-col" hover={false}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Volume de Interações</h3>
                <p className="text-sm text-text-secondary">Últimos 7 dias</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                  <TrendingUp size={14} />
                  +24%
                </span>
              </div>
            </div>

            {/* Gráfico com Gradiente Fade-Out */}
            <div className="flex-1 relative flex items-end justify-between gap-2 px-4 pb-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-text-primary" />
                ))}
              </div>

              {/* SVG Area Chart com Fade-Out */}
              <svg className="absolute inset-0 h-full w-full z-10 fade-out-bottom" preserveAspectRatio="none" viewBox="0 0 1000 500">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#10b981" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <path
                  d="M0 350 C 100 320, 200 380, 300 250 S 500 150, 600 200 S 800 50, 1000 80 L 1000 500 L 0 500 Z"
                  fill="url(#chartGradient)"
                />

                {/* Line */}
                <path
                  d="M0 350 C 100 320, 200 380, 300 250 S 500 150, 600 200 S 800 50, 1000 80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="opacity-80"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Axis Labels */}
              <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-text-tertiary font-mono">
                {['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* COLUNA DIREITA: Feed em Tempo Real */}
          <GlassCard className="w-full lg:w-1/3 flex flex-col" hover={false}>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full size-3 bg-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Feed em Tempo Real</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {feedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="group flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-default border border-transparent hover:border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${event.type === 'success' ? 'bg-primary/10 text-primary shadow-glow-green' :
                      event.type === 'warning' ? 'bg-accent-amber/10 text-accent-amber shadow-glow-amber' :
                        event.type === 'info' ? 'bg-accent-blue/10 text-accent-blue shadow-glow-blue' :
                          'bg-red-500/10 text-red-400'
                    }`}>
                    <span className="material-symbols-outlined text-[18px]">{event.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-semibold truncate ${event.type === 'success' ? 'text-primary' :
                          event.type === 'warning' ? 'text-accent-amber' :
                            event.type === 'info' ? 'text-accent-blue' :
                              'text-red-400'
                        }`}>
                        {event.title}
                      </p>
                      <span className="text-[10px] text-text-tertiary font-mono whitespace-nowrap ml-2">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Dashboard;
