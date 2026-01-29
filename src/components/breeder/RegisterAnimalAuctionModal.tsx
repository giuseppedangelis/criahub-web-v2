import { X, Search, Plus, Check, Calendar, MapPin, DollarSign, AlertCircle, Upload, FileText } from 'lucide-react';
import { useState } from 'react';

interface Animal {
  id: string;
  name: string;
  registry: string;
  gender: 'macho' | 'femea';
  age: number;
  photo?: string;
}

interface Auction {
  id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
}

interface RegisterAnimalAuctionModalProps {
  onClose: () => void;
  onRegister: (data: any) => void;
}

export function RegisterAnimalAuctionModal({ onClose, onRegister }: RegisterAnimalAuctionModalProps) {
  const [step, setStep] = useState<'auction' | 'animals' | 'pricing' | 'confirmation'>('auction');
  const [selectedAuction, setSelectedAuction] = useState<string>('');
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [pricingData, setPricingData] = useState<{ [key: string]: { reservePrice: string; estimatedPrice: string; description: string } }>({});
  const [attachments, setAttachments] = useState<any[]>([]);

  const auctions: Auction[] = [
    { id: '1', name: 'Grande Leilão Virtual Mangalarga Marchador', date: '2025-04-15', location: 'Online', organizer: 'Leilões BH' },
    { id: '2', name: 'Leilão Elite do Haras Santa Clara', date: '2025-03-22', location: 'Haras Santa Clara, Varginha/MG', organizer: 'Haras Santa Clara' },
    { id: '3', name: 'Mega Leilão ABCCMM 2025', date: '2025-05-10', location: 'Parque de Exposições, BH/MG', organizer: 'ABCCMM' },
  ];

  const animals: Animal[] = [
    { id: '1', name: 'Estrela da Manhã', registry: '123456', gender: 'femea', age: 5 },
    { id: '2', name: 'Trovão Negro', registry: '123457', gender: 'macho', age: 7 },
    { id: '3', name: 'Lua Cheia', registry: '123458', gender: 'femea', age: 4 },
    { id: '4', name: 'Sol Nascente', registry: '123459', gender: 'macho', age: 3 },
    { id: '5', name: 'Bella Vista', registry: '123460', gender: 'femea', age: 6 },
    { id: '6', name: 'Imperador', registry: '123461', gender: 'macho', age: 8 },
  ];

  const toggleAnimal = (animalId: string) => {
    if (selectedAnimals.includes(animalId)) {
      setSelectedAnimals(selectedAnimals.filter(id => id !== animalId));
      const newPricing = { ...pricingData };
      delete newPricing[animalId];
      setPricingData(newPricing);
    } else {
      setSelectedAnimals([...selectedAnimals, animalId]);
      setPricingData({
        ...pricingData,
        [animalId]: { reservePrice: '', estimatedPrice: '', description: '' }
      });
    }
  };

  const updatePricing = (animalId: string, field: string, value: string) => {
    setPricingData({
      ...pricingData,
      [animalId]: {
        ...pricingData[animalId],
        [field]: value
      }
    });
  };

  const handleNext = () => {
    if (step === 'auction' && selectedAuction) setStep('animals');
    else if (step === 'animals' && selectedAnimals.length > 0) setStep('pricing');
    else if (step === 'pricing') setStep('confirmation');
  };

  const handleConfirm = () => {
    const data = {
      auctionId: selectedAuction,
      animals: selectedAnimals.map(id => ({
        id,
        ...pricingData[id]
      })),
      attachments,
    };
    onRegister(data);
    onClose();
  };

  const selectedAuctionData = auctions.find(a => a.id === selectedAuction);
  const selectedAnimalsData = animals.filter(a => selectedAnimals.includes(a.id));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Imagem' : 'Arquivo',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-[rgba(255,255,255,0.1)] sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
          <div>
            <h3 className="text-2xl text-foreground dark:text-white mb-1">
              Registrar Animal no Leilão
            </h3>
            <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
              {step === 'auction' && 'Passo 1 de 4: Selecione o leilão'}
              {step === 'animals' && 'Passo 2 de 4: Selecione os animais'}
              {step === 'pricing' && 'Passo 3 de 4: Defina preços e descrições'}
              {step === 'confirmation' && 'Passo 4 de 4: Confirme os dados'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-foreground dark:text-white" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {['auction', 'animals', 'pricing', 'confirmation'].map((s, idx) => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`flex-1 h-1 rounded-full ${
                  step === s ? 'bg-white dark:bg-white' : 
                  ['auction', 'animals', 'pricing', 'confirmation'].indexOf(step) > idx ? 'bg-emerald-500' : 
                  'bg-muted dark:bg-[#3a3a3a]'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Passo 1: Selecionar Leilão */}
          {step === 'auction' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-3">
                  Selecione o Leilão
                </label>
                <div className="space-y-3">
                  {auctions.map((auction) => (
                    <button
                      key={auction.id}
                      onClick={() => setSelectedAuction(auction.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedAuction === auction.id
                          ? 'border-white dark:border-white bg-muted dark:bg-[#0d0d0d]'
                          : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="text-foreground dark:text-white font-medium mb-2">
                            {auction.name}
                          </h4>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground dark:text-[#99a1af]">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {auction.date.split('-').reverse().join('/')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {auction.location}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-2">
                            Organizador: {auction.organizer}
                          </p>
                        </div>
                        {selectedAuction === auction.id && (
                          <div className="w-6 h-6 bg-white dark:bg-white rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-[#1a1a1a]" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Passo 2: Selecionar Animais */}
          {step === 'animals' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-3">
                  Selecione os Animais ({selectedAnimals.length} selecionado{selectedAnimals.length !== 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {animals.map((animal) => (
                    <button
                      key={animal.id}
                      onClick={() => toggleAnimal(animal.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedAnimals.includes(animal.id)
                          ? 'border-white dark:border-white bg-muted dark:bg-[#0d0d0d]'
                          : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="relative">
                        {/* Foto do Animal (Placeholder) */}
                        <div className="w-full aspect-square bg-muted dark:bg-[#3a3a3a] rounded-lg mb-3 flex items-center justify-center">
                          <div className="w-12 h-12 bg-[#6b7280] rounded-full" />
                        </div>
                        
                        {selectedAnimals.includes(animal.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white dark:bg-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-[#1a1a1a]" />
                          </div>
                        )}
                      </div>
                      
                      <h5 className="text-sm font-medium text-foreground dark:text-white mb-1">
                        {animal.name}
                      </h5>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">
                        Reg: {animal.registry}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                        {animal.age} anos • {animal.gender === 'macho' ? 'Macho' : 'Fêmea'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Passo 3: Precificação */}
          {step === 'pricing' && (
            <div className="space-y-6">
              {selectedAnimalsData.map((animal) => (
                <div key={animal.id} className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-5 border border-border dark:border-[rgba(255,255,255,0.1)]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#6b7280] rounded-lg" />
                    <div>
                      <h5 className="text-foreground dark:text-white font-medium">{animal.name}</h5>
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Reg: {animal.registry}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Preço de Reserva e Estimado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                          Preço de Reserva (Mínimo) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                          <input
                            type="text"
                            value={pricingData[animal.id]?.reservePrice || ''}
                            onChange={(e) => updatePricing(animal.id, 'reservePrice', e.target.value)}
                            placeholder="Ex: 50.000"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                          Preço Estimado
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                          <input
                            type="text"
                            value={pricingData[animal.id]?.estimatedPrice || ''}
                            onChange={(e) => updatePricing(animal.id, 'estimatedPrice', e.target.value)}
                            placeholder="Ex: 80.000"
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Descrição para o Catálogo */}
                    <div>
                      <label className="block text-sm font-medium text-foreground dark:text-white mb-2">
                        Descrição para o Catálogo
                      </label>
                      <textarea
                        value={pricingData[animal.id]?.description || ''}
                        onChange={(e) => updatePricing(animal.id, 'description', e.target.value)}
                        rows={3}
                        placeholder="Destaque as qualidades do animal, linhagem, premiações, aptidões..."
                        className="w-full px-4 py-3 bg-white dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload de Documentos */}
              <div>
                <label className="block text-sm font-medium text-foreground dark:text-white mb-3">
                  Documentos (Opcional)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors mb-3">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground dark:text-[#99a1af]" />
                    <p className="text-sm text-foreground dark:text-white mb-1">Clique ou arraste arquivos aqui</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Registros, exames, fotos, vídeos (máx. 10MB cada)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.mp4"
                    onChange={handleFileUpload}
                  />
                </label>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="bg-muted dark:bg-[#0d0d0d] rounded-lg p-3 flex items-center justify-between border border-border dark:border-[rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground dark:text-[#99a1af]" />
                          <div>
                            <p className="text-sm text-foreground dark:text-white">{file.name}</p>
                            <p className="text-xs text-muted-foreground dark:text-[#99a1af]">{file.type} • {file.size}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeAttachment(idx)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Passo 4: Confirmação */}
          {step === 'confirmation' && selectedAuctionData && (
            <div className="space-y-6">
              <div className="bg-muted dark:bg-[#0d0d0d] rounded-xl p-4 border border-border dark:border-[rgba(255,255,255,0.1)]">
                <h4 className="text-sm font-medium text-foreground dark:text-white mb-3">
                  Resumo do Registro
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-1">Leilão</p>
                    <p className="text-sm text-foreground dark:text-white">{selectedAuctionData.name}</p>
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af]">
                      {selectedAuctionData.date.split('-').reverse().join('/')} • {selectedAuctionData.location}
                    </p>
                  </div>

                  <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-3">
                    <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">
                      Animais Registrados ({selectedAnimalsData.length})
                    </p>
                    <div className="space-y-3">
                      {selectedAnimalsData.map((animal) => (
                        <div key={animal.id} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm font-medium text-foreground dark:text-white">{animal.name}</p>
                              <p className="text-xs text-muted-foreground dark:text-[#99a1af]">Reg: {animal.registry}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground dark:text-[#99a1af]">Preço Reserva</p>
                              <p className="text-foreground dark:text-white font-medium">
                                {pricingData[animal.id]?.reservePrice ? `R$ ${pricingData[animal.id].reservePrice}` : '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground dark:text-[#99a1af]">Preço Estimado</p>
                              <p className="text-foreground dark:text-white font-medium">
                                {pricingData[animal.id]?.estimatedPrice ? `R$ ${pricingData[animal.id].estimatedPrice}` : '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="border-t border-border dark:border-[rgba(255,255,255,0.1)] pt-3">
                      <p className="text-xs text-muted-foreground dark:text-[#99a1af] mb-2">
                        Documentos Anexados ({attachments.length})
                      </p>
                      <div className="space-y-1.5">
                        {attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <FileText className="w-3 h-3 text-muted-foreground dark:text-[#99a1af]" />
                            <span className="text-foreground dark:text-white">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                      Confirmação de Registro
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Ao confirmar, os animais serão registrados no leilão. O organizador entrará em contato para finalizar os detalhes contratuais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#1a1a1a] border-t border-border dark:border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex gap-3">
            {step !== 'auction' && (
              <button
                onClick={() => {
                  if (step === 'animals') setStep('auction');
                  else if (step === 'pricing') setStep('animals');
                  else if (step === 'confirmation') setStep('pricing');
                }}
                className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 border border-border dark:border-[#333333] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={step === 'confirmation' ? handleConfirm : handleNext}
              disabled={
                (step === 'auction' && !selectedAuction) ||
                (step === 'animals' && selectedAnimals.length === 0)
              }
              className="flex-1 px-6 py-3 bg-white dark:bg-white text-[#1a1a1a] rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 'confirmation' ? 'Confirmar Registro' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}