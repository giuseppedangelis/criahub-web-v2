import { Search, Plus, Users, X, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

export function AdvisorTeamContent() {
  const [activeTab, setActiveTab] = useState('team');
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [team, setTeam] = useState([
    { id: 1, name: 'João Silva', email: 'joao@harasvaleverde.com', role: 'Peão', phone: '(35) 99123-4567', lastAccess: '18/11/2024', status: 'Ativo' },
    { id: 2, name: 'Dra. Maria Santos', email: 'maria@harasvaleverde.com', role: 'Veterinária', phone: '(35) 99234-5678', lastAccess: '18/11/2024', status: 'Ativo' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@harasvaleverde.com', role: 'Treinador', phone: '(35) 99345-6789', lastAccess: '15/11/2024', status: 'Ativo' },
    { id: 4, name: 'Patrícia Almeida', email: 'patricia@harasvaleverde.com', role: 'Assessora', phone: '(35) 99456-7890', lastAccess: '18/11/2024', status: 'Ativo' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    status: 'Ativo',
    permissions: {
      viewHerd: false,
      registerActivities: false,
      healthManagement: false,
      reproduction: false,
      financialManagement: false,
      trainingManagement: false,
      teamManagement: false,
      documentManagement: false,
      fullAdministrative: false,
    }
  });

  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Peão', 
      userType: 'Interno',
      allowedModules: 'Plantel, Saúde',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Não',
      users: 3 
    },
    { 
      id: 2, 
      name: 'Veterinária', 
      userType: 'Interno',
      allowedModules: 'Saúde, Reprodução',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Sim',
      users: 2 
    },
    { 
      id: 3, 
      name: 'Treinador', 
      userType: 'Interno',
      allowedModules: 'Plantel, Treinamento',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Não',
      users: 2 
    },
    { 
      id: 4, 
      name: 'Assessor', 
      userType: 'Interno',
      allowedModules: 'Todos',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Sim',
      users: 1 
    },
  ]);

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    userType: 'Interno',
    allowedModules: '',
    canEdit: 'Sim',
    canView: 'Sim',
    canDelete: 'Não',
    permissions: {
      viewHerd: false,
      registerActivities: false,
      healthManagement: false,
      reproduction: false,
      financialManagement: false,
      trainingManagement: false,
      teamManagement: false,
      documentManagement: false,
      fullAdministrative: false,
    }
  });

  const handleCreateUser = () => {
    // Validação
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    // Criar novo usuário
    const newUser = {
      id: team.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone: formData.phone || '-',
      lastAccess: 'Nunca',
      status: formData.status
    };

    setTeam([...team, newUser]);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: '',
      phone: '',
      status: 'Ativo',
      permissions: {
        viewHerd: false,
        registerActivities: false,
        healthManagement: false,
        reproduction: false,
        financialManagement: false,
        trainingManagement: false,
        teamManagement: false,
        documentManagement: false,
        fullAdministrative: false,
      }
    });

    setShowNewUserModal(false);
    toast.success('Usuário criado com sucesso!');
  };

  const handleCreateRole = () => {
    // Validação
    if (!roleFormData.name) {
      toast.error('Digite o nome da função');
      return;
    }

    if (!roleFormData.allowedModules) {
      toast.error('Especifique os módulos permitidos');
      return;
    }

    // Verificar se pelo menos uma permissão foi selecionada
    const hasPermissions = Object.values(roleFormData.permissions).some(p => p);
    if (!hasPermissions) {
      toast.error('Selecione pelo menos uma permissão');
      return;
    }

    // Criar string de permissões baseada nas seleções
    const permissionLabels = {
      viewHerd: 'Plantel',
      registerActivities: 'Atividades',
      healthManagement: 'Saúde',
      reproduction: 'Reprodução',
      financialManagement: 'Financeiro',
      trainingManagement: 'Treinamento',
      teamManagement: 'Equipe',
      documentManagement: 'Documentos',
      fullAdministrative: 'Administrativo',
    };

    const selectedPermissions = Object.entries(roleFormData.permissions)
      .filter(([_, value]) => value)
      .map(([key, _]) => permissionLabels[key as keyof typeof permissionLabels])
      .join(', ');

    // Criar nova função
    const newRole = {
      id: roles.length + 1,
      name: roleFormData.name,
      userType: roleFormData.userType,
      allowedModules: roleFormData.allowedModules || selectedPermissions,
      canEdit: roleFormData.canEdit,
      canView: roleFormData.canView,
      canDelete: roleFormData.canDelete,
      users: 0
    };

    setRoles([...roles, newRole]);

    // Reset form
    setRoleFormData({
      name: '',
      userType: 'Interno',
      allowedModules: '',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Não',
      permissions: {
        viewHerd: false,
        registerActivities: false,
        healthManagement: false,
        reproduction: false,
        financialManagement: false,
        trainingManagement: false,
        teamManagement: false,
        documentManagement: false,
        fullAdministrative: false,
      }
    });

    setShowNewRoleModal(false);
    toast.success('Função criada com sucesso!');
  };

  const handleEditRole = () => {
    if (editingRoleId === null) return;

    // Validação
    if (!roleFormData.name) {
      toast.error('Digite o nome da função');
      return;
    }

    if (!roleFormData.allowedModules) {
      toast.error('Especifique os módulos permitidos');
      return;
    }

    // Verificar se pelo menos uma permissão foi selecionada
    const hasPermissions = Object.values(roleFormData.permissions).some(p => p);
    if (!hasPermissions) {
      toast.error('Selecione pelo menos uma permissão');
      return;
    }

    // Criar string de permissões baseada nas seleções
    const permissionLabels = {
      viewHerd: 'Plantel',
      registerActivities: 'Atividades',
      healthManagement: 'Saúde',
      reproduction: 'Reprodução',
      financialManagement: 'Financeiro',
      trainingManagement: 'Treinamento',
      teamManagement: 'Equipe',
      documentManagement: 'Documentos',
      fullAdministrative: 'Administrativo',
    };

    const selectedPermissions = Object.entries(roleFormData.permissions)
      .filter(([_, value]) => value)
      .map(([key, _]) => permissionLabels[key as keyof typeof permissionLabels])
      .join(', ');

    // Atualizar função existente
    const updatedRoles = roles.map(role => {
      if (role.id === editingRoleId) {
        return {
          ...role,
          name: roleFormData.name,
          userType: roleFormData.userType,
          allowedModules: roleFormData.allowedModules || selectedPermissions,
          canEdit: roleFormData.canEdit,
          canView: roleFormData.canView,
          canDelete: roleFormData.canDelete,
        };
      }
      return role;
    });

    setRoles(updatedRoles);

    // Reset form
    setRoleFormData({
      name: '',
      userType: 'Interno',
      allowedModules: '',
      canEdit: 'Sim',
      canView: 'Sim',
      canDelete: 'Não',
      permissions: {
        viewHerd: false,
        registerActivities: false,
        healthManagement: false,
        reproduction: false,
        financialManagement: false,
        trainingManagement: false,
        teamManagement: false,
        documentManagement: false,
        fullAdministrative: false,
      }
    });

    setShowEditRoleModal(false);
    toast.success('Função atualizada com sucesso!');
  };

  const handleEditRoleClick = (roleId: number) => {
    const role = roles.find(role => role.id === roleId);
    if (role) {
      setRoleFormData({
        name: role.name,
        userType: role.userType,
        allowedModules: role.allowedModules,
        canEdit: role.canEdit,
        canView: role.canView,
        canDelete: role.canDelete,
        permissions: {
          viewHerd: role.allowedModules.includes('Plantel'),
          registerActivities: role.allowedModules.includes('Atividades'),
          healthManagement: role.allowedModules.includes('Saúde'),
          reproduction: role.allowedModules.includes('Reprodução'),
          financialManagement: role.allowedModules.includes('Financeiro'),
          trainingManagement: role.allowedModules.includes('Treinamento'),
          teamManagement: role.allowedModules.includes('Equipe'),
          documentManagement: role.allowedModules.includes('Documentos'),
          fullAdministrative: role.allowedModules.includes('Administrativo') || role.allowedModules.includes('Todos'),
        }
      });
      setEditingRoleId(roleId);
      setShowEditRoleModal(true);
    }
  };

  const handleEditUserClick = (userId: number) => {
    const user = team.find(user => user.id === userId);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        permissions: {
          viewHerd: false,
          registerActivities: false,
          healthManagement: false,
          reproduction: false,
          financialManagement: false,
          trainingManagement: false,
          teamManagement: false,
          documentManagement: false,
          fullAdministrative: false,
        }
      });
      setEditingUserId(userId);
      setShowEditUserModal(true);
    }
  };

  const handleDeleteUserClick = (userId: number) => {
    setUserToDelete(userId);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete === null) return;

    const updatedTeam = team.filter(user => user.id !== userToDelete);
    setTeam(updatedTeam);

    setUserToDelete(null);
    setShowDeleteConfirmModal(false);
    toast.success('Usuário excluído com sucesso!');
  };

  const handleUpdateUser = () => {
    if (editingUserId === null) return;

    // Validação
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    // Atualizar usuário existente
    const updatedTeam = team.map(user => {
      if (user.id === editingUserId) {
        return {
          ...user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone || '-',
          status: formData.status,
        };
      }
      return user;
    });

    setTeam(updatedTeam);

    // Reset form
    setFormData({
      name: '',
      email: '',
      role: '',
      phone: '',
      status: 'Ativo',
      permissions: {
        viewHerd: false,
        registerActivities: false,
        healthManagement: false,
        reproduction: false,
        financialManagement: false,
        trainingManagement: false,
        teamManagement: false,
        documentManagement: false,
        fullAdministrative: false,
      }
    });

    setEditingUserId(null);
    setShowEditUserModal(false);
    toast.success('Usuário atualizado com sucesso!');
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
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'team') {
              setShowNewUserModal(true);
            } else {
              setShowNewRoleModal(true);
            }
          }}
          className="w-full lg:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {activeTab === 'team' ? 'Criar Novo Usuário' : 'Criar Nova Função'}
        </button>
      </div>

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
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                    <td className="px-6 py-4 text-foreground dark:text-white">{member.name}</td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{member.email}</td>
                    <td className="px-6 py-4 text-foreground dark:text-white">{member.role}</td>
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditUserClick(member.id)}
                          className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-foreground dark:text-white" />
                        </button>
                        <button
                          onClick={() => handleDeleteUserClick(member.id)}
                          className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
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
                  <button
                    onClick={() => handleEditRoleClick(role.id)}
                    className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-foreground dark:text-white" />
                  </button>
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
                onClick={() => setShowNewUserModal(false)}
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
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="">Selecione uma função</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </NativeSelect>
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
                    <strong>Nota:</strong> O usuário receberá um email com instruções para criar sua senha e acessar o sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowNewUserModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Criar Usuário
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
                onClick={() => setShowNewRoleModal(false)}
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
                    value={roleFormData.allowedModules}
                    onChange={(e) => setRoleFormData({ ...roleFormData, allowedModules: e.target.value })}
                    placeholder="Ex: Plantel, Saúde, Reprodução"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
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
                  <div className="space-y-3 bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.viewHerd}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, viewHerd: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Plantel</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.registerActivities}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, registerActivities: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Atividades</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.healthManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, healthManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Saúde</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.reproduction}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, reproduction: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Reprodução</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.financialManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, financialManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Financeiro</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.trainingManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, trainingManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Treinamento</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.teamManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, teamManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Equipe</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.documentManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, documentManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Documentos</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.fullAdministrative}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, fullAdministrative: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Administrativo</span>
                    </label>
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
                onClick={() => setShowNewRoleModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateRole}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Criar Função
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
                onClick={() => setShowEditRoleModal(false)}
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
                    value={roleFormData.allowedModules}
                    onChange={(e) => setRoleFormData({ ...roleFormData, allowedModules: e.target.value })}
                    placeholder="Ex: Plantel, Saúde, Reprodução"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
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
                  <div className="space-y-3 bg-muted dark:bg-[#0d0d0d] rounded-xl p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.viewHerd}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, viewHerd: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Plantel</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.registerActivities}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, registerActivities: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Atividades</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.healthManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, healthManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Saúde</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.reproduction}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, reproduction: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Reprodução</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.financialManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, financialManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Financeiro</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.trainingManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, trainingManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Treinamento</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.teamManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, teamManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Equipe</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.documentManagement}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, documentManagement: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Documentos</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={roleFormData.permissions.fullAdministrative}
                        onChange={(e) => setRoleFormData({
                          ...roleFormData,
                          permissions: { ...roleFormData.permissions, fullAdministrative: e.target.checked }
                        })}
                        className="w-4 h-4 rounded border-border dark:border-[rgba(255,255,255,0.1)] text-primary dark:text-white focus:ring-primary dark:focus:ring-white"
                      />
                      <span className="text-sm text-foreground dark:text-white">Administrativo</span>
                    </label>
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
                onClick={() => setShowEditRoleModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditRole}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Atualizar Função
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
                onClick={() => setShowEditUserModal(false)}
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
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="">Selecione uma função</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </NativeSelect>
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
                    <strong>Nota:</strong> O usuário receberá um email com instruções para criar sua senha e acessar o sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowEditUserModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateUser}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Atualizar Usuário
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
                className="flex-1 py-3 px-4 bg-red-500 dark:bg-red-500 text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}