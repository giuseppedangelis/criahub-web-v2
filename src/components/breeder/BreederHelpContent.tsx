import { Search, MessageCircle, Phone, Clock, ChevronDown, Play, X, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';

export function BreederHelpContent() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showAddTutorialModal, setShowAddTutorialModal] = useState(false);

  const faqs = {
    geral: [
      { q: 'Como importar meu plantel via planilha ABCCMM?', a: 'Acesse Plantel > Importar Planilha e faça upload do arquivo fornecido pela ABCCMM.' },
      { q: 'Posso adicionar colaboradores ao sistema?', a: 'Sim! Vá em Configurações > Colaboradores e adicione membros da sua equipe com permissões específicas.' },
      { q: 'Como funciona o backup automático?', a: 'Usuários Premium têm backup automático diário de todos os dados do haras.' },
    ],
    plantel: [
      { q: 'Como cadastrar um novo animal?', a: 'Clique em Dashboard > Cadastrar Animal ou Plantel > Cadastrar Animal e preencha as informações básicas.' },
      { q: 'Posso visualizar a genealogia completa?', a: 'Sim! Abra a ficha do animal e acesse a aba Genealogia para ver até 4 gerações.' },
      { q: 'Como adicionar documentos aos animais?', a: 'Na ficha do animal, vá em Documentos > Adicionar Documento e faça upload dos arquivos.' },
    ],
    reproducao: [
      { q: 'Como registrar uma cobertura?', a: 'Vá em Reprodução > Novo Evento Reprodutivo e selecione o tipo "Cobertura".' },
      { q: 'Como acompanhar gestações?', a: 'Acesse Reprodução > Gestações para ver todas as éguas gestantes e prazos.' },
      { q: 'Posso receber alertas de partos próximos?', a: 'Sim! Configure em Configurações > Notificações para receber alertas de prazos reprodutivos.' },
    ],
    agenda: [
      { q: 'Como criar um evento na agenda?', a: 'Clique em Agenda > Novo Evento e preencha título, data, tipo e animais relacionados.' },
      { q: 'Posso configurar lembretes?', a: 'Sim! Ao criar um evento, adicione lembretes por App, Email ou Push notification.' },
      { q: 'Como anexar documentos a eventos?', a: 'Na tela de criar/editar evento, use a seção Anexos para fazer upload de arquivos.' },
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
          value="24+ artigos"
        />
        <SupportCard
          icon={Play}
          title="Tutoriais em Vídeo"
          description="Aprenda visualmente"
          value="12 vídeos"
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
            title="Reprodução"
            questions={faqs.reproducao}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="reproducao"
          />
          <FaqSection
            title="Agenda"
            questions={faqs.agenda}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="agenda"
          />
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <h3 className="text-xl text-foreground dark:text-white">Tutoriais em Vídeo</h3>
          <button 
            onClick={() => setShowAddTutorialModal(true)}
            className="w-full lg:w-auto px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Adicionar Tutorial
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <VideoCard title="Como importar planilha ABCCMM" duration="5:30" category="Plantel" />
          <VideoCard title="Cadastrando eventos na agenda" duration="3:45" category="Agenda" />
          <VideoCard title="Gestão de coberturas e gestações" duration="8:20" category="Reprodução" />
          <VideoCard title="Configurando permissões de equipe" duration="4:15" category="Configurações" />
          <VideoCard title="Adicionando documentos aos animais" duration="2:50" category="Plantel" />
          <VideoCard title="Gerenciando colaboradores" duration="6:10" category="Configurações" />
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">Canais de Suporte</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <MessageCircle className="w-8 h-8 text-primary dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground dark:text-white mb-1">Chat Online</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Resposta em até 2 horas</p>
            </div>
            <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">
              Iniciar Chat
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <Phone className="w-8 h-8 text-primary dark:text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground dark:text-white mb-1">WhatsApp</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">(31) 99999-9999</p>
            </div>
            <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity">
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

      {/* Modal Adicionar Tutorial */}
      {showAddTutorialModal && (
        <AddTutorialModal onClose={() => setShowAddTutorialModal(false)} />
      )}
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
                <ChevronDown className={`w-5 h-5 text-muted-foreground dark:text-[#99a1af] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
        <span className="inline-block px-2 py-1 bg-primary dark:bg-white text-white dark:text-black text-xs rounded mb-2">
          {category}
        </span>
        <p className="text-foreground dark:text-white">{title}</p>
      </div>
    </div>
  );
}

function AddTutorialModal({ onClose }: any) {
  const [formData, setFormData] = useState({
    titulo: '',
    url: '',
    categoria: '',
    duracao: '',
    descricao: ''
  });

  const handleSave = () => {
    if (!formData.titulo || !formData.url || !formData.categoria) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }
    toast.success('Tutorial adicionado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Tutorial</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Título do Tutorial <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Como importar planilha ABCCMM"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              URL do Vídeo <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
              Suportamos YouTube, Vimeo e links diretos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Categoria <span className="text-red-500">*</span>
              </label>
              <NativeSelect
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full"
              >
                <option value="">Selecione a categoria</option>
                <option value="Plantel">Plantel</option>
                <option value="Reprodução">Reprodução</option>
                <option value="Agenda">Agenda</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Configurações">Configurações</option>
                <option value="Geral">Geral</option>
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Duração
              </label>
              <input
                type="text"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                placeholder="Ex: 5:30"
                className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva brevemente o conteúdo do tutorial..."
              rows={3}
              className="w-full px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
            />
          </div>

          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Upload className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground dark:text-white mb-1">Dica</p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                  Para melhor experiência, recomendamos vídeos de até 10 minutos com resolução mínima de 720p.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Adicionar Tutorial
          </button>
        </div>
      </div>
    </div>
  );
}