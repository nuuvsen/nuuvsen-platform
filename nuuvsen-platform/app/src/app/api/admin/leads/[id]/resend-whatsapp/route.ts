import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsappNotification } from '@/lib/whatsapp-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = params;
  const lead = await prisma.lead.findUnique({ where: { id } });

  if (!lead) {
    return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
  }

  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  if (!adminNumber) {
    return NextResponse.json({ error: 'Número de admin não configurado' }, { status: 400 });
  }

  const formattedMsg = `🔄 *REENVIO DE LEAD - NUUVSEIN*\n\n` +
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
    return NextResponse.json({ success: true });
  } else {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { whatsappEnviado: false, whatsappErro: waResult.error }
    });
    return NextResponse.json({ error: waResult.error }, { status: 500 });
  }
}