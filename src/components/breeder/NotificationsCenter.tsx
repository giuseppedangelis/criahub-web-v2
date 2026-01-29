import { Bell, Check, CheckCheck, Filter, Search, Trash2, X, AlertTriangle, Heart, DollarSign, Calendar, Info, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: number;
  category: 'saude' | 'financeiro' | 'servicos' | 'reproducao' | 'geral';
  priority: 'critica' | 'alta' | 'normal' | 'baixa';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  animalName?: string;
}

interface NotificationsCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsCenter({ isOpen, onClose }: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      category: 'saude',
      priority: 'critica',
      title: 'Vacina Antirrábica Vencendo',
      message: 'A vacina antirrábica de Estrela Dourada vence em 3 dias',
      timestamp: '2024-12-12T10:30:00',
      read: false,
      animalName: 'Estrela Dourada',
    },
    {
      id: 2,
      category: 'servicos',
      priority: 'alta',
      title: 'Serviço de Ferrageamento Agendado',
      message: 'Ferrageamento agendado para amanhã às 14h com João Silva',
      timestamp: '2024-12-12T09:15:00',
      read: false,
    },
    {
      id: 3,
      category: 'financeiro',
      priority: 'normal',
      title: 'Nova Receita Registrada',
      message: 'Venda de animal registrada: R$ 45.000,00',
      timestamp: '2024-12-11T16:45:00',
      read: true,
    },
    {
      id: 4,
      category: 'reproducao',
      priority: 'alta',
      title: 'Égua em Trabalho de Parto',
      message: 'Aurora Campeira apresenta sinais de trabalho de parto',
      timestamp: '2024-12-11T14:20:00',
      read: false,
      animalName: 'Aurora Campeira',
    },
    {
      id: 5,
      category: 'saude',
      priority: 'normal',
      title: 'Exame Realizado',
      message: 'Hemograma completo de Relâmpago Dourado - Resultado: Normal',
      timestamp: '2024-12-11T11:00:00',
      read: true,
      animalName: 'Relâmpago Dourado',
    },
    {
      id: 6,
      category: 'geral',
      priority: 'baixa',
      title: 'Novo Animal Cadastrado',
      message: 'Diamante da Estrela foi adicionado ao plantel',
      timestamp: '2024-12-10T15:30:00',
      read: true,
      animalName: 'Diamante da Estrela',
    },
    {
      id: 7,
      category: 'financeiro',
      priority: 'critica',
      title: 'Despesa Vencida',
      message: 'Pagamento de ração está atrasado há 5 dias',
      timestamp: '2024-12-10T08:00:00',
      read: false,
    },
    {
      id: 8,
      category: 'servicos',
      priority: 'normal',
      title: 'Limpeza de Baias Concluída',
      message: 'Todas as 12 baias foram limpas hoje',
      timestamp: '2024-12-09T17:00:00',
      read: true,
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('todas');
  const [filterStatus, setFilterStatus] = useState<'todas' | 'nao-lidas' | 'lidas'>('todas');
  const [filterPriority, setFilterPriority] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const getCategoryIcon = (category: Notification['category']) => {
    const icons = {
      saude: <Heart className="w-5 h-5" />,
      financeiro: <DollarSign className="w-5 h-5" />,
      servicos: <Calendar className="w-5 h-5" />,
      reproducao: <TrendingUp className="w-5 h-5" />,
      geral: <Info className="w-5 h-5" />,
    };
    return icons[category];
  };

  const getCategoryColor = (category: Notification['category']) => {
    const colors = {
      saude: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      financeiro: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      servicos: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      reproducao: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      geral: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
    };
    return colors[category];
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const badges = {
      critica: { label: 'Crítica', color: 'bg-red-500 text-white' },
      alta: { label: 'Alta', color: 'bg-orange-500 text-white' },
      normal: { label: 'Normal', color: 'bg-gray-500 text-white' },
      baixa: { label: 'Baixa', color: 'bg-gray-400 text-white' },
    };
    return badges[priority];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Agora há pouco';
    if (hours < 24) return `Há ${hours}h`;
    if (days === 1) return 'Ontem';
    if (days < 7) return `Há ${days} dias`;
    return date.toLocaleDateString('pt-BR');
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (filterCategory !== 'todas' && n.category !== filterCategory) return false;
      if (filterStatus === 'nao-lidas' && n.read) return false;
      if (filterStatus === 'lidas' && !n.read) return false;
      if (filterPriority !== 'todas' && n.priority !== filterPriority) return false;
      if (searchTerm && !n.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !n.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Ordenar por prioridade e depois por data
      const priorityOrder = { critica: 0, alta: 1, normal: 2, baixa: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div 
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-white/10 rounded-lg">
                <Bell className="w-6 h-6 text-primary dark:text-white" />
              </div>
              <div>
                <h2 className="text-xl text-foreground dark:text-white">Central de Notificações</h2>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="px-3 py-2 text-sm bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-lg hover:bg-primary/20 dark:hover:bg-white/20 transition-colors flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar notificações..."
              className="w-full h-10 pl-10 pr-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="todas">Todas Categorias</option>
              <option value="saude">Saúde</option>
              <option value="financeiro">Financeiro</option>
              <option value="servicos">Serviços</option>
              <option value="reproducao">Reprodução</option>
              <option value="geral">Geral</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="todas">Todas</option>
              <option value="nao-lidas">Não Lidas</option>
              <option value="lidas">Lidas</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="todas">Todas Prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground dark:text-[#99a1af] mb-4" />
              <p className="text-foreground dark:text-white mb-2">Nenhuma notificação encontrada</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Tente ajustar os filtros ou adicionar uma nova notificação
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notification.read
                      ? 'bg-card dark:bg-[#0d0d0d] border-border dark:border-[rgba(255,255,255,0.1)] opacity-70'
                      : 'bg-primary/5 dark:bg-white/5 border-primary/20 dark:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg border ${getCategoryColor(notification.category)}`}>
                      {getCategoryIcon(notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-foreground dark:text-white">{notification.title}</h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary dark:bg-white rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                            {notification.message}
                          </p>
                          {notification.animalName && (
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                              Animal: {notification.animalName}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${getPriorityBadge(notification.priority).color}`}>
                          {getPriorityBadge(notification.priority).label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-muted-foreground dark:text-[#99a1af]">
                          {formatTimestamp(notification.timestamp)}
                        </span>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1.5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 rounded transition-colors"
                              title="Marcar como lida"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border dark:border-[rgba(255,255,255,0.1)] bg-muted/50 dark:bg-[#0d0d0d]/50">
          <p className="text-sm text-center text-muted-foreground dark:text-[#99a1af]">
            Mostrando {filteredNotifications.length} de {notifications.length} notificações
          </p>
        </div>
      </div>
    </div>
  );
}
