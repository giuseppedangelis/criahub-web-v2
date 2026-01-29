import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface AddDocumentModalProps {
  onClose: () => void;
  onSave: (data: DocumentData) => void;
}

export interface DocumentData {
  name: string;
  type: 'Contrato' | 'Certificado' | 'Exame' | 'Outro';
  fileType: 'PDF' | 'Imagem' | 'Outro';
  date: string;
  notes?: string;
  file?: File;
}

export function AddDocumentModal({ onClose, onSave }: AddDocumentModalProps) {
  const [formData, setFormData] = useState<DocumentData>({
    name: '',
    type: 'Certificado',
    fileType: 'PDF',
    date: new Date().toISOString().split('T')[0],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              Adicionar Documento
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Faça upload de contratos, certificados, exames e outros documentos
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Upload de Arquivo */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Arquivo *
            </label>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:border-primary dark:hover:border-white/40 transition-colors bg-gray-50 dark:bg-[#0d0d0d]"
              >
                <Upload className="w-10 h-10 text-muted-foreground dark:text-[#99a1af] mb-2" />
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-foreground dark:text-white font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-foreground dark:text-white mb-1">
                      Clique para fazer upload
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      PDF, JPG, PNG ou DOC (máx. 10MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Nome do Documento */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nome do Documento *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Certificado de Registro ABCCMM"
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Documento *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Contrato', 'Certificado', 'Exame', 'Outro'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.type === type
                      ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10 text-foreground dark:text-white'
                      : 'border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Arquivo */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Formato do Arquivo *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['PDF', 'Imagem', 'Outro'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, fileType: type })}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    formData.fileType === type
                      ? 'border-primary dark:border-white bg-primary/10 dark:bg-white/10 text-foreground dark:text-white'
                      : 'border-gray-200 dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af] hover:border-gray-300 dark:hover:border-[rgba(255,255,255,0.2)]'
                  }`}
                >
                  {type === 'PDF' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data do Documento *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observações (Opcional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informações adicionais sobre o documento..."
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-[#2a2a2a] text-foreground dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Adicionar Documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
