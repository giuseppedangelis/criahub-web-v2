import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X, Camera } from 'lucide-react';

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Admin CriaHub',
    email: 'admin@criahub.com',
    phone: '+55 (31) 99999-9999',
    role: 'Administrador da Plataforma',
    location: 'Belo Horizonte, MG',
    joinDate: '15 de Janeiro, 2024',
    bio: 'Responsável pela gestão completa da plataforma CriaHub, incluindo monitoramento de assinaturas, métricas de uso e suporte técnico aos criadores.',
  });

  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 dark:from-white/10 dark:to-white/5 relative">
          <button className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-black/50 rounded-lg hover:bg-white dark:hover:bg-black/70 transition-colors">
            <Camera className="w-4 h-4 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-primary dark:bg-white rounded-2xl border-4 border-card dark:border-[#1a1a1a] flex items-center justify-center">
                  <User className="w-16 h-16 text-white dark:text-black" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary dark:bg-white rounded-lg hover:opacity-80 transition-opacity">
                  <Camera className="w-4 h-4 text-white dark:text-black" />
                </button>
              </div>

              {/* Name and Role */}
              <div className="mb-2">
                <h2 className="text-2xl text-foreground dark:text-white mb-1">
                  {profileData.name}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af]">
                  <Shield className="w-4 h-4" />
                  <span>{profileData.role}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="mb-6">
            {!isEditing ? (
              <p className="text-muted-foreground dark:text-[#99a1af]">
                {profileData.bio}
              </p>
            ) : (
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                rows={3}
              />
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-xl">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Assinaturas Gerenciadas
              </p>
              <p className="text-2xl text-foreground dark:text-white">156</p>
            </div>
            <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-xl">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Alertas Resolvidos
              </p>
              <p className="text-2xl text-foreground dark:text-white">342</p>
            </div>
            <div className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-xl">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Taxa de Uptime
              </p>
              <p className="text-2xl text-foreground dark:text-white">99.9%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">
            Informações Pessoais
          </h3>
          <div className="space-y-4">
            <InfoField
              icon={User}
              label="Nome Completo"
              value={editData.name}
              isEditing={isEditing}
              onChange={(value) => setEditData({ ...editData, name: value })}
            />
            <InfoField
              icon={Mail}
              label="Email"
              value={editData.email}
              isEditing={isEditing}
              onChange={(value) => setEditData({ ...editData, email: value })}
            />
            <InfoField
              icon={Phone}
              label="Telefone"
              value={editData.phone}
              isEditing={isEditing}
              onChange={(value) => setEditData({ ...editData, phone: value })}
            />
            <InfoField
              icon={MapPin}
              label="Localização"
              value={editData.location}
              isEditing={isEditing}
              onChange={(value) => setEditData({ ...editData, location: value })}
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">
            Informações da Conta
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <Calendar className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Membro desde
                </p>
                <p className="text-foreground dark:text-white">{profileData.joinDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
              <Shield className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Nível de Acesso
                </p>
                <p className="text-foreground dark:text-white">Administrador Total</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <h4 className="text-foreground dark:text-white mb-3">Segurança</h4>
              <button className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors text-left">
                Alterar Senha
              </button>
              <button className="w-full px-4 py-3 mt-2 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors text-left">
                Autenticação em Dois Fatores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-xl text-foreground dark:text-white mb-6">
          Atividade Recente
        </h3>
        <div className="space-y-4">
          <ActivityItem
            action="Criou nova assinatura"
            details="Haras do Sol - Plano Premium"
            time="2 horas atrás"
          />
          <ActivityItem
            action="Resolveu alerta crítico"
            details="Servidor de backup reativado"
            time="5 horas atrás"
          />
          <ActivityItem
            action="Atualizou configurações"
            details="Modificou política de backup automático"
            time="1 dia atrás"
          />
          <ActivityItem
            action="Aprovou novo criador"
            details="Fazenda Vale Verde cadastrada"
            time="2 dias atrás"
          />
        </div>
      </div>
    </div>
  );
}

interface InfoFieldProps {
  icon: React.ElementType;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

function InfoField({ icon: Icon, label, value, isEditing, onChange }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 text-muted-foreground dark:text-[#99a1af] mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
          {label}
        </p>
        {!isEditing ? (
          <p className="text-foreground dark:text-white">{value}</p>
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        )}
      </div>
    </div>
  );
}

function ActivityItem({ action, details, time }: { action: string; details: string; time: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div className="w-2 h-2 bg-primary dark:bg-white rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="text-foreground dark:text-white mb-1">{action}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">{details}</p>
        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{time}</p>
      </div>
    </div>
  );
}
