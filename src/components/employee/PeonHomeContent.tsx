import { Plus, Calendar, AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function PeonHomeContent() {
  const [isOffline, setIsOffline] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [pendingSync, setPendingSync] = useState(3);

  const upcomingBirths = [
    { name: 'Bella Vista', progress: 95, dueDate: '20/11/2024', daysLeft: 2 },
    { name: 'Estrela Mangalarga', progress: 88, dueDate: '25/11/2024', daysLeft: 7 },
    { name: 'Lua Dourada', progress: 75, dueDate: '05/12/2024', daysLeft: 17 },
  ];

  const recentActivities = [
    { title: 'Nascimento registrado', animal: 'Potro de Sol Nascente', time: '2 horas atrás', type: 'birth' },
    { title: 'Ocorrência reportada', animal: 'Vento Sul', time: '5 horas atrás', type: 'alert' },
    { title: 'Atividade registrada', animal: 'Casqueamento - 8 animais', time: '1 dia atrás', type: 'activity' },
  ];

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl text-foreground dark:text-white mb-1">Olá, João!</h2>
        <p className="text-muted-foreground dark:text-[#99a1af]">Aqui está seu resumo de hoje</p>
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
            <button
              onClick={() => setPendingSync(0)}
              className="text-sm text-primary dark:text-white hover:underline"
            >
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

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg text-foreground dark:text-white mb-3">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton
            icon={Plus}
            label="Registrar Nascimento"
            color="bg-pink-500"
          />
          <QuickActionButton
            icon={AlertCircle}
            label="Registrar Ocorrência"
            color="bg-red-500"
          />
          <QuickActionButton
            icon={Calendar}
            label="Atividades"
            color="bg-blue-500"
          />
          <QuickActionButton
            icon={RefreshCw}
            label="Sincronizar"
            color="bg-green-500"
            onClick={() => setPendingSync(0)}
          />
        </div>
      </div>

      {/* Upcoming Births */}
      <div>
        <h3 className="text-lg text-foreground dark:text-white mb-3">Próximos Partos</h3>
        <div className="space-y-3">
          {upcomingBirths.map((mare, idx) => (
            <div
              key={idx}
              className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-foreground dark:text-white">{mare.name}</p>
                <span className={`text-sm px-2 py-1 rounded ${
                  mare.daysLeft <= 3 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                }`}>
                  {mare.daysLeft} dias
                </span>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-[#99a1af] mb-1">
                  <span>Progresso</span>
                  <span>{mare.progress}%</span>
                </div>
                <div className="w-full bg-muted dark:bg-[#0d0d0d] rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      mare.progress >= 80 ? 'bg-green-500' :
                      mare.progress >= 50 ? 'bg-blue-500' :
                      mare.progress >= 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${mare.progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Parto estimado: {mare.dueDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h3 className="text-lg text-foreground dark:text-white mb-3">Histórico de Atividades</h3>
        <div className="space-y-2">
          {recentActivities.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 bg-card dark:bg-[#1a1a1a] rounded-lg border border-border dark:border-[rgba(255,255,255,0.1)]"
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'birth' ? 'bg-pink-500' :
                activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-foreground dark:text-white mb-1">{activity.title}</p>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">{activity.animal}</p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, color, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 bg-card dark:bg-[#1a1a1a] rounded-xl border border-border dark:border-[rgba(255,255,255,0.1)] hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
    >
      <div className={`${color} p-3 rounded-full`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm text-center text-foreground dark:text-white">{label}</span>
    </button>
  );
}
