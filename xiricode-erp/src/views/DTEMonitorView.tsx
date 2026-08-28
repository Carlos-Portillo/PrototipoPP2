import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudOff, DownloadCloud, Loader2, RefreshCw } from 'lucide-react';
import { useOperations } from '../context/OperationsContext';

export const DTEMonitorView: React.FC = () => {
  const navigate = useNavigate();
  const { dtes, mhStatus, isSyncing, lastSyncAt, syncPending } = useOperations();
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

  const isContingency = mhStatus === 'CONTINGENCIA';
  const emitidos = dtes.filter((dte) => dte.status === 'EMITIDO').length;
  const pendientes = dtes.filter((dte) => dte.status === 'PENDIENTE').length;
  const rechazados = dtes.filter((dte) => dte.status === 'RECHAZADO').length;

  const handleSync = async () => {
    setSyncMessage(null);
    const result = await syncPending();

    if (result.skipped) {
      setSyncMessage({
        type: 'warning',
        text: 'No fue posible sincronizar: los servidores del Ministerio de Hacienda siguen sin responder (modo contingencia activo). Se reintentará automáticamente al reestablecerse la conexión.',
      });
      return;
    }

    if (result.synced === 0 && result.rejected === 0) {
      setSyncMessage({ type: 'success', text: 'No hay documentos pendientes por sincronizar.' });
      return;
    }

    setSyncMessage({
      type: 'success',
      text: `Sincronización completa: ${result.synced} documento(s) transmitidos y aceptados${
        result.rejected > 0 ? `, ${result.rejected} rechazado(s) por el MH` : ''
      }.`,
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Monitor de Control y Trazabilidad DTE</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
            <DownloadCloud size={16} /> Exportar Excel
          </button>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
              isSyncing ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Hacienda'}
          </button>
        </div>
      </div>

      {isContingency && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <CloudOff className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">
            <strong>Modo de contingencia activo.</strong> El sistema está encolando los DTE de forma local ante la
            indisponibilidad del Ministerio de Hacienda. El módulo de <em>Health Checks</em> reintentará la
            transmisión automáticamente en cuanto detecte que el servicio fue restablecido (alterna el estado desde
            el encabezado superior).
          </p>
        </div>
      )}

      {syncMessage && (
        <div
          className={`mb-6 rounded-xl border p-4 text-sm ${
            syncMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-amber-200 bg-amber-50 text-amber-800'
          }`}
        >
          {syncMessage.text}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Emitidos</p>
          <p className="text-3xl font-bold text-slate-800">{emitidos}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Pendientes / En cola</p>
          <p className="text-3xl font-bold text-slate-800">{pendientes}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Rechazados MH</p>
          <p className="text-3xl font-bold text-slate-800">{rechazados}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 text-xs text-slate-400">
          <span>Trazabilidad de documentos</span>
          <span>{lastSyncAt ? `Última sincronización: ${new Date(lastSyncAt).toLocaleTimeString()}` : 'Aún sin sincronizar'}</span>
        </div>
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-[#0B192C] text-white">
            <tr>
              <th className="p-4">FECHA/HORA</th>
              <th className="p-4">CLIENTE</th>
              <th className="p-4">TIPO DTE</th>
              <th className="p-4">CONTROL / UUID</th>
              <th className="p-4">MONTO</th>
              <th className="p-4">ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {dtes.map((dte) => (
              <tr
                key={dte.controlNumber}
                onClick={() => dte.status === 'RECHAZADO' && navigate('/logs')}
                className={`border-b border-slate-100 ${
                  dte.status === 'RECHAZADO' ? 'bg-red-50 cursor-pointer hover:bg-red-100' : 'hover:bg-slate-50'
                }`}
              >
                <td className="p-4">{new Date(dte.date).toLocaleString()}</td>
                <td className="p-4 font-medium">{dte.customer.name}</td>
                <td className="p-4">{dte.type}</td>
                <td className="p-4">
                  <div className="font-mono">{dte.controlNumber}</div>
                  <div className="text-xs text-slate-400">{dte.uuid}</div>
                </td>
                <td className="p-4 font-bold">${dte.total.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold ${
                      dte.status === 'EMITIDO'
                        ? 'bg-emerald-100 text-emerald-700'
                        : dte.status === 'PENDIENTE'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {dte.status === 'PENDIENTE' && dte.contingency && <CloudOff className="h-3 w-3" />}
                    {dte.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
