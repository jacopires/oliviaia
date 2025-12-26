
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AgentDetails from './pages/AgentDetails';
import CreateAgent from './pages/CreateAgent';
import FlowEditor from './pages/FlowEditor';
import Monitor from './pages/Monitor';
import Integrations from './pages/Integrations';
import ModelConfig from './pages/ModelConfig';
import Help from './pages/Help';
import Login from './pages/Login';
import AdminClients from './pages/AdminClients';
import { AuthProvider, useAuth } from './components/AuthContext';

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
  const location = useLocation();

  if (loading) return null; // Or spinner, already handled by parent ProtectedRoute often

  if (!session || user?.user_metadata?.role !== 'admin') {
    // If logged in but not admin, redirect to dashboard or show unauthorized
    // If not logged in, redirect to login
    return <Navigate to={session ? "/" : "/login"} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex flex-row min-h-screen">
                <Sidebar />
                <main className="flex-1 lg:ml-72 flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/agents/:id" element={<AgentDetails />} />
                    <Route path="/agents/:id/model" element={<ModelConfig />} />
                    <Route path="/agents/:id/flow" element={<FlowEditor />} />
                    <Route path="/create-agent" element={<CreateAgent />} />
                    <Route path="/monitor" element={<Monitor />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/admin/clients" element={
                      <AdminRoute>
                        <AdminClients />
                      </AdminRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
