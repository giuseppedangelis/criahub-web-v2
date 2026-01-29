import { X, Trophy } from 'lucide-react';
import { useState } from 'react';

interface AnimalResult {
  id: string;
  name: string;
  registry: string;
  category: string;
  placement?: number;
  points?: number;
  award?: string;
  judge?: string;
  notes?: string;
}

interface UpdateResultModalProps {
  animal: AnimalResult;
  onClose: () => void;
  onSave: (updatedData: Partial<AnimalResult>) => void;
}

export function UpdateResultModal({ animal, onClose, onSave }: UpdateResultModalProps) {
  const [formData, setFormData] = useState({
    placement: animal.placement?.toString() || '',
    points: animal.points?.toString() || '',
    award: animal.award || '',
    judge: animal.judge || '',
    notes: animal.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      placement: formData.placement ? parseInt(formData.placement) : undefined,
      points: formData.points ? parseFloat(formData.points) : undefined,
      award: formData.award,
      judge: formData.judge,
      notes: formData.notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-2xl text-foreground dark:text-white mb-1">
              Atualizar Resultado
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {animal.name} • Reg: {animal.registry}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Categoria (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Categoria
            </label>
            <input
              type="text"
              value={animal.category}
              disabled
              className="w-full px-4 py-3 bg-muted dark:bg-[#3a3a3a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-muted-foreground dark:text-[#99a1af] cursor-not-allowed"
            />
          </div>

          {/* Colocação e Pontuação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Colocação
              </label>
              <select
                value={formData.placement}
                onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
              >
                <option value="">Não classificado</option>
                <option value="1">1º Lugar</option>
                <option value="2">2º Lugar</option>
                <option value="3">3º Lugar</option>
                <option value="4">4º Lugar</option>
                <option value="5">5º Lugar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                Pontuação
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                placeholder="0 - 100"
                className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
              />
            </div>
          </div>

          {/* Premiação */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Premiação / Título
            </label>
            <select
              value={formData.award}
              onChange={(e) => setFormData({ ...formData, award: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
            >
              <option value="">Nenhuma premiação</option>
              <option value="Campeão da Categoria">Campeão da Categoria</option>
              <option value="Reservado Campeão">Reservado Campeão</option>
              <option value="Campeão Geral">Campeão Geral</option>
              <option value="Reservado Campeão Geral">Reservado Campeão Geral</option>
              <option value="Melhor Marcha">Melhor Marcha</option>
              <option value="Melhor Morfologia">Melhor Morfologia</option>
              <option value="Grande Campeão">Grande Campeão</option>
              <option value="Outro">Outro (especificar nas observações)</option>
            </select>
          </div>

          {/* Juiz */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Juiz Responsável
            </label>
            <input
              type="text"
              value={formData.judge}
              onChange={(e) => setFormData({ ...formData, judge: e.target.value })}
              placeholder="Nome do juiz"
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
              Observações do Julgamento
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Comentários do juiz, destaques, pontos de melhoria..."
              className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] resize-none"
            />
          </div>

          {/* Preview da Premiação */}
          {(formData.placement || formData.award) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                    Preview do Resultado
                  </p>
                  <div className="space-y-1">
                    {formData.placement && (
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        Colocação: {formData.placement}º Lugar
                      </p>
                    )}
                    {formData.points && (
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        Pontuação: {formData.points} pontos
                      </p>
                    )}
                    {formData.award && (
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        Premiação: {formData.award}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              className="flex-1 px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Salvar Resultado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}