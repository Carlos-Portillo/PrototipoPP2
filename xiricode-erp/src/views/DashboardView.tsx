import React from 'react';
import { useOperations } from '../context/OperationsContext';

export const DashboardView: React.FC = () => {
  const { dtes } = useOperations();
  const recentDTEs = dtes.slice(0, 6);
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dashboard de Control Fiscal y Operativo</h2>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Documentos Emitidos</p>
          <p className="text-3xl font-black text-[#0B192C]">12,842</p>
          <p className="text-emerald-500 text-xs mt-2 font-medium">↑ +12.5% vs Mes Anterior</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Tasa de Aceptación MH</p>
          <p className="text-3xl font-black text-emerald-600">99.4%</p>
          <p className="text-slate-400 text-xs mt-2 font-medium">Conexión Estable</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase mb-1">Promedio Emisiones / Hora</p>
          <p className="text-3xl font-black text-[#0B192C]">38.2</p>
          <p className="text-slate-400 text-xs mt-2 font-medium">Pico: 11:00 AM</p>
        </div>
        <div className="bg-amber-400 p-6 rounded-xl border border-amber-500 shadow-sm flex flex-col justify-between text-amber-900">
          <p className="text-amber-900 text-xs font-bold uppercase mb-1">Alertas Reabastecimiento</p>
          <p className="text-4xl font-black">14</p>
          <p className="text-amber-800 text-xs font-medium uppercase tracking-wider mt-2">Kardex AdventureWorks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Estado de Transmisión DTE</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-emerald-700">Transmitidos y Aceptados</span><span>11,245</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-[#0B192C] h-3 rounded-full" style={{ width: '85%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-amber-600">Pendientes en Cola Local</span><span>1,539</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-amber-400 h-3 rounded-full" style={{ width: '12%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium"><span className="text-red-600">Rechazados por MH</span><span>58</span></div>
              <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-red-500 h-3 rounded-full" style={{ width: '3%' }}></div></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Monitoreo de Documentos Recientes</h3>
          <table className="w-full text-left text-sm text-slate-600">
            <thead><tr className="border-b uppercase text-xs text-slate-400"><th className="pb-2">ID</th><th className="pb-2">Cliente</th><th className="pb-2">Monto</th><th className="pb-2">Estado</th></tr></thead>
            <tbody>
              {recentDTEs.map(dte => (
                <tr key={dte.controlNumber} className="border-b border-slate-50 last:border-0">
                  <td className="py-3 font-mono text-xs">{dte.controlNumber.slice(-8)}</td>
                  <td className="py-3 font-medium text-slate-800">{dte.customer.name}</td>
                  <td className="py-3">${dte.total.toFixed(2)}</td>
                  <td className="py-3"><span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${dte.status === 'EMITIDO' ? 'bg-emerald-100 text-emerald-700' : dte.status === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{dte.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};