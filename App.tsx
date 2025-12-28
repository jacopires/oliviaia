
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AgentDetails from './pages/AgentDetails';
import CreateAgent from './pages/CreateAgent';
import FlowEditor from './pages/FlowEditor';
import Monitor from './pages/Monitor';
import Integrations from './pages/Integrations';
import ModelConfig from './pages/ModelConfig';
import Help from './pages/Help';
import Login from './pages/Login';
import AdminClients from './pages/AdminClients';
import ClientDetails from './pages/ClientDetails';
import AdminTokens from './pages/AdminTokens';
import AdminFinancial from './pages/AdminFinancial';
import AdminInfra from './pages/AdminInfra';
import AdminSettings from './pages/AdminSettings';
import Settings from './pages/Settings';
import Agents from './pages/Agents';
import ComingSoon from './components/ComingSoon';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ToastProvider } from './components/ToastProvider';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <span className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          <p className="text-primary font-bold uppercase tracking-widest text-sm">Carregando Sistema...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, user, loading } = useAuth();

  if (loading) return null;

  if (!session || user?.user_metadata?.role !== 'admin') {
    return <Navigate to={session ? "/" : "/login"} replace />;
  }

  return <>{children}</>;
};

const RootDashboard = () => {
  const { user } = useAuth();
  // If admin, show Admin Dashboard. If normal user, show classic Dashboard
  return user?.user_metadata?.role === 'admin' ? <AdminDashboard /> : <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex flex-row min-h-screen">
                  <Sidebar />
                  <main className="flex-1 lg:ml-72 flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
                    <Routes>
                      <Route path="/" element={<RootDashboard />} />
                      <Route path="/agents/:id" element={<AgentDetails />} />
                      <Route path="/agents/:id/model" element={<ModelConfig />} />
                      <Route path="/agents/:id/flow" element={<FlowEditor />} />
                      <Route path="/create-agent" element={<CreateAgent />} />
                      <Route path="/monitor" element={<Monitor />} />
                      <Route path="/integrations" element={<Integrations />} />
                      <Route path="/help" element={<Help />} />

                      {/* Admin Routes */}
                      <Route path="/admin-clients" element={
                        <AdminRoute>
                          <AdminClients />
                        </AdminRoute>
                      } />
                      <Route path="/admin-clients/:id" element={
                        <AdminRoute>
                          <ClientDetails />
                        </AdminRoute>
                      } />
                      <Route path="/admin-tokens" element={
                        <AdminRoute>
                          <AdminTokens />
                        </AdminRoute>
                      } />
                      <Route path="/admin-financial" element={
                        <AdminRoute>
                          <AdminFinancial />
                        </AdminRoute>
                      } />
                      <Route path="/admin-infra" element={
                        <AdminRoute>
                          <AdminInfra />
                        </AdminRoute>
                      } />
                      <Route path="/admin-settings" element={
                        <AdminRoute>
                          <AdminSettings />
                        </AdminRoute>
                      } />

                      {/* User Routes */}
                      <Route path="/agents" element={<Agents />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Catch all redirect */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
