import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsappNotification } from '@/lib/whatsapp-client';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting simples por IP
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!checkRateLimit(ip, 3, 60000)) { // máx 3 requisições por minuto
    return NextResponse.json(
      { error: 'Muitas solicitações. Aguarde um minuto e tente novamente.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { nome, email, telefone, tipoSolicitacao, servicoInteresse, mensagem, honeypot } = body;

    // Honeypot Anti-Spam Check
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Processado' }, { status: 200 });
    }

    // Validações Básicas
    if (!nome || !email || !telefone || !tipoSolicitacao || !servicoInteresse || !mensagem) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    // 1. Salva o Lead no Banco de Dados
    const lead = await prisma.lead.create({
      data: {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        tipoSolicitacao,
        servicoInteresse,
        mensagem: mensagem.trim(),
        whatsappEnviado: false
      }
    });

    // 2. Tenta notificar o Administrador no WhatsApp
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    if (adminNumber) {
      const formattedMsg = `🚀 *NOVO LEAD RECEBIDO - NUUVSEIN*\n\n` +
        `👤 *Nome:* ${lead.nome}\n` +
        `✉️ *E-mail:* ${lead.email}\n` +
        `📞 *Telefone:* ${lead.telefone}\n` +
        `📌 *Tipo:* ${lead.tipoSolicitacao}\n` +
        `🛠️ *Serviço:* ${lead.servicoInteresse}\n\n` +
        `💬 *Mensagem:*\n${lead.mensagem}`;

      const waResult = await sendWhatsappNotification(adminNumber, formattedMsg);

      if (waResult.success) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { whatsappEnviado: true, whatsappErro: null }
        });
      } else {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { whatsappEnviado: false, whatsappErro: waResult.error }
        });
      }

      // Confirmação Opcional para o cliente
      const clientMsg = `Olá, ${lead.nome}! 👋\nRecebemos sua mensagem na Nuuvsen. Nossa equipe técnica já está analisando e retornará em breve. Obrigado pelo contato!`;
      await sendWhatsappNotification(lead.telefone, clientMsg);
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error: any) {
    console.error('Erro na API de Leads:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}