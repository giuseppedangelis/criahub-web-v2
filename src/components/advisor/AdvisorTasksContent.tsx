import { Search, Plus, Edit, Calendar, ChevronDown, Trash2, X, FileText, Image as ImageIcon, Upload, ChevronLeft, ChevronRight, AlertTriangle, Eye } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { AdvisorPendingValidation } from './AdvisorPendingValidation';
import { toast } from 'sonner';

interface Task {
  id: number;
  number: string;
  date: string;
  animal: string;
  task: string;
  responsible: string;
  status: string;
  priority: string;
  observations: string;
  documents?: { id: string; name: string; size: string }[];
  photos?: { id: string; url: string; name: string }[];
}

export function AdvisorTasksContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showPendingValidation, setShowPendingValidation] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      number: '001', 
      date: '12/03/2020', 
      animal: 'Dama da Pavibra', 
      task: 'Aplicar vermífugo', 
      responsible: 'João (Peão)', 
      status: 'Em andamento', 
      priority: 'Média', 
      observations: 'Realizada sem intercorrências',
      documents: [
        { id: 'doc1', name: 'Receita_Vermifugo.pdf', size: '245.3 KB' },
        { id: 'doc2', name: 'Comprovante_Compra.pdf', size: '112.8 KB' }
      ],
      photos: [
        { id: 'photo1', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=300', name: 'animal_antes.jpg' },
        { id: 'photo2', url: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=300', name: 'medicamento.jpg' }
      ]
    },
    { 
      id: 2, 
      number: '002', 
      date: '13/03/2020', 
      animal: 'Estrela do Vale', 
      task: 'Vacinação', 
      responsible: 'Dra. Maria (Veterinária)', 
      status: 'Concluída', 
      priority: 'Alta', 
      observations: 'Aplicada vacina antirrábica',
      documents: [
        { id: 'doc3', name: 'Certificado_Vacinacao.pdf', size: '523.1 KB' }
      ],
      photos: [
        { id: 'photo3', url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=300', name: 'vacinacao_realizada.jpg' }
      ]
    },
    { 
      id: 3, 
      number: '003', 
      date: '14/03/2020', 
      animal: 'Rei da Marcha', 
      task: 'Treinamento de marcha', 
      responsible: 'Pedro (Treinador)', 
      status: 'Pendente', 
      priority: 'Baixa', 
      observations: 'Aguardando clima favorável' 
    },
  ]);

  const [formData, setFormData] = useState({
    date: '',
    animal: '',
    task: '',
    responsible: '',
    status: 'Pendente',
    priority: 'Média',
    observations: '',
    documents: [] as { id: string; name: string; size: string }[],
    photos: [] as { id: string; url: string; name: string }[],
  });

  const handleCreateTask = () => {
    // Validação
    if (!formData.date || !formData.task || !formData.responsible) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Criar nova tarefa
    const newTask: Task = {
      id: tasks.length + 1,
      number: String(tasks.length + 1).padStart(3, '0'),
      date: formData.date,
      animal: formData.animal || '-',
      task: formData.task,
      responsible: formData.responsible,
      status: formData.status,
      priority: formData.priority,
      observations: formData.observations || '-',
      documents: formData.documents,
      photos: formData.photos,
    };

    setTasks([...tasks, newTask]);

    // Reset form
    setFormData({
      date: '',
      animal: '',
      task: '',
      responsible: '',
      status: 'Pendente',
      priority: 'Média',
      observations: '',
      documents: [],
      photos: [],
    });

    setShowCreateModal(false);
    toast.success('Tarefa criada com sucesso!');
  };

  const handleEditTaskClick = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setFormData({
        date: task.date,
        animal: task.animal,
        task: task.task,
        responsible: task.responsible,
        status: task.status,
        priority: task.priority,
        observations: task.observations,
        documents: task.documents || [],
        photos: task.photos || [],
      });
      setCurrentPhotoIndex(0);
      setEditingTaskId(taskId);
      setShowEditModal(true);
    }
  };

  const handleUpdateTask = () => {
    if (editingTaskId === null) return;

    // Validação
    if (!formData.date || !formData.task || !formData.responsible) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Atualizar tarefa
    const updatedTasks = tasks.map(task => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          date: formData.date,
          animal: formData.animal || '-',
          task: formData.task,
          responsible: formData.responsible,
          status: formData.status,
          priority: formData.priority,
          observations: formData.observations || '-',
          documents: formData.documents,
          photos: formData.photos,
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    // Reset form
    setFormData({
      date: '',
      animal: '',
      task: '',
      responsible: '',
      status: 'Pendente',
      priority: 'Média',
      observations: '',
      documents: [],
      photos: [],
    });

    setEditingTaskId(null);
    setShowEditModal(false);
    toast.success('Tarefa atualizada com sucesso!');
  };

  const handleDeleteTaskClick = (taskId: number) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete === null) return;

    const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
    setTasks(updatedTasks);

    setTaskToDelete(null);
    setShowDeleteConfirmModal(false);
    setShowEditModal(false);
    toast.success('Tarefa excluída com sucesso!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluída':
        return 'bg-green-500/20 text-green-500';
      case 'Em andamento':
        return 'bg-blue-500/20 text-blue-500';
      case 'Pendente':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-red-500/20 text-red-500';
      case 'Média':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Baixa':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Funções de upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocuments = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));

    setFormData({
      ...formData,
      documents: [...formData.documents, ...newDocuments],
    });

    toast.success(`${newDocuments.length} documento(s) adicionado(s)`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos],
    });

    toast.success(`${newPhotos.length} foto(s) adicionada(s)`);
  };

  const removeDocument = (id: string) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((doc) => doc.id !== id),
    });
    toast.success('Documento removido');
  };

  const removePhoto = (id: string) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((photo) => photo.id !== id),
    });
    toast.success('Foto removida');
  };

  // Se está mostrando validação de pendências
  if (showPendingValidation) {
    return <AdvisorPendingValidation onBack={() => setShowPendingValidation(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Alerta de Pendências */}
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 dark:from-orange-500/5 dark:to-red-500/5 border-2 border-orange-500 dark:border-orange-600 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg text-foreground dark:text-white mb-2">Pendências de Campo Aguardando Validação</h3>
            <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
              5 registros enviados pela equipe de campo precisam ser revisados e aprovados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPendingValidation(true)}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Validar Pendências
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h2 className="text-foreground dark:text-white mb-1">Gestão de Tarefas</h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Tarefas</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-full lg:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Criar tarefa
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Nº</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Animal</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tarefa</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Responsável</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status / Prioridade</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Observações</th>
                <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4 text-foreground dark:text-white">{task.number}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{task.date}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{task.animal}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{task.task}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{task.responsible}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white max-w-[200px] truncate">{task.observations}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
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

      {/* Modal Criar Tarefa */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Criar Tarefa</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-foreground dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Data */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Data *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                </div>

                {/* Nome do Animal */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome do Animal
                  </label>
                  <input
                    type="text"
                    value={formData.animal}
                    onChange={(e) => setFormData({ ...formData, animal: e.target.value })}
                    placeholder="Digite o nome do animal"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Tarefa */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Tarefa *
                  </label>
                  <input
                    type="text"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    placeholder="Digite a tarefa"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Responsável *
                  </label>
                  <NativeSelect
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  >
                    <option value="">Selecione o responsável</option>
                    <option value="João (Peão)">João (Peão)</option>
                    <option value="Dra. Maria (Veterinária)">Dra. Maria (Veterinária)</option>
                    <option value="Pedro (Treinador)">Pedro (Treinador)</option>
                    <option value="Patrícia (Assessora)">Patrícia (Assessora)</option>
                  </NativeSelect>
                </div>

                {/* Status e Prioridade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Status *
                    </label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluída">Concluída</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Prioridade *
                    </label>
                    <NativeSelect
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </NativeSelect>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Digite observações sobre a tarefa"
                    rows={3}
                    className="w-full px-4 py-3 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
                  />
                </div>

                {/* Documentos */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Documentos
                  </label>
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

                {/* Fotos */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Fotos
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {formData.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative flex flex-col items-end gap-1"
                      >
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)]">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
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

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Tarefa */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Editar Tarefa</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-foreground dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Data */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Data *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                    />
                  </div>
                </div>

                {/* Nome do Animal */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome do Animal
                  </label>
                  <input
                    type="text"
                    value={formData.animal}
                    onChange={(e) => setFormData({ ...formData, animal: e.target.value })}
                    placeholder="Digite o nome do animal"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Tarefa */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Tarefa *
                  </label>
                  <input
                    type="text"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                    placeholder="Digite a tarefa"
                    className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Responsável *
                  </label>
                  <NativeSelect
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  >
                    <option value="">Selecione o responsável</option>
                    <option value="João (Peão)">João (Peão)</option>
                    <option value="Dra. Maria (Veterinária)">Dra. Maria (Veterinária)</option>
                    <option value="Pedro (Treinador)">Pedro (Treinador)</option>
                    <option value="Patrícia (Assessora)">Patrícia (Assessora)</option>
                  </NativeSelect>
                </div>

                {/* Status e Prioridade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Status *
                    </label>
                    <NativeSelect
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluída">Concluída</option>
                    </NativeSelect>
                  </div>

                  <div>
                    <label className="block text-sm text-foreground dark:text-white mb-2">
                      Prioridade *
                    </label>
                    <NativeSelect
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                    </NativeSelect>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Digite observações sobre a tarefa"
                    rows={3}
                    className="w-full px-4 py-3 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
                  />
                </div>

                {/* Documentos */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Documentos
                  </label>
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

                {/* Fotos */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Fotos
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {formData.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative flex flex-col items-end gap-1"
                      >
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-border dark:border-[rgba(255,255,255,0.1)]">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
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

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateTask}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-center p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Confirmar Exclusão</h3>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm text-foreground dark:text-white text-center">
                Você tem certeza de que deseja excluir esta tarefa?
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 h-10 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteTask}
                className="flex-1 h-10 px-4 bg-red-500 dark:bg-red-500 text-white dark:text-white rounded-xl hover:opacity-90 transition-opacity"
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