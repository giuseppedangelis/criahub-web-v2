import { ArrowLeft, CheckCircle, X, AlertTriangle, Calendar, MapPin, User, Baby, Image as ImageIcon, FileText, Eye, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { NativeSelect } from '../ui/native-select';
import { toast } from 'sonner';

interface PendingBirth {
  id: number;
  type: 'birth' | 'occurrence';
  status: 'pending' | 'approved' | 'rejected';
  
  // Dados do campo (vindo do peão)
  fieldData: {
    photo: string;
    motherName: string;
    motherId?: number;
    reportedDate: string;
    reportedBy: string;
    location: string;
    provisionalSex?: 'Macho' | 'Fêmea';
    observations?: string;
  };
  
  // Dados oficiais (preenchidos pelo assessor)
  officialData?: {
    officialName: string;
    suffix?: string;
    fatherId?: number;
    fatherName?: string;
    motherId?: number;
    motherName?: string;
    birthDate: string;
    sex: 'Macho' | 'Fêmea';
    observations?: string;
  };
}

interface PendingOccurrence {
  id: number;
  type: 'occurrence';
  status: 'pending' | 'approved' | 'rejected';
  
  fieldData: {
    photos: string[];
    animalName: string;
    animalId: number;
    occurrenceType: 'Doença' | 'Ferimento' | 'Comportamento' | 'Outro';
    severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    reportedDate: string;
    reportedBy: string;
    location: string;
    description: string;
  };
  
  officialResponse?: {
    diagnosis?: string;
    treatment?: string;
    veterinarian?: string;
    nextSteps?: string;
  };
}

type PendingItem = PendingBirth | PendingOccurrence;

interface AdvisorPendingValidationProps {
  onBack: () => void;
}

export function AdvisorPendingValidation({ onBack }: AdvisorPendingValidationProps) {
  const [filter, setFilter] = useState<'all' | 'birth' | 'occurrence'>('all');
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  
  // Formulário para validação de nascimento
  const [officialName, setOfficialName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [fatherId, setFatherId] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherId, setMotherId] = useState('');
  const [motherName, setMotherName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<'Macho' | 'Fêmea'>('Macho');
  const [observations, setObservations] = useState('');
  const [embryoOrigin, setEmbryoOrigin] = useState<'sociedade' | 'haras' | ''>('');
  const [embryoCode, setEmbryoCode] = useState('');

  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);

  const filteredItems = pendingItems.filter((item) => {
    if (filter === 'all') return item.status === 'pending';
    return item.type === filter && item.status === 'pending';
  });

  const handleSelectItem = (item: PendingItem) => {
    setSelectedItem(item);
    
    if (item.type === 'birth') {
      const birth = item as PendingBirth;
      setOfficialName('');
      setSuffix('');
      setFatherId('');
      setFatherName('');
      setMotherId(birth.fieldData.motherId?.toString() || '');
      setMotherName(birth.fieldData.motherName);
      setBirthDate(birth.fieldData.reportedDate.split('T')[0]);
      setSex(birth.fieldData.provisionalSex || 'Macho');
      setObservations(birth.fieldData.observations || '');
      setEmbryoOrigin('');
      setEmbryoCode('');
    }
  };

  const handleApprove = () => {
    if (!selectedItem) return;

    if (selectedItem.type === 'birth') {
      if (!officialName || !birthDate || !motherName) {
        toast.error('Preencha os campos obrigatórios: Nome Oficial, Data de Nascimento e Mãe');
        return;
      }

      // Atualizar o item como aprovado
      setPendingItems(pendingItems.map(item => 
        item.id === selectedItem.id 
          ? { ...item, status: 'approved' as const }
          : item
      ));

      toast.success('Nascimento validado e registrado com sucesso!');
      setSelectedItem(null);
    } else {
      // Aprovar ocorrência
      setPendingItems(pendingItems.map(item => 
        item.id === selectedItem.id 
          ? { ...item, status: 'approved' as const }
          : item
      ));

      toast.success('Ocorrência validada com sucesso!');
      setSelectedItem(null);
    }
  };

  const handleReject = () => {
    if (!selectedItem) return;

    setPendingItems(pendingItems.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: 'rejected' as const }
        : item
    ));

    toast.success('Registro rejeitado');
    setSelectedItem(null);
  };

  const pendingCount = pendingItems.filter(i => i.status === 'pending').length;
  const birthCount = pendingItems.filter(i => i.type === 'birth' && i.status === 'pending').length;
  const occurrenceCount = pendingItems.filter(i => i.type === 'occurrence' && i.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span 
              className="text-muted-foreground dark:text-[#99a1af] cursor-pointer hover:text-foreground dark:hover:text-white" 
              onClick={onBack}
            >
              Dashboard
            </span>
            <span className="text-muted-foreground dark:text-[#99a1af]">/</span>
            <span className="text-foreground dark:text-white">Validação de Pendências</span>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
        <div>
          <h1 className="text-2xl text-foreground dark:text-white mb-2">Validação de Registros de Campo</h1>
          <p className="text-muted-foreground dark:text-[#99a1af]">
            Aprove ou rejeite registros enviados pela equipe operacional
          </p>
        </div>
      </div>

      {/* Resumo e Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border transition-all text-left ${
            filter === 'all' 
              ? 'border-orange-500 dark:border-orange-600' 
              : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-orange-500/50 dark:hover:border-orange-600/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/10 dark:bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl text-foreground dark:text-white">{pendingCount}</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Total Pendente</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('birth')}
          className={`bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border transition-all text-left ${
            filter === 'birth' 
              ? 'border-pink-500 dark:border-pink-600' 
              : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-pink-500/50 dark:hover:border-pink-600/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-pink-500/10 dark:bg-pink-500/20 rounded-lg flex items-center justify-center">
              <Baby className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl text-foreground dark:text-white">{birthCount}</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Nascimentos</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilter('occurrence')}
          className={`bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border transition-all text-left ${
            filter === 'occurrence' 
              ? 'border-red-500 dark:border-red-600' 
              : 'border-border dark:border-[rgba(255,255,255,0.1)] hover:border-red-500/50 dark:hover:border-red-600/50'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl text-foreground dark:text-white">{occurrenceCount}</p>
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">Ocorrências</p>
            </div>
          </div>
        </button>
      </div>

      {/* Layout de Comparação "De/Para" */}
      {selectedItem ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda: Dados do Campo */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/10 dark:bg-gray-500/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg text-foreground dark:text-white">Dados do Campo</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Informações registradas pelo peão
                </p>
              </div>
            </div>

            {selectedItem.type === 'birth' ? (
              <>
                {/* Foto do Potro */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">Foto do Potro</p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <ImageWithFallback
                      src={(selectedItem as PendingBirth).fieldData.photo}
                      alt="Potro"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Mãe Indicada</p>
                    <p className="text-foreground dark:text-white">{(selectedItem as PendingBirth).fieldData.motherName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data do Registro</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-foreground dark:text-white">
                        {new Date((selectedItem as PendingBirth).fieldData.reportedDate).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Sexo Provisório</p>
                    <p className="text-foreground dark:text-white">
                      {(selectedItem as PendingBirth).fieldData.provisionalSex || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Localização</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-foreground dark:text-white">{(selectedItem as PendingBirth).fieldData.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Registrado Por</p>
                    <p className="text-foreground dark:text-white">{(selectedItem as PendingBirth).fieldData.reportedBy}</p>
                  </div>
                  {(selectedItem as PendingBirth).fieldData.observations && (
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Observações de Campo</p>
                      <p className="text-foreground dark:text-white">{(selectedItem as PendingBirth).fieldData.observations}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Ocorrência */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-2">Fotos</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(selectedItem as PendingOccurrence).fieldData.photos.map((photo, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-black">
                        <ImageWithFallback
                          src={photo}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Animal</p>
                    <p className="text-foreground dark:text-white">{(selectedItem as PendingOccurrence).fieldData.animalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Tipo de Ocorrência</p>
                    <p className="text-foreground dark:text-white">{(selectedItem as PendingOccurrence).fieldData.occurrenceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Gravidade</p>
                    <span className={`px-3 py-1 rounded-full text-xs inline-block ${
                      (selectedItem as PendingOccurrence).fieldData.severity === 'Crítica' ? 'bg-red-500 text-white' :
                      (selectedItem as PendingOccurrence).fieldData.severity === 'Alta' ? 'bg-orange-500 text-white' :
                      (selectedItem as PendingOccurrence).fieldData.severity === 'Média' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {(selectedItem as PendingOccurrence).fieldData.severity}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Descrição</p>
                    <p className="text-foreground dark:text-white">{(selectedItem as PendingOccurrence).fieldData.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Data do Registro</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-foreground dark:text-white">
                        {new Date((selectedItem as PendingOccurrence).fieldData.reportedDate).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Localização</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground dark:text-[#99a1af]" />
                      <p className="text-foreground dark:text-white">{(selectedItem as PendingOccurrence).fieldData.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-1">Registrado Por</p>
                    <p className="text-foreground dark:text-white">{(selectedItem as PendingOccurrence).fieldData.reportedBy}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Coluna Direita: Dados Oficiais */}
          <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg text-foreground dark:text-white">Validação Oficial</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Complete os dados para efetivar
                </p>
              </div>
            </div>

            {selectedItem.type === 'birth' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Nome Oficial do Potro <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={officialName}
                    onChange={(e) => setOfficialName(e.target.value)}
                    placeholder="Ex: Cometa da Estrela"
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Sufixo</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Ex: HVV, MM"
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Pai (Garanhão) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="Buscar garanhão..."
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                  <p className="text-xs text-muted-foreground dark:text-[#99a1af] mt-1">
                    Verificar caderno de cobrição para confirmar
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Origem do Embrião</label>
                  <NativeSelect
                    value={embryoOrigin}
                    onChange={(e) => setEmbryoOrigin(e.target.value as 'sociedade' | 'haras' | '')}
                  >
                    <option value="">Não informado</option>
                    <option value="sociedade">Veio de sociedade</option>
                    <option value="haras">Feito no haras</option>
                  </NativeSelect>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Identificação do Embrião</label>
                  <input
                    type="text"
                    value={embryoCode}
                    onChange={(e) => setEmbryoCode(e.target.value)}
                    placeholder="Ex: Embrião #A12"
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Mãe (Égua) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20"
                  />
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">
                    Sexo Confirmado <span className="text-red-500">*</span>
                  </label>
                  <NativeSelect
                    value={sex}
                    onChange={(e) => setSex(e.target.value as 'Macho' | 'Fêmea')}
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </NativeSelect>
                </div>

                <div>
                  <label className="block text-sm text-foreground dark:text-white mb-2">Observações Oficiais</label>
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                    placeholder="Adicione observações técnicas..."
                    className="w-full px-4 py-3 bg-background dark:bg-[#0d0d0d] border border-border dark:border-[#3a3a3a] rounded-xl text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/20 resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-500/10 dark:bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                  <p className="text-sm text-foreground dark:text-white">
                    Esta ocorrência requer atenção. Revise os dados e tome as medidas necessárias antes de aprovar.
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                  Para aprovar esta ocorrência, confirme que as ações necessárias foram tomadas ou programadas.
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-border dark:border-[rgba(255,255,255,0.1)]">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-transparent border border-red-500/50 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Rejeitar
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Aprovar e Efetivar
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Lista de Pendências */
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl border border-border dark:border-[rgba(255,255,255,0.1)] overflow-hidden">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-green-500/10 dark:bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg text-foreground dark:text-white mb-2">Nenhuma pendência encontrada</h3>
              <p className="text-muted-foreground dark:text-[#99a1af]">
                Todos os registros foram validados ou não há itens para este filtro.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border dark:divide-[rgba(255,255,255,0.1)]">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="p-6 hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors cursor-pointer"
                >
                  {item.type === 'birth' ? (
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0">
                        <ImageWithFallback
                          src={(item as PendingBirth).fieldData.photo}
                          alt="Potro"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-full text-xs">
                            Nascimento
                          </span>
                        </div>
                        <h3 className="text-lg text-foreground dark:text-white mb-3">
                          Potro de {(item as PendingBirth).fieldData.motherName}
                        </h3>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af]">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{new Date((item as PendingBirth).fieldData.reportedDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af]">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{(item as PendingBirth).fieldData.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af]">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span>{(item as PendingBirth).fieldData.reportedBy}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 h-10 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0">
                        <Eye className="w-5 h-5" />
                        Validar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0">
                        <ImageWithFallback
                          src={(item as PendingOccurrence).fieldData.photos[0]}
                          alt="Ocorrência"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs">
                            Ocorrência
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            (item as PendingOccurrence).fieldData.severity === 'Crítica' ? 'bg-red-500 text-white' :
                            (item as PendingOccurrence).fieldData.severity === 'Alta' ? 'bg-orange-500 text-white' :
                            (item as PendingOccurrence).fieldData.severity === 'Média' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            {(item as PendingOccurrence).fieldData.severity}
                          </span>
                        </div>
                        <h3 className="text-lg text-foreground dark:text-white mb-2">
                          {(item as PendingOccurrence).fieldData.occurrenceType} - {(item as PendingOccurrence).fieldData.animalName}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-[#99a1af] mb-3 line-clamp-2">
                          {(item as PendingOccurrence).fieldData.description}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af]">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{new Date((item as PendingOccurrence).fieldData.reportedDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground dark:text-[#99a1af]">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span>{(item as PendingOccurrence).fieldData.reportedBy}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 h-10 bg-primary dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0">
                        <Eye className="w-5 h-5" />
                        Revisar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
