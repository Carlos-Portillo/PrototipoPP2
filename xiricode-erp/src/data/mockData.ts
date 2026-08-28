import type { Customer, Product, DTE, EventLog } from '../types';

export const mockCustomers: Customer[] = [
  { id: '1', type: 'JURIDICA', name: 'Almacenes Simán S.A.', address: 'San Salvador', document: '0614-010180-101-1', nrc: '123456-1', isGranContribuyente: true },
  { id: '2', type: 'JURIDICA', name: 'Industrias La Constancia', address: 'San Salvador', document: '0614-020280-102-2', nrc: '654321-2', isGranContribuyente: true },
  { id: '3', type: 'JURIDICA', name: 'Distribuidora El Sol', address: 'Santa Ana', document: '0210-030380-103-3', nrc: '789012-3', isGranContribuyente: false },
  { id: '4', type: 'NATURAL', name: 'Consumidor Final', address: 'San Miguel', document: '01234567-8', isGranContribuyente: false }
];

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Road-150 Red 48', sku: 'BK-R93R-48', price: 1450.99, stock: 12, minStock: 10, category: 'Bicicletas', warehouse: 'Bodega Central' },
  { id: 'p2', name: 'Mountain-200 Black 42', sku: 'BK-M82B-42', price: 1250.00, stock: 5, minStock: 8, category: 'Bicicletas', warehouse: 'Bodega Central' },
  { id: 'p3', name: 'Sport-100 Helmet, Red', sku: 'HL-U509-R', price: 34.99, stock: 50, minStock: 20, category: 'Accesorios', warehouse: 'Bodega Central' },
  { id: 'p4', name: 'Road-650 Black 60', sku: 'BK-R89B-60', price: 782.99, stock: 3, minStock: 6, category: 'Bicicletas', warehouse: 'Sucursal Santa Ana' },
  { id: 'p5', name: 'Water Bottle - 30 oz.', sku: 'AC-BOT-30', price: 4.99, stock: 120, minStock: 40, category: 'Accesorios', warehouse: 'Bodega Central' },
  { id: 'p6', name: 'Touring-3000 Blue 54', sku: 'BK-T30B-54', price: 742.35, stock: 0, minStock: 5, category: 'Bicicletas', warehouse: 'Sucursal San Miguel' },
  { id: 'p7', name: 'LL Bottom Bracket', sku: 'BB-LL-001', price: 15.75, stock: 9, minStock: 15, category: 'Repuestos', warehouse: 'Bodega Central' },
  { id: 'p8', name: 'Chain Lock Cable', sku: 'AC-LOCK-01', price: 18.50, stock: 32, minStock: 15, category: 'Accesorios', warehouse: 'Sucursal Santa Ana' },
  { id: 'p9', name: 'Half-Finger Gloves, M', sku: 'AC-GLV-M', price: 24.49, stock: 6, minStock: 12, category: 'Accesorios', warehouse: 'Bodega Central' },
  { id: 'p10', name: 'Mountain Tire Tube', sku: 'RP-TUBE-M', price: 4.20, stock: 60, minStock: 25, category: 'Repuestos', warehouse: 'Sucursal San Miguel' }
];

export const mockDTEs: DTE[] = [
  { controlNumber: 'DTE-01-0001452', uuid: 'a1b2c3d4', date: '2026-10-23T14:25:00', customer: mockCustomers[0], type: 'CREDITO_FISCAL', items: [], subtotal: 4250, iva: 552.5, retention: 42.5, total: 4760, status: 'EMITIDO' },
  { controlNumber: 'DTE-01-0001453', uuid: 'e5f6g7h8', date: '2026-10-23T15:30:00', customer: mockCustomers[1], type: 'CREDITO_FISCAL', items: [], subtotal: 1840.50, iva: 239.26, retention: 18.40, total: 2061.36, status: 'PENDIENTE' },
  { controlNumber: 'DTE-01-0001454', uuid: 'i9j0k1l2', date: '2026-10-23T15:32:00', customer: mockCustomers[2], type: 'CREDITO_FISCAL', items: [], subtotal: 620.00, iva: 80.60, retention: 0, total: 700.60, status: 'RECHAZADO' }
];

export const mockLogs: EventLog[] = [
  { id: 'LOG-001', emissionId: 'DTE-01-0001454', type: 'Crédito Fiscal', timestamp: '2026-10-23T15:32:10', errorCode: 'MH-403: Firma digital inválida o token JWT expirado', actionRequired: 'Renovar certificado' }
];