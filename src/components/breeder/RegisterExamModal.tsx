import { X, Upload, FileText } from 'lucide-react';
import { useState } from 'react';

interface RegisterExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExamData) => void;
  animalName?: string;
}

export interface ExamData {
  nome: string;
  data: string;
  veterinario: string;
  resultado: string;
  observacoes: string;
  arquivo?: File;
}

export function RegisterExamModal({ isOpen, onClose, onSave, animalName }: RegisterExamModalProps) {
  const [formData, setFormData] = useState<ExamData>({
    nome: '',
    data: '',
    veterinario: '',
    resultado: '',
    observacoes: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecione apenas arquivos PDF ou imagens');
      }
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Tipo de exame é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data do exame é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      arquivo: selectedFile || undefined,
    });

    setFormData({
      nome: '',
      data: '',
      veterinario: '',
      resultado: '',
      observacoes: '',
    });
    setSelectedFile(null);
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      nome: '',
      data: '',
      veterinario: '',
      resultado: '',
      observacoes: '',
    });
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-foreground dark:text-white">Adicionar Novo Exame</h2>
            {animalName && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                Animal: {animalName}
              </p>
            )}
          </div>
          <button onClick={handleClose} className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Tipo de Exame *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value });
                if (errors.nome) setErrors({ ...errors, nome: '' });
              }}
              className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border ${
                errors.nome ? 'border-red-500' : 'border-border dark:border-[rgba(255,255,255,0.1)]'
              } rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white`}
              placeholder="Ex: Hemograma Completo, Exame Parasitológico, Ultrassom"
            />
            {errors.nome && (
              <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Data do Exame *
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => {
                  setFormData({ ...formData, data: e.target.value });
                  if (errors.data) setErrors({ ...errors, data: '' });
                }}
                className={`w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border ${
                  errors.data ? 'border-red-500' : 'border-border dark:border-[rgba(255,255,255,0.1)]'
                } rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white`}
              />
              {errors.data && (
                <p className="text-sm text-red-500 mt-1">{errors.data}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Veterinário Responsável
              </label>
              <input
                type="text"
                value={formData.veterinario}
                onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                placeholder="Dr. Nome do veterinário"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Resultado
            </label>
            <select
              value={formData.resultado}
              onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="">Selecione o resultado</option>
              <option value="Normal">Normal</option>
              <option value="Alterado">Alterado</option>
              <option value="Aguardando">Aguardando Resultado</option>
              <option value="Inconclusivo">Inconclusivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              rows={4}
              placeholder="Informações adicionais sobre o exame, valores de referência, recomendações, etc."
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Anexar Resultado (PDF ou Imagem)
            </label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
              id="exam-file-input"
            />
            <label
              htmlFor="exam-file-input"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              <div className="text-center">
                {selectedFile ? (
                  <>
                    <FileText className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-foreground dark:text-white">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                      Clique ou arraste o arquivo aqui
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                      PDF ou imagem até 10MB
                    </p>
                  </>
                )}
              </div>
            </label>
            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-sm text-red-500 hover:text-red-700 mt-2"
              >
                Remover arquivo
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar Exame
          </button>
        </div>
      </div>
    </div>
  );
}
