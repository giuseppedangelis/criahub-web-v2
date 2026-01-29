import { X, FileText, Download, Eye, Calendar, DollarSign, Users, Check } from 'lucide-react';
import { useState } from 'react';

interface Animal {
  name: string;
  registry: string;
  gender: 'macho' | 'femea';
  birthDate: string;
  pelagem: string;
}

interface GenerateContractModalProps {
  animal?: Animal;
  onClose: () => void;
  onGenerate: (data: any) => void;
}

export function GenerateContractModal({ animal, onClose, onGenerate }: GenerateContractModalProps) {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState({
    // Animal
    animalName: animal?.name || '',
    animalRegistry: animal?.registry || '',
    animalGender: animal?.gender || '',
    animalBirthDate: animal?.birthDate || '',
    animalCoat: animal?.pelagem || '',
    
    // Vendedor (auto-preenchido com dados do haras)
    sellerName: 'Haras Exemplo',
    sellerDocument: '12.345.678/0001-00',
    sellerAddress: 'Rua das Fazendas, 123',
    sellerCity: 'Belo Horizonte',
    sellerState: 'MG',
    sellerPhone: '(31) 98765-4321',
    
    // Comprador
    buyerName: '',
    buyerDocument: '',
    buyerAddress: '',
    buyerCity: '',
    buyerState: '',
    buyerPhone: '',
    buyerEmail: '',
    
    // Valores
    salePrice: '',
    paymentMethod: 'transferencia',
    installments: '1',
    downPayment: '',
    
    // Condições
    saleDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    warrantyPeriod: '30',
    observations: '',
  });

  const handleGenerate = () => {
    onGenerate(formData);
  };

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/\D/g, '')) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-2xl text-foreground dark:text-white mb-1">
              {step === 'form' ? 'Gerar Contrato de Venda' : 'Visualizar Contrato'}
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {step === 'form' ? 'Preencha os dados para gerar o contrato' : 'Revise o contrato antes de gerar'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-6">
              {/* Dados do Animal */}
              <div>
                <h4 className="text-lg text-foreground dark:text-white font-medium mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dados do Animal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={formData.animalName}
                      onChange={(e) => setFormData({ ...formData, animalName: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Registro ABCCMM *
                    </label>
                    <input
                      type="text"
                      value={formData.animalRegistry}
                      onChange={(e) => setFormData({ ...formData, animalRegistry: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Sexo *
                    </label>
                    <select
                      value={formData.animalGender}
                      onChange={(e) => setFormData({ ...formData, animalGender: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    >
                      <option value="">Selecione</option>
                      <option value="macho">Macho</option>
                      <option value="femea">Fêmea</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      value={formData.animalBirthDate}
                      onChange={(e) => setFormData({ ...formData, animalBirthDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Comprador */}
              <div>
                <h4 className="text-lg text-foreground dark:text-white font-medium mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Dados do Comprador
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Nome Completo / Razão Social *
                    </label>
                    <input
                      type="text"
                      value={formData.buyerName}
                      onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                      placeholder="Ex: João Silva ou Haras Exemplo Ltda"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      CPF / CNPJ *
                    </label>
                    <input
                      type="text"
                      value={formData.buyerDocument}
                      onChange={(e) => setFormData({ ...formData, buyerDocument: e.target.value })}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Endereço Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.buyerAddress}
                      onChange={(e) => setFormData({ ...formData, buyerAddress: e.target.value })}
                      placeholder="Rua, número, bairro"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={formData.buyerCity}
                      onChange={(e) => setFormData({ ...formData, buyerCity: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Estado *
                    </label>
                    <select
                      value={formData.buyerState}
                      onChange={(e) => setFormData({ ...formData, buyerState: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    >
                      <option value="">Selecione</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="ES">Espírito Santo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.buyerPhone}
                      onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.buyerEmail}
                      onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                  </div>
                </div>
              </div>

              {/* Valores e Pagamento */}
              <div>
                <h4 className="text-lg text-foreground dark:text-white font-medium mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Valores e Pagamento
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Valor da Venda *
                    </label>
                    <input
                      type="text"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      placeholder="R$ 0,00"
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Forma de Pagamento *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    >
                      <option value="dinheiro">Dinheiro</option>
                      <option value="transferencia">Transferência Bancária</option>
                      <option value="parcelado">Parcelado</option>
                      <option value="permuta">Permuta</option>
                    </select>
                  </div>
                  {formData.paymentMethod === 'parcelado' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                          Número de Parcelas
                        </label>
                        <input
                          type="number"
                          value={formData.installments}
                          onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                          min="1"
                          className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                          Entrada (Opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.downPayment}
                          onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                          placeholder="R$ 0,00"
                          className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Condições */}
              <div>
                <h4 className="text-lg text-foreground dark:text-white font-medium mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Condições e Prazos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Data da Venda *
                    </label>
                    <input
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Data de Entrega
                    </label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                      Garantia (dias)
                    </label>
                    <input
                      type="number"
                      value={formData.warrantyPeriod}
                      onChange={(e) => setFormData({ ...formData, warrantyPeriod: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                  Observações / Cláusulas Adicionais
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={4}
                  placeholder="Adicione condições especiais, cláusulas ou observações relevantes..."
                  className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] resize-none"
                />
              </div>
            </div>
          )}

          {step === 'preview' && (
            <ContractPreview formData={formData} formatCurrency={formatCurrency} />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            {step === 'form' ? (
              <button
                onClick={() => setStep('preview')}
                className="flex-1 px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Visualizar Contrato
              </button>
            ) : (
              <>
                <button
                  onClick={() => setStep('form')}
                  className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Gerar e Baixar PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractPreview({ formData, formatCurrency }: any) {
  return (
    <div className="bg-white dark:bg-[#0d0d0d] rounded-xl p-8 border border-border dark:border-[rgba(255,255,255,0.1)] max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2">
          CONTRATO PARTICULAR DE COMPRA E VENDA DE ANIMAL
        </h2>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          Mangalarga Marchador
        </p>
      </div>

      <div className="space-y-6 text-sm text-foreground dark:text-white">
        <p>
          Pelo presente instrumento particular de compra e venda, de um lado, como <strong>VENDEDOR</strong>:
        </p>

        <div className="bg-muted dark:bg-[#1a1a1a] rounded-lg p-4">
          <p><strong>{formData.sellerName}</strong>, inscrito no CNPJ sob nº {formData.sellerDocument}, com sede em {formData.sellerAddress}, {formData.sellerCity}/{formData.sellerState}, telefone {formData.sellerPhone}.</p>
        </div>

        <p>
          E de outro lado, como <strong>COMPRADOR</strong>:
        </p>

        <div className="bg-muted dark:bg-[#1a1a1a] rounded-lg p-4">
          <p><strong>{formData.buyerName}</strong>, portador do CPF/CNPJ nº {formData.buyerDocument}, residente/sediado em {formData.buyerAddress}, {formData.buyerCity}/{formData.buyerState}, telefone {formData.buyerPhone}.</p>
        </div>

        <p>
          Têm entre si justo e contratado o seguinte:
        </p>

        <h3 className="font-bold text-lg">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
        <p>
          O VENDEDOR vende ao COMPRADOR, livre e desembaraçado de quaisquer ônus, o seguinte animal:
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
          <ul className="space-y-2">
            <li><strong>Nome:</strong> {formData.animalName}</li>
            <li><strong>Registro ABCCMM:</strong> {formData.animalRegistry}</li>
            <li><strong>Sexo:</strong> {formData.animalGender === 'macho' ? 'Macho' : 'Fêmea'}</li>
            <li><strong>Data de Nascimento:</strong> {formData.animalBirthDate.split('-').reverse().join('/')}</li>
            <li><strong>Pelagem:</strong> {formData.animalCoat}</li>
          </ul>
        </div>

        <h3 className="font-bold text-lg">CLÁUSULA SEGUNDA - DO PREÇO</h3>
        <p>
          O valor total da venda é de <strong>{formatCurrency(formData.salePrice)}</strong> ({/* Valor por extenso */}), que será pago da seguinte forma: <strong>{formData.paymentMethod === 'dinheiro' ? 'À vista em dinheiro' : formData.paymentMethod === 'transferencia' ? 'Transferência bancária' : formData.paymentMethod === 'parcelado' ? `Parcelado em ${formData.installments}x` : 'Permuta'}</strong>.
        </p>

        {formData.paymentMethod === 'parcelado' && formData.downPayment && (
          <p>
            Sendo <strong>{formatCurrency(formData.downPayment)}</strong> de entrada e o restante parcelado em {formData.installments} vezes.
          </p>
        )}

        <h3 className="font-bold text-lg">CLÁUSULA TERCEIRA - DA ENTREGA</h3>
        <p>
          O animal será entregue ao COMPRADOR na data de {formData.deliveryDate ? formData.deliveryDate.split('-').reverse().join('/') : 'imediata após assinatura deste contrato'}, ficando por conta do {formData.deliveryDate ? 'VENDEDOR' : 'COMPRADOR'} as despesas de transporte.
        </p>

        <h3 className="font-bold text-lg">CLÁUSULA QUARTA - DA GARANTIA</h3>
        <p>
          O VENDEDOR garante que o animal encontra-se em perfeitas condições de saúde, livre de vícios e doenças. O período de garantia sanitária é de <strong>{formData.warrantyPeriod} dias</strong> a contar da data de entrega.
        </p>

        <h3 className="font-bold text-lg">CLÁUSULA QUINTA - DA TRANSFERÊNCIA</h3>
        <p>
          O VENDEDOR se compromete a providenciar, junto à ABCCMM, a transferência definitiva do registro do animal para o COMPRADOR, arcando com todas as despesas necessárias.
        </p>

        {formData.observations && (
          <>
            <h3 className="font-bold text-lg">CLÁUSULA SEXTA - DISPOSIÇÕES GERAIS</h3>
            <p className="whitespace-pre-line">{formData.observations}</p>
          </>
        )}

        <p>
          E por estarem assim justos e contratados, assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.
        </p>

        <div className="mt-12 space-y-8">
          <div>
            <p className="text-center mb-8">{formData.sellerCity}/{formData.sellerState}, {formData.saleDate.split('-').reverse().join('/')}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-foreground dark:border-white pt-2 mt-16">
                <p className="font-bold">VENDEDOR</p>
                <p className="text-xs">{formData.sellerName}</p>
                <p className="text-xs">{formData.sellerDocument}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="border-t border-foreground dark:border-white pt-2 mt-16">
                <p className="font-bold">COMPRADOR</p>
                <p className="text-xs">{formData.buyerName}</p>
                <p className="text-xs">{formData.buyerDocument}</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-center font-bold mb-4">TESTEMUNHAS:</p>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-t border-foreground dark:border-white pt-2 mt-16">
                  <p className="text-xs">Nome:</p>
                  <p className="text-xs">CPF:</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-foreground dark:border-white pt-2 mt-16">
                  <p className="text-xs">Nome:</p>
                  <p className="text-xs">CPF:</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
