// ============================================
// TIPOS CENTRALIZADOS DO CRIAHUB
// Baseados no schema do Supabase
// ============================================

// ============================================
// ENUMS
// ============================================

export type UserRole = 'admin' | 'criador' | 'assessor';

export type AnimalSex = 'M' | 'F';

export type AnimalCategory =
    | 'potro'
    | 'potra'
    | 'garanhao'
    | 'egua'
    | 'castrado';

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
    | 'transferencia_embriao';

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

export type NotificationType =
    | 'saude'
    | 'reproducao'
    | 'financeiro'
    | 'geral'
    | 'sistema';

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
    created_at: string;
    updated_at: string;
    // Relacionamentos (quando carregados)
    father?: Animal | null;
    mother?: Animal | null;
    haras?: Haras | null;
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
    stallion_id: string | null;
    reproductive_event_id: string | null;
    start_date: string;
    expected_birth_date: string | null;
    actual_birth_date: string | null;
    status: GestationStatus;
    foal_id: string | null;
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
    reference_id: string | null;
    created_by: string;
    created_at: string;
    updated_at: string;
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
    category: AnimalCategory;
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
}

export interface CreateGestationInput {
    haras_id: string;
    mare_id: string;
    stallion_id?: string;
    reproductive_event_id?: string;
    start_date: string;
    expected_birth_date?: string;
    status?: GestationStatus;
    observations?: string;
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

export interface GestationFilters {
    haras_id?: string;
    status?: GestationStatus;
    mare_id?: string;
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
