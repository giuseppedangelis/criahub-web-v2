import { useState, useRef, useEffect } from 'react';
import { User, Shield, Wrench, Save, Upload, Bell, Lock, Globe, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';
import { Toggle } from '../ui/toggle';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useCurrentHaras } from '@/hooks/useHaras';
import { useProfileSettings, useUpdateProfileSettings } from '@/hooks/useProfileSettings';
import { useUserSessions, useRevokeSession } from '@/hooks/useSessions';
import { getRoleLabel } from '@/lib/roles';
import { isValidPhone, validatePasswordStrength } from '@/lib/validators';

type SettingsTab = 'profile' | 'security' | 'general';

export function AdvisorSettingsContent() {
  const supabase = createClient();
  const { user, profile, refreshProfile } = useUser();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [profileHydrated, setProfileHydrated] = useState(false);

  // Estados do Perfil
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    harasName: '',
  });

  // Estados de Segurança
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estados de Configurações Gerais
  const [notificationSettings, setNotificationSettings] = useState({
    documents: true,
    tasks: true,
    calendar: true,
    team: true,
    system: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showPhone: true,
  });

  // Estados dos Modais
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; action: () => void } | null>(null);

  const tabs = [
    { id: 'profile' as SettingsTab, name: 'Perfil', icon: User },
    { id: 'security' as SettingsTab, name: 'Segurança', icon: Shield },
    { id: 'general' as SettingsTab, name: 'Geral', icon: Wrench },
  ];

  const { data: currentHaras } = useCurrentHaras();
  const { data: profileSettings } = useProfileSettings(user?.id || '');
  const updateProfileSettings = useUpdateProfileSettings();
  const { data: sessionsData, isLoading: isLoadingSessions, isError: isSessionsError } = useUserSessions();
  const revokeSession = useRevokeSession();

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setProfileData({ ...profileData, phone: formatted });
  };

  useEffect(() => {
    if (!profile || profileHydrated) return;
    const roleLabel = getRoleLabel(profile.role);
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
    setProfileHydrated(false);
  }, [user?.id]);

  useEffect(() => {
    if (!currentHaras) return;
    setProfileData((prev) => ({
      ...prev,
      harasName: currentHaras.name || prev.harasName,
    }));
  }, [currentHaras]);

  useEffect(() => {
    if (!profileSettings) return;
    setNotificationSettings(profileSettings.notification_settings);
    setPrivacySettings(profileSettings.privacy_settings);
  }, [profileSettings]);

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

    setIsSavingProfile(true);
    try {
      let emailUpdated = false;
      const updateData: Record<string, any> = {
        full_name: profileData.name,
        phone: profileData.phone.replace(/\D/g, ''),
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
      },
    });
    setShowConfirmModal(true);
  };

  const handleSaveGeneralSettings = async () => {
    if (!user?.id) {
      toast.error('Usuário não autenticado.');
      return;
    }

    setIsSavingGeneral(true);
    try {
      await updateProfileSettings.mutateAsync({
        userId: user.id,
        input: {
          notification_settings: notificationSettings,
          privacy_settings: privacySettings,
        },
      });
      toast.success('Configurações salvas com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      toast.error(err.message || 'Erro ao salvar configurações.');
    } finally {
      setIsSavingGeneral(false);
    }
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
                <div>
                  <label className="block text-sm mb-2 text-foreground dark:text-white">
                    Haras
                  </label>
                  <input
                    type="text"
                    value={profileData.harasName}
                    disabled
                    className="w-full px-4 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-muted-foreground dark:text-[#99a1af] cursor-not-allowed"
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
                    <Lock className="w-5 h-5" />
                    Alterar Senha
                  </button>
                </div>
              </div>

              {/* Sessões Ativas */}
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
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-foreground dark:text-white" />
                  <h3 className="text-lg text-foreground dark:text-white">
                    Notificações
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
                  Gerencie quais notificações você deseja receber
                </p>
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-border dark:border-[#3a3a3a] last:border-0">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Documentos</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Notificações sobre documentos assinados e pendentes</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.documents}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, documents: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border dark:border-[#3a3a3a] last:border-0">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Tarefas</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Notificações sobre tarefas atribuídas e prazos</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.tasks}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, tasks: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border dark:border-[#3a3a3a] last:border-0">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Agenda</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Notificações sobre eventos e compromissos agendados</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.calendar}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, calendar: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border dark:border-[#3a3a3a] last:border-0">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Equipe</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Notificações sobre atividades da equipe</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.team}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, team: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Sistema</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Notificações sobre atualizações e manutenções</p>
                    </div>
                    <Toggle
                      checked={notificationSettings.system}
                      onChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, system: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Privacidade */}
              <div className="bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-foreground dark:text-white" />
                  <h3 className="text-lg text-foreground dark:text-white">
                    Privacidade
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
                  Controle quais informações são visíveis para outros membros
                </p>
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b border-border dark:border-[#3a3a3a] last:border-0">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Exibir E-mail</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Permitir que outros membros vejam seu e-mail</p>
                    </div>
                    <Toggle
                      checked={privacySettings.showEmail}
                      onChange={(checked) =>
                        setPrivacySettings({ ...privacySettings, showEmail: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-foreground dark:text-white mb-1">Exibir Telefone</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Permitir que outros membros vejam seu telefone</p>
                    </div>
                    <Toggle
                      checked={privacySettings.showPhone}
                      onChange={(checked) =>
                        setPrivacySettings({ ...privacySettings, showPhone: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveGeneralSettings}
                  disabled={isSavingGeneral}
                  className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
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
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-center p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">{confirmAction.title}</h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-foreground dark:text-white text-center">
                {confirmAction.message}
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-10 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction.action}
                className="flex-1 h-10 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
