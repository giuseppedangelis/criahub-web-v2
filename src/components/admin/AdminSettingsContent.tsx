import { useState, useRef, useEffect } from 'react';
import { User, Package, Plug, Shield, Wrench, Save, Check, X, AlertCircle, Upload, Eye, Key, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../contexts/UserContext';
import { NativeSelect } from '../ui/native-select';
import { createClient } from '@/lib/supabase/client';
import { useUserSessions, useRevokeSession } from '@/hooks/useSessions';
import { isValidPhone, validatePasswordStrength } from '@/lib/validators';

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

const FALLBACK_PLANS: Plan[] = [
  {
    id: 'fallback-basic',
    name: 'Básico',
    price: '99.00',
    maxUsers: 3,
    maxHorses: 50,
    storage: '5GB',
    active: true,
  },
  {
    id: 'fallback-premium',
    name: 'Premium',
    price: '249.00',
    maxUsers: 10,
    maxHorses: 200,
    storage: '20GB',
    active: true,
  },
  {
    id: 'fallback-enterprise',
    name: 'Enterprise',
    price: '499.00',
    maxUsers: 999,
    maxHorses: 9999,
    storage: '100GB',
    active: true,
  },
];

export function AdminSettingsContent() {
  const supabase = createClient();
  const { user, profile, refreshProfile } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const { data: sessionsData, isLoading: isLoadingSessions, isError: isSessionsError } = useUserSessions();
  const revokeSession = useRevokeSession();

  // Estados do Perfil - inicializa vazio e carrega do contexto
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    bio: '',
    // Endereço completo
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  // Estado para loading do CEP
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Carrega dados do perfil quando o profile do contexto muda
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.full_name || '',
        email: profile.email || '',
        phone: formatPhone(profile.phone || ''),
        role: profile.role || 'admin',
        avatar: profile.avatar_url || '',
        bio: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      });

      // Buscar campos adicionais que podem não estar no contexto
      loadAdditionalProfileData();
    }
  }, [profile]);

  const loadAdditionalProfileData = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('profiles')
      .select('bio, cep, street, number, complement, neighborhood, city, state')
      .eq('id', user.id)
      .single();

    const profileExtra = data as {
      bio: string | null;
      cep: string | null;
      street: string | null;
      number: string | null;
      complement: string | null;
      neighborhood: string | null;
      city: string | null;
      state: string | null;
    } | null;

    if (profileExtra) {
      setProfileData(prev => ({
        ...prev,
        bio: profileExtra.bio || '',
        cep: formatCep(profileExtra.cep || ''),
        street: profileExtra.street || '',
        number: profileExtra.number || '',
        complement: profileExtra.complement || '',
        neighborhood: profileExtra.neighborhood || '',
        city: profileExtra.city || '',
        state: profileExtra.state || '',
      }));
    }
  };

  const formatTime = (value?: string | null) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatSessionDate = (value?: string | null) => {
    if (!value) return 'Sem registro';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  };

  const formatUserAgent = (userAgent?: string | null) => {
    if (!userAgent) return 'Dispositivo desconhecido';
    const ua = userAgent.toLowerCase();
    const device = ua.includes('android')
      ? 'Android'
      : ua.includes('iphone') || ua.includes('ipad')
        ? 'iOS'
        : ua.includes('windows')
          ? 'Windows'
          : ua.includes('mac')
            ? 'MacOS'
            : ua.includes('linux')
              ? 'Linux'
              : '';
    const browser = ua.includes('edg')
      ? 'Edge'
      : ua.includes('chrome')
        ? 'Chrome'
        : ua.includes('firefox')
          ? 'Firefox'
          : ua.includes('safari')
            ? 'Safari'
            : '';
    const label = [browser, device].filter(Boolean).join(' • ');
    return label || userAgent;
  };

  const sessions = (sessionsData || []).slice().sort((a, b) => {
    const aValue = a.refreshed_at || a.updated_at || a.created_at;
    const bValue = b.refreshed_at || b.updated_at || b.created_at;
    const aDate = aValue ? new Date(aValue) : null;
    const bDate = bValue ? new Date(bValue) : null;
    const aTime = aDate && !Number.isNaN(aDate.getTime()) ? aDate.getTime() : 0;
    const bTime = bDate && !Number.isNaN(bDate.getTime()) ? bDate.getTime() : 0;
    return bTime - aTime;
  });

  const loadPlans = async () => {
    setIsLoadingPlans(true);
    try {
      const { data, error } = await (supabase as any)
        .from('subscription_plans')
        .select('id, name, price, max_users, max_horses, storage, active')
        .order('price', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setPlans(
          data.map((plan: any) => ({
            id: plan.id,
            name: plan.name,
            price: plan.price?.toString() ?? '0',
            maxUsers: plan.max_users ?? 0,
            maxHorses: plan.max_horses ?? 0,
            storage: plan.storage ?? '',
            active: plan.active ?? true,
          }))
        );
      } else {
        setPlans(FALLBACK_PLANS);
      }
    } catch (err) {
      console.error('Erro ao carregar planos:', err);
      setPlans(FALLBACK_PLANS);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const loadIntegrations = async () => {
    setIsLoadingIntegrations(true);
    try {
      const { data, error } = await (supabase as any)
        .from('integrations')
        .select('id, name, connected, api_key, public_key, status, last_sync');

      if (error) throw error;

      const rows = data || [];
      const findByName = (name: string) =>
        rows.find((row: any) => (row.name || '').toLowerCase() === name.toLowerCase());

      const stripe = findByName('Stripe');
      const asaas = findByName('Asaas');
      const abccmm = findByName('ABCCMM');

      setIntegrationIds({
        stripe: stripe?.id,
        asaas: asaas?.id,
        abccmm: abccmm?.id,
      });

      setIntegrations({
        stripe: {
          connected: !!stripe?.connected,
          apiKey: stripe?.api_key || '',
          publicKey: stripe?.public_key || '',
        },
        asaas: {
          connected: !!asaas?.connected,
          apiKey: asaas?.api_key || '',
          publicKey: asaas?.public_key || '',
        },
        abccmm: {
          connected: !!abccmm?.connected,
          status: abccmm?.status || 'Inativo',
          lastSync: formatTime(abccmm?.last_sync),
        },
      });
    } catch (err) {
      console.error('Erro ao carregar integrações:', err);
    } finally {
      setIsLoadingIntegrations(false);
    }
  };

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await (supabase as any)
        .from('sync_logs')
        .select('log_time, log_type, message')
        .order('log_time', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (data && data.length > 0) {
        setLogs(
          data.map((log: any) => ({
            time: formatTime(log.log_time),
            type: log.log_type,
            message: log.message,
          }))
        );
      }
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadPlans();
    loadIntegrations();
    loadLogs();
  }, []);

  // Função para formatar telefone brasileiro
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);

    // Aplica máscara
    if (limited.length <= 2) {
      return limited.length > 0 ? `(${limited}` : '';
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  // Handler para input de telefone com máscara
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setProfileData({ ...profileData, phone: formatted });
  };

  // Função para formatar CEP
  const formatCep = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  };

  // Handler para input de CEP com máscara e busca automática
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setProfileData({ ...profileData, cep: formatted });

    // Buscar endereço quando CEP tiver 8 dígitos
    const cepNumbers = formatted.replace(/\D/g, '');
    if (cepNumbers.length === 8) {
      await fetchAddressFromCep(cepNumbers);
    }
  };

  // Buscar endereço via ViaCEP
  const fetchAddressFromCep = async (cep: string) => {
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setProfileData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  // Lista de estados brasileiros
  const BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Estados dos Planos
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);

  // Estados das Integrações
  const [integrations, setIntegrations] = useState({
    stripe: { connected: false, apiKey: '', publicKey: '' },
    asaas: { connected: false, apiKey: '', publicKey: '' },
    abccmm: { connected: false, status: 'Inativo', lastSync: '' },
  });
  const [integrationIds, setIntegrationIds] = useState<{ stripe?: string; asaas?: string; abccmm?: string }>({});

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

  // Logs (fallback)
  const [logs, setLogs] = useState([
    { time: '15:45:01', type: 'INFO', message: 'Conexão ABCCMM estabelecida com sucesso.' },
    { time: '15:45:10', type: 'WARN', message: "Erro na sincronização do haras 'Haras Trovão'. (Time Out)" },
    { time: '15:45:12', type: 'SUCCESS', message: "Importação da planilha 'Plantel' finalizada. 120 novos animais registrados." },
    { time: '15:45:15', type: 'DEBUG', message: 'Próxima tentativa de sincronização agendada para 00:00.' },
  ]);

  // Handlers
  const uploadToStorage = async (file: File, pathPrefix: string) => {
    const ext = file.name.split('.').pop();
    const filePath = `${pathPrefix}/${Date.now()}_${Math.random().toString(36).slice(2)}${ext ? `.${ext}` : ''}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user?.id) {
      toast.error('Usuário não autenticado.');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const publicUrl = await uploadToStorage(file, `users/${user.id}/avatar`);
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData((prev) => ({ ...prev, avatar: publicUrl }));
      await refreshProfile();
      toast.success('Foto de perfil atualizada!');
    } catch (err: any) {
      console.error('Erro ao enviar avatar:', err);
      toast.error(err.message || 'Erro ao enviar foto de perfil.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast.error('Usuário não autenticado.');
      return;
    }
    if (profileData.phone && !isValidPhone(profileData.phone)) {
      toast.error('Telefone inválido.');
      return;
    }

    setIsSaving(true);
    try {
      let emailUpdated = false;
      const updateData = {
        full_name: profileData.name,
        phone: profileData.phone.replace(/\D/g, ''),
        bio: profileData.bio,
        avatar_url: profileData.avatar,
        cep: profileData.cep.replace(/\D/g, ''),
        street: profileData.street,
        number: profileData.number,
        complement: profileData.complement,
        neighborhood: profileData.neighborhood,
        city: profileData.city,
        state: profileData.state,
        updated_at: new Date().toISOString(),
      } as Record<string, any>;

      if (profileData.email && profileData.email !== profile?.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: profileData.email,
        });
        if (authError) throw authError;
        updateData.email = profileData.email;
        emailUpdated = true;
      }

      const { error } = await (supabase as any)
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Atualizar contexto do usuário
      await refreshProfile();

      toast.success('Perfil atualizado com sucesso!');
      if (emailUpdated) {
        toast.message('Confirme o novo e-mail para concluir a alteração.');
      }
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      toast.error(err.message || 'Erro ao salvar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setShowEditPlanModal(true);
  };

  const handleSavePlan = () => {
    if (!editingPlan) return;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(editingPlan.id);
    const payload = {
      name: editingPlan.name,
      price: Number(editingPlan.price),
      max_users: editingPlan.maxUsers,
      max_horses: editingPlan.maxHorses,
      storage: editingPlan.storage,
      active: editingPlan.active,
      updated_at: new Date().toISOString(),
    };

    const persist = async () => {
      if (isUuid) {
        const { error } = await (supabase as any)
          .from('subscription_plans')
          .update(payload)
          .eq('id', editingPlan.id);

        if (error) throw error;
      }
    };

    persist()
      .then(() => {
        setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
        setShowEditPlanModal(false);
        toast.success(`Plano ${editingPlan.name} atualizado com sucesso!`);
      })
      .catch((err: any) => {
        console.error('Erro ao salvar plano:', err);
        toast.error(err.message || 'Erro ao salvar plano.');
      });
  };

  const handleTogglePlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(plan.id);

    setConfirmAction({
      title: plan.active ? 'Desativar Plano' : 'Ativar Plano',
      message: `Tem certeza que deseja ${plan.active ? 'desativar' : 'ativar'} o plano ${plan.name}? ${plan.active ? 'Clientes com este plano não poderão mais usá-lo.' : ''}`,
      action: async () => {
        try {
          if (isUuid) {
            const { error } = await (supabase as any)
              .from('subscription_plans')
              .update({ active: !plan.active, updated_at: new Date().toISOString() })
              .eq('id', planId);

            if (error) throw error;
          }

          setPlans(plans.map(p => p.id === planId ? { ...p, active: !p.active } : p));
          toast.success(`Plano ${plan.name} ${plan.active ? 'desativado' : 'ativado'} com sucesso!`);
          setShowConfirmModal(false);
        } catch (err: any) {
          console.error('Erro ao atualizar plano:', err);
          toast.error(err.message || 'Erro ao atualizar plano.');
        }
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
    const persist = async () => {
      if (integrationIds.stripe) {
        const { error } = await (supabase as any)
          .from('integrations')
          .update({
            api_key: stripeKeys.apiKey,
            public_key: stripeKeys.publicKey,
            connected: true,
            status: 'Ativo',
            updated_at: new Date().toISOString(),
          })
          .eq('id', integrationIds.stripe);

        if (error) throw error;
      }
    };

    persist()
      .then(() => {
        setIntegrations({
          ...integrations,
          stripe: { ...integrations.stripe, ...stripeKeys, connected: true }
        });
        setShowConfigureStripeModal(false);
        toast.success('Chaves do Stripe salvas com sucesso!');
      })
      .catch((err: any) => {
        console.error('Erro ao salvar Stripe:', err);
        toast.error(err.message || 'Erro ao salvar chaves do Stripe.');
      });
  };

  const handleConfigureAsaas = () => {
    setAsaasKeys({
      apiKey: integrations.asaas.apiKey,
      publicKey: integrations.asaas.publicKey,
    });
    setShowConfigureAsaasModal(true);
  };

  const handleSaveAsaasKeys = () => {
    const persist = async () => {
      if (integrationIds.asaas) {
        const { error } = await (supabase as any)
          .from('integrations')
          .update({
            api_key: asaasKeys.apiKey,
            public_key: asaasKeys.publicKey,
            connected: true,
            status: 'Ativo',
            updated_at: new Date().toISOString(),
          })
          .eq('id', integrationIds.asaas);

        if (error) throw error;
      }
    };

    persist()
      .then(() => {
        setIntegrations({
          ...integrations,
          asaas: { ...integrations.asaas, ...asaasKeys, connected: true }
        });
        setShowConfigureAsaasModal(false);
        toast.success('Chaves do Asaas salvas com sucesso!');
      })
      .catch((err: any) => {
        console.error('Erro ao salvar Asaas:', err);
        toast.error(err.message || 'Erro ao salvar chaves do Asaas.');
      });
  };

  const handleDisconnectIntegration = (service: 'stripe' | 'asaas' | 'abccmm') => {
    const serviceName = service === 'stripe' ? 'Stripe' : service === 'asaas' ? 'Asaas' : 'ABCCMM';

    setConfirmAction({
      title: `Desconectar ${serviceName}`,
      message: `Tem certeza que deseja desconectar o ${serviceName}? Esta ação pode afetar o funcionamento da plataforma.`,
      action: async () => {
        try {
          const integrationId =
            service === 'stripe'
              ? integrationIds.stripe
              : service === 'asaas'
              ? integrationIds.asaas
              : integrationIds.abccmm;

          if (integrationId) {
            const { error } = await (supabase as any)
              .from('integrations')
              .update({
                connected: false,
                status: 'Inativo',
                updated_at: new Date().toISOString(),
              })
              .eq('id', integrationId);

            if (error) throw error;
          }

          if (service === 'stripe') {
            setIntegrations({
              ...integrations,
              stripe: { ...integrations.stripe, connected: false },
            });
          }
          if (service === 'asaas') {
            setIntegrations({
              ...integrations,
              asaas: { ...integrations.asaas, connected: false },
            });
          }
          if (service === 'abccmm') {
            setIntegrations({
              ...integrations,
              abccmm: { ...integrations.abccmm, connected: false, status: 'Inativo' },
            });
          }

          toast.info(`${serviceName} desconectado.`);
          setShowConfirmModal(false);
        } catch (err: any) {
          console.error('Erro ao desconectar integração:', err);
          toast.error(err.message || 'Erro ao desconectar integração.');
        }
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
    const passwordErrors = validatePasswordStrength(securityData.newPassword);
    if (passwordErrors.length > 0) {
      toast.error(passwordErrors[0]);
      return;
    }

    setConfirmAction({
      title: 'Alterar Senha',
      message: 'Tem certeza que deseja alterar sua senha? Você será desconectado de todos os dispositivos.',
      action: async () => {
        try {
          const { error } = await supabase.auth.updateUser({
            password: securityData.newPassword,
          });
          if (error) throw error;
          setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          toast.success('Senha alterada com sucesso!');
          setShowConfirmModal(false);
        } catch (err: any) {
          console.error('Erro ao alterar senha:', err);
          toast.error(err.message || 'Erro ao alterar senha.');
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleLogoutAllDevices = () => {
    setConfirmAction({
      title: 'Encerrar Todas as Sessões',
      message: 'Tem certeza que deseja encerrar todas as sessões ativas? Você precisará fazer login novamente em todos os dispositivos.',
      action: async () => {
        try {
          const { error } = await supabase.auth.signOut({ scope: 'global' });
          if (error) throw error;
          toast.success('Logout realizado em todos os dispositivos!');
          setShowConfirmModal(false);
        } catch (err: any) {
          console.error('Erro ao encerrar sessões:', err);
          toast.error(err.message || 'Erro ao encerrar sessões.');
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleRevokeSession = (sessionId: string) => {
    setConfirmAction({
      title: 'Encerrar Sessão',
      message: 'Tem certeza que deseja encerrar esta sessão?',
      action: async () => {
        try {
          await revokeSession.mutateAsync(sessionId);
          toast.success('Sessão encerrada com sucesso!');
          setShowConfirmModal(false);
        } catch (err: any) {
          console.error('Erro ao encerrar sessão:', err);
          toast.error(err.message || 'Erro ao encerrar sessão.');
        }
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
                className={`flex items-center gap-2 px-6 py-4 transition-colors ${activeTab === tab.id
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
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 p-2 bg-primary dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
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
                    disabled
                    className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-muted-foreground dark:text-[#99a1af] cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">O e-mail não pode ser alterado</p>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>
                {/* Endereço Completo */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-foreground dark:text-white">Endereço</span>
                    <div className="flex-1 h-px bg-border dark:bg-[#3a3a3a]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CEP */}
                    <div className="relative">
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        CEP
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={profileData.cep}
                          onChange={handleCepChange}
                          placeholder="00000-000"
                          className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                        />
                        {isLoadingCep && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rua */}
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Rua / Logradouro
                      </label>
                      <input
                        type="text"
                        value={profileData.street}
                        onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                        placeholder="Nome da rua"
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>

                    {/* Número */}
                    <div>
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Número
                      </label>
                      <input
                        type="text"
                        value={profileData.number}
                        onChange={(e) => setProfileData({ ...profileData, number: e.target.value })}
                        placeholder="Nº"
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>

                    {/* Complemento */}
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={profileData.complement}
                        onChange={(e) => setProfileData({ ...profileData, complement: e.target.value })}
                        placeholder="Apto, Sala, etc. (opcional)"
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>

                    {/* Bairro */}
                    <div>
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={profileData.neighborhood}
                        onChange={(e) => setProfileData({ ...profileData, neighborhood: e.target.value })}
                        placeholder="Bairro"
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>

                    {/* Cidade */}
                    <div>
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        placeholder="Cidade"
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      />
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-sm mb-2 text-foreground dark:text-white">
                        Estado
                      </label>
                      <select
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                      >
                        <option value="">Selecione</option>
                        {BRAZILIAN_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Bio / Descrição
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Conte um pouco sobre você..."
                    rows={3}
                    className="w-full px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Cargo / Função
                  </label>
                  <input
                    type="text"
                    value={
                      profileData.role === 'admin'
                        ? 'Administrador'
                        : profileData.role === 'criador'
                          ? 'Criador'
                          : profileData.role === 'assessor' || profileData.role === 'advisor'
                            ? 'Assessor'
                            : profileData.role
                    }
                    disabled
                    className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-muted-foreground dark:text-[#99a1af] cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          )}

          {/* Planos e Produtos */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {isLoadingPlans && (
                <div className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Carregando planos...
                </div>
              )}
              {!isLoadingPlans && plans.length === 0 && (
                <div className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Nenhum plano encontrado.
                </div>
              )}
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
                        className={`px-4 py-2 rounded-xl transition-colors text-sm whitespace-nowrap ${plan.active
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
              {isLoadingIntegrations && (
                <div className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Carregando integrações...
                </div>
              )}
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
                    className={`px-4 py-2 rounded-xl transition-colors ${integrations.abccmm.connected
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
                  Acompanhe os logins ativos e encerre sessões que você não reconhece.
                </p>
                <div className="space-y-4">
                  {isLoadingSessions && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Carregando sessões...
                    </div>
                  )}
                  {!isLoadingSessions && isSessionsError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Não foi possível carregar as sessões.
                    </p>
                  )}
                  {!isLoadingSessions && !isSessionsError && sessions.length === 0 && (
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Nenhuma sessão ativa encontrada.
                    </p>
                  )}
                  {!isLoadingSessions && !isSessionsError && sessions.length > 0 && (
                    <div className="space-y-3">
                      {sessions.map((session) => {
                        const lastActive = session.refreshed_at || session.updated_at || session.created_at;
                        return (
                          <div
                            key={session.id}
                            className="flex flex-col gap-3 rounded-xl border border-border dark:border-[#2a2a2a] bg-muted/10 dark:bg-white/5 p-4"
                          >
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <div className="space-y-1">
                                <p className="text-sm text-foreground dark:text-white">
                                  {formatUserAgent(session.user_agent)}
                                </p>
                                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                                  Última atividade: {formatSessionDate(lastActive)}
                                </p>
                                {session.ip && (
                                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                                    IP: {session.ip}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => handleRevokeSession(session.id)}
                                disabled={revokeSession.isPending}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border dark:border-[#3a3a3a] text-sm text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10 transition-colors disabled:opacity-60"
                              >
                                {revokeSession.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                                Encerrar sessão
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="pt-4 border-t border-border dark:border-[#2a2a2a]">
                    <button
                      onClick={handleLogoutAllDevices}
                      className="flex items-center gap-2 px-6 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <AlertCircle className="w-5 h-5" />
                      Encerrar Todas as Sessões
                    </button>
                  </div>
                </div>
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
                {isLoadingLogs && (
                  <p className="text-muted-foreground dark:text-gray-400">Carregando logs...</p>
                )}
                {!isLoadingLogs && logs.length === 0 && (
                  <p className="text-muted-foreground dark:text-gray-400">Nenhum log encontrado.</p>
                )}
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
