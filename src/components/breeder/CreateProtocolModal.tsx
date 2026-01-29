import { X, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle, Bell, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Protocol {
  id: number;
  name: string;
  type: 'TE' | 'IATF' | 'Aspiração Folicular' | 'Personalizado';
  description: string;
  steps: ProtocolStep[];
  totalDays: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

interface ProtocolStep {
  id: number;
  name: string;
  dayOffset: number;
  description: string;
  type: 'Exame' | 'Aplicação' | 'Procedimento' | 'Coleta';
}

interface CreateProtocolModalProps {
  protocol?: Protocol | null;
  onClose: () => void;
  onSave: (protocol: ProtocolFormData) => void;
}

export interface ProtocolFormData {
  name: string;
  type: 'TE' | 'IATF' | 'Aspiração Folicular' | 'Personalizado';
  description: string;
  steps: StepFormData[];
}

export interface StepFormData {
  id: string;
  name: string;
  dayOffset: number;
  description: string;
  type: 'Exame' | 'Aplicação' | 'Procedimento' | 'Coleta';
}

export function CreateProtocolModal({ protocol, onClose, onSave }: CreateProtocolModalProps) {
  const [formData, setFormData] = useState<ProtocolFormData>(
    protocol ? {
      name: protocol.name,
      type: protocol.type,
      description: protocol.description,
      steps: protocol.steps.map(step => ({
        id: crypto.randomUUID(),
        name: step.name,
        dayOffset: step.dayOffset,
        description: step.description,
        type: step.type
      }))
    } : {
      name: '',
      type: 'Personalizado',
      description: '',
      steps: [
        {
          id: crypto.randomUUID(),
          name: '',
          dayOffset: 0,
          description: '',
          type: 'Aplicação',
        },
      ],
    }
  );

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'Adicione pelo menos uma etapa';
    }

    formData.steps.forEach((step, idx) => {
      if (!step.name.trim()) {
        newErrors[`step_${idx}_name`] = 'Nome da etapa é obrigatório';
      }
      if (step.dayOffset < 0) {
        newErrors[`step_${idx}_day`] = 'Dia deve ser maior ou igual a 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    onSave(formData);
    onClose();
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [
        ...formData.steps,
        {
          id: crypto.randomUUID(),
          name: '',
          dayOffset: formData.steps.length > 0 ? Math.max(...formData.steps.map(s => s.dayOffset)) + 1 : 0,
          description: '',
          type: 'Aplicação',
        },
      ],
    });
  };

  const removeStep = (stepId: string) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((s) => s.id !== stepId),
    });
  };

  const updateStep = (stepId: string, updates: Partial<StepFormData>) => {
    setFormData({
      ...formData,
      steps: formData.steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
    });
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = formData.steps.findIndex((s) => s.id === stepId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.steps.length) return;

    const newSteps = [...formData.steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];

    setFormData({ ...formData, steps: newSteps });
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'Exame':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Aplicação':
        return <AlertCircle className="w-4 h-4" />;
      case 'Procedimento':
        return <Plus className="w-4 h-4" />;
      case 'Coleta':
        return <Bell className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getTotalDays = () => {
    if (formData.steps.length === 0) return 0;
    return Math.max(...formData.steps.map(s => s.dayOffset));
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl text-foreground dark:text-white">Confirmar Criação</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-foreground dark:text-white mb-4">
              Revise os dados do protocolo antes de criar:
            </p>

            <div className="bg-gray-50 dark:bg-[#0d0d0d] rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Nome:</span>
                <p className="text-foreground dark:text-white font-medium">{formData.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Tipo:</span>
                <p className="text-foreground dark:text-white">{formData.type}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Descrição:</span>
                <p className="text-foreground dark:text-white">{formData.description}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Duração Total:</span>
                <p className="text-foreground dark:text-white">{getTotalDays()} dias</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground dark:text-white mb-3">
                Etapas do Protocolo ({formData.steps.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {formData.steps
                  .sort((a, b) => a.dayOffset - b.dayOffset)
                  .map((step, idx) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1a1a] rounded border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                    >
                      <div className="w-8 h-8 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center text-foreground dark:text-white">
                        {getStepIcon(step.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-foreground dark:text-white font-medium">
                            {step.name}
                          </p>
                          <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                            Dia {step.dayOffset}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{step.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky bottom-0 bg-white dark:bg-[#1a1a1a]">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Criar Protocolo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-xl text-foreground dark:text-white mb-1">
              {protocol ? 'Editar Protocolo' : 'Criar Novo Protocolo'}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              Configure as etapas e intervalos do protocolo reprodutivo
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
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground dark:text-white">Informações Básicas</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Nome do Protocolo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Protocolo TE Verão 2024"
                  className={`w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)]'
                  } rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20`}
                />
                {errors.name && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Tipo de Protocolo *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                >
                  <option value="TE">TE - Transferência de Embrião</option>
                  <option value="IATF">IATF - Inseminação Artificial</option>
                  <option value="Aspiração Folicular">Aspiração Folicular</option>
                  <option value="Personalizado">Personalizado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Descrição *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Descreva o objetivo e características deste protocolo..."
                className={`w-full px-4 py-2.5 bg-white dark:bg-[#0d0d0d] border ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)]'
                } rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Etapas do Protocolo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground dark:text-white">
                Etapas do Protocolo ({formData.steps.length})
              </h4>
              <button
                type="button"
                onClick={addStep}
                className="px-3 py-1.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Etapa
              </button>
            </div>

            {errors.steps && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-400">{errors.steps}</p>
              </div>
            )}

            <div className="space-y-3">
              {formData.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        type="button"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={idx === formData.steps.length - 1}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground dark:text-[#99a1af] rotate-180" />
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            required
                            value={step.name}
                            onChange={(e) => updateStep(step.id, { name: e.target.value })}
                            placeholder="Nome da etapa *"
                            className={`w-full px-3 py-2 bg-white dark:bg-[#0d0d0d] border ${
                              errors[`step_${idx}_name`] ? 'border-red-500' : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)]'
                            } rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20`}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            required
                            min="0"
                            value={step.dayOffset}
                            onChange={(e) => updateStep(step.id, { dayOffset: parseInt(e.target.value) || 0 })}
                            placeholder="Dia *"
                            className={`w-full px-3 py-2 bg-white dark:bg-[#0d0d0d] border ${
                              errors[`step_${idx}_day`] ? 'border-red-500' : 'border-gray-300 dark:border-[rgba(255,255,255,0.1)]'
                            } rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20`}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                          value={step.type}
                          onChange={(e) => updateStep(step.id, { type: e.target.value as any })}
                          className="px-3 py-2 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                        >
                          <option value="Exame">Exame</option>
                          <option value="Aplicação">Aplicação</option>
                          <option value="Procedimento">Procedimento</option>
                          <option value="Coleta">Coleta</option>
                        </select>

                        <div className="md:col-span-3">
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) => updateStep(step.id, { description: e.target.value })}
                            placeholder="Descrição (opcional)"
                            className="w-full px-3 py-2 bg-white dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      disabled={formData.steps.length === 1}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground dark:text-white mb-3">
              Etapas do Protocolo ({formData.steps.length})
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {formData.steps
                .sort((a, b) => a.dayOffset - b.dayOffset)
                .map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-[#1a1a1a] rounded border border-gray-300 dark:border-[rgba(255,255,255,0.1)]"
                  >
                    <div className="w-8 h-8 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center text-foreground dark:text-white">
                      {getStepIcon(step.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-foreground dark:text-white font-medium">
                          {step.name}
                        </p>
                        <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                          Dia {step.dayOffset}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{step.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white dark:bg-[#2a2a2a] text-foreground dark:text-white border border-gray-300 dark:border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-gray-50 dark:hover:bg-[#3a3a3a] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}