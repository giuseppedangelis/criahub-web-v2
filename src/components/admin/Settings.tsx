import { Plug, Shield, Settings2, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useTheme } from '../../contexts/ThemeContext';

export function Settings() {
  const { theme } = useTheme();
  
  const sections = [
    {
      title: 'Integrações Externas',
      icon: Plug,
      items: [
        { label: 'Conexão ABCCMM', value: 'Ativa', action: () => alert('Configurar ABCCMM') },
        { label: 'Gateway de Pagamento', value: 'Stripe conectado', action: () => alert('Configurar pagamento') },
        { label: 'Notificações por E-mail', value: 'SendGrid', action: () => alert('Configurar e-mail') },
      ],
    },
    {
      title: 'Gestão de Permissões',
      icon: Shield,
      items: [
        { label: 'Super Admin', value: 'Admin (você)', action: () => alert('Editar permissões') },
        { label: 'Suporte Técnico', value: '2 ativos', action: () => alert('Gerenciar suporte') },
      ],
    },
    {
      title: 'Configurações da Plataforma',
      icon: Settings2,
      items: [
        { label: 'Período de Trial', value: '14 dias', action: () => alert('Alterar período') },
        { label: 'Limite Padrão de Mídias', value: '5GB por haras', action: () => alert('Ajustar limites') },
      ],
    },
    {
      title: 'Notificações & Monitoramento',
      icon: Bell,
      items: [
        { label: 'Alertas Críticos', value: 'E-mail ativo', action: () => alert('Configurar alertas') },
        { label: 'Relatórios Semanais', value: 'Habilitado', action: () => alert('Configurar relatórios') },
      ],
    },
  ];

  return (
    <div className={`p-8 min-h-full transition-colors ${
      theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-gray-50'
    }`}>
      <div className="mb-8">
        <h1 className={theme === 'dark' ? 'text-white mb-2' : 'text-gray-900 mb-2'}>
          Configurações do Sistema
        </h1>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Gerencie integrações, permissões e parâmetros da plataforma
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-900" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-gray-900">{item.label}</p>
                          <p className="text-gray-500">{item.value}</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={item.action}
                          className="text-gray-900 border-gray-900 hover:bg-gray-50"
                        >
                          Configurar
                        </Button>
                      </div>
                      {itemIndex < section.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 mb-1">Versão da Plataforma</p>
              <p className="text-gray-900">v1.0.0</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Última Atualização</p>
              <p className="text-gray-900">2 de setembro de 2025</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Ambiente</p>
              <p className="text-gray-900">Produção</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}