const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL || 'http://whatsapp-service:3001';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'secret-key-change-me';

export async function getWhatsappStatus(): Promise<{ connected: boolean; qrCode: string | null }> {
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/status`, {
      headers: { 'x-api-key': INTERNAL_API_KEY },
      cache: 'no-store'
    });

    if (!response.ok) throw new Error('Falha ao obter status');
    return await response.json();
  } catch (error) {
    console.error('Erro na integração do WhatsApp (Status):', error);
    return { connected: false, qrCode: null };
  }
}

export async function sendWhatsappNotification(number: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${WHATSAPP_SERVICE_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': INTERNAL_API_KEY
      },
      body: JSON.stringify({ number, message }),
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Erro ao enviar notificação' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro na integração do WhatsApp (Envio):', error);
    return { success: false, error: error.message || 'Serviço do WhatsApp inacessível' };
  }
}