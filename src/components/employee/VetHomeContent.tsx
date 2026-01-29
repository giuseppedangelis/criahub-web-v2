import { Search, Plus, Syringe, AlertCircle, Activity, Heart, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function VetHomeContent() {
  const [isOffline, setIsOffline] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [pendingSync] = useState(2);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
        <input
          type="text"
          placeholder="Buscar animal..."
          className="w-full pl-10 pr-4 py-3 bg-card dark:bg-[#1a1a1a] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
        />
      </div>

      {/* Greeting */}
      <div>
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Olá, Dra. Maria!</h2>
        <p className="text-muted-foreground dark:text-[#99a1af]">Bem-vinda ao painel veterinário</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <QuickActionButton
          icon={Plus}
          label="Registrar Serviço"
          color="bg-blue-500"
        />
        <QuickActionButton
          icon={Syringe}
          label="Vacinação"
          color="bg-green-500"
        />
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <IndicatorCard
          icon={AlertCircle}
          label="Aguardando confirmação"
          value="8"
          color="text-yellow-500"
        />
        <IndicatorCard
          icon={Activity}
          label="Em tratamento"
          value="5"
          color="text-red-500"
        />
        <IndicatorCard
          icon={Heart}
          label="Ciclo reprodutivo"
          value="12"
          color="text-pink-500"
        />
      </div>

      {/* Follow-up Cards */}
      <div>
        <h3 className="text-lg text-foreground dark:text-white mb-3">Acompanhamento</h3>
        <div className="space-y-3">
          <FollowUpCard
            title="Última Vacinação"
            animal="Estrela Mangalarga"
            description="Antirrábica - 15/10/2024"
            status="Em dia"
            statusColor="bg-green-500"
          />
          <FollowUpCard
            title="Próximo Ultrassom"
            animal="Bella Vista"
            description="Previsto para 20/11/2024"
            status="Próximo"
            statusColor="bg-blue-500"
          />
          <FollowUpCard
            title="Tratamento Ativo"
            animal="Lua Dourada"
            description="Antibiótico - Dose amanhã"
            status="Atenção"
            statusColor="bg-yellow-500"
          />
        </div>
      </div>

      {/* Offline Controls */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <WifiOff className="w-5 h-5 text-red-500" />
            ) : (
              <Wifi className="w-5 h-5 text-green-500" />
            )}
            <span className="text-foreground dark:text-white">
              {isOffline ? 'Modo Offline' : 'Conectado'}
            </span>
          </div>
          <button
            onClick={() => setIsOffline(!isOffline)}
            className="px-3 py-1 text-sm bg-muted dark:bg-[#0d0d0d] text-foreground dark:text-white rounded-lg"
          >
            {isOffline ? 'Reconectar' : 'Simular Offline'}
          </button>
        </div>

        {pendingSync > 0 && (
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-foreground dark:text-white">
                {pendingSync} registros pendentes
              </span>
            </div>
            <button className="text-sm text-primary dark:text-white hover:underline">
              Sincronizar
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground dark:text-white">Sincronizar ao reconectar</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-white"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, color }: any) {
  return (
    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-card dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
      <div className={`${color} p-3 rounded-full`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm text-center text-foreground dark:text-white">{label}</span>
    </button>
  );
}

function IndicatorCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-3 border border-border dark:border-[rgba(255,255,255,0.1)] text-center">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
      <p className="text-2xl text-foreground dark:text-white mb-1">{value}</p>
      <p className="text-xs text-muted-foreground dark:text-[#99a1af] leading-tight">{label}</p>
    </div>
  );
}

function FollowUpCard({ title, animal, description, status, statusColor }: any) {
  return (
    <div className="p-4 bg-card dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-foreground dark:text-white mb-1">{title}</p>
          <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{animal}</p>
        </div>
        <span className={`${statusColor} text-white text-xs px-2 py-1 rounded`}>
          {status}
        </span>
      </div>
      <p className="text-sm text-muted-foreground dark:text-[#99a1af]">{description}</p>
    </div>
  );
}
