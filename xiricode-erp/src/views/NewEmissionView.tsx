import React, { useState } from 'react';
import { mockCustomers, mockProducts } from '../data/mockData';
import type { DTEItem } from '../types';
import { useNavigate } from 'react-router-dom';

export const NewEmissionView: React.FC = () => {
  const [cart, setCart] = useState<DTEItem[]>([]);
  const [customer, setCustomer] = useState(mockCustomers[0].id);
  const [type, setType] = useState('CREDITO_FISCAL');
  const navigate = useNavigate();

  const addToCart = (prodId: string) => {
    const p = mockProducts.find(p => p.id === prodId)!;
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id);
      if (existing) return prev.map(i => i.id === p.id ? {...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price} : i);
      return [...prev, { ...p, quantity: 1, subtotal: p.price }];
    });
  };

  const selectedCustomer = mockCustomers.find(c => c.id === customer)!;
  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const iva = type === 'CREDITO_FISCAL' ? subtotal * 0.13 : 0;
  const retencion = (selectedCustomer.isGranContribuyente && subtotal >= 113) ? subtotal * 0.01 : 0;
  const total = subtotal + iva - retencion;

  const handleEmit = () => {
    setTimeout(() => navigate('/monitor'), 800);
  };

  const jsonPreview = JSON.stringify({
    identificacion: { version: 3, ambiente: "01", tipoDte: type },
    emisor: { nit: "0614-123456-123-1", nrc: "12345-1", nombre: "AdventureWorks" },
    receptor: { documento: selectedCustomer.document, nombre: selectedCustomer.name },
    cuerpoDocumento: cart.map(i => ({ numItem: i.sku, cantidad: i.quantity, precioUni: i.price, subtotal: i.subtotal })),
    resumen: { subtotal, iva, retencion, totalPagar: total }
  }, null, 2);

  return (
    <div className="p-8 flex gap-6 h-[calc(100vh-4rem)]">
      <div className="w-2/3 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Nueva Emisión de DTE</h2>
          <button onClick={handleEmit} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 shadow-md transition-all">Firmar y Emitir DTE</button>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente Receptor</label>
            <select className="w-full p-2 border rounded" value={customer} onChange={e => setCustomer(e.target.value)}>
              {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
            <select className="w-full p-2 border rounded" value={type} onChange={e => setType(e.target.value)}>
              <option value="CREDITO_FISCAL">Comprobante de Crédito Fiscal (13% IVA)</option>
              <option value="FACTURA">Factura Consumidor Final</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex-1">
          <div className="flex gap-2 mb-4">
            {mockProducts.map(p => (
              <button key={p.id} onClick={() => addToCart(p.id)} className="bg-slate-100 px-3 py-2 rounded text-sm hover:bg-blue-100 border border-slate-200">+ {p.name}</button>
            ))}
          </div>
          
          <table className="w-full text-left text-sm text-slate-700 mb-8">
            <thead className="border-b"><tr><th className="py-2">CANT</th><th className="py-2">CÓDIGO</th><th className="py-2">DESCRIPCIÓN</th><th className="py-2">PRECIO</th><th className="py-2 text-right">SUBTOTAL</th></tr></thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3 font-semibold">{item.quantity}</td>
                  <td className="py-3 text-slate-500">{item.sku}</td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-medium">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-64 ml-auto space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Sumas:</span><span>${subtotal.toFixed(2)}</span></div>
            {type === 'CREDITO_FISCAL' && <div className="flex justify-between"><span>13% IVA:</span><span>${iva.toFixed(2)}</span></div>}
            {retencion > 0 && <div className="flex justify-between text-amber-600"><span>1% Retención:</span><span>-${retencion.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-xl text-slate-900 border-t pt-2 mt-2"><span>TOTAL:</span><span>${total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="w-1/3 bg-[#0B192C] rounded-xl flex flex-col overflow-hidden shadow-inner">
        <div className="bg-[#1E293B] p-3 text-xs font-mono text-emerald-400 border-b border-slate-700 flex justify-between"><span>Estructura DTE_JSON_v3.0</span><span className="text-amber-400">EN VIVO</span></div>
        <pre className="p-4 text-xs font-mono text-blue-300 overflow-y-auto h-full whitespace-pre-wrap">{jsonPreview}</pre>
      </div>
    </div>
  );
};