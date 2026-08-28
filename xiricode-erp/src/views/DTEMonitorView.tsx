import React from 'react';
import { mockDTEs } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { DownloadCloud, RefreshCw } from 'lucide-react';

export const DTEMonitorView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Monitor de Control y Trazabilidad DTE</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"><DownloadCloud size={16}/> Exportar Excel</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><RefreshCw size={16}/> Sincronizar Hacienda</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Emitidos Hoy</p>
          <p className="text-3xl font-bold text-slate-800">1,284</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Pendientes Firma</p>
          <p className="text-3xl font-bold text-slate-800">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Rechazados MH</p>
          <p className="text-3xl font-bold text-slate-800">7</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-[#0B192C] text-white">
            <tr><th className="p-4">FECHA/HORA</th><th className="p-4">CLIENTE</th><th className="p-4">TIPO DTE</th><th className="p-4">CONTROL / UUID</th><th className="p-4">MONTO</th><th className="p-4">ESTADO</th></tr>
          </thead>
          <tbody>
            {mockDTEs.map(dte => (
              <tr 
                key={dte.controlNumber} 
                onClick={() => dte.status === 'RECHAZADO' && navigate('/logs')}
                className={`border-b border-slate-100 ${dte.status === 'RECHAZADO' ? 'bg-red-50 cursor-pointer hover:bg-red-100' : 'hover:bg-slate-50'}`}
              >
                <td className="p-4">{new Date(dte.date).toLocaleString()}</td>
                <td className="p-4 font-medium">{dte.customer.name}</td>
                <td className="p-4">{dte.type}</td>
                <td className="p-4"><div className="font-mono">{dte.controlNumber}</div><div className="text-xs text-slate-400">{dte.uuid}</div></td>
                <td className="p-4 font-bold">${dte.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    dte.status === 'EMITIDO' ? 'bg-emerald-100 text-emerald-700' :
                    dte.status === 'PENDIENTE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>{dte.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};