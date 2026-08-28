export type Role = 'CAJERO' | 'SUPERVISOR' | 'GERENTE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
}

export interface Customer {
  id: string;
  type: 'NATURAL' | 'JURIDICA';
  name: string;
  address: string;
  document: string; // DUI or NIT
  nrc?: string;
  isGranContribuyente: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export interface DTEItem extends Product {
  quantity: number;
  subtotal: number;
}

export interface DTE {
  controlNumber: string;
  uuid: string;
  date: string;
  customer: Customer;
  type: 'FACTURA' | 'CREDITO_FISCAL';
  items: DTEItem[];
  subtotal: number;
  iva: number;
  retention: number;
  total: number;
  status: 'EMITIDO' | 'PENDIENTE' | 'RECHAZADO';
}

export interface EventLog {
  id: string;
  emissionId: string;
  type: string;
  timestamp: string;
  errorCode: string;
  actionRequired: string;
}