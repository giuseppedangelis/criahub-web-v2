import { FileText, Download, Eye, Trash2, Plus, Filter, Search, Image as ImageIcon, File, X } from 'lucide-react';
import { useState } from 'react';
import { AddDocumentModal, DocumentData } from './AddDocumentModal';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface Document {
  id: number;
  name: string;
  type: 'Contrato' | 'Certificado' | 'Exame' | 'Outro';
  fileType: 'PDF' | 'Imagem' | 'Outro';
  size: string;
  date: string;
  notes?: string;
}

interface AnimalDocumentsSectionProps {
  documents?: Document[];
}

export function AnimalDocumentsSection({ documents = [] }: AnimalDocumentsSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [localDocuments, setLocalDocuments] = useState(documents);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Dados mockados se não houver documentos
  const mockDocuments: Document[] = localDocuments.length > 0 ? localDocuments : [
    {
      id: 1,
      name: 'Registro ABCCMM',
      type: 'Certificado',
      fileType: 'PDF',
      size: '2.4 MB',
      date: '2024-01-15',
      notes: 'Registro definitivo aprovado'
    },
    {
      id: 2,
      name: 'Contrato de Compra e Venda',
      type: 'Contrato',
      fileType: 'PDF',
      size: '1.8 MB',
      date: '2023-12-10',
    },
    {
      id: 3,
      name: 'Certificado de Vacinação 2024',
      type: 'Certificado',
      fileType: 'PDF',
      size: '1.2 MB',
      date: '2024-11-01',
      notes: 'Todas as vacinas aplicadas'
    },
    {
      id: 4,
      name: 'Exame de Sangue - Hemograma',
      type: 'Exame',
      fileType: 'PDF',
      size: '856 KB',
      date: '2024-09-20',
    },
    {
      id: 5,
      name: 'Laudo Veterinário Pré-Cobertura',
      type: 'Laudo',
      fileType: 'PDF',
      size: '1.5 MB',
      date: '2024-08-15',
    },
    {
      id: 6,
      name: 'Foto Lateral Esquerda',
      type: 'Outro',
      fileType: 'Imagem',
      size: '3.2 MB',
      date: '2024-07-10',
      notes: 'Foto oficial para registro'
    },
  ];

  const handleAddDocument = (data: DocumentData) => {
    const newDoc: Document = {
      id: mockDocuments.length + 1,
      name: data.name,
      type: data.type,
      fileType: data.fileType,
      size: data.file ? `${(data.file.size / 1024 / 1024).toFixed(2)} MB` : '0 MB',
      date: data.date,
      notes: data.notes,
    };
    setLocalDocuments([newDoc, ...mockDocuments]);
  };

  // Filtrar documentos
  const filteredDocuments = mockDocuments
    .filter(doc => {
      if (selectedCategory !== 'all' && doc.type !== selectedCategory) return false;
      if (searchTerm && !doc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FileText className="w-5 h-5" />;
      case 'Imagem':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'Contrato':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
      case 'Certificado':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'Laudo':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
      case 'Exame':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300';
    }
  };

  const categories = [
    { value: 'all', label: 'Todos', count: mockDocuments.length },
    { value: 'Contrato', label: 'Contratos', count: mockDocuments.filter(d => d.type === 'Contrato').length },
    { value: 'Certificado', label: 'Certificados', count: mockDocuments.filter(d => d.type === 'Certificado').length },
    { value: 'Exame', label: 'Exames', count: mockDocuments.filter(d => d.type === 'Exame').length },
    { value: 'Outro', label: 'Outros', count: mockDocuments.filter(d => d.type === 'Outro').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg text-foreground dark:text-white mb-1">Documentos</h4>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'documento' : 'documentos'}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full lg:w-auto px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Documento
          </button>
        </div>

        {/* Filtros por Categoria */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === category.value
                  ? 'bg-primary dark:bg-white text-white dark:text-black'
                  : 'bg-gray-100 dark:bg-[#2a2a2a] text-foreground dark:text-white hover:bg-gray-200 dark:hover:bg-[#3a3a3a]'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar documentos..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
          />
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map(doc => {
          const [year, month, day] = doc.date.split('-');
          const formattedDate = `${day}/${month}/${year}`;

          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-5 hover:border-primary dark:hover:border-white/40 transition-all group"
            >
              {/* Tipo e Ações */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${getDocumentTypeColor(doc.type)}`}>
                  {getFileIcon(doc.fileType)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedDocument(doc);
                      setShowPreview(true);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4 text-foreground dark:text-white" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-foreground dark:text-white" />
                  </button>
                  <button
                    onClick={() => {
                      setDocumentToDelete(doc);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <h5 className="text-foreground dark:text-white font-medium line-clamp-2">
                  {doc.name}
                </h5>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2 py-1 rounded text-xs ${getDocumentTypeColor(doc.type)}`}>
                    {doc.type}
                  </span>
                  <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    {doc.fileType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-[#99a1af]">
                  <span>{formattedDate}</span>
                  <span>{doc.size}</span>
                </div>
                {doc.notes && (
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] line-clamp-2">
                    {doc.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[rgba(255,255,255,0.1)] p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4" />
          <p className="text-foreground dark:text-white mb-2">Nenhum documento encontrado</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            {searchTerm ? 'Tente ajustar sua busca' : 'Adicione o primeiro documento'}
          </p>
        </div>
      )}

      {/* Modal Adicionar Documento */}
      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddDocument}
        />
      )}

      {/* Modal Preview (simplificado) */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">{selectedDocument.name}</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  {selectedDocument.type} • {selectedDocument.fileType} • {selectedDocument.size}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedDocument(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground dark:text-white" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-12 bg-gray-50 dark:bg-[#0d0d0d]">
              <div className="text-center">
                {getFileIcon(selectedDocument.fileType)}
                <p className="text-muted-foreground dark:text-[#99a1af] mt-4">
                  Preview não disponível no protótipo
                </p>
                <button className="mt-4 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
                  <Download className="w-4 h-4" />
                  Baixar Documento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Excluir Documento */}
      {showDeleteModal && documentToDelete && (
        <DeleteDocumentModal
          document={documentToDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
          onConfirm={() => {
            setLocalDocuments(mockDocuments.filter(d => d.id !== documentToDelete.id));
            setShowDeleteModal(false);
            setDocumentToDelete(null);
          }}
        />
      )}
    </div>
  );
}

// Modal de Confirmação de Exclusão
function DeleteDocumentModal({ 
  document, 
  onClose, 
  onConfirm 
}: { 
  document: Document; 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  // Adiciona suporte à tecla ESC (acessibilidade WCAG 2.1)
  useEscapeKey(onClose);

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg text-foreground dark:text-white font-medium mb-1">
                Excluir Documento
              </h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Esta ação não pode ser desfeita.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground dark:text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground dark:text-white font-medium mb-1">
              {document.name}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-[#99a1af]">
              <span>{document.type}</span>
              <span>•</span>
              <span>{document.fileType}</span>
              <span>•</span>
              <span>{document.size}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-6">
            Tem certeza de que deseja excluir este documento? Esta ação é permanente e não pode ser desfeita.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 dark:bg-red-900 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}