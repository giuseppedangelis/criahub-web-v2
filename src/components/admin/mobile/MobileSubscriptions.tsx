import { useState } from 'react';
import { Search, Mail, Activity } from 'lucide-react';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';

interface Subscription {
  id: string;
  harasName: string;
  owner: string;
  phone: string;
  email: string;
  totalAnimals: number;
  lastAccess: string;
  plan: 'Básico' | 'Premium' | 'Enterprise';
  planValue: string;
  startDate: string;
  dueDate: string;
  status: 'Ativo' | 'Vencida' | 'Pendente' | 'Suspenso';
  pendingInvoices: number;
}

interface ActivityLog {
  id: string;
  event: string;
  user: string;
  role: string;
  date: string;
  time: string;
  origin: 'Web' | 'Mobile';
}

const mockSubscriptions: Subscription[] = [
  { 
    id: '1', 
    harasName: 'Haras Aurora', 
    owner: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao@harasaurora.com.br',
    totalAnimals: 45,
    lastAccess: '2025-09-25T10:30:00',
    plan: 'Premium',
    planValue: 'R$ 299,00',
    startDate: '2024-01-15',
    dueDate: '2025-10-15', 
    status: 'Ativo',
    pendingInvoices: 0,
  },
  { 
    id: '2', 
    harasName: 'Haras Vanguarda', 
    owner: 'Maria Santos',
    phone: '(21) 97654-3210',
    email: 'maria@harasvanguarda.com.br',
    totalAnimals: 78,
    lastAccess: '2025-09-24T15:20:00',
    plan: 'Enterprise',
    planValue: 'R$ 599,00',
    startDate: '2023-06-20',
    dueDate: '2025-09-20', 
    status: 'Vencida',
    pendingInvoices: 2,
  },
  { 
    id: '3', 
    harasName: 'Haras Esperança', 
    owner: 'Pedro Costa',
    phone: '(31) 96543-2109',
    email: 'pedro@harasesperanca.com.br',
    totalAnimals: 32,
    lastAccess: '2025-09-25T08:45:00',
    plan: 'Básico',
    planValue: 'R$ 149,00',
    startDate: '2024-03-10',
    dueDate: '2025-11-01', 
    status: 'Ativo',
    pendingInvoices: 0,
  },
  { 
    id: '4', 
    harasName: 'Haras Falcão', 
    owner: 'Ana Oliveira',
    phone: '(41) 95432-1098',
    email: 'ana@harasfalcao.com.br',
    totalAnimals: 56,
    lastAccess: '2025-09-10T14:30:00',
    plan: 'Premium',
    planValue: 'R$ 299,00',
    startDate: '2024-02-05',
    dueDate: '2025-10-25', 
    status: 'Pendente',
    pendingInvoices: 1,
  },
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    event: 'Falha de Sincronização de 5 itens',
    user: 'João Silva',
    role: 'Peão',
    date: '2025-09-25',
    time: '14:30',
    origin: 'Mobile',
  },
  {
    id: '2',
    event: 'Login bem-sucedido',
    user: 'João Silva',
    role: 'Criador/Dono',
    date: '2025-09-25',
    time: '10:30',
    origin: 'Web',
  },
  {
    id: '3',
    event: 'Cadastro de novo animal',
    user: 'Maria Santos',
    role: 'Veterinário',
    date: '2025-09-24',
    time: '16:45',
    origin: 'Mobile',
  },
  {
    id: '4',
    event: 'Exportação de relatório',
    user: 'João Silva',
    role: 'Criador/Dono',
    date: '2025-09-24',
    time: '09:15',
    origin: 'Web',
  },
];

export function MobileSubscriptions() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.harasName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'Ativo': return 'bg-gray-900 text-white';
      case 'Vencida': return 'bg-red-100 text-red-700';
      case 'Pendente': return 'bg-yellow-100 text-yellow-700';
      case 'Suspenso': return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailModal(true);
  };

  const handleViewLogs = () => {
    setShowDetailModal(false);
    setShowLogsModal(true);
  };

  const handleSendPaymentReminder = () => {
    alert('Lembrete de pagamento enviado');
    setShowDetailModal(false);
  };

  const handleSuspendAccount = () => {
    alert('Conta suspensa');
    setShowDetailModal(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-gray-900 mb-1">Assinaturas</h2>
        <p className="text-gray-600">Gestão de clientes</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Buscar por haras ou criador"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subscriptions List */}
      <div className="space-y-3">
        {filteredSubscriptions.map((subscription) => (
          <Card key={subscription.id} className="p-4 cursor-pointer" onClick={() => handleViewDetails(subscription)}>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-gray-900">{subscription.harasName}</p>
                  <p className="text-gray-600 mt-0.5">{subscription.owner}</p>
                </div>
                <Badge className={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>
                  <span className="text-gray-500">Plano:</span>
                  <p>{subscription.plan}</p>
                </div>
                <div>
                  <span className="text-gray-500">Vencimento:</span>
                  <p>{new Date(subscription.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Client Detail Bottom Sheet */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSubscription?.harasName}</DialogTitle>
            <DialogDescription>Informações detalhadas do cliente</DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-6 py-4">
              {/* Client Info */}
              <div className="space-y-3">
                <div>
                  <Label>Dono</Label>
                  <p className="text-gray-900 mt-1">{selectedSubscription.owner}</p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="text-gray-900 mt-1">{selectedSubscription.phone}</p>
                </div>
                <div>
                  <Label>E-mail</Label>
                  <p className="text-gray-900 mt-1">{selectedSubscription.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Total de Animais</Label>
                    <p className="text-gray-900 mt-1">{selectedSubscription.totalAnimals}</p>
                  </div>
                  <div>
                    <Label>Último Acesso</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedSubscription.lastAccess).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedSubscription.status)}>
                      {selectedSubscription.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Subscription Details */}
              <div className="space-y-3">
                <h3 className="text-gray-900">Detalhes da Assinatura</h3>
                <div>
                  <Label>Plano</Label>
                  <p className="text-gray-900 mt-1">{selectedSubscription.plan}</p>
                </div>
                <div>
                  <Label>Valor</Label>
                  <p className="text-gray-900 mt-1">{selectedSubscription.planValue}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Início</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedSubscription.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <Label>Próx. Vencimento</Label>
                    <p className="text-gray-900 mt-1">
                      {new Date(selectedSubscription.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Faturas Pendentes</Label>
                  <p className="text-gray-900 mt-1">{selectedSubscription.pendingInvoices}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              variant="outline" 
              onClick={handleSendPaymentReminder}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Lembrete de Pagamento
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewLogs}
              className="w-full"
            >
              <Activity className="w-4 h-4 mr-2" />
              Ver Logs de Atividade
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSuspendAccount}
              className="w-full text-red-600 border-red-600 hover:bg-red-50"
            >
              Suspender Conta
            </Button>
            <Button variant="outline" onClick={() => setShowDetailModal(false)} className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Logs Bottom Sheet */}
      <Dialog open={showLogsModal} onOpenChange={setShowLogsModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Logs de Atividade</DialogTitle>
            <DialogDescription>{selectedSubscription?.harasName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {mockActivityLogs.map((log) => (
              <Card key={log.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-gray-900 flex-1">{log.event}</p>
                    <Badge variant="outline" className="text-xs">
                      {log.origin}
                    </Badge>
                  </div>
                  <div className="text-gray-600">
                    <p>{log.user} — {log.role}</p>
                    <p className="text-gray-500 mt-1">
                      {log.date} às {log.time}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowLogsModal(false)} className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}