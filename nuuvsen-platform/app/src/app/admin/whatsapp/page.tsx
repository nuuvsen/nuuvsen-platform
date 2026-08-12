'use client';

import { useEffect, useState } from 'react';

export default function WhatsappAdminPage() {
  const [status, setStatus] = useState<{ connected: boolean; qrCode: string | null }>({
    connected: false,
    qrCode: null
  });
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Erro ao buscar status do WhatsApp:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Polling a cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Conexão do WhatsApp</h1>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-slate-200">
        <div className="flex items-center space-x-3 mb-6">
          <span className="font-semibold">Status:</span>
          {status.connected ? (
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm rounded-full font-medium">
              Conectado
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm rounded-full font-medium">
              Desconectado - Escaneie o QR Code
            </span>
          )}
        </div>

        {!status.connected && status.qrCode && (
          <div className="flex flex-col items-center py-6 bg-white rounded-lg">
            <img src={status.qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
            <p className="text-slate-800 text-sm mt-4 font-medium">
              Abra o WhatsApp no celular da empresa, vá em Dispositivos Conectados e escaneie a imagem acima.
            </p>
          </div>
        )}

        {!status.connected && !status.qrCode && !loading && (
          <p className="text-slate-400">Inicializando serviço do WhatsApp e gerando QR Code...</p>
        )}
      </div>
    </div>
  );
}