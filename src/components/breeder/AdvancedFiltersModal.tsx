import { X } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface AdvancedFiltersModalProps {
  onClose: () => void;
  filterCategoria: string;
  setFilterCategoria: (value: string) => void;
  filterIdade: string;
  setFilterIdade: (value: string) => void;
  filterFilhos: string;
  setFilterFilhos: (value: string) => void;
  filterPremiacoes: string;
  setFilterPremiacoes: (value: string) => void;
}

export function AdvancedFiltersModal({
  onClose,
  filterCategoria,
  setFilterCategoria,
  filterIdade,
  setFilterIdade,
  filterFilhos,
  setFilterFilhos,
  filterPremiacoes,
  setFilterPremiacoes,
}: AdvancedFiltersModalProps) {
  const handleReset = () => {
    setFilterCategoria('todos');
    setFilterIdade('todos');
    setFilterFilhos('todos');
    setFilterPremiacoes('todos');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border dark:border-[#3a3a3a]">
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl text-foreground dark:text-white mb-1">Filtros Avançados</h3>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Configure filtros adicionais para refinar sua busca
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Categoria</label>
              <NativeSelect
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
              >
                <option value="todos">Todas as Categorias</option>
                <option value="reprodutor">Reprodutor</option>
                <option value="reprodutora">Reprodutora</option>
                <option value="potro">Potro</option>
                <option value="potra">Potra</option>
              </NativeSelect>
            </div>

            {/* Idade */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Idade</label>
              <NativeSelect
                value={filterIdade}
                onChange={(e) => setFilterIdade(e.target.value)}
              >
                <option value="todos">Todas as Idades</option>
                <option value="1_ano">1 ano</option>
                <option value="2_anos">2 anos</option>
                <option value="3_anos">3 anos</option>
                <option value="4_anos">4 anos</option>
                <option value="5_anos">5 anos</option>
                <option value="6_anos">6 anos</option>
                <option value="7_anos">7 anos</option>
                <option value="8_anos">8 anos</option>
                <option value="9_anos">9 anos</option>
                <option value="10_anos">10 anos</option>
                <option value="11_anos">11 anos</option>
                <option value="12_anos">12 anos</option>
              </NativeSelect>
            </div>

            {/* Filhos */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Quantidade de Filhos</label>
              <NativeSelect
                value={filterFilhos}
                onChange={(e) => setFilterFilhos(e.target.value)}
              >
                <option value="todos">Todos os Filhos</option>
                <option value="sem_filhos">Sem filhos</option>
                <option value="1_filho">1 filho</option>
                <option value="2_filhos">2 filhos</option>
                <option value="3_filhos">3 filhos</option>
                <option value="4_filhos">4 filhos</option>
                <option value="5_filhos">5 filhos</option>
                <option value="6_filhos">6 filhos</option>
                <option value="7_filhos">7 filhos</option>
                <option value="8_filhos">8 filhos</option>
                <option value="9_filhos">9 filhos</option>
                <option value="10_filhos">10 filhos</option>
                <option value="11_filhos">11 filhos</option>
                <option value="12_filhos">12 filhos</option>
                <option value="mais_12_filhos">Mais de 12 filhos</option>
              </NativeSelect>
            </div>

            {/* Premiações */}
            <div className="space-y-2">
              <label className="text-sm text-foreground dark:text-white">Quantidade de Premiações</label>
              <NativeSelect
                value={filterPremiacoes}
                onChange={(e) => setFilterPremiacoes(e.target.value)}
              >
                <option value="todos">Todas as Premiações</option>
                <option value="sem_premiacoes">Sem premiações</option>
                <option value="1_premiacao">1 premiação</option>
                <option value="2_premiacoes">2 premiações</option>
                <option value="3_premiacoes">3 premiações</option>
                <option value="4_premiacoes">4 premiações</option>
                <option value="5_premiacoes">5 premiações</option>
                <option value="6_premiacoes">6 premiações</option>
                <option value="7_premiacoes">7 premiações</option>
                <option value="8_premiacoes">8 premiações</option>
                <option value="mais_8_premiacoes">Mais de 8 premiações</option>
              </NativeSelect>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)] flex gap-3 justify-end">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-transparent border border-muted-foreground dark:border-[#b0b0b0] text-muted-foreground dark:text-[#b0b0b0] rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Limpar Filtros
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
