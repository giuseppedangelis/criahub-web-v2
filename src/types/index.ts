// ============================================
// TIPOS CENTRALIZADOS DO CRIAHUB
// Baseados no schema do Supabase
// ============================================

// ============================================
// ENUMS
// ============================================

export type UserRole = 'admin' | 'criador' | 'assessor' | 'acessor';

export type AnimalSex = 'Macho' | 'Fêmea';

// Frontend category values (lowercase, no accents)
export type AnimalCategory =
    | 'potro'
    | 'potra'
    | 'garanhao'
    | 'egua'
    | 'castrado';

// Database category values (as stored in Supabase - with accents)
export type AnimalCategoryDb =
    | 'Potro'
    | 'Potranca'
    | 'Garanhão'
    | 'Égua'
    | 'Castrado';

export type AnimalStatus =
    | 'ativo'
    | 'vendido'
    | 'morto'
    | 'emprestado'
    | 'em_servico';

export type ReproductiveEventType =
    | 'cobertura'
    | 'inseminacao'
    | 'coleta_ovulos'
    | 'transferencia_embriao'
    | 'ovulacao'
    | 'diagnostico_gestacao'
    | 'aplicacao_p4';

export type GestationStatus =
    | 'confirmada'
    | 'em_andamento'
    | 'nascimento'
    | 'aborto'
    | 'reabsorvida';

export type TransactionType = 'receita' | 'despesa';

export type TransactionCategory =
    | 'venda_animal'
    | 'servico_reproducao'
    | 'premiacao'
    | 'alimentacao'
    | 'veterinario'
    | 'medicamento'
    | 'equipamento'
    | 'funcionario'
    | 'infraestrutura'
    | 'outros';

export type ServiceOrderStatus =
    | 'pendente'
    | 'em_andamento'
    | 'concluido'
    | 'cancelado';

export type TaskStatus =
    | 'pendente'
    | 'em_andamento'
    | 'concluida';

export type TaskPriority =
    | 'baixa'
    | 'media'
    | 'alta';

export type NotificationType =
    | 'saude'
    | 'reproducao'
    | 'financeiro'
    | 'geral'
    | 'sistema';

export type AgendaEventType =
    | 'Serviço'
    | 'Evento'
    | 'Veterinário'
    | 'Casqueamento'
    | 'Dentista'
    | 'Aplicação P4'
    | 'Coleta Embrião'
    | 'Diagnóstico Gestação'
    | 'Outro';

export type AgendaEventStatus = 'Pendente' | 'Concluído' | 'Cancelado';

export type AnimalVideoVisibility = 'Público' | 'Privado';

export type AnimalVideoSource = 'upload' | 'youtube' | 'vimeo' | 'link';

export type AnimalLocationType = 'Baia' | 'Pasto' | 'Servico';

export type AnimalServiceType = 'Reproducao' | 'Trabalho' | 'Repouso' | 'Outro';

export type ReportType =
    | 'animal'
    | 'plantel'
    | 'financeiro'
    | 'saude'
    | 'premiacoes'
    | 'reproducao';

export type ReportStatus = 'Gerado' | 'Agendado' | 'Processando' | 'Erro';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'docx' | 'html';

// ============================================
// ENTIDADES BASE
// ============================================

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    role: UserRole;
    haras_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Haras {
    id: string;
    name: string;
    owner_id: string;
    cnpj: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
    subscription_plan: string;
    subscription_status: string;
    subscription_due_date?: string | null;
    subscription_value?: string | number | null;
    subscription_start_date?: string | null;
    created_at: string;
    updated_at: string;
}

export interface HarasMember {
    id: string;
    haras_id: string;
    user_id: string;
    role: 'owner' | 'manager' | 'employee';
    permissions: Record<string, boolean>;
    created_at: string;
}

export interface Animal {
    id: string;
    haras_id: string;
    name: string;
    registry_number: string | null;
    chip_number: string | null;
    brand: string | null;
    sex: AnimalSex;
    category: AnimalCategory;
    birth_date: string | null;
    coat_color: string | null;
    status: AnimalStatus;
    father_id: string | null;
    mother_id: string | null;
    origin_haras: string | null;
    location: string | null;
    observations: string | null;
    main_image_url: string | null;
    images: string[];
    documents?: string[];
    weight: number | null;
    height: number | null;
    father_name: string | null;
    mother_name: string | null;
    created_at: string;
    updated_at: string;
    // Relacionamentos (quando carregados)
    father?: Animal | null;
    mother?: Animal | null;
    haras?: Haras | null;
}

export interface AnimalVideo {
    id: string;
    animal_id: string;
    haras_id: string | null;
    title: string;
    url: string;
    source: AnimalVideoSource;
    type: string | null;
    visibility: AnimalVideoVisibility;
    caption: string | null;
    duration: string | null;
    thumbnail_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface GenealogyNode {
    id: string;
    name: string;
    registry_number: string | null;
    main_image_url: string | null;
    father_id: string | null;
    mother_id: string | null;
    father_name?: string | null;
    mother_name?: string | null;
}

export interface AnimalGenealogy {
    root: GenealogyNode | null;
    nodes: Record<string, GenealogyNode>;
}

export interface AnimalLocationHistory {
    id: string;
    animal_id: string;
    haras_id: string;
    location_type: AnimalLocationType;
    location_name: string;
    service_type: AnimalServiceType | null;
    previous_location: string | null;
    new_location: string;
    reason: string | null;
    notes: string | null;
    changed_at: string;
    changed_by: string | null;
    changed_by_name?: string | null;
    created_at: string;
}

export interface HealthRecord {
    id: string;
    animal_id: string;
    haras_id: string;
    procedure_date: string;
    type: string;
    veterinarian: string | null;
    description: string | null;
    cost: number | null;
    next_date: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
}

export interface VaccineRecord {
    id: string;
    animal_id: string;
    haras_id: string;
    name: string;
    application_date: string;
    next_dose_date: string | null;
    lot: string | null;
    manufacturer: string | null;
    veterinarian: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
}

export interface ExamRecord {
    id: string;
    animal_id: string;
    haras_id: string;
    exam_type: string;
    exam_date: string;
    veterinarian: string | null;
    laboratory: string | null;
    result: string | null;
    file_urls: string[] | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReproductiveEvent {
    id: string;
    haras_id: string;
    animal_id: string;
    event_type: ReproductiveEventType;
    event_date: string;
    stallion_id: string | null;
    mare_id: string | null;
    veterinarian: string | null;
    protocol: string | null;
    observations: string | null;
    status?: string | null;
    semen_type?: string | null;
    details?: Record<string, unknown> | null;
    auto_generated?: boolean | null;
    priority?: string | null;
    created_at: string;
    updated_at: string;
    // Relacionamentos
    animal?: Animal | null;
    stallion?: Animal | null;
    mare?: Animal | null;
}

export interface Gestation {
    id: string;
    haras_id: string;
    mare_id: string;
    donor_mare_id?: string | null;
    stallion_id: string | null;
    reproductive_event_id: string | null;
    start_date: string;
    confirmation_date?: string | null;
    expected_birth_date: string | null;
    actual_birth_date: string | null;
    status: GestationStatus;
    foal_id: string | null;
    veterinarian?: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    // Relacionamentos
    mare?: Animal | null;
    stallion?: Animal | null;
    foal?: Animal | null;
}

export interface Transaction {
    id: string;
    haras_id: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string;
    animal_id: string | null;
    reference_id?: string | null;
    created_by?: string | null;
    created_at: string | null;
    updated_at: string | null;
    observations?: string | null;
    payment_method?: string | null;
    // Relacionamentos
    animal?: Animal | null;
    created_by_profile?: Profile | null;
}

export interface ServiceOrder {
    id: string;
    haras_id: string;
    client_haras_id: string;
    animal_id: string;
    service_type: string;
    status: ServiceOrderStatus;
    price: number;
    start_date: string;
    end_date: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    // Relacionamentos
    animal?: Animal | null;
    haras?: Haras | null;
    client_haras?: Haras | null;
}

export interface TaskDocument {
    id: string;
    name: string;
    size: string;
    url?: string | null;
}

export interface TaskPhoto {
    id: string;
    name: string;
    url?: string | null;
}

export interface Task {
    id: string;
    task_number: number | null;
    haras_id: string;
    title: string;
    due_date: string;
    status: TaskStatus;
    priority: TaskPriority;
    observations?: string | null;
    animal_id?: string | null;
    responsible_id?: string | null;
    documents?: TaskDocument[] | null;
    photos?: TaskPhoto[] | null;
    created_by?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    animal?: {
        id: string;
        name?: string | null;
    } | null;
    responsible?: {
        id: string;
        full_name?: string | null;
        email?: string | null;
    } | null;
}

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    data: Record<string, unknown> | null;
    created_at: string;
}

export interface AgendaEventDetails {
    category?: string;
    categoryLabel?: string;
    categoryColor?: string;
    time?: string;
    endTime?: string;
    city?: string;
    state?: string;
    organizer?: string;
    link?: string;
    reminders?: string[];
    veterinarian?: string;
    veterinarianId?: string;
    relatedAnimalIds?: string[];
}

export interface AgendaEvent {
    id: string;
    haras_id: string;
    title: string;
    type: AgendaEventType;
    start_date: string;
    end_date?: string | null;
    description?: string | null;
    location?: string | null;
    status?: AgendaEventStatus | null;
    animal_id?: string | null;
    auto_generated?: boolean | null;
    origin?: string | null;
    origin_id?: string | null;
    observations?: string | null;
    responsible?: string | null;
    details?: AgendaEventDetails | null;
    animal?: {
        id: string;
        name?: string;
        registry_number?: string | null;
    } | null;
}

export interface Report {
    id: string;
    haras_id: string;
    name: string;
    type: ReportType;
    format: ReportFormat;
    status: ReportStatus;
    parameters?: Record<string, unknown> | null;
    file_url?: string | null;
    size_bytes?: number | null;
    scheduled_for?: string | null;
    created_by?: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface VeterinaryProcedure {
    id: string;
    haras_id: string;
    animal_id: string;
    procedure_type: string;
    procedure_date: string;
    veterinarian: string | null;
    description: string | null;
    cost: number | null;
    next_date: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    // Relacionamentos
    animal?: Animal | null;
}

export interface Award {
    id: string;
    haras_id: string;
    animal_id: string;
    event_name: string;
    event_date: string;
    category: string;
    position: number;
    description: string | null;
    created_at: string;
    // Relacionamentos
    animal?: Animal | null;
}

export interface Show {
    id: string;
    name: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    description: string | null;
    created_at: string;
}

export interface Auction {
    id: string;
    name: string;
    location: string | null;
    date: string;
    description: string | null;
    created_at: string;
}

// ============================================
// TIPOS PARA FORMULÁRIOS (CREATE/UPDATE)
// ============================================

export interface CreateAnimalInput {
    haras_id: string;
    name: string;
    registry_number?: string;
    chip_number?: string;
    brand?: string;
    sex: AnimalSex;
    category: AnimalCategory | string;
    birth_date?: string;
    coat_color?: string;
    status?: AnimalStatus;
    father_id?: string;
    mother_id?: string;
    origin_haras?: string;
    location?: string;
    observations?: string;
    main_image_url?: string;
    images?: string[];
    documents?: string[];
    weight?: number;
    height?: number;
    father_name?: string;
    mother_name?: string;
    management_status?: string;
    service_type?: string;
    gait?: string;
}

export interface CreateAnimalVideoInput {
    animal_id: string;
    haras_id?: string;
    title: string;
    url: string;
    source?: AnimalVideoSource;
    type?: string;
    visibility?: AnimalVideoVisibility;
    caption?: string;
    duration?: string;
    thumbnail_url?: string;
}

export interface CreateAnimalLocationChangeInput {
    animal_id: string;
    haras_id?: string;
    location_type: AnimalLocationType;
    location_name: string;
    service_type?: AnimalServiceType | null;
    reason?: string;
    notes?: string;
    changed_at?: string;
    changed_by?: string | null;
}

export interface CreateHealthRecordInput {
    animal_id: string;
    haras_id?: string;
    procedure_date: string;
    type: string;
    veterinarian?: string | null;
    description?: string | null;
    cost?: number | null;
    next_date?: string | null;
    observations?: string | null;
}

export interface CreateVaccineInput {
    animal_id: string;
    haras_id?: string;
    name: string;
    application_date: string;
    next_dose_date?: string | null;
    lot?: string | null;
    manufacturer?: string | null;
    veterinarian?: string | null;
    observations?: string | null;
}

export interface CreateExamInput {
    animal_id: string;
    haras_id?: string;
    exam_type: string;
    exam_date: string;
    veterinarian?: string | null;
    laboratory?: string | null;
    result?: string | null;
    observations?: string | null;
    file_urls?: string[];
    files?: File[];
}

export interface UpdateAnimalVideoInput extends Partial<CreateAnimalVideoInput> {
    id: string;
}

export interface UpdateAnimalInput extends Partial<CreateAnimalInput> {
    id: string;
}

export interface CreateTransactionInput {
    haras_id: string;
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string;
    animal_id?: string;
    reference_id?: string;
    observations?: string;
    payment_method?: string;
}

export interface CreateAgendaEventInput {
    haras_id: string;
    title: string;
    type: AgendaEventType;
    start_date: string;
    end_date?: string;
    description?: string;
    location?: string;
    status?: AgendaEventStatus;
    animal_id?: string;
    auto_generated?: boolean;
    origin?: string;
    origin_id?: string;
    observations?: string;
    responsible?: string;
    details?: AgendaEventDetails;
}

export interface CreateReportInput {
    haras_id: string;
    name: string;
    type: ReportType;
    format: ReportFormat;
    status?: ReportStatus;
    parameters?: Record<string, unknown>;
    file_url?: string;
    size_bytes?: number;
    scheduled_for?: string;
    created_by?: string;
}

export interface CreateReproductiveEventInput {
    haras_id: string;
    animal_id: string;
    event_type: ReproductiveEventType;
    event_date: string;
    stallion_id?: string;
    mare_id?: string;
    veterinarian?: string;
    protocol?: string;
    observations?: string;
    status?: string;
    semen_type?: string;
    details?: Record<string, unknown>;
    auto_generated?: boolean;
    priority?: string;
}

export interface CreateGestationInput {
    haras_id: string;
    mare_id: string;
    donor_mare_id?: string;
    stallion_id?: string;
    reproductive_event_id?: string;
    start_date: string;
    confirmation_date?: string;
    expected_birth_date?: string;
    status?: GestationStatus;
    veterinarian?: string;
    observations?: string;
    diagnosis_type?: string;
    p4_interval?: number;
}

// ============================================
// TIPOS PARA FILTROS E QUERIES
// ============================================

export interface AnimalFilters {
    haras_id?: string;
    sex?: AnimalSex;
    category?: AnimalCategory;
    status?: AnimalStatus;
    search?: string;
}

export interface TransactionFilters {
    haras_id?: string;
    type?: TransactionType;
    category?: TransactionCategory;
    start_date?: string;
    end_date?: string;
    animal_id?: string;
}

export interface TaskFilters {
    haras_id?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    responsible_id?: string;
    animal_id?: string;
    search?: string;
}

export interface CreateTaskInput {
    haras_id: string;
    title: string;
    due_date: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    observations?: string | null;
    animal_id?: string | null;
    responsible_id?: string | null;
    documents?: TaskDocument[] | null;
    photos?: TaskPhoto[] | null;
    created_by?: string | null;
}

export interface UpdateTaskInput {
    title?: string;
    due_date?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    observations?: string | null;
    animal_id?: string | null;
    responsible_id?: string | null;
    documents?: TaskDocument[] | null;
    photos?: TaskPhoto[] | null;
}

export interface AgendaEventFilters {
    haras_id?: string;
    type?: AgendaEventType | AgendaEventType[];
    status?: AgendaEventStatus;
    start_date?: string;
    end_date?: string;
    animal_id?: string;
}

export interface ReportFilters {
    haras_id?: string;
    type?: ReportType;
    status?: ReportStatus;
    start_date?: string;
    end_date?: string;
}

export interface GestationFilters {
    haras_id?: string;
    status?: GestationStatus;
    mare_id?: string;
}

// ============================================
// REPRODUCAO - COBERTURAS, OVULOS, EMBRIOES, DOCUMENTOS, PROTOCOLOS
// ============================================

export type CoveringType =
    | 'Monta Natural'
    | 'Inseminação Artificial'
    | 'Transferência de Embrião';

export interface Covering {
    id: string;
    haras_id: string;
    mare_id: string;
    stallion_id: string;
    event_date: string;
    type: CoveringType;
    semen_type?: string | null;
    veterinarian?: string | null;
    observations?: string | null;
    created_at: string;
    updated_at: string;
    mare?: Animal | null;
    stallion?: Animal | null;
}

export interface CreateCoveringInput {
    haras_id: string;
    mare_id: string;
    stallion_id: string;
    event_date: string;
    type: CoveringType;
    semen_type?: string;
    veterinarian?: string;
    observations?: string;
}

export type OvuleQuality = 'excelente' | 'boa' | 'regular';

export interface Ovule {
    id: string;
    haras_id: string;
    donor_id: string;
    collection_date: string;
    quantity: number;
    available: number;
    quality: OvuleQuality | null;
    method: string | null;
    status: string | null;
    veterinarian: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    donor?: Animal | null;
}

export interface CreateOvuleInput {
    haras_id: string;
    donor_id: string;
    collection_date: string;
    quantity: number;
    available?: number;
    quality?: OvuleQuality;
    method?: string;
    status?: string;
    veterinarian?: string;
    observations?: string;
}

export type EmbryoGrade = 'A' | 'B' | 'C';
export type EmbryoStorageType = 'Fresco' | 'Congelado';

export interface Embryo {
    id: string;
    haras_id: string;
    donor_id: string;
    stallion_id: string | null;
    production_date: string;
    quantity: number;
    available: number;
    grade: EmbryoGrade | null;
    storage_type: EmbryoStorageType | null;
    method: string | null;
    status: string | null;
    veterinarian: string | null;
    observations: string | null;
    created_at: string;
    updated_at: string;
    donor?: Animal | null;
    stallion?: Animal | null;
}

export interface CreateEmbryoInput {
    haras_id: string;
    donor_id: string;
    stallion_id?: string;
    production_date: string;
    quantity: number;
    available?: number;
    grade?: EmbryoGrade;
    storage_type?: EmbryoStorageType;
    method?: string;
    status?: string;
    veterinarian?: string;
    observations?: string;
}

export interface ReproductionDocument {
    id: string;
    haras_id: string;
    animal_id: string | null;
    reproductive_event_id: string | null;
    gestation_id: string | null;
    ovule_id: string | null;
    embryo_id: string | null;
    title: string;
    document_type: string;
    file_url: string;
    file_name: string | null;
    file_size: number | null;
    file_type: string | null;
    created_by: string | null;
    created_at: string;
}

export interface CreateReproductionDocumentInput {
    haras_id: string;
    title: string;
    document_type: string;
    file_url: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    animal_id?: string;
    reproductive_event_id?: string;
    gestation_id?: string;
    ovule_id?: string;
    embryo_id?: string;
}

export type ReproductionProtocolType =
    | 'TE'
    | 'IATF'
    | 'Aspiração Folicular'
    | 'Personalizado';

export type ReproductionProtocolStepType =
    | 'Exame'
    | 'Aplicação'
    | 'Procedimento'
    | 'Coleta';

export interface ReproductionProtocol {
    id: string;
    haras_id: string;
    name: string;
    type: ReproductionProtocolType;
    description: string | null;
    total_days: number | null;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    steps?: ReproductionProtocolStep[];
}

export interface ReproductionProtocolStep {
    id: string;
    protocol_id: string;
    name: string;
    day_offset: number;
    description: string | null;
    step_type: ReproductionProtocolStepType;
    sort_order: number | null;
    created_at: string;
}

export interface ReproductionProtocolApplication {
    id: string;
    haras_id: string;
    protocol_id: string;
    animal_id: string;
    start_date: string;
    status: 'ativo' | 'concluido' | 'cancelado';
    notes: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    protocol?: ReproductionProtocol | null;
    animal?: Animal | null;
}

export interface CreateReproductionProtocolInput {
    haras_id: string;
    name: string;
    type: ReproductionProtocolType;
    description?: string;
    total_days?: number;
    is_active?: boolean;
}

export interface CreateReproductionProtocolStepInput {
    protocol_id?: string;
    name: string;
    day_offset: number;
    description?: string;
    step_type: ReproductionProtocolStepType;
    sort_order?: number;
}

export interface CreateReproductionProtocolApplicationInput {
    haras_id: string;
    protocol_id: string;
    animal_id: string;
    start_date: string;
    status?: 'ativo' | 'concluido' | 'cancelado';
    notes?: string;
}

// ============================================
// TIPOS PARA PAGINAÇÃO
// ============================================

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// ============================================
// TIPOS PARA DASHBOARD E ESTATÍSTICAS
// ============================================

export interface DashboardStats {
    totalAnimals: number;
    totalMales: number;
    totalFemales: number;
    activeGestations: number;
    pendingServices: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    recentNotifications: number;
}

export interface ReproductionStats {
    totalGestations: number;
    confirmedGestations: number;
    births: number;
    abortions: number;
    successRate: number;
}

export interface FinancialSummary {
    totalRevenue: number;
    totalExpenses: number;
    balance: number;
    revenueByCategory: Record<TransactionCategory, number>;
    expensesByCategory: Record<TransactionCategory, number>;
}
