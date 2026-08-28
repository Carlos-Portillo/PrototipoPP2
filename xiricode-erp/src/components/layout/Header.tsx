import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, login } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 ml-64 fixed top-0 right-0 left-0 z-10">
      <div className="flex items-center bg-slate-100 px-4 py-2 rounded-lg w-96">
        <Search size={18} className="text-slate-400 mr-2" />
        <input type="text" placeholder="Buscar transacciones, clientes..." className="bg-transparent border-none outline-none w-full text-sm" />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-blue-600">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
          <select 
            className="text-xs bg-slate-100 border border-slate-300 rounded p-1 outline-none"
            value={user?.role} 
            onChange={(e) => login(e.target.value as any)}
          >
            <option value="CAJERO">Perfil: Cajero</option>
            <option value="SUPERVISOR">Perfil: Supervisor</option>
            <option value="GERENTE">Perfil: Gerente</option>
          </select>
        </div>
      </div>
    </header>
  );
};