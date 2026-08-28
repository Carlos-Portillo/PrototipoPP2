import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Users, Activity, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['GERENTE'] },
    { path: '/emission', icon: FileText, label: 'Nueva Emisión', roles: ['CAJERO'] },
    { path: '/taxpayers', icon: Users, label: 'Contribuyentes', roles: ['CAJERO'] },
    { path: '/monitor', icon: Activity, label: 'Monitor DTE', roles: ['SUPERVISOR'] },
    { path: '/logs', icon: Activity, label: 'Bitácora', roles: ['SUPERVISOR'] }
  ];

  return (
    <aside className="w-64 bg-[#0B192C] text-white flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">XiriCode</h1>
        <p className="text-xs text-blue-400 mt-1 uppercase">ERP Enterprise Console</p>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.filter(item => item.roles.includes(user?.role || '')).map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-[#1E293B]'}`}>
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <button onClick={logout} className="flex items-center gap-3 text-slate-300 hover:text-white w-full px-4 py-2">
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};