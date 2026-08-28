import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, FileText, LayoutDashboard, LogOut, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const groupedNav = [
    {
      title: 'Punto de venta',
      items: [
        { path: '/emission', icon: FileText, label: 'Nueva emisión', roles: ['CAJERO'] },
        { path: '/taxpayers', icon: Users, label: 'Contribuyentes', roles: ['CAJERO'] },
      ],
    },
    {
      title: 'Control',
      items: [
        { path: '/monitor', icon: Activity, label: 'Monitor DTE', roles: ['SUPERVISOR'] },
        { path: '/logs', icon: ShieldCheck, label: 'Bitácora', roles: ['SUPERVISOR'] },
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['GERENTE'] },
      ],
    },
  ];

  const visibleItems = groupedNav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(user?.role || '')),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-72 flex-col bg-[#0B192C] text-white shadow-2xl shadow-slate-950/20">
      <div className="border-b border-slate-700 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">ERP</p>
            <h1 className="text-2xl font-black tracking-tight">XiriCode</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        {visibleItems.map((group) => (
          <div key={group.title}>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              {group.title}
            </p>
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};