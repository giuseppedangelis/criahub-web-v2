import { Search, MessageCircle, Phone, Clock, ChevronDown, Play, Shield, X, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';

export function AdminHelpContent() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showAddTutorialModal, setShowAddTutorialModal] = useState(false);

  const faqs = {
    geral: [
      { q: 'Como gerenciar assinaturas de usuários?', a: 'Acesse Assinaturas para ver todos os planos ativos, visualizar detalhes de cada usuário e gerenciar upgrades, downgrades ou cancelamentos.' },
      { q: 'Como visualizar logs de atividades?', a: 'Em Atividades você encontra um registro completo de todas as ações realizadas na plataforma, incluindo logins, alterações e transações.' },
      { q: 'Posso filtrar dados por período?', a: 'Sim! Todas as telas principais possuem filtros por data, status e outros critérios específicos.' },
    ],
    usuarios: [
      { q: 'Como adicionar um novo criador?', a: 'Vá em Usuários > Novo Usuário, preencha os dados e selecione o plano de assinatura adequado.' },
      { q: 'Como editar permissões de usuários?', a: 'Na lista de Usuários, clique em editar no usuário desejado e ajuste suas permissões e nível de acesso.' },
      { q: 'Como bloquear/desbloquear um usuário?', a: 'Na tela de edição do usuário, use o toggle "Status da Conta" para ativar ou desativar o acesso.' },
    ],
    assinaturas: [
      { q: 'Quais são os planos disponíveis?', a: 'Temos três planos: Básico (R$ 97/mês), Profissional (R$ 247/mês) e Premium (R$ 497/mês), cada um com recursos específicos.' },
      { q: 'Como processar reembolsos?', a: 'Acesse a assinatura do usuário, clique em "Ações" e selecione "Processar Reembolso". Informe o motivo e confirme.' },
      { q: 'Como gerar relatório de receitas?', a: 'Em Financeiro > Relatórios, selecione "Receitas por Período" e escolha as datas desejadas.' },
    ],
    suporte: [
      { q: 'Como visualizar tickets abertos?', a: 'No Dashboard você vê um resumo dos tickets. Para detalhes completos, acesse a seção Suporte.' },
      { q: 'Como responder a um ticket?', a: 'Clique no ticket desejado, digite sua resposta no campo de texto e clique em "Enviar Resposta".' },
      { q: 'Posso encaminhar tickets para outros admins?', a: 'Sim! Na tela do ticket, use a opção "Atribuir a" para encaminhar para outro administrador.' },
    ],
    alertas: [
      { q: 'Como configurar alertas críticos?', a: 'Acesse Configurações > Alertas para definir quais eventos devem gerar notificações urgentes.' },
      { q: 'O que fazer em caso de tentativas de login suspeitas?', a: 'O sistema bloqueia automaticamente após 5 tentativas falhas. Você pode revisar em Alertas > Segurança.' },
      { q: 'Como gerar relatórios de segurança?', a: 'Em Relatórios > Segurança você pode exportar logs de acesso, tentativas de login e outras métricas.' },
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
          icon={Shield}
          title="Documentação Admin"
          description="Guias técnicos completos"
          value="40+ artigos"
        />
        <SupportCard
          icon={Play}
          title="Tutoriais em Vídeo"
          description="Aprenda a gerenciar"
          value="20 vídeos"
        />
        <SupportCard
          icon={Phone}
          title="Suporte Prioritário"
          description="Atendimento dedicado"
          value="24/7 disponível"
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
            title="Usuários"
            questions={faqs.usuarios}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="usuarios"
          />
          <FaqSection
            title="Assinaturas"
            questions={faqs.assinaturas}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="assinaturas"
          />
          <FaqSection
            title="Suporte"
            questions={faqs.suporte}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="suporte"
          />
          <FaqSection
            title="Alertas e Segurança"
            questions={faqs.alertas}
            openFaq={openFaq}
            setOpenFaq={setOpenFaq}
            prefix="alertas"
          />
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-foreground dark:text-white">Tutoriais em Vídeo</h3>
          <button 
            onClick={() => setShowAddTutorialModal(true)}
            className="px-4 py-2 bg-white text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Adicionar Tutorial
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <VideoCard title="Gerenciando usuários e permissões" duration="8:15" category="Usuários" />
          <VideoCard title="Administração de assinaturas" duration="6:40" category="Assinaturas" />
          <VideoCard title="Resolvendo alertas críticos" duration="5:30" category="Alertas" />
          <VideoCard title="Gerando relatórios financeiros" duration="7:20" category="Financeiro" />
          <VideoCard title="Sistema de tickets de suporte" duration="4:50" category="Suporte" />
          <VideoCard title="Configurações avançadas" duration="9:15" category="Configurações" />
          <VideoCard title="Análise de métricas da plataforma" duration="6:25" category="Dashboard" />
          <VideoCard title="Segurança e controle de acesso" duration="8:40" category="Segurança" />
        </div>
      </div>

      {/* Admin Resources */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">Recursos para Administradores</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <h4 className="text-foreground dark:text-white mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Documentação Técnica
            </h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
              Acesse guias completos sobre arquitetura, APIs e integrações
            </p>
            <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm">
              Acessar Docs
            </button>
          </div>

          <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <h4 className="text-foreground dark:text-white mb-2 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Treinamento Admin
            </h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
              Curso completo de administração da plataforma CriaHub
            </p>
            <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm">
              Iniciar Treinamento
            </button>
          </div>

          <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <h4 className="text-foreground dark:text-white mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comunidade Admin
            </h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
              Conecte-se com outros administradores e troque experiências
            </p>
            <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm">
              Acessar Comunidade
            </button>
          </div>

          <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
            <h4 className="text-foreground dark:text-white mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Suporte Técnico
            </h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
              Contato direto com a equipe de desenvolvimento
            </p>
            <button className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm">
              Contatar Suporte
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-500/20 dark:border-red-700/30">
        <div className="flex items-start gap-4">
          <div className="bg-red-500 dark:bg-red-600 p-3 rounded-lg flex-shrink-0">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground dark:text-white mb-2">Suporte de Emergência 24/7</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3">
              Para problemas críticos que afetam a plataforma, entre em contato imediatamente:
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-foreground dark:text-white" />
                <span className="text-foreground dark:text-white">(31) 98888-8888</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-foreground dark:text-white" />
                <span className="text-foreground dark:text-white">admin@criahub.com.br</span>
              </div>
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

function AddTutorialModal({ onClose }: any) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !duration || !category || !videoFile) {
      toast.error('Preencha todos os campos e faça upload do vídeo');
      return;
    }
    // Aqui você pode adicionar a lógica para salvar o tutorial no banco de dados
    toast.success('Tutorial adicionado com sucesso');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Tutorial</h3>
          <button
            onClick={onClose}
            className="p-2 bg-muted dark:bg-[#0d0d0d] rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground dark:text-[#99a1af] block mb-2">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do tutorial"
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-[#99a1af] block mb-2">Duração (ex: 8:15)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="8:15"
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-[#99a1af] block mb-2">Categoria</label>
              <NativeSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Usuários">Usuários</option>
                <option value="Assinaturas">Assinaturas</option>
                <option value="Alertas">Alertas</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Suporte">Suporte</option>
                <option value="Configurações">Configurações</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Segurança">Segurança</option>
              </NativeSelect>
            </div>
            <div>
              <label className="text-sm text-muted-foreground dark:text-[#99a1af] block mb-2">Vídeo do Tutorial</label>
              <div className="border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg p-6 text-center hover:border-primary dark:hover:border-white transition-colors">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="bg-muted dark:bg-[#0d0d0d] p-4 rounded-full">
                    <Upload className="w-8 h-8 text-primary dark:text-white" />
                  </div>
                  {videoFile ? (
                    <div>
                      <p className="text-foreground dark:text-white font-medium">
                        {videoFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                        {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setVideoFile(null);
                        }}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remover arquivo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-foreground dark:text-white font-medium">
                        Clique para fazer upload do vídeo
                      </p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                        MP4, MOV, AVI até 500MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:opacity-80 transition-opacity"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Adicionar Tutorial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}