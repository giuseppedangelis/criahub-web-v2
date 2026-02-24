import { X, Check, Trash2, CheckCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { Notification } from '@/types';

const formatNotificationTime = (dateValue?: string | null) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return '1 dia atrás';
  return `${diffDays} dias atrás`;
};

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (ids: string[]) => void | Promise<void>;
  onDelete: (ids: string[]) => void | Promise<void>;
}

export function NotificationsPanel({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead,
  onDelete
}: NotificationsPanelProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const notificationsWithTime = useMemo(() => {
    return notifications.map((notif) => ({
      ...notif,
      time: formatNotificationTime(notif.created_at),
      unread: !notif.read,
    }));
  }, [notifications]);

  if (!isOpen) return null;

  const handleSelectAll = () => {
    if (selectedIds.length === notificationsWithTime.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notificationsWithTime.map(n => n.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleMarkAsRead = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione ao menos uma notificação');
      return;
    }
    try {
      await Promise.resolve(onMarkAsRead(selectedIds));
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao marcar notificações.');
      return;
    }
    setSelectedIds([]);
    toast.success(`${selectedIds.length} notificação(ões) marcada(s) como lida(s)`);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione ao menos uma notificação');
      return;
    }
    try {
      await Promise.resolve(onDelete(selectedIds));
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao excluir notificações.');
      return;
    }
    setSelectedIds([]);
    toast.success(`${selectedIds.length} notificação(ões) excluída(s)`);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-card dark:bg-[#1a1a1a] shadow-2xl z-50 flex flex-col border-l border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-xl text-foreground dark:text-white">Todas as Notificações</h2>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
              {notificationsWithTime.length} notificações
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="border-b border-border dark:border-[rgba(255,255,255,0.1)] bg-muted dark:bg-[#0d0d0d]">
          {/* Select All Button */}
          <div className="p-4">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card dark:bg-[#1a1a1a] hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors text-sm"
            >
              <CheckCheck className="w-4 h-4 text-foreground dark:text-white" />
              <span className="text-foreground dark:text-white">
                {selectedIds.length === notificationsWithTime.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </span>
            </button>
          </div>

          {/* Action Buttons - Only when items are selected */}
          {selectedIds.length > 0 && (
            <div className="px-4 pb-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleMarkAsRead}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary dark:bg-white hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
              >
                <Check className="w-4 h-4 text-white dark:text-black" />
                <span className="text-white dark:text-black">Marcar como lida</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span className="text-white">Excluir</span>
              </button>

              <span className="text-sm text-muted-foreground dark:text-[#99a1af] ml-auto whitespace-nowrap">
                {selectedIds.length} selecionada(s)
              </span>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notificationsWithTime.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 bg-muted dark:bg-[#0d0d0d] rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-muted-foreground dark:text-[#99a1af]" />
              </div>
              <p className="text-foreground dark:text-white mb-2">Nenhuma notificação</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] text-center">
                Você está em dia! Não há notificações pendentes.
              </p>
            </div>
          ) : (
            <div>
              {notificationsWithTime.map((notif) => {
                const isSelected = selectedIds.includes(notif.id);

                return (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-border dark:border-[rgba(255,255,255,0.1)] cursor-pointer transition-colors ${
                      notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    } ${
                      isSelected ? 'bg-primary/10 dark:bg-white/10' : 'hover:bg-muted dark:hover:bg-[#0d0d0d]'
                    }`}
                    onClick={() => handleToggleSelect(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="mt-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(notif.id)}
                          className="w-4 h-4 rounded border-border dark:border-[#6b6b6b] text-primary dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-white cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      {/* Unread Indicator */}
                      {notif.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-foreground dark:text-white font-medium">
                            {notif.title}
                          </p>
                          <span className="text-xs text-muted-foreground dark:text-[#99a1af] whitespace-nowrap">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
