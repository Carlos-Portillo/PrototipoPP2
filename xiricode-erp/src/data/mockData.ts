import type { Customer, Product, DTE, EventLog } from '../types';

export const mockCustomers: Customer[] = [
  { id: '1', type: 'JURIDICA', name: 'Almacenes Simán S.A.', address: 'San Salvador', document: '0614-010180-101-1', nrc: '123456-1', isGranContribuyente: true },
  { id: '2', type: 'JURIDICA', name: 'Industrias La Constancia', address: 'San Salvador', document: '0614-020280-102-2', nrc: '654321-2', isGranContribuyente: true },
  { id: '3', type: 'JURIDICA', name: 'Distribuidora El Sol', address: 'Santa Ana', document: '0210-030380-103-3', nrc: '789012-3', isGranContribuyente: false },
  { id: '4', type: 'NATURAL', name: 'Consumidor Final', address: 'San Miguel', document: '01234567-8', isGranContribuyente: false }
];

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Road-150 Red 48', sku: 'BK-R93R-48', price: 1450.99, stock: 12 },
  { id: 'p2', name: 'Mountain-200 Black 42', sku: 'BK-M82B-42', price: 1250.00, stock: 5 },
  { id: 'p3', name: 'Sport-100 Helmet, Red', sku: 'HL-U509-R', price: 34.99, stock: 50 }
];

export const mockDTEs: DTE[] = [
  { controlNumber: 'DTE-01-0001452', uuid: 'a1b2c3d4', date: '2026-10-23T14:25:00', customer: mockCustomers[0], type: 'CREDITO_FISCAL', items: [], subtotal: 4250, iva: 552.5, retention: 42.5, total: 4760, status: 'EMITIDO' },
  { controlNumber: 'DTE-01-0001453', uuid: 'e5f6g7h8', date: '2026-10-23T15:30:00', customer: mockCustomers[1], type: 'CREDITO_FISCAL', items: [], subtotal: 1840.50, iva: 239.26, retention: 18.40, total: 2061.36, status: 'PENDIENTE' },
  { controlNumber: 'DTE-01-0001454', uuid: 'i9j0k1l2', date: '2026-10-23T15:32:00', customer: mockCustomers[2], type: 'CREDITO_FISCAL', items: [], subtotal: 620.00, iva: 80.60, retention: 0, total: 700.60, status: 'RECHAZADO' }
];

export const mockLogs: EventLog[] = [
  { id: 'LOG-001', emissionId: 'DTE-01-0001454', type: 'Crédito Fiscal', timestamp: '2026-10-23T15:32:10', errorCode: 'MH-403: Firma digital inválida o token JWT expirado', actionRequired: 'Renovar certificado' }
];