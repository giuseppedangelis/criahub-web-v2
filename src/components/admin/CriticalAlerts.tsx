import { AlertTriangle, CheckCircle, XCircle, Clock, Filter, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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

interface Alert {
  id: string;
  type: string;
  client: string;
  module: string;
  date: string;
  status: 'Aberto' | 'Fechado' | 'Em Análise';
  urgency: 'Alta' | 'Média' | 'Baixa';
  log: string;
}

export function CriticalAlerts() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

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
    {
      id: '5',
      type: 'Falha de Autenticação',
      client: 'Haras Estrela',
      module: 'Sistema',
      date: '2025-09-24T12:20:00',
      status: 'Fechado',
      urgency: 'Alta',
      log: 'Múltiplas tentativas de login falhadas (5x). IP bloqueado temporariamente por 1 hora.',
    },
  ];

  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const filteredAlerts = mockAlerts.filter(alert => {
    switch (filter) {
      case 'critical':
        return alert.urgency === 'Alta';
      case 'warning':
        return alert.urgency === 'Média';
      case 'resolved':
        return alert.status === 'Fechado';
      default:
        return true;
    }
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
    if (selectedAlert) {
      setAlerts(alerts.map(a => a.id === selectedAlert.id ? { ...a, status: 'Fechado' as const } : a));
      setShowDetailModal(false);
    }
  };

  return (
    <div className={`p-8 min-h-full transition-colors ${
      theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'
    }`}>
      <div className="mb-8">
        <h1 className={theme === 'dark' ? 'text-white mb-2' : 'text-gray-900 mb-2'}>
          Alertas Críticos do Sistema
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Monitore erros, falhas e problemas de integração
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por cliente"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Urgência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Plantel">Plantel</SelectItem>
                  <SelectItem value="Assinaturas">Assinaturas</SelectItem>
                  <SelectItem value="Sistema">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Tipo de Alerta</th>
                  <th className="text-left py-3 px-4 text-gray-600">Cliente Afetado</th>
                  <th className="text-left py-3 px-4 text-gray-600">Módulo</th>
                  <th className="text-left py-3 px-4 text-gray-600">Data</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={`w-4 h-4 ${getUrgencyColor(alert.urgency)}`} />
                        <span className="text-gray-900">{alert.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{alert.client}</td>
                    <td className="py-4 px-4 text-gray-700">{alert.module}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(alert.date).toLocaleDateString('pt-BR')} às {new Date(alert.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(alert)}>
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alert Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Diagnóstico de Falha (Crítico)
            </DialogTitle>
            <DialogDescription>Detalhes técnicos do alerta e ações disponíveis</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Alerta</Label>
                  <p className="text-gray-900 mt-1">{selectedAlert.type}</p>
                </div>
                <div>
                  <Label>Cliente Afetado</Label>
                  <p className="text-gray-900 mt-1">{selectedAlert.client}</p>
                </div>
                <div>
                  <Label>Módulo</Label>
                  <p className="text-gray-900 mt-1">{selectedAlert.module}</p>
                </div>
                <div>
                  <Label>Data da Ocorrência</Label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedAlert.date).toLocaleDateString('pt-BR')} às {new Date(selectedAlert.date).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
              <div>
                <Label>Log do Sistema</Label>
                <div className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg font-mono overflow-x-auto">
                  <code>{selectedAlert.log}</code>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handleForceSync} className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Forçar Sincronização
            </Button>
            <Button variant="outline" onClick={handleNotifyClient} className="border-purple-600 text-purple-600 hover:bg-purple-50">
              Notificar Cliente (E-mail)
            </Button>
            <Button onClick={handleMarkResolved} className="bg-gray-900 hover:bg-gray-800">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marcar como Resolvido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}