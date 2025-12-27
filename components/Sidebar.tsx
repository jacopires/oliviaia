
import React, { useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { label: 'Dashboard', path: '/', icon: 'bar_chart', section: 'Principal' },
    { label: 'Meus Agentes', path: '/agents', icon: 'smart_toy', section: 'Principal' },
    { label: 'Gestão de Clientes', path: '/admin-clients', icon: 'domain', section: 'Principal' },
    { label: 'Integrações', path: '/integrations', icon: 'link', section: 'Principal' },
    { label: 'Configurações', path: '/settings', icon: 'settings', section: 'Principal' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white dark:bg-sidebar-dark border-r border-gray-200 dark:border-white/5 z-50">
      <div className="p-6 flex items-center gap-3 bg-sidebar-dark/80 backdrop-blur-md z-10">
        <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-green-800 flex items-center justify-center shadow-[0_0_15px_rgba(19,236,91,0.3)]">
          <span className="material-symbols-outlined text-black font-bold">solar_power</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">SolarAI</h1>
          <p className="text-[10px] text-primary font-black tracking-[0.2em] uppercase opacity-80">Agente Dashboard</p>
        </div>
      </div>

      <nav
        ref={navRef}
        className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto scroll-smooth custom-scrollbar"
      >
        {['Principal', 'Sistema'].map(section => (
          <React.Fragment key={section}>
            <div
              id={`section-${section}`}
              onClick={() => scrollToSection(section)}
              className="sticky top-0 z-20 bg-sidebar-dark/95 backdrop-blur-sm py-4 px-4 cursor-pointer group flex items-center justify-between"
            >
              <p className="text-[10px] font-black text-slate-400 dark:text-text-secondary/50 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
                {section}
              </p>
              <span className="material-symbols-outlined text-[14px] text-text-secondary/20 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                keyboard_double_arrow_down
              </span>
            </div>

            <div className="flex flex-col gap-1.5 mb-4">
              {menuItems.filter(item => item.section === section).map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-text-secondary hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {isActive(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(19,236,91,0.6)]" />
                  )}
                  <span className={`material-symbols-outlined text-[20px] transition-transform ${isActive(item.path) ? 'fill scale-110' : 'group-hover:text-primary group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className={`font-bold text-sm tracking-tight ${isActive(item.path) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </React.Fragment>
        ))}

        {/* Espaçador para permitir scroll da última seção até o topo */}
        <div className="h-20 shrink-0" />
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/5 mt-auto bg-sidebar-dark/50 backdrop-blur-md flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group bg-surface-dark/40">
          <div className="relative">
            <div
              className="size-10 rounded-xl bg-cover bg-center border border-white/10"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASnurTU6HUhylTjUuoIdeMEA9Il-x4wOvnANzVI6NX1CzSP-KdjDRhRGweQYEdYKUTsP2wDurXB6ojvkbqJ-erQJH6k5hrpis8ZcsE-mMn8g3GUXmy8t5nvmPP40Q7b9vebo96LhTBsML9Pu7BiEaA2VkMEmVZ57K_8PjeSerCCOWpeuitIZP-jYXO04KXvx8GKJMZWMnGezAa3M0y2sa526TNSoQvMVRToiOx3OP1ggEkwZlMRfaZfxt9tqFYLk4T7wyNPzjd1NX_')" }}
            />
            <div className="absolute -bottom-1 -right-1 size-3 bg-primary rounded-full border-2 border-sidebar-dark shadow-sm" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">Carlos Silva</span>
            <span className="text-[10px] text-text-secondary font-black uppercase tracking-tighter opacity-60">Admin Solar</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group mt-1"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
          <span className="font-bold text-sm tracking-tight uppercase">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
