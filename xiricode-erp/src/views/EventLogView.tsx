import React, { useState } from 'react';
import { mockLogs } from '../data/mockData';
import { AlertOctagon, RotateCcw, ServerCrash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EventLogView: React.FC = () => {
  const [resolved, setResolved] = useState(false);
  const navigate = useNavigate();

  const handleRetry = () => {
    setResolved(true);
    setTimeout(() => navigate('/monitor'), 1500);
  };

  return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-4 mb-8 shadow-sm">
        <AlertOctagon className="text-red-600 mt-1" size={28} />
        <div>
          <h3 className="text-red-800 font-bold text-lg">DTE Rechazado por el Ministerio de Hacienda - Error de Validación</h3>
          <p className="text-red-600 text-sm mt-1">Se ha detectado una interrupción en el flujo de transmisión. La firma digital ha sido rechazada por el validador fiscal.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="bg-slate-50 p-4 border-b border-slate-200 font-semibold text-slate-700">Listado de Incidencias Recientes</div>
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-white text-slate-500 uppercase text-xs">
            <tr><th className="p-4">ID EMISIÓN</th><th className="p-4">FECHA/HORA</th><th className="p-4">CÓDIGO DE ERROR</th><th className="p-4">ACCIÓN REQUERIDA</th></tr>
          </thead>
          <tbody>
            {mockLogs.map(log => (
              <tr key={log.id} className="border-t border-slate-100">
                <td className="p-4 font-mono font-medium">{log.emissionId}</td>
                <td className="p-4">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 text-red-600 font-medium bg-red-50">{log.errorCode}</td>
                <td className="p-4">{log.actionRequired}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-slate-50 flex justify-end gap-4 border-t border-slate-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
            <RotateCcw size={16} /> Ejecutar Rollback Transaccional (Spring Data JPA)
          </button>
          <button onClick={handleRetry} className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium transition ${resolved ? 'bg-emerald-600' : 'bg-[#0B192C] hover:bg-slate-800'}`}>
            <ServerCrash size={16} /> {resolved ? 'Transmitido (200 OK)' : 'Reintentar Transmisión'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500 text-sm font-semibold uppercase">Total Rechazos Hoy</p>
          <p className="text-3xl font-bold text-red-600 mt-2">14</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500 text-sm font-semibold uppercase">Latencia Promedio MH</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">2.4s</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center shadow-sm">
          <p className="text-red-800 text-sm font-semibold uppercase">Estado Firma Digital</p>
          <p className="text-2xl font-black text-red-600 mt-2 tracking-widest">CADUCADO</p>
        </div>
      </div>
    </div>
  );
};