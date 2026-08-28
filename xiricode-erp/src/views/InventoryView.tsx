import React, { useMemo, useState } from 'react';
import { mockProducts } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  PackageSearch,
  Search,
  XCircle,
} from 'lucide-react';

type StockStatus = 'OK' | 'BAJO' | 'AGOTADO';

const getStatus = (stock: number, minStock: number): StockStatus => {
  if (stock <= 0) return 'AGOTADO';
  if (stock < minStock) return 'BAJO';
  return 'OK';
};

const statusStyles: Record<StockStatus, { label: string; badge: string; bar: string; icon: React.ReactNode }> = {
  OK: {
    label: 'Stock OK',
    badge: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-emerald-500',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  BAJO: {
    label: 'Stock bajo',
    badge: 'bg-amber-100 text-amber-700',
    bar: 'bg-amber-500',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  AGOTADO: {
    label: 'Agotado',
    badge: 'bg-red-100 text-red-700',
    bar: 'bg-red-500',
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export const InventoryView: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'TODOS' | StockStatus>('TODOS');
  const [warehouseFilter, setWarehouseFilter] = useState('TODAS');
  const [requestedOrders, setRequestedOrders] = useState<Record<string, boolean>>({});

  const isGestorCompras = user?.role === 'GESTOR_COMPRAS';

  const warehouses = useMemo(
    () => Array.from(new Set(mockProducts.map((product) => product.warehouse))),
    []
  );

  const enrichedProducts = useMemo(
    () =>
      mockProducts.map((product) => ({
        ...product,
        status: getStatus(product.stock, product.minStock),
      })),
    []
  );

  const filteredProducts = useMemo(() => {
    return enrichedProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'TODOS' || product.status === statusFilter;
      const matchesWarehouse = warehouseFilter === 'TODAS' || product.warehouse === warehouseFilter;
      return matchesSearch && matchesStatus && matchesWarehouse;
    });
  }, [enrichedProducts, search, statusFilter, warehouseFilter]);

  const totalProducts = enrichedProducts.length;
  const lowStockCount = enrichedProducts.filter((p) => p.status === 'BAJO').length;
  const outOfStockCount = enrichedProducts.filter((p) => p.status === 'AGOTADO').length;
  const inventoryValue = enrichedProducts.reduce((sum, p) => sum + p.price * p.stock, 0);

  const handleRequestOrder = (productId: string) => {
    setRequestedOrders((current) => ({ ...current, [productId]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
            {isGestorCompras ? 'Gestión de compras' : 'Control de bodega'}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Kardex de Inventario</h2>
          <p className="mt-1 text-sm text-slate-500">
            Existencias trazables por sucursal, con alertas automáticas de reabastecimiento.
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-700">
          <PackageSearch className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase text-slate-500">Productos en catálogo</p>
          <p className="text-3xl font-black text-[#0B192C]">{totalProducts}</p>
          <p className="mt-2 text-xs font-medium text-slate-400">{warehouses.length} bodegas activas</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase text-amber-600">Stock bajo el mínimo</p>
          <p className="text-3xl font-black text-amber-600">{lowStockCount}</p>
          <p className="mt-2 text-xs font-medium text-slate-400">Requieren orden de compra</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase text-red-600">Productos agotados</p>
          <p className="text-3xl font-black text-red-600">{outOfStockCount}</p>
          <p className="mt-2 text-xs font-medium text-slate-400">Sin unidades disponibles</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase text-slate-500">Valor total en bodega</p>
          <p className="text-3xl font-black text-[#0B192C]">
            {inventoryValue.toLocaleString('es-SV', { style: 'currency', currency: 'USD' })}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">Costo a precio de venta</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-5">
          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por producto o SKU..."
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'TODOS' | StockStatus)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="OK">Stock OK</option>
            <option value="BAJO">Stock bajo</option>
            <option value="AGOTADO">Agotado</option>
          </select>

          <select
            value={warehouseFilter}
            onChange={(event) => setWarehouseFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="TODAS">Todas las bodegas</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse} value={warehouse}>
                {warehouse}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Producto</th>
                <th className="px-5 py-3 font-semibold">Bodega</th>
                <th className="px-5 py-3 font-semibold">Stock actual / mínimo</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold">Valor</th>
                {isGestorCompras && <th className="px-5 py-3 font-semibold text-right">Acción</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={isGestorCompras ? 6 : 5} className="px-5 py-10 text-center text-slate-500">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const style = statusStyles[product.status];
                  const ratio = Math.min(100, Math.round((product.stock / (product.minStock * 2 || 1)) * 100));
                  const alreadyRequested = requestedOrders[product.id];

                  return (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{product.name}</p>
                        <p className="text-xs text-slate-500">
                          {product.sku} · {product.category}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{product.warehouse}</td>
                      <td className="px-5 py-4">
                        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                          <span>{product.stock} und.</span>
                          <span className="text-slate-400">mín. {product.minStock}</span>
                        </div>
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                          <div className={`h-2 rounded-full ${style.bar}`} style={{ width: `${ratio}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${style.badge}`}
                        >
                          {style.icon}
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {(product.price * product.stock).toLocaleString('es-SV', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </td>
                      {isGestorCompras && (
                        <td className="px-5 py-4 text-right">
                          {product.status === 'OK' ? (
                            <span className="text-xs text-slate-400">Sin acción requerida</span>
                          ) : (
                            <button
                              onClick={() => handleRequestOrder(product.id)}
                              disabled={alreadyRequested}
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                alreadyRequested
                                  ? 'cursor-not-allowed bg-emerald-100 text-emerald-700'
                                  : 'bg-[#0B192C] text-white hover:bg-slate-800'
                              }`}
                            >
                              <ClipboardList className="h-3.5 w-3.5" />
                              {alreadyRequested ? 'Orden generada' : 'Generar orden de compra'}
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
