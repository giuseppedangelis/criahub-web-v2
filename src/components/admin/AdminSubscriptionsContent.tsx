import { Search, Filter, Download, Send, Edit, MoreVertical, Eye, Plus, X, Check, Calendar } from 'lucide-react';
import { useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  harasName: string;
  ownerName: string;
  plan: 'Basic' | 'Professional' | 'Premium';
  dueDate: string;
  status: 'Ativa' | 'Pendente' | 'Vencida' | 'Suspensa';
  value: string;
}

export function AdminSubscriptionsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showSendInvoiceModal, setShowSendInvoiceModal] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: '1', harasName: 'Haras do Sol', ownerName: 'Carlos Eduardo Silva', plan: 'Premium', dueDate: '2025-12-15', status: 'Ativa', value: 'R$ 499' },
    { id: '2', harasName: 'Fazenda Vale Verde', ownerName: 'Maria Fernanda Costa', plan: 'Professional', dueDate: '2025-12-20', status: 'Ativa', value: 'R$ 299' },
    { id: '3', harasName: 'Haras Boa Esperança', ownerName: 'João Pedro Santos', plan: 'Basic', dueDate: '2025-11-30', status: 'Pendente', value: 'R$ 149' },
    { id: '4', harasName: 'Haras Aurora', ownerName: 'Ana Paula Oliveira', plan: 'Premium', dueDate: '2025-12-10', status: 'Ativa', value: 'R$ 499' },
    { id: '5', harasName: 'Haras Vanguarda', ownerName: 'Roberto Almeida', plan: 'Professional', dueDate: '2025-11-25', status: 'Vencida', value: 'R$ 299' },
    { id: '6', harasName: 'Haras Esperança', ownerName: 'Juliana Martins', plan: 'Basic', dueDate: '2025-12-05', status: 'Suspensa', value: 'R$ 149' },
  ]);

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.harasName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleMenu = (id: string) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleEditPlan = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowEditPlanModal(true);
    setActiveMenuId(null);
  };

  const handleSendInvoice = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowSendInvoiceModal(true);
    setActiveMenuId(null);
  };

  const handleToggleStatus = (subscription: Subscription) => {
    // Toggle entre Ativa e Suspensa funcional
    setSubscriptions(prevSubs => 
      prevSubs.map(sub => 
        sub.id === subscription.id
          ? { ...sub, status: sub.status === 'Ativa' ? 'Suspensa' : 'Ativa' }
          : sub
      )
    );
    setActiveMenuId(null);
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'Ativa':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Vencida':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Suspensa':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPlanColor = (plan: Subscription['plan']) => {
    switch (plan) {
      case 'Premium':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Professional':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Basic':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com Busca e Novo Cliente */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Pesquisar por haras ou criador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>

        {/* Novo Cliente Button */}
        <button
          onClick={() => setShowNewClientModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Tabela Desktop / Cards Mobile */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d] border-b border-border dark:border-[rgba(255,255,255,0.1)]">
              <tr>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Nome do Haras</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Criador/Dono</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Plano</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Data de Vencimento</th>
                <th className="px-6 py-4 text-left text-foreground dark:text-white">Status</th>
                <th className="px-6 py-4 text-center text-foreground dark:text-white">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4 text-foreground dark:text-white">{sub.harasName}</td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">{sub.ownerName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getPlanColor(sub.plan)}`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">
                    {new Date(sub.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center relative">
                      <button
                        onClick={() => toggleMenu(sub.id)}
                        className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-foreground dark:text-white" />
                      </button>

                      {/* Actions Menu */}
                      {activeMenuId === sub.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 top-10 z-50 w-56 bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] py-2">
                            <button
                              onClick={() => handleEditPlan(sub)}
                              className="w-full text-left px-4 py-3 hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white transition-colors"
                            >
                              Editar Plano
                            </button>
                            <button
                              onClick={() => handleSendInvoice(sub)}
                              className="w-full text-left px-4 py-3 hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white transition-colors"
                            >
                              Enviar Fatura
                            </button>
                            <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] my-2" />
                            <button
                              onClick={() => handleToggleStatus(sub)}
                              className="w-full text-left px-4 py-3 hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-foreground dark:text-white">
                                  {sub.status === 'Ativa' ? 'Suspender' : 'Ativar'}
                                </span>
                                <div className={`w-10 h-6 rounded-full transition-colors ${
                                  sub.status === 'Ativa' 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}>
                                  <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                                    sub.status === 'Ativa' 
                                      ? 'ml-5' 
                                      : 'ml-1'
                                  }`} />
                                </div>
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
          {filteredSubscriptions.map((sub) => (
            <div key={sub.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-foreground dark:text-white mb-1">{sub.harasName}</h3>
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{sub.ownerName}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(sub.id)}
                    className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-foreground dark:text-white" />
                  </button>

                  {/* Actions Menu Mobile */}
                  {activeMenuId === sub.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-0 top-10 z-50 w-56 bg-card dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-border dark:border-[rgba(255,255,255,0.1)] py-2">
                        <button
                          onClick={() => handleEditPlan(sub)}
                          className="w-full text-left px-4 py-3 hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white transition-colors"
                        >
                          Editar Plano
                        </button>
                        <button
                          onClick={() => handleSendInvoice(sub)}
                          className="w-full text-left px-4 py-3 hover:bg-muted dark:hover:bg-[#0d0d0d] text-foreground dark:text-white transition-colors"
                        >
                          Enviar Fatura
                        </button>
                        <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] my-2" />
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className="w-full text-left px-4 py-3 hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-foreground dark:text-white">
                              {sub.status === 'Ativa' ? 'Suspender' : 'Ativar'}
                            </span>
                            <div className={`w-10 h-6 rounded-full transition-colors ${
                              sub.status === 'Ativa' 
                                ? 'bg-green-500' 
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}>
                              <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                                sub.status === 'Ativa' 
                                  ? 'ml-5' 
                                  : 'ml-1'
                              }`} />
                            </div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Plano</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getPlanColor(sub.plan)}`}>
                    {sub.plan}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(sub.status)}`}>
                    {sub.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-[#99a1af]">
                <Calendar className="w-4 h-4" />
                <span>Vencimento: {new Date(sub.dueDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubscriptions.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground dark:text-[#99a1af]">
              Nenhuma assinatura encontrada
            </p>
          </div>
        )}
      </div>

      {/* Modal: Novo Cliente */}
      {showNewClientModal && (
        <NewClientModal onClose={() => setShowNewClientModal(false)} />
      )}

      {/* Modal: Editar Plano */}
      {showEditPlanModal && selectedSubscription && (
        <EditPlanModal 
          subscription={selectedSubscription}
          onClose={() => {
            setShowEditPlanModal(false);
            setSelectedSubscription(null);
          }} 
        />
      )}

      {/* Modal: Enviar Fatura */}
      {showSendInvoiceModal && selectedSubscription && (
        <SendInvoiceModal 
          subscription={selectedSubscription}
          onClose={() => {
            setShowSendInvoiceModal(false);
            setSelectedSubscription(null);
          }} 
        />
      )}
    </div>
  );
}

// Modal: Novo Cliente
function NewClientModal({ onClose }: { onClose: () => void }) {
  // Adiciona suporte à tecla ESC (acessibilidade WCAG 2.1)
  useEscapeKey(onClose);
  
  const [permissions, setPermissions] = useState({
    webAccess: true,
    mobileAccess: true,
    editABCCMM: true,
    deleteRecords: true,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-3xl max-h-[90vh] overflow-y-auto modal-scroll">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
            <h2 className="text-2xl text-foreground dark:text-white">Cadastrar Novo Cliente</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground dark:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Informações do Haras */}
            <div>
              <h3 className="text-lg text-foreground dark:text-white mb-4">Informações do Haras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Nome do Haras
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    placeholder="Ex: Haras Aurora"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Nome do Criador/Dono do Haras
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    placeholder="Ex: João Silva"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    E-mail de Contato (Login)
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    placeholder="email@haras.com.br"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    placeholder="Digite o número de telefone"
                  />
                </div>
              </div>
            </div>

            {/* Plano e Vencimento */}
            <div>
              <h3 className="text-lg text-foreground dark:text-white mb-4">Plano e Vencimento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Plano de Assinatura
                  </label>
                  <NativeSelect>
                    <option value="">Selecione um plano</option>
                    <option>Basic</option>
                    <option>Professional</option>
                    <option>Premium</option>
                  </NativeSelect>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Valor do Plano (R$)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    placeholder="Ex: 299.00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                    Dia de Vencimento da Fatura
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
                    placeholder="Ex: 15 (Dia 15 de cada mês)"
                  />
                </div>
              </div>
            </div>

            {/* Concessão de Permissões */}
            <div>
              <h3 className="text-lg text-foreground dark:text-white mb-4">Concessão de Permissões</h3>
              <div className="space-y-4">
                {/* Permissão Web */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground dark:text-white">
                    Permissão de Acesso Web (Painel Administrativo)
                  </p>
                  <button
                    onClick={() => togglePermission('webAccess')}
                    className={`relative w-10 h-6 rounded-full transition-colors flex items-center ${
                      permissions.webAccess 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      permissions.webAccess 
                        ? 'translate-x-5' 
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Permissão Mobile */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground dark:text-white">
                    Permissão de Acesso Mobile (Visualização Rápida)
                  </p>
                  <button
                    onClick={() => togglePermission('mobileAccess')}
                    className={`relative w-10 h-6 rounded-full transition-colors flex items-center ${
                      permissions.mobileAccess 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      permissions.mobileAccess 
                        ? 'translate-x-5' 
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Editar ABCCMM */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground dark:text-white">
                    Editar Dados Importados da ABCCMM
                  </p>
                  <button
                    onClick={() => togglePermission('editABCCMM')}
                    className={`relative w-10 h-6 rounded-full transition-colors flex items-center ${
                      permissions.editABCCMM 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      permissions.editABCCMM 
                        ? 'translate-x-5' 
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                {/* Excluir Registros */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground dark:text-white">
                    Excluir Registros Oficiais de Nascimento
                  </p>
                  <button
                    onClick={() => togglePermission('deleteRecords')}
                    className={`relative w-10 h-6 rounded-full transition-colors flex items-center ${
                      permissions.deleteRecords 
                        ? 'bg-green-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      permissions.deleteRecords 
                        ? 'translate-x-5' 
                        : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.success('Cliente cadastrado com sucesso!');
                onClose();
              }}
              className="px-6 py-3 rounded-xl bg-primary dark:bg-white text-white dark:text-black hover:opacity-90 transition-all"
            >
              Cadastrar Cliente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Modal: Editar Plano
function EditPlanModal({ subscription, onClose }: { subscription: Subscription; onClose: () => void }) {
  // Adiciona suporte à tecla ESC (acessibilidade WCAG 2.1)
  useEscapeKey(onClose);
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
            <h2 className="text-xl text-foreground dark:text-white">Editar Plano</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground dark:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                Haras
              </label>
              <input
                type="text"
                value={subscription.harasName}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-muted-foreground dark:text-[#99a1af]"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                Plano Atual
              </label>
              <NativeSelect defaultValue={subscription.plan}>
                <option>Basic</option>
                <option>Professional</option>
                <option>Premium</option>
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                defaultValue={subscription.dueDate}
                className="w-full px-4 py-3 rounded-xl bg-background dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground dark:text-[#99a1af] mb-2">
                Status
              </label>
              <NativeSelect defaultValue={subscription.status}>
                <option>Ativa</option>
                <option>Pendente</option>
                <option>Vencida</option>
                <option>Suspensa</option>
              </NativeSelect>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.success('Plano atualizado com sucesso!');
                onClose();
              }}
              className="px-6 py-3 rounded-xl bg-primary dark:bg-white text-white dark:text-black hover:opacity-90 transition-all"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Modal: Enviar Fatura
function SendInvoiceModal({ subscription, onClose }: { subscription: Subscription; onClose: () => void }) {
  // Adiciona suporte à tecla ESC (acessibilidade WCAG 2.1)
  useEscapeKey(onClose);
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
            <h2 className="text-xl text-foreground dark:text-white">Enviar Fatura</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted dark:hover:bg-[#0d0d0d] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground dark:text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-muted-foreground dark:text-[#99a1af] mb-4">
              Confirma o envio da fatura para:
            </p>
            <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Haras:</span>
                <span className="text-foreground dark:text-white">{subscription.harasName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Dono:</span>
                <span className="text-foreground dark:text-white">{subscription.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Plano:</span>
                <span className="text-foreground dark:text-white">{subscription.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Valor:</span>
                <span className="text-foreground dark:text-white">{subscription.value}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.success('Fatura enviada com sucesso!');
                onClose();
              }}
              className="px-6 py-3 rounded-xl bg-primary dark:bg-white text-white dark:text-black hover:opacity-90 transition-all"
            >
              Confirmar Envio
            </button>
          </div>
        </div>
      </div>
    </>
  );
}