import { useState } from 'react';
import { Shield, AlertTriangle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';
import { collaboratorsService } from '@/services/collaborators';
import { DEFAULT_TEAM_PERMISSIONS, teamService } from '@/services/team';
import { useUser } from '@/contexts/UserContext';

interface AddCollaboratorFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddCollaboratorForm({ onClose, onSuccess }: AddCollaboratorFormProps) {
  const { stableHarasId, user } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const [permissions, setPermissions] = useState({
    plantel: {
      view: false,
      edit: false,
      add: false,
    },
    reproduction: {
      view: false,
      manage: false,
    },
    agenda: {
      view: false,
      createEdit: false,
    },
    reports: {
      view: false,
      export: false,
    },
  });

  const mapPermissionsToTeam = () => ({
    ...DEFAULT_TEAM_PERMISSIONS,
    viewHerd: permissions.plantel.view || permissions.plantel.edit || permissions.plantel.add,
    registerActivities: permissions.agenda.createEdit,
    reproduction: permissions.reproduction.manage || permissions.reproduction.view,
    documentManagement: permissions.reports.export,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!stableHarasId) {
      toast.error('Haras não vinculado ao usuário');
      return;
    }

    setIsLoading(true);
    try {
      const response = await collaboratorsService.createCollaborator({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role as 'acessor' | 'veterinario' | 'peao',
        haras_id: stableHarasId,
        permissions
      });

      await teamService.upsertMember({
        harasId: stableHarasId,
        userId: response.user_id,
        roleId: null,
        permissions: mapPermissionsToTeam(),
        status: 'Ativo',
        createdBy: user.id,
      });

      toast.success('Colaborador adicionado com sucesso!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao criar colaborador:', error);
      if (error.message?.includes('already registered')) {
        toast.error('Email já cadastrado no sistema');
      } else {
        toast.error('Erro ao adicionar colaborador. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (module: keyof typeof permissions, permission: string) => {
    setPermissions({
      ...permissions,
      [module]: {
        ...permissions[module],
        [permission]: !permissions[module][permission as keyof typeof permissions[typeof module]],
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cabeçalho com botão fechar */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl text-foreground dark:text-white mb-1">Adicionar Colaborador</h2>
              <p className="text-sm text-muted-foreground dark:text-gray-500">Adicione um novo colaborador ao seu sistema</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground dark:text-gray-500 hover:text-foreground dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Informações Básicas */}
          <div className="space-y-3">
            <h3 className="text-lg text-foreground dark:text-white">Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Digite o nome completo"
                  className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Digite o email"
                  className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-foreground dark:text-white">Senha *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Digite a senha"
                  className="w-full h-10 px-4 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Função/Cargo *</label>
              <NativeSelect
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-10 px-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              >
                <option value="">Selecione a função</option>
                <option value="acessor">Acessor</option>
                <option value="veterinario">Veterinário</option>
                <option value="peao">Peão</option>
              </NativeSelect>
            </div>
          </div>

          {/* Permissões Detalhadas */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-muted-foreground dark:text-[#6B7280]" />
                <h3 className="text-lg text-foreground dark:text-white">Permissões Detalhadas</h3>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-xs text-muted-foreground dark:text-gray-500">Configure permissões específicas por módulo (disponível apenas no Premium)</p>
            </div>

            <div className="space-y-4">
              {/* Plantel */}
              <div className="space-y-2">
                <h4 className="text-sm text-foreground dark:text-white">Plantel</h4>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.plantel.view}
                      onChange={() => togglePermission('plantel', 'view')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Visualizar animais</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.plantel.edit}
                      onChange={() => togglePermission('plantel', 'edit')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Editar informações dos animais</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.plantel.add}
                      onChange={() => togglePermission('plantel', 'add')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Adicionar novos animais</span>
                  </label>
                </div>
              </div>

              {/* Reprodução */}
              <div className="space-y-2">
                <h4 className="text-sm text-foreground dark:text-white">Reprodução</h4>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.reproduction.view}
                      onChange={() => togglePermission('reproduction', 'view')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Visualizar dados reprodutivos</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.reproduction.manage}
                      onChange={() => togglePermission('reproduction', 'manage')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Gerenciar coberturas e gestações</span>
                  </label>
                </div>
              </div>

              {/* Agenda */}
              <div className="space-y-2">
                <h4 className="text-sm text-foreground dark:text-white">Agenda</h4>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.agenda.view}
                      onChange={() => togglePermission('agenda', 'view')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Visualizar agenda</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.agenda.createEdit}
                      onChange={() => togglePermission('agenda', 'createEdit')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Criar e editar eventos</span>
                  </label>
                </div>
              </div>

              {/* Relatórios */}
              <div className="space-y-2">
                <h4 className="text-sm text-foreground dark:text-white">Relatórios</h4>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.reports.view}
                      onChange={() => togglePermission('reports', 'view')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Visualizar relatórios</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.reports.export}
                      onChange={() => togglePermission('reports', 'export')}
                      className="mt-0.5 w-4 h-4 bg-muted dark:bg-[#3a3a3a] border-0 rounded cursor-pointer"
                    />
                    <span className="text-sm text-foreground dark:text-white">Exportar relatórios</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-3 border border-border dark:border-[#b0b0b0] rounded-lg text-foreground dark:text-[#b0b0b0] hover:bg-muted dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 py-3 bg-primary dark:bg-white text-white dark:text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
