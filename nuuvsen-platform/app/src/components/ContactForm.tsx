'use client';

import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoSolicitacao: 'ORCAMENTO',
    servicoInteresse: 'Desenvolvimento de Software Sob Medida',
    mensagem: '',
    honeypot: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Máscara de telefone BR
  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 10) {
      return raw.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, telefone: formatPhone(e.target.value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar o formulário.');
      }

      setSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        tipoSolicitacao: 'ORCAMENTO',
        servicoInteresse: 'Desenvolvimento de Software Sob Medida',
        mensagem: '',
        honeypot: ''
      });
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Fale Conosco</h2>
          <p className="text-slate-400">Preencha o formulário e nossa equipe entrará em contato em poucas horas.</p>
        </div>

        {success && (
          <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-center">
            <h3 className="text-lg font-semibold">Solicitação enviada com sucesso!</h3>
            <p className="text-sm mt-1">Obrigado pelo contato. Em breve entraremos em contato via WhatsApp/E-mail.</p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur">
          {/* Honeypot field (escondido) */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Nome completo *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">E-mail *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@empresa.com"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Tipo de solicitação *</label>
              <select
                value={formData.tipoSolicitacao}
                onChange={(e) => setFormData({ ...formData, tipoSolicitacao: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white"
              >
                <option value="ORCAMENTO">Quero um orçamento</option>
                <option value="DUVIDA">Quero apenas tirar uma dúvida</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Serviço de interesse *</label>
            <select
              value={formData.servicoInteresse}
              onChange={(e) => setFormData({ ...formData, servicoInteresse: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white"
            >
              <option value="Desenvolvimento de Software Sob Medida">Desenvolvimento de Software Sob Medida</option>
              <option value="Automação de Processos">Automação de Processos</option>
              <option value="Aplicações Web">Aplicações Web</option>
              <option value="Aplicativos Mobile">Aplicativos Mobile</option>
              <option value="Consultoria em Tecnologia">Consultoria em Tecnologia</option>
              <option value="Integrações e APIs">Integrações e APIs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Descrição do Projeto / Mensagem *</label>
            <textarea
              required
              rows={4}
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              placeholder="Descreva brevemente o que sua empresa precisa..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
    </section>
  );
}