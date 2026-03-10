// ============================================
// REPRODUCTION SERVICE
// Gerencia eventos reprodutivos e gestações
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type {
    ReproductiveEvent,
    Gestation,
    GestationFilters,
    CreateReproductiveEventInput,
    CreateGestationInput,
    PaginationParams,
    PaginatedResponse,
    ReproductionStats,
    Covering,
    CreateCoveringInput,
    Ovule,
    CreateOvuleInput,
    Embryo,
    CreateEmbryoInput,
    ReproductionDocument,
    CreateReproductionDocumentInput,
    ReproductionProtocol,
    ReproductionProtocolStep,
    ReproductionProtocolApplication,
    CreateReproductionProtocolInput,
    CreateReproductionProtocolStepInput,
    CreateReproductionProtocolApplicationInput
} from '@/types';

type GestationRow = Record<string, any>;
type ReproductionProtocolRow = ReproductionProtocol & {
    steps?: ReproductionProtocolStep[] | null;
};

const REPRODUCTIVE_EVENT_SELECT = `
  id,
  haras_id,
  animal_id,
  event_type,
  event_date,
  stallion_id,
  mare_id,
  veterinarian,
  protocol,
  observations,
  status,
  semen_type,
  details,
  auto_generated,
  priority,
  created_at,
  updated_at,
  animal:animals!reproductive_events_animal_id_fkey(id, name:nome, registry_number:registro),
  stallion:animals!reproductive_events_stallion_id_fkey(id, name:nome),
  mare:animals!reproductive_events_mare_id_fkey(id, name:nome)
`

const COVERING_SELECT = `
  id,
  haras_id,
  mare_id:egua_id,
  stallion_id:garanhao_id,
  event_date:data_cobertura,
  type:tipo,
  semen_type:tipo_semen,
  veterinarian:veterinario,
  observations:observacoes,
  created_at,
  updated_at,
  mare:animals!coverings_egua_id_fkey(id, name:nome, registry_number:registro),
  stallion:animals!coverings_garanhao_id_fkey(id, name:nome, registry_number:registro)
`

const COVERING_MUTATION_SELECT = `
  id,
  haras_id,
  mare_id:egua_id,
  stallion_id:garanhao_id,
  event_date:data_cobertura,
  type:tipo,
  semen_type:tipo_semen,
  veterinarian:veterinario,
  observations:observacoes,
  created_at,
  updated_at
`

const GESTATION_SELECT = `
  id,
  haras_id,
  mare_id:egua_id,
  stallion_id:garanhao_id,
  reproductive_event_id:covering_id,
  confirmation_date:data_diagnostico,
  expected_birth_date:data_prevista_parto,
  actual_birth_date:data_parto,
  status,
  foal_id:potro_id,
  observations:observacoes,
  created_at,
  updated_at,
  mare:animals!gestations_egua_id_fkey(id, name:nome, registry_number:registro),
  stallion:animals!gestations_garanhao_id_fkey(id, name:nome),
  foal:animals!gestations_potro_id_fkey(id, name:nome),
  covering:coverings!gestations_covering_id_fkey(id, data_cobertura, tipo, tipo_semen, veterinario)
`

const GESTATION_MUTATION_SELECT = `
  id,
  haras_id,
  mare_id:egua_id,
  stallion_id:garanhao_id,
  reproductive_event_id:covering_id,
  confirmation_date:data_diagnostico,
  expected_birth_date:data_prevista_parto,
  actual_birth_date:data_parto,
  status,
  foal_id:potro_id,
  observations:observacoes,
  created_at,
  updated_at
`

const OVULE_SELECT = `
  id,
  haras_id,
  donor_id,
  collection_date,
  quantity,
  available,
  quality,
  method,
  status,
  veterinarian,
  observations,
  created_at,
  updated_at,
  donor:animals!ovules_donor_id_fkey(id, name:nome, registry_number:registro)
`

const EMBRYO_SELECT = `
  id,
  haras_id,
  donor_id,
  stallion_id,
  production_date,
  quantity,
  available,
  grade,
  storage_type,
  method,
  status,
  veterinarian,
  observations,
  created_at,
  updated_at,
  donor:animals!embryos_donor_id_fkey(id, name:nome, registry_number:registro),
  stallion:animals!embryos_stallion_id_fkey(id, name:nome, registry_number:registro)
`

const REPRODUCTION_DOCUMENT_SELECT = `
  id,
  haras_id,
  animal_id,
  reproductive_event_id,
  gestation_id,
  ovule_id,
  embryo_id,
  title,
  document_type,
  file_url,
  file_name,
  file_size,
  file_type,
  created_by,
  created_at
`

const REPRODUCTION_PROTOCOL_STEP_SELECT = `
  id,
  protocol_id,
  name,
  day_offset,
  description,
  step_type,
  sort_order,
  created_at
`

const REPRODUCTION_PROTOCOL_SELECT = `
  id,
  haras_id,
  name,
  type,
  description,
  total_days,
  is_active,
  created_by,
  created_at,
  updated_at
`

const REPRODUCTION_PROTOCOL_WITH_STEPS_SELECT = `
  ${REPRODUCTION_PROTOCOL_SELECT},
  steps:reproduction_protocol_steps(${REPRODUCTION_PROTOCOL_STEP_SELECT})
`

const REPRODUCTION_PROTOCOL_APPLICATION_SELECT = `
  id,
  haras_id,
  protocol_id,
  animal_id,
  start_date,
  status,
  notes,
  created_by,
  created_at,
  updated_at
`

const mapDbGestationStatus = (status?: string | null): Gestation['status'] => {
    switch (status) {
        case 'Parto realizado':
            return 'nascimento';
        case 'Abortada':
            return 'aborto';
        case 'Reabsorvida':
            return 'reabsorvida';
        case 'Em andamento':
            return 'em_andamento';
        default:
            return 'confirmada';
    }
};

const mapAppGestationStatus = (status: Gestation['status']): string => {
    switch (status) {
        case 'nascimento':
            return 'Parto realizado';
        case 'aborto':
            return 'Abortada';
        case 'reabsorvida':
            return 'Reabsorvida';
        case 'em_andamento':
            return 'Em andamento';
        default:
            return 'Em andamento';
    }
};

const mapGestationRow = (row: GestationRow): Gestation => ({
    id: row.id,
    haras_id: row.haras_id,
    mare_id: row.mare_id ?? row.egua_id,
    donor_mare_id: row.donor_mare_id ?? null,
    stallion_id: row.stallion_id ?? row.garanhao_id ?? null,
    reproductive_event_id: row.reproductive_event_id ?? row.covering_id ?? null,
    start_date: row.start_date ?? row.covering?.data_cobertura ?? row.data_diagnostico ?? row.confirmation_date ?? '',
    confirmation_date: row.confirmation_date ?? row.data_diagnostico ?? null,
    expected_birth_date: row.expected_birth_date ?? row.data_prevista_parto ?? null,
    actual_birth_date: row.actual_birth_date ?? row.data_parto ?? null,
    status: mapDbGestationStatus(row.status),
    foal_id: row.foal_id ?? row.potro_id ?? null,
    veterinarian: row.veterinarian ?? row.covering?.veterinario ?? null,
    observations: row.observations ?? row.observacoes ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    mare: row.mare ?? null,
    stallion: row.stallion ?? null,
    foal: row.foal ?? null,
});

const sortProtocolSteps = (steps?: ReproductionProtocolStep[] | null): ReproductionProtocolStep[] => {
    if (!steps || steps.length === 0) return [];

    return [...steps].sort((left, right) => {
        const leftOrder = left.sort_order ?? left.day_offset ?? 0;
        const rightOrder = right.sort_order ?? right.day_offset ?? 0;
        return leftOrder - rightOrder;
    });
};

const mapProtocolRow = (row: ReproductionProtocolRow): ReproductionProtocol => ({
    ...row,
    steps: sortProtocolSteps(row.steps),
});

export const reproductionService = {
    // ============================================
    // EVENTOS REPRODUTIVOS
    // ============================================

    /**
     * Lista eventos reprodutivos de um haras
     */
    async listEvents(
        harasId: string,
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<ReproductiveEvent>> {
        let query = supabase
            .from('reproductive_events')
            .select(REPRODUCTIVE_EVENT_SELECT, { count: 'exact' })
            .eq('haras_id', harasId)
            .order('event_date', { ascending: false });

        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    /**
     * Registra um novo evento reprodutivo
     */
    async createEvent(input: CreateReproductiveEventInput): Promise<ReproductiveEvent> {
        const { data, error } = await supabase
            .from('reproductive_events')
            .insert(input)
            .select(REPRODUCTIVE_EVENT_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as ReproductiveEvent;
    },

    /**
     * Busca eventos por animal
     */
    async getEventsByAnimal(animalId: string): Promise<ReproductiveEvent[]> {
        const { data, error } = await supabase
            .from('reproductive_events')
            .select(REPRODUCTIVE_EVENT_SELECT)
            .or(`animal_id.eq.${animalId},stallion_id.eq.${animalId},mare_id.eq.${animalId}`)
            .order('event_date', { ascending: false });

        if (error) handleSupabaseError(error);

        return data as ReproductiveEvent[];
    },

    // ============================================
    // COBERTURAS
    // ============================================

    /**
     * Lista coberturas (coverings) por haras
     */
    async listCoverings(
        harasId: string,
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Covering>> {
        let query = supabase
            .from('coverings')
            .select(COVERING_SELECT, { count: 'exact' })
            .eq('haras_id', harasId)
            .order('data_cobertura', { ascending: false });

        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    /**
     * Cria uma nova cobertura
     */
    async createCovering(input: CreateCoveringInput): Promise<Covering> {
        const { data, error } = await supabase
            .from('coverings')
            .insert({
                haras_id: input.haras_id,
                egua_id: input.mare_id,
                garanhao_id: input.stallion_id,
                data_cobertura: input.event_date,
                tipo: input.type,
                tipo_semen: input.semen_type || null,
                veterinario: input.veterinarian || null,
                observacoes: input.observations || null,
            })
            .select(COVERING_MUTATION_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as Covering;
    },

    // ============================================
    // GESTAÇÕES
    // ============================================

    /**
     * Lista gestações com filtros
     */
    async listGestations(
        filters: GestationFilters = {},
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Gestation>> {
        let query = supabase
            .from('gestations')
            .select(GESTATION_SELECT, { count: 'exact' });

        if (filters.haras_id) {
            query = query.eq('haras_id', filters.haras_id);
        }
        if (filters.status) {
            query = query.eq('status', mapAppGestationStatus(filters.status));
        }
        if (filters.mare_id) {
            query = query.eq('egua_id', filters.mare_id);
        }

        query = query.order('data_prevista_parto', { ascending: true });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        const mapped = (data || []).map(mapGestationRow);
        return formatPaginatedResponse(mapped, count || 0, pagination);
    },

    /**
     * Busca gestação por ID
     */
    async getGestationById(id: string): Promise<Gestation | null> {
        const { data, error } = await supabase
            .from('gestations')
            .select(GESTATION_SELECT)
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            handleSupabaseError(error);
        }

        return mapGestationRow(data);
    },

    /**
     * Cria uma nova gestação
     */
    async createGestation(input: CreateGestationInput): Promise<Gestation> {
        // Calcular data prevista de nascimento (340 dias - média para cavalos)
        const startDate = new Date(input.start_date);
        const expectedBirth = new Date(startDate);
        expectedBirth.setDate(expectedBirth.getDate() + 340);

        const { data, error } = await supabase
            .from('gestations')
            .insert({
                haras_id: input.haras_id,
                egua_id: input.mare_id,
                garanhao_id: input.stallion_id || null,
                covering_id: input.reproductive_event_id || null,
                data_diagnostico: input.confirmation_date || null,
                data_prevista_parto: input.expected_birth_date || expectedBirth.toISOString().split('T')[0],
                status: mapAppGestationStatus(input.status || 'confirmada'),
                tipo_diagnostico: input.diagnosis_type || null,
                intervalo_p4: input.p4_interval || null,
                observacoes: input.observations || null
            })
            .select(GESTATION_MUTATION_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return mapGestationRow(data);
    },

    /**
     * Atualiza status da gestação
     */
    async updateGestationStatus(
        id: string,
        status: Gestation['status'],
        foalId?: string
    ): Promise<Gestation> {
        const updateData: Record<string, any> = {
            status: mapAppGestationStatus(status),
            updated_at: new Date().toISOString()
        };

        if (status === 'nascimento' && foalId) {
            updateData.potro_id = foalId;
            updateData.data_parto = new Date().toISOString().split('T')[0];
        }

        const { data, error } = await supabase
            .from('gestations')
            .update(updateData)
            .eq('id', id)
            .select(GESTATION_MUTATION_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return mapGestationRow(data);
    },

    /**
     * Busca gestações ativas (próximas do parto)
     */
    async getActiveGestations(harasId: string, daysAhead: number = 30): Promise<Gestation[]> {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + daysAhead);

        const { data, error } = await supabase
            .from('gestations')
            .select(GESTATION_SELECT)
            .eq('haras_id', harasId)
            .in('status', ['Em andamento'])
            .lte('data_prevista_parto', futureDate.toISOString().split('T')[0])
            .order('data_prevista_parto', { ascending: true });

        if (error) handleSupabaseError(error);

        return (data || []).map(mapGestationRow);
    },

    /**
     * Obtém estatísticas de reprodução
     */
    async getStats(harasId: string, year?: number): Promise<ReproductionStats> {
        const { data, error } = await supabase.rpc('get_reproduction_stats', {
            p_haras_id: harasId,
            p_year: year ?? null,
        });

        if (error) handleSupabaseError(error);

        return {
            totalGestations: data?.totalGestations ?? 0,
            confirmedGestations: data?.confirmedGestations ?? 0,
            births: data?.births ?? 0,
            abortions: data?.abortions ?? 0,
            successRate: Number(data?.successRate ?? 0),
        };
    },

    // ============================================
    // OVULOS
    // ============================================

    async listOvules(
        harasId: string,
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Ovule>> {
        let query = supabase
            .from('ovules')
            .select(OVULE_SELECT, { count: 'exact' })
            .eq('haras_id', harasId)
            .order('collection_date', { ascending: false });

        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    async createOvule(input: CreateOvuleInput): Promise<Ovule> {
        const { data, error } = await supabase
            .from('ovules')
            .insert({
                haras_id: input.haras_id,
                donor_id: input.donor_id,
                collection_date: input.collection_date,
                quantity: input.quantity,
                available: input.available ?? input.quantity,
                quality: input.quality ?? null,
                method: input.method ?? null,
                status: input.status ?? null,
                veterinarian: input.veterinarian ?? null,
                observations: input.observations ?? null,
            })
            .select(OVULE_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as Ovule;
    },

    // ============================================
    // EMBRIOES
    // ============================================

    async listEmbryos(
        harasId: string,
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Embryo>> {
        let query = supabase
            .from('embryos')
            .select(EMBRYO_SELECT, { count: 'exact' })
            .eq('haras_id', harasId)
            .order('production_date', { ascending: false });

        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        return formatPaginatedResponse(data || [], count || 0, pagination);
    },

    async createEmbryo(input: CreateEmbryoInput): Promise<Embryo> {
        const { data, error } = await supabase
            .from('embryos')
            .insert({
                haras_id: input.haras_id,
                donor_id: input.donor_id,
                stallion_id: input.stallion_id ?? null,
                production_date: input.production_date,
                quantity: input.quantity,
                available: input.available ?? input.quantity,
                grade: input.grade ?? null,
                storage_type: input.storage_type ?? null,
                method: input.method ?? null,
                status: input.status ?? null,
                veterinarian: input.veterinarian ?? null,
                observations: input.observations ?? null,
            })
            .select(EMBRYO_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as Embryo;
    },

    // ============================================
    // DOCUMENTOS DE REPRODUCAO
    // ============================================

    async listDocuments(harasId: string): Promise<ReproductionDocument[]> {
        const { data, error } = await supabase
            .from('reproduction_documents')
            .select(REPRODUCTION_DOCUMENT_SELECT)
            .eq('haras_id', harasId)
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error);

        return data as ReproductionDocument[];
    },

    async createDocument(input: CreateReproductionDocumentInput): Promise<ReproductionDocument> {
        const { data, error } = await supabase
            .from('reproduction_documents')
            .insert(input)
            .select(REPRODUCTION_DOCUMENT_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as ReproductionDocument;
    },

    // ============================================
    // PROTOCOLOS
    // ============================================

    async listProtocols(harasId: string): Promise<ReproductionProtocol[]> {
        const { data, error } = await supabase
            .from('reproduction_protocols')
            .select(REPRODUCTION_PROTOCOL_WITH_STEPS_SELECT)
            .eq('haras_id', harasId)
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error);

        return ((data || []) as ReproductionProtocolRow[]).map(mapProtocolRow);
    },

    async createProtocol(
        input: CreateReproductionProtocolInput,
        steps: CreateReproductionProtocolStepInput[] = []
    ): Promise<ReproductionProtocol> {
        const { data: protocol, error } = await supabase
            .from('reproduction_protocols')
            .insert(input)
            .select(REPRODUCTION_PROTOCOL_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        if (steps.length > 0 && protocol?.id) {
            const payload = steps.map((step, index) => ({
                protocol_id: protocol.id,
                name: step.name,
                day_offset: step.day_offset,
                description: step.description ?? null,
                step_type: step.step_type,
                sort_order: step.sort_order ?? index,
            }));

            const { error: stepsError } = await supabase
                .from('reproduction_protocol_steps')
                .insert(payload);

            if (stepsError) handleSupabaseError(stepsError);
        }

        return protocol as ReproductionProtocol;
    },

    async updateProtocol(id: string, input: Partial<CreateReproductionProtocolInput>): Promise<ReproductionProtocol> {
        const { data, error } = await supabase
            .from('reproduction_protocols')
            .update(input)
            .eq('id', id)
            .select(REPRODUCTION_PROTOCOL_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as ReproductionProtocol;
    },

    async replaceProtocolSteps(
        protocolId: string,
        steps: CreateReproductionProtocolStepInput[]
    ): Promise<void> {
        const { error: deleteError } = await supabase
            .from('reproduction_protocol_steps')
            .delete()
            .eq('protocol_id', protocolId);

        if (deleteError) handleSupabaseError(deleteError);

        if (steps.length > 0) {
            const payload = steps.map((step, index) => ({
                protocol_id: protocolId,
                name: step.name,
                day_offset: step.day_offset,
                description: step.description ?? null,
                step_type: step.step_type,
                sort_order: step.sort_order ?? index,
            }));

            const { error: insertError } = await supabase
                .from('reproduction_protocol_steps')
                .insert(payload);

            if (insertError) handleSupabaseError(insertError);
        }
    },

    async deleteProtocol(id: string): Promise<void> {
        const { error } = await supabase
            .from('reproduction_protocols')
            .delete()
            .eq('id', id);

        if (error) handleSupabaseError(error);
    },

    async applyProtocol(input: CreateReproductionProtocolApplicationInput): Promise<ReproductionProtocolApplication> {
        const { data, error } = await supabase
            .from('reproduction_protocol_applications')
            .insert({
                haras_id: input.haras_id,
                protocol_id: input.protocol_id,
                animal_id: input.animal_id,
                start_date: input.start_date,
                status: input.status ?? 'ativo',
                notes: input.notes ?? null,
            })
            .select(REPRODUCTION_PROTOCOL_APPLICATION_SELECT)
            .single();

        if (error) handleSupabaseError(error);

        return data as ReproductionProtocolApplication;
    },

    async listProtocolApplications(harasId: string): Promise<ReproductionProtocolApplication[]> {
        const { data, error } = await supabase
            .from('reproduction_protocol_applications')
            .select(REPRODUCTION_PROTOCOL_APPLICATION_SELECT)
            .eq('haras_id', harasId)
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error);

        return data as ReproductionProtocolApplication[];
    }
};
