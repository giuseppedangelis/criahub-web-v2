import { TrendingUp, TrendingDown, DollarSign, Plus, Search, Filter, FileText, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { AdvisorTransactionModal } from './AdvisorTransactionModal';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface Transaction {
  id: number;
  type: 'Entrada' | 'Saída';
  description: string;
  date: string;
  value: string;
  status: string;
  animal: string;
  category: string;
  linkedAnimals?: { id: number; name: string }[]; // Animais vinculados à OS
  urgency?: 'Normal' | 'Alta'; // Urgência da OS
}

export function AdvisorFinanceContent() {
  const [showNewTransaction, setShowNewTransaction] = useState(false);
  const [filterCategory, setFilterCategory] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterType, setFilterType] = useState('todos');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: 1, 
      type: 'Entrada', 
      description: 'Venda - Sol Nascente', 
      date: '15/11/2024', 
      value: 'R$ 8.000', 
      status: 'Pago', 
      animal: 'Sol Nascente', 
      category: 'Venda de Cavalo',
      linkedAnimals: [{ id: 1, name: 'Sol Nascente' }],
      urgency: 'Normal'
    },
    { 
      id: 2, 
      type: 'Saída', 
      description: 'OS #001 - Vacina em Lote', 
      date: '10/11/2024', 
      value: 'R$ 1.200', 
      status: 'Pago', 
      animal: 'Múltiplos (5)', 
      category: 'Veterinário',
      linkedAnimals: [
        { id: 1, name: 'Estrela Mangalarga' },
        { id: 2, name: 'Relâmpago Negro' },
        { id: 3, name: 'Bella Vista' },
        { id: 4, name: 'Sol Nascente' },
        { id: 5, name: 'Lua Prateada' },
      ],
      urgency: 'Normal'
    },
    { 
      id: 3, 
      type: 'Entrada', 
      description: 'Venda de Sêmen', 
      date: '05/11/2024', 
      value: 'R$ 3.500', 
      status: 'Pendente', 
      animal: 'Relâmpago Negro', 
      category: 'Venda de Sêmen',
      linkedAnimals: [{ id: 2, name: 'Relâmpago Negro' }],
      urgency: 'Normal'
    },
    { 
      id: 4, 
      type: 'Saída', 
      description: 'OS #002 - Atendimento Emergencial Cólica', 
      date: '01/11/2024', 
      value: 'R$ 850', 
      status: 'Pago', 
      animal: 'Trovão', 
      category: 'Veterinário',
      linkedAnimals: [{ id: 10, name: 'Trovão' }],
      urgency: 'Alta'
    },
    { 
      id: 5, 
      type: 'Saída', 
      description: 'OS #003 - Ração Premium (Estoque Mensal)', 
      date: '28/10/2024', 
      value: 'R$ 3.200', 
      status: 'Pago', 
      animal: '-', 
      category: 'Ração',
      linkedAnimals: [], // Despesa geral sem animal específico
      urgency: 'Normal'
    },
    { 
      id: 6, 
      type: 'Saída', 
      description: 'OS #004 - Transporte para Exposição', 
      date: '20/10/2024', 
      value: 'R$ 1.500', 
      status: 'Pendente', 
      animal: 'Múltiplos (2)', 
      category: 'Transporte',
      linkedAnimals: [
        { id: 1, name: 'Estrela Mangalarga' },
        { id: 2, name: 'Relâmpago Negro' },
      ],
      urgency: 'Normal'
    },
  ]);

  const handleSaveTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      ...transaction,
    };
    setTransactions([newTransaction, ...transactions]);
    toast.success('Ordem de Serviço criada com sucesso!');
  };

  // Filtrar transações
  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory = filterCategory === 'todos' || t.category === filterCategory;
    const matchesStatus = filterStatus === 'todos' || t.status === filterStatus;
    const matchesType = filterType === 'todos' || t.type === filterType;
    return matchesCategory && matchesStatus && matchesType;
  });

  // Calcular custo total por animal (exemplo)
  const calculateAnimalCost = (animalName: string) => {
    const animalTransactions = transactions.filter(t => 
      t.linkedAnimals?.some(a => a.name === animalName) && t.type === 'Saída'
    );
    const total = animalTransactions.reduce((sum, t) => {
      const value = parseFloat(t.value.replace('R$', '').replace('.', '').replace(',', '.').trim());
      return sum + value;
    }, 0);
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      {/* Info sobre RN-003 */}
      <div className="bg-blue-500/10 dark:bg-gray-500/10 border border-blue-500/20 dark:border-gray-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-gray-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground dark:text-white mb-2">Gestão Financeira Operacional</h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
              Este módulo permite lançar <strong>Ordens de Serviço (OS)</strong> vinculando despesas e receitas a animais específicos ou lotes. Com isso, você pode:
            </p>
            <ul className="text-sm text-muted-foreground dark:text-[#99a1af] space-y-1 ml-4">
              <li>• Rastrear quanto cada animal custou ao haras (RN-003)</li>
              <li>• Gerar relatórios de rentabilidade por animal</li>
              <li>• Diferenciar despesas gerais (ex: luz) de despesas específicas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">R$ 45.280</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Saldo Total</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">R$ 28.500</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Entradas (Mês)</p>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 p-3 rounded-xl">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-3xl text-foreground dark:text-white mb-2">R$ 12.420</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Saídas (Mês)</p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar transação..."
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button
          onClick={() => setShowNewTransaction(true)}
          className="w-full lg:w-auto px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Transação
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <NativeSelect
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full lg:w-auto px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="todos">Todas Categorias</option>
            <option value="Venda de Cavalo">Venda de Cavalo</option>
            <option value="Veterinário">Veterinário</option>
            <option value="Venda de Sêmen">Venda de Sêmen</option>
            <option value="Medicamentos">Medicamentos</option>
            <option value="Ração">Ração</option>
            <option value="Transporte">Transporte</option>
          </NativeSelect>
          <NativeSelect
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full lg:w-auto px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="todos">Todos Status</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
          </NativeSelect>
          <NativeSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full lg:w-auto px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          >
            <option value="todos">Todos Tipos</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </NativeSelect>
        </div>
      )}

      {/* Table */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tipo</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Descrição</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Valor</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Animal</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Categoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.type === 'Entrada' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{transaction.description}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{transaction.date}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{transaction.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      transaction.status === 'Pago' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{transaction.animal}</td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      <AdvisorTransactionModal
        isOpen={showNewTransaction}
        onClose={() => setShowNewTransaction(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}