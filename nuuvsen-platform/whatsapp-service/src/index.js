const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'secret-key-change-me';

let qrCodeData = null;
let isConnected = false;

// Configuração do WhatsApp Client com autenticação local persistida em disco
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: '/app/tokens' // Montado via Volume Docker no docker-compose
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

// Eventos do WhatsApp Client
client.on('qr', async (qr) => {
  console.log('[WhatsApp Service] Novo QR Code gerado.');
  try {
    qrCodeData = await qrcode.toDataURL(qr);
    isConnected = false;
  } catch (err) {
    console.error('[WhatsApp Service] Erro ao converter QR Code:', err);
  }
});

client.on('ready', () => {
  console.log('[WhatsApp Service] Cliente WhatsApp conectado e pronto!');
  isConnected = true;
  qrCodeData = null;
});

client.on('authenticated', () => {
  console.log('[WhatsApp Service] Autenticado com sucesso.');
});

client.on('auth_failure', (msg) => {
  console.error('[WhatsApp Service] Falha na autenticação:', msg);
  isConnected = false;
});

client.on('disconnected', (reason) => {
  console.warn('[WhatsApp Service] Cliente desconectado:', reason);
  isConnected = false;
  qrCodeData = null;
  // Reinicia o cliente para tentar restabelecer
  client.initialize();
});

client.initialize();

// Middleware de Autenticação Interna
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
};

// Rotas da API Interna
app.get('/status', authMiddleware, (req, res) => {
  return res.json({
    connected: isConnected,
    qrCode: qrCodeData
  });
});

app.post('/send-message', authMiddleware, async (req, res) => {
  const { number, message } = req.body;

  if (!isConnected) {
    return res.status(503).json({ 
      success: false, 
      error: 'WhatsApp não está conectado. Escaneie o QR Code no painel.' 
    });
  }

  if (!number || !message) {
    return res.status(400).json({ success: false, error: 'Parâmetros inválidos' });
  }

  try {
    // Formata o número para o padrão do WhatsApp (Ex: 5511999999999@c.us)
    const cleanNumber = number.replace(/\D/g, '');
    const formattedNumber = cleanNumber.includes('@c.us') ? cleanNumber : `${cleanNumber}@c.us`;

    await client.sendMessage(formattedNumber, message);
    return res.json({ success: true });
  } catch (error) {
    console.error('[WhatsApp Service] Erro ao enviar mensagem:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Erro desconhecido ao enviar mensagem' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`[WhatsApp Service] Servidor rodando na porta ${PORT}`);
});