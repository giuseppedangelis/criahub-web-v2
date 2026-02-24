import { useState, useRef, useEffect, useMemo } from 'react';
import { User, Users, Shield, Wrench, Save, AlertCircle, Upload, Crown, Package, UserPlus, Trash2, Edit, Check, X, CreditCard, ChevronLeft, Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../../contexts/UserContext';
import { NativeSelect } from '../ui/native-select';
import { createClient } from '@/lib/supabase/client';
import { useCurrentHaras, useUpdateHaras } from '@/hooks/useHaras';
import {
  useHarasSettings,
  useHarasTeamMembers,
  useUpdateHarasSettings,
  useUpdateTeamMemberStatus,
  useRemoveTeamMember,
} from '@/hooks/useHarasSettings';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { useUserSessions, useRevokeSession } from '@/hooks/useSessions';
import { isValidPhone, validatePasswordStrength } from '@/lib/validators';

type SettingsTab = 'profile' | 'team' | 'plans' | 'security' | 'general';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  avatar?: string;
  systemRole?: string;
  isOwner?: boolean;
  isSelf?: boolean;
}

export function BreederSettingsContent() {
  const supabase = createClient();
  const { user, profile, refreshProfile, stableHarasId, isSessionReady } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [settingsHydrated, setSettingsHydrated] = useState(false);
  const [profileHydrated, setProfileHydrated] = useState(false);
  const [harasHydrated, setHarasHydrated] = useState(false);

  const { data: currentHaras } = useCurrentHaras();
  const updateHaras = useUpdateHaras();
  const harasId = isSessionReady ? (currentHaras?.id || stableHarasId || '') : '';

  const { data: harasSettings } = useHarasSettings(harasId);
  const updateHarasSettings = useUpdateHarasSettings();
  const {
    data: teamMembersData,
    refetch: refetchTeamMembers,
    isLoading: isLoadingTeamMembers,
  } = useHarasTeamMembers(harasId);
  const updateTeamMemberStatus = useUpdateTeamMemberStatus();
  const removeTeamMember = useRemoveTeamMember();
  const { data: sessionsData, isLoading: isLoadingSessions, isError: isSessionsError } = useUserSessions();
  const revokeSession = useRevokeSession();

  // Estados do Perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    harasName: '',
    harasLocation: '',
    harasLogo: '',
  });

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
    { id: 'plans' as SettingsTab, name: 'Planos', icon: Package },
    { id: 'security' as SettingsTab, name: 'Segurança', icon: Shield },
    { id: 'general' as SettingsTab, name: 'Geral', icon: Wrench },
  ];

  const ROLE_LABELS: Record<string, string> = {
    criador: 'Criador/Dono de Haras',
    breeder: 'Criador/Dono de Haras',
    assessor: 'Acessor Administrativo',
    acessor: 'Acessor Administrativo',
    advisor: 'Acessor Administrativo',
    peao: 'Funcionário de Campo',
    veterinario: 'Veterinário',
    employee: 'Funcionário de Campo',
    admin: 'Administrador',
  };

  const normalizeRole = (role?: string | null) =>
    (role || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatLocation = (city?: string | null, state?: string | null) => {
    const parts = [city, state].filter(Boolean);
    return parts.join(', ');
  };

  const parseLocation = (value: string) => {
    const [cityRaw, stateRaw] = value.split(',');
    const city = cityRaw?.trim() || null;
    const state = stateRaw?.trim().toUpperCase() || null;
    return { city, state };
  };

  const formatDate = (value?: string | null) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return new Intl.DateTimeFormat('pt-BR').format(date);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const formatCurrency = (value?: string | number | null) => {
    if (value === null || value === undefined) return '';
    const numeric = typeof value === 'string' ? Number(value) : value;
    if (Number.isNaN(numeric)) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numeric);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setProfileData({ ...profileData, phone: formatted });
  };

  const teamMembers = useMemo<TeamMember[]>(() => {
    const data = teamMembersData || [];
    return data.map((member) => {
      const normalizedRole = normalizeRole(member.role);
      const isOwner = normalizedRole === 'criador';
      const isSelf = member.id === user?.id;
      return {
        id: member.id,
        name: member.full_name || member.email || 'Colaborador',
        email: member.email || '',
        role: ROLE_LABELS[normalizedRole] || member.role || 'Colaborador',
        status: member.status === 'Inativo' ? 'Inativo' : 'Ativo',
        avatar: member.avatar_url || undefined,
        systemRole: normalizedRole,
        isOwner,
        isSelf,
      };
    });
  }, [teamMembersData, user?.id]);

  const sessions = useMemo(() => {
    const data = sessionsData || [];
    return [...data].sort((a, b) => {
      const aValue = a.refreshed_at || a.updated_at || a.created_at;
      const bValue = b.refreshed_at || b.updated_at || b.created_at;
      const aDate = aValue ? new Date(aValue) : null;
      const bDate = bValue ? new Date(bValue) : null;
      const aTime = aDate && !Number.isNaN(aDate.getTime()) ? aDate.getTime() : 0;
      const bTime = bDate && !Number.isNaN(bDate.getTime()) ? bDate.getTime() : 0;
      return bTime - aTime;
    });
  }, [sessionsData]);

  useEffect(() => {
    setSettingsHydrated(false);
  }, [harasId]);

  useEffect(() => {
    setProfileHydrated(false);
    setHarasHydrated(false);
  }, [user?.id]);

  useEffect(() => {
    if (!profile || profileHydrated) return;
    const roleLabel = ROLE_LABELS[normalizeRole(profile.role)] || profile.role || '';
    setProfileData((prev) => ({
      ...prev,
      name: profile.full_name || '',
      email: profile.email || '',
      phone: formatPhone(profile.phone || ''),
      role: roleLabel,
      avatar: profile.avatar_url || '',
    }));
    setProfileHydrated(true);
  }, [profile, profileHydrated]);

  useEffect(() => {
    if (!currentHaras || harasHydrated) return;
    setProfileData((prev) => ({
      ...prev,
      harasName: currentHaras.name || '',
      harasLocation: formatLocation(currentHaras.city, currentHaras.state),
      harasLogo: currentHaras.logo_url || '',
    }));
    setHarasHydrated(true);
  }, [currentHaras, harasHydrated]);

  useEffect(() => {
    if (!harasSettings || settingsHydrated) return;
    setNotificationSettings(harasSettings.notification_settings);
    setPrivacySettings(harasSettings.privacy_settings);
    setBackupSettings(harasSettings.backup_settings);
    setSettingsHydrated(true);
  }, [harasSettings, settingsHydrated]);

  const planTitle = currentHaras?.subscription_plan || 'Gratuito';
  const planValue = formatCurrency(currentHaras?.subscription_value);
  const planDueDate = formatDate(currentHaras?.subscription_due_date);
  const planStatus = currentHaras?.subscription_status || '—';

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!harasId) {
      toast.error('Haras não encontrado.');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const publicUrl = await uploadToStorage(file, `haras/${harasId}/logo`);
      await updateHaras.mutateAsync({
        id: harasId,
        input: { logo_url: publicUrl },
      });
      setProfileData((prev) => ({ ...prev, harasLogo: publicUrl }));
      toast.success('Logo do haras atualizado!');
    } catch (err: any) {
      console.error('Erro ao enviar logo:', err);
      toast.error(err.message || 'Erro ao enviar logo do haras.');
    } finally {
      setIsUploadingLogo(false);
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

    setIsSavingProfile(true);
    try {
      let emailUpdated = false;
      const cleanPhone = profileData.phone.replace(/\D/g, '');
      const updateData: Record<string, any> = {
        full_name: profileData.name,
        phone: cleanPhone,
        avatar_url: profileData.avatar,
        updated_at: new Date().toISOString(),
      };

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

      if (error) throw error;

      if (harasId) {
        const { city, state } = parseLocation(profileData.harasLocation);
        await updateHaras.mutateAsync({
          id: harasId,
          input: {
            name: profileData.harasName,
            city,
            state,
            logo_url: profileData.harasLogo,
          },
        });
      }

      await refreshProfile();
      toast.success('Perfil atualizado com sucesso!');
      if (emailUpdated) {
        toast.message('Confirme o novo e-mail para concluir a alteração.');
      }
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      toast.error(err.message || 'Erro ao salvar perfil.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRemoveMember = (member: TeamMember) => {
    if (!harasId) {
      toast.error('Haras não encontrado.');
      return;
    }

    if (member.isOwner || member.isSelf) {
      toast.error('Você não pode remover este usuário.');
      return;
    }

    setConfirmAction({
      title: 'Remover Colaborador',
      message: `Tem certeza que deseja remover ${member.name} da equipe? Esta ação não pode ser desfeita.`,
      action: async () => {
        try {
          await removeTeamMember.mutateAsync({ memberId: member.id, harasId });
          toast.success(`${member.name} foi removido da equipe.`);
          setShowConfirmModal(false);
        } catch (err: any) {
          console.error('Erro ao remover colaborador:', err);
          toast.error(err.message || 'Erro ao remover colaborador.');
        }
      },
    });
    setShowConfirmModal(true);
  };

  const handleToggleMemberStatus = (member: TeamMember) => {
    if (!harasId) {
      toast.error('Haras não encontrado.');
      return;
    }

    if (member.isOwner || member.isSelf) {
      toast.error('Você não pode alterar o status deste usuário.');
      return;
    }

    const nextStatus = member.status === 'Ativo' ? 'Inativo' : 'Ativo';
    updateTeamMemberStatus.mutate(
      { memberId: member.id, status: nextStatus, harasId },
      {
        onSuccess: () => {
          toast.success('Status atualizado!');
        },
        onError: (err: any) => {
          console.error('Erro ao atualizar status:', err);
          toast.error(err.message || 'Erro ao atualizar status.');
        },
      }
    );
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
      },
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
      },
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
      },
    });
    setShowConfirmModal(true);
  };

  const handleManualBackup = () => {
    toast.success('Backup manual iniciado! Você será notificado quando concluído.');
  };

  const handleSaveGeneralSettings = async () => {
    if (!harasId) {
      toast.error('Haras não encontrado.');
      return;
    }

    setIsSavingGeneral(true);
    try {
      await updateHarasSettings.mutateAsync({
        harasId,
        input: {
          notification_settings: notificationSettings,
          privacy_settings: privacySettings,
          backup_settings: backupSettings,
        },
      });
      toast.success('Configurações atualizadas com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      toast.error(err.message || 'Erro ao salvar configurações.');
    } finally {
      setIsSavingGeneral(false);
    }
  };

  const handleRestoreDefaults = () => {
    const defaultNotification = { agenda: true, reproduction: true, system: true };
    const defaultPrivacy = { publicPlantel: true, shareAnalytics: true, allowSearch: true };
    const defaultBackup = { autoBackup: true, frequency: 'daily' };

    setConfirmAction({
      title: 'Restaurar Configurações Padrão',
      message: 'Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.',
      action: async () => {
        setNotificationSettings(defaultNotification);
        setPrivacySettings(defaultPrivacy);
        setBackupSettings(defaultBackup);
        if (harasId) {
          try {
            await updateHarasSettings.mutateAsync({
              harasId,
              input: {
                notification_settings: defaultNotification,
                privacy_settings: defaultPrivacy,
                backup_settings: defaultBackup,
              },
            });
          } catch (err: any) {
            console.error('Erro ao restaurar configurações:', err);
            toast.error(err.message || 'Erro ao restaurar configurações.');
            return;
          }
        }
        toast.success('Configurações restauradas com sucesso!');
        setShowConfirmModal(false);
      },
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
                    onChange={handlePhoneChange}
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
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl flex items-center justify-center overflow-hidden">
                    {profileData.harasLogo ? (
                      <img src={profileData.harasLogo} alt="Logo do Haras" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground dark:text-[#99a1af]" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors disabled:opacity-60"
                    >
                      {isUploadingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Atualizar logo</span>
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      PNG ou JPG, recomendado 512x512
                    </p>
                  </div>
                </div>
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
                disabled={isSavingProfile}
                className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isSavingProfile ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSavingProfile ? 'Salvando...' : 'Salvar Alterações'}
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
                  disabled={!harasId}
                  className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="hidden sm:inline">Adicionar</span>
                </button>
              </div>

              {/* Lista de Colaboradores */}
              <div className="space-y-4">
                {isLoadingTeamMembers && (
                  <div className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Carregando colaboradores...
                  </div>
                )}
                {!isLoadingTeamMembers && teamMembers.length === 0 && (
                  <div className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    Nenhum colaborador encontrado.
                  </div>
                )}
                {teamMembers.map((member) => {
                  const canManage = !(member.isOwner || member.isSelf);
                  return (
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
                            onClick={() => handleToggleMemberStatus(member)}
                            disabled={!canManage}
                            className="p-2 hover:bg-muted dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                            title={member.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                          >
                            {member.status === 'Ativo' ? (
                              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ) : (
                              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member)}
                            disabled={!canManage}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Remover"
                          >
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                      <h3 className="text-2xl mb-2">Plano {planTitle}</h3>
                      <p className="text-emerald-100">Status: {planStatus}</p>
                    </div>
                    <Crown className="w-10 h-10" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl">{planValue || 'Sob consulta'}</span>
                    {planValue && <span className="text-emerald-100">/mês</span>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-emerald-100">
                      Próxima cobrança: {planDueDate || 'A definir'}
                    </p>
                    <p className="text-emerald-100">Método: não informado</p>
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

              {/* Privacidade */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Privacidade
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Plantel público</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Permitir que outros vejam seu plantel
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({ ...privacySettings, publicPlantel: !privacySettings.publicPlantel })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        privacySettings.publicPlantel ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          privacySettings.publicPlantel ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Compartilhar análises</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Permitir uso de dados agregados
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({ ...privacySettings, shareAnalytics: !privacySettings.shareAnalytics })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        privacySettings.shareAnalytics ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          privacySettings.shareAnalytics ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Permitir busca</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Habilitar o haras em buscas
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings({ ...privacySettings, allowSearch: !privacySettings.allowSearch })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        privacySettings.allowSearch ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          privacySettings.allowSearch ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Backup */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Backup
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Backup automático</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                        Salvar cópias periódicas do sistema
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setBackupSettings({ ...backupSettings, autoBackup: !backupSettings.autoBackup })
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        backupSettings.autoBackup ? 'bg-primary dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white dark:bg-black rounded-full transition-transform ${
                          backupSettings.autoBackup ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground dark:text-white">
                      Frequência
                    </label>
                    <NativeSelect
                      value={backupSettings.frequency}
                      onChange={(e) =>
                        setBackupSettings({ ...backupSettings, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })
                      }
                      className="w-full"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </NativeSelect>
                  </div>

                  <button
                    onClick={handleManualBackup}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Backup manual
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRestoreDefaults}
                  className="px-6 py-2 border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 transition-colors"
                >
                  Restaurar padrões
                </button>
                <button
                  onClick={handleSaveGeneralSettings}
                  disabled={isSavingGeneral}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {isSavingGeneral ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSavingGeneral ? 'Salvando...' : 'Salvar configurações'}
                </button>
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
        <AddCollaboratorForm
          onClose={() => setShowAddMemberModal(false)}
          onSuccess={() => {
            refetchTeamMembers();
            setShowAddMemberModal(false);
          }}
        />
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
