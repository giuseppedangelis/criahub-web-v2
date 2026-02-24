import { FileText, Download, Eye, Trash2, Plus, Filter, Search, Image as ImageIcon, File, X } from 'lucide-react';
import { useState } from 'react';
import { AddDocumentModal, DocumentData } from './AddDocumentModal';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useUpdateAnimal } from '@/hooks/useAnimals';

interface Document {
  id: number;
  name: string;
  type: 'Contrato' | 'Certificado' | 'Exame' | 'Outro';
  fileType: 'PDF' | 'Imagem' | 'Outro';
  size: string;
  date: string;
  notes?: string;
  url?: string;
}

interface AnimalDocumentsSectionProps {
  animalId: string;
  documents?: Document[];
  documentUrls?: string[];
}

// Helper function to convert URL to Document object
function convertUrlToDocument(url: string, index: number): Document {
  const fileNameWithQuery = url.split('/').pop() || `documento-${index + 1}`;
  const fileName = decodeURIComponent(fileNameWithQuery.split('?')[0]);
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Determine file type
  let fileType: 'PDF' | 'Imagem' | 'Outro' = 'Outro';
  if (extension === 'pdf') fileType = 'PDF';
  else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) fileType = 'Imagem';
  
  // Determine document type based on name or extension
  let type: 'Contrato' | 'Certificado' | 'Exame' | 'Outro' = 'Outro';
  const nameLower = fileName.toLowerCase();
  if (nameLower.includes('contrato')) type = 'Contrato';
  else if (nameLower.includes('certificado') || nameLower.includes('registro')) type = 'Certificado';
  else if (nameLower.includes('exame') || nameLower.includes('hemograma')) type = 'Exame';
  
  // Clean up filename
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  const nameWithoutTimestamp = baseName
    .replace(/^\d+_/, '')
    .replace(/_\d+$/, '');

  const cleanName = nameWithoutTimestamp
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    id: index + 1,
    name: cleanName || 'Documento',
    type,
    fileType,
    size: '-',
    date: new Date().toISOString().split('T')[0],
    url
  };
}

function sanitizeFileBase(value: string): string {
  const normalized = value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const cleaned = normalized
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned.slice(0, 80) || 'documento';
}

export function AnimalDocumentsSection({ animalId, documents = [], documentUrls = [] }: AnimalDocumentsSectionProps) {
  const supabase = createClient();
  const { mutateAsync: updateAnimal } = useUpdateAnimal();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSavingDocument, setIsSavingDocument] = useState(false);
  const [persistedUrls, setPersistedUrls] = useState<string[]>(documentUrls);
  
  // Convert URLs to Document objects if provided
  const documentsFromUrls = persistedUrls.map((url, index) => convertUrlToDocument(url, index));
  
  // Combine provided documents with converted URLs
  const allDocuments = documents.length > 0 ? documents : documentsFromUrls;
  
  const [localDocuments, setLocalDocuments] = useState<Document[]>(allDocuments);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Use real documents if available, otherwise show empty state
  const displayDocuments = localDocuments.length > 0 ? localDocuments : [];

  // ... rest of the component remains the same

  const handleDeleteDocument = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      if (documentToDelete.url && documentToDelete.url.startsWith('blob:')) {
        URL.revokeObjectURL(documentToDelete.url);
      }
      setLocalDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  const handleViewDocument = (document: Document) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      setSelectedDocument(document);
      setShowPreview(true);
    }
  };

  const handleDownloadDocument = (document: Document) => {
    if (document.url) {
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEscapeKey(() => {
    if (showAddModal) setShowAddModal(false);
    if (showPreview) setShowPreview(false);
    if (showDeleteModal) setShowDeleteModal(false);
  });

  const filteredDocuments = displayDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.notes && doc.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'Imagem':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const uploadDocumentFile = async (file: File, displayName: string) => {
    const ext = file.name.split('.').pop();
    const safeBase = sanitizeFileBase(displayName || file.name.replace(/\.[^/.]+$/, ''));
    const fileName = `${animalId}/documents/${safeBase}_${Date.now()}${ext ? `.${ext}` : ''}`;

    const { error } = await supabase.storage
      .from('animals')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('animals')
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      throw new Error('Erro ao obter URL do documento.');
    }

    return data.publicUrl;
  };

  const handleAddDocument = async (documentData: DocumentData) => {
    if (!documentData.file) {
      toast.error('Selecione um arquivo para continuar.');
      return;
    }

    try {
      setIsSavingDocument(true);

      const uploadedUrl = await uploadDocumentFile(documentData.file, documentData.name);
      const nextUrls = [...persistedUrls, uploadedUrl];

      await updateAnimal({
        id: String(animalId),
        documents: nextUrls,
      });

      const size = documentData.file.size
        ? `${(documentData.file.size / 1024 / 1024).toFixed(2)} MB`
        : '-';

      const newDocument: Document = {
        id: Math.max(...localDocuments.map(d => d.id), 0) + 1,
        name: documentData.name,
        type: documentData.type,
        fileType: documentData.fileType,
        size,
        date: documentData.date,
        notes: documentData.notes,
        url: uploadedUrl,
      };

      setLocalDocuments([...localDocuments, newDocument]);
      setPersistedUrls(nextUrls);
      setShowAddModal(false);
      toast.success('Documento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      toast.error('Erro ao salvar documento. Tente novamente.');
      throw error;
    } finally {
      setIsSavingDocument(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-white">
            Documentos
          </h3>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Adicionar Documento
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="all">Todas as categorias</option>
            <option value="Contrato">Contratos</option>
            <option value="Certificado">Certificados</option>
            <option value="Exame">Exames</option>
            <option value="Outro">Outros</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <div
              key={document.id}
              className="p-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:border-primary dark:hover:border-white/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted dark:bg-[#0d0d0d] rounded-lg">
                  {getFileIcon(document.fileType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground dark:text-white truncate">
                    {document.name}
                  </h4>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                    {document.type} • {document.size}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                    {document.date}
                  </p>
                  {document.notes && (
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1 line-clamp-2">
                      {document.notes}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
                <button
                  onClick={() => handleViewDocument(document)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
                <button
                  onClick={() => handleDownloadDocument(document)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar
                </button>
                <button
                  onClick={() => handleDeleteDocument(document)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground dark:text-[#616161] mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground dark:text-white mb-2">
            Nenhum documento encontrado
          </h4>
          <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tente ajustar os filtros de busca'
              : 'Adicione documentos para visualizá-los aqui'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Adicionar Documento
            </button>
          )}
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddDocument}
          isSaving={isSavingDocument}
        />
      )}

      {/* Preview Modal */}
      {showPreview && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <h3 className="text-lg font-semibold text-foreground dark:text-white">
                {selectedDocument.name}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedDocument.fileType === 'Imagem' ? (
                <img
                  src={selectedDocument.url || '#'}
                  alt={selectedDocument.name}
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  {getFileIcon(selectedDocument.fileType)}
                  <p className="mt-4 text-foreground dark:text-white">
                    Visualização não disponível para este tipo de arquivo
                  </p>
                  <button
                    onClick={() => handleDownloadDocument(selectedDocument)}
                    className="mt-4 px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Baixar Documento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && documentToDelete && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white">
                Confirmar exclusão
              </h3>
            </div>
            
            <p className="text-muted-foreground dark:text-[#99a1af] mb-6">
              Tem certeza que deseja excluir o documento <strong className="text-foreground dark:text-white">{documentToDelete.name}</strong>?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
