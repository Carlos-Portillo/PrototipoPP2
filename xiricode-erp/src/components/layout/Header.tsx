import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOperations } from '../../context/OperationsContext';
import { Bell, ChevronDown, CloudOff, Search, Wifi } from 'lucide-react';
import type { Role } from '../../types';

export const Header: React.FC = () => {
  const { user, login } = useAuth();
  const { mhStatus, toggleMhStatus, dtes } = useOperations();
  const pendingCount = dtes.filter((dte) => dte.status === 'PENDIENTE').length;
  const isContingency = mhStatus === 'CONTINGENCIA';

  return (
    <header className="fixed left-72 right-0 top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex w-full max-w-lg items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar transacciones, clientes o DTE"
            className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleMhStatus}
            title="Simulación: alterna el estado de conexión con el Ministerio de Hacienda"
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
              isContingency
                ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className={`relative flex h-2 w-2 rounded-full ${isContingency ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              {!isContingency && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
            </span>
            {isContingency ? <CloudOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
            {isContingency ? `Modo contingencia (${pendingCount} en cola)` : 'Conexión MH estable'}
          </button>

          <button className="relative rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:text-cyan-600">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              3
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-700">
              {user?.name?.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{user?.role}</p>
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-transparent pr-6 text-xs font-medium text-slate-600 outline-none"
                value={user?.role}
                onChange={(e) => login(e.target.value as Role)}
              >
                <option value="CAJERO">Cajero</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="BODEGUERO">Bodeguero</option>
                <option value="GESTOR_COMPRAS">Gestor de Compras</option>
                <option value="GERENTE">Gerente</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};