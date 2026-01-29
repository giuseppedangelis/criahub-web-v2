import { Search, MoreVertical, Download, Plus, Edit, Send, PlayCircle, StopCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function Subscriptions() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showSendInvoiceModal, setShowSendInvoiceModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [newClient, setNewClient] = useState({
    harasName: '',
    ownerName: '',
    email: '',
    phone: '',
    plan: 'Básico',
    dueDate: '',
    permissions: {
      plantel: true,
      reproduction: true,
      financial: false,
      team: true,
    },
  });

  const mockSubscriptions = [
    { id: '1', harasName: 'Haras Aurora', owner: 'João Silva', plan: 'Premium', dueDate: '2025-10-15', status: 'Ativo' },
    { id: '2', harasName: 'Haras Vanguarda', owner: 'Maria Santos', plan: 'Enterprise', dueDate: '2025-09-20', status: 'Vencida' },
    { id: '3', harasName: 'Haras Esperança', owner: 'Pedro Costa', plan: 'Básico', dueDate: '2025-11-01', status: 'Ativo' },
    { id: '4', harasName: 'Haras Falcão', owner: 'Ana Oliveira', plan: 'Premium', dueDate: '2025-10-25', status: 'Pendente' },
    { id: '5', harasName: 'Haras Estrela', owner: 'Carlos Mendes', plan: 'Premium', dueDate: '2025-10-30', status: 'Ativo' },
  ];

  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);

  const filteredSubscriptions = mockSubscriptions.filter(sub =>
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

  const handleEditPlan = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowEditPlanModal(true);
  };

  const handleSendInvoice = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowSendInvoiceModal(true);
  };

  const handleNewClient = () => {
    const newSubscription: Subscription = {
      id: String(subscriptions.length + 1),
      harasName: newClient.harasName,
      owner: newClient.ownerName,
      plan: newClient.plan as Subscription['plan'],
      dueDate: newClient.dueDate,
      status: 'Ativo',
    };
    setSubscriptions([...subscriptions, newSubscription]);
    setShowNewClientModal(false);
    setNewClient({
      harasName: '',
      ownerName: '',
      email: '',
      phone: '',
      plan: 'Básico',
      dueDate: '',
      permissions: {
        plantel: true,
        reproduction: true,
        financial: false,
        team: true,
      },
    });
  };

  return (
    <div className={`p-8 min-h-full transition-colors ${
      theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'
    }`}>
      <div className="mb-8">
        <h1 className={theme === 'dark' ? 'text-white mb-2' : 'text-gray-900 mb-2'}>
          Gerenciamento de Assinaturas
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Controle e administre as assinaturas ativas da plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Pesquisar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowNewClientModal(true)} className="bg-gray-900 hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Nome do Haras</th>
                  <th className="text-left py-3 px-4 text-gray-600">Criador/Dono</th>
                  <th className="text-left py-3 px-4 text-gray-600">Plano</th>
                  <th className="text-left py-3 px-4 text-gray-600">Data de Vencimento</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900">{subscription.harasName}</td>
                    <td className="py-4 px-4 text-gray-700">{subscription.owner}</td>
                    <td className="py-4 px-4 text-gray-700">{subscription.plan}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(subscription.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPlan(subscription)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Plano
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendInvoice(subscription)}>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Fatura
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Ativar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <StopCircle className="w-4 h-4 mr-2" />
                            Suspender
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* New Client Modal */}
      <Dialog open={showNewClientModal} onOpenChange={setShowNewClientModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            <DialogDescription>Preencha as informações do novo haras e do plano de assinatura</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-gray-900">Informações do Haras</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="harasName">Nome do Haras</Label>
                  <Input
                    id="harasName"
                    value={newClient.harasName}
                    onChange={(e) => setNewClient({ ...newClient, harasName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Nome do Dono</Label>
                  <Input
                    id="ownerName"
                    value={newClient.ownerName}
                    onChange={(e) => setNewClient({ ...newClient, ownerName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-900">Plano e Vencimento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan">Plano</Label>
                  <Select value={newClient.plan} onValueChange={(value) => setNewClient({ ...newClient, plan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Básico">Básico</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Data de Vencimento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newClient.dueDate}
                    onChange={(e) => setNewClient({ ...newClient, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-900">Concessão de Permissões</h3>
              <div className="space-y-3">
                {Object.entries(newClient.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key === 'plantel' ? 'Gestão do Plantel' : key === 'reproduction' ? 'Controle Reprodutivo' : key === 'financial' ? 'Gestão Financeira' : 'Gestão de Equipe'}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNewClient({
                          ...newClient,
                          permissions: { ...newClient.permissions, [key]: checked },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewClientModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleNewClient} className="bg-gray-900 hover:bg-gray-800">
              Cadastrar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={showEditPlanModal} onOpenChange={setShowEditPlanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>Altere as informações do plano de assinatura</DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Dono</Label>
                <Input value={selectedSubscription.owner} readOnly />
              </div>
              <div>
                <Label>Plano</Label>
                <Select defaultValue={selectedSubscription.plan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vencimento</Label>
                <Input type="date" defaultValue={selectedSubscription.dueDate} />
              </div>
              <div>
                <Label>Status</Label>
                <Select defaultValue={selectedSubscription.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Vencida">Vencida</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPlanModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowEditPlanModal(false)} className="bg-gray-900 hover:bg-gray-800">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invoice Modal */}
      <Dialog open={showSendInvoiceModal} onOpenChange={setShowSendInvoiceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar Fatura</DialogTitle>
            <DialogDescription>
              Confirme o envio da fatura para {selectedSubscription?.harasName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Uma fatura será enviada para o e-mail cadastrado do cliente. Deseja confirmar o envio?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendInvoiceModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowSendInvoiceModal(false)} className="bg-gray-900 hover:bg-gray-800">
              Confirmar Envio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}