import React, { createContext, useCallback, useContext, useState } from 'react';
import type { DTE } from '../types';
import { mockDTEs } from '../data/mockData';

export type MHStatus = 'ESTABLE' | 'CONTINGENCIA';

export interface SyncResult {
  skipped: boolean;
  synced: number;
  rejected: number;
}

interface OperationsContextType {
  dtes: DTE[];
  mhStatus: MHStatus;
  isSyncing: boolean;
  lastSyncAt: string | null;
  toggleMhStatus: () => void;
  addDTE: (dte: DTE) => void;
  syncPending: () => Promise<SyncResult>;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export const OperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dtes, setDtes] = useState<DTE[]>(mockDTEs);
  const [mhStatus, setMhStatus] = useState<MHStatus>('ESTABLE');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const toggleMhStatus = useCallback(() => {
    setMhStatus((current) => (current === 'ESTABLE' ? 'CONTINGENCIA' : 'ESTABLE'));
  }, []);

  const addDTE = useCallback((dte: DTE) => {
    setDtes((current) => [dte, ...current]);
  }, []);

  // Simula el "health check" y el reintento automático hacia el Ministerio de Hacienda.
  const syncPending = useCallback(async (): Promise<SyncResult> => {
    if (mhStatus === 'CONTINGENCIA') {
      // El servidor central sigue caído: no hay nada que transmitir todavía.
      return { skipped: true, synced: 0, rejected: 0 };
    }

    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let synced = 0;
    let rejected = 0;

    const updated = dtes.map((dte) => {
      if (dte.status !== 'PENDIENTE') return dte;
      // Pequeña probabilidad de rechazo por el MH para simular escenarios reales de validación.
      const willReject = Math.random() < 0.12;
      if (willReject) {
        rejected += 1;
        return { ...dte, status: 'RECHAZADO' as const, contingency: false };
      }
      synced += 1;
      return { ...dte, status: 'EMITIDO' as const, contingency: false };
    });

    setDtes(updated);
    setIsSyncing(false);
    setLastSyncAt(new Date().toISOString());

    return { skipped: false, synced, rejected };
  }, [dtes, mhStatus]);

  return (
    <OperationsContext.Provider
      value={{ dtes, mhStatus, isSyncing, lastSyncAt, toggleMhStatus, addDTE, syncPending }}
    >
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) throw new Error('useOperations must be used within OperationsProvider');
  return context;
};
