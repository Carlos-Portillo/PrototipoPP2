import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { NewEmissionView } from './views/NewEmissionView';
import { TaxpayersView } from './views/TaxpayersView';
import { DTEMonitorView } from './views/DTEMonitorView';
import { EventLogView } from './views/EventLogView';

const getRoleRedirect = (role?: string) => {
  switch (role) {
    case 'GERENTE':
      return '/dashboard';
    case 'SUPERVISOR':
      return '/monitor';
    case 'CAJERO':
    default:
      return '/emission';
  }
};

const PrivateRoute = ({ children, roles }: { children: React.ReactNode, roles: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={getRoleRedirect(user.role)} replace />;
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? getRoleRedirect(user.role) : '/login'} replace />} />
      <Route path="/login" element={!user ? <LoginView /> : <Navigate to={getRoleRedirect(user.role)} replace />} />
      <Route path="/dashboard" element={<PrivateRoute roles={['GERENTE']}><DashboardView /></PrivateRoute>} />
      <Route path="/emission" element={<PrivateRoute roles={['CAJERO']}><NewEmissionView /></PrivateRoute>} />
      <Route path="/taxpayers" element={<PrivateRoute roles={['CAJERO']}><TaxpayersView /></PrivateRoute>} />
      <Route path="/monitor" element={<PrivateRoute roles={['SUPERVISOR']}><DTEMonitorView /></PrivateRoute>} />
      <Route path="/logs" element={<PrivateRoute roles={['SUPERVISOR']}><EventLogView /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={user ? getRoleRedirect(user.role) : '/login'} replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}