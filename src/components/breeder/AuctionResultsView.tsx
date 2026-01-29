import { DollarSign, TrendingUp, Award, ArrowLeft, Calendar, MapPin, Gavel, Users, FileText, Download } from 'lucide-react';
import { useState } from 'react';

interface AnimalResult {
  id: string;
  name: string;
  registry: string;
  lotNumber: number;
  reservePrice: number;
  soldPrice?: number;
  buyerName?: string;
  buyerCity?: string;
  sold: boolean;
  commission?: number;
  netValue?: number;
}

interface AuctionResultsViewProps {
  auctionId: string;
  auctionName: string;
  auctionDate: string;
  auctionLocation: string;
  onBack: () => void;
}

export function AuctionResultsView({ auctionId, auctionName, auctionDate, auctionLocation, onBack }: AuctionResultsViewProps) {
  const results: AnimalResult[] = [
    {
      id: '1',
      name: 'Estrela da Manhã',
      registry: '123456',
      lotNumber: 45,
      reservePrice: 50000,
      soldPrice: 75000,
      buyerName: 'João Silva',
      buyerCity: 'Pouso Alegre/MG',
      sold: true,
      commission: 3750,
      netValue: 71250,
    },
    {
      id: '2',
      name: 'Trovão Negro',
      registry: '123457',
      lotNumber: 67,
      reservePrice: 60000,
      soldPrice: 85000,
      buyerName: 'Haras Santa Rita',
      buyerCity: 'Varginha/MG',
      sold: true,
      commission: 4250,
      netValue: 80750,
    },
    {
      id: '3',
      name: 'Lua Cheia',
      registry: '123458',
      lotNumber: 89,
      reservePrice: 45000,
      sold: false,
    },
  ];

  const totalSold = results.filter(r => r.sold).length;
  const totalRevenue = results.reduce((sum, r) => sum + (r.soldPrice || 0), 0);
  const totalCommission = results.reduce((sum, r) => sum + (r.commission || 0), 0);
  const totalNet = results.reduce((sum, r) => sum + (r.netValue || 0), 0);
  const avgPrice = totalSold > 0 ? totalRevenue / totalSold : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground dark:text-white" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl text-foreground dark:text-white mb-1">{auctionName}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground dark:text-[#99a1af]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {auctionDate.split('-').reverse().join('/')}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {auctionLocation}
            </div>
          </div>
        </div>
        <button className="px-4 py-2 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Relatório
        </button>
      </div>

      {/* Estatísticas Financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Gavel className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground dark:text-white">{totalSold}/{results.length}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Vendidos</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground dark:text-white">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Receita Total</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground dark:text-white">{formatCurrency(avgPrice)}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Preço Médio</p>
            </div>
          </div>
        </div>

        <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground dark:text-white">{formatCurrency(totalNet)}</p>
              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Valor Líquido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <h3 className="text-lg text-foreground dark:text-white font-medium mb-4">
          Resumo Financeiro
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
            <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Receita Bruta</span>
            <span className="text-sm font-medium text-foreground dark:text-white">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border dark:border-[rgba(255,255,255,0.1)]">
            <span className="text-sm text-muted-foreground dark:text-[#99a1af]">Comissão do Leilão</span>
            <span className="text-sm font-medium text-red-500">- {formatCurrency(totalCommission)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-foreground dark:text-white font-medium">Valor Líquido</span>
            <span className="text-xl font-bold text-emerald-500">{formatCurrency(totalNet)}</span>
          </div>
        </div>
      </div>

      {/* Resultados por Animal */}
      <div>
        <h3 className="text-lg text-foreground dark:text-white font-medium mb-4">
          Resultados por Lote
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {results.map((result) => (
            <AnimalResultCard key={result.id} result={result} formatCurrency={formatCurrency} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AnimalResultCardProps {
  result: AnimalResult;
  formatCurrency: (value: number) => string;
}

function AnimalResultCard({ result, formatCurrency }: AnimalResultCardProps) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-muted dark:bg-[#3a3a3a] rounded-lg flex items-center justify-center">
            <div className="w-10 h-10 bg-[#6b7280] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg text-foreground dark:text-white font-medium">{result.name}</h4>
              <span className="px-2 py-0.5 bg-muted dark:bg-[#3a3a3a] text-muted-foreground dark:text-[#99a1af] rounded text-xs">
                Lote {result.lotNumber}
              </span>
            </div>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Reg: {result.registry}</p>
          </div>
        </div>
        <div>
          {result.sold ? (
            <span className="px-3 py-1 bg-emerald-500 text-white rounded-md text-xs font-medium">
              VENDIDO
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#6b7280] text-white rounded-md text-xs font-medium">
              NÃO VENDIDO
            </span>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Preço de Reserva</p>
          <p className="text-sm font-medium text-foreground dark:text-white">{formatCurrency(result.reservePrice)}</p>
        </div>

        {result.sold && result.soldPrice && (
          <>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Preço de Venda</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.soldPrice)}</p>
            </div>

            <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Comissão</p>
              <p className="text-sm font-medium text-red-500">- {formatCurrency(result.commission || 0)}</p>
            </div>

            <div className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3">
              <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Valor Líquido</p>
              <p className="text-sm font-bold text-foreground dark:text-white">{formatCurrency(result.netValue || 0)}</p>
            </div>
          </>
        )}
      </div>

      {/* Comprador */}
      {result.sold && result.buyerName && (
        <div className="mt-4 pt-4 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Comprador</p>
          </div>
          <p className="text-sm text-foreground dark:text-white font-medium">{result.buyerName}</p>
          {result.buyerCity && (
            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{result.buyerCity}</p>
          )}
        </div>
      )}

      {/* Valorização */}
      {result.sold && result.soldPrice && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground dark:text-[#99a1af]">Valorização</span>
            <span className="text-sm font-medium text-emerald-500">
              +{((result.soldPrice - result.reservePrice) / result.reservePrice * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted dark:bg-[#3a3a3a] rounded-full h-2 mt-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full"
              style={{ width: `${Math.min((result.soldPrice / result.reservePrice) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}