
import {
  Search,
  Plus,
  Edit,
  Calendar,
  Trash2,
  X,
  FileText,
  Image as ImageIcon,
  Upload,
  AlertTriangle,
  Eye,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NativeSelect } from '../ui/native-select';
import { AdvisorPendingValidation } from './AdvisorPendingValidation';
import { toast } from 'sonner';
import { supabase } from '@/services/base';
import { useCurrentHaras } from '@/hooks/useHaras';
import { useAnimals } from '@/hooks/useAnimals';
import { useHarasTeamMembers } from '@/hooks/useHarasSettings';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '@/hooks/useTasks';
import type { Task, TaskDocument, TaskPhoto, TaskPriority, TaskStatus } from '@/types';
import { formatDate } from '../breeder/financialUtils';
import { useUser } from '@/contexts/UserContext';

interface AdvisorTasksContentProps {
  showPendingValidation?: boolean;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

const createId = () => Math.random().toString(36).slice(2, 9);
const TASKS_BUCKET = 'animals';

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '');

const buildTaskStoragePath = (harasId: string, folder: 'documents' | 'photos', fileName: string) => {
  const ext = fileName.split('.').pop();
  const base = sanitizeFileName(fileName.replace(/\.[^/.]+$/, '')) || 'arquivo';
  return `${harasId}/tasks/${folder}/${Date.now()}_${base}${ext ? `.${ext}` : ''}`;
};

const uploadTaskFile = async (harasId: string, folder: 'documents' | 'photos', file: File) => {
  const filePath = buildTaskStoragePath(harasId, folder, file.name);
  const { error } = await supabase.storage.from(TASKS_BUCKET).upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage.from(TASKS_BUCKET).getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error('Erro ao obter URL do arquivo.');

  return data.publicUrl;
};

export function AdvisorTasksContent({ showPendingValidation = true }: AdvisorTasksContentProps) {
  const { data: currentHaras } = useCurrentHaras();
  const harasId = currentHaras?.id || '';
  const { profile, userRole } = useUser();
  const currentUserId = profile?.id || '';
  const isAdvisor = userRole === 'assessor';

  const { data: animalsResponse } = useAnimals(
    { haras_id: harasId },
    { page: 1, limit: 200 },
    !!harasId
  );
  const animals = animalsResponse?.data || [];

  const { data: teamMembers } = useHarasTeamMembers(harasId);
  const assignableMembers = useMemo(() => {
    if (!teamMembers) return [];
    if (!isAdvisor) return teamMembers;

    const allowedRoles = ['peao', 'veterinario'];
    return teamMembers.filter((member) => member.role && allowedRoles.includes(member.role));
  }, [teamMembers, isAdvisor]);

  const { data: tasksResponse, isLoading: isLoadingTasks } = useTasks(
    { haras_id: harasId },
    { page: 1, limit: 200 },
    !!harasId
  );
  const tasks = tasksResponse?.data || [];

  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPendingValidationScreen, setShowPendingValidationScreen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['pending-validations', harasId],
    enabled: showPendingValidation && !!harasId,
    queryFn: async () => {
      const { count, error } = await (supabase as any)
        .from('pending_validations')
        .select('*', { count: 'exact', head: true })
        .eq('haras_id', harasId)
        .eq('status', 'pendente');

      if (error) {
        console.warn('Erro ao buscar pendencias:', error);
        return 0;
      }

      return count || 0;
    },
  });

  const [formData, setFormData] = useState({
    due_date: '',
    animal_id: '',
    title: '',
    responsible_id: '',
    status: 'pendente' as TaskStatus,
    priority: 'media' as TaskPriority,
    observations: '',
    documents: [] as TaskDocument[],
    photos: [] as TaskPhoto[],
  });

  const filteredTasks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const base = showOnlyMine && currentUserId
      ? tasks.filter((task) => task.responsible_id === currentUserId)
      : tasks;

    if (!query) return base;

    return base.filter((task) => {
      const animalName = task.animal?.name?.toLowerCase() || '';
      const responsibleName =
        task.responsible?.full_name?.toLowerCase() || task.responsible?.email?.toLowerCase() || '';
      const title = task.title.toLowerCase();
      const observations = (task.observations || '').toLowerCase();

      return (
        title.includes(query) ||
        animalName.includes(query) ||
        responsibleName.includes(query) ||
        observations.includes(query)
      );
    });
  }, [tasks, searchTerm, showOnlyMine, currentUserId]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-500/20 text-green-500';
      case 'em_andamento':
        return 'bg-blue-500/20 text-blue-500';
      case 'pendente':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-500/20 text-red-500';
      case 'media':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'baixa':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getResponsibleLabel = (task: Task) => {
    const fullName = task.responsible?.full_name || '';
    if (fullName) return fullName;
    return task.responsible?.email || '-';
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateTask({
        id: taskId,
        input: {
          status: 'concluida',
        },
      });
      toast.success('Tarefa concluída!');
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      toast.error('Erro ao concluir tarefa.');
    }
  };

  const handleCreateTask = async () => {
    if (!harasId) {
      toast.error('Haras nao identificado');
      return;
    }
    if (!formData.due_date || !formData.title || !formData.responsible_id) {
      toast.error('Preencha todos os campos obrigatorios');
      return;
    }
    if (isAdvisor && currentUserId && formData.responsible_id === currentUserId) {
      toast.error('Atribua a tarefa para outro membro da equipe.');
      return;
    }

    try {
      await createTask({
        haras_id: harasId,
        title: formData.title,
        due_date: formData.due_date,
        status: formData.status,
        priority: formData.priority,
        observations: formData.observations || null,
        animal_id: formData.animal_id || null,
        responsible_id: formData.responsible_id || null,
        documents: formData.documents,
        photos: formData.photos,
      });

      setFormData({
        due_date: '',
        animal_id: '',
        title: '',
        responsible_id: '',
        status: 'pendente',
        priority: 'media',
        observations: '',
        documents: [],
        photos: [],
      });

      setShowCreateModal(false);
      toast.success('Tarefa criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa.');
    }
  };

  const handleEditTaskClick = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    setFormData({
      due_date: task.due_date,
      animal_id: task.animal_id || task.animal?.id || '',
      title: task.title,
      responsible_id: task.responsible_id || task.responsible?.id || '',
      status: task.status,
      priority: task.priority,
      observations: task.observations || '',
      documents: task.documents || [],
      photos: task.photos || [],
    });

    setEditingTaskId(taskId);
    setShowEditModal(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTaskId) return;
    if (!formData.due_date || !formData.title || !formData.responsible_id) {
      toast.error('Preencha todos os campos obrigatorios');
      return;
    }
    if (isAdvisor && currentUserId && formData.responsible_id === currentUserId) {
      const originalTask = tasks.find((item) => item.id === editingTaskId);
      const originalResponsibleId = originalTask?.responsible_id || originalTask?.responsible?.id || '';
      if (!originalResponsibleId || originalResponsibleId !== currentUserId) {
        toast.error('Atribua a tarefa para outro membro da equipe.');
        return;
      }
    }

    try {
      await updateTask({
        id: editingTaskId,
        input: {
          title: formData.title,
          due_date: formData.due_date,
          status: formData.status,
          priority: formData.priority,
          observations: formData.observations || null,
          animal_id: formData.animal_id || null,
          responsible_id: formData.responsible_id || null,
          documents: formData.documents,
          photos: formData.photos,
        },
      });

      setFormData({
        due_date: '',
        animal_id: '',
        title: '',
        responsible_id: '',
        status: 'pendente',
        priority: 'media',
        observations: '',
        documents: [],
        photos: [],
      });

      setEditingTaskId(null);
      setShowEditModal(false);
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa.');
    }
  };

  const handleDeleteTaskClick = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
      setShowDeleteConfirmModal(false);
      setShowEditModal(false);
      toast.success('Tarefa excluida com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa.');
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!harasId) {
      toast.error('Haras nao identificado');
      return;
    }

    try {
      const newDocuments = await Promise.all(
        Array.from(files).map(async (file) => ({
          id: createId(),
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          url: await uploadTaskFile(harasId, 'documents', file),
        }))
      );

      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments],
      }));

      toast.success(`${newDocuments.length} documento(s) adicionado(s)`);
    } catch (error) {
      console.error('Erro ao enviar documentos:', error);
      toast.error('Erro ao enviar documentos. Tente novamente.');
    } finally {
      e.target.value = '';
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!harasId) {
      toast.error('Haras nao identificado');
      return;
    }

    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => ({
          id: createId(),
          url: await uploadTaskFile(harasId, 'photos', file),
          name: file.name,
        }))
      );

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploaded],
      }));

      toast.success(`${uploaded.length} foto(s) adicionada(s)`);
    } catch (error) {
      console.error('Erro ao enviar fotos:', error);
      toast.error('Erro ao enviar fotos. Tente novamente.');
    } finally {
      e.target.value = '';
    }
  };

  const removeDocument = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
    toast.success('Documento removido');
  };

  const removePhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== id),
    }));
    toast.success('Foto removida');
  };

  if (showPendingValidationScreen) {
    return <AdvisorPendingValidation onBack={() => setShowPendingValidationScreen(false)} />;
  }

  return (
    <div className="space-y-6">
      {showPendingValidation && pendingCount > 0 && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5 border-2 border-orange-500 dark:border-orange-600 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-foreground dark:text-white mb-2">Pendencias de Campo Aguardando Validacao</h3>
              <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
                {pendingCount} registro(s) enviados pela equipe de campo precisam ser revisados e aprovados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPendingValidationScreen(true)}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Validar Pendencias
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h2 className="text-foreground dark:text-white mb-1">Gestao de Tarefas</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Tarefas</p>
      </div>

      {!harasId && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Seu usuario ainda nao esta vinculado a nenhum Haras.
          </p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          {isAdvisor && (
            <button
              onClick={() => setShowOnlyMine(!showOnlyMine)}
              className="w-full sm:w-auto px-4 py-3 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
            >
              {showOnlyMine ? 'Mostrando minhas tarefas' : 'Mostrar minhas tarefas'}
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Criar tarefa
          </button>
        </div>
      </div>

      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">No</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Animal</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tarefa</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Responsavel</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status / Prioridade</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Observacoes</th>
                <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {isLoadingTasks && (
                <tr>
                  <td colSpan={8} className="px-6 py-6 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Carregando tarefas...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoadingTasks && filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-6 text-center text-sm text-muted-foreground">
                    Nenhuma tarefa encontrada.
                  </td>
                </tr>
              )}

              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4 text-foreground dark:text-white">
                    {task.task_number ? String(task.task_number).padStart(3, '0') : '-'}
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white">
                    {formatDate(task.due_date)}
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white">
                    {task.animal?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{task.title}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{getResponsibleLabel(task)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                        {STATUS_LABELS[task.status]}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white max-w-[200px] truncate">
                    {task.observations || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {currentUserId && task.responsible_id === currentUserId && task.status !== 'concluida' && (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Concluir tarefa"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditTaskClick(task.id)}
                        className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-foreground dark:text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteTaskClick(task.id)}
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Criar Tarefa</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Data *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Animal</label>
                  <NativeSelect
                    value={formData.animal_id}
                    onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
                  >
                    <option value="">Nenhum</option>
                    {animals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Tarefa *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite a tarefa"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Responsavel *</label>
                  <NativeSelect
                    value={formData.responsible_id}
                    onChange={(e) => setFormData({ ...formData, responsible_id: e.target.value })}
                  >
                    <option value="">Selecione o responsavel</option>
                  {assignableMembers.map((member) => (
                    <option key={member.id} value={member.id} disabled={isAdvisor && member.id === currentUserId}>
                      {member.full_name || member.email || 'Sem nome'}
                    </option>
                  ))}
                  </NativeSelect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Status *</label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluida">Concluída</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Prioridade *</label>
                    <NativeSelect
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </NativeSelect>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Observacoes</label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Digite observacoes sobre a tarefa"
                    rows={3}
                    className="w-full px-4 py-3 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Documentos</label>
                  <div className="flex flex-wrap gap-3">
                    {formData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="group relative flex items-center gap-2 px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl"
                      >
                        <FileText className="w-4 h-4 text-foreground dark:text-white flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground dark:text-white truncate max-w-[120px]">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-[#6b6b6b]">
                            {doc.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-foreground dark:text-white" />
                      <span className="text-sm text-foreground dark:text-white">Selecionar Documentos</span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground dark:text-[#6b6b6b]">
                    Formatos aceitos: PDF, DOC, DOCX, TXT
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Fotos</label>
                  <div className="flex flex-wrap gap-3">
                    {formData.photos.map((photo) => (
                      <div key={photo.id} className="group relative flex flex-col items-end gap-1">
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)]">
                          {photo.url ? (
                            <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted dark:bg-[#0d0d0d]">
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <label className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <ImageIcon className="w-5 h-5 text-foreground dark:text-white" />
                      <span className="text-sm text-foreground dark:text-white">Selecionar Fotos</span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground dark:text-[#6b6b6b]">
                    Formatos aceitos: JPG, PNG, GIF, WEBP
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                disabled={isCreating}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                {isCreating ? 'Salvando...' : 'Criar Tarefa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Editar Tarefa</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Data *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Animal</label>
                  <NativeSelect
                    value={formData.animal_id}
                    onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
                  >
                    <option value="">Nenhum</option>
                    {animals.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.name}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Tarefa *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite a tarefa"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Responsavel *</label>
                  <NativeSelect
                    value={formData.responsible_id}
                    onChange={(e) => setFormData({ ...formData, responsible_id: e.target.value })}
                  >
                    <option value="">Selecione o responsavel</option>
                    {assignableMembers.map((member) => (
                      <option key={member.id} value={member.id} disabled={isAdvisor && member.id === currentUserId}>
                        {member.full_name || member.email || 'Sem nome'}
                      </option>
                    ))}
                  </NativeSelect>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Status *</label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluida">Concluída</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">Prioridade *</label>
                    <NativeSelect
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </NativeSelect>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Observacoes</label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Digite observacoes sobre a tarefa"
                    rows={3}
                    className="w-full px-4 py-3 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Documentos</label>
                  <div className="flex flex-wrap gap-3">
                    {formData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="group relative flex items-center gap-2 px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl"
                      >
                        <FileText className="w-4 h-4 text-foreground dark:text-white flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground dark:text-white truncate max-w-[120px]">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-[#6b6b6b]">
                            {doc.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <label className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                      <Upload className="w-5 h-5 text-foreground dark:text-white" />
                      <span className="text-sm text-foreground dark:text-white">Selecionar Documentos</span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground dark:text-[#6b6b6b]">
                    Formatos aceitos: PDF, DOC, DOCX, TXT
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Fotos</label>
                  <div className="flex flex-wrap gap-3">
                    {formData.photos.map((photo, index) => (
                      <div key={photo.id} className="group relative flex flex-col items-end gap-1">
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)]">
                          {photo.url ? (
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted dark:bg-[#0d0d0d]">
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <label className="flex items-center justify-center gap-2 w-full h-10 bg-card dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:opacity-80 transition-opacity">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <ImageIcon className="w-5 h-5 text-foreground dark:text-white" />
                      <span className="text-sm text-foreground dark:text-white">Selecionar Fotos</span>
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground dark:text-[#6b6b6b]">
                    Formatos aceitos: JPG, PNG, GIF, WEBP
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateTask}
                disabled={isUpdating}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                {isUpdating ? 'Salvando...' : 'Salvar Alteracoes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-center p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Confirmar Exclusao</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-foreground dark:text-white text-center">
                Voce tem certeza de que deseja excluir esta tarefa?
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 h-10 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTask}
                disabled={isDeleting}
                className="flex-1 h-10 px-4 bg-red-500 dark:bg-red-500 text-white dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
