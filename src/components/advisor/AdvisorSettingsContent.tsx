import { useState, useRef } from 'react';
import { User, Shield, Wrench, Save, Upload, Bell, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useResponsive } from '../../hooks/useResponsive';
import { NativeSelect } from '../ui/native-select';
import { Toggle } from '../ui/toggle';

type SettingsTab = 'profile' | 'security' | 'general';

export function AdvisorSettingsContent() {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados do Perfil
  const [profileData, setProfileData] = useState({
    name: 'Patrícia Almeida',
    email: 'patricia@harasvaleverde.com',
    phone: '(11) 98888-8888',
    role: 'Assessora Administrativa',
    avatar: '',
    harasName: 'Haras Vale Verde',
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

  const handleSaveGeneralSettings = () => {
    toast.success('Configurações salvas com sucesso!');
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
                className="flex items-center gap-2 px-6 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
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
                <h3 className="text-lg text-foreground dark:text-white mb-4">
                  Sessões Ativas
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted dark:bg-[#1a1a1a] rounded-lg">
                    <div className="flex-1">
                      <p className="text-foreground dark:text-white mb-1">Desktop - Windows</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">São Paulo, Brasil</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">Ativo agora</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs rounded">
                      Atual
                    </span>
                  </div>
                  <button
                    onClick={handleLogoutAllDevices}
                    className="w-full px-4 py-2 border border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    Encerrar Todas as Sessões
                  </button>
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