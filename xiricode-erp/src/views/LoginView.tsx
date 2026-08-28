import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = (role: 'CAJERO' | 'SUPERVISOR' | 'GERENTE' | 'BODEGUERO' | 'GESTOR_COMPRAS', path: string) => {
    login(role);
    navigate(path, { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="w-1/2 bg-[#0B192C] flex flex-col justify-center items-center text-white p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">XiriCode</h1>
        <p className="text-blue-400 text-lg uppercase tracking-widest mb-8">Enterprise Console</p>
        <p className="text-slate-400 text-center max-w-md leading-relaxed">
          Optimizado para alta densidad de operaciones financieras y cumplimiento normativo del Ministerio de Hacienda.
        </p>
      </div>
      <div className="w-1/2 flex flex-col justify-center px-24">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Iniciar Sesión</h2>
        <p className="text-slate-500 mb-8">Seleccione un perfil de acceso rápido para evaluar el prototipo.</p>
        
        <div className="space-y-4 mb-8">
          <button onClick={() => handleMockLogin('CAJERO', '/emission')} className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">Entrar como Cajero (Punto de Venta)</button>
          <button onClick={() => handleMockLogin('SUPERVISOR', '/monitor')} className="w-full bg-[#1E293B] text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition">Entrar como Supervisor (Monitor TI)</button>
          <button onClick={() => handleMockLogin('BODEGUERO', '/inventory')} className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition">Entrar como Bodeguero (Kardex)</button>
          <button onClick={() => handleMockLogin('GESTOR_COMPRAS', '/inventory')} className="w-full bg-cyan-700 text-white py-3 rounded-lg font-medium hover:bg-cyan-800 transition">Entrar como Gestor de Compras (Abastecimiento)</button>
          <button onClick={() => handleMockLogin('GERENTE', '/dashboard')} className="w-full bg-slate-200 text-slate-800 py-3 rounded-lg font-medium hover:bg-slate-300 transition">Entrar como Gerente (Dashboard)</button>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-start gap-3">
          <ShieldCheck className="text-emerald-600 mt-0.5" size={20} />
          <p className="text-xs text-emerald-800 leading-relaxed">
            <strong>Conexión Cifrada SSL/TLS.</strong> El acceso simula un token JWT inmutable para validación de arquitectura de seguridad según la normativa fiscal.
          </p>
        </div>
      </div>
    </div>
  );
};