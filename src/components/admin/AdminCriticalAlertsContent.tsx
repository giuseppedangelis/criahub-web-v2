import { useState } from 'react';
import { Search, ChevronDown, AlertTriangle, X, CheckCircle2, Eye } from 'lucide-react';
import { NativeSelect } from '../ui/native-select';

interface Alert {
  id: number;
  type: string;
  client: string;
  module: string;
  date: string;
  status: 'Aberto' | 'Fechado' | 'Em Análise';
  urgency: 'Alta' | 'Média' | 'Baixa';
  log: string;
}

export function AdminCriticalAlertsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alertsList, setAlertsList] = useState<Alert[]>([
    {
      id: 1,
      type: 'Falha de Sincronização',
      client: 'Haras Aurora',
      module: 'Plantel',
      date: '25/09/2025',
      status: 'Aberto',
      urgency: 'Alta',
      log: 'Erro ao sincronizar 5 registros de animais. Timeout na conexão com o banco de dados. Stack trace: Connection timeout after 30s...',
    },
    {
      id: 2,
      type: 'Falha na Cobrança Recorrente',
      client: 'Haras Vanguarda',
      module: 'Assinaturas',
      date: '25/09/2025',
      status: 'Aberto',
      urgency: 'Alta',
      log: 'Cartão de crédito recusado. Código de erro: insufficient_funds. Tentativa 3 de 3.',
    },
    {
      id: 3,
      type: 'Limite de Mídia Atingido',
      client: 'Haras Esperança',
      module: 'Plantel',
      date: '25/09/2025',
      status: 'Fechado',
      urgency: 'Média',
      log: 'Cliente atingiu 100% do limite de armazenamento (5GB). Upload bloqueado automaticamente.',
    },
    {
      id: 4,
      type: 'Erro no Envio de E-mail',
      client: 'Haras Trovão',
      module: 'Assinaturas',
      date: '25/09/2025',
      status: 'Em Análise',
      urgency: 'Baixa',
      log: 'Falha ao enviar e-mail de notificação. SMTP error: Connection refused.',
    },
  ]);

  // Função para alterar o status do alerta
  const handleChangeStatus = (newStatus: Alert['status']) => {
    if (selectedAlert) {
      setAlertsList(alertsList.map(alert =>
        alert.id === selectedAlert.id
          ? { ...alert, status: newStatus }
          : alert
      ));
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  // Filtrar alertas
  const filteredAlerts = alertsList.filter((alert) => {
    const matchesSearch = alert.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'all' || alert.module === moduleFilter;
    const matchesUrgency = urgencyFilter === 'all' || alert.status === urgencyFilter;
    return matchesSearch && matchesModule && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Buscar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#6b6b6b]" />
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[#3a3a3a] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
            />
          </div>
        </div>

        {/* Filtrar por urgência */}
        <div className="w-full lg:w-auto lg:min-w-[200px]">
          <NativeSelect
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="all">Filtrar por urgência</option>
            <option value="Aberto">Aberto</option>
            <option value="Fechado">Fechado</option>
            <option value="Em Análise">Em Análise</option>
          </NativeSelect>
        </div>

        {/* Filtrar por módulo */}
        <div className="w-full lg:w-auto lg:min-w-[200px]">
          <NativeSelect
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="all">Filtrar por módulo</option>
            <option value="Plantel">Plantel</option>
            <option value="Assinaturas">Assinaturas</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Reprodução">Reprodução</option>
          </NativeSelect>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="px-4 py-4 text-left text-foreground dark:text-white w-[300px]">
                  Tipo de Alerta
                </th>
                <th className="px-4 py-4 text-left text-foreground dark:text-white w-[195px]">
                  Cliente Afetado
                </th>
                <th className="px-4 py-4 text-left text-foreground dark:text-white w-[180px]">
                  Módulo
                </th>
                <th className="px-4 py-4 text-left text-foreground dark:text-white w-[172px]">
                  Data
                </th>
                <th className="px-4 py-4 text-left text-foreground dark:text-white">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-foreground dark:text-white">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {filteredAlerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  <td className="px-4 py-3 text-foreground dark:text-white">
                    {alert.type}
                  </td>
                  <td className="px-4 py-3 text-foreground dark:text-white">
                    {alert.client}
                  </td>
                  <td className="px-4 py-3 text-foreground dark:text-white">
                    {alert.module}
                  </td>
                  <td className="px-4 py-3 text-foreground dark:text-white">
                    {alert.date}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        alert.status === 'Aberto'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : alert.status === 'Fechado'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowDetailModal(true);
                      }}
                      className="px-3 py-1.5 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 space-y-3"
            >
              {/* Header com Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                      Tipo de Alerta
                    </p>
                    <p className="text-foreground dark:text-white">{alert.type}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    alert.status === 'Aberto'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : alert.status === 'Fechado'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {alert.status}
                </span>
              </div>

              {/* Cliente Afetado */}
              <div>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  Cliente Afetado
                </p>
                <p className="text-foreground dark:text-white">{alert.client}</p>
              </div>

              {/* Módulo e Data */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                    Módulo
                  </p>
                  <p className="text-foreground dark:text-white">{alert.module}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                    Data
                  </p>
                  <p className="text-foreground dark:text-white">{alert.date}</p>
                </div>
              </div>

              {/* Botão Ver Detalhes */}
              <button
                onClick={() => {
                  setSelectedAlert(alert);
                  setShowDetailModal(true);
                }}
                className="w-full px-4 py-2 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Detalhes
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground dark:text-[#99a1af]" />
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Nenhum alerta encontrado com os filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {showDetailModal && selectedAlert && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 w-[90%] max-w-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground dark:text-white">
                Detalhes do Alerta
              </h2>
              <button
                className="text-red-600 dark:text-red-400"
                onClick={() => setShowDetailModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Tipo de Alerta
              </p>
              <p className="text-foreground dark:text-white">{selectedAlert.type}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Cliente Afetado
              </p>
              <p className="text-foreground dark:text-white">{selectedAlert.client}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Módulo
              </p>
              <p className="text-foreground dark:text-white">{selectedAlert.module}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Data
              </p>
              <p className="text-foreground dark:text-white">{selectedAlert.date}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Status
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAlert.status === 'Aberto'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : selectedAlert.status === 'Fechado'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}
              >
                {selectedAlert.status}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Urgência
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAlert.urgency === 'Alta'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : selectedAlert.urgency === 'Média'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}
              >
                {selectedAlert.urgency}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                Log de Erro
              </p>
              <pre className="text-foreground dark:text-white bg-muted dark:bg-[#0d0d0d] p-3 rounded-lg whitespace-pre-wrap">
                {selectedAlert.log}
              </pre>
            </div>

            {/* Ações do Alerta */}
            <div className="mt-6 pt-4 border-t border-border dark:border-[#3a3a3a] flex flex-col sm:flex-row gap-3">
              {selectedAlert.status !== 'Em Análise' && (
                <button
                  onClick={() => handleChangeStatus('Em Análise')}
                  className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg hover:opacity-80 transition-opacity"
                >
                  Marcar como Em Análise
                </button>
              )}
              {selectedAlert.status !== 'Fechado' && (
                <button
                  onClick={() => handleChangeStatus('Fechado')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white dark:bg-green-700 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar como Resolvido
                </button>
              )}
              {selectedAlert.status === 'Fechado' && (
                <button
                  onClick={() => handleChangeStatus('Aberto')}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:opacity-80 transition-opacity"
                >
                  Reabrir Alerta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}