import { Eye, Plus, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NativeSelect } from '../ui/native-select';
import { Heart, TrendingUp, Calendar as CalendarIcon } from 'lucide-react';
import { CoberturaDetailsModal, OvuloDetailsModal, EmbriaoDetailsModal, GestacaoDetailsModal, DocumentoViewModal } from './ReproductionModals';
import { ReproductionAutomationTab } from './ReproductionAutomationTab';
import { CustomProtocolsTab } from './CustomProtocolsTab';
import { GestationsTab } from './GestationsTab';
import { RegisterCoberturaModal } from './RegisterCoberturaModal';
import { RegisterOvulosModal } from './RegisterOvulosModal';
import { RegisterEmbriaoModal } from './RegisterEmbriaoModal';
import type { ProtocolFormData } from './CreateProtocolModal';
import type { ApplyProtocolData } from './ApplyProtocolModal';
import { useUser } from '@/contexts/UserContext';
import { useStallions, useMares } from '@/hooks/useAnimals';
import {
  useCoverings,
  useCreateCovering,
  useReproductiveEvents,
  useGestations,
  useCreateGestation,
  useOvules,
  useCreateOvule,
  useEmbryos,
  useCreateEmbryo,
  useReproductionDocuments,
  useCreateReproductionDocument,
  useReproductionProtocols,
  useCreateReproductionProtocol,
  useUpdateReproductionProtocol,
  useReplaceReproductionProtocolSteps,
  useDeleteReproductionProtocol,
  useApplyReproductionProtocol,
  useReproductionProtocolApplications,
} from '@/hooks/useReproduction';
import type { Gestation } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type ReproductionTab = 'automacao' | 'protocolos' | 'coberturas' | 'ovulos' | 'embrioes' | 'gestacoes' | 'documentos';

interface Cobertura {
  id: string;
  pai: string;
  mae: string;
  tipo: string;
  data: string;
  veterinario: string;
  status: 'positivo' | 'aguardando' | 'negativo';
}

interface Ovulo {
  id: string;
  doadora: string;
  quantidade: number;
  data: string;
  status: string;
  disponiveis: number;
  qualidade: 'excelente' | 'boa' | 'regular';
}

interface Embriao {
  id: string;
  doadora: string;
  garanhao: string;
  quantidade: number;
  data: string;
  status: string;
  disponiveis: number;
  grau: 'A' | 'B' | 'C';
  tipo: 'Fresco' | 'Congelado';
}

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  tamanho: string;
}

interface BreederReproductionContentProps {
  onNavigateToAgenda?: () => void;
}

export function BreederReproductionContent({ onNavigateToAgenda }: BreederReproductionContentProps = {}) {
  const supabase = useMemo(() => createClient(), []);
  const { profile } = useUser();
  const harasId = profile?.haras_id || '';

  const [activeTab, setActiveTab] = useState<ReproductionTab>('automacao');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCoberturaDetails, setShowCoberturaDetails] = useState(false);
  const [showOvuloDetails, setShowOvuloDetails] = useState(false);
  const [showEmbriaoDetails, setShowEmbriaoDetails] = useState(false);
  const [showGestacaoDetails, setShowGestacaoDetails] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [selectedCobertura, setSelectedCobertura] = useState<Cobertura | null>(null);
  const [selectedOvulo, setSelectedOvulo] = useState<Ovulo | null>(null);
  const [selectedEmbriao, setSelectedEmbriao] = useState<Embriao | null>(null);
  const [selectedGestacao, setSelectedGestacao] = useState<Cobertura | null>(null);
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<any>(null);
  
  // Novos estados para os modais de registro
  const [showRegisterCoberturaModal, setShowRegisterCoberturaModal] = useState(false);
  const [showRegisterOvulosModal, setShowRegisterOvulosModal] = useState(false);
  const [showRegisterEmbriaoModal, setShowRegisterEmbriaoModal] = useState(false);

  const { data: stallionsData } = useStallions(harasId);
  const { data: maresData } = useMares(harasId);
  const shouldLoadEvents = activeTab === 'automacao';
  const shouldLoadProtocols = activeTab === 'protocolos';
  const shouldLoadDocuments = activeTab === 'documentos';
  const shouldLoadOvules = activeTab === 'ovulos';
  const shouldLoadEmbryos = activeTab === 'embrioes';

  const { data: eventsResponse } = useReproductiveEvents(harasId, { page: 1, limit: 50 }, shouldLoadEvents);
  const { data: coveringsResponse } = useCoverings(harasId, { page: 1, limit: 50 });
  const { data: gestationsResponse, isLoading: isLoadingGestations } = useGestations({ haras_id: harasId }, { page: 1, limit: 50 });
  const { data: ovulesResponse } = useOvules(harasId, { page: 1, limit: 50 }, shouldLoadOvules);
  const { data: embryosResponse } = useEmbryos(harasId, { page: 1, limit: 50 }, shouldLoadEmbryos);
  const { data: documentsData } = useReproductionDocuments(harasId, shouldLoadDocuments);
  const { data: protocolsData } = useReproductionProtocols(harasId, shouldLoadProtocols);
  const { data: protocolApplications } = useReproductionProtocolApplications(harasId, shouldLoadProtocols);

  const { mutateAsync: createCovering } = useCreateCovering();
  const { mutateAsync: createGestation, isPending: isSavingGestation } = useCreateGestation();
  const { mutateAsync: createOvule } = useCreateOvule();
  const { mutateAsync: createEmbryo } = useCreateEmbryo();
  const { mutateAsync: createDocument, isPending: isSavingDocument } = useCreateReproductionDocument();
  const { mutateAsync: createProtocol } = useCreateReproductionProtocol();
  const { mutateAsync: updateProtocol } = useUpdateReproductionProtocol(harasId);
  const { mutateAsync: replaceProtocolSteps } = useReplaceReproductionProtocolSteps(harasId);
  const { mutateAsync: deleteProtocol } = useDeleteReproductionProtocol(harasId);
  const { mutateAsync: applyProtocol } = useApplyReproductionProtocol();

  const coverings = coveringsResponse?.data || [];
  const reproductiveEvents = eventsResponse?.data || [];
  const gestations = gestationsResponse?.data || [];
  const ovules = ovulesResponse?.data || [];
  const embryos = embryosResponse?.data || [];

  const tabs = [
    { id: 'automacao' as ReproductionTab, label: 'Sequência Automática' },
    { id: 'protocolos' as ReproductionTab, label: 'Protocolos Personalizados' },
    { id: 'coberturas' as ReproductionTab, label: 'Coberturas' },
    { id: 'ovulos' as ReproductionTab, label: 'Óvulos' },
    { id: 'embrioes' as ReproductionTab, label: 'Embriões' },
    { id: 'gestacoes' as ReproductionTab, label: 'Gestações' },
    { id: 'documentos' as ReproductionTab, label: 'Documentos' },
  ];

  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    const [year, month, day] = value.split('T')[0].split('-');
    if (!year || !month || !day) return value;
    return `${day}/${month}/${year}`;
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes || bytes <= 0) return '-';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const coverageStatusFromGestation = (gestation?: Gestation) => {
    if (!gestation) return 'aguardando' as const;
    if (gestation.status === 'aborto' || gestation.status === 'reabsorvida') return 'negativo' as const;
    return 'positivo' as const;
  };

  const gestationsByCovering = useMemo(() => {
    const map = new Map<string, Gestation>();
    gestations.forEach((gestation) => {
      if (gestation.reproductive_event_id) {
        map.set(gestation.reproductive_event_id, gestation);
      }
    });
    return map;
  }, [gestations]);

  const coberturas: Cobertura[] = useMemo(() => {
    return coverings.map((covering) => {
      const gestation = covering.id ? gestationsByCovering.get(covering.id) : undefined;
      return {
        id: covering.id,
        pai: covering.stallion?.name || 'Não informado',
        mae: covering.mare?.name || 'Não informado',
        tipo: covering.type,
        data: formatDate(covering.event_date),
        veterinario: covering.veterinarian || '-',
        status: coverageStatusFromGestation(gestation),
      };
    });
  }, [coverings, gestationsByCovering]);

  const ovulos: Ovulo[] = useMemo(() => {
    return ovules.map((ovule) => ({
      id: ovule.id,
      doadora: ovule.donor?.name || 'Não informado',
      quantidade: ovule.quantity,
      data: formatDate(ovule.collection_date),
      status: ovule.status || 'Congelado',
      disponiveis: ovule.available,
      qualidade: ovule.quality || 'regular',
    }));
  }, [ovules]);

  const embrioes: Embriao[] = useMemo(() => {
    return embryos.map((embryo) => ({
      id: embryo.id,
      doadora: embryo.donor?.name || 'Não informado',
      garanhao: embryo.stallion?.name || 'Não informado',
      quantidade: embryo.quantity,
      data: formatDate(embryo.production_date),
      status: embryo.status || embryo.storage_type || 'Congelado',
      disponiveis: embryo.available,
      grau: embryo.grade || 'C',
      tipo: embryo.storage_type || 'Congelado',
    }));
  }, [embryos]);

  const documentos: Documento[] = useMemo(() => {
    return (documentsData || []).map((doc) => ({
      id: doc.id,
      nome: doc.title,
      tipo: doc.document_type,
      data: formatDate(doc.created_at),
      tamanho: formatFileSize(typeof doc.file_size === 'string' ? Number(doc.file_size) : doc.file_size),
    }));
  }, [documentsData]);

  const metrics = useMemo(() => {
    const activeCoverings = coberturas.filter((cobertura) => cobertura.status === 'aguardando').length;
    const gestationsInProgress = gestations.filter((gestation) => gestation.status === 'em_andamento').length;
    const birthsThisYear = gestations.filter((gestation) => {
      if (gestation.status !== 'nascimento' || !gestation.actual_birth_date) return false;
      return gestation.actual_birth_date.startsWith(String(new Date().getFullYear()));
    }).length;
    const upcomingBirths = gestations.filter((gestation) => {
      if (!gestation.expected_birth_date) return false;
      if (gestation.status !== 'em_andamento' && gestation.status !== 'confirmada') return false;
      const expected = new Date(gestation.expected_birth_date);
      const diffDays = Math.ceil((expected.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 45;
    }).length;

    return {
      activeCoverings,
      gestationsInProgress,
      birthsThisYear,
      upcomingBirths,
    };
  }, [coberturas, gestations]);

  const deadlines = useMemo(() => {
    const now = new Date();
    return gestations
      .filter((gestation) => gestation.expected_birth_date)
      .map((gestation) => {
        const expected = new Date(gestation.expected_birth_date as string);
        const days = Math.ceil((expected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          id: gestation.id,
          name: gestation.mare?.name || 'Gestação',
          type: 'Parto Previsto',
          days,
          details: `Previsão de parto em ${formatDate(gestation.expected_birth_date)}`,
        };
      })
      .sort((a, b) => a.days - b.days)
      .slice(0, 4);
  }, [gestations]);

  const recentActivities = useMemo(() => {
    const coverageActivities = coberturas.slice(0, 2).map((cobertura) => ({
      id: `coverage-${cobertura.id}`,
      title: 'Cobertura registrada',
      animal: `${cobertura.pai} x ${cobertura.mae}`,
      time: cobertura.data,
      type: 'covering',
    }));

    const gestationActivities = gestations.slice(0, 2).map((gestation) => ({
      id: `gestation-${gestation.id}`,
      title: 'Gestação confirmada',
      animal: gestation.mare?.name || 'Gestação',
      time: formatDate(gestation.confirmation_date || gestation.expected_birth_date || ''),
      type: 'birth',
    }));

    return [...coverageActivities, ...gestationActivities].slice(0, 4);
  }, [coberturas, gestations]);

  const animalOptions = useMemo(() => {
    const names = new Set<string>();
    (maresData || []).forEach((mare) => {
      if (mare.name) names.add(mare.name);
    });
    (stallionsData || []).forEach((stallion) => {
      if (stallion.name) names.add(stallion.name);
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [maresData, stallionsData]);

  const protocolAnimals = useMemo(() => {
    const list = [...(maresData || []), ...(stallionsData || [])];
    const seen = new Set<string>();
    return list.filter((animal) => {
      if (seen.has(animal.id)) return false;
      seen.add(animal.id);
      return true;
    });
  }, [maresData, stallionsData]);

  const filteredCoberturas = useMemo(() => {
    return coberturas.filter((cobertura) => {
      if (selectedAnimal) {
        const match =
          cobertura.pai.toLowerCase().includes(selectedAnimal.toLowerCase()) ||
          cobertura.mae.toLowerCase().includes(selectedAnimal.toLowerCase());
        if (!match) return false;
      }
      if (selectedStatus && cobertura.status !== selectedStatus) return false;
      return true;
    });
  }, [coberturas, selectedAnimal, selectedStatus]);

  const filteredOvulos = useMemo(() => {
    return ovulos.filter((ovulo) => {
      if (selectedAnimal && !ovulo.doadora.toLowerCase().includes(selectedAnimal.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [ovulos, selectedAnimal]);

  const filteredEmbrioes = useMemo(() => {
    return embrioes.filter((embriao) => {
      if (selectedAnimal) {
        const match =
          embriao.doadora.toLowerCase().includes(selectedAnimal.toLowerCase()) ||
          embriao.garanhao.toLowerCase().includes(selectedAnimal.toLowerCase());
        if (!match) return false;
      }
      return true;
    });
  }, [embrioes, selectedAnimal]);

  const handleConfirmGestation = async (input: {
    mareId: string;
    stallionId?: string;
    confirmationDate: string;
    method: string;
    observations?: string;
  }) => {
    try {
      if (!harasId) {
        toast.error('Haras não identificado.');
        return;
      }

      const latestCovering = coverings
        .filter((covering) => covering.mare_id === input.mareId)
        .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())[0];

      await createGestation({
        haras_id: harasId,
        mare_id: input.mareId,
        stallion_id: input.stallionId || latestCovering?.stallion_id || undefined,
        reproductive_event_id: latestCovering?.id,
        start_date: latestCovering?.event_date || input.confirmationDate,
        confirmation_date: input.confirmationDate,
        status: 'em_andamento',
        diagnosis_type: input.method === 'Exame Laboratorial' ? 'Exame de sangue' : input.method,
        observations: input.observations,
      });

      toast.success('Gestação confirmada com sucesso!');
    } catch (error) {
      console.error('Erro ao confirmar gestação:', error);
      toast.error('Erro ao confirmar gestação. Tente novamente.');
      throw error;
    }
  };

  const handleCreateProtocol = async (data: ProtocolFormData) => {
    try {
      if (!harasId) {
        toast.error('Haras não identificado.');
        return;
      }
      const totalDays = data.steps.length > 0 ? Math.max(...data.steps.map((step) => step.dayOffset)) : 0;

      await createProtocol({
        input: {
          haras_id: harasId,
          name: data.name,
          type: data.type,
          description: data.description,
          total_days: totalDays,
          is_active: true,
        },
        steps: data.steps.map((step, index) => ({
          name: step.name,
          day_offset: step.dayOffset,
          description: step.description,
          step_type: step.type,
          sort_order: index,
        })),
      });

      toast.success('Protocolo criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar protocolo:', error);
      toast.error('Erro ao criar protocolo. Tente novamente.');
    }
  };

  const handleUpdateProtocol = async (protocolId: string, data: ProtocolFormData) => {
    try {
      const totalDays = data.steps.length > 0 ? Math.max(...data.steps.map((step) => step.dayOffset)) : 0;
      await updateProtocol({
        id: protocolId,
        input: {
          name: data.name,
          type: data.type,
          description: data.description,
          total_days: totalDays,
        },
      });
      await replaceProtocolSteps(protocolId, data.steps.map((step, index) => ({
        protocol_id: protocolId,
        name: step.name,
        day_offset: step.dayOffset,
        description: step.description,
        step_type: step.type,
        sort_order: index,
      })));
      toast.success('Protocolo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar protocolo:', error);
      toast.error('Erro ao atualizar protocolo. Tente novamente.');
    }
  };

  const handleDeleteProtocol = async (protocolId: string) => {
    try {
      await deleteProtocol(protocolId);
      toast.success('Protocolo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir protocolo:', error);
      toast.error('Erro ao excluir protocolo. Tente novamente.');
    }
  };

  const handleApplyProtocol = async (protocolId: string, data: ApplyProtocolData) => {
    try {
      if (!harasId) {
        toast.error('Haras não identificado.');
        return;
      }
      const animal =
        (data.animalId && (maresData?.find((mare) => mare.id === data.animalId) ||
          stallionsData?.find((stallion) => stallion.id === data.animalId))) ||
        maresData?.find((mare) => mare.name === data.animalName) ||
        stallionsData?.find((stallion) => stallion.name === data.animalName);

      if (!animal) {
        toast.error('Animal não encontrado.');
        return;
      }

      await applyProtocol({
        haras_id: harasId,
        protocol_id: protocolId,
        animal_id: animal.id,
        start_date: data.startDate,
        notes: data.notes,
      });

      toast.success('Protocolo aplicado com sucesso!');
    } catch (error) {
      console.error('Erro ao aplicar protocolo:', error);
      toast.error('Erro ao aplicar protocolo. Tente novamente.');
    }
  };

  const sanitizeFileName = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '');

  const handleUploadDocument = async (data: { nome: string; tipo: string; descricao?: string; file: File }) => {
    try {
      if (!harasId) {
        toast.error('Haras não identificado.');
        return;
      }
      const ext = data.file.name.split('.').pop();
      const safeName = sanitizeFileName(data.nome) || 'documento';
      const fileName = `${harasId}/reproduction/${Date.now()}_${safeName}${ext ? `.${ext}` : ''}`;

      const { error: uploadError } = await supabase.storage
        .from('animals')
        .upload(fileName, data.file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrl } = supabase.storage
        .from('animals')
        .getPublicUrl(fileName);

      await createDocument({
        haras_id: harasId,
        title: data.nome,
        document_type: data.tipo,
        file_url: publicUrl.publicUrl,
        file_name: data.file.name,
        file_size: data.file.size,
        file_type: data.file.type,
      });

      toast.success('Documento carregado com sucesso!');
      setShowUploadModal(false);
    } catch (error) {
      console.error('Erro ao carregar documento:', error);
      toast.error('Erro ao carregar documento. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Coberturas Ativas" value={String(metrics.activeCoverings)} icon={Heart} iconColor="text-pink-500" />
        <MetricCard title="Gestações em Andamento" value={String(metrics.gestationsInProgress)} icon={TrendingUp} iconColor="text-green-500" />
        <MetricCard title="Nascimentos este ano" value={String(metrics.birthsThisYear)} icon={Heart} iconColor="text-purple-500" />
        <MetricCard title="Próximos partos" value={String(metrics.upcomingBirths)} icon={CalendarIcon} iconColor="text-purple-500" />
      </div>

      {/* Próximos Prazos e Atividades Recentes lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximos Prazos */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">Próximos Prazos</h3>
          <div className="space-y-4">
            {deadlines.length === 0 && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Nenhum prazo encontrado no momento.
              </p>
            )}
            {deadlines.map((deadline) => (
              <DeadlineItem
                key={deadline.id}
                name={deadline.name}
                type={deadline.type}
                days={deadline.days}
                onClick={() => {
                  setSelectedDeadline(deadline);
                  setShowDeadlineModal(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
          <h3 className="text-xl text-foreground dark:text-white mb-6">Atividades Recentes</h3>
          <div className="space-y-4">
            {recentActivities.length === 0 && (
              <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
                Nenhuma atividade recente registrada.
              </p>
            )}
            {recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                title={activity.title}
                animal={activity.animal}
                time={activity.time}
                type={activity.type}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs - Desktop */}
      <div className="hidden md:flex bg-card dark:bg-[#1a1a1a] rounded-xl p-1 border border-border dark:border-[rgba(255,255,255,0.1)] gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-12 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary dark:bg-white text-white dark:text-[#1a1a1a]'
                : 'text-foreground dark:text-white hover:bg-muted dark:hover:bg-[#0d0d0d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tabs - Mobile (Dropdown) */}
      <div className="md:hidden">
        <NativeSelect
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as ReproductionTab)}
          className="w-full"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      {/* Filtros */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <NativeSelect
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
            >
              <option value="">Animal</option>
              {animalOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="flex-1">
            <NativeSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="positivo">Positivo</option>
              <option value="aguardando">Aguardando</option>
              <option value="negativo">Negativo</option>
            </NativeSelect>
          </div>

          <div className="flex-1">
            <NativeSelect
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="">Escolha o período</option>
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="90dias">Últimos 90 dias</option>
              <option value="ano">Último ano</option>
            </NativeSelect>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
        {/* FASE 42: Tab Sequência Automática */}
        {activeTab === 'automacao' && (
          <ReproductionAutomationTab onNavigateToAgenda={onNavigateToAgenda} events={reproductiveEvents} />
        )}

        {activeTab === 'protocolos' && (
          <CustomProtocolsTab
            protocols={protocolsData || []}
            applications={protocolApplications || []}
            animals={protocolAnimals}
            onCreateProtocol={handleCreateProtocol}
            onUpdateProtocol={handleUpdateProtocol}
            onDeleteProtocol={handleDeleteProtocol}
            onApplyProtocol={handleApplyProtocol}
          />
        )}

        {activeTab === 'coberturas' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">Coberturas Registradas</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                  {filteredCoberturas.length} {filteredCoberturas.length === 1 ? 'cobertura' : 'coberturas'} registrada(s)
                </p>
              </div>
              <button
                onClick={() => setShowRegisterCoberturaModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Cobertura
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCoberturas.map((cobertura) => (
                <CoberturaCard 
                  key={cobertura.id} 
                  cobertura={cobertura} 
                  onViewDetails={() => {
                    setSelectedCobertura(cobertura);
                    setShowCoberturaDetails(true);
                  }}
                  onRegister={() => {
                    setSelectedCobertura(cobertura);
                    setShowRegisterCoberturaModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ovulos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">Óvulos Coletados</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                  {filteredOvulos.length} {filteredOvulos.length === 1 ? 'coleta' : 'coletas'} registrada(s)
                </p>
              </div>
              <button
                onClick={() => setShowRegisterOvulosModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Coleta de Óvulos
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredOvulos.map((ovulo) => (
                <OvuloCard 
                  key={ovulo.id} 
                  ovulo={ovulo} 
                  onViewDetails={() => {
                    setSelectedOvulo(ovulo);
                    setShowOvuloDetails(true);
                  }}
                  onRegister={() => {
                    setSelectedOvulo(ovulo);
                    setShowRegisterOvulosModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'embrioes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl text-foreground dark:text-white">Embriões Registrados</h3>
                <p className="text-sm text-muted-foreground dark:text-[#99a1af] mt-1">
                  {filteredEmbrioes.length} {filteredEmbrioes.length === 1 ? 'embrião' : 'embriões'} registrado(s)
                </p>
              </div>
              <button
                onClick={() => setShowRegisterEmbriaoModal(true)}
                className="w-full sm:w-auto px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Novos Embriões
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredEmbrioes.map((item) => (
                <EmbriaoCard 
                  key={item.id} 
                  embriao={item} 
                  onViewDetails={() => {
                    setSelectedEmbriao(item);
                    setShowEmbriaoDetails(true);
                  }}
                  onRegister={() => {
                    setSelectedEmbriao(item);
                    setShowRegisterEmbriaoModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gestacoes' && (
          <GestationsTab
            gestations={gestations}
            mares={maresData || []}
            stallions={stallionsData || []}
            onConfirmGestation={handleConfirmGestation}
            isSaving={isSavingGestation}
          />
        )}

        {activeTab === 'documentos' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Carregar Documento
              </button>
            </div>
            <div className="space-y-2">
              {documentos.map((doc) => (
                <DocumentoItem 
                  key={doc.id} 
                  documento={doc} 
                  onView={() => {
                    setSelectedDocumento(doc);
                    setShowDocumentoModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Upload Documento */}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadDocument}
          isSaving={isSavingDocument}
        />
      )}

      {/* Modals de Detalhes */}
      {showCoberturaDetails && selectedCobertura && (
        <CoberturaDetailsModal 
          cobertura={selectedCobertura} 
          onClose={() => {
            setShowCoberturaDetails(false);
            setSelectedCobertura(null);
          }} 
        />
      )}

      {showOvuloDetails && selectedOvulo && (
        <OvuloDetailsModal 
          ovulo={selectedOvulo} 
          onClose={() => {
            setShowOvuloDetails(false);
            setSelectedOvulo(null);
          }} 
        />
      )}

      {showEmbriaoDetails && selectedEmbriao && (
        <EmbriaoDetailsModal 
          embriao={selectedEmbriao} 
          onClose={() => {
            setShowEmbriaoDetails(false);
            setSelectedEmbriao(null);
          }} 
        />
      )}

      {showGestacaoDetails && selectedGestacao && (
        <GestacaoDetailsModal 
          gestacao={selectedGestacao} 
          onClose={() => {
            setShowGestacaoDetails(false);
            setSelectedGestacao(null);
          }} 
        />
      )}

      {showDocumentoModal && selectedDocumento && (
        <DocumentoViewModal 
          documento={selectedDocumento} 
          onClose={() => {
            setShowDocumentoModal(false);
            setSelectedDocumento(null);
          }} 
        />
      )}

      {/* Modal Detalhes de Prazos */}
      {showDeadlineModal && selectedDeadline && (
        <DeadlineDetailsModal 
          deadline={selectedDeadline} 
          onClose={() => {
            setShowDeadlineModal(false);
            setSelectedDeadline(null);
          }} 
        />
      )}

      {/* Modal de Registro de Cobertura */}
      {showRegisterCoberturaModal && (
        <RegisterCoberturaModal 
          onClose={() => setShowRegisterCoberturaModal(false)}
          stallions={stallionsData || []}
          mares={maresData || []}
          onSubmit={async (data) => {
            try {
              if (!harasId) {
                toast.error('Haras não identificado.');
                return;
              }
              await createCovering({
                haras_id: harasId,
                mare_id: data.mareId,
                stallion_id: data.stallionId,
                event_date: data.data,
                type: data.tipo,
                veterinarian: data.veterinario,
                observations: data.observacoes,
              });
              toast.success('Cobertura registrada com sucesso!');
              setShowRegisterCoberturaModal(false);
            } catch (error) {
              console.error('Erro ao registrar cobertura:', error);
              toast.error('Erro ao registrar cobertura. Tente novamente.');
            }
          }}
        />
      )}

      {/* Modal de Registro de Óvulos */}
      {showRegisterOvulosModal && (
        <RegisterOvulosModal 
          onClose={() => setShowRegisterOvulosModal(false)}
          donors={maresData || []}
          onSubmit={async (data) => {
            try {
              if (!harasId) {
                toast.error('Haras não identificado.');
                return;
              }
              await createOvule({
                haras_id: harasId,
                donor_id: data.donorId,
                collection_date: data.data,
                quantity: data.quantidade,
                quality: data.qualidade,
                method: data.metodo,
                veterinarian: data.veterinario,
                observations: data.observacoes,
                status: 'Congelado',
              });
              toast.success('Coleta de óvulos registrada com sucesso!');
              setShowRegisterOvulosModal(false);
            } catch (error) {
              console.error('Erro ao registrar coleta de óvulos:', error);
              toast.error('Erro ao registrar coleta. Tente novamente.');
            }
          }}
        />
      )}

      {/* Modal de Registro de Embriões */}
      {showRegisterEmbriaoModal && (
        <RegisterEmbriaoModal 
          onClose={() => setShowRegisterEmbriaoModal(false)}
          donors={maresData || []}
          stallions={stallionsData || []}
          onSubmit={async (data) => {
            try {
              if (!harasId) {
                toast.error('Haras não identificado.');
                return;
              }
              await createEmbryo({
                haras_id: harasId,
                donor_id: data.donorId,
                stallion_id: data.stallionId,
                production_date: data.data,
                quantity: data.quantidade,
                grade: data.grau,
                storage_type: data.tipo,
                method: data.metodo,
                veterinarian: data.veterinario,
                observations: data.observacoes,
                status: data.tipo,
              });
              toast.success('Embriões registrados com sucesso!');
              setShowRegisterEmbriaoModal(false);
            } catch (error) {
              console.error('Erro ao registrar embriões:', error);
              toast.error('Erro ao registrar embriões. Tente novamente.');
            }
          }}
        />
      )}
    </div>
  );
}

function CoberturaCard({ cobertura, onViewDetails, onRegister }: { cobertura: Cobertura; onViewDetails: () => void; onRegister: () => void }) {
  const statusConfig = {
    positivo: { label: 'Positivo', color: 'bg-emerald-500' },
    aguardando: { label: 'Aguardando', color: 'bg-amber-500' },
    negativo: { label: 'Negativo', color: 'bg-[#e74c3c]' },
  };

  const config = statusConfig[cobertura.status];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] space-y-4">
      <div className="flex items-start justify-between">
        <span className={`${config.color} px-3 py-1 rounded-md text-white text-xs`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-white">{cobertura.pai} (Pai)</p>
        <p className="text-white">{cobertura.mae}</p>
        <p className="text-gray-500 text-xs">Tipo: {cobertura.tipo}</p>
        <p className="text-gray-500 text-xs">Data: {cobertura.data}</p>
        <p className="text-gray-500 text-xs">Veterinário: {cobertura.veterinario}</p>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full px-8 py-2 border border-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        Ver Detalhes
      </button>
    </div>
  );
}

function OvuloCard({ ovulo, onViewDetails, onRegister }: { ovulo: Ovulo; onViewDetails: () => void; onRegister: () => void }) {
  const qualidadeConfig = {
    excelente: { label: 'Excelente', color: 'bg-emerald-500' },
    boa: { label: 'Boa', color: 'bg-gray-500' },
    regular: { label: 'Regular', color: 'bg-amber-500' },
  };

  const config = qualidadeConfig[ovulo.qualidade];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] space-y-4">
      <div className="flex items-start justify-between">
        <span className={`${config.color} px-3 py-1 rounded-md text-white text-xs`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-white">{ovulo.doadora}</p>
        <p className="text-gray-500 text-xs">Quantidade: {ovulo.quantidade}</p>
        <p className="text-gray-500 text-xs">Data: {ovulo.data}</p>
        <p className="text-gray-500 text-xs">Status: {ovulo.status}</p>
        <p className="text-gray-500 text-xs">Disponíveis: {ovulo.disponiveis}</p>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full px-8 py-2 border border-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        Ver Detalhes
      </button>
    </div>
  );
}

function EmbriaoCard({ embriao, onViewDetails, onRegister }: { embriao: Embriao; onViewDetails: () => void; onRegister: () => void }) {
  const qualidadeConfig = {
    A: { label: 'Grau A', color: 'bg-emerald-500' },
    B: { label: 'Grau B', color: 'bg-gray-500' },
    C: { label: 'Grau C', color: 'bg-amber-500' },
  };

  const config = qualidadeConfig[embriao.grau];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[rgba(255,255,255,0.1)] space-y-4">
      <div className="flex items-start justify-between">
        <span className={`${config.color} px-3 py-1 rounded-md text-white text-xs`}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-white">{embriao.doadora}</p>
        <p className="text-gray-500 text-xs">Quantidade: {embriao.quantidade}</p>
        <p className="text-gray-500 text-xs">Data: {embriao.data}</p>
        <p className="text-gray-500 text-xs">Status: {embriao.status}</p>
        <p className="text-gray-500 text-xs">Disponíveis: {embriao.disponiveis}</p>
      </div>

      <button 
        onClick={onViewDetails}
        className="w-full px-8 py-2 border border-[rgba(255,255,255,0.1)] text-white rounded-lg hover:bg-[#0d0d0d] transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        Ver Detalhes
      </button>
    </div>
  );
}

function DocumentoItem({ documento, onView }: { documento: Documento; onView: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div>
        <p className="text-foreground dark:text-white mb-1">{documento.nome}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {documento.tipo} • {documento.tamanho} • {documento.data}
        </p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onView}
          className="px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function UploadDocumentModal({
  onClose,
  onUpload,
  isSaving,
}: {
  onClose: () => void;
  onUpload: (data: { nome: string; tipo: string; descricao?: string; file: File }) => Promise<void> | void;
  isSaving?: boolean;
}) {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'cobertura',
    descricao: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      setError('Informe o nome do documento.');
      return;
    }
    if (!file) {
      setError('Selecione um arquivo para upload.');
      return;
    }
    setError(null);
    await onUpload({
      nome: formData.nome.trim(),
      tipo: formData.tipo,
      descricao: formData.descricao.trim() || undefined,
      file,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Carregar Documento</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Documento *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
              placeholder="Ex: Contrato de Cobertura"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Documento *</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full h-10 px-4 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white"
            >
              <option value="cobertura">Cobertura</option>
              <option value="gestacao">Gestação</option>
              <option value="ovulo">Óvulo</option>
              <option value="embriao">Embrião</option>
              <option value="laudo">Laudo Veterinário</option>
              <option value="contrato">Contrato</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-4 py-3 bg-muted dark:bg-[#0d0d0d] border border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white resize-none"
              rows={3}
              placeholder="Descrição do documento"
            />
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Arquivo *</label>
            <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border dark:border-[rgba(255,255,255,0.1)] rounded-lg cursor-pointer hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors">
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground dark:text-[#99a1af]" />
                <p className="text-muted-foreground dark:text-[#99a1af] mb-1">
                  {file ? file.name : 'Clique ou arraste o arquivo aqui'}
                </p>
                <p className="text-xs text-muted-foreground dark:text-[#99a1af]">PDF, JPG, PNG (máx. 10MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  if (selected) setFile(selected);
                }}
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await handleSubmit();
            }}
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-primary dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Carregando...' : 'Carregar Documento'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, iconColor }: { title: string; value: string; icon: any; iconColor: string }) {
  return (
    <div className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 border border-border dark:border-[rgba(255,255,255,0.1)]">
      <div className="flex items-start justify-between mb-4">
        <p className="text-muted-foreground dark:text-[#99a1af]">{title}</p>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-3xl text-foreground dark:text-white">{value}</p>
    </div>
  );
}

function DeadlineItem({ name, type, days, onClick }: { name: string; type: string; days: number; onClick: () => void }) {
  const color = days < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg cursor-pointer" onClick={onClick}>
      <div className="flex-1">
        <p className="text-foreground dark:text-white mb-1">{name}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {type} • {days < 0 ? 'Atrasado' : `${days} dias`}
        </p>
      </div>
      <button className="w-full sm:w-auto px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" />
        <span className="sm:hidden">Ver Detalhes</span>
      </button>
    </div>
  );
}

function ActivityItem({ title, animal, time, type }: { title: string; animal: string; time: string; type: string }) {
  const icon = {
    covering: <Heart className="w-5 h-5 text-pink-500" />,
    birth: <Heart className="w-5 h-5 text-purple-500" />,
    report: <Heart className="w-5 h-5 text-green-500" />,
    update: <Heart className="w-5 h-5 text-gray-500" />,
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted dark:bg-[#0d0d0d] rounded-lg">
      <div>
        <p className="text-foreground dark:text-white mb-1">{title}</p>
        <p className="text-sm text-muted-foreground dark:text-[#99a1af]">
          {animal} • {time}
        </p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-card dark:bg-[#1a1a1a] text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-[#2a2a2a] transition-colors">
          {icon[type]}
        </button>
      </div>
    </div>
  );
}

function DeadlineDetailsModal({ deadline, onClose }: { deadline: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-card dark:bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border dark:border-[rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-foreground dark:text-white">Detalhes do Prazo</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground dark:text-[#99a1af] hover:text-foreground dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Nome do Animal</label>
            <p className="text-foreground dark:text-white">{deadline.name}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Tipo de Evento</label>
            <p className="text-foreground dark:text-white">{deadline.type}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Dias Restantes</label>
            <p className="text-foreground dark:text-white">{deadline.days < 0 ? 'Atrasado' : `${deadline.days} dias`}</p>
          </div>

          <div>
            <label className="block text-sm text-foreground dark:text-white mb-2">Detalhes</label>
            <p className="text-foreground dark:text-white">{deadline.details}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-transparent border border-border dark:border-[rgba(255,255,255,0.1)] text-foreground dark:text-white rounded-lg hover:bg-muted dark:hover:bg-[#0d0d0d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
