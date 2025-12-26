
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../services/supabase';

const Login: React.FC = () => {
  const [view, setView] = useState<'selection' | 'login'>('selection');
  const [profileType, setProfileType] = useState<'client' | 'admin' | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      if ((session.user.user_metadata as any)?.role === 'admin') {
        navigate('/admin/clients', { replace: true });
        return;
      }

      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  const handleProfileSelect = (type: 'client' | 'admin') => {
    setProfileType(type);
    setView('login');
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userRole = data.user.user_metadata?.role;

        // If user has no role, we might want to default to 'client' or restrict access
        // strict check:
        if (profileType === 'admin' && userRole !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Acesso negado. Esta conta não possui perfil de gestão.');
        }

        if (profileType === 'client' && userRole === 'admin') {
          // Admins can probably login as clients or we force them to use admin login?
          // User request implies strict separation: "login para cliente E para gestão"
          // Let's enforce strictness for clarity
          await supabase.auth.signOut();
          throw new Error('Acesso negado. Utilize a opção "Login Gestão".');
        }
      }

      // Success handled by useEffect redirect
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-row bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      {/* LEFT COLUMN */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-background-light dark:bg-background-dark z-10 w-full lg:w-[45%] xl:w-[40%] relative">

        {/* Logo */}
        <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-background-dark">
            <span className="material-symbols-outlined text-xl font-bold">solar_power</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Solar AI</span>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96">

          {view === 'selection' ? (
            <>
              <div className="flex flex-col mb-10">
                <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-3">Escolha seu acesso</h1>
                <p className="text-slate-600 dark:text-text-muted text-base font-normal leading-normal">
                  Selecione o tipo de conta para entrar na plataforma.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleProfileSelect('client')}
                  className="group w-full flex items-center p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary dark:hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></div>
                  <div className="flex-shrink-0 mr-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-background-dark flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all duration-300 border border-gray-200 dark:border-border-dark group-hover:border-primary">
                      <span className="material-symbols-outlined text-slate-600 dark:text-text-muted group-hover:text-background-dark text-[24px]">person</span>
                    </div>
                  </div>
                  <div className="flex-grow relative z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Login Cliente</h3>
                    <p className="text-sm text-slate-500 dark:text-text-muted mt-1 font-medium">Acesso a dashboards e agentes</p>
                  </div>
                  <div className="flex-shrink-0 ml-4 relative z-10">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all text-2xl">arrow_forward</span>
                  </div>
                </button>

                <button
                  onClick={() => handleProfileSelect('admin')}
                  className="group w-full flex items-center p-5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl hover:border-primary dark:hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300"></div>
                  <div className="flex-shrink-0 mr-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-background-dark flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all duration-300 border border-gray-200 dark:border-border-dark group-hover:border-primary">
                      <span className="material-symbols-outlined text-slate-600 dark:text-text-muted group-hover:text-background-dark text-[24px]">admin_panel_settings</span>
                    </div>
                  </div>
                  <div className="flex-grow relative z-10">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Login Gestão</h3>
                    <p className="text-sm text-slate-500 dark:text-text-muted mt-1 font-medium">Acesso administrativo (Admin)</p>
                  </div>
                  <div className="flex-shrink-0 ml-4 relative z-10">
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all text-2xl">arrow_forward</span>
                  </div>
                </button>
              </div>

              <div className="relative mt-8 mb-6">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-border-dark"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background-light dark:bg-background-dark px-2 text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-600">Suporte</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-center">
                <Link to="/help" className="text-sm font-medium text-slate-600 dark:text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">help</span>
                  Central de Ajuda
                </Link>
              </div>
            </>
          ) : (
            // LOGIN FORM VIEW
            <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
              <button
                onClick={() => setView('selection')}
                className="self-start mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-text-muted hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Voltar para seleção
              </button>

              <div className="mb-8">
                <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-2">
                  {profileType === 'client' ? 'Login Cliente' : 'Login Gestão'}
                </h1>
                <p className="text-slate-600 dark:text-text-muted text-base font-normal leading-normal">
                  Informe suas credenciais para continuar.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start">
                  <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white pb-2">E-mail</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary text-[20px]">mail</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border-0 py-3.5 pl-10 bg-white dark:bg-surface-dark text-white ring-1 ring-inset ring-gray-300 dark:ring-border-dark focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted/50"
                      placeholder="exemplo@empresa.com.br"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 dark:text-white pb-2">Senha</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary text-[20px]">lock</span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border-0 py-3.5 pl-10 bg-white dark:bg-surface-dark text-white ring-1 ring-inset ring-gray-300 dark:ring-border-dark focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-primary px-3 py-4 text-base font-bold text-[#102216] shadow-sm hover:bg-[#0fd650] hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                >
                  {loading && <span className="size-4 border-2 border-[#102216] border-t-transparent rounded-full animate-spin"></span>}
                  {loading ? 'Entrando...' : 'Entrar na Plataforma'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt="Modern architecture with solar panels"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr5HUQgJdYoR3qEvbYnoZEjGPTrkSWMUwoJTyLjnaLRdOfn35ql9gGU_KI3twISzLmqxyaRp9_mIkLSvudMSsO7Xbvgb6A2EyQ6ykjAHgH6tmzBh-mbQPXJ1tCGeWQjNXxh_HUmpSF5aBhKu2qyfoFAebcxdGP5HiyTBk4btUJ5vfKvI1bOdaTfGnIKzppYQZ3fa3PbXce-cpEo3d-jRAOGAVoXoadlNryiVNTWWcpCyJ95wSAEBtUPYlAdDkg4w9rMX7poTAcI-k3"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/90 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-end p-20 z-10">
          <blockquote className="mb-6 border-l-4 border-primary pl-6">
            <p className="text-xl font-medium italic text-white/90">
              "A Solar AI transformou a forma como triamos nossos leads. Nossa conversão aumentou 40% no primeiro mês."
            </p>
            <footer className="mt-4 text-sm font-semibold text-primary">Carlos Mendes, CEO da SunPower Brasil</footer>
          </blockquote>
          <div className="flex gap-4">
            <div className="h-1.5 w-12 rounded-full bg-primary"></div>
            <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
            <div className="h-1.5 w-12 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
