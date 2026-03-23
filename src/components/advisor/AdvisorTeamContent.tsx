import { Search, Plus, Users, X, Edit, Trash2, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { useCurrentHaras } from '@/hooks/useHaras';
import {
  useCreateTeamRole,
  useDeleteTeamRole,
  useRemoveTeamMember,
  useTeamMembers,
  useTeamRoles,
  useUpdateTeamMember,
  useUpdateTeamRole,
  useUpsertTeamMember,
} from '@/hooks/useTeam';
import { collaboratorsService } from '@/services/collaborators';
import {
  DEFAULT_TEAM_PERMISSIONS,
  normalizeTeamPermissions,
  teamService,
  type TeamPermissionKey,
  type TeamPermissions,
} from '@/services/team';
import { getRoleLabel, isAdminRole, isAdvisorRole, isCreatorRole, normalizeRole } from '@/lib/roles';

const PERMISSION_LABELS: Record<TeamPermissionKey, string> = {
  viewHerd: 'Plantel',
  registerActivities: 'Atividades',
  healthManagement: 'Saúde',
  reproduction: 'Reprodução',
  financialManagement: 'Financeiro',
  trainingManagement: 'Treinamento',
  teamManagement: 'Equipe',
  documentManagement: 'Documentos e Relatórios',
  fullAdministrative: 'Acesso total (exclusivo do Criador)',
};

const ASSIGNABLE_PERMISSION_KEYS: TeamPermissionKey[] = [
  'viewHerd',
  'registerActivities',
  'healthManagement',
  'reproduction',
  'financialManagement',
  'trainingManagement',
  'teamManagement',
  'documentManagement',
];

const SYSTEM_ROLE_OPTIONS = [
  { value: 'assessor', label: 'Assessor' },
  { value: 'veterinario', label: 'Veterinário' },
  { value: 'peao', label: 'Peão' },
];

const formatAllowedModules = (permissions: TeamPermissions) => {
  if (permissions.fullAdministrative) return 'Acesso total (Criador)';
  const selected = ASSIGNABLE_PERMISSION_KEYS
    .filter((key) => permissions[key])
    .map((key) => PERMISSION_LABELS[key]);
  return selected.length ? selected.join(', ') : 'Nenhum';
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Nunca';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

const emptyPermissions = (): TeamPermissions => ({ ...DEFAULT_TEAM_PERMISSIONS });

export function AdvisorTeamContent() {
  const { user, profile, stableHarasId, isSessionReady } = useUser();
  const { data: currentHaras } = useCurrentHaras();
  const harasId = isSessionReady ? (currentHaras?.id || stableHarasId || '') : '';

  const currentRole = normalizeRole(profile?.role);
  const isAdmin = isAdminRole(currentRole);
  const isCreator = isCreatorRole(currentRole) || isAdmin;
  const isAdvisor = isAdvisorRole(currentRole);

  const [activeTab, setActiveTab] = useState<'team' | 'roles'>('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    systemRole: isAdvisor && !isCreator ? 'peao' : 'assessor',
    phone: '',
    status: 'Ativo',
    permissions: emptyPermissions(),
  });

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    userType: 'Interno',
    allowedModules: '',
    canEdit: 'Sim',
    canView: 'Sim',
    canDelete: 'Não',
    permissions: emptyPermissions(),
  });

  const { data: membersData = [], isLoading: isLoadingMembers } = useTeamMembers(harasId, isSessionReady);
  const { data: rolesData = [], isLoading: isLoadingRoles } = useTeamRoles(harasId);

  const createRole = useCreateTeamRole();
  const updateRole = useUpdateTeamRole();
  const deleteRole = useDeleteTeamRole();
  const upsertMember = useUpsertTeamMember();
  const updateMember = useUpdateTeamMember();
  const removeMember = useRemoveTeamMember();

  const memberCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    membersData.forEach((member) => {
      if (member.role_id) {
        counts[member.role_id] = (counts[member.role_id] || 0) + 1;
      }
    });
    return counts;
  }, [membersData]);

  const roles = useMemo(() => {
    return rolesData.map((role) => ({
      id: role.id,
      name: role.name,
      userType: role.user_type || 'Interno',
      allowedModules: formatAllowedModules(role.permissions),
      canEdit: role.can_edit ? 'Sim' : 'Não',
      canView: role.can_view ? 'Sim' : 'Não',
      canDelete: role.can_delete ? 'Sim' : 'Não',
      users: memberCounts[role.id] || 0,
      permissions: role.permissions,
      isLocked: normalizeTeamPermissions(role.permissions).fullAdministrative,
    }));
  }, [rolesData, memberCounts]);

  const team = useMemo(() => {
    return membersData
      .map((member) => {
        const normalizedSystemRole = normalizeRole(member.profile.role);
        const isCreatorMember = normalizedSystemRole === 'criador';
        const displayRole = isCreatorMember
          ? 'Criador (Admin total)'
          : member.role?.name
            || getRoleLabel(member.profile.role)
            || 'Colaborador';

        return {
          id: member.user_id,
          memberId: member.id || null,
          name: member.profile.full_name || member.profile.email || 'Colaborador',
          email: member.profile.email || '',
          role: displayRole,
          roleId: member.role_id || '',
          phone: member.profile.phone || '-',
          lastAccess: formatDate(member.profile.updated_at || member.profile.created_at || undefined),
          status: member.status || 'Ativo',
          permissions: normalizeTeamPermissions(member.permissions || member.role?.permissions),
          systemRole: member.profile.role || 'funcionario',
          systemRoleKey: normalizedSystemRole,
          isOwner: isCreatorMember,
          isSelf: member.user_id === user?.id,
        };
      })
      .sort((a, b) => {
        if (a.isOwner === b.isOwner) return a.name.localeCompare(b.name);
        return a.isOwner ? -1 : 1;
      });
  }, [membersData, user?.id]);

  const currentMember = useMemo(() => membersData.find((member) => member.user_id === user?.id), [membersData, user?.id]);
  const currentPermissions = normalizeTeamPermissions(currentMember?.permissions || currentMember?.role?.permissions);

  const canManageRoles = isCreator;
  const canManageUsers = isCreator || isAdvisor;
  const canDelegatePermissions = isCreator;

  const canDelegatePermission = (key: TeamPermissionKey) => {
    if (key === 'fullAdministrative') return false;
    if (isCreator) return true;
    return currentPermissions[key];
  };

  const stripFullAdministrative = (permissions: TeamPermissions) => ({
    ...permissions,
    fullAdministrative: false,
  });

  const clampPermissions = (permissions: TeamPermissions) => {
    const next = stripFullAdministrative({ ...permissions } as TeamPermissions);
    if (isCreator) return next;
    (Object.keys(next) as TeamPermissionKey[]).forEach((key) => {
      if (!canDelegatePermission(key)) next[key] = false;
    });
    return next;
  };

  const isRoleDelegable = (permissions: TeamPermissions) => {
    if (permissions.fullAdministrative) return false;
    if (isCreator) return true;
    return (Object.keys(permissions) as TeamPermissionKey[]).every((key) =>
      !permissions[key] || canDelegatePermission(key)
    );
  };

  const availableSystemRoles = useMemo(() => {
    if (isCreator) return SYSTEM_ROLE_OPTIONS;
    if (isAdvisor) {
      return SYSTEM_ROLE_OPTIONS.filter((option) =>
        option.value === 'peao' || option.value === 'veterinario'
      );
    }
    return [];
  }, [isAdvisor, isCreator]);

  const selectableRoles = useMemo(() => {
    return rolesData.filter((role) => isRoleDelegable(normalizeTeamPermissions(role.permissions)));
  }, [isCreator, rolesData, currentPermissions]);
  const hasSelectableRoles = selectableRoles.length > 0;

  const normalizeName = useCallback((value?: string | null) => (
    (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  ), []);

  const getDefaultRoleIdForSystemRole = useCallback((systemRole?: string | null) => {
    const normalizedSystemRole = normalizeRole(systemRole);
    if (!normalizedSystemRole) return '';
    const target = normalizedSystemRole === 'veterinario'
      ? 'veterinario'
      : normalizedSystemRole === 'peao'
        ? 'peao'
        : '';
    if (!target) return '';
    const match = rolesData.find((role) => normalizeName(role.name) === target);
    return match?.id || '';
  }, [normalizeName, rolesData]);

  const resolvePermissionsForRole = useCallback((roleId?: string | null) => {
    const role = rolesData.find((item) => item.id === roleId);
    return role ? normalizeTeamPermissions(role.permissions) : emptyPermissions();
  }, [rolesData]);

  const canCreateAction = activeTab === 'team'
    ? (canManageUsers && availableSystemRoles.length > 0)
    : canManageRoles;

  useEffect(() => {
    if (canDelegatePermissions) return;
    if (!formData.systemRole || formData.roleId) return;
    const defaultRoleId = getDefaultRoleIdForSystemRole(formData.systemRole);
    if (!defaultRoleId) return;
    setFormData((prev) => ({
      ...prev,
      roleId: defaultRoleId,
      permissions: resolvePermissionsForRole(defaultRoleId),
    }));
  }, [canDelegatePermissions, formData.roleId, formData.systemRole, getDefaultRoleIdForSystemRole, resolvePermissionsForRole]);

  const canManageSystemRole = (role?: string | null) => {
    const normalized = normalizeRole(role);
    if (isCreator) return !['admin', 'criador'].includes(normalized);
    if (isAdvisor) return normalized === 'peao' || normalized === 'veterinario';
    return false;
  };

  const canEditMember = (member: typeof team[number]) => {
    if (!canManageUsers) return false;
    if (member.isOwner) return false;
    if (member.isSelf) return true;
    if (isCreator) return true;
    if (isAdvisor) return member.systemRoleKey === 'peao' || member.systemRoleKey === 'veterinario';
    return false;
  };

  const canDeleteMember = (member: typeof team[number]) => {
    if (!canManageUsers) return false;
    if (member.isSelf || member.isOwner) return false;
    if (isCreator) return true;
    if (isAdvisor) return member.systemRoleKey === 'peao' || member.systemRoleKey === 'veterinario';
    return false;
  };

  const filteredTeam = useMemo(() => {
    if (!searchTerm.trim()) return team;
    const term = searchTerm.toLowerCase();
    return team.filter((member) =>
      member.name.toLowerCase().includes(term)
      || member.email.toLowerCase().includes(term)
      || member.role.toLowerCase().includes(term)
    );
  }, [team, searchTerm]);

  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return roles;
    const term = searchTerm.toLowerCase();
    return roles.filter((role) => role.name.toLowerCase().includes(term));
  }, [roles, searchTerm]);

  const ownerMember = useMemo(() => (
    team.find((member) => member.isOwner) || null
  ), [team]);

  const updatePermissionState = (permissions: TeamPermissions, key: TeamPermissionKey, value: boolean) => {
    if (key === 'fullAdministrative') {
      return { ...permissions, fullAdministrative: false } as TeamPermissions;
    }

    const next = { ...permissions, [key]: value, fullAdministrative: false } as TeamPermissions;
    return next;
  };

  const resetUserForm = () => {
    const defaultSystemRole = isAdvisor && !isCreator ? 'peao' : 'assessor';
    const defaultRoleId = !isCreator ? getDefaultRoleIdForSystemRole(defaultSystemRole) : '';
    const defaultPermissions = !isCreator ? resolvePermissionsForRole(defaultRoleId) : emptyPermissions();
    setFormData({
      name: '',
      email: '',
      password: '',
      roleId: defaultRoleId,
      systemRole: defaultSystemRole,
      phone: '',
      status: 'Ativo',
      permissions: defaultPermissions,
    });
  };

  const resetRoleForm = () => {
    setRoleFormData({
      name: '',
      userType: 'Interno',
      allowedModules: '',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Não',
      permissions: emptyPermissions(),
    });
  };

  const handleOpenRoleCreator = () => {
    setShowNewUserModal(false);
    setShowEditUserModal(false);
    setActiveTab('roles');
    setShowNewRoleModal(true);
  };

  const handleCreateUser = async () => {
    if (!canManageUsers) {
      toast.error('Você não tem permissão para criar usuários.');
      return;
    }

    if (!harasId) {
      toast.error('Haras não identificado.');
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!formData.systemRole) {
      toast.error('Selecione o perfil de acesso');
      return;
    }

    if (!canManageSystemRole(formData.systemRole)) {
      toast.error('Você não pode cadastrar este perfil de acesso.');
      return;
    }
    if (!isCreator && normalizeRole(formData.systemRole) === 'assessor') {
      toast.error('Somente o criador pode cadastrar assessores.');
      return;
    }
    if (!canDelegatePermissions && !formData.roleId) {
      toast.error('Função padrão não encontrada para este perfil. Peça ao criador para configurar.');
      return;
    }

    if (formData.roleId && !selectableRoles.find((role) => role.id === formData.roleId)) {
      toast.error('Selecione uma função compatível com suas permissões.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    const delegatedPermissions = canDelegatePermissions
      ? clampPermissions(formData.permissions)
      : resolvePermissionsForRole(formData.roleId);

    setIsSubmitting(true);
    try {
      await collaboratorsService.createCollaborator({
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.systemRole as any,
        haras_id: harasId,
        role_id: formData.roleId || null,
        permissions: delegatedPermissions,
        status: formData.status as 'Ativo' | 'Inativo',
        created_by: profile?.id,
        phone: formData.phone || null,
      });

      toast.success('Usuário criado com sucesso!');
      resetUserForm();
      setShowNewUserModal(false);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast.error(error.message || 'Erro ao criar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRole = async () => {
    if (!canManageRoles) {
      toast.error('Apenas o criador pode criar funções.');
      return;
    }

    if (!harasId) {
      toast.error('Haras não identificado.');
      return;
    }

    if (!roleFormData.name) {
      toast.error('Digite o nome da função');
      return;
    }

    const hasPermissions = ASSIGNABLE_PERMISSION_KEYS.some((key) => roleFormData.permissions[key]);
    if (!hasPermissions) {
      toast.error('Selecione pelo menos uma permissão');
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedPermissions = stripFullAdministrative(roleFormData.permissions);
      await createRole.mutateAsync({
        harasId,
        createdBy: profile?.id,
        input: {
          name: roleFormData.name,
          user_type: roleFormData.userType,
          permissions: sanitizedPermissions,
          can_edit: roleFormData.canEdit === 'Sim',
          can_view: roleFormData.canView === 'Sim',
          can_delete: roleFormData.canDelete === 'Sim',
        },
      });

      toast.success('Função criada com sucesso!');
      resetRoleForm();
      setShowNewRoleModal(false);
    } catch (error: any) {
      console.error('Erro ao criar função:', error);
      toast.error(error.message || 'Erro ao criar função');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRoleClick = (roleId: string) => {
    if (!canManageRoles) {
      toast.error('Apenas o criador pode editar funções.');
      return;
    }

    const role = rolesData.find((item) => item.id === roleId);
    if (!role) return;
    const normalizedPermissions = normalizeTeamPermissions(role.permissions);
    if (normalizedPermissions.fullAdministrative) {
      toast.info('A função de acesso total é exclusiva do Criador e não pode ser editada.');
      return;
    }

    setRoleFormData({
      name: role.name,
      userType: role.user_type || 'Interno',
      allowedModules: formatAllowedModules(role.permissions),
      canEdit: role.can_edit ? 'Sim' : 'Não',
      canView: role.can_view ? 'Sim' : 'Não',
      canDelete: role.can_delete ? 'Sim' : 'Não',
      permissions: normalizedPermissions,
    });

    setEditingRoleId(roleId);
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRoleId) return;
    if (!harasId) {
      toast.error('Haras não identificado.');
      return;
    }

    if (!roleFormData.name) {
      toast.error('Digite o nome da função');
      return;
    }

    const hasPermissions = ASSIGNABLE_PERMISSION_KEYS.some((key) => roleFormData.permissions[key]);
    if (!hasPermissions) {
      toast.error('Selecione pelo menos uma permissão');
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedPermissions = stripFullAdministrative(roleFormData.permissions);
      await updateRole.mutateAsync({
        roleId: editingRoleId,
        harasId,
        input: {
          name: roleFormData.name,
          user_type: roleFormData.userType,
          permissions: sanitizedPermissions,
          can_edit: roleFormData.canEdit === 'Sim',
          can_view: roleFormData.canView === 'Sim',
          can_delete: roleFormData.canDelete === 'Sim',
        },
      });

      toast.success('Função atualizada com sucesso!');
      resetRoleForm();
      setEditingRoleId(null);
      setShowEditRoleModal(false);
    } catch (error: any) {
      console.error('Erro ao atualizar função:', error);
      toast.error(error.message || 'Erro ao atualizar função');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUserClick = (userId: string) => {
    const member = team.find((item) => item.id === userId);
    if (!member) return;
    if (!canEditMember(member)) {
      toast.error('Você não tem permissão para editar este usuário.');
      return;
    }

    const fallbackRoleId = !canDelegatePermissions
      ? getDefaultRoleIdForSystemRole(member.systemRole)
      : '';
    const resolvedRoleId = member.roleId || fallbackRoleId;

    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      roleId: resolvedRoleId,
      systemRole: member.systemRole || 'funcionario',
      phone: member.phone === '-' ? '' : member.phone,
      status: member.status,
      permissions: canDelegatePermissions
        ? clampPermissions(normalizeTeamPermissions(member.permissions))
        : (resolvedRoleId ? resolvePermissionsForRole(resolvedRoleId) : normalizeTeamPermissions(member.permissions)),
    });

    setEditingUserId(userId);
    setEditingMemberId(member.memberId || null);
    setShowEditUserModal(true);
  };

  const handleDeleteUserClick = (userId: string) => {
    const member = team.find((item) => item.id === userId);
    if (!member) return;
    if (!canDeleteMember(member)) {
      toast.error('Você não tem permissão para remover este usuário.');
      return;
    }
    setUserToDelete(userId);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !harasId) return;

    if (userToDelete === user?.id) {
      toast.error('Você não pode remover o próprio acesso.');
      return;
    }

    setIsSubmitting(true);
    try {
      await removeMember.mutateAsync({ userId: userToDelete, harasId });
      toast.success('Usuário removido com sucesso!');
      setUserToDelete(null);
      setShowDeleteConfirmModal(false);
    } catch (error: any) {
      console.error('Erro ao remover usuário:', error);
      toast.error(error.message || 'Erro ao remover usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUserId || !harasId) return;

    if (!formData.name || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (!formData.systemRole) {
      toast.error('Selecione o perfil de acesso');
      return;
    }

    if (!canManageSystemRole(formData.systemRole)) {
      toast.error('Você não tem permissão para atribuir este perfil de acesso.');
      return;
    }
    if (!isCreator && normalizeRole(formData.systemRole) === 'assessor') {
      toast.error('Somente o criador pode atribuir o perfil de assessor.');
      return;
    }
    if (!canDelegatePermissions && !formData.roleId) {
      toast.error('Função padrão não encontrada para este perfil. Peça ao criador para configurar.');
      return;
    }

    if (formData.roleId && !selectableRoles.find((role) => role.id === formData.roleId)) {
      toast.error('Selecione uma função compatível com suas permissões.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    const delegatedPermissions = canDelegatePermissions
      ? clampPermissions(formData.permissions)
      : resolvePermissionsForRole(formData.roleId);

    setIsSubmitting(true);
    try {
      await teamService.updateProfile(editingUserId, {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        status: formData.status as 'Ativo' | 'Inativo',
        role: formData.systemRole,
      });

      if (editingMemberId) {
        await updateMember.mutateAsync({
          memberId: editingMemberId,
          harasId,
          input: {
            role_id: formData.roleId || null,
            permissions: delegatedPermissions,
            status: formData.status as 'Ativo' | 'Inativo',
          },
        });
      } else {
        await upsertMember.mutateAsync({
          harasId,
          userId: editingUserId,
          roleId: formData.roleId || null,
          permissions: delegatedPermissions,
          status: formData.status as 'Ativo' | 'Inativo',
          createdBy: profile?.id,
        });
      }

      toast.success('Usuário atualizado com sucesso!');
      resetUserForm();
      setEditingUserId(null);
      setEditingMemberId(null);
      setShowEditUserModal(false);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error(error.message || 'Erro ao atualizar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-6 py-3 transition-colors ${
            activeTab === 'team'
              ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
              : 'text-muted-foreground dark:text-[#99a1af]'
          }`}
        >
          Equipe
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 transition-colors ${
            activeTab === 'roles'
              ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
              : 'text-muted-foreground dark:text-[#99a1af]'
          }`}
        >
          Funções
        </button>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'team' ? 'usuário' : 'função'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'team') {
              resetUserForm();
              setShowNewUserModal(true);
            } else {
              resetRoleForm();
              setShowNewRoleModal(true);
            }
          }}
          disabled={!canCreateAction}
          className={`w-full lg:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg transition-opacity flex items-center justify-center gap-2 ${canCreateAction ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'team' ? 'Criar Novo Usuário' : 'Criar Nova Função'}
        </button>
      </div>
      {activeTab === 'team' && isAdvisor && !isCreator && (
        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
          Assessor pode cadastrar Peão e Veterinário. Permissões são definidas pelo criador.
        </p>
      )}
      {activeTab === 'team' && !isAdvisor && !isCreator && (
        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
          Você não tem permissão para cadastrar usuários.
        </p>
      )}

      {activeTab === 'team' && ownerMember && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          <strong>Criador principal do haras:</strong> {ownerMember.name}. Apenas este usuário possui acesso total.
        </div>
      )}
      {activeTab === 'team' && !ownerMember && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          <strong>Atenção:</strong> nenhum perfil de criador foi encontrado na equipe deste haras. Revise o vínculo do criador principal para evitar falhas de permissão.
        </div>
      )}

      {/* Content */}
      {activeTab === 'team' ? (
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted dark:bg-[#0d0d0d]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nome</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">E-mail</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Função</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Último Acesso</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
                {isLoadingMembers && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-muted-foreground dark:text-[#99a1af]"
                    >
                      Carregando equipe...
                    </td>
                  </tr>
                )}
                {!isLoadingMembers && filteredTeam.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-muted-foreground dark:text-[#99a1af]"
                    >
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
                {!isLoadingMembers && filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                    <td className="px-6 py-4 text-foreground dark:text-white">{member.name}</td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{member.email}</td>
                    <td className="px-6 py-4 text-foreground dark:text-white">
                      <div className="flex flex-col">
                        <span>{member.role}</span>
                        {member.isOwner && (
                          <span className="text-xs text-amber-600 dark:text-amber-300">
                            Acesso total (Criador)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{member.lastAccess}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        member.status === 'Ativo' 
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {canManageUsers ? (
                        (() => {
                          const allowEdit = canEditMember(member);
                          const allowDelete = canDeleteMember(member);

                          if (member.isOwner) {
                            return (
                              <span className="text-xs text-amber-600 dark:text-amber-300">
                                Protegido (Criador)
                              </span>
                            );
                          }

                          if (!allowEdit && !allowDelete) {
                            return (
                              <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Sem permissão</span>
                            );
                          }

                          return (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditUserClick(member.id)}
                                disabled={!allowEdit}
                                className={`p-2 rounded-lg transition-colors ${
                                  allowEdit
                                    ? 'hover:bg-card dark:hover:bg-[#2a2a2a]'
                                    : 'opacity-40 cursor-not-allowed'
                                }`}
                              >
                                <Edit className="w-4 h-4 text-foreground dark:text-white" />
                              </button>
                              <button
                                onClick={() => handleDeleteUserClick(member.id)}
                                disabled={!allowDelete}
                                className={`p-2 rounded-lg transition-colors ${
                                  allowDelete
                                    ? 'hover:bg-card dark:hover:bg-[#2a2a2a]'
                                    : 'opacity-40 cursor-not-allowed'
                                }`}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          );
                        })()
                      ) : (
                        <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Sem permissão</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoadingRoles && (
            <div className="col-span-full rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 text-center text-sm text-muted-foreground dark:text-[#99a1af]">
              Carregando funções...
            </div>
          )}
          {!isLoadingRoles && filteredRoles.length === 0 && (
            <div className="col-span-full rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] p-6 text-center text-sm text-muted-foreground dark:text-[#99a1af]">
              Nenhuma função encontrada.
            </div>
          )}
          {!isLoadingRoles && filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-card dark:bg-[#1a1a1a] rounded-xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary dark:bg-white p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white dark:text-black" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    {role.users} usuário{role.users > 1 ? 's' : ''}
                  </span>
                  {role.isLocked && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300">
                      Exclusivo do Criador
                    </span>
                  )}
                  {canManageRoles && !role.isLocked && (
                    <button
                      onClick={() => handleEditRoleClick(role.id)}
                      className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                  )}
                </div>
              </div>
              <h3 className="text-lg text-foreground dark:text-white mb-2">{role.name}</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{role.allowedModules}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar Novo Usuário */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Criar Novo Usuário</h3>
              <button
                onClick={() => {
                  resetUserForm();
                  setShowNewUserModal(false);
                }}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Digite o nome completo"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@harasvaleverde.com"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Senha */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Defina uma senha inicial"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Função e Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Função *
                    </label>
                    <NativeSelect
                      value={formData.roleId}
                      onChange={(e) => {
                        const roleId = e.target.value;
                        const role = selectableRoles.find((item) => item.id === roleId);
                        setFormData({
                          ...formData,
                          roleId,
                          permissions: canDelegatePermissions
                            ? clampPermissions(role ? normalizeTeamPermissions(role.permissions) : emptyPermissions())
                            : resolvePermissionsForRole(roleId),
                        });
                      }}
                      disabled={!canDelegatePermissions}
                    >
                      <option value="">Selecione uma função</option>
                      {selectableRoles.length === 0 && (
                        <option value="" disabled>Nenhuma função disponível</option>
                      )}
                      {selectableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </NativeSelect>
                    {canDelegatePermissions && !hasSelectableRoles && (
                      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] bg-muted/40 dark:bg-[#0d0d0d] px-3 py-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                        <span>Nenhuma função criada ainda.</span>
                        <button
                          type="button"
                          onClick={handleOpenRoleCreator}
                          className="text-primary dark:text-white hover:underline"
                        >
                          Criar função
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Status *
                    </label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </NativeSelect>
                  </div>
                </div>
                {!canDelegatePermissions && (
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Função definida automaticamente com base no perfil de acesso.
                  </p>
                )}

                {/* Perfil de acesso */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Perfil de acesso *
                  </label>
                  <NativeSelect
                    value={formData.systemRole}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      if (!canManageSystemRole(nextRole)) return;
                      const nextRoleId = !canDelegatePermissions
                        ? getDefaultRoleIdForSystemRole(nextRole)
                        : formData.roleId;
                      setFormData({
                        ...formData,
                        systemRole: nextRole,
                        roleId: nextRoleId,
                        permissions: canDelegatePermissions
                          ? formData.permissions
                          : resolvePermissionsForRole(nextRoleId),
                      });
                    }}
                    disabled={availableSystemRoles.length === 0}
                  >
                    {availableSystemRoles.length === 0 && (
                      <option value="" disabled>Nenhum perfil disponível</option>
                    )}
                    {availableSystemRoles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                {/* Permissões por Módulo */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-3">
                    Páginas permitidas *
                  </label>
                  {!canDelegatePermissions && (
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-3">
                      Permissões definidas pelo criador. Você não pode alterar.
                    </p>
                  )}
                  <div className="space-y-4 bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Acesso total:</strong> exclusivo do Criador e não pode ser delegado.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ASSIGNABLE_PERMISSION_KEYS.map((key) => {
                        const label = PERMISSION_LABELS[key];
                        const isDisabled = !canDelegatePermissions || !canDelegatePermission(key);
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-3 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions[key]}
                              disabled={isDisabled}
                              onChange={(e) => setFormData({
                                ...formData,
                                permissions: updatePermissionState(formData.permissions, key, e.target.checked),
                              })}
                              className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Resumo do acesso: {formatAllowedModules(formData.permissions)}
                    </p>
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Informação */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Nota:</strong> Defina uma senha inicial. O usuário poderá alterá-la após o primeiro acesso.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => {
                  resetUserForm();
                  setShowNewUserModal(false);
                }}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Criar Usuário'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Nova Função */}
      {showNewRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Criar Nova Função</h3>
              <button
                onClick={() => {
                  resetRoleForm();
                  setShowNewRoleModal(false);
                }}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Nome da Função */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome da Função *
                  </label>
                  <input
                    type="text"
                    value={roleFormData.name}
                    onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                    placeholder="Ex: Gerente de Operações"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Tipo de Usuário *
                  </label>
                  <NativeSelect
                    value={roleFormData.userType}
                    onChange={(e) => setRoleFormData({ ...roleFormData, userType: e.target.value })}
                  >
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                  </NativeSelect>
                </div>

                {/* Módulos Permitidos */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Módulos Permitidos *
                  </label>
                  <input
                    type="text"
                    value={formatAllowedModules(roleFormData.permissions)}
                    disabled
                    className="w-full h-10 px-4 bg-muted dark:bg-[#2a2a2a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white opacity-80 focus:outline-none"
                  />
                </div>

                {/* Permissões de Ação */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Pode Editar? *
                    </label>
                    <NativeSelect
                      value={roleFormData.canEdit}
                      onChange={(e) => setRoleFormData({ ...roleFormData, canEdit: e.target.value })}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Pode Visualizar? *
                    </label>
                    <NativeSelect
                      value={roleFormData.canView}
                      onChange={(e) => setRoleFormData({ ...roleFormData, canView: e.target.value })}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Pode Excluir? *
                    </label>
                    <NativeSelect
                      value={roleFormData.canDelete}
                      onChange={(e) => setRoleFormData({ ...roleFormData, canDelete: e.target.value })}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </NativeSelect>
                  </div>
                </div>

                {/* Permissões */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-3">
                    Permissões *
                  </label>
                  <div className="space-y-4 bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Acesso total:</strong> exclusivo do Criador e não faz parte das funções personalizadas.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ASSIGNABLE_PERMISSION_KEYS.map((key) => {
                        const label = PERMISSION_LABELS[key];
                        return (
                          <label key={key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={roleFormData.permissions[key]}
                              onChange={(e) => setRoleFormData({
                                ...roleFormData,
                                permissions: updatePermissionState(roleFormData.permissions, key, e.target.checked)
                              })}
                              className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Resumo do acesso: {formatAllowedModules(roleFormData.permissions)}
                    </p>
                  </div>
                </div>

                {/* Informação */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Nota:</strong> A função criada estará disponível para ser atribuída aos usuários da equipe.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => {
                  resetRoleForm();
                  setShowNewRoleModal(false);
                }}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRole}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Criar Função'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Função */}
      {showEditRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Editar Função</h3>
              <button
                onClick={() => {
                  resetRoleForm();
                  setEditingRoleId(null);
                  setShowEditRoleModal(false);
                }}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Nome da Função */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome da Função *
                  </label>
                  <input
                    type="text"
                    value={roleFormData.name}
                    onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                    placeholder="Ex: Gerente de Operações"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Tipo de Usuário */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Tipo de Usuário *
                  </label>
                  <NativeSelect
                    value={roleFormData.userType}
                    onChange={(e) => setRoleFormData({ ...roleFormData, userType: e.target.value })}
                  >
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                  </NativeSelect>
                </div>

                {/* Módulos Permitidos */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Módulos Permitidos *
                  </label>
                  <input
                    type="text"
                    value={formatAllowedModules(roleFormData.permissions)}
                    disabled
                    className="w-full h-10 px-4 bg-muted dark:bg-[#2a2a2a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white opacity-80 focus:outline-none"
                  />
                </div>

                {/* Permissões de Ação */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Pode Editar? *
                    </label>
                    <NativeSelect
                      value={roleFormData.canEdit}
                      onChange={(e) => setRoleFormData({ ...roleFormData, canEdit: e.target.value })}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Pode Visualizar? *
                    </label>
                    <NativeSelect
                      value={roleFormData.canView}
                      onChange={(e) => setRoleFormData({ ...roleFormData, canView: e.target.value })}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Pode Excluir? *
                    </label>
                    <NativeSelect
                      value={roleFormData.canDelete}
                      onChange={(e) => setRoleFormData({ ...roleFormData, canDelete: e.target.value })}
                    >
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                    </NativeSelect>
                  </div>
                </div>

                {/* Permissões */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-3">
                    Permissões *
                  </label>
                  <div className="space-y-4 bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Acesso total:</strong> exclusivo do Criador e não faz parte das funções personalizadas.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ASSIGNABLE_PERMISSION_KEYS.map((key) => {
                        const label = PERMISSION_LABELS[key];
                        return (
                          <label key={key} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={roleFormData.permissions[key]}
                              onChange={(e) => setRoleFormData({
                                ...roleFormData,
                                permissions: updatePermissionState(roleFormData.permissions, key, e.target.checked)
                              })}
                              className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Resumo do acesso: {formatAllowedModules(roleFormData.permissions)}
                    </p>
                  </div>
                </div>

                {/* Informação */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Nota:</strong> A função criada estará disponível para ser atribuída aos usuários da equipe.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => {
                  resetRoleForm();
                  setEditingRoleId(null);
                  setShowEditRoleModal(false);
                }}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Atualizar Função'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuário */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Editar Usuário</h3>
              <button
                onClick={() => {
                  resetUserForm();
                  setEditingUserId(null);
                  setEditingMemberId(null);
                  setShowEditUserModal(false);
                }}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Digite o nome completo"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@harasvaleverde.com"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Função e Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Função *
                    </label>
                    <NativeSelect
                      value={formData.roleId}
                      onChange={(e) => {
                        const roleId = e.target.value;
                        const role = selectableRoles.find((item) => item.id === roleId);
                        setFormData({
                          ...formData,
                          roleId,
                          permissions: canDelegatePermissions
                            ? clampPermissions(role ? normalizeTeamPermissions(role.permissions) : emptyPermissions())
                            : resolvePermissionsForRole(roleId),
                        });
                      }}
                      disabled={!canDelegatePermissions}
                    >
                      <option value="">Selecione uma função</option>
                      {selectableRoles.length === 0 && (
                        <option value="" disabled>Nenhuma função disponível</option>
                      )}
                      {selectableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </NativeSelect>
                    {canDelegatePermissions && !hasSelectableRoles && (
                      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)] bg-muted/40 dark:bg-[#0d0d0d] px-3 py-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                        <span>Nenhuma função criada ainda.</span>
                        <button
                          type="button"
                          onClick={handleOpenRoleCreator}
                          className="text-primary dark:text-white hover:underline"
                        >
                          Criar função
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Status *
                    </label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </NativeSelect>
                  </div>
                </div>
                {!canDelegatePermissions && (
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    Função definida automaticamente com base no perfil de acesso.
                  </p>
                )}

                {/* Perfil de acesso */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Perfil de acesso *
                  </label>
                  <NativeSelect
                    value={formData.systemRole}
                    onChange={(e) => {
                      const nextRole = e.target.value;
                      if (!canManageSystemRole(nextRole)) return;
                      const nextRoleId = !canDelegatePermissions
                        ? getDefaultRoleIdForSystemRole(nextRole)
                        : formData.roleId;
                      setFormData({
                        ...formData,
                        systemRole: nextRole,
                        roleId: nextRoleId,
                        permissions: canDelegatePermissions
                          ? formData.permissions
                          : resolvePermissionsForRole(nextRoleId),
                      });
                    }}
                    disabled={availableSystemRoles.length === 0}
                  >
                    {availableSystemRoles.length === 0 && (
                      <option value="" disabled>Nenhum perfil disponível</option>
                    )}
                    {availableSystemRoles.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                {/* Permissões por Módulo */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-3">
                    Páginas permitidas *
                  </label>
                  {!canDelegatePermissions && (
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-3">
                      Permissões definidas pelo criador. Você não pode alterar.
                    </p>
                  )}
                  <div className="space-y-4 bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                      <strong>Acesso total:</strong> exclusivo do Criador e não pode ser delegado.
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ASSIGNABLE_PERMISSION_KEYS.map((key) => {
                        const label = PERMISSION_LABELS[key];
                        const isDisabled = !canDelegatePermissions || !canDelegatePermission(key);
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-3 ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions[key]}
                              disabled={isDisabled}
                              onChange={(e) => setFormData({
                                ...formData,
                                permissions: updatePermissionState(formData.permissions, key, e.target.checked),
                              })}
                              className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                            />
                            <span className="text-sm text-foreground dark:text-white">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      Resumo do acesso: {formatAllowedModules(formData.permissions)}
                    </p>
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Informação */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Nota:</strong> A senha deve ser atualizada pelo próprio usuário.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => {
                  resetUserForm();
                  setEditingUserId(null);
                  setEditingMemberId(null);
                  setShowEditUserModal(false);
                }}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Atualizar Usuário'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Confirmar Exclusão</h3>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <p className="text-sm text-foreground dark:text-white">
                  Você tem certeza de que deseja excluir este usuário?
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 bg-red-500 dark:bg-red-500 text-white dark:text-black rounded-xl transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Excluindo...
                  </span>
                ) : (
                  'Excluir'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
