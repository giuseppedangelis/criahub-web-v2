import { useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface Alert {
  id: string;
  type: string;
  client: string;
  module: string;
  date: string;
  status: 'Aberto' | 'Fechado' | 'Em Análise';
  urgency: 'Alta' | 'Média' | 'Baixa';
  log?: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'Falha de Sincronização',
    client: 'Haras Aurora',
    module: 'Plantel',
    date: '2025-09-25T14:30:00',
    status: 'Aberto',
    urgency: 'Alta',
    log: 'Erro ao sincronizar 5 registros de animais. Timeout na conexão com o banco de dados. Stack trace: Connection timeout after 30s...',
  },
  {
    id: '2',
    type: 'Falha na Cobrança Recorrente',
    client: 'Haras Vanguarda',
    module: 'Assinaturas',
    date: '2025-09-25T10:15:00',
    status: 'Aberto',
    urgency: 'Alta',
    log: 'Cartão de crédito recusado. Código de erro: insufficient_funds. Tentativa 3 de 3.',
  },
  {
    id: '3',
    type: 'Limite de Mídia Atingido',
    client: 'Haras Esperança',
    module: 'Plantel',
    date: '2025-09-25T08:00:00',
    status: 'Fechado',
    urgency: 'Média',
    log: 'Cliente atingiu 100% do limite de armazenamento (5GB). Upload bloqueado automaticamente.',
  },
  {
    id: '4',
    type: 'Erro de Importação ABCCMM',
    client: 'Haras Falcão',
    module: 'Plantel',
    date: '2025-09-24T16:45:00',
    status: 'Em Análise',
    urgency: 'Baixa',
    log: 'Falha ao processar 2 registros da planilha ABCCMM. Campos obrigatórios ausentes: pedigree, data_nascimento.',
  },
];

export function MobileAlerts() {
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || alert.urgency === filterUrgency;
    const matchesModule = filterModule === 'all' || alert.module === filterModule;
    return matchesSearch && matchesUrgency && matchesModule;
  });

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'Aberto': return 'bg-red-100 text-red-700';
      case 'Fechado': return 'bg-green-100 text-green-700';
      case 'Em Análise': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getUrgencyColor = (urgency: Alert['urgency']) => {
    switch (urgency) {
      case 'Alta': return 'text-red-600';
      case 'Média': return 'text-yellow-600';
      case 'Baixa': return 'text-green-600';
    }
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowDetailModal(true);
  };

  const handleForceSync = () => {
    alert('Sincronização forçada iniciada');
    setShowDetailModal(false);
  };

  const handleNotifyClient = () => {
    alert('E-mail enviado ao cliente');
    setShowDetailModal(false);
  };

  const handleMarkResolved = () => {
    alert('Marcado como resolvido');
    setShowDetailModal(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-gray-900 mb-1">Alertas Críticos</h2>
        <p className="text-gray-600">Monitoramento de falhas</p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por cliente"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowFilterModal(true)}>
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                  <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getUrgencyColor(alert.urgency)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">{alert.type}</p>
                    <p className="text-gray-600 mt-1">{alert.client}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(alert.status)}>
                  {alert.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-gray-500">
                <span>{alert.module}</span>
                <span>
                  {new Date(alert.date).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewDetails(alert)}
                className="w-full"
              >
                Ver Detalhes
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Bottom Sheet */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filtrar por</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Módulo</Label>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Plantel">Plantel</SelectItem>
                  <SelectItem value="Assinaturas">Assinaturas</SelectItem>
                  <SelectItem value="Sistema">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Urgência</Label>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFilterModal(false)} className="w-full bg-gray-900 hover:bg-gray-800">
              Buscar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Detail Bottom Sheet */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Diagnóstico de Falha
            </DialogTitle>
            <DialogDescription>Detalhes técnicos e ações disponíveis</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div>
                  <Label>Tipo de Alerta</Label>
                  <p className="text-gray-900 mt-1">{selectedAlert.type}</p>
                </div>
                <div>
                  <Label>Cliente Afetado</Label>
                  <p className="text-gray-900 mt-1">{selectedAlert.client}</p>
                </div>
                <div>
                  <Label>Data da Ocorrência</Label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedAlert.date).toLocaleDateString('pt-BR')} às {new Date(selectedAlert.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <Label>Log do Sistema</Label>
                  <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
                    <code className="text-xs">{selectedAlert.log}</code>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button variant="outline" onClick={handleForceSync} className="w-full">
              Forçar Sincronização
            </Button>
            <Button variant="outline" onClick={handleNotifyClient} className="w-full">
              Notificar Cliente (E-mail)
            </Button>
            <Button onClick={handleMarkResolved} className="w-full bg-gray-900 hover:bg-gray-800">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como Resolvido
            </Button>
            <Button variant="outline" onClick={() => setShowDetailModal(false)} className="w-full">
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}