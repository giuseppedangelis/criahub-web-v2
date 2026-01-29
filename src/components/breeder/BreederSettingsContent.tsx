import { useState, useRef } from 'react';
import { User, Users, Shield, Wrench, Save, AlertCircle, Upload, Crown, Package, UserPlus, Trash2, Edit, Check, X, CreditCard, ChevronLeft, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../contexts/UserContext';
import { useResponsive } from '../../hooks/useResponsive';
import { NativeSelect } from '../ui/native-select';

type SettingsTab = 'profile' | 'team' | 'plans' | 'security' | 'general';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Funcionário de Campo' | 'Assessor Administrativo' | 'Veterinário';
  status: 'Ativo' | 'Inativo';
  avatar?: string;
}

export function BreederSettingsContent() {
  const { user } = useUser();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Perfil
  const [profileData, setProfileData] = useState({
    name: 'Carlos Eduardo Silva',
    email: 'carlos@harasvaleverde.com',
    phone: '(11) 99999-9999',
    role: 'Criador/Dono de Haras',
    avatar: '',
    harasName: 'Haras Vale Verde',
    harasLocation: 'São Paulo, SP',
    harasLogo: '',
  });

  // Estados da Equipe
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@harasvaleverde.com',
      role: 'Funcionário de Campo',
      status: 'Ativo',
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@harasvaleverde.com',
      role: 'Assessor Administrativo',
      status: 'Ativo',
    },
    {
      id: '3',
      name: 'Dr. Pedro Costa',
      email: 'pedro@veterinaria.com',
      role: 'Veterinário',
      status: 'Ativo',
    },
  ]);

  // Estados de Segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estados de Configurações Gerais
  const [notificationSettings, setNotificationSettings] = useState({
    agenda: true,
    reproduction: true,
    system: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    publicPlantel: true,
    shareAnalytics: true,
    allowSearch: true,
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: 'daily',
  });

  // Estados dos Modais
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; action: () => void } | null>(null);
  const [showManageSubscriptionModal, setShowManageSubscriptionModal] = useState(false);
  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<'basico' | 'enterprise' | null>(null);
  const [subscriptionView, setSubscriptionView] = useState<'payment' | 'invoices'>('payment');

  const tabs = [
    { id: 'profile' as SettingsTab, name: 'Perfil', icon: User },
    { id: 'team' as SettingsTab, name: 'Colaboradores', icon: Users },
    { id: 'plans' as SettingsTab, name: 'Planos', icon: Package },
    { id: 'security' as SettingsTab, name: 'Segurança', icon: Shield },
    { id: 'general' as SettingsTab, name: 'Geral', icon: Wrench },
  ];

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result as string });
        toast.success('Foto de perfil atualizada!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, harasLogo: reader.result as string });
        toast.success('Logo do haras atualizado!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    setConfirmAction({
      title: 'Remover Colaborador',
      message: `Tem certeza que deseja remover ${memberName} da equipe? Esta ação não pode ser desfeita.`,
      action: () => {
        setTeamMembers(teamMembers.filter(m => m.id !== memberId));
        toast.success(`${memberName} foi removido da equipe.`);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleToggleMemberStatus = (memberId: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId 
        ? { ...member, status: member.status === 'Ativo' ? 'Inativo' : 'Ativo' }
        : member
    ));
    toast.success('Status atualizado!');
  };

  const handleChangePassword = () => {
    if (!securityData.currentPassword || !securityData.newPassword) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (securityData.newPassword.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setConfirmAction({
      title: 'Alterar Senha',
      message: 'Tem certeza que deseja alterar sua senha? Você será desconectado de todos os dispositivos.',
      action: () => {
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Senha alterada com sucesso!');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleLogoutAllDevices = () => {
    setConfirmAction({
      title: 'Encerrar Todas as Sessões',
      message: 'Tem certeza que deseja encerrar todas as sessões ativas? Você precisará fazer login novamente em todos os dispositivos.',
      action: () => {
        toast.success('Logout realizado em todos os dispositivos!');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleManualBackup = () => {
    toast.success('Backup manual iniciado! Você será notificado quando concluído.');
  };

  const handleRestoreDefaults = () => {
    setConfirmAction({
      title: 'Restaurar Configurações Padrão',
      message: 'Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.',
      action: () => {
        setNotificationSettings({ agenda: true, reproduction: true, system: true });
        setPrivacySettings({ publicPlantel: true, shareAnalytics: true, allowSearch: true });
        setBackupSettings({ autoBackup: true, frequency: 'daily' });
        toast.success('Configurações restauradas com sucesso!');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        {/* Tab Navigation - Desktop */}
        <div className="hidden lg:flex border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary dark:border-white bg-muted dark:bg-[#0d0d0d] text-primary dark:text-white'
                    : 'text-muted-foreground dark:text-[#99a1af] hover:bg-muted dark:hover:bg-[#0d0d0d]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Navigation - Mobile (Dropdown) */}
        <div className="lg:hidden border-b border-border dark:border-[rgba(255,255,255,0.1)] p-4">
          <NativeSelect
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as SettingsTab)}
            className="w-full"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.name}
              </option>
            ))}
          </NativeSelect>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6">
          {/* Perfil */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Upload de Imagem */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/70 dark:from-white dark:to-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-16 h-16 text-white dark:text-black" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Clique no ícone para alterar a foto de perfil
                </p>
              </div>

              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg text-foreground dark:text-white">Informações Pessoais</h3>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-muted-foreground dark:text-[#99a1af] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Informações do Haras */}
              <div className="space-y-4 pt-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                <h3 className="text-lg text-foreground dark:text-white">Informações do Haras</h3>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Nome do Haras
                  </label>
                  <input
                    type="text"
                    value={profileData.harasName}
                    onChange={(e) => setProfileData({ ...profileData, harasName: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={profileData.harasLocation}
                    onChange={(e) => setProfileData({ ...profileData, harasLocation: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          )}

          {/* Colaboradores */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg text-foreground dark:text-white mb-1">
                    Gerenciar Equipe
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    {teamMembers.length} colaborador(es) na equipe
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>

              {/* Lista de Colaboradores */}
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 dark:from-white dark:to-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <User className="w-6 h-6 text-white dark:text-black" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-foreground dark:text-white mb-1">{member.name}</h4>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">{member.email}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-muted dark:bg-[#1a1a1a] text-foreground dark:text-white rounded">
                              {member.role}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              member.status === 'Ativo'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleMemberStatus(member.id)}
                          className="p-2 hover:bg-muted dark:hover:bg-white/5 rounded-lg transition-colors"
                          title={member.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                        >
                          {member.status === 'Ativo' ? (
                            <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                          ) : (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Planos */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {/* Plano Atual */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Card do Plano */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl mb-2">Plano Premium</h3>
                      <p className="text-emerald-100">Acesso completo a todas as funcionalidades</p>
                    </div>
                    <Crown className="w-10 h-10" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl">R$ 97</span>
                    <span className="text-emerald-100">/mês</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-emerald-100">Próxima cobrança: 18/02/2024</p>
                    <p className="text-emerald-100">Método: Cartão •••• 1234</p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSubscriptionView('payment');
                      setShowManageSubscriptionModal(true);
                    }}
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors text-left flex items-center gap-3"
                  >
                    <CreditCard className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                    <div>
                      <p className="text-foreground dark:text-white">Alterar Forma de Pagamento</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Atualizar cartão de crédito</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setSubscriptionView('invoices');
                      setShowManageSubscriptionModal(true);
                    }}
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors text-left flex items-center gap-3"
                  >
                    <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                    <div>
                      <p className="text-foreground dark:text-white">Ver Histórico de Faturas</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Baixar faturas anteriores</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setConfirmAction({
                        title: 'Cancelar Assinatura',
                        message: 'Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium ao final do período atual.',
                        action: () => {
                          toast.success('Assinatura cancelada. Válida até 18/02/2024.');
                          setShowConfirmModal(false);
                        }
                      });
                      setShowConfirmModal(true);
                    }}
                    className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-left flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <div>
                      <p className="text-red-700 dark:text-red-400">Cancelar Assinatura</p>
                      <p className="text-sm text-red-600 dark:text-red-400/80">Encerrar plano premium</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recursos Incluídos */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Recursos Incluídos no seu Plano
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Plantel Ilimitado',
                    'Gestão Reprodutiva Completa',
                    'Relatórios Financeiros',
                    'Backup Automático Diário',
                    'Suporte Prioritário',
                    'Acesso Multi-dispositivo',
                    'Integração ABCCMM',
                    'Análise de Desempenho',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-foreground dark:text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparação de Planos */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Outros Planos Disponíveis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plano Básico */}
                  <div className="border border-border dark:border-[#3a3a3a] rounded-lg p-4">
                    <h4 className="text-foreground dark:text-white mb-2">Básico</h4>
                    <p className="text-2xl text-foreground dark:text-white mb-4">R$ 49<span className="text-sm text-muted-foreground dark:text-[#99a1af]">/mês</span></p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <Check className="w-4 h-4" />
                        Até 50 animais
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <Check className="w-4 h-4" />
                        1 usuário
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <Check className="w-4 h-4" />
                        Recursos básicos
                      </li>
                    </ul>
                    <button 
                      onClick={() => {
                        setSelectedPlanForDetails('basico');
                        setShowPlanDetailsModal(true);
                      }}
                      className="w-full px-4 py-2 border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>

                  {/* Plano Enterprise */}
                  <div className="border border-border dark:border-[#3a3a3a] rounded-lg p-4">
                    <h4 className="text-foreground dark:text-white mb-2">Enterprise</h4>
                    <p className="text-2xl text-foreground dark:text-white mb-4">R$ 197<span className="text-sm text-muted-foreground dark:text-[#99a1af]">/mês</span></p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <Check className="w-4 h-4" />
                        Animais ilimitados
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <Check className="w-4 h-4" />
                        Usuários ilimitados
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                        <Check className="w-4 h-4" />
                        Suporte dedicado
                      </li>
                    </ul>
                    <button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Fazer Upgrade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Alterar Senha */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Alterar Senha
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground dark:text-white">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) =>
                        setSecurityData({ ...securityData, currentPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground dark:text-white">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) =>
                        setSecurityData({ ...securityData, newPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground dark:text-white">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        setSecurityData({ ...securityData, confirmPassword: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-background dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Shield className="w-5 h-5" />
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Logout em Todos os Dispositivos */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-2">
                  Sessões Ativas
                </h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4">
                  Encerre todas as sessões ativas em outros dispositivos por segurança.
                </p>
                <button
                  onClick={handleLogoutAllDevices}
                  className="flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Encerrar Todas as Sessões
                </button>
              </div>
            </div>
          )}

          {/* Geral */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Notificações */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Notificações
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Eventos da Agenda</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Receba alertas sobre eventos próximos
                      </p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, agenda: !notificationSettings.agenda })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notificationSettings.agenda ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          notificationSettings.agenda ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Prazos Reprodutivos</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Avisos sobre coberturas, partos e exames
                      </p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, reproduction: !notificationSettings.reproduction })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notificationSettings.reproduction ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          notificationSettings.reproduction ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Atualizações do Sistema</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Novidades e melhorias na plataforma
                      </p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({ ...notificationSettings, system: !notificationSettings.system })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notificationSettings.system ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          notificationSettings.system ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Adicionar Colaborador */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-md w-full">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl text-foreground dark:text-white mb-2">Adicionar Colaborador</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Preencha os dados do novo membro da equipe
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: João Silva"
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="joao@exemplo.com"
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Cargo
                  </label>
                  <NativeSelect>
                    <option value="">Selecione...</option>
                    <option value="field">Funcionário de Campo</option>
                    <option value="admin">Assessor Administrativo</option>
                    <option value="vet">Veterinário</option>
                  </NativeSelect>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    toast.success('Convite enviado! O colaborador receberá um e-mail.');
                    setShowAddMemberModal(false);
                  }}
                  className="flex-1 px-6 py-2 bg-primary dark:bg-white rounded-xl text-white dark:text-black hover:opacity-90 transition-opacity"
                >
                  Enviar Convite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmação */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-md w-full">
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
                <h2 className="text-xl text-foreground dark:text-white">{confirmAction.title}</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  {confirmAction.message}
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAction.action}
                  className="flex-1 px-6 py-2 bg-primary dark:bg-white rounded-xl text-white dark:text-black hover:opacity-90 transition-opacity"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Gerenciar Assinatura */}
      {showManageSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-foreground dark:text-white mb-1">
                    {subscriptionView === 'payment' && 'Alterar Forma de Pagamento'}
                    {subscriptionView === 'invoices' && 'Histórico de Faturas'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowManageSubscriptionModal(false);
                  }}
                  className="p-2 hover:bg-muted dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground dark:text-white" />
                </button>
              </div>

              {/* Tela: Alterar Forma de Pagamento */}
              {subscriptionView === 'payment' && (
                <>
                  <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                      <div>
                        <p className="text-sm text-foreground dark:text-white">Cartão atual</p>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Mastercard •••• 1234</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="Como impresso no cartão"
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-foreground dark:text-white">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-foreground dark:text-white">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <p className="text-sm text-foreground dark:text-white">
                      🔒 <strong>Seguro:</strong> Seus dados de pagamento são criptografados e protegidos
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        toast.success('Forma de pagamento atualizada com sucesso!');
                        setShowManageSubscriptionModal(false);
                      }}
                      className="w-full px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Salvar Novo Cartão
                    </button>
                    <button
                      onClick={() => setShowManageSubscriptionModal(false)}
                      className="w-full px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}

              {/* Tela: Histórico de Faturas */}
              {subscriptionView === 'invoices' && (
                <>
                  <div className="space-y-3">
                    {[
                      { date: '20/12/2024', value: 'R$ 97,00', status: 'Pago', invoice: 'FAT-2024-12' },
                      { date: '20/11/2024', value: 'R$ 97,00', status: 'Pago', invoice: 'FAT-2024-11' },
                      { date: '20/10/2024', value: 'R$ 97,00', status: 'Pago', invoice: 'FAT-2024-10' },
                      { date: '20/09/2024', value: 'R$ 97,00', status: 'Pago', invoice: 'FAT-2024-09' },
                      { date: '20/08/2024', value: 'R$ 97,00', status: 'Pago', invoice: 'FAT-2024-08' },
                    ].map((invoice, index) => (
                      <div
                        key={index}
                        className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-foreground dark:text-white mb-1">{invoice.invoice}</p>
                              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{invoice.date}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <p className="text-foreground dark:text-white">{invoice.value}</p>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                              {invoice.status}
                            </span>
                            <button
                              onClick={() => toast.success('Download iniciado!')}
                              className="flex items-center gap-1 text-sm text-primary dark:text-white hover:opacity-70 transition-opacity"
                            >
                              <Download className="w-4 h-4" />
                              Baixar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowManageSubscriptionModal(false)}
                    className="w-full px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                  >
                    Fechar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalhes do Plano */}
      {showPlanDetailsModal && selectedPlanForDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-foreground dark:text-white mb-2">
                    Plano {selectedPlanForDetails === 'basico' ? 'Básico' : 'Enterprise'}
                  </h2>
                  <p className="text-2xl text-foreground dark:text-white">
                    R$ {selectedPlanForDetails === 'basico' ? '49' : '197'}
                    <span className="text-sm text-muted-foreground dark:text-[#99a1af]">/mês</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowPlanDetailsModal(false);
                    setSelectedPlanForDetails(null);
                  }}
                  className="p-2 hover:bg-muted dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground dark:text-white" />
                </button>
              </div>

              {/* Recursos */}
              <div>
                <h3 className="text-foreground dark:text-white mb-4">Recursos Incluídos</h3>
                <div className="space-y-3">
                  {selectedPlanForDetails === 'basico' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Até 50 animais</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Gestão completa do plantel
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">1 usuário</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Acesso individual
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Recursos básicos</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Gestão reprodutiva, agenda e financeiro
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Suporte por e-mail</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Resposta em até 48h
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Animais ilimitados</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Sem restrições de plantel
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Usuários ilimitados</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Toda sua equipe conectada
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Todos os recursos Premium</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Acesso completo à plataforma
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">Suporte dedicado</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Atendimento prioritário 24/7
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-foreground dark:text-white">API Personalizada</p>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            Integrações customizadas
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    toast.success('Redirecionando para contratação...');
                    setShowPlanDetailsModal(false);
                    setSelectedPlanForDetails(null);
                  }}
                  className="w-full px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                >
                  Contratar Plano
                </button>
                <button
                  onClick={() => {
                    setShowPlanDetailsModal(false);
                    setSelectedPlanForDetails(null);
                  }}
                  className="w-full px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upgrade */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-lg w-full">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl text-foreground dark:text-white mb-2">Fazer Upgrade para Enterprise</h2>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Desbloqueie recursos avançados para sua operação
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="p-2 hover:bg-muted dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground dark:text-white" />
                </button>
              </div>

              {/* Comparação */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border dark:border-[#3a3a3a]">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Plano Atual</p>
                    <p className="text-xl text-foreground dark:text-white">Premium - R$ 97/mês</p>
                  </div>
                  <Crown className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Novo Plano</p>
                    <p className="text-xl text-foreground dark:text-white">Enterprise - R$ 197/mês</p>
                  </div>
                  <Crown className="w-8 h-8 text-amber-500" />
                </div>
              </div>

              {/* Benefícios Adicionais */}
              <div>
                <h3 className="text-foreground dark:text-white mb-3">Você ganhará:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-foreground dark:text-white">Usuários ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-foreground dark:text-white">API personalizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-foreground dark:text-white">Suporte dedicado 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-foreground dark:text-white">Relatórios personalizados</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-sm text-foreground dark:text-white">
                  💡 <strong>Diferença:</strong> Apenas R$ 100/mês a mais para recursos enterprise
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    toast.success('Upgrade realizado! Recursos enterprise ativados.');
                    setShowUpgradeModal(false);
                  }}
                  className="w-full px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                >
                  Confirmar Upgrade
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}