import React, { useMemo, useState } from 'react';
import { Download, FileDown, Printer, QrCode, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { mockCustomers, mockProducts } from '../data/mockData';
import type { DTEItem } from '../types';
import { useNavigate } from 'react-router-dom';

export const NewEmissionView: React.FC = () => {
  const [items, setItems] = useState<Record<string, number>>({});
  const [customerId, setCustomerId] = useState(mockCustomers[0].id);
  const [type, setType] = useState('CREDITO_FISCAL');
  const navigate = useNavigate();

  const cart: DTEItem[] = useMemo(() => {
    return mockProducts
      .filter((product) => (items[product.id] ?? 0) > 0)
      .map((product) => ({
        ...product,
        quantity: items[product.id] ?? 0,
        subtotal: (items[product.id] ?? 0) * product.price,
      }));
  }, [items]);

  const selectedCustomer = mockCustomers.find((customer) => customer.id === customerId) ?? mockCustomers[0];
  const subtotal = cart.reduce((total, item) => total + item.subtotal, 0);
  const iva = type === 'CREDITO_FISCAL' ? subtotal * 0.13 : 0;
  const retencion = selectedCustomer.isGranContribuyente && subtotal >= 113 ? subtotal * 0.01 : 0;
  const total = subtotal + iva - retencion;

  const addProduct = (productId: string) => {
    setItems((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const updateQuantity = (productId: string, nextQuantity: number) => {
    setItems((current) => ({
      ...current,
      [productId]: nextQuantity > 0 ? nextQuantity : 0,
    }));
  };

  const handleEmit = () => {
    setTimeout(() => navigate('/monitor'), 700);
  };

  const dteNumber = 'DTE-2026-000184';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">Punto de venta</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Nueva emisión</h2>
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            <FileDown className="h-4 w-4" />
            Guardar borrador
          </button>
          <button
            onClick={handleEmit}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
          >
            <Sparkles className="h-4 w-4" />
            Firmar y emitir DTE
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-700">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Datos de la factura</p>
                <p className="text-xs text-slate-500">Completa la información antes de enviar</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Cliente receptor</label>
                <select
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-cyan-400"
                >
                  {mockCustomers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Tipo de documento</label>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-cyan-400"
                >
                  <option value="CREDITO_FISCAL">Crédito fiscal</option>
                  <option value="FACTURA">Factura consumidor final</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">NRC / Documento</label>
                <input
                  value={selectedCustomer.document}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Fecha de emisión</label>
                <input
                  type="date"
                  defaultValue="2026-08-27"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Productos y servicios</p>
                <p className="text-xs text-slate-500">Agrega ítems al comprobante</p>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {mockProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product.id)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  + {product.name}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Producto</th>
                    <th className="px-4 py-3 font-semibold">Precio</th>
                    <th className="px-4 py-3 font-semibold">Cantidad</th>
                    <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                        Aún no agregas productos a la emisión.
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.sku}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                            className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-center text-slate-800 outline-none focus:border-cyan-400"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          ${item.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl shadow-slate-900/20">
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-xs uppercase tracking-[0.25em] text-slate-400">
            <span>Vista previa DTE</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
              válido
            </span>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Factura electrónica</p>
                <h3 className="mt-2 text-2xl font-black text-white">{dteNumber}</h3>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Emisor</span>
                <span>F-2026</span>
              </div>
              <p className="mt-2 text-lg font-bold text-white">AdventureWorks El Salvador</p>
              <p className="text-sm text-slate-300">0614-123456-123-1</p>
            </div>

            <div className="space-y-2 border-b border-slate-800 pb-4 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Cliente</span>
                <span className="font-medium text-white">{selectedCustomer.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Documento</span>
                <span className="font-medium text-white">{selectedCustomer.document}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha</span>
                <span className="font-medium text-white">27/08/2026</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {cart.length === 0 ? (
                <p className="text-slate-400">No hay productos agregados.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-slate-300">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.quantity} und.</p>
                    </div>
                    <span className="font-medium text-white">${item.subtotal.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              {retencion > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Retención</span>
                  <span>-${retencion.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-700 pt-2 text-base font-bold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-slate-900">
                <QrCode className="h-7 w-7" />
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>Código de seguridad</p>
                <p className="mt-1 font-mono text-cyan-300">A7F2-9D8C</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
              <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-3 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                <Download className="h-4 w-4" />
                PDF
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};