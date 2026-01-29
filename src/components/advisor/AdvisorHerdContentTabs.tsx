import { Search, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { NativeSelect } from '../ui/native-select';

export function CondominiumAnimalsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar por animal ou condomínio..."
            className="w-full pl-10 pr-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar ao Condomínio</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Animais em Condomínio</p>
          <p className="text-2xl text-foreground dark:text-white">3</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Condomínios Ativos</p>
          <p className="text-2xl text-foreground dark:text-white">2</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Valor Total Investido</p>
          <p className="text-2xl text-foreground dark:text-white">R$ 45.000</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background dark:bg-[#0d0d0d] rounded-2xl border border-border dark:border-[#3a3a3a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-black">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-white">Animal</th>
                <th className="text-left px-6 py-4 text-sm text-white">Registro</th>
                <th className="text-left px-6 py-4 text-sm text-white">Condomínio</th>
                <th className="text-left px-6 py-4 text-sm text-white">Participação</th>
                <th className="text-left px-6 py-4 text-sm text-white">Valor</th>
                <th className="text-left px-6 py-4 text-sm text-white">Data de Início</th>
                <th className="text-center px-6 py-4 text-sm text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#3a3a3a]">
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Estrela Mangalarga</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">MM-2020-1234</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Condomínio MM Norte</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">40%</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">R$ 20.000</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">15/01/2024</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Estrela Mangalarga');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Estrela Mangalarga');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Relâmpago Negro</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">MM-2018-5678</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Condomínio MM Sul</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">25%</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">R$ 15.000</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">22/03/2024</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Relâmpago Negro');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Relâmpago Negro');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCondominiumAnimalModal onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <EditCondominiumAnimalModal 
          animalName={selectedItem}
          onClose={() => setShowEditModal(false)} 
        />
      )}
      {showDeleteModal && (
        <DeleteCondominiumAnimalModal 
          animalName={selectedItem}
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
}

export function AnimalAwardsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar por animal ou evento..."
            className="w-full pl-10 pr-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Premiação</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Total de Prêmios</p>
          <p className="text-2xl text-foreground dark:text-white">12</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Campeões</p>
          <p className="text-2xl text-foreground dark:text-white">5</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Reservados</p>
          <p className="text-2xl text-foreground dark:text-white">4</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Finalistas</p>
          <p className="text-2xl text-foreground dark:text-white">3</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background dark:bg-[#0d0d0d] rounded-2xl border border-border dark:border-[#3a3a3a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-black">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-white">Animal</th>
                <th className="text-left px-6 py-4 text-sm text-white">Evento</th>
                <th className="text-left px-6 py-4 text-sm text-white">Categoria</th>
                <th className="text-left px-6 py-4 text-sm text-white">Colocação</th>
                <th className="text-left px-6 py-4 text-sm text-white">Data</th>
                <th className="text-left px-6 py-4 text-sm text-white">Local</th>
                <th className="text-center px-6 py-4 text-sm text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#3a3a3a]">
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Estrela Mangalarga</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Nacional ABCCMM 2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Fêmea Júnior</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs">
                    Campeã
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">15/06/2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Belo Horizonte - MG</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Estrela Mangalarga - Nacional ABCCMM 2024');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Estrela Mangalarga - Nacional ABCCMM 2024');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Relâmpago Negro</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Copa América 2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Macho Adulto</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 rounded-full text-xs">
                    Reservado
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">22/08/2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">São Paulo - SP</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Relâmpago Negro - Copa América 2024');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Relâmpago Negro - Copa América 2024');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAnimalAwardModal onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <EditAnimalAwardModal 
          awardName={selectedItem}
          onClose={() => setShowEditModal(false)} 
        />
      )}
      {showDeleteModal && (
        <DeleteAnimalAwardModal 
          awardName={selectedItem}
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
}

export function AssociatedCondominiumsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar por condomínio..."
            className="w-full pl-10 pr-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Condomínio</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Condomínios Ativos</p>
          <p className="text-2xl text-foreground dark:text-white">2</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Total de Parceiros</p>
          <p className="text-2xl text-foreground dark:text-white">8</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Animais Compartilhados</p>
          <p className="text-2xl text-foreground dark:text-white">3</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background dark:bg-[#0d0d0d] rounded-2xl border border-border dark:border-[#3a3a3a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-black">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-white">Nome do Condomínio</th>
                <th className="text-left px-6 py-4 text-sm text-white">Parceiros</th>
                <th className="text-left px-6 py-4 text-sm text-white">Animais</th>
                <th className="text-left px-6 py-4 text-sm text-white">Data de Criação</th>
                <th className="text-left px-6 py-4 text-sm text-white">Status</th>
                <th className="text-center px-6 py-4 text-sm text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#3a3a3a]">
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Condomínio MM Norte</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">5</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">2</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">15/01/2024</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Condomínio MM Norte');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Condomínio MM Norte');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Condomínio MM Sul</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">3</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">1</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">22/03/2024</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs">
                    Ativo
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Condomínio MM Sul');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Condomínio MM Sul');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCondominiumModal onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <EditCondominiumModal 
          condominiumName={selectedItem}
          onClose={() => setShowEditModal(false)} 
        />
      )}
      {showDeleteModal && (
        <DeleteCondominiumModal 
          condominiumName={selectedItem}
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
}

export function AssociatedAwardsTab() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar por premiação..."
            className="w-full pl-10 pr-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adicionar Premiação</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Total de Prêmios</p>
          <p className="text-2xl text-foreground dark:text-white">8</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Criador Destaque</p>
          <p className="text-2xl text-foreground dark:text-white">3</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Expositor Destaque</p>
          <p className="text-2xl text-foreground dark:text-white">2</p>
        </div>
        <div className="bg-background dark:bg-[#0d0d0d] rounded-xl border border-border dark:border-[#3a3a3a] p-4">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Outros</p>
          <p className="text-2xl text-foreground dark:text-white">3</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background dark:bg-[#0d0d0d] rounded-2xl border border-border dark:border-[#3a3a3a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-black">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-white">Evento</th>
                <th className="text-left px-6 py-4 text-sm text-white">Categoria</th>
                <th className="text-left px-6 py-4 text-sm text-white">Premiação</th>
                <th className="text-left px-6 py-4 text-sm text-white">Data</th>
                <th className="text-left px-6 py-4 text-sm text-white">Local</th>
                <th className="text-center px-6 py-4 text-sm text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[#3a3a3a]">
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Nacional ABCCMM 2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Criador</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded-full text-xs">
                    Criador Destaque
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">15/06/2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Belo Horizonte - MG</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Criador Destaque - Nacional ABCCMM 2024');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Criador Destaque - Nacional ABCCMM 2024');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-muted dark:hover:bg-[#1a1a1a] transition-colors">
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Copa América 2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">Expositor</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs">
                    Expositor Destaque
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">22/08/2024</td>
                <td className="px-6 py-4 text-sm text-foreground dark:text-white">São Paulo - SP</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedItem('Expositor Destaque - Copa América 2024');
                        setShowEditModal(true);
                      }}
                      className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors" 
                      title="Editar"
                    >
                      <Edit className="w-4 h-4 text-foreground dark:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedItem('Expositor Destaque - Copa América 2024');
                        setShowDeleteModal(true);
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAssociatedAwardModal onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <EditAssociatedAwardModal 
          awardName={selectedItem}
          onClose={() => setShowEditModal(false)} 
        />
      )}
      {showDeleteModal && (
        <DeleteAssociatedAwardModal 
          awardName={selectedItem}
          onClose={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
}

// ==================== MODALS ====================

// Condominium Animals Modals
function AddCondominiumAnimalModal({ onClose }: { onClose: () => void }) {
  const handleSave = () => {
    toast.success('Animal adicionado ao condomínio com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Animal ao Condomínio</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Animal <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Selecione o animal</option>
              <option>Estrela Mangalarga</option>
              <option>Relâmpago Negro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Condomínio <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Selecione o condomínio</option>
              <option>Condomínio MM Norte</option>
              <option>Condomínio MM Sul</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Participação (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Participação (%)"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Valor (R$)"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data de Início <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCondominiumAnimalModal({ animalName, onClose }: { animalName: string | null; onClose: () => void }) {
  const handleSave = () => {
    toast.success('Dados atualizados com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Editar Animal no Condomínio</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Animal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={animalName || ''}
              readOnly
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[#6b6b6b] rounded-xl text-muted-foreground dark:text-[#99a1af] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Condomínio <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Condomínio MM Norte</option>
              <option>Condomínio MM Sul</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Participação (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              defaultValue="40"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Valor (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="20.000"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data de Início <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                defaultValue="2024-01-15"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteCondominiumAnimalModal({ animalName, onClose }: { animalName: string | null; onClose: () => void }) {
  const handleDelete = () => {
    toast.success('Animal removido do condomínio com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-md">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Remover do Condomínio</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Você tem certeza de que deseja remover <strong className="text-foreground dark:text-white">{animalName}</strong> do condomínio?
          </p>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

// Animal Awards Modals
function AddAnimalAwardModal({ onClose }: { onClose: () => void }) {
  const handleSave = () => {
    toast.success('Premiação adicionada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Premiação do Animal</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Animal <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Selecione o animal</option>
              <option>Estrela Mangalarga</option>
              <option>Relâmpago Negro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Evento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nome do evento"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Categoria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Categoria"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Colocação <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Selecione a colocação</option>
              <option>Campeão</option>
              <option>Reservado</option>
              <option>3º Lugar</option>
              <option>Finalista</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Local <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Local do evento"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditAnimalAwardModal({ awardName, onClose }: { awardName: string | null; onClose: () => void }) {
  const handleSave = () => {
    toast.success('Premiação atualizada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Editar Premiação do Animal</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Animal <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Estrela Mangalarga</option>
              <option>Relâmpago Negro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Evento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Nacional ABCCMM 2024"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Categoria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Fêmea Júnior"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Colocação <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Campeão</option>
              <option>Reservado</option>
              <option>3º Lugar</option>
              <option>Finalista</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                defaultValue="2024-06-15"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Local <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Belo Horizonte - MG"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAnimalAwardModal({ awardName, onClose }: { awardName: string | null; onClose: () => void }) {
  const handleDelete = () => {
    toast.success('Premiação removida com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-md">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Remover Premiação</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Você tem certeza de que deseja remover a premiação <strong className="text-foreground dark:text-white">{awardName}</strong>?
          </p>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

// Condominium Modals
function AddCondominiumModal({ onClose }: { onClose: () => void }) {
  const handleSave = () => {
    toast.success('Condomínio criado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Condomínio</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nome do Condomínio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nome do condomínio"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data de Criação <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Ativo</option>
              <option>Inativo</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Descrição
            </label>
            <textarea
              placeholder="Descrição do condomínio"
              rows={4}
              className="w-full px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditCondominiumModal({ condominiumName, onClose }: { condominiumName: string | null; onClose: () => void }) {
  const handleSave = () => {
    toast.success('Condomínio atualizado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Editar Condomínio</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Nome do Condomínio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={condominiumName || ''}
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data de Criação <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                defaultValue="2024-01-15"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Ativo</option>
              <option>Inativo</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Descrição
            </label>
            <textarea
              defaultValue="Condomínio focado em animais de alta linhagem"
              rows={4}
              className="w-full px-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteCondominiumModal({ condominiumName, onClose }: { condominiumName: string | null; onClose: () => void }) {
  const handleDelete = () => {
    toast.success('Condomínio removido com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-md">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Remover Condomínio</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Você tem certeza de que deseja remover o <strong className="text-foreground dark:text-white">{condominiumName}</strong>?
          </p>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

// Associated Awards Modals
function AddAssociatedAwardModal({ onClose }: { onClose: () => void }) {
  const handleSave = () => {
    toast.success('Premiação adicionada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Adicionar Premiação do Associado</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Evento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nome do evento"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Categoria <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Selecione a categoria</option>
              <option>Criador</option>
              <option>Expositor</option>
              <option>Outro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Premiação <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Selecione a premiação</option>
              <option>Criador Destaque</option>
              <option>Expositor Destaque</option>
              <option>Melhor Criador</option>
              <option>Outro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Local <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Local do evento"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function EditAssociatedAwardModal({ awardName, onClose }: { awardName: string | null; onClose: () => void }) {
  const handleSave = () => {
    toast.success('Premiação atualizada com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Editar Premiação do Associado</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Evento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Nacional ABCCMM 2024"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Categoria <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Criador</option>
              <option>Expositor</option>
              <option>Outro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Premiação <span className="text-red-500">*</span>
            </label>
            <NativeSelect className="w-full">
              <option>Criador Destaque</option>
              <option>Expositor Destaque</option>
              <option>Melhor Criador</option>
              <option>Outro</option>
            </NativeSelect>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Data <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground dark:text-white" />
              <input
                type="date"
                defaultValue="2024-06-15"
                className="w-full h-10 pl-12 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">
              Local <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Belo Horizonte - MG"
              className="w-full h-10 px-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#6b6b6b] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteAssociatedAwardModal({ awardName, onClose }: { awardName: string | null; onClose: () => void }) {
  const handleDelete = () => {
    toast.success('Premiação removida com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-md">
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white">Remover Premiação</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
            Você tem certeza de que deseja remover a premiação <strong className="text-foreground dark:text-white">{awardName}</strong>?
          </p>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] text-foreground dark:text-white rounded-xl hover:bg-muted dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
