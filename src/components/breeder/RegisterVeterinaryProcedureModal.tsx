import { useState } from 'react';
import { X, Plus, Trash2, Upload, FileText } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface RegisterVeterinaryProcedureModalProps {
  onClose: () => void;
  animalName: string;
}

export function RegisterVeterinaryProcedureModal({ onClose, animalName }: RegisterVeterinaryProcedureModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    veterinarian: '',
    crm: '',
    clinic: '',
    reason: '',
    diagnosis: '',
    procedures: '',
    examsSolicited: '',
    recommendations: '',
    nextAppointment: '',
    cost: '',
    notes: '',
  });

  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  });
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria a lógica de salvar
    console.log('Procedimento registrado:', { ...formData, medications, uploadedFiles });
    onClose();
  };

  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      setMedications([...medications, newMedication]);
      setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
      setShowMedicationForm(false);
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleFileUpload = () => {
    // Mock de upload
    const fileName = `documento_${Date.now()}.pdf`;
    setUploadedFiles([...uploadedFiles, fileName]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-card dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white">Registrar Procedimento Veterinário</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">Animal: {animalName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seção 1: Informações Básicas */}
          <div className="space-y-4">
            <h4 className="text-lg text-foreground dark:text-white font-medium">Informações Básicas</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Data do Procedimento *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Horário *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Tipo de Procedimento *
                </label>
                <NativeSelect
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                >
                  <option value="">Selecione</option>
                  <option value="consulta">Consulta</option>
                  <option value="cirurgia">Cirurgia</option>
                  <option value="emergencia">Emergência</option>
                  <option value="exame">Exame</option>
                  <option value="vacinacao">Vacinação</option>
                  <option value="vermifugacao">Vermifugação</option>
                </NativeSelect>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Veterinário Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  placeholder="Nome do veterinário"
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  CRM
                </label>
                <input
                  type="text"
                  value={formData.crm}
                  onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                  placeholder="CRM do veterinário"
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Clínica/Hospital
                </label>
                <input
                  type="text"
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                  placeholder="Nome da clínica"
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Diagnóstico e Tratamento */}
          <div className="space-y-4">
            <h4 className="text-lg text-foreground dark:text-white font-medium">Diagnóstico e Tratamento</h4>
            
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Motivo/Queixa Principal *
              </label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Descreva o motivo da consulta ou procedimento"
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Diagnóstico
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="Diagnóstico do veterinário"
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Procedimentos Realizados
              </label>
              <textarea
                value={formData.procedures}
                onChange={(e) => setFormData({ ...formData, procedures: e.target.value })}
                placeholder="Descreva os procedimentos realizados"
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              />
            </div>
          </div>

          {/* Seção 3: Medicamentos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg text-foreground dark:text-white font-medium">Medicamentos Prescritos</h4>
              <button
                type="button"
                onClick={() => setShowMedicationForm(!showMedicationForm)}
                className="px-3 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Medicamento
              </button>
            </div>

            {showMedicationForm && (
              <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-foreground dark:text-white mb-1">
                      Nome do Medicamento
                    </label>
                    <input
                      type="text"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      placeholder="Nome do medicamento"
                      className="w-full px-3 py-2 bg-white dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground dark:text-white mb-1">
                      Dosagem
                    </label>
                    <input
                      type="text"
                      value={newMedication.dosage}
                      onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                      placeholder="Ex: 2g, 5ml"
                      className="w-full px-3 py-2 bg-white dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-foreground dark:text-white mb-1">
                      Frequência
                    </label>
                    <input
                      type="text"
                      value={newMedication.frequency}
                      onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                      placeholder="Ex: A cada 12 horas"
                      className="w-full px-3 py-2 bg-white dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground dark:text-white mb-1">
                      Duração
                    </label>
                    <input
                      type="text"
                      value={newMedication.duration}
                      onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                      placeholder="Ex: 7 dias"
                      className="w-full px-3 py-2 bg-white dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addMedication}
                    className="px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMedicationForm(false);
                      setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
                    }}
                    className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {medications.length > 0 && (
              <div className="space-y-2">
                {medications.map((med, index) => (
                  <div key={index} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-foreground dark:text-white font-medium mb-2">{med.name}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground dark:text-[#99a1af]">
                        <div>
                          <span className="block mb-1">Dosagem:</span>
                          <span className="text-foreground dark:text-white">{med.dosage}</span>
                        </div>
                        <div>
                          <span className="block mb-1">Frequência:</span>
                          <span className="text-foreground dark:text-white">{med.frequency}</span>
                        </div>
                        <div>
                          <span className="block mb-1">Duração:</span>
                          <span className="text-foreground dark:text-white">{med.duration}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-600 transition-colors ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção 4: Outras Informações */}
          <div className="space-y-4">
            <h4 className="text-lg text-foreground dark:text-white font-medium">Outras Informações</h4>
            
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Exames Solicitados
              </label>
              <textarea
                value={formData.examsSolicited}
                onChange={(e) => setFormData({ ...formData, examsSolicited: e.target.value })}
                placeholder="Liste os exames solicitados"
                rows={2}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Recomendações
              </label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                placeholder="Recomendações do veterinário"
                rows={2}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Próximo Retorno
                </label>
                <input
                  type="date"
                  value={formData.nextAppointment}
                  onChange={(e) => setFormData({ ...formData, nextAppointment: e.target.value })}
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground dark:text-white mb-2">
                  Custo Total (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Observações Gerais
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Outras observações relevantes"
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              />
            </div>
          </div>

          {/* Seção 5: Upload de Documentos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg text-foreground dark:text-white font-medium">Documentos</h4>
              <button
                type="button"
                onClick={handleFileUpload}
                className="px-3 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2 text-sm"
              >
                <Upload className="w-4 h-4" />
                Anexar Documento
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      <span className="text-sm text-foreground dark:text-white">{file}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer com Botões */}
          <div className="flex gap-3 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar Procedimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
