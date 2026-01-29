import { X, Shield, Home, Users } from 'lucide-react';
import { UserRole } from '../contexts/UserContext';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface SwitchUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  currentRole: UserRole;
}

export function SwitchUserModal({ isOpen, onClose, onSelectRole, currentRole }: SwitchUserModalProps) {
  // Adiciona suporte à tecla ESC (acessibilidade WCAG 2.1)
  useEscapeKey(onClose, isOpen);
  
  if (!isOpen) return null;

  const userTypes = [
    {
      role: 'admin' as UserRole,
      title: 'Administrador',
      description: 'Gerencia assinaturas, métricas e alertas críticos da plataforma',
      icon: Shield,
      color: 'bg-purple-500',
    },
    {
      role: 'breeder' as UserRole,
      title: 'Criador/Dono de Haras',
      description: 'Gestão completa do haras, plantel, reprodução e equipe',
      icon: Home,
      color: 'bg-blue-500',
    },
    {
      role: 'advisor' as UserRole,
      title: 'Assessor Administrativo',
      description: 'Gestão burocrática, documentação e alinhamento com ABCCMM',
      icon: Shield,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-foreground dark:text-white mb-1">Trocar Usuário</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Selecione o tipo de usuário para acessar a jornada específica
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {userTypes.map((type) => {
            const Icon = type.icon;
            const isActive = currentRole === type.role;
            
            return (
              <button
                key={type.role}
                onClick={() => {
                  onSelectRole(type.role);
                  onClose();
                }}
                className={`
                  w-full p-6 rounded-xl border-2 transition-all text-left
                  ${isActive 
                    ? 'border-primary dark:border-white bg-primary/5 dark:bg-white/5' 
                    : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-primary/50 dark:hover:border-white/50 hover:bg-muted dark:hover:bg-[#0d0d0d]'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`${type.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg text-foreground dark:text-white">
                        {type.title}
                      </h3>
                      {isActive && (
                        <span className="px-2 py-1 text-xs rounded-full bg-primary dark:bg-white text-white dark:text-black">
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] bg-muted/50 dark:bg-[#0d0d0d]/50">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] text-center">
            Esta funcionalidade permite testar diferentes jornadas de usuário na plataforma CriaHub
          </p>
        </div>
      </div>
    </div>
  );
}