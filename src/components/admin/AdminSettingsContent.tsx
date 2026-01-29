import { useState, useRef } from 'react';
import { User, Package, Plug, Shield, Wrench, Save, Check, X, AlertCircle, Upload, Eye, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../contexts/UserContext';
import { useResponsive } from '../../hooks/useResponsive';
import { NativeSelect } from '../ui/native-select';

type SettingsTab = 'profile' | 'plans' | 'integrations' | 'security' | 'maintenance';

interface Plan {
  id: string;
  name: string;
  price: string;
  maxUsers: number;
  maxHorses: number;
  storage: string;
  active: boolean;
}

export function AdminSettingsContent() {
  const { user } = useUser();
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Perfil
  const [profileData, setProfileData] = useState({
    name: 'Administrador CriaHub',
    email: 'admin@criahub.com',
    phone: '(11) 98765-4321',
    role: 'Super Administrador',
    avatar: '',
  });

  // Estados dos Planos
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Básico',
      price: '99.00',
      maxUsers: 3,
      maxHorses: 50,
      storage: '5GB',
      active: true,
    },
    {
      id: '2',
      name: 'Premium',
      price: '249.00',
      maxUsers: 10,
      maxHorses: 200,
      storage: '20GB',
      active: true,
    },
    {
      id: '3',
      name: 'Enterprise',
      price: '499.00',
      maxUsers: 999,
      maxHorses: 9999,
      storage: '100GB',
      active: true,
    },
  ]);

  // Estados das Integrações
  const [integrations, setIntegrations] = useState({
    stripe: { connected: true, apiKey: 'sk_live_*********************', publicKey: 'pk_live_*********************' },
    asaas: { connected: false, apiKey: '', publicKey: '' },
    abccmm: { connected: true, status: 'Ativo', lastSync: '25/11/2025 14:30' },
  });

  // Estados de Segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estados dos Modais
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfigureStripeModal, setShowConfigureStripeModal] = useState(false);
  const [showConfigureAsaasModal, setShowConfigureAsaasModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; action: () => void } | null>(null);

  // Estados temporários para edição
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [stripeKeys, setStripeKeys] = useState({ apiKey: '', publicKey: '' });
  const [asaasKeys, setAsaasKeys] = useState({ apiKey: '', publicKey: '' });

  const tabs = [
    { id: 'profile' as SettingsTab, name: 'Perfil', icon: User },
    { id: 'plans' as SettingsTab, name: 'Planos e Produtos', icon: Package },
    { id: 'integrations' as SettingsTab, name: 'Integrações', icon: Plug },
    { id: 'security' as SettingsTab, name: 'Segurança', icon: Shield },
    { id: 'maintenance' as SettingsTab, name: 'Manutenção', icon: Wrench },
  ];

  // Logs simulados
  const logs = [
    { time: '15:45:01', type: 'INFO', message: 'Conexão ABCCMM estabelecida com sucesso.' },
    { time: '15:45:10', type: 'WARN', message: "Erro na sincronização do haras 'Haras Trovão'. (Time Out)" },
    { time: '15:45:12', type: 'SUCCESS', message: "Importação da planilha 'Plantel' finalizada. 120 novos animais registrados." },
    { time: '15:45:15', type: 'DEBUG', message: 'Próxima tentativa de sincronização agendada para 00:00.' },
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

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setShowEditPlanModal(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;
    
    setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
    setShowEditPlanModal(false);
    toast.success(`Plano ${editingPlan.name} atualizado com sucesso!`);
  };

  const handleTogglePlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setConfirmAction({
      title: plan.active ? 'Desativar Plano' : 'Ativar Plano',
      message: `Tem certeza que deseja ${plan.active ? 'desativar' : 'ativar'} o plano ${plan.name}? ${plan.active ? 'Clientes com este plano não poderão mais usá-lo.' : ''}`,
      action: () => {
        setPlans(plans.map(p => p.id === planId ? { ...p, active: !p.active } : p));
        toast.success(`Plano ${plan.name} ${plan.active ? 'desativado' : 'ativado'} com sucesso!`);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleConfigureStripe = () => {
    setStripeKeys({
      apiKey: integrations.stripe.apiKey,
      publicKey: integrations.stripe.publicKey,
    });
    setShowConfigureStripeModal(true);
  };

  const handleSaveStripeKeys = () => {
    setIntegrations({
      ...integrations,
      stripe: { ...integrations.stripe, ...stripeKeys, connected: true }
    });
    setShowConfigureStripeModal(false);
    toast.success('Chaves do Stripe salvas com sucesso!');
  };

  const handleConfigureAsaas = () => {
    setAsaasKeys({
      apiKey: integrations.asaas.apiKey,
      publicKey: integrations.asaas.publicKey,
    });
    setShowConfigureAsaasModal(true);
  };

  const handleSaveAsaasKeys = () => {
    setIntegrations({
      ...integrations,
      asaas: { ...integrations.asaas, ...asaasKeys, connected: true }
    });
    setShowConfigureAsaasModal(false);
    toast.success('Chaves do Asaas salvas com sucesso!');
  };

  const handleDisconnectIntegration = (service: 'stripe' | 'asaas' | 'abccmm') => {
    const serviceName = service === 'stripe' ? 'Stripe' : service === 'asaas' ? 'Asaas' : 'ABCCMM';
    
    setConfirmAction({
      title: `Desconectar ${serviceName}`,
      message: `Tem certeza que deseja desconectar o ${serviceName}? Esta ação pode afetar o funcionamento da plataforma.`,
      action: () => {
        if (service === 'abccmm') {
          setIntegrations({
            ...integrations,
            abccmm: { ...integrations.abccmm, connected: false }
          });
        }
        toast.info(`${serviceName} desconectado.`);
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
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

  const handleRestartSync = () => {
    setConfirmAction({
      title: 'Reiniciar Sincronização',
      message: 'Tem certeza que deseja reiniciar o serviço de sincronização? Isso pode afetar temporariamente a atualização de dados.',
      action: () => {
        toast.success('Serviço de sincronização reiniciado com sucesso!');
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };

  const handleClearCache = () => {
    setConfirmAction({
      title: 'Limpar Cache',
      message: 'Tem certeza que deseja limpar o cache da plataforma? Esta ação pode causar lentidão temporária.',
      action: () => {
        toast.success('Cache da plataforma limpo com sucesso!');
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

              <div className="space-y-4">
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
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          )}

          {/* Planos e Produtos */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl text-foreground dark:text-white mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-2xl text-primary dark:text-white">R$ {plan.price}/mês</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
                      >
                        Configurar
                      </button>
                      <button
                        onClick={() => handleTogglePlan(plan.id)}
                        className={`px-4 py-2 rounded-xl transition-colors text-sm whitespace-nowrap ${
                          plan.active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                        Usuários
                      </p>
                      <p className="text-foreground dark:text-white">{plan.maxUsers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                        Cavalos
                      </p>
                      <p className="text-foreground dark:text-white">
                        {plan.maxHorses === 9999 ? 'Ilimitado' : plan.maxHorses}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                        Armazenamento
                      </p>
                      <p className="text-foreground dark:text-white">{plan.storage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integrações */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* Gateway de Pagamento - Stripe */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-foreground dark:text-white mb-1">
                      Stripe
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Gateway de Pagamento
                    </p>
                  </div>
                  {integrations.stripe.connected ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                      Conectado
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      <X className="w-4 h-4" />
                      Desconectado
                    </div>
                  )}
                </div>
                {integrations.stripe.connected && (
                  <div className="mb-4 space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                        API Key
                      </p>
                      <code className="text-sm text-foreground dark:text-white bg-muted dark:bg-[#1a1a1a] px-3 py-1 rounded block">
                        {integrations.stripe.apiKey}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                        Public Key
                      </p>
                      <code className="text-sm text-foreground dark:text-white bg-muted dark:bg-[#1a1a1a] px-3 py-1 rounded block">
                        {integrations.stripe.publicKey}
                      </code>
                    </div>
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={handleConfigureStripe}
                    className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Key className="w-4 h-4 inline mr-2" />
                    Configurar Chaves
                  </button>
                </div>
              </div>

              {/* Gateway de Pagamento - Asaas */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-foreground dark:text-white mb-1">
                      Asaas
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Gateway de Pagamento
                    </p>
                  </div>
                  {integrations.asaas.connected ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                      Conectado
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      <X className="w-4 h-4" />
                      Desconectado
                    </div>
                  )}
                </div>
                <button
                  onClick={handleConfigureAsaas}
                  className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Key className="w-4 h-4 inline mr-2" />
                  Configurar Chaves
                </button>
              </div>

              {/* API ABCCMM */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-foreground dark:text-white mb-1">
                      API ABCCMM
                    </h3>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Associação Brasileira de Criadores do Cavalo Mangalarga Marchador
                    </p>
                  </div>
                  {integrations.abccmm.connected ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      <Check className="w-4 h-4" />
                      {integrations.abccmm.status}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      <X className="w-4 h-4" />
                      Desconectado
                    </div>
                  )}
                </div>
                {integrations.abccmm.connected && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                      Última sincronização
                    </p>
                    <p className="text-foreground dark:text-white">
                      {integrations.abccmm.lastSync}
                    </p>
                  </div>
                )}
                <div className="flex flex-col md:flex-row gap-3">
                  {integrations.abccmm.connected && (
                    <>
                      <button
                        onClick={() => setShowLogsModal(true)}
                        className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                      >
                        <Eye className="w-4 h-4 inline mr-2" />
                        Ver Logs
                      </button>
                      <button
                        onClick={() => toast.success('Sincronização iniciada!')}
                        className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                      >
                        Sincronizar Agora
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDisconnectIntegration('abccmm')}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      integrations.abccmm.connected
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40'
                        : 'bg-primary dark:bg-white text-white dark:text-black hover:opacity-90'
                    }`}
                  >
                    {integrations.abccmm.connected ? 'Desconectar' : 'Conectar'}
                  </button>
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

          {/* Manutenção */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              {/* Reiniciar Sincronização */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-2">
                  Reiniciar Serviço de Sincronização
                </h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4">
                  Reinicie o serviço de sincronização caso identifique problemas de atualização de dados.
                </p>
                <button
                  onClick={handleRestartSync}
                  className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Wrench className="w-5 h-5" />
                  Reiniciar Sincronização
                </button>
              </div>

              {/* Limpar Cache */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-2">
                  Limpar Cache da Plataforma
                </h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-4">
                  Limpe o cache para resolver problemas de desempenho ou visualização.
                </p>
                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-2 px-6 py-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/40 transition-colors"
                >
                  <AlertCircle className="w-5 h-5" />
                  Limpar Cache
                </button>
              </div>

              {/* Informações do Sistema */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Informações do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                      Versão da Plataforma
                    </p>
                    <p className="text-foreground dark:text-white">v2.4.1</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                      Última Atualização
                    </p>
                    <p className="text-foreground dark:text-white">20/11/2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                      Uptime
                    </p>
                    <p className="text-foreground dark:text-white">99.8%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                      Status do Servidor
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                      <p className="text-foreground dark:text-white">Operacional</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Editar Plano */}
      {showEditPlanModal && editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl text-foreground dark:text-white">Gerenciar Plano</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Ajuste valores e limites de acesso por plano.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4 space-y-4">
                  <h3 className="text-lg text-foreground dark:text-white">{editingPlan.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foreground dark:text-white mb-2">
                        Valor Mensal (R$)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 299,90"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                        className="w-full px-4 py-2 bg-background dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-foreground dark:text-white mb-2">
                        Máximo de Usuários
                      </label>
                      <input
                        type="text"
                        placeholder={editingPlan.maxUsers === 9999 ? 'Ilimitado' : `Ex: ${editingPlan.maxUsers}`}
                        value={editingPlan.maxUsers === 9999 ? 'Ilimitado' : editingPlan.maxUsers}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase() === 'ilimitado' ? 9999 : parseInt(e.target.value) || 0;
                          setEditingPlan({ ...editingPlan, maxUsers: value });
                        }}
                        className="w-full px-4 py-2 bg-background dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={() => setShowEditPlanModal(false)}
                  className="flex-1 px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSavePlan}
                  className="flex-1 px-6 py-2 bg-primary dark:bg-white rounded-xl text-white dark:text-black hover:opacity-90 transition-opacity"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Logs ABCCMM */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-2xl w-full">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl text-foreground dark:text-white">Logs da Conexão ABCCMM</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Visualização em tempo real dos logs de importação e sincronização.
                </p>
              </div>

              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-4 h-[200px] overflow-y-auto font-mono text-xs">
                {logs.map((log, index) => (
                  <p key={index} className="text-muted-foreground dark:text-gray-400 mb-1">
                    <span className="text-muted-foreground dark:text-gray-500">[{log.time}]</span>{' '}
                    <span className={
                      log.type === 'INFO' ? 'text-blue-600 dark:text-blue-400' :
                      log.type === 'WARN' ? 'text-yellow-600 dark:text-yellow-400' :
                      log.type === 'SUCCESS' ? 'text-green-600 dark:text-green-400' :
                      'text-muted-foreground dark:text-gray-400'
                    }>
                      {log.type}:
                    </span>{' '}
                    {log.message}
                  </p>
                ))}
              </div>

              <button
                onClick={() => setShowLogsModal(false)}
                className="w-full px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar Stripe Keys */}
      {showConfigureStripeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-md w-full">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl text-foreground dark:text-white">Configurar Chaves Stripe</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Insira as chaves de API do Stripe para ativar a integração.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    value={stripeKeys.apiKey}
                    onChange={(e) => setStripeKeys({ ...stripeKeys, apiKey: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Publishable Key
                  </label>
                  <input
                    type="text"
                    placeholder="pk_live_..."
                    value={stripeKeys.publicKey}
                    onChange={(e) => setStripeKeys({ ...stripeKeys, publicKey: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={() => setShowConfigureStripeModal(false)}
                  className="flex-1 px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveStripeKeys}
                  className="flex-1 px-6 py-2 bg-primary dark:bg-white rounded-xl text-white dark:text-black hover:opacity-90 transition-opacity"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configurar Asaas Keys */}
      {showConfigureAsaasModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[#3a3a3a] p-6 max-w-md w-full">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl text-foreground dark:text-white">Configurar Chaves Asaas</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Insira as chaves de API do Asaas para ativar a integração.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    placeholder="$aact_..."
                    value={asaasKeys.apiKey}
                    onChange={(e) => setAsaasKeys({ ...asaasKeys, apiKey: e.target.value })}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3">
                <button
                  onClick={() => setShowConfigureAsaasModal(false)}
                  className="flex-1 px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAsaasKeys}
                  className="flex-1 px-6 py-2 bg-primary dark:bg-white rounded-xl text-white dark:text-black hover:opacity-90 transition-opacity"
                >
                  Salvar
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
    </div>
  );
}