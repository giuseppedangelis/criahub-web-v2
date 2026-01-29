import { Heart, Egg, Baby, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export function AdvisorReproductionContent() {
  const [activeTab, setActiveTab] = useState('coverage');

  const tabs = [
    { id: 'coverage', label: 'Cobertura', icon: Heart },
    { id: 'ovules', label: 'Óvulos', icon: Egg },
    { id: 'embryos', label: 'Embriões', icon: Baby },
    { id: 'pregnancies', label: 'Gestações', icon: Heart },
  ];

  const coverages = [
    { id: 1, mare: 'Estrela Mangalarga', type: 'IA', stallion: 'Relâmpago Negro', status: 'Confirmada', date: '15/10/2024' },
    { id: 2, mare: 'Lua Dourada', type: 'Monta Natural', stallion: 'Trovão Branco', status: 'Aguardando', date: '20/10/2024' },
    { id: 3, mare: 'Bella Vista', type: 'TE', stallion: 'Vento Sul', status: 'Confirmada', date: '10/11/2024' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 transition-colors ${
                activeTab === tab.id
                  ? 'text-foreground dark:text-white border-b-2 border-primary dark:border-white'
                  : 'text-muted-foreground dark:text-[#99a1af]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
          />
        </div>
        <button className="px-4 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Cadastrar Fêmea
        </button>
      </div>

      {/* Table */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-[#0d0d0d]">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Égua</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Tipo</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Garanhão</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Status</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Data</th>
                <th className="text-left px-6 py-4 text-sm text-muted-foreground dark:text-[#99a1af]">Observações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {coverages.map((coverage) => (
                <tr key={coverage.id} className="hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
                  <td className="px-6 py-4 text-foreground dark:text-white">{coverage.mare}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{coverage.type}</td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{coverage.stallion}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      coverage.status === 'Confirmada' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {coverage.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground dark:text-white">{coverage.date}</td>
                  <td className="px-6 py-4 text-muted-foreground dark:text-[#99a1af]">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
