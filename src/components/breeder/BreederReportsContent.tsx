import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface AnimalReport {
  animal: string;
  receita: string;
  custo: string;
  lucro: string;
}

interface BreederReportsContentProps {
  onBack: () => void;
}

export function BreederReportsContent({ onBack }: BreederReportsContentProps) {
  const animalReports: AnimalReport[] = [
    { animal: 'Relâmpago', receita: 'R$ 15.000,00', custo: 'R$ 8.000,00', lucro: 'R$ 7.000,00' },
    { animal: 'Trovão', receita: 'R$ 12.500,00', custo: 'R$ 6.500,00', lucro: 'R$ 6.000,00' },
    { animal: 'Estrela', receita: 'R$ 10.000,00', custo: 'R$ 5.000,00', lucro: 'R$ 5.000,00' },
    { animal: 'Lua', receita: 'R$ 8.000,00', custo: 'R$ 4.200,00', lucro: 'R$ 3.800,00' },
    { animal: 'Íris', receita: 'R$ 9.500,00', custo: 'R$ 4.800,00', lucro: 'R$ 4.700,00' },
    { animal: 'Sol', receita: 'R$ 11.200,00', custo: 'R$ 5.500,00', lucro: 'R$ 5.700,00' },
  ];

  const categoryData = [
    { name: 'Alimentação', valor: 12 },
    { name: 'Veterinário', valor: 15 },
    { name: 'Medicamentos', valor: 13 },
    { name: 'Folha de Pagamento', valor: 10 },
    { name: 'Serviços', valor: 13 },
    { name: 'Manutenção', valor: 16 },
  ];

  const cashFlowData = [
    { name: 'Jan', valor: 5 },
    { name: 'Fev', valor: 12 },
    { name: 'Mar', valor: 8 },
    { name: 'Abr', valor: 15 },
    { name: 'Mai', valor: 7 },
    { name: 'Jun', valor: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs e Botão Voltar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground dark:text-[#99a1af]">Financeiro</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
          <span className="text-foreground dark:text-white">Relatórios</span>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      {/* Header */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h1 className="text-2xl text-foreground dark:text-white">Relatórios Financeiros</h1>
        <p className="text-muted-foreground dark:text-[#99a1af] mt-2">
          Visualize e analise os dados financeiros do seu haras
        </p>
      </div>

      {/* Relatório de Custo-Benefício por Animal */}
      <div className="space-y-4">
        <h2 className="text-xl text-foreground dark:text-white">Relatório de Custo-Benefício por Animal</h2>
        
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          {/* Header da Tabela */}
          <div className="grid grid-cols-4 gap-4 px-4 mb-4">
            <p className="text-foreground dark:text-white">Animal</p>
            <p className="text-foreground dark:text-white">Receita Total</p>
            <p className="text-foreground dark:text-white">Custo Total</p>
            <p className="text-foreground dark:text-white">Lucro/Prejuízo</p>
          </div>

          {/* Linhas da Tabela */}
          <div className="space-y-4">
            {animalReports.map((report, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center bg-muted dark:bg-[#3a3a3a] rounded-lg px-4 py-2"
              >
                <p className="text-sm text-foreground dark:text-white">{report.animal}</p>
                <p className="text-sm text-foreground dark:text-white">{report.receita}</p>
                <p className="text-sm text-foreground dark:text-white">{report.custo}</p>
                <p className="text-sm text-foreground dark:text-white">{report.lucro}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relatório por Categoria */}
      <div className="space-y-4">
        <h2 className="text-xl text-foreground dark:text-white">Relatório por Categoria</h2>
        
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-foreground dark:text-white mb-6">Total de Gastos por Categoria</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis 
                dataKey="name" 
                stroke="#6b6b6b"
                tick={{ fill: '#6b6b6b', fontSize: 14 }}
              />
              <YAxis 
                stroke="#6b6b6b"
                tick={{ fill: '#6b6b6b', fontSize: 14 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #3a3a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="valor" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Relatório de Fluxo de Caixa */}
      <div className="space-y-4">
        <h2 className="text-xl text-foreground dark:text-white">Relatório de Fluxo de Caixa</h2>
        
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-foreground dark:text-white mb-6">Evolução de Receitas e Despesas</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis 
                dataKey="name" 
                stroke="#6b6b6b"
                tick={{ fill: '#9eb8a8', fontSize: 13 }}
              />
              <YAxis 
                stroke="#6b6b6b"
                tick={{ fill: '#6b6b6b', fontSize: 13 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1a1a', 
                  border: '1px solid #3a3a3a',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="valor" 
                stroke="#2472bc" 
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}