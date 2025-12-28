
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../services/supabase';

const Login: React.FC = () => {
  const [view, setView] = useState<'selection' | 'login'>('selection');
  const [profileType, setProfileType] = useState<'client' | 'admin' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      if ((session.user.user_metadata as any)?.role === 'admin') {
        navigate('/', { replace: true });
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

      if (error) throw error;

      if (data.user) {
        const userRole = data.user.user_metadata?.role;
        if (profileType === 'admin' && userRole !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('Acesso negado. Esta conta não possui perfil de gestão.');
        }
        if (profileType === 'client' && userRole === 'admin') {
          await supabase.auth.signOut();
          throw new Error('Acesso negado. Utilize a opção "Login Gestão".');
        }
      }
    } catch (err: any) {
      let errorMessage = err.message || 'Falha ao fazer login. Verifique suas credenciais.';

      // Translate common Supabase errors
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'E-mail não confirmado. Verifique sua caixa de entrada.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0a0f0d] font-display text-white overflow-hidden relative">
      {/* Dynamic Background Element */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* LEFT COLUMN: FORM */}
      <div className="flex flex-col justify-center w-full lg:w-[45%] xl:w-[40%] px-8 md:px-16 lg:px-24 z-10 bg-white/5 backdrop-blur-xl border-r border-white/5 shadow-2xl">

        {/* Header/Logo */}
        <div className="absolute top-12 left-8 md:left-16 lg:left-24 flex items-center gap-3 group cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 shadow-sm transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-primary">solar_power</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold tracking-tight text-white/90">SolarAI</span>
            <span className="text-[9px] text-primary/60 font-medium tracking-[0.3em] uppercase">Smarter Solar</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">

          {view === 'selection' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-14">
                <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Bem-vindo.</h1>
                <p className="text-gray-400 text-base font-light leading-relaxed">Selecione o portal de acesso para continuar sua jornada na plataforma SolarAI.</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleProfileSelect('client')}
                  className="group relative w-full p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center gap-5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl font-light">person</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-white/90 group-hover:text-primary transition-colors">Portal do Cliente</h3>
                    <p className="text-xs text-gray-500 font-light">Gerencie seus agentes e leads</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600 transition-all text-sm group-hover:text-primary">arrow_forward</span>
                </button>

                <button
                  onClick={() => handleProfileSelect('admin')}
                  className="group relative w-full p-6 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center gap-5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl font-light">admin_panel_settings</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-white/90 group-hover:text-primary transition-colors">Portal de Gestão</h3>
                    <p className="text-xs text-gray-500 font-light">Administração completa da plataforma</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-600 transition-all text-sm group-hover:text-primary">arrow_forward</span>
                </button>
              </div>

              <div className="mt-14 pt-8 border-t border-white/[0.03] flex justify-center">
                <Link to="/help" className="text-xs text-gray-500 hover:text-primary flex items-center gap-2 transition-colors font-light tracking-wide">
                  <span className="material-symbols-outlined text-base">help</span>
                  SUPORTE AO CLIENTE
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button
                onClick={() => setView('selection')}
                className="mb-10 flex items-center gap-2 text-[10px] font-semibold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                VOLTAR
              </button>

              <div className="mb-12">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
                  {profileType === 'admin' ? 'ACESSO ADMINISTRATIVO' : 'ACESSO DO CLIENTE'}
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Identifique-se.</h1>
                <p className="text-gray-400 font-light">Insira suas credenciais cadastradas no sistema.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-3 animate-shake">
                  <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                  <p className="text-sm text-red-200/70 font-light">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-600 group-focus-within:text-primary transition-colors text-xl font-light">mail</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-4 pl-12 pr-4 text-white/90 font-light focus:ring-1 focus:ring-primary/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-700"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-600 group-focus-within:text-primary transition-colors text-xl font-light">lock</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-4 pl-12 pr-12 text-white/90 font-light focus:ring-1 focus:ring-primary/40 focus:bg-white/[0.06] outline-none transition-all placeholder:text-gray-700"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl font-light">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary/95 text-[#0a0f0d] font-bold text-base rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:bg-primary active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <span className="size-5 border-2 border-[#0a0f0d]/30 border-t-[#0a0f0d] rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>ACESSAR PLATAFORMA</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: VISUAL */}
      <div className="hidden lg:block flex-1 relative bg-[#0a0d0b] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop"
          alt="Solar Infrastructure"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.25] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f0d] via-transparent to-transparent"></div>

        {/* Minimal Floating Elements */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-24">
          <div className="max-w-xl space-y-10 text-left">
            <div className="h-0.5 w-12 bg-primary/60"></div>
            <h2 className="text-5xl font-bold text-white tracking-tight leading-[1.1]">
              Smart Energy <br />
              <span className="text-primary/90">Intelligence.</span>
            </h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed max-w-sm">
              Gestão simplificada e automatizada para a próxima geração da energia solar.
            </p>

            <div className="flex gap-12 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white/80 tracking-tight">+40%</span>
                <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Growth</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold text-white/80 tracking-tight">Real-time</span>
                <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
