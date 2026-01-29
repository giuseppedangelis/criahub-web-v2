import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
  descricao: string;
  valor: string;
  status: string;
  animal?: string;
}

interface BreederTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  initialType?: 'entrada' | 'saida';
}

export function BreederTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialType = 'entrada',
}: BreederTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<'entrada' | 'saida'>(initialType);
  const [formData, setFormData] = useState({
    categoria: '',
    data: '',
    descricao: '',
    valor: '',
    status: '',
    animal: '',
  });

  const handleSave = () => {
    // Validação
    if (!formData.categoria || !formData.data || !formData.valor || !formData.status) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Criar transação
    const newTransaction: Omit<Transaction, 'id'> = {
      tipo: transactionType,
      categoria: formData.categoria,
      data: formData.data,
      descricao: formData.descricao,
      valor: formData.valor,
      status: formData.status,
      animal: formData.animal || undefined,
    };

    onSave(newTransaction);

    // Reset form
    setFormData({
      categoria: '',
      data: '',
      descricao: '',
      valor: '',
      status: '',
      animal: '',
    });

    toast.success('Transação criada com sucesso!');
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      categoria: '',
      data: '',
      descricao: '',
      valor: '',
      status: '',
      animal: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Nova Transação</h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Tipo de Movimentação */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Tipo de Movimentação
              </label>
              <div className="h-10 relative rounded-xl border border-white dark:border-white">
                <div className="flex h-full p-1 gap-1">
                  <button
                    onClick={() => setTransactionType('entrada')}
                    className={`flex-1 rounded-lg transition-all ${
                      transactionType === 'entrada'
                        ? 'bg-white text-[#1a1a1a]'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">Entrada</span>
                  </button>
                  <button
                    onClick={() => setTransactionType('saida')}
                    className={`flex-1 rounded-lg transition-all ${
                      transactionType === 'saida'
                        ? 'bg-white text-[#1a1a1a]'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm">Saída</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tipo de Receita/Despesa */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                {transactionType === 'entrada' ? 'Tipo de Receita' : 'Tipo de Despesa'}
              </label>
              <NativeSelect
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="">Selecione a categoria</option>
                {transactionType === 'entrada' ? (
                  <>
                    <option value="Venda de Cavalo">Venda de Cavalo</option>
                    <option value="Serviço de Cobertura">Serviço de Cobertura</option>
                    <option value="Venda de Embrião">Venda de Embrião</option>
                    <option value="Venda de Sêmen">Venda de Sêmen</option>
                    <option value="Pensão">Pensão</option>
                    <option value="Prêmios">Prêmios</option>
                    <option value="Outro">Outro</option>
                  </>
                ) : (
                  <>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Veterinário">Veterinário</option>
                    <option value="Ferrador">Ferrador</option>
                    <option value="Medicamentos">Medicamentos</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Funcionários">Funcionários</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Outro">Outro</option>
                  </>
                )}
              </NativeSelect>
            </div>

            {/* Data de Recebimento/Vencimento */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                {transactionType === 'entrada' ? 'Data de Recebimento' : 'Data de Vencimento'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white pointer-events-none" />
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Descrição
              </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: Venda de égua Estrela"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Valor
              </label>
              <input
                type="text"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0,00"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Status
              </label>
              <NativeSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="">Selecione o status</option>
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
                <option value="Cancelado">Cancelado</option>
              </NativeSelect>
            </div>

            {/* Animal Vinculado (opcional) */}
            <div>
              <label className="block text-sm text-foreground dark:text-white mb-2">
                Animal Vinculado (opcional)
              </label>
              <input
                type="text"
                value={formData.animal}
                onChange={(e) => setFormData({ ...formData, animal: e.target.value })}
                placeholder="Nome do animal"
                className="w-full h-10 px-4 bg-card dark:bg-[#3a3a3a] border border-border dark:border-0 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col lg:flex-row gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          <button
            onClick={handleCancel}
            className="flex-1 h-10 px-4 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-10 px-4 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}