import { Search, MessageCircle, Phone, Clock, ChevronDown, Play } from 'lucide-react';
import { useState } from 'react';

export function AdvisorHelpContent() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqs = {
    geral: [
      { q: 'Qual é o papel do Assessor Administrativo?', a: 'O Assessor Administrativo gerencia toda a parte burocrática e documental do haras, incluindo registros na ABCCMM, documentos, tarefas administrativas e controle financeiro.' },
      { q: 'Como visualizar os haras que gerencio?', a: 'Acesse Equipe para ver todos os haras e criadores que você assessora.' },
      { q: 'Posso acessar informações de múltiplos haras?', a: 'Sim! Você tem acesso aos dados de todos os haras que contrataram seus serviços de assessoria.' },
    ],
    plantel: [
      { q: 'Como cadastrar animais para o criador?', a: 'Acesse Plantel > Cadastrar Animal e preencha todas as informações necessárias.' },
      { q: 'Como exportar dados do plantel?', a: 'Na tela de Plantel, use a opção Exportar para baixar os dados em formato Excel ou PDF.' },
      { q: 'Posso editar informações dos animais?', a: 'Sim! Como assessor, você tem permissão para editar todas as informações dos animais dos haras que assessora.' },
    ],
    documentos: [
      { q: 'Como enviar GIA para ABCCMM?', a: 'Acesse Documentos > Novo Documento, selecione o tipo GIA, preencha os dados e envie digitalmente.' },
      { q: 'Como gerar relatórios para o criador?', a: 'Em Documentos, selecione Relatórios e escolha o tipo de relatório desejado (plantel, reprodução, financeiro, etc.).' },
      { q: 'Onde encontro documentos assinados?', a: 'Todos os documentos assinados ficam arquivados na seção Documentos com status "Assinado".' },
    ],
    tarefas: [
      { q: 'Como criar tarefas para o haras?', a: 'Acesse Tarefas > Nova Tarefa, preencha as informações e atribua responsáveis.' },
      { q: 'Posso criar tarefas recorrentes?', a: 'Sim! Ao criar uma tarefa, marque a opção "Recorrente" e defina a frequência.' },
      { q: 'Como acompanhar tarefas pendentes?', a: 'No Dashboard você vê um resumo das tarefas pendentes. Para detalhes, acesse o módulo Tarefas.' },
    ],
    financeiro: [
      { q: 'Como registrar receitas e despesas?', a: 'Acesse Financeiro > Nova Transação e selecione o tipo (Receita ou Despesa).' },
      { q: 'Posso gerar relatórios financeiros?', a: 'Sim! Em Financeiro > Relatórios você pode gerar diversos tipos de análises financeiras.' },
      { q: 'Como categorizar transações?', a: 'Ao criar uma transação, selecione uma categoria existente ou crie uma nova categoria personalizada.' },
    ],
  };

  return (
    <div className="w-full space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
        <input
          type="text"
          placeholder="Buscar por tópico..."
          className="w-full pl-12 pr-4 py-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
        />
      </div>

      {/* Support Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SupportCard
          icon={MessageCircle}
          title="Perguntas Frequentes"
          description="Encontre respostas rápidas"
          value="30+ artigos"
        />
        <SupportCard
          icon={Play}
          title="Tutoriais em Vídeo"
          description="Aprenda visualmente"
          value="15 vídeos"
        />
        <SupportCard
          icon={Phone}
          title="Contato Direto"
          description="Fale com nossa equipe"
          value="Seg-Sex 8h-18h"
        />
      </div>

      {/* FAQs */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">Perguntas Frequentes</h3>
        
        <div className="space-y-6">
          <FaqSection
            title="Geral"
            questions={faqs.geral}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="geral"
          />
          <FaqSection
            title="Plantel"
            questions={faqs.plantel}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="plantel"
          />
          <FaqSection
            title="Documentos"
            questions={faqs.documentos}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="documentos"
          />
          <FaqSection
            title="Tarefas"
            questions={faqs.tarefas}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="tarefas"
          />
          <FaqSection
            title="Financeiro"
            questions={faqs.financeiro}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="financeiro"
          />
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">Tutoriais em Vídeo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <VideoCard title="Enviando GIA para ABCCMM" duration="6:20" category="Documentos" />
          <VideoCard title="Gestão de tarefas administrativas" duration="4:50" category="Tarefas" />
          <VideoCard title="Registrando coberturas e gestações" duration="7:15" category="Reprodução" />
          <VideoCard title="Controle financeiro do haras" duration="8:40" category="Financeiro" />
          <VideoCard title="Gerando relatórios completos" duration="5:30" category="Documentos" />
          <VideoCard title="Cadastrando animais no sistema" duration="4:25" category="Plantel" />
          <VideoCard title="Organizando eventos na agenda" duration="3:55" category="Agenda" />
          <VideoCard title="Gerenciamento de embriões" duration="6:45" category="Reprodução" />
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">Canais de Suporte</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <MessageCircle className="w-8 h-8 text-primary dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground dark:text-white mb-1">Chat Online</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Resposta em até 2 horas</p>
            </div>
            <button className="w-full md:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
              Iniciar Chat
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <Phone className="w-8 h-8 text-primary dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground dark:text-white mb-1">WhatsApp</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">(31) 99999-9999</p>
            </div>
            <button className="w-full md:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
              Abrir WhatsApp
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <Clock className="w-8 h-8 text-primary dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground dark:text-white mb-1">Horário de Atendimento</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Segunda a Sexta: 8h às 18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportCard({ icon: Icon, title, description, value }: any) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <Icon className="w-8 h-8 text-primary dark:text-white mb-4" />
      <h4 className="text-foreground dark:text-white mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">{description}</p>
      <p className="text-sm text-primary dark:text-white">{value}</p>
    </div>
  );
}

function FaqSection({ title, questions, openFaq, setOpenFaq, prefix }: any) {
  return (
    <div>
      <h4 className="text-foreground dark:text-white mb-3">{title}</h4>
      <div className="space-y-2">
        {questions.map((faq: any, idx: number) => {
          const faqId = `${prefix}-${idx}`;
          const isOpen = openFaq === faqId;
          
          return (
            <div key={faqId} className="border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(isOpen ? null : faqId)}
                className="w-full flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
              >
                <span className="text-foreground dark:text-white text-left">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground dark:text-[#99a1af] transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-4 bg-card dark:bg-[#1a1a1a]">
                  <p className="text-muted-foreground dark:text-[#99a1af]">{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoCard({ title, duration, category }: any) {
  return (
    <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg overflow-hidden hover:bg-accent dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors">
      <div className="aspect-video bg-primary/20 dark:bg-white/10 flex items-center justify-center relative">
        <Play className="w-12 h-12 text-primary dark:text-white" />
        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
          {duration}
        </span>
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-1 bg-primary dark:bg-white text-white dark:text-black text-xs rounded mb-2 whitespace-nowrap">
          {category}
        </span>
        <p className="text-foreground dark:text-white text-sm">{title}</p>
      </div>
    </div>
  );
}
