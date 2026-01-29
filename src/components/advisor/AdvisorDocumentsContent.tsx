import { Search, Plus, FileText, CheckCircle, Clock, AlertCircle, Download, Eye, Upload, X, Tag, Users, Filter, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface Document {
  id: number;
  number: string;
  name: string;
  animal: string;
  type: string;
  date: string;
  status: string;
  signature: string;
  tags: string[]; // Tags do documento
  linkedTo?: {
    type: 'animal' | 'person';
    id: number;
    name: string;
  }[]; // Vínculos
  fileUrl?: string;
  fileSize?: string;
}

export function AdvisorDocumentsContent() {
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterTag, setFilterTag] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Formulário
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'Pendente',
    tags: [] as string[],
    linkedAnimals: [] as { id: number; name: string }[],
    linkedPeople: [] as { id: number; name: string }[],
    file: null as File | null,
  });

  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: 1, 
      number: 'DOC-001', 
      name: 'GIA - Estrela Mangalarga', 
      animal: 'Estrela Mangalarga', 
      type: 'GIA', 
      date: '15/11/2024', 
      status: 'Assinado', 
      signature: 'D4Sign',
      tags: ['Contrato', 'Registro'],
      linkedTo: [
        { type: 'animal', id: 1, name: 'Estrela Mangalarga' },
        { type: 'person', id: 1, name: 'Ricardo Silva' },
      ],
      fileUrl: 'https://example.com/doc001.pdf',
      fileSize: '1.2 MB'
    },
    { 
      id: 2, 
      number: 'DOC-002', 
      name: 'Registro ABCCMM - Vento Sul', 
      animal: 'Vento Sul', 
      type: 'Registro', 
      date: '10/11/2024', 
      status: 'Pendente', 
      signature: '-',
      tags: ['Registro', 'ABCCMM'],
      linkedTo: [
        { type: 'animal', id: 6, name: 'Vento Sul' },
      ],
      fileUrl: 'https://example.com/doc002.pdf',
      fileSize: '856 KB'
    },
    { 
      id: 3, 
      number: 'DOC-003', 
      name: 'Atestado Sanitário - Bella Vista', 
      animal: 'Bella Vista', 
      type: 'Exame', 
      date: '08/11/2024', 
      status: 'Assinado', 
      signature: 'Dra. Maria Santos',
      tags: ['Exame', 'Veterinário'],
      linkedTo: [
        { type: 'animal', id: 3, name: 'Bella Vista' },
        { type: 'person', id: 2, name: 'Dra. Maria Santos' },
      ],
      fileUrl: 'https://example.com/doc003.pdf',
      fileSize: '524 KB'
    },
    { 
      id: 4, 
      number: 'DOC-004', 
      name: 'Nota Fiscal - Ração Premium', 
      animal: '-', 
      type: 'Nota Fiscal', 
      date: '05/11/2024', 
      status: 'Assinado', 
      signature: '-',
      tags: ['Nota Fiscal', 'Financeiro'],
      linkedTo: [],
      fileUrl: 'https://example.com/doc004.pdf',
      fileSize: '245 KB'
    },
    { 
      id: 5, 
      number: 'DOC-005', 
      name: 'Contrato de Compra - Relâmpago Negro', 
      animal: 'Relâmpago Negro', 
      type: 'Contrato', 
      date: '01/11/2024', 
      status: 'Assinado', 
      signature: 'D4Sign',
      tags: ['Contrato', 'Compra/Venda'],
      linkedTo: [
        { type: 'animal', id: 2, name: 'Relâmpago Negro' },
        { type: 'person', id: 3, name: 'João Pereira' },
      ],
      fileUrl: 'https://example.com/doc005.pdf',
      fileSize: '1.8 MB'
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Assinado':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Aguardando':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Pendente':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assinado':
        return 'bg-green-500/20 text-green-500';
      case 'Aguardando':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Pendente':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const availableTags = ['Contrato', 'Registro', 'Exame', 'Nota Fiscal', 'Veterinário', 'ABCCMM', 'Compra/Venda', 'Financeiro'];
  const availableAnimals = [
    { id: 1, name: 'Estrela Mangalarga' },
    { id: 2, name: 'Relâmpago Negro' },
    { id: 3, name: 'Bella Vista' },
    { id: 6, name: 'Vento Sul' },
  ];
  const availablePeople = [
    { id: 1, name: 'Ricardo Silva' },
    { id: 2, name: 'Dra. Maria Santos' },
    { id: 3, name: 'João Pereira' },
  ];

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleAddAnimal = (animal: { id: number; name: string }) => {
    if (!formData.linkedAnimals.find(a => a.id === animal.id)) {
      setFormData({ ...formData, linkedAnimals: [...formData.linkedAnimals, animal] });
    }
  };

  const handleRemoveAnimal = (animalId: number) => {
    setFormData({ ...formData, linkedAnimals: formData.linkedAnimals.filter(a => a.id !== animalId) });
  };

  const handleAddPerson = (person: { id: number; name: string }) => {
    if (!formData.linkedPeople.find(p => p.id === person.id)) {
      setFormData({ ...formData, linkedPeople: [...formData.linkedPeople, person] });
    }
  };

  const handleRemovePerson = (personId: number) => {
    setFormData({ ...formData, linkedPeople: formData.linkedPeople.filter(p => p.id !== personId) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
      toast.success('Arquivo selecionado: ' + file.name);
    }
  };

  const handleCreateDocument = () => {
    if (!formData.name || !formData.type || !formData.file) {
      toast.error('Preencha todos os campos obrigatórios e selecione um arquivo');
      return;
    }

    const linkedTo: Document['linkedTo'] = [
      ...formData.linkedAnimals.map(a => ({ type: 'animal' as const, id: a.id, name: a.name })),
      ...formData.linkedPeople.map(p => ({ type: 'person' as const, id: p.id, name: p.name })),
    ];

    const newDocument: Document = {
      id: documents.length + 1,
      number: `DOC-${String(documents.length + 1).padStart(3, '0')}`,
      name: formData.name,
      animal: formData.linkedAnimals.length > 0 ? formData.linkedAnimals[0].name : '-',
      type: formData.type,
      date: new Date().toLocaleDateString('pt-BR'),
      status: formData.status,
      signature: '-',
      tags: formData.tags,
      linkedTo: linkedTo,
      fileUrl: URL.createObjectURL(formData.file),
      fileSize: `${(formData.file.size / 1024).toFixed(0)} KB`,
    };

    setDocuments([newDocument, ...documents]);
    
    setFormData({
      name: '',
      type: '',
      status: 'Pendente',
      tags: [],
      linkedAnimals: [],
      linkedPeople: [],
      file: null,
    });

    setShowNewDocModal(false);
    toast.success('Documento adicionado com sucesso!');
  };

  // Filtrar documentos
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === 'todos' || doc.tags.includes(filterTag);
    const matchesType = filterType === 'todos' || doc.type === filterType;
    const matchesStatus = filterStatus === 'todos' || doc.status === filterStatus;
    
    return matchesSearch && matchesTag && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Info sobre História 5 */}
      <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground dark:text-white mb-2">Arquivo Digital Centralizado</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Todos os documentos legais (contratos, exames, notas fiscais) centralizados em um só lugar, com <strong>tags</strong> para organização e <strong>vínculos</strong> a animais e pessoas para fácil auditoria.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">{documents.length}</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total de Documentos</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">
            {documents.filter(d => d.status === 'Assinado').length}
          </p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Assinados</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-500 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">
            {documents.filter(d => d.status === 'Aguardando').length}
          </p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Aguardando Assinatura</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">
            {documents.filter(d => d.status === 'Pendente').length}
          </p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Pendentes</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="w-full lg:w-auto px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2"
        >
          <Filter className="w-5 h-5" />
          Filtros Avançados
        </button>
        <button 
          onClick={() => setShowNewDocModal(true)}
          className="w-full lg:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Documento
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tag</label>
            <NativeSelect value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
              <option value="todos">Todas as Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo</label>
            <NativeSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="todos">Todos os Tipos</option>
              <option value="GIA">GIA</option>
              <option value="Registro">Registro</option>
              <option value="Contrato">Contrato</option>
              <option value="Exame">Exame</option>
              <option value="Nota Fiscal">Nota Fiscal</option>
            </NativeSelect>
          </div>
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Status</label>
            <NativeSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="todos">Todos os Status</option>
              <option value="Assinado">Assinado</option>
              <option value="Aguardando">Aguardando</option>
              <option value="Pendente">Pendente</option>
            </NativeSelect>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Documento</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tags</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Vínculos</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status</th>
                <th className="text-center px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-foreground dark:text-white">{doc.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{doc.number} • {doc.fileSize}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary/10 dark:bg-white/10 text-xs text-foreground dark:text-white rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      {doc.linkedTo && doc.linkedTo.length > 0 ? (
                        doc.linkedTo.map((link, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              link.type === 'animal' 
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            }`}>
                              {link.type === 'animal' ? 'Animal' : 'Pessoa'}
                            </span>
                            <span>{link.name}</span>
                          </div>
                        ))
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewingDocument(doc)}
                        className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-foreground dark:text-white" />
                      </button>
                      <button className="p-2 hover:bg-card dark:hover:bg-[#2a2a2a] rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-foreground dark:text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Novo Documento */}
      {showNewDocModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">Novo Documento</h3>
              <button
                onClick={() => setShowNewDocModal(false)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Documento *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Contrato de Compra - Estrela"
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Tipo *</label>
                  <NativeSelect
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Registro">Registro</option>
                    <option value="Exame">Exame</option>
                    <option value="Nota Fiscal">Nota Fiscal</option>
                    <option value="GIA">GIA</option>
                  </NativeSelect>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Status</label>
                  <NativeSelect
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Aguardando">Aguardando</option>
                    <option value="Assinado">Assinado</option>
                  </NativeSelect>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-white/10 rounded-lg">
                        <span className="text-sm text-foreground dark:text-white">{tag}</span>
                        <button onClick={() => handleRemoveTag(tag)}>
                          <X className="w-3 h-3 text-foreground dark:text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <NativeSelect
                    value=""
                    onChange={(e) => {
                      if (e.target.value) handleAddTag(e.target.value);
                    }}
                  >
                    <option value="">Adicionar tag...</option>
                    {availableTags.filter(t => !formData.tags.includes(t)).map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </NativeSelect>
                </div>

                {/* Vincular a Animais */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Vincular a Animais</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.linkedAnimals.map((animal) => (
                      <div key={animal.id} className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-lg">
                        <span className="text-sm text-foreground dark:text-white">🐴 {animal.name}</span>
                        <button onClick={() => handleRemoveAnimal(animal.id)}>
                          <X className="w-3 h-3 text-foreground dark:text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <NativeSelect
                    value=""
                    onChange={(e) => {
                      const animal = availableAnimals.find(a => a.id === Number(e.target.value));
                      if (animal) handleAddAnimal(animal);
                    }}
                  >
                    <option value="">Adicionar animal...</option>
                    {availableAnimals.filter(a => !formData.linkedAnimals.find(la => la.id === a.id)).map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </NativeSelect>
                </div>

                {/* Vincular a Pessoas */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Vincular a Pessoas</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.linkedPeople.map((person) => (
                      <div key={person.id} className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 dark:bg-gray-500/10 rounded-lg">
                        <span className="text-sm text-foreground dark:text-white">👤 {person.name}</span>
                        <button onClick={() => handleRemovePerson(person.id)}>
                          <X className="w-3 h-3 text-foreground dark:text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <NativeSelect
                    value=""
                    onChange={(e) => {
                      const person = availablePeople.find(p => p.id === Number(e.target.value));
                      if (person) handleAddPerson(person);
                    }}
                  >
                    <option value="">Adicionar pessoa...</option>
                    {availablePeople.filter(p => !formData.linkedPeople.find(lp => lp.id === p.id)).map(person => (
                      <option key={person.id} value={person.id}>{person.name}</option>
                    ))}
                  </NativeSelect>
                </div>

                {/* Upload de Arquivo */}
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Arquivo *</label>
                  <label className="flex items-center justify-center gap-2 w-full h-24 bg-background dark:bg-[#0d0d0d] border-2 border-dashed border-border dark:border-[#3a3a3a] rounded-xl cursor-pointer hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-muted-foreground dark:text-[#99a1af]" />
                    <div className="text-center">
                      <p className="text-sm text-foreground dark:text-white">
                        {formData.file ? formData.file.name : 'Clique para selecionar arquivo'}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                        PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setShowNewDocModal(false)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateDocument}
                className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
              >
                Adicionar Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Documento */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-xl text-foreground dark:text-white">{viewingDocument.name}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Número</p>
                  <p className="text-foreground dark:text-white">{viewingDocument.number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tipo</p>
                  <p className="text-foreground dark:text-white">{viewingDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data</p>
                  <p className="text-foreground dark:text-white">{viewingDocument.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Status</p>
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(viewingDocument.status)}`}>
                    {viewingDocument.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingDocument.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 dark:bg-white/10 text-sm text-foreground dark:text-white rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {viewingDocument.linkedTo && viewingDocument.linkedTo.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">Vínculos</p>
                    <div className="space-y-2">
                      {viewingDocument.linkedTo.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground dark:text-white">
                          {link.type === 'animal' ? '🐴' : '👤'} {link.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => setViewingDocument(null)}
                className="flex-1 py-3 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Fechar
              </button>
              <button className="flex-1 py-3 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Baixar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}