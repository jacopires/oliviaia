
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const isAdmin = user?.user_metadata?.role === 'admin';

  // Defines menu items based on role
  const menuItems = isAdmin ? [
    { name: 'Visão Geral', icon: 'dashboard', path: '/', category: 'Gestão' },
    { name: 'Clientes SaaS', icon: 'groups', path: '/admin-clients', category: 'Gestão' },
    { name: 'Uso de Tokens', icon: 'token', path: '/admin-tokens', category: 'Gestão' },
    { name: 'Financeiro & LTV', icon: 'payments', path: '/admin-financial', category: 'Gestão' },
    { name: 'Infraestrutura', icon: 'dns', path: '/admin-infra', category: 'Sistema' },
    { name: 'Config. Globais', icon: 'settings_suggest', path: '/admin-settings', category: 'Sistema' },
  ] : [
    { name: 'Visão Geral', icon: 'analytics', path: '/', category: 'Principal' },
    { name: 'Monitoramento', icon: 'smart_toy', path: '/agents', category: 'Principal' },
    { name: 'Chats Conversacionais', icon: 'forum', path: '/monitor', category: 'Principal' },
    { name: 'Integrações', icon: 'link', path: '/integrations', category: 'Principal' },
    { name: 'Configurações', icon: 'settings', path: '/settings', category: 'Principal' },
  ];

  // Helper to determine if a category header should be shown
  const shouldShowCategory = (index: number, item: any) => {
    if (isCollapsed) return false;
    if (index === 0) return true;
    const prevItem = menuItems[index - 1];
    return prevItem.category !== item.category;
  };

  return (
    <aside
      className={`
        hidden md:flex flex-col fixed left-0 top-0 h-screen bg-surface-dark border-r border-white/5 z-50 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      <div className="flex flex-col h-full bg-sidebar-dark/95 backdrop-blur-sm">
        {/* Header */}
        <div className="h-24 flex items-center px-6 border-b border-white/[0.03] shrink-0">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className={`p-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl shrink-0 transition-all ${isAdmin ? 'shadow-lg shadow-primary/5' : ''}`}>
              <span className="material-symbols-outlined text-primary text-xl font-light">
                {isAdmin ? 'admin_panel_settings' : 'smart_toy'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h1 className="font-display font-semibold text-white/90 text-lg tracking-tight leading-none">SolarAI</h1>
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-medium">
                  {isAdmin ? 'PORTAL GESTÃO' : 'PORTAL CLIENTE'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-1.5 custom-scrollbar">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.path}>
              {shouldShowCategory(index, item) && item.category && (
                <p className={`px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4 ${index > 0 ? 'mt-10' : ''}`}>
                  {item.category}
                </p>
              )}

              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
                  ${isActive
                    ? 'bg-primary/[0.08] text-primary border border-primary/[0.15] shadow-sm'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                <div className="relative z-10 flex items-center gap-3">
                  <span className={`material-symbols-outlined transition-colors duration-200 ${isCollapsed ? 'text-2xl' : 'text-xl'} ${location.pathname === item.path ? 'font-light' : 'font-light'}`}>
                    {item.icon}
                  </span>

                  {!isCollapsed && (
                    <span className={`text-sm tracking-tight ${location.pathname === item.path ? 'font-semibold' : 'font-medium opacity-80'}`}>
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Active Glow */}
                {location.pathname === item.path && (
                  <div className="absolute inset-0 bg-primary/[0.02] blur-xl rounded-full" />
                )}
              </NavLink>
            </React.Fragment>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-6 border-t border-white/[0.03] bg-black/10 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group mb-3">
              <div className="relative">
                <div
                  className="size-9 rounded-full bg-cover bg-center border border-white/10"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASnurTU6HUhylTjUuoIdeMEA9Il-x4wOvnANzVI6NX1CzSP-KdjDRhRGweQYEdYKUTsP2wDurXB6ojvkbqJ-erQJH6k5hrpis8ZcsE-mMn8g3GUXmy8t5nvmPP40Q7b9vebo96LhTBsML9Pu7BiEaA2VkMEmVZ57K_8PjeSerCCOWpeuitIZP-jYXO04KXvx8GKJMZWMnGezAa3M0y2sa526TNSoQvMVRToiOx3OP1ggEkwZlMRfaZfxt9tqFYLk4T7wyNPzjd1NX_')" }}
                />
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-green-500 rounded-full border-2 border-[#0b1610]"></div>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-white/80 truncate group-hover:text-primary transition-colors">
                  {user?.email?.split('@')[0] || 'Admin User'}
                </span>
                <span className="text-[9px] text-gray-600 uppercase tracking-widest truncate mt-0.5">
                  {isAdmin ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-6">
              <div className="size-9 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASnurTU6HUhylTjUuoIdeMEA9Il-x4wOvnANzVI6NX1CzSP-KdjDRhRGweQYEdYKUTsP2wDurXB6ojvkbqJ-erQJH6k5hrpis8ZcsE-mMn8g3GUXmy8t5nvmPP40Q7b9vebo96LhTBsML9Pu7BiEaA2VkMEmVZ57K_8PjeSerCCOWpeuitIZP-jYXO04KXvx8GKJMZWMnGezAa3M0y2sa526TNSoQvMVRToiOx3OP1ggEkwZlMRfaZfxt9tqFYLk4T7wyNPzjd1NX_')" }}></div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/[0.02] transition-colors w-full ${isCollapsed ? 'justify-center' : ''}`}
            title="Sair do Sistema"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            {!isCollapsed && <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
