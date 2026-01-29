import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, MapPin, Clock, Edit, Trash2, X, Heart, Bell, Paperclip, Upload, Search, FileText, Trophy, Gavel, DollarSign, Wrench, User } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { AwardsHistoryTab } from './AwardsHistoryTab';
import { AddServiceEventModal } from './AddServiceEventModal';
import { toast } from 'sonner';

type AgendaTab = 'services' | 'events' | 'awards';

export function BreederAgendaContent() {
  const [activeTab, setActiveTab] = useState<AgendaTab>('services');
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 18)); // Nov 18, 2024
  const [selectedDate, setSelectedDate] = useState(18);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // SERVIÇOS INTERNOS - Operações do haras
  const internalServices = [
    {
      id: 1,
      type: 'service',
      title: 'Vacinação - Plantel Completo',
      category: 'Saúde',
      categoryColor: 'bg-green-500',
      date: 18,
      time: '14:00',
      animal: '15 animais',
      location: 'Piquete Central',
      description: 'Aplicação de vacina antirrábica em todo o plantel',
      relatedAnimals: [
        { name: 'Trovão', registry: 'ABCCMM 1234567-01', image: null },
        { name: 'Ventania', registry: 'ABCCMM 1234567-02', image: null },
        { name: 'Estrela', registry: 'ABCCMM 1234567-03', image: null },
      ],
      veterinarian: 'Dr. João Silva',
      reminders: ['30 minutos antes'],
      attachments: [
        { name: 'Plano_Vacinacao.pdf', type: 'PDF', size: '2.1 MB' },
      ],
    },
    {
      id: 2,
      type: 'service',
      title: 'Exame Gestacional',
      category: 'Consulta',
      categoryColor: 'bg-blue-500',
      date: 23,
      time: '09:00',
      animal: 'Estrela Mangalarga',
      location: 'Baia 12',
      description: 'Exame gestacional de rotina - 45 dias de gestação',
      relatedAnimals: [
        { name: 'Estrela Mangalarga', registry: 'ABCCMM 1234567-89', image: null },
      ],
      veterinarian: 'Dr. Pedro Costa',
      reminders: ['1 dia antes', '30 minutos antes'],
      attachments: [],
    },
    {
      id: 3,
      type: 'service',
      title: 'Cobertura - Estrela Dourada',
      category: 'Cobertura',
      categoryColor: 'bg-red-500',
      date: 25,
      time: '10:00',
      animal: 'Estrela Dourada x Relâmpago Negro',
      location: 'Piquete 1',
      description: 'Cobertura da égua Estrela Dourada com o garanhão Relâmpago Negro. Primeira tentativa do ciclo reprodutivo.',
      relatedAnimals: [
        { name: 'Relâmpago Negro', registry: 'ABCCMM 1234567-10', image: null },
        { name: 'Estrela Dourada', registry: 'ABCCMM 1234567-11', image: null },
      ],
      veterinarian: 'Dr. Pedro Costa',
      reminders: ['30 minutos antes'],
      attachments: [
        { name: 'Plano_Cobertura_Estrela.pdf', type: 'PDF', size: '2.1 MB' },
        { name: 'Historico_Reprodutivo.xlsx', type: 'Excel', size: '1.8 MB' },
      ],
    },
    {
      id: 4,
      type: 'service',
      title: 'Casqueamento - Lote de Potros',
      category: 'Manejo',
      categoryColor: 'bg-yellow-500',
      date: 28,
      time: '15:00',
      animal: '8 animais',
      location: 'Tronco de Contenção',
      description: 'Manutenção preventiva de cascos do lote de potros de 2023',
      relatedAnimals: [
        { name: 'Potro 1', registry: 'ABCCMM 1234567-20', image: null },
        { name: 'Potro 2', registry: 'ABCCMM 1234567-21', image: null },
        { name: 'Potro 3', registry: 'ABCCMM 1234567-22', image: null },
        { name: 'Potro 4', registry: 'ABCCMM 1234567-23', image: null },
      ],
      veterinarian: '',
      reminders: ['1 dia antes'],
      attachments: [],
    },
  ];

  // EVENTOS PÚBLICOS - Atividades externas
  const publicEvents = [
    {
      id: 101,
      type: 'event',
      title: '45ª Exposição Nacional do Mangalarga Marchador',
      category: 'Exposição',
      categoryColor: 'bg-purple-500',
      date: 20,
      time: '08:00',
      endDate: 23,
      endTime: '18:00',
      location: 'Parque Fernando Costa',
      city: 'Belo Horizonte',
      state: 'MG',
      description: 'Principal exposição nacional da raça, com participação de criadores de todo o país',
      relatedAnimals: [
        { name: 'Trovão', registry: 'ABCCMM 1234567-01', image: null },
        { name: 'Ventania', registry: 'ABCCMM 1234567-02', image: null },
      ],
      organizer: 'ABCCMM',
      link: 'https://www.abccmm.org.br/exposicao',
      reminders: ['1 semana antes', '1 dia antes'],
      attachments: [
        { name: 'Regulamento_Exposicao.pdf', type: 'PDF', size: '1.5 MB' },
      ],
    },
    {
      id: 102,
      type: 'event',
      title: 'Copa Regional de Marcha',
      category: 'Pista',
      categoryColor: 'bg-blue-500',
      date: 27,
      time: '14:00',
      endDate: 27,
      endTime: '19:00',
      location: 'Haras Vale do Sol',
      city: 'Sete Lagoas',
      state: 'MG',
      description: 'Competição regional de marcha com participação de 50 animais',
      relatedAnimals: [
        { name: 'Relâmpago Negro', registry: 'ABCCMM 1234567-10', image: null },
      ],
      organizer: 'Associação Regional',
      link: '',
      reminders: ['3 dias antes'],
      attachments: [],
    },
  ];

  // Combinar serviços e eventos para visualização no calendário
  const allItems = activeTab === 'services' ? internalServices : activeTab === 'events' ? publicEvents : [];

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    toast.success(itemToDelete.type === 'service' ? 'Serviço excluído com sucesso!' : 'Evento excluído com sucesso!');
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const selectedItems = allItems.filter(item => item.date === selectedDate);

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-6 py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'services'
              ? 'border-white dark:border-white text-foreground dark:text-white'
              : 'border-transparent text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Serviços
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'events'
              ? 'border-white dark:border-white text-foreground dark:text-white'
              : 'border-transparent text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Eventos Públicos
        </button>
      </div>

      {/* Tab Content */}
      {(activeTab === 'services' || activeTab === 'events') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex gap-2 order-1 lg:order-2">
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="flex-1 lg:flex-none px-4 py-2 bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
                >
                  Hoje
                </button>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex-1 lg:flex-none px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {activeTab === 'services' ? 'Novo Serviço' : 'Novo Evento'}
                </button>
              </div>
              <div className="flex items-center gap-4 order-2 lg:order-1">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground dark:text-white" />
                </button>
                <h3 className="text-xl text-foreground dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground dark:text-white" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-sm text-muted-foreground dark:text-[#99a1af] py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((day, idx) => {
                const hasItems = day && allItems.some(item => item.date === day);
                const isSelected = day === selectedDate;
                const isToday = day === 18;
                
                return (
                  <button
                    key={idx}
                    onClick={() => day && setSelectedDate(day)}
                    disabled={!day}
                    className={`
                      aspect-square p-2 rounded-lg transition-all relative
                      ${!day ? 'invisible' : ''}
                      ${isSelected ? 'bg-primary dark:bg-white text-white dark:text-black' : 'hover:bg-muted dark:hover:bg-[#0d0d0d]'}
                      ${isToday && !isSelected ? 'border-2 border-primary dark:border-white' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <span className={`text-sm ${isSelected ? 'text-white dark:text-black' : 'text-foreground dark:text-white'}`}>
                          {day}
                        </span>
                        {hasItems && !isSelected && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                            <div className="w-1 h-1 bg-primary dark:bg-white rounded-full"></div>
                          </div>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Items Panel */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <h3 className="text-xl text-foreground dark:text-white mb-6">
              {activeTab === 'services' ? 'Serviços' : 'Eventos'} do Dia {selectedDate}
            </h3>
            
            {selectedItems.length > 0 ? (
              <div className="space-y-4">
                {selectedItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onClick={handleItemClick} 
                    onEdit={handleEditClick} 
                    onDelete={handleDeleteClick} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                {activeTab === 'services' ? (
                  <Wrench className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4 opacity-50" />
                ) : (
                  <Trophy className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mx-auto mb-4 opacity-50" />
                )}
                <p className="text-muted-foreground dark:text-[#99a1af]">
                  Nenhum {activeTab === 'services' ? 'serviço' : 'evento'} neste dia
                </p>
              </div>
            )}
          </div>

          {/* Modal: Adicionar */}
          {showAddModal && (
            <AddServiceEventModal 
              onClose={() => setShowAddModal(false)} 
              initialType={activeTab === 'services' ? 'service' : 'event'}
            />
          )}

          {/* Modal: Detalhes */}
          {showDetailsModal && selectedItem && (
            <ItemDetailsModal 
              item={selectedItem} 
              onClose={() => setShowDetailsModal(false)} 
              onEdit={handleEditClick} 
            />
          )}

          {/* Modal: Editar */}
          {showEditModal && selectedItem && (
            <EditItemModal 
              item={selectedItem} 
              onClose={() => setShowEditModal(false)} 
            />
          )}

          {/* Modal: Excluir */}
          {showDeleteModal && itemToDelete && (
            <DeleteItemModal 
              item={itemToDelete} 
              onClose={() => setShowDeleteModal(false)} 
              onConfirm={handleConfirmDelete}
            />
          )}
        </div>
      )}

      {activeTab === 'awards' && (
        <AwardsHistoryTab />
      )}
    </div>
  );
}

// Card de Item (Serviço ou Evento)
function ItemCard({ item, onClick, onEdit, onDelete }: any) {
  return (
    <div 
      onClick={() => onClick(item)}
      className="p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg space-y-3 cursor-pointer hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <span className={`inline-block px-2 py-1 ${item.categoryColor} text-white text-xs rounded mb-2`}>
            {item.category}
          </span>
          <p className="text-foreground dark:text-white mb-2">{item.title}</p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
              <Clock className="w-4 h-4" />
              <span>{item.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
              <CalendarIcon className="w-4 h-4" />
              <span>{item.animal || `${item.relatedAnimals?.length || 0} animais`}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
              <MapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-2 hover:bg-accent dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-foreground dark:text-white" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="p-2 hover:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-foreground dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Detalhes
function ItemDetailsModal({ item, onClose, onEdit }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-foreground dark:text-white">{item.title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 ${item.categoryColor} text-white text-xs rounded`}>
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-3 text-foreground dark:text-white">
              <Clock className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              <span>{item.time}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground dark:text-white">
              <MapPin className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
              <span>{item.location}{item.city ? `, ${item.city} - ${item.state}` : ''}</span>
            </div>
            {item.veterinarian && (
              <div className="flex items-center gap-3 text-foreground dark:text-white">
                <User className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <span>{item.veterinarian}</span>
              </div>
            )}
            {item.organizer && (
              <div className="flex items-center gap-3 text-foreground dark:text-white">
                <User className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <span>Organizador: {item.organizer}</span>
              </div>
            )}
          </div>

          {/* Descrição */}
          {item.description && (
            <div>
              <h3 className="text-foreground dark:text-white mb-2">Descrição</h3>
              <p className="text-muted-foreground dark:text-[#99a1af]">{item.description}</p>
            </div>
          )}

          {/* Animais Relacionados */}
          {item.relatedAnimals && item.relatedAnimals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <h3 className="text-foreground dark:text-white">Animais Relacionados</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {item.relatedAnimals.map((animal: any, idx: number) => (
                  <div key={idx} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 flex items-center gap-3 hover:bg-accent dark:hover:bg-[#1a1a1a] transition-colors">
                    <div className="w-12 h-12 bg-[#3a3a3a] rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {animal.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground dark:text-white text-sm truncate">{animal.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] truncate">{animal.registry}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lembretes */}
          {item.reminders && item.reminders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <h3 className="text-foreground dark:text-white">Lembretes</h3>
              </div>
              <div className="space-y-2">
                {item.reminders.map((reminder: string, idx: number) => (
                  <div key={idx} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                    <span className="text-foreground dark:text-white text-sm">{reminder}</span>
                    <span className="px-2 py-1 border border-border dark:border-[rgba(255,255,255,0.1)] rounded text-muted-foreground dark:text-[#99a1af] text-xs ml-auto">
                      Push
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anexos */}
          {item.attachments && item.attachments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Paperclip className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                <h3 className="text-foreground dark:text-white">Anexos</h3>
              </div>
              <div className="space-y-3">
                {item.attachments.map((file: any, idx: number) => (
                  <div key={idx} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-4 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                    <div className="flex-1">
                      <p className="text-foreground dark:text-white">{file.name}</p>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{file.type} • {file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Link do Evento (apenas para eventos públicos) */}
          {item.type === 'event' && item.link && (
            <div>
              <h3 className="text-foreground dark:text-white mb-2">Link do Evento</h3>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary dark:text-white hover:opacity-80 transition-opacity"
              >
                {item.link}
              </a>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Editar {item.type === 'service' ? 'Serviço' : 'Evento'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Edição (placeholder - será implementado com formulários completos)
function EditItemModal({ item, onClose }: any) {
  const handleSave = () => {
    toast.success(item.type === 'service' ? 'Serviço atualizado com sucesso!' : 'Evento atualizado com sucesso!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">
            Editar {item.type === 'service' ? 'Serviço' : 'Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Formulário de edição será implementado aqui...
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-white text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de Exclusão
function DeleteItemModal({ item, onClose, onConfirm }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-foreground dark:text-white">
            Excluir {item.type === 'service' ? 'Serviço' : 'Evento'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-foreground dark:text-white">
            Você tem certeza de que deseja excluir este {item.type === 'service' ? 'serviço' : 'evento'}?
          </p>

          <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 space-y-1">
            <p className="text-sm text-foreground dark:text-white font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
              {item.time} • {item.location}
            </p>
          </div>

          <p className="text-xs text-red-600 dark:text-red-400">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}