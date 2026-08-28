import React, { useState } from 'react';
import { mockCustomers } from '../data/mockData';

export const TaxpayersView: React.FC = () => {
  const [type, setType] = useState<'NATURAL' | 'JURIDICA'>('NATURAL');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Registro de Contribuyentes</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4">
          <button onClick={() => setType('NATURAL')} className={`px-4 py-2 font-medium rounded-lg ${type === 'NATURAL' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>Persona Natural</button>
          <button onClick={() => setType('JURIDICA')} className={`px-4 py-2 font-medium rounded-lg ${type === 'JURIDICA' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>Persona Jurídica</button>
        </div>
        <form className="grid grid-cols-2 gap-6" onSubmit={e => e.preventDefault()}>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">{type === 'NATURAL' ? 'Nombre Completo' : 'Razón Social'}</label><input type="text" className="w-full border border-slate-300 rounded-lg p-2" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label><input type="text" className="w-full border border-slate-300 rounded-lg p-2" /></div>
          {type === 'NATURAL' ? (
            <div><label className="block text-sm font-medium text-slate-700 mb-1">DUI (########-#)</label><input type="text" placeholder="00000000-0" pattern="\d{8}-\d{1}" className="w-full border border-slate-300 rounded-lg p-2" /></div>
          ) : (
            <>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">NIT (14 dígitos)</label><input type="text" placeholder="0000-000000-000-0" className="w-full border border-slate-300 rounded-lg p-2" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">NRC (Registro)</label><input type="text" placeholder="123456-7" className="w-full border border-slate-300 rounded-lg p-2" /></div>
            </>
          )}
          <div className="col-span-2 flex justify-end mt-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Registrar Contribuyente</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
            <tr><th className="p-4">Cliente</th><th className="p-4">Tipo</th><th className="p-4">Documento</th><th className="p-4">NRC</th></tr>
          </thead>
          <tbody>
            {mockCustomers.map(c => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{c.name}</td>
                <td className="p-4">{c.type}</td>
                <td className="p-4">{c.document}</td>
                <td className="p-4">{c.nrc || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};