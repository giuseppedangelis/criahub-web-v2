// ============================================
// ANIMALS SERVICE
// Gerencia operações com animais
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type { Database, Json } from '@/types/database.types';
import * as XLSX from 'xlsx';
import { decode } from 'html-entities';
import { getPlantelStatusActivity, normalizeAnimalStatus } from '@/lib/animal-classification';
import type {
    Animal,
    AnimalEnvironment,
    AnimalOwnershipShare,
    AnimalSex,
    AnimalGenealogy,
    AnimalFilters,
    CreateAnimalInput,
    SaveAnimalOwnershipSharesInput,
    UpdateAnimalInput,
    PaginationParams,
    PaginatedResponse,
    GenealogyNode,
    ABCCMMImportResult,
    AnimalLinkQueueItem,
    CondominiumShareImportResult,
    AwardImportResult
} from '@/types';

const CATEGORY_MAPPING: Record<string, string> = {
    'potro': 'Potro',
    'potra': 'Potra',
    'garanhao': 'Garanhão',
    'egua': 'Égua',
    'castrado': 'Castrado'
};

// Reverse mapping: database values -> frontend values
const DB_TO_FRONTEND_CATEGORY: Record<string, string> = {
    'Potro': 'potro',
    'Potra': 'potra',
    'Potranca': 'potra', // legado — tolerância caso volte algum valor antigo
    'Garanhão': 'garanhao',
    'Égua': 'egua',
    'Castrado': 'castrado'
};

const REVERSE_CATEGORY_MAPPING: Record<string, string> = Object.entries(CATEGORY_MAPPING).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as Record<string, string>);

// Helper function to map frontend category to database category
function mapCategoryToDb(category: string): string {
    return CATEGORY_MAPPING[category] || category;
}

// Helper function to map database category to frontend category  
function mapCategoryFromDb(dbCategory: string): string {
    return DB_TO_FRONTEND_CATEGORY[dbCategory] || dbCategory;
}

function deriveReproductionTypeFromCategory(category?: string | null): 'Doadora' | 'Matriz' | 'Garanhão' | 'Castrado' | 'Receptora' | undefined {
    if (!category) return undefined;

    const key = String(category)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');

    if (key.includes('garanhao')) return 'Garanhão';
    if (key.includes('egua')) return 'Matriz';
    if (key.includes('castrado')) return 'Castrado';
    if (key.includes('doadora')) return 'Doadora';
    if (key.includes('receptora')) return 'Receptora';

    return undefined;
}

function parseStatusManejo(value: string | null | undefined): { motivo?: string; data?: string } | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!trimmed.startsWith('{')) return null;
    try {
        const parsed = JSON.parse(trimmed) as { motivo?: string; data?: string };
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

// Mapeamento do status do banco para o frontend
const STATUS_MAPPING: Record<string, string> = {
    'Ativo': 'ativo',
    'ativo': 'ativo',
    'Provisorio': 'provisorio',
    'Provisório': 'provisorio',
    'provisorio': 'provisorio',
    'Vendido': 'vendido',
    'vendido': 'vendido',
    'Falecido': 'morto',
    'morto': 'morto',
    'Transferido': 'emprestado',
    'transferido': 'emprestado',
    'emprestado': 'emprestado',
    'Em serviço': 'em_servico',
    'Em servico': 'em_servico',
    'em_servico': 'em_servico'
};

const REVERSE_STATUS_MAPPING: Record<string, string> = {
    'ativo': 'Ativo',
    'provisorio': 'Provisório',
    'vendido': 'Vendido',
    'morto': 'Falecido',
    'emprestado': 'Transferido',
    'em_servico': 'Em serviço'
};

const GENEALOGY_SELECT_FIELDS = `
    id, abccmm_rowid, nome, registro, foto_url, images, pai_id, mae_id, father_name, mother_name, dados_genealogicos
`;

const ABCCMM_BATCH_SIZE = 400;

type SpreadsheetRow = Record<string, unknown>;

interface NormalizedABCCMMRow {
    rowid: string;
    nome: string;
    sexo: AnimalSex;
    dataNascimento: string | null;
    registro: string;
    pelagem: string | null;
    chip: string | null;
    criador: string | null;
    proprietario: string | null;
    paiRowId: string | null;
    maeRowId: string | null;
    paiNome: string | null;
    paiRegistro: string | null;
    maeNome: string | null;
    maeRegistro: string | null;
    dadosGenealogicos: ExtendedGenealogyData | null;
}

interface AncestralNode {
    rowid: string | null;
    nome: string | null;
    registro: string | null;
}

interface ExtendedGenealogyData {
    pais: {
        paterno_pai: AncestralNode | null;
        materno_mae: AncestralNode | null;
    };
    avos: {
        paterno_pai: AncestralNode | null;
        paterno_mae: AncestralNode | null;
        materno_pai: AncestralNode | null;
        materno_mae: AncestralNode | null;
    };
    bisavos: {
        paipai_pai: AncestralNode | null;
        paipai_mae: AncestralNode | null;
        maepai_pai: AncestralNode | null;
        maepai_mae: AncestralNode | null;
        paimae_pai: AncestralNode | null;
        paimae_mae: AncestralNode | null;
        maemae_pai: AncestralNode | null;
        maemae_mae: AncestralNode | null;
    };
}

interface ParsedABCCMMRow {
    line: number;
    data: NormalizedABCCMMRow;
}

interface AnimalSeed {
    rowid: string;
    registro: string;
    nome: string;
    sexo: AnimalSex;
}

interface GenealogyLinkSeed {
    rowid: string;
    registro: string;
    paiRowId: string | null;
    maeRowId: string | null;
    paiNome: string | null;
    maeNome: string | null;
    paiRegistro: string | null;
    maeRegistro: string | null;
    dataNascimento?: string | null;
    chip?: string | null;
    pelagem?: string | null;
    criador?: string | null;
    proprietario?: string | null;
    dadosGenealogicos?: ExtendedGenealogyData | null;
}

function normalizeSpaces(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

function normalizeOfficialText(value: unknown): string {
    if (typeof value !== 'string') return '';
    const decoded = decode(decode(String(value)));
    const normalized = normalizeSpaces(decoded);
    return normalized ? normalized.toUpperCase() : '';
}

function normalizeEntityName(value: unknown): string | null {
    const decoded = decode(String(value ?? ''));
    const normalized = normalizeSpaces(decoded).toUpperCase();
    return normalized || null;
}

function normalizeRegistro(value: unknown): string {
    if (value === null || value === undefined) return '';
    const raw = typeof value === 'string' ? value : String(value);
    return normalizeSpaces(raw).toUpperCase();
}

async function resolveEnvironmentAnimalIds(filters: Pick<AnimalFilters, 'haras_id' | 'environment'>): Promise<string[] | null> {
    if (!filters.haras_id) return null;

    if (filters.environment === 'condominio') {
        const { data: shares, error: sharesError } = await (supabase as any)
            .from('animal_ownership_shares')
            .select('animal_id')
            .eq('haras_id', filters.haras_id)
            .or(`end_date.is.null,end_date.gte.${new Date().toISOString().slice(0, 10)}`);

        if (sharesError) handleSupabaseError(sharesError);

        return Array.from(new Set((shares || []).map((row: { animal_id: string }) => row.animal_id)));
    }

    if (filters.environment === 'vinculacao') {
        const { data: queueRows, error: queueError } = await (supabase as any)
            .from('animal_link_queue')
            .select('provisional_animal_id')
            .eq('haras_id', filters.haras_id)
            .eq('status', 'pending');

        if (queueError) handleSupabaseError(queueError);

        return Array.from(new Set((queueRows || []).map((row: { provisional_animal_id: string }) => row.provisional_animal_id)));
    }

    return null;
}

function applyAnimalListFilters(query: any, filters: AnimalFilters, environmentAnimalIds: string[] | null): any {
    let nextQuery = query;

    if (filters.haras_id) {
        nextQuery = nextQuery.eq('haras_id', filters.haras_id);
    }
    if (filters.environment === 'oficial') {
        nextQuery = nextQuery.not('abccmm_rowid', 'is', null);
    }
    if (filters.environment === 'avulsos') {
        nextQuery = nextQuery.is('abccmm_rowid', null);
    }
    if (environmentAnimalIds && environmentAnimalIds.length > 0) {
        nextQuery = nextQuery.in('id', environmentAnimalIds);
    }
    if (filters.sex) {
        nextQuery = nextQuery.eq('sexo', filters.sex);
    }
    if (filters.category) {
        nextQuery = nextQuery.eq('categoria', CATEGORY_MAPPING[filters.category] || filters.category);
    }
    if (filters.status) {
        const normalizedStatus = normalizeAnimalStatus(filters.status);
        const dbStatus = normalizedStatus ? REVERSE_STATUS_MAPPING[normalizedStatus] : filters.status;
        const possibleStatusValues = Array.from(
            new Set([dbStatus, normalizedStatus, filters.status].filter(Boolean))
        );
        if (possibleStatusValues.length === 1) {
            nextQuery = nextQuery.eq('status', possibleStatusValues[0] as string);
        } else {
            nextQuery = nextQuery.in('status', possibleStatusValues as string[]);
        }
    }
    if (filters.activity_status === 'ativo') {
        nextQuery = nextQuery.not('status', 'in', '("Vendido","Óbito","Falecido")');
    }
    if (filters.activity_status === 'inativo') {
        nextQuery = nextQuery.in('status', ['Vendido', 'Óbito', 'Falecido']);
    }
    if (filters.search) {
        const search = filters.search.trim();
        if (search) {
            nextQuery = nextQuery.or(`nome.ilike.%${search}%,registro.ilike.%${search}%,chip.ilike.%${search}%`);
        }
    }
    if (filters.birth_date_from) {
        nextQuery = nextQuery.gte('data_nascimento', filters.birth_date_from);
    }
    if (filters.birth_date_to) {
        nextQuery = nextQuery.lte('data_nascimento', filters.birth_date_to);
    }

    return nextQuery;
}

function normalizeNameKey(value: string | null | undefined): string {
    if (!value) return '';
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function isValidRegistro(registro: string | null | undefined): registro is string {
    return Boolean(registro && registro !== '-');
}

function normalizeColumnName(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function normalizeSex(value: unknown): AnimalSex {
    const raw = normalizeSpaces(String(value ?? '')).toUpperCase();
    if (raw.startsWith('F')) return 'Fêmea';
    if (raw.startsWith('M')) return 'Macho';
    return 'Macho';
}

function normalizeChip(value: unknown): string | null {
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) return null;
        return Math.trunc(value).toLocaleString('fullwide', { useGrouping: false });
    }

    const raw = normalizeSpaces(String(value ?? '').trim());
    if (!raw) return null;

    if (/[eE]\+/.test(raw)) {
        const numeric = Number(raw);
        if (!Number.isFinite(numeric)) return null;
        return numeric.toLocaleString('fullwide', { useGrouping: false });
    }

    return raw;
}

function extractAncestorNode(normalized: Record<string, unknown>, baseColumn: string): AncestralNode | null {
    const rowid = normalizeSpaces(String(normalized[baseColumn] ?? '').trim()) || null;
    const nome = normalizeEntityName(normalized[`${baseColumn}nome`]);
    const registro = normalizeRegistro(normalized[`${baseColumn}registro`]) || null;

    if (!rowid && !nome && !registro) return null;

    return {
        rowid,
        nome,
        registro,
    };
}

function buildExtendedGenealogyData(normalized: Record<string, unknown>): ExtendedGenealogyData | null {
    const pais = {
        paterno_pai: extractAncestorNode(normalized, 'pai'),
        materno_mae: extractAncestorNode(normalized, 'mae'),
    };

    const avos = {
        paterno_pai: extractAncestorNode(normalized, 'paipai'),
        paterno_mae: extractAncestorNode(normalized, 'maepai'),
        materno_pai: extractAncestorNode(normalized, 'paimae'),
        materno_mae: extractAncestorNode(normalized, 'maemae'),
    };

    const bisavos = {
        paipai_pai: extractAncestorNode(normalized, 'paipaipai'),
        paipai_mae: extractAncestorNode(normalized, 'maepaipai'),
        maepai_pai: extractAncestorNode(normalized, 'paimaepai'),
        maepai_mae: extractAncestorNode(normalized, 'maemaepai'),
        paimae_pai: extractAncestorNode(normalized, 'paipaimae'),
        paimae_mae: extractAncestorNode(normalized, 'maepaimae'),
        maemae_pai: extractAncestorNode(normalized, 'paimaemae'),
        maemae_mae: extractAncestorNode(normalized, 'maemaemae'),
    };

    const hasAnyPais = Object.values(pais).some(Boolean);
    const hasAnyAvos = Object.values(avos).some(Boolean);
    const hasAnyBisavos = Object.values(bisavos).some(Boolean);

    if (!hasAnyPais && !hasAnyAvos && !hasAnyBisavos) return null;

    return {
        pais,
        avos,
        bisavos,
    };
}

function parseAbccmmDate(value: unknown): string | null {
    if (value === null || value === undefined || value === '') return null;

    if (typeof value === 'number') {
        const parsed = XLSX.SSF.parse_date_code(value);
        if (!parsed) return null;
        const month = String(parsed.m).padStart(2, '0');
        const day = String(parsed.d).padStart(2, '0');
        return `${parsed.y}-${month}-${day}`;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const ddmmyyyy = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (ddmmyyyy) {
            const [, dd, mm, yyyy] = ddmmyyyy;
            return `${yyyy}-${mm}-${dd}`;
        }

        const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (iso) return trimmed;

        const parsedDate = new Date(trimmed);
        if (!Number.isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString().slice(0, 10);
        }
    }

    return null;
}

function parseMonthYearPeriod(value: unknown): string | null {
    if (value === null || value === undefined || value === '') return null;
    const raw = String(value).trim();
    if (!raw) return null;

    const mmYYYY = raw.match(/^(\d{1,2})\/(\d{4})$/);
    if (mmYYYY) {
        const month = String(Number(mmYYYY[1])).padStart(2, '0');
        const year = mmYYYY[2];
        return `${year}-${month}-01`;
    }

    return parseAbccmmDate(raw);
}

function makeImportHash(parts: Array<string | null | undefined>): string {
    const normalized = parts.map((part) => normalizeSpaces(String(part || '').toUpperCase())).join('|');
    return normalized;
}

function getCategoryBySex(sex: AnimalSex): string {
    return sex === 'Fêmea' ? 'Égua' : 'Garanhão';
}

function chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

function mergeSeed(current: AnimalSeed | undefined, incoming: AnimalSeed): AnimalSeed {
    if (!current) return incoming;
    return {
        rowid: current.rowid,
        registro: current.registro,
        nome: incoming.nome || current.nome,
        sexo: incoming.sexo || current.sexo,
    };
}

function mergeLinkSeed(current: GenealogyLinkSeed | undefined, incoming: GenealogyLinkSeed): GenealogyLinkSeed {
    if (!current) return incoming;
    return {
        rowid: current.rowid,
        registro: current.registro,
        paiRowId: current.paiRowId || incoming.paiRowId,
        maeRowId: current.maeRowId || incoming.maeRowId,
        paiNome: current.paiNome || incoming.paiNome,
        maeNome: current.maeNome || incoming.maeNome,
        paiRegistro: current.paiRegistro || incoming.paiRegistro,
        maeRegistro: current.maeRegistro || incoming.maeRegistro,
        dataNascimento: current.dataNascimento ?? incoming.dataNascimento ?? null,
        chip: current.chip ?? incoming.chip ?? null,
        pelagem: current.pelagem ?? incoming.pelagem ?? null,
        criador: current.criador ?? incoming.criador ?? null,
        proprietario: current.proprietario ?? incoming.proprietario ?? null,
        dadosGenealogicos: current.dadosGenealogicos ?? incoming.dadosGenealogicos ?? null,
    };
}

function normalizeRowKeys(row: SpreadsheetRow): Record<string, unknown> {
    return Object.entries(row).reduce((acc, [key, value]) => {
        acc[normalizeColumnName(key)] = value;
        return acc;
    }, {} as Record<string, unknown>);
}

function parseMainRow(normalized: Record<string, unknown>): NormalizedABCCMMRow | null {
    const rowid = normalizeSpaces(String(normalized.rowid ?? normalized._rowid ?? '').trim());
    if (!rowid) return null;

    const registro = normalizeRegistro(normalized.registro);
    const nomeDecoded = decode(String(normalized.nomeanimal ?? normalized.nome ?? ''));
    const nome = normalizeSpaces(nomeDecoded).toUpperCase() || registro || rowid;
    const sexo = normalizeSex(normalized.sexo);
    const dataNascimento = parseAbccmmDate(normalized.datanascto ?? normalized.datanascimento);
    const chipRaw = normalizeChip(normalized.chip);
    const pelagemRaw = normalizeOfficialText(normalized.pelagem);
    const criador = normalizeOfficialText(normalized.criador ?? normalized._criador) || null;
    const proprietario = normalizeOfficialText(normalized.proprietario ?? normalized._proprietario) || null;
    const paiNomeDecoded = decode(String(normalized.painome ?? ''));
    const maeNomeDecoded = decode(String(normalized.maenome ?? ''));
    const dadosGenealogicos = buildExtendedGenealogyData(normalized);

    return {
        rowid,
        registro,
        nome,
        sexo,
        dataNascimento,
        chip: chipRaw,
        pelagem: pelagemRaw || null,
        criador,
        proprietario,
        paiRowId: normalizeSpaces(String(normalized.pai ?? normalized._pai ?? '').trim()) || null,
        maeRowId: normalizeSpaces(String(normalized.mae ?? normalized._mae ?? '').trim()) || null,
        paiNome: normalizeSpaces(paiNomeDecoded).toUpperCase() || null,
        paiRegistro: normalizeRegistro(normalized.pairegistro) || null,
        maeNome: normalizeSpaces(maeNomeDecoded).toUpperCase() || null,
        maeRegistro: normalizeRegistro(normalized.maeregistro) || null,
        dadosGenealogicos,
    };
}

function mapGenealogyNode(row: any): GenealogyNode {
    const images = Array.isArray(row.images) ? row.images : [];
    const mainImage = row.foto_url || (images.length > 0 ? images[0] : null);

    return {
        id: row.id,
        abccmm_rowid: row.abccmm_rowid ?? null,
        name: row.nome,
        registry_number: row.registro ?? null,
        main_image_url: mainImage,
        father_id: row.pai_id ?? null,
        mother_id: row.mae_id ?? null,
        father_name: row.father_name ?? null,
        mother_name: row.mother_name ?? null,
        dados_genealogicos: row.dados_genealogicos ?? null,
        is_historical: false,
    };
}

interface GenealogyJsonData {
    pais?: {
        paterno_pai?: AncestralNode | null;
        materno_mae?: AncestralNode | null;
    };
    avos?: {
        paterno_pai?: AncestralNode | null;
        paterno_mae?: AncestralNode | null;
        materno_pai?: AncestralNode | null;
        materno_mae?: AncestralNode | null;
    };
    bisavos?: {
        paipai_pai?: AncestralNode | null;
        paipai_mae?: AncestralNode | null;
        maepai_pai?: AncestralNode | null;
        maepai_mae?: AncestralNode | null;
        paimae_pai?: AncestralNode | null;
        paimae_mae?: AncestralNode | null;
        maemae_pai?: AncestralNode | null;
        maemae_mae?: AncestralNode | null;
    };
}

interface GenealogySlotConfig {
    ancestor: AncestralNode | null | undefined;
    fatherSlot?: string;
    motherSlot?: string;
    fallbackName: string;
}

function parseGenealogyJson(data: unknown): GenealogyJsonData | null {
    if (!data || typeof data !== 'object') return null;
    return data as GenealogyJsonData;
}

function normalizeAncestorNode(entry: AncestralNode | null | undefined): AncestralNode | null {
    if (!entry) return null;
    const rowid = normalizeSpaces(String(entry.rowid ?? '').trim()) || null;
    const nome = normalizeEntityName(entry.nome);
    const registro = normalizeRegistro(entry.registro) || null;
    if (!rowid && !nome && !registro) return null;
    return { rowid, nome, registro };
}

function collectGenealogyRowIds(genealogy: GenealogyJsonData | null): string[] {
    if (!genealogy) return [];

    const buckets: Array<Record<string, AncestralNode | null | undefined> | undefined> = [
        genealogy.pais,
        genealogy.avos,
        genealogy.bisavos,
    ];

    return Array.from(
        new Set(
            buckets
                .flatMap((bucket) => Object.values(bucket || {}))
                .map((entry) => normalizeAncestorNode(entry)?.rowid)
                .filter((rowid): rowid is string => Boolean(rowid))
        )
    );
}

function buildHistoricalNodeId(slotKey: string, rowid: string | null): string {
    if (rowid) return `historical:${rowid}`;
    return `historical:${slotKey}`;
}

function createHistoricalGenealogyNode(params: {
    id: string;
    ancestor: AncestralNode;
    fatherId: string | null;
    motherId: string | null;
    fatherName: string | null;
    motherName: string | null;
    fallbackName: string;
}): GenealogyNode {
    return {
        id: params.id,
        abccmm_rowid: params.ancestor.rowid ?? null,
        name: params.ancestor.nome || params.fallbackName,
        registry_number: params.ancestor.registro ?? null,
        main_image_url: null,
        father_id: params.fatherId,
        mother_id: params.motherId,
        father_name: params.fatherName,
        mother_name: params.motherName,
        dados_genealogicos: null,
        is_historical: true,
    };
}

export const animalsService = {
    /**
     * Lista animais com filtros e paginação
     */
    async list(
        filters: AnimalFilters = {},
        pagination: PaginationParams = { page: 1, limit: 20 }
    ): Promise<PaginatedResponse<Animal>> {
        if (!filters.haras_id) {
            return formatPaginatedResponse([], 0, pagination);
        }

        const environmentAnimalIds = await resolveEnvironmentAnimalIds(filters);
        if (environmentAnimalIds && environmentAnimalIds.length === 0) {
            return formatPaginatedResponse([], 0, pagination);
        }

        let query = supabase
            .from('animals')
            .select(`
                id, abccmm_rowid, haras_id, nome, registro, chip,
                sexo, categoria, data_nascimento, pelagem, andamento,
                status, status_manejo, pai_id, mae_id, localizacao, piquete,
                height, weight, haras_origem, tipo_servico, para_venda, valor_venda,
                foto_url, images, documents, observacoes, father_name, mother_name,
                criador, proprietario, is_at_haras, presence_manual_override,
                created_at, updated_at
            `, { count: 'exact' });

        query = applyAnimalListFilters(query, filters, environmentAnimalIds);

        // Ordenar e paginar
        query = query.order('nome', { ascending: true });
        query = applyPagination(query, pagination);

        const { data, error, count } = await query;

        if (error) handleSupabaseError(error);

        const mappedData = (data || []).map((item: any) => ({
            ...item,
            abccmm_rowid: item.abccmm_rowid,
            // Mapear para os nomes que o frontend espera
            name: item.nome,
            registry_number: item.registro,
            chip_number: item.chip,
            sex: item.sexo,
            birth_date: item.data_nascimento,
            coat_color: item.pelagem,
            gait: item.andamento,
            weight: item.weight,
            height: item.height,
            origin_haras: item.haras_origem,
            status: STATUS_MAPPING[item.status] || normalizeAnimalStatus(item.status) || item.status?.toLowerCase(),
            father_id: item.pai_id,
            mother_id: item.mae_id,
            location: item.localizacao,
            management_status: item.status === 'Ativo' ? 'ativo' : 'inativo',
            service_type: item.tipo_servico,
            father_name: item.father_name,
            mother_name: item.mother_name,
            criador: item.criador,
            proprietario: item.proprietario,
            observations: item.observacoes,
            main_image_url: item.foto_url,
            images: item.images || (item.foto_url ? [item.foto_url] : []),
            documents: item.documents || [],
            category: REVERSE_CATEGORY_MAPPING[item.categoria] || item.categoria,
            _raw_status: item.status,
            environment: item.abccmm_rowid ? 'oficial' : 'avulsos',
        }));

        return formatPaginatedResponse(mappedData as Animal[], count || 0, pagination);
    },

    async getSummary(filters: AnimalFilters = {}): Promise<{
        total: number;
        males: number;
        females: number;
        active: number;
    }> {
        if (!filters.haras_id) {
            return { total: 0, males: 0, females: 0, active: 0 };
        }

        const environmentAnimalIds = await resolveEnvironmentAnimalIds(filters);
        if (environmentAnimalIds && environmentAnimalIds.length === 0) {
            return { total: 0, males: 0, females: 0, active: 0 };
        }

        const buildQuery = (extraFilters: Partial<AnimalFilters> = {}) =>
            applyAnimalListFilters(
                supabase
                    .from('animals')
                    .select('id', { count: 'exact', head: true }),
                { ...filters, ...extraFilters },
                environmentAnimalIds
            );

        const [
            { count: total, error: totalError },
            { count: males, error: malesError },
            { count: females, error: femalesError },
            { count: active, error: activeError },
        ] = await Promise.all([
            buildQuery(),
            buildQuery({ sex: 'Macho' }),
            buildQuery({ sex: 'Fêmea' }),
            buildQuery({ activity_status: 'ativo' }),
        ]);

        if (totalError) handleSupabaseError(totalError);
        if (malesError) handleSupabaseError(malesError);
        if (femalesError) handleSupabaseError(femalesError);
        if (activeError) handleSupabaseError(activeError);

        return {
            total: total || 0,
            males: males || 0,
            females: females || 0,
            active: active || 0,
        };
    },

    async getEnvironmentCounts(harasId: string): Promise<Record<AnimalEnvironment, number>> {
        if (!harasId) {
            return {
                oficial: 0,
                avulsos: 0,
                vinculacao: 0,
                condominio: 0,
            };
        }

        const [oficial, avulsos, vinculacao, condominio] = await Promise.all([
            this.getSummary({ haras_id: harasId, environment: 'oficial' }),
            this.getSummary({ haras_id: harasId, environment: 'avulsos' }),
            this.getSummary({ haras_id: harasId, environment: 'vinculacao' }),
            this.getSummary({ haras_id: harasId, environment: 'condominio' }),
        ]);

        return {
            oficial: oficial.total,
            avulsos: avulsos.total,
            vinculacao: vinculacao.total,
            condominio: condominio.total,
        };
    },

    /**
     * Busca um animal pelo ID com dados completos para a ficha do animal
     */
    async getById(id: string): Promise<Animal | null> {
        // Buscar dados do animal
        const { data: animalData, error: animalError } = await supabase
            .from('animals')
            .select(`
                id, haras_id, nome, registro, chip,
                sexo, categoria, data_nascimento, pelagem, andamento,
                status, status_manejo, pai_id, mae_id, localizacao, piquete,
                height, weight, haras_origem, tipo_servico, para_venda, valor_venda,
                foto_url, images, documents, observacoes, father_name, mother_name,
                criador, proprietario, is_at_haras, presence_manual_override,
                created_at, updated_at
            `)
            .eq('id', id)
            .single();

        if (animalError) {
            if (animalError.code === 'PGRST116') return null; // Not found
            handleSupabaseError(animalError);
        }

        if (!animalData) return null;

        const data = animalData as any;

        // Buscar dados do pai separadamente (se existir pai_id)
        let fatherData = null;
        if (data.pai_id) {
            const { data: father } = await supabase
                .from('animals')
                .select('id, nome, registro')
                .eq('id', data.pai_id)
                .single();
            if (father) {
                fatherData = {
                    id: father.id,
                    name: father.nome,
                    registry_number: father.registro
                };
            }
        }

        // Buscar dados da mãe separadamente (se existir mae_id)
        let motherData = null;
        if (data.mae_id) {
            const { data: mother } = await supabase
                .from('animals')
                .select('id, nome, registro')
                .eq('id', data.mae_id)
                .single();
            if (mother) {
                motherData = {
                    id: mother.id,
                    name: mother.nome,
                    registry_number: mother.registro
                };
            }
        }

        // Buscar dados do haras separadamente
        let harasData = null;
        if (data.haras_id) {
            const { data: haras } = await supabase
                .from('haras')
                .select('id, nome')
                .eq('id', data.haras_id)
                .single();
            if (haras) {
                harasData = {
                    id: haras.id,
                    name: haras.nome
                };
            }
        }

        // Buscar contagem de filhos
        const { count: offspringCount, error: offspringError } = await supabase
            .from('animals')
            .select('*', { count: 'exact', head: true })
            .or(`pai_id.eq.${id},mae_id.eq.${id}`);

        if (offspringError) {
            console.error('Erro ao buscar filhos:', offspringError);
        }

        // Buscar eventos reprodutivos para coberturas e último evento
        const { data: reproEvents, error: reproError } = await supabase
            .from('reproductive_events')
            .select('*')
            .eq('animal_id', id)
            .order('event_date', { ascending: false });

        if (reproError) {
            console.error('Erro ao buscar eventos reprodutivos:', reproError);
        }

        const { data: ownershipSharesData, error: ownershipSharesError } = await supabase
            .from('animal_ownership_shares')
            .select('id, animal_id, haras_id, owner_name, percentage, is_primary, start_date, end_date, notes, source, termination_type, termination_date, termination_age_years, physical_location, is_external, created_at, updated_at')
            .eq('animal_id', id)
            .order('end_date', { ascending: false, nullsFirst: true })
            .order('is_primary', { ascending: false })
            .order('percentage', { ascending: false })
            .order('owner_name', { ascending: true });

        if (ownershipSharesError) {
            console.error('Erro ao buscar cotas do animal:', ownershipSharesError);
        }

        const ownershipShares = ((ownershipSharesData as AnimalOwnershipShare[] | null) || []).map((share) => ({
            ...share,
            percentage: typeof share.percentage === 'number'
                ? share.percentage
                : Number.parseFloat(String(share.percentage ?? 0)) || 0,
            is_primary: Boolean(share.is_primary),
        }));
        const activeOwnershipShares = ownershipShares.filter((share) => !share.end_date);
        const primaryOwnership =
            activeOwnershipShares.find((share) => share.is_primary)
            || activeOwnershipShares[0]
            || ownershipShares.find((share) => share.is_primary)
            || ownershipShares[0]
            || null;

        // Calcular dados reprodutivos
        const coverageCount = (reproEvents as any)?.filter((e: any) =>
            e.event_type === 'cobertura' || e.event_type === 'inseminacao'
        ).length || 0;

        const lastReproductiveEvent = reproEvents && reproEvents.length > 0 ? {
            type: (reproEvents[0] as any).event_type,
            date: (reproEvents[0] as any).event_date
        } : null;

        // Mapear para o formato que o componente espera
        const mappedData = {
            // Dados básicos do banco
            id: data.id,
            haras_id: data.haras_id,
            name: data.nome,
            registry_number: data.registro,
            chip_number: data.chip,
            sex: data.sexo,
            category: REVERSE_CATEGORY_MAPPING[data.categoria] || data.categoria,
            birth_date: data.data_nascimento,
            coat_color: data.pelagem,
            gait: data.andamento,
            status: STATUS_MAPPING[data.status] || normalizeAnimalStatus(data.status) || data.status?.toLowerCase(),
            father_id: data.pai_id,
            mother_id: data.mae_id,
            location: data.localizacao,
            weight: data.weight,
            height: data.height,
            origin_haras: data.haras_origem,
            images: (data.images?.length ? data.images : (data.foto_url ? [data.foto_url] : [])),
            documents: data.documents || [],
            created_at: data.created_at,
            updated_at: data.updated_at,

            // Mapear nomes de campos para o formato do componente
            registry: data.registro,
            chip: data.chip,
            birthDate: data.data_nascimento,
            harasOrigem: data.haras_origem,
            localizacao: data.localizacao,
            servicoTipo: data.tipo_servico,
            is_at_haras: data.is_at_haras ?? true,
            presence_manual_override: data.presence_manual_override ?? false,
            haras: harasData?.name || '-',
            image: data.foto_url || '',

            // Adicionar relacionamentos
            father: fatherData,
            mother: motherData,

            // Status no plantel (mapear do status)
            statusAtividade: getPlantelStatusActivity(data.status),

            // Dados calculados
            filhos: offspringCount || 0,
            coverageCount,
            lastReproductiveEvent,

            // Dados que não existem no banco (inicializar como null/0)
            premiacoes: 0,
            videos: [],
            reproductionType: deriveReproductionTypeFromCategory(data.categoria),
            activeForReproduction: undefined,
            statusHistorico: [],
            motivoInativacao: parseStatusManejo(data.status_manejo)?.motivo || (data.status !== 'Ativo' ? data.status : null),
            dataInativacao: parseStatusManejo(data.status_manejo)?.data || null,

            // Outros campos
            father_name: data.father_name,
            mother_name: data.mother_name,
            criador: data.criador,
            proprietario: primaryOwnership?.owner_name || data.proprietario,
            ownership_shares: ownershipShares,
            observations: data.observacoes,
        };

        return mappedData as unknown as Animal;
    },

    async saveOwnershipShares(input: SaveAnimalOwnershipSharesInput): Promise<AnimalOwnershipShare[]> {
        const { animalId, harasId, shares } = input;

        if (!animalId || !harasId) {
            throw new Error('Animal ou haras inválido para atualizar cotas.');
        }

        const today = new Date().toISOString().slice(0, 10);
        const normalizedShares = shares
            .map((share) => {
                const terminationType = share.termination_type === 'date' || share.termination_type === 'age'
                    ? share.termination_type
                    : null;
                const terminationDate = terminationType === 'date' && share.termination_date
                    ? share.termination_date
                    : null;
                const terminationAgeRaw = terminationType === 'age' && share.termination_age_years != null
                    ? Number.parseInt(String(share.termination_age_years), 10)
                    : null;
                const terminationAgeYears = terminationAgeRaw != null && Number.isFinite(terminationAgeRaw) && terminationAgeRaw > 0
                    ? terminationAgeRaw
                    : null;
                const physicalLocation = share.physical_location
                    ? normalizeSpaces(String(share.physical_location))
                    : null;
                const startDate = share.start_date && String(share.start_date).trim()
                    ? String(share.start_date)
                    : null;
                return {
                    id: share.id,
                    owner_name: normalizeSpaces(String(share.owner_name || '')).toUpperCase(),
                    percentage: Number.parseFloat(String(share.percentage).replace(',', '.')),
                    is_primary: Boolean(share.is_primary),
                    start_date: startDate,
                    termination_type: terminationType,
                    termination_date: terminationDate,
                    termination_age_years: terminationAgeYears,
                    physical_location: physicalLocation || null,
                    is_external: Boolean(share.is_external),
                };
            })
            .filter((share) => share.owner_name);

        if (normalizedShares.length === 0) {
            throw new Error('Informe ao menos um cotista ativo.');
        }

        const seenOwners = new Set<string>();
        for (const share of normalizedShares) {
            if (!Number.isFinite(share.percentage) || share.percentage <= 0) {
                throw new Error('Toda cota precisa ter um percentual maior que zero.');
            }

            if (share.percentage > 100) {
                throw new Error('Nenhuma cota pode ultrapassar 100%.');
            }

            if (seenOwners.has(share.owner_name)) {
                throw new Error('Não é possível repetir o mesmo cotista nas cotas ativas.');
            }

            seenOwners.add(share.owner_name);
        }

        const totalPercentage = normalizedShares.reduce((sum, share) => sum + share.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            throw new Error('A soma das cotas ativas deve totalizar 100%.');
        }

        const primaryIndex = normalizedShares.findIndex((share) => share.is_primary);
        const resolvedPrimaryIndex = primaryIndex >= 0 ? primaryIndex : 0;
        const preparedShares = normalizedShares.map((share, index) => ({
            ...share,
            is_primary: index === resolvedPrimaryIndex,
        }));

        const { data: existingActiveShares, error: existingActiveSharesError } = await supabase
            .from('animal_ownership_shares')
            .select('id')
            .eq('animal_id', animalId)
            .eq('haras_id', harasId)
            .or(`end_date.is.null,end_date.gte.${today}`);

        if (existingActiveSharesError) handleSupabaseError(existingActiveSharesError);

        const existingIds = new Set((existingActiveShares || []).map((share) => share.id));
        const incomingExistingIds = new Set(
            preparedShares
                .map((share) => share.id)
                .filter((shareId): shareId is string => Boolean(shareId && existingIds.has(shareId)))
        );

        for (const share of preparedShares) {
            if (share.id && existingIds.has(share.id)) {
                const updatePayload: Record<string, unknown> = {
                    owner_name: share.owner_name,
                    percentage: share.percentage,
                    is_primary: share.is_primary,
                    end_date: null,
                    termination_type: share.termination_type,
                    termination_date: share.termination_date,
                    termination_age_years: share.termination_age_years,
                    physical_location: share.physical_location,
                    is_external: share.is_external,
                    updated_at: new Date().toISOString(),
                };
                if (share.start_date) updatePayload.start_date = share.start_date;
                const { error: updateError } = await supabase
                    .from('animal_ownership_shares')
                    .update(updatePayload)
                    .eq('id', share.id)
                    .eq('animal_id', animalId)
                    .eq('haras_id', harasId);

                if (updateError) handleSupabaseError(updateError);
                continue;
            }

            const { error: insertError } = await supabase
                .from('animal_ownership_shares')
                .insert({
                    animal_id: animalId,
                    haras_id: harasId,
                    owner_name: share.owner_name,
                    percentage: share.percentage,
                    is_primary: share.is_primary,
                    start_date: share.start_date || today,
                    end_date: null,
                    source: 'manual',
                    termination_type: share.termination_type,
                    termination_date: share.termination_date,
                    termination_age_years: share.termination_age_years,
                    physical_location: share.physical_location,
                    is_external: share.is_external,
                });

            if (insertError) handleSupabaseError(insertError);
        }

        const sharesToDeactivate = (existingActiveShares || []).filter((share) => !incomingExistingIds.has(share.id));
        for (const share of sharesToDeactivate) {
            const { error: deactivateError } = await supabase
                .from('animal_ownership_shares')
                .update({
                    is_primary: false,
                    end_date: today,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', share.id)
                .eq('animal_id', animalId)
                .eq('haras_id', harasId);

            if (deactivateError) handleSupabaseError(deactivateError);
        }

        const primaryOwner = preparedShares[resolvedPrimaryIndex]?.owner_name || preparedShares[0].owner_name;
        const hasExternalShare = preparedShares.some((share) => share.is_external);
        const animalUpdatePayload: Record<string, unknown> = {
            proprietario: primaryOwner,
            updated_at: new Date().toISOString(),
        };
        if (hasExternalShare) {
            // Quando animal entra em condomínio fora, marca como fora do haras automaticamente.
            animalUpdatePayload.is_at_haras = false;
            animalUpdatePayload.presence_manual_override = false;
        }
        const { error: animalUpdateError } = await supabase
            .from('animals')
            .update(animalUpdatePayload)
            .eq('id', animalId)
            .eq('haras_id', harasId);

        if (animalUpdateError) handleSupabaseError(animalUpdateError);

        const { data: refreshedShares, error: refreshedSharesError } = await supabase
            .from('animal_ownership_shares')
            .select('id, animal_id, haras_id, owner_name, percentage, is_primary, start_date, end_date, notes, source, termination_type, termination_date, termination_age_years, physical_location, is_external, created_at, updated_at')
            .eq('animal_id', animalId)
            .eq('haras_id', harasId)
            .or(`end_date.is.null,end_date.gte.${today}`)
            .order('is_primary', { ascending: false })
            .order('percentage', { ascending: false })
            .order('owner_name', { ascending: true });

        if (refreshedSharesError) handleSupabaseError(refreshedSharesError);

        return ((refreshedShares as AnimalOwnershipShare[] | null) || []).map((share) => ({
            ...share,
            percentage: typeof share.percentage === 'number'
                ? share.percentage
                : Number.parseFloat(String(share.percentage ?? 0)) || 0,
            is_primary: Boolean(share.is_primary),
        }));
    },

    /**
     * Busca a genealogia do animal até bisavós
     */
    async getGenealogy(animalId: string): Promise<AnimalGenealogy> {
        const { data, error } = await supabase
            .from('animals')
            .select(GENEALOGY_SELECT_FIELDS)
            .eq('id', animalId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return { root: null, nodes: {} };
            }
            handleSupabaseError(error);
        }

        if (!data) return { root: null, nodes: {} };

        const root = mapGenealogyNode(data);
        const nodes: Record<string, GenealogyNode> = {
            [root.id]: root,
        };

        const genealogyJson = parseGenealogyJson(root.dados_genealogicos);
        const rowIds = collectGenealogyRowIds(genealogyJson);

        const realAncestorsByRowId = new Map<string, GenealogyNode>();
        if (rowIds.length > 0) {
            const { data: realAncestors, error: realAncestorsError } = await supabase
                .from('animals')
                .select(GENEALOGY_SELECT_FIELDS)
                .in('abccmm_rowid', rowIds);

            if (realAncestorsError) handleSupabaseError(realAncestorsError);

            (realAncestors || []).forEach((item) => {
                const mapped = mapGenealogyNode(item);
                const rowid = mapped.abccmm_rowid;
                if (rowid) {
                    realAncestorsByRowId.set(rowid, mapped);
                }
            });
        }

        const slots: Record<string, GenealogySlotConfig> = {
            parent_father: {
                ancestor: normalizeAncestorNode(genealogyJson?.pais?.paterno_pai),
                fatherSlot: 'grandparent_paternal_father',
                motherSlot: 'grandparent_paternal_mother',
                fallbackName: root.father_name || 'Pai nao registrado',
            },
            parent_mother: {
                ancestor: normalizeAncestorNode(genealogyJson?.pais?.materno_mae),
                fatherSlot: 'grandparent_maternal_father',
                motherSlot: 'grandparent_maternal_mother',
                fallbackName: root.mother_name || 'Mae nao registrada',
            },
            grandparent_paternal_father: {
                ancestor: normalizeAncestorNode(genealogyJson?.avos?.paterno_pai),
                fatherSlot: 'great_grandparent_paipai_pai',
                motherSlot: 'great_grandparent_paipai_mae',
                fallbackName: 'Avo (paterno) nao registrado',
            },
            grandparent_paternal_mother: {
                ancestor: normalizeAncestorNode(genealogyJson?.avos?.paterno_mae),
                fatherSlot: 'great_grandparent_maepai_pai',
                motherSlot: 'great_grandparent_maepai_mae',
                fallbackName: 'Avo (paterna) nao registrada',
            },
            grandparent_maternal_father: {
                ancestor: normalizeAncestorNode(genealogyJson?.avos?.materno_pai),
                fatherSlot: 'great_grandparent_paimae_pai',
                motherSlot: 'great_grandparent_paimae_mae',
                fallbackName: 'Avo (materno) nao registrado',
            },
            grandparent_maternal_mother: {
                ancestor: normalizeAncestorNode(genealogyJson?.avos?.materno_mae),
                fatherSlot: 'great_grandparent_maemae_pai',
                motherSlot: 'great_grandparent_maemae_mae',
                fallbackName: 'Avo (materna) nao registrada',
            },
            great_grandparent_paipai_pai: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.paipai_pai),
                fallbackName: 'Bisavo nao registrado',
            },
            great_grandparent_paipai_mae: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.paipai_mae),
                fallbackName: 'Bisava nao registrada',
            },
            great_grandparent_maepai_pai: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.maepai_pai),
                fallbackName: 'Bisavo nao registrado',
            },
            great_grandparent_maepai_mae: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.maepai_mae),
                fallbackName: 'Bisava nao registrada',
            },
            great_grandparent_paimae_pai: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.paimae_pai),
                fallbackName: 'Bisavo nao registrado',
            },
            great_grandparent_paimae_mae: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.paimae_mae),
                fallbackName: 'Bisava nao registrada',
            },
            great_grandparent_maemae_pai: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.maemae_pai),
                fallbackName: 'Bisavo nao registrado',
            },
            great_grandparent_maemae_mae: {
                ancestor: normalizeAncestorNode(genealogyJson?.bisavos?.maemae_mae),
                fallbackName: 'Bisava nao registrada',
            },
        };

        const resolvedBySlot = new Map<string, string | null>();

        const resolveSlot = (slotKey: string | undefined): string | null => {
            if (!slotKey) return null;
            if (resolvedBySlot.has(slotKey)) {
                return resolvedBySlot.get(slotKey) ?? null;
            }

            const slot = slots[slotKey];
            if (!slot || !slot.ancestor) {
                resolvedBySlot.set(slotKey, null);
                return null;
            }

            const fatherId = resolveSlot(slot.fatherSlot);
            const motherId = resolveSlot(slot.motherSlot);

            const realNode = slot.ancestor.rowid ? realAncestorsByRowId.get(slot.ancestor.rowid) : undefined;
            const fatherName = fatherId ? nodes[fatherId]?.name || null : null;
            const motherName = motherId ? nodes[motherId]?.name || null : null;

            if (realNode) {
                const mergedNode: GenealogyNode = {
                    ...realNode,
                    name: realNode.name || slot.ancestor.nome || slot.fallbackName,
                    registry_number: realNode.registry_number ?? slot.ancestor.registro ?? null,
                    father_id: fatherId ?? realNode.father_id ?? null,
                    mother_id: motherId ?? realNode.mother_id ?? null,
                    father_name: fatherName ?? realNode.father_name ?? null,
                    mother_name: motherName ?? realNode.mother_name ?? null,
                    is_historical: false,
                };

                nodes[mergedNode.id] = mergedNode;
                resolvedBySlot.set(slotKey, mergedNode.id);
                return mergedNode.id;
            }

            const historicalNodeId = buildHistoricalNodeId(slotKey, slot.ancestor.rowid ?? null);
            if (!nodes[historicalNodeId]) {
                nodes[historicalNodeId] = createHistoricalGenealogyNode({
                    id: historicalNodeId,
                    ancestor: slot.ancestor,
                    fatherId,
                    motherId,
                    fatherName,
                    motherName,
                    fallbackName: slot.fallbackName,
                });
            }

            resolvedBySlot.set(slotKey, historicalNodeId);
            return historicalNodeId;
        };

        const rootFatherId = resolveSlot('parent_father');
        const rootMotherId = resolveSlot('parent_mother');

        nodes[root.id] = {
            ...root,
            father_id: rootFatherId ?? root.father_id ?? null,
            mother_id: rootMotherId ?? root.mother_id ?? null,
            father_name: rootFatherId ? nodes[rootFatherId]?.name || root.father_name || null : root.father_name || null,
            mother_name: rootMotherId ? nodes[rootMotherId]?.name || root.mother_name || null : root.mother_name || null,
            is_historical: false,
        };

        return { root: nodes[root.id], nodes };
    },

    /**
     * Cria um novo animal
     */
    async create(input: CreateAnimalInput): Promise<Animal> {
        const guardedInput = input as CreateAnimalInput & {
            abccmm_rowid?: string | null;
            environment?: string | null;
            source?: string | null;
            import_source?: string | null;
        };

        const normalizedEnvironment = String(guardedInput.environment || '').toLowerCase().trim();
        const normalizedSource = String(guardedInput.source || guardedInput.import_source || '').toLowerCase().trim();

        if (
            guardedInput.abccmm_rowid
            || normalizedEnvironment === 'oficial'
            || normalizedEnvironment === 'condominio'
            || normalizedSource.includes('abccmm')
            || normalizedSource.includes('condominio')
        ) {
            throw new Error('Animais oficiais do plantel e animais em condomínio só podem ser cadastrados via importação ABCCMM.');
        }

        const resolvedStatus = input.status
            ? (REVERSE_STATUS_MAPPING[input.status] ?? input.status)
            : 'Ativo';

        const normalizedImages = input.images && input.images.length > 0 ? input.images : undefined;
        const mainImageUrl = input.main_image_url || (normalizedImages ? normalizedImages[0] : undefined);

        const dbInput = {
            haras_id: input.haras_id,
            ingestion_source: 'manual',
            nome: input.name,
            registro: input.registry_number,
            chip: input.chip_number,
            sexo: input.sex,
            categoria: CATEGORY_MAPPING[input.category] || input.category,
            data_nascimento: input.birth_date,
            pelagem: input.coat_color,
            status: resolvedStatus,
            pai_id: input.father_id,
            mae_id: input.mother_id,
            localizacao: input.location,
            weight: input.weight,
            height: input.height,
            haras_origem: input.origin_haras,
            tipo_servico: input.service_type,
            status_manejo: input.management_status,
            andamento: input.gait,
            images: normalizedImages,
            documents: input.documents,
            foto_url: mainImageUrl,
            father_name: input.father_name,
            mother_name: input.mother_name,
            criador: input.criador,
            proprietario: input.proprietario,
            observacoes: input.observations
        };

        const { data, error } = await supabase
            .from('animals')
            .insert(dbInput)
            .select()
            .single();

        if (error) handleSupabaseError(error);

        return data as unknown as Animal;
    },

    /**
     * Atualiza um animal
     */
    async update(input: UpdateAnimalInput): Promise<Animal> {
        const { id, ...updateData } = input;

        const dbInput: any = {
            updated_at: new Date().toISOString()
        };

        if (updateData.name !== undefined) dbInput.nome = updateData.name;
        if (updateData.registry_number !== undefined) dbInput.registro = updateData.registry_number;
        if (updateData.chip_number !== undefined) dbInput.chip = updateData.chip_number;
        if (updateData.sex !== undefined) dbInput.sexo = updateData.sex;
        if (updateData.category !== undefined) dbInput.categoria = CATEGORY_MAPPING[updateData.category] || updateData.category;
        if (updateData.birth_date !== undefined) {
            // Only set date if it's not empty, otherwise set to null
            dbInput.data_nascimento = updateData.birth_date || null;
        }
        if (updateData.coat_color !== undefined) {
            // Only set coat_color if it's not empty, otherwise set to null
            dbInput.pelagem = updateData.coat_color || null;
        }
        if (updateData.gait !== undefined) dbInput.andamento = updateData.gait;
        if (updateData.status !== undefined) dbInput.status = REVERSE_STATUS_MAPPING[updateData.status] || updateData.status;
        if (updateData.father_id !== undefined) dbInput.pai_id = updateData.father_id;
        if (updateData.mother_id !== undefined) dbInput.mae_id = updateData.mother_id;
        if (updateData.location !== undefined) dbInput.localizacao = updateData.location;
        if (updateData.weight !== undefined) dbInput.weight = updateData.weight;
        if (updateData.height !== undefined) dbInput.height = updateData.height;
        if (updateData.father_name !== undefined) dbInput.father_name = updateData.father_name;
        if (updateData.mother_name !== undefined) dbInput.mother_name = updateData.mother_name;
        if (updateData.criador !== undefined) dbInput.criador = updateData.criador;
        if (updateData.proprietario !== undefined) dbInput.proprietario = updateData.proprietario;
        if (updateData.observations !== undefined) dbInput.observacoes = updateData.observations;
        if (updateData.origin_haras !== undefined) dbInput.haras_origem = updateData.origin_haras;
        if (updateData.service_type !== undefined) dbInput.tipo_servico = updateData.service_type;
        if (updateData.management_status !== undefined) dbInput.status_manejo = updateData.management_status;
        if (updateData.is_at_haras !== undefined) dbInput.is_at_haras = updateData.is_at_haras;
        if (updateData.presence_manual_override !== undefined) dbInput.presence_manual_override = updateData.presence_manual_override;
        // Handle images - always include the array even if empty to clear existing images
        if (updateData.images !== undefined) {
            dbInput.images = updateData.images;
            if (updateData.images.length > 0) {
                dbInput.foto_url = updateData.images[0];
            }
        }
        if (updateData.main_image_url) dbInput.foto_url = updateData.main_image_url;

        // Handle documents - always include the array even if empty to clear existing documents
        if (updateData.documents !== undefined) {
            dbInput.documents = updateData.documents;
        }

        console.log('dbInput completo:', JSON.stringify(dbInput, null, 2));
        console.log('Images no dbInput:', dbInput.images);
        console.log('Documents no dbInput:', dbInput.documents);

        console.log('Enviando update para Supabase:', JSON.stringify(dbInput, null, 2));

        const { data, error } = await supabase
            .from('animals')
            .update(dbInput)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Supabase update error:', error);
            handleSupabaseError(error);
        }

        console.log('Supabase update response:', data);

        return data as unknown as Animal;
    },

    /**
     * Exclui um animal (soft delete - muda status para 'Falecido')
     */
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('animals')
            .update({ status: 'Falecido', updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) handleSupabaseError(error);
    },

    /**
     * Busca filhos de um animal
     */
    async getOffspring(animalId: string): Promise<Animal[]> {
        const { data, error } = await supabase
            .from('animals')
            .select(`
                id, haras_id, nome, registro, chip,
                sexo, categoria, data_nascimento, pelagem,
                status, pai_id, mae_id, localizacao,
                height, weight, foto_url,
                created_at, updated_at
            `)
            .or(`pai_id.eq.${animalId},mae_id.eq.${animalId}`)
            .order('data_nascimento', { ascending: false });

        if (error) handleSupabaseError(error);

        // Mapear dados para o formato esperado
        return (data || []).map((item: any) => ({
            ...item,
            name: item.nome,
            registry_number: item.registro,
            chip_number: item.chip,
            coat_color: item.pelagem,
            weight: item.weight,
            height: item.height,
            status: STATUS_MAPPING[item.status] || item.status?.toLowerCase(),
            category: REVERSE_CATEGORY_MAPPING[item.categoria] || item.categoria,
            main_image_url: item.foto_url,
        })) as unknown as Animal[];
    },

    /**
     * Busca machos disponíveis para reprodução
     */
    async getStallions(
        harasId: string,
        options?: { includeInactive?: boolean; includeAllCategories?: boolean }
    ): Promise<Animal[]> {
        const { includeInactive = false, includeAllCategories = false } = options || {};

        let query = supabase
            .from('animals')
            .select('id, nome, registro, data_nascimento, categoria')
            .eq('haras_id', harasId)
            .eq('sexo', 'Macho');

        if (!includeAllCategories) {
            query = query.in('categoria', ['Garanhão']);
        }

        if (!includeInactive) {
            query = query.eq('status', 'Ativo');
        }

        const { data, error } = await query.order('nome');

        if (error) handleSupabaseError(error);

        return (data || []).map((item: any) => ({
            ...item,
            name: item.nome,
            registry_number: item.registro,
            birth_date: item.data_nascimento,
            category: REVERSE_CATEGORY_MAPPING[item.categoria] || item.categoria,
        })) as unknown as Animal[];
    },

    /**
     * Busca fêmeas disponíveis para reprodução
     */
    async getMares(
        harasId: string,
        options?: { includeInactive?: boolean; includeAllCategories?: boolean }
    ): Promise<Animal[]> {
        const { includeInactive = false, includeAllCategories = false } = options || {};

        let query = supabase
            .from('animals')
            .select('id, nome, registro, data_nascimento, categoria')
            .eq('haras_id', harasId)
            .eq('sexo', 'Fêmea');

        if (!includeAllCategories) {
            query = query.in('categoria', ['Égua']);
        }

        if (!includeInactive) {
            query = query.eq('status', 'Ativo');
        }

        const { data, error } = await query.order('nome');

        if (error) handleSupabaseError(error);

        return (data || []).map((item: any) => ({
            ...item,
            name: item.nome,
            registry_number: item.registro,
            birth_date: item.data_nascimento,
            category: REVERSE_CATEGORY_MAPPING[item.categoria] || item.categoria,
        })) as unknown as Animal[];
    },

    /**
     * Importa planilha ABCCMM (Excel/CSV) no modelo 1 linha = 1 animal.
     */
    async importABCCMMData(params: {
        file: File;
        harasId: string;
        onProgress?: (progress: number, message: string) => void;
    }): Promise<ABCCMMImportResult> {
        const { file, harasId, onProgress } = params;
        if (!harasId) {
            throw new Error('Haras não identificado para importação.');
        }

        const reportProgress = (progress: number, message: string) => {
            if (!onProgress) return;
            const clamped = Math.max(0, Math.min(100, Math.round(progress)));
            onProgress(clamped, message);
        };

        reportProgress(10, 'Processando planilha...');

        console.log('[animalsService.importABCCMMData] Starting import', {
            fileName: file?.name,
            fileSize: file?.size,
            fileType: file?.type,
            harasId,
            xlsxReadAvailable: typeof XLSX.read === 'function',
            xlsxSheetToJsonAvailable: typeof XLSX.utils?.sheet_to_json === 'function',
        });

        const warnings: string[] = [];
        const errors: string[] = [];

        let fileBuffer: ArrayBuffer;
        let workbook: XLSX.WorkBook | null = null;
        let firstSheetName: string | undefined;

        try {
            fileBuffer = await file.arrayBuffer();
            workbook = XLSX.read(fileBuffer, { type: 'array', raw: true, cellDates: false });
            firstSheetName = workbook.SheetNames[0];
            console.log('[animalsService.importABCCMMData] Workbook parsed', {
                bufferBytes: fileBuffer.byteLength,
                sheetNames: workbook.SheetNames,
                firstSheetName: firstSheetName ?? null,
            });
            reportProgress(20, 'Lendo linhas da planilha...');
        } catch (parseError) {
            console.error('[animalsService.importABCCMMData] Failed to parse workbook', parseError);
            throw new Error('Erro ao ler arquivo Excel/CSV. Verifique se o arquivo está íntegro.');
        }

        if (!firstSheetName || !workbook) {
            throw new Error('A planilha não contém abas válidas.');
        }

        const worksheet = workbook.Sheets[firstSheetName];
        let rows: SpreadsheetRow[];
        try {
            rows = XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet, {
                defval: '',
                raw: true,
                blankrows: false,
            });
        } catch (sheetError) {
            console.error('[animalsService.importABCCMMData] Failed to convert sheet to json', sheetError);
            throw new Error('Erro ao processar linhas da planilha.');
        }

        console.log('[animalsService.importABCCMMData] Rows extracted', {
            totalRows: rows.length,
        });
        reportProgress(30, 'Preparando dados para importação...');

        if (rows.length === 0) {
            throw new Error('A planilha está vazia.');
        }

        const parsedRows: ParsedABCCMMRow[] = [];
        const seedMap = new Map<string, AnimalSeed>();
        const linkSeedMap = new Map<string, GenealogyLinkSeed>();

        rows.forEach((rawRow, index) => {
            const line = index + 2;
            const normalized = normalizeRowKeys(rawRow);
            const parsedMain = parseMainRow(normalized);

            if (!parsedMain) {
                warnings.push(`Linha ${line}: _rowid não informado, linha ignorada.`);
                return;
            }

            parsedRows.push({ line, data: parsedMain });

            seedMap.set(
                parsedMain.rowid,
                mergeSeed(seedMap.get(parsedMain.rowid), {
                    rowid: parsedMain.rowid,
                    registro: parsedMain.registro,
                    nome: parsedMain.nome,
                    sexo: parsedMain.sexo,
                })
            );

            linkSeedMap.set(
                parsedMain.rowid,
                mergeLinkSeed(linkSeedMap.get(parsedMain.rowid), {
                    rowid: parsedMain.rowid,
                    registro: parsedMain.registro,
                    paiRowId: parsedMain.paiRowId,
                    maeRowId: parsedMain.maeRowId,
                    paiNome: parsedMain.paiNome,
                    maeNome: parsedMain.maeNome,
                    paiRegistro: parsedMain.paiRegistro,
                    maeRegistro: parsedMain.maeRegistro,
                    dataNascimento: parsedMain.dataNascimento,
                    chip: parsedMain.chip,
                    pelagem: parsedMain.pelagem,
                    criador: parsedMain.criador,
                    proprietario: parsedMain.proprietario,
                    dadosGenealogicos: parsedMain.dadosGenealogicos,
                })
            );
        });

        if (parsedRows.length === 0 || seedMap.size === 0 || linkSeedMap.size === 0) {
            throw new Error('Nenhum animal válido foi encontrado para importação.');
        }

        const allRowIds = Array.from(seedMap.keys());
        const allParentRowIds = Array.from(linkSeedMap.values()).flatMap((seed) => [seed.paiRowId, seed.maeRowId]);
        const validRowIds = Array.from(new Set([...allRowIds, ...allParentRowIds].filter((value): value is string => Boolean(value))));

        const allRegistros = Array.from(linkSeedMap.values()).flatMap((seed) => [seed.registro, seed.paiRegistro, seed.maeRegistro]);
        const validRegistros = Array.from(new Set(allRegistros.filter(isValidRegistro)));

        const existingByRowId = new Map<string, string>();
        const existingByRegistro = new Map<string, string>();
        const existingByChip = new Map<string, string>();
        const existingComposite = new Map<string, string[]>();
        const pendingLinkQueueSeeds: Array<{ provisionalAnimalId: string; officialRowId: string; officialRegistro: string }> = [];

        const { data: existingAnimalsForMatch, error: existingAnimalsForMatchError } = await (supabase as any)
            .from('animals')
            .select('id, abccmm_rowid, registro, chip, nome, data_nascimento, sexo')
            .eq('haras_id', harasId);

        if (existingAnimalsForMatchError) handleSupabaseError(existingAnimalsForMatchError);

        (existingAnimalsForMatch || []).forEach((item: any) => {
            if (item.registro) existingByRegistro.set(String(item.registro), item.id);
            if (item.chip) existingByChip.set(String(item.chip), item.id);
            if (!item.abccmm_rowid) {
                const composite = `${normalizeNameKey(item.nome)}|${item.data_nascimento || ''}|${item.sexo || ''}`;
                if (!existingComposite.has(composite)) existingComposite.set(composite, []);
                existingComposite.get(composite)?.push(item.id);
            }
        });

        reportProgress(35, 'Validando registros existentes...');
        if (validRowIds.length > 0) {
            const rowIdChunks = chunkArray(validRowIds, ABCCMM_BATCH_SIZE);
            for (let index = 0; index < rowIdChunks.length; index++) {
                const chunk = rowIdChunks[index];
                const { data: existingRowsByRowId, error: existingByRowIdError } = await (supabase as any)
                    .from('animals')
                    .select('id, abccmm_rowid')
                    .eq('haras_id', harasId)
                    .in('abccmm_rowid', chunk);

                if (existingByRowIdError) handleSupabaseError(existingByRowIdError);

                (existingRowsByRowId || []).forEach((item: { id: string; abccmm_rowid: string | null }) => {
                    if (item.abccmm_rowid && !existingByRowId.has(item.abccmm_rowid)) {
                        existingByRowId.set(item.abccmm_rowid, item.id);
                    }
                });
            }
        }

        if (validRegistros.length > 0) {
            const { data: existingRows, error: existingError } = await supabase
                .from('animals')
                .select('id, registro')
                .eq('haras_id', harasId)
                .in('registro', validRegistros);

            if (existingError) handleSupabaseError(existingError);

            (existingRows || []).forEach((item: { id: string; registro: string | null }) => {
                if (item.registro && !existingByRegistro.has(item.registro)) {
                    existingByRegistro.set(item.registro, item.id);
                }
            });
        }

        const toInsert: Array<Database['public']['Tables']['animals']['Insert']> = [];
        const toUpdate: Array<{
                id: string;
                payload: Database['public']['Tables']['animals']['Update'];
        }> = [];

        Array.from(seedMap.values()).forEach((seed) => {
            const details = linkSeedMap.get(seed.rowid);
            const payload: Database['public']['Tables']['animals']['Update'] = {
                ingestion_source: 'abccmm_plantel' as const,
                abccmm_rowid: seed.rowid,
                nome: seed.nome || seed.registro,
                registro: seed.registro,
                sexo: seed.sexo,
                categoria: getCategoryBySex(seed.sexo),
                status: 'Ativo',
                data_nascimento: details?.dataNascimento ?? null,
                chip: details?.chip ?? null,
                pelagem: details?.pelagem ?? null,
                criador: details?.criador ?? null,
                proprietario: details?.proprietario ?? null,
                father_name: details?.paiNome ?? null,
                mother_name: details?.maeNome ?? null,
                dados_genealogicos: (details?.dadosGenealogicos ?? null) as Json | null,
            };

            let existingId = existingByRowId.get(seed.rowid);

            if (!existingId && isValidRegistro(seed.registro)) {
                existingId = existingByRegistro.get(seed.registro);
            }

            if (!existingId && details?.chip) {
                existingId = existingByChip.get(details.chip) || undefined;
            }

            if (!existingId && details?.dataNascimento) {
                const composite = `${normalizeNameKey(seed.nome || details.registro || '')}|${details.dataNascimento || ''}|${seed.sexo || ''}`;
                const candidates = existingComposite.get(composite) || [];
                if (candidates.length === 1) {
                    const candidateId = candidates[0];
                    existingId = candidateId;
                    pendingLinkQueueSeeds.push({
                        provisionalAnimalId: candidateId,
                        officialRowId: seed.rowid,
                        officialRegistro: seed.registro,
                    });
                }
            }

            if (existingId) {
                toUpdate.push({ id: existingId, payload });
                return;
            }

            toInsert.push({
                haras_id: harasId,
                ...payload,
            } as Database['public']['Tables']['animals']['Insert']);
        });

        const idsByRowId = new Map<string, string>(existingByRowId);
        const idsByRegistro = new Map<string, string>(existingByRegistro);
        let insertedCount = 0;
        let updatedCount = 0;
        const insertChunks = chunkArray(toInsert, ABCCMM_BATCH_SIZE);
        if (insertChunks.length === 0) {
            reportProgress(69, 'Salvando novos animais...');
        }
        for (let index = 0; index < insertChunks.length; index++) {
            const chunk = insertChunks[index];
            const { data, error } = await (supabase as any)
                .from('animals')
                .insert(chunk)
                .select('id, registro, abccmm_rowid');

            if (error) handleSupabaseError(error);

            insertedCount += chunk.length;
            (data || []).forEach((item: { id: string; registro: string | null; abccmm_rowid: string | null }) => {
                if (item.abccmm_rowid) idsByRowId.set(item.abccmm_rowid, item.id);
                if (item.registro) idsByRegistro.set(item.registro, item.id);
            });
            reportProgress(40 + ((index + 1) / insertChunks.length) * 29, 'Salvando novos animais...');
        }

        const updateChunks = chunkArray(toUpdate, ABCCMM_BATCH_SIZE);
        if (updateChunks.length === 0) {
            reportProgress(89, 'Atualizando dados existentes...');
        }
        for (let chunkIndex = 0; chunkIndex < updateChunks.length; chunkIndex++) {
            const chunk = updateChunks[chunkIndex];
            for (let itemIndex = 0; itemIndex < chunk.length; itemIndex++) {
                const item = chunk[itemIndex];
                const { error } = await supabase
                    .from('animals')
                    .update(item.payload as Database['public']['Tables']['animals']['Update'])
                    .eq('id', item.id)
                    .eq('haras_id', harasId);

                if (error) handleSupabaseError(error);
                updatedCount += 1;
                if (item.payload.abccmm_rowid) idsByRowId.set(item.payload.abccmm_rowid, item.id);
                if (item.payload.registro) idsByRegistro.set(item.payload.registro, item.id);
            }
            reportProgress(70 + ((chunkIndex + 1) / updateChunks.length) * 19, 'Atualizando dados existentes...');
        }

        const linkUpdates = Array.from(linkSeedMap.values()).map((seed) => {
            const paiId =
                (seed.paiRowId ? idsByRowId.get(seed.paiRowId) ?? null : null) ||
                (seed.paiRegistro ? idsByRegistro.get(seed.paiRegistro) ?? null : null);
            const maeId =
                (seed.maeRowId ? idsByRowId.get(seed.maeRowId) ?? null : null) ||
                (seed.maeRegistro ? idsByRegistro.get(seed.maeRegistro) ?? null : null);
            const animalId = idsByRowId.get(seed.rowid);

            if (!animalId) {
                warnings.push(`Animal rowid ${seed.rowid} não localizado para atualização de genealogia.`);
                return null;
            }

            if ((seed.paiRowId || seed.paiRegistro) && !paiId) {
                warnings.push(`Pai (${seed.paiRowId ?? seed.paiRegistro}) não localizado para vínculo de ${seed.registro || seed.rowid}.`);
            }
            if ((seed.maeRowId || seed.maeRegistro) && !maeId) {
                warnings.push(`Mãe (${seed.maeRowId ?? seed.maeRegistro}) não localizada para vínculo de ${seed.registro || seed.rowid}.`);
            }

            const payload: any = {};
            if (paiId) payload.pai_id = paiId;
            if (maeId) payload.mae_id = maeId;
            payload.father_name = seed.paiNome ?? null;
            payload.mother_name = seed.maeNome ?? null;

            return {
                id: animalId,
                payload,
            };
        }).filter((item): item is {
            id: string;
            payload: Record<string, unknown>;
        } => item !== null && Object.keys(item.payload).length > 0);

        const linkChunks = chunkArray(linkUpdates, ABCCMM_BATCH_SIZE);
        if (linkChunks.length === 0) {
            reportProgress(99, 'Construindo árvore genealógica...');
        }
        for (let chunkIndex = 0; chunkIndex < linkChunks.length; chunkIndex++) {
            const chunk = linkChunks[chunkIndex];
            for (let itemIndex = 0; itemIndex < chunk.length; itemIndex++) {
                const item = chunk[itemIndex];
                const { error } = await supabase
                    .from('animals')
                    .update(item.payload as Database['public']['Tables']['animals']['Update'])
                    .eq('id', item.id)
                    .eq('haras_id', harasId);

                if (error) handleSupabaseError(error);
            }
            reportProgress(90 + ((chunkIndex + 1) / linkChunks.length) * 9, 'Construindo árvore genealógica...');
        }

        if (pendingLinkQueueSeeds.length > 0) {
            const queuePayload = pendingLinkQueueSeeds
                .map((seed) => {
                    const officialAnimalId = idsByRowId.get(seed.officialRowId) || null;
                    if (!officialAnimalId) return null;
                    return {
                        haras_id: harasId,
                        provisional_animal_id: seed.provisionalAnimalId,
                        official_animal_id: officialAnimalId,
                        official_abccmm_rowid: seed.officialRowId,
                        official_registry: seed.officialRegistro,
                        match_type: 'name_birth_sex',
                        confidence: 0.8,
                        status: 'pending',
                        payload: {
                            source: 'abccmm_import',
                            reason: 'Match por nome + nascimento + sexo',
                        },
                    };
                })
                .filter(Boolean);

            if (queuePayload.length > 0) {
                const { error: queueInsertError } = await (supabase as any)
                    .from('animal_link_queue')
                    .upsert(queuePayload, {
                        onConflict: 'haras_id,provisional_animal_id,official_abccmm_rowid,status',
                    });

                if (queueInsertError) {
                    warnings.push('Não foi possível criar itens de vinculação automática.');
                }
            }
        }

        const linkedAnimals = linkUpdates.filter((item) => Boolean(item.payload.pai_id || item.payload.mae_id)).length;
        reportProgress(100, 'Importação concluída');

        return {
            newAnimals: insertedCount,
            updatedAnimals: updatedCount,
            linkedAnimals,
            totalRows: parsedRows.length,
            warnings,
            errors,
        };
    },

    async listLinkQueue(harasId: string): Promise<AnimalLinkQueueItem[]> {
        const { data, error } = await (supabase as any)
            .from('animal_link_queue')
            .select(`
                id, haras_id, provisional_animal_id, official_animal_id,
                official_abccmm_rowid, official_registry, match_type,
                confidence, status, payload, created_at, updated_at,
                provisional:provisional_animal_id(id, nome, registro, data_nascimento, sexo),
                official:official_animal_id(id, nome, registro, data_nascimento, sexo)
            `)
            .eq('haras_id', harasId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) handleSupabaseError(error);

        return (data || []).map((row: any) => ({
            id: row.id,
            haras_id: row.haras_id,
            provisional_animal_id: row.provisional_animal_id,
            official_animal_id: row.official_animal_id,
            official_abccmm_rowid: row.official_abccmm_rowid,
            official_registry: row.official_registry,
            match_type: row.match_type,
            confidence: row.confidence,
            status: row.status,
            payload: row.payload || {},
            created_at: row.created_at,
            updated_at: row.updated_at,
            provisional_animal: row.provisional ? {
                id: row.provisional.id,
                name: row.provisional.nome,
                registry_number: row.provisional.registro,
                birth_date: row.provisional.data_nascimento,
                sex: row.provisional.sexo,
            } : null,
            official_animal: row.official ? {
                id: row.official.id,
                name: row.official.nome,
                registry_number: row.official.registro,
                birth_date: row.official.data_nascimento,
                sex: row.official.sexo,
            } : null,
        }));
    },

    async linkQueueItem(queueId: string): Promise<void> {
        const { data: queueItem, error: queueError } = await (supabase as any)
            .from('animal_link_queue')
            .select('*')
            .eq('id', queueId)
            .single();

        if (queueError) handleSupabaseError(queueError);
        if (!queueItem?.provisional_animal_id || !queueItem?.official_animal_id) {
            throw new Error('Item de vinculação inválido.');
        }

        const { data: provisional, error: provisionalError } = await supabase
            .from('animals')
            .select('id, images, documents, observacoes, chip, localizacao')
            .eq('id', queueItem.provisional_animal_id)
            .single();

        if (provisionalError) handleSupabaseError(provisionalError);

        const { data: official, error: officialError } = await supabase
            .from('animals')
            .select('id, images, documents, observacoes, chip, localizacao')
            .eq('id', queueItem.official_animal_id)
            .single();

        if (officialError) handleSupabaseError(officialError);

        const mergedImages = Array.from(new Set([...(official?.images || []), ...(provisional?.images || [])]));
        const mergedDocuments = Array.from(new Set([...(official?.documents || []), ...(provisional?.documents || [])]));

        const mergedObservations = [
            official?.observacoes,
            provisional?.observacoes,
            `Vinculado automaticamente do animal provisório ${provisional?.id}`,
        ].filter(Boolean).join('\n');

        const { error: officialUpdateError } = await supabase
            .from('animals')
            .update({
                images: mergedImages,
                documents: mergedDocuments,
                observacoes: mergedObservations,
                chip: official?.chip || provisional?.chip || null,
                localizacao: official?.localizacao || provisional?.localizacao || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', queueItem.official_animal_id);

        if (officialUpdateError) handleSupabaseError(officialUpdateError);

        const { error: provisionalUpdateError } = await supabase
            .from('animals')
            .update({
                status: 'Transferido',
                observacoes: `Vinculado ao animal oficial ${queueItem.official_animal_id}`,
                updated_at: new Date().toISOString(),
            })
            .eq('id', queueItem.provisional_animal_id);

        if (provisionalUpdateError) handleSupabaseError(provisionalUpdateError);

        const { error: queueUpdateError } = await (supabase as any)
            .from('animal_link_queue')
            .update({
                status: 'linked',
                resolved_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', queueId);

        if (queueUpdateError) handleSupabaseError(queueUpdateError);
    },

    async dismissLinkQueueItem(queueId: string): Promise<void> {
        const { error } = await (supabase as any)
            .from('animal_link_queue')
            .update({
                status: 'dismissed',
                resolved_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', queueId);

        if (error) handleSupabaseError(error);
    },

    async importCondominiumShares(params: {
        file: File;
        harasId: string;
        onProgress?: (progress: number, message: string) => void;
    }): Promise<CondominiumShareImportResult> {
        const { file, harasId, onProgress } = params;
        const warnings: string[] = [];
        const errors: string[] = [];

        const report = (progress: number, message: string) => {
            if (onProgress) onProgress(Math.max(0, Math.min(100, Math.round(progress))), message);
        };

        report(10, 'Lendo planilha de condomínio...');
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', raw: true });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error('Planilha de condomínio sem aba válida.');
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], { defval: '' });

        if (rows.length === 0) {
            throw new Error('Planilha de condomínio vazia.');
        }

        report(30, 'Validando e importando cotas...');

        let processedRows = 0;
        let insertedShares = 0;
        let updatedShares = 0;

        for (const raw of rows) {
            processedRows += 1;
            const normalized = Object.fromEntries(Object.entries(raw).map(([k, v]) => [normalizeColumnName(String(k)), v]));

            const identifier = normalizeRegistro(normalized.identificadoranimal ?? normalized.registro ?? normalized.abccmmrowid);
            const ownerName = normalizeSpaces(String(normalized.nomecotista ?? normalized.cotista ?? normalized.proprietario ?? '')).trim();
            const percentageRaw = String(normalized.percentual ?? '').replace(',', '.').trim();
            const percentage = Number.parseFloat(percentageRaw);
            const isPrimary = String(normalized.cotistaprincipal ?? normalized.principal ?? '').toLowerCase().startsWith('s');
            const startDate = parseAbccmmDate(normalized.datainicio) || null;
            const endDate = parseAbccmmDate(normalized.datafim) || null;
            const notes = normalizeSpaces(String(normalized.observacoes ?? normalized.obs ?? '')).trim() || null;

            if (!identifier || !ownerName || !Number.isFinite(percentage)) {
                warnings.push(`Linha ${processedRows + 1}: dados obrigatórios ausentes.`);
                continue;
            }

            let animalId: string | null = null;
            const { data: byRowId } = await (supabase as any)
                .from('animals')
                .select('id')
                .eq('haras_id', harasId)
                .eq('abccmm_rowid', identifier)
                .maybeSingle();
            if (byRowId?.id) animalId = byRowId.id;

            if (!animalId) {
                const { data: byRegistro } = await supabase
                    .from('animals')
                    .select('id')
                    .eq('haras_id', harasId)
                    .eq('registro', identifier)
                    .maybeSingle();
                if (byRegistro?.id) animalId = byRegistro.id;
            }

            if (!animalId) {
                warnings.push(`Linha ${processedRows + 1}: animal ${identifier} não encontrado.`);
                continue;
            }

            const { data: existingShare } = await (supabase as any)
                .from('animal_ownership_shares')
                .select('id')
                .eq('haras_id', harasId)
                .eq('animal_id', animalId)
                .eq('owner_name', ownerName)
                .maybeSingle();

            if (existingShare?.id) {
                const { error: updateError } = await (supabase as any)
                    .from('animal_ownership_shares')
                    .update({
                        percentage,
                        is_primary: isPrimary,
                        start_date: startDate,
                        end_date: endDate,
                        notes,
                        source: 'spreadsheet',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingShare.id);
                if (updateError) {
                    errors.push(`Linha ${processedRows + 1}: erro ao atualizar cota.`);
                } else {
                    updatedShares += 1;
                }
            } else {
                const { error: insertError } = await (supabase as any)
                    .from('animal_ownership_shares')
                    .insert({
                        haras_id: harasId,
                        animal_id: animalId,
                        owner_name: ownerName,
                        percentage,
                        is_primary: isPrimary,
                        start_date: startDate,
                        end_date: endDate,
                        notes,
                        source: 'spreadsheet',
                    });
                if (insertError) {
                    errors.push(`Linha ${processedRows + 1}: erro ao inserir cota.`);
                } else {
                    insertedShares += 1;
                }
            }
        }

        report(100, 'Importação de condomínio concluída.');

        return {
            processedRows,
            insertedShares,
            updatedShares,
            warnings,
            errors,
        };
    },

    async importCondominiumAnimals(params: {
        file: File;
        harasId: string;
        onProgress?: (progress: number, message: string) => void;
    }): Promise<ABCCMMImportResult> {
        const { file, harasId, onProgress } = params;

        const importResult = await this.importABCCMMData({ file, harasId, onProgress });

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', raw: true, cellDates: false });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) return importResult;

        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], {
            defval: '',
            raw: true,
            blankrows: false,
        });

        const shareRows: Array<{ rowid: string; owner: string }> = [];
        rows.forEach((raw) => {
            const normalized = normalizeRowKeys(raw);
            const parsed = parseMainRow(normalized);
            if (!parsed?.rowid) return;
            if (!parsed.proprietario) return;
            shareRows.push({ rowid: parsed.rowid, owner: parsed.proprietario });
        });

        const uniqueRowIds = Array.from(new Set(shareRows.map((item) => item.rowid)));
        if (uniqueRowIds.length === 0) return importResult;

        const { data: animals, error: animalsError } = await (supabase as any)
            .from('animals')
            .select('id, abccmm_rowid')
            .eq('haras_id', harasId)
            .in('abccmm_rowid', uniqueRowIds);

        if (animalsError) handleSupabaseError(animalsError);

        const animalIdByRowId = new Map<string, string>();
        (animals || []).forEach((item: { id: string; abccmm_rowid: string | null }) => {
            if (item.abccmm_rowid) animalIdByRowId.set(item.abccmm_rowid, item.id);
        });

        let insertedShares = 0;
        let updatedShares = 0;

        for (const item of shareRows) {
            const animalId = animalIdByRowId.get(item.rowid);
            if (!animalId) {
                importResult.warnings.push(`Condomínio: RowId ${item.rowid} não localizado para vincular cota.`);
                continue;
            }

            const ownerName = normalizeSpaces(item.owner).toUpperCase();
            if (!ownerName) continue;

            const { data: existingShare, error: existingShareError } = await (supabase as any)
                .from('animal_ownership_shares')
                .select('id')
                .eq('haras_id', harasId)
                .eq('animal_id', animalId)
                .eq('owner_name', ownerName)
                .maybeSingle();

            if (existingShareError) {
                importResult.warnings.push(`Condomínio: falha ao verificar cota do RowId ${item.rowid}.`);
                continue;
            }

            if (existingShare?.id) {
                const { error: updateError } = await (supabase as any)
                    .from('animal_ownership_shares')
                    .update({
                        percentage: 100,
                        is_primary: true,
                        source: 'abccmm_condominio',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingShare.id);

                if (updateError) {
                    importResult.warnings.push(`Condomínio: falha ao atualizar cota do RowId ${item.rowid}.`);
                } else {
                    updatedShares += 1;
                }
            } else {
                const { error: insertError } = await (supabase as any)
                    .from('animal_ownership_shares')
                    .insert({
                        haras_id: harasId,
                        animal_id: animalId,
                        owner_name: ownerName,
                        percentage: 100,
                        is_primary: true,
                        source: 'abccmm_condominio',
                    });

                if (insertError) {
                    importResult.warnings.push(`Condomínio: falha ao inserir cota do RowId ${item.rowid}.`);
                } else {
                    insertedShares += 1;
                }
            }
        }

        importResult.warnings.push(`Condomínio: cotas processadas (${insertedShares} novas, ${updatedShares} atualizadas).`);
        return importResult;
    },

    async importAwardsFromSpreadsheet(params: {
        file: File;
        harasId: string;
        source: 'associado' | 'condominio';
        onProgress?: (progress: number, message: string) => void;
    }): Promise<AwardImportResult> {
        const { file, harasId, source, onProgress } = params;
        const warnings: string[] = [];
        const errors: string[] = [];

        const report = (progress: number, message: string) => {
            if (onProgress) onProgress(Math.max(0, Math.min(100, Math.round(progress))), message);
        };

        report(10, 'Lendo planilha de premiações...');
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array', raw: true, cellDates: false });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) throw new Error('Planilha de premiações sem aba válida.');

        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], {
            defval: '',
            raw: true,
            blankrows: false,
        });

        if (rows.length === 0) {
            throw new Error('Planilha de premiações vazia.');
        }

        report(30, 'Validando animais por RowId...');
        const normalizedRows = rows.map((row, idx) => ({ idx: idx + 2, data: normalizeRowKeys(row) }));
        const rowIds = Array.from(new Set(normalizedRows
            .map((row) => normalizeSpaces(String(row.data.rowid || row.data._rowid || '')).trim())
            .filter(Boolean)));

        const rowIdToAnimalId = new Map<string, string>();
        if (rowIds.length > 0) {
            const chunks = chunkArray(rowIds, ABCCMM_BATCH_SIZE);
            for (const chunk of chunks) {
                const { data: matchedAnimals, error: matchError } = await (supabase as any)
                    .from('animals')
                    .select('id, abccmm_rowid')
                    .eq('haras_id', harasId)
                    .in('abccmm_rowid', chunk);

                if (matchError) handleSupabaseError(matchError);

                (matchedAnimals || []).forEach((item: { id: string; abccmm_rowid: string | null }) => {
                    if (item.abccmm_rowid) rowIdToAnimalId.set(item.abccmm_rowid, item.id);
                });
            }
        }

        report(55, 'Importando premiações...');
        let processedRows = 0;
        let insertedAwards = 0;
        let updatedAwards = 0;

        for (const row of normalizedRows) {
            const sourceRowId = normalizeSpaces(String(row.data.rowid || row.data._rowid || '')).trim();
            if (!sourceRowId) {
                warnings.push(`Linha ${row.idx}: RowId ausente, ignorada.`);
                continue;
            }

            processedRows += 1;
            const animalId = rowIdToAnimalId.get(sourceRowId);
            if (!animalId) {
                warnings.push(`Linha ${row.idx}: RowId ${sourceRowId} não encontrado no plantel, ignorada.`);
                continue;
            }

            const eventNameRaw = row.data.nomeexposicao || row.data._evento || row.data.evento || '';
            const locationRaw = row.data.cidadeestado || row.data._cidadeuf || row.data.local || '';
            const periodRaw = row.data.periodo || row.data._periodo || row.data.dataevento || '';
            const awardRaw = row.data.premiacao || row.data._premiacao || row.data.colocacao || '';
            const eventCodeRaw = row.data.codigoevento || row.data._julgados || row.data.julgados || '';
            const categoryRaw = row.data.categoria || null;

            const evento = normalizeSpaces(decode(String(eventNameRaw || '')).trim());
            const local = normalizeSpaces(decode(String(locationRaw || '')).trim()) || null;
            const colocacao = normalizeSpaces(decode(String(awardRaw || '')).trim());
            const categoria = categoryRaw ? normalizeSpaces(decode(String(categoryRaw)).trim()) : null;
            const dataEvento = parseMonthYearPeriod(periodRaw) || new Date().toISOString().slice(0, 10);
            const sourceEventCode = normalizeSpaces(String(eventCodeRaw || '').trim()) || null;

            if (!evento || !colocacao) {
                warnings.push(`Linha ${row.idx}: dados essenciais da premiação ausentes, ignorada.`);
                continue;
            }

            const sourceHash = makeImportHash([
                source,
                sourceRowId,
                sourceEventCode,
                evento,
                colocacao,
                dataEvento,
            ]);

            const awardPayload: any = {
                haras_id: harasId,
                animal_id: animalId,
                evento,
                local,
                data_evento: dataEvento,
                categoria,
                colocacao,
                pontuacao: null,
                observacoes: source === 'condominio' ? 'Importado de premiações de animais em condomínio.' : 'Importado de premiação de associado.',
                source,
                source_rowid: sourceRowId,
                source_event_code: sourceEventCode,
                source_hash: sourceHash,
            };

            const { data: existingAward, error: existingAwardError } = await (supabase as any)
                .from('awards')
                .select('id')
                .eq('haras_id', harasId)
                .eq('source_hash', sourceHash)
                .maybeSingle();

            if (existingAwardError) {
                errors.push(`Linha ${row.idx}: falha ao verificar premiação existente.`);
                continue;
            }

            if (existingAward?.id) {
                const { error: updateError } = await (supabase as any)
                    .from('awards')
                    .update({ ...awardPayload, updated_at: new Date().toISOString() })
                    .eq('id', existingAward.id);

                if (updateError) {
                    errors.push(`Linha ${row.idx}: falha ao atualizar premiação.`);
                } else {
                    updatedAwards += 1;
                }
            } else {
                const { error: insertError } = await (supabase as any)
                    .from('awards')
                    .insert(awardPayload);

                if (insertError) {
                    errors.push(`Linha ${row.idx}: falha ao inserir premiação.`);
                } else {
                    insertedAwards += 1;
                }
            }
        }

        report(100, 'Importação de premiações concluída.');
        return {
            processedRows,
            insertedAwards,
            updatedAwards,
            warnings,
            errors,
        };
    },

    async listAwardsByAnimal(animalId: string, harasId?: string): Promise<Array<{
        id: string;
        eventName: string;
        date: string;
        location: string;
        category: string;
        placement: string;
        placementType: '1º Lugar' | '2º Lugar' | '3º Lugar' | 'Campeão' | 'Reservado' | 'Menção Honrosa';
        points?: number;
        description?: string;
        photos: string[];
        certificate?: string;
    }>> {
        let query = (supabase as any)
            .from('awards')
            .select('id, evento, data_evento, local, categoria, colocacao, pontuacao, observacoes')
            .eq('animal_id', animalId)
            .order('data_evento', { ascending: false });

        if (harasId) query = query.eq('haras_id', harasId);

        const { data, error } = await query;
        if (error) handleSupabaseError(error);

        const mapPlacementType = (value: string): '1º Lugar' | '2º Lugar' | '3º Lugar' | 'Campeão' | 'Reservado' | 'Menção Honrosa' => {
            const key = value.toLowerCase();
            if (key.includes('campe')) return 'Campeão';
            if (key.includes('reserv')) return 'Reservado';
            if (key.includes('1')) return '1º Lugar';
            if (key.includes('2')) return '2º Lugar';
            if (key.includes('3')) return '3º Lugar';
            return 'Menção Honrosa';
        };

        return (data || []).map((row: any) => ({
            id: row.id,
            eventName: row.evento,
            date: row.data_evento,
            location: row.local || 'Não informado',
            category: row.categoria || 'Sem categoria',
            placement: row.colocacao,
            placementType: mapPlacementType(row.colocacao || ''),
            points: row.pontuacao || undefined,
            description: row.observacoes || undefined,
            photos: [],
            certificate: undefined,
        }));
    },

    /**
     * Conta animais por status
     */
    async countByStatus(harasId: string): Promise<Record<string, number>> {
        const { data, error } = await supabase
            .from('animals')
            .select('status')
            .eq('haras_id', harasId);

        if (error) handleSupabaseError(error);

        const counts: Record<string, number> = {};
        data?.forEach((item: any) => {
            const status = STATUS_MAPPING[item.status] || item.status;
            counts[status] = (counts[status] || 0) + 1;
        });

        return counts;
    },

    /**
     * Conta animais por sexo
     */
    async countBySex(harasId: string): Promise<{ males: number; females: number }> {
        const [{ count: males, error: malesError }, { count: females, error: femalesError }] = await Promise.all([
            supabase
                .from('animals')
                .select('id', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .eq('status', 'Ativo')
                .eq('sexo', 'Macho'),
            supabase
                .from('animals')
                .select('id', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .eq('status', 'Ativo')
                .eq('sexo', 'Fêmea'),
        ]);

        if (malesError) handleSupabaseError(malesError);
        if (femalesError) handleSupabaseError(femalesError);

        return { males: males || 0, females: females || 0 };
    },

    async setAnimalPresence(animalId: string, harasId: string, isAtHaras: boolean): Promise<void> {
        if (!animalId || !harasId) {
            throw new Error('Animal ou haras inválido para atualizar presença.');
        }
        const { error } = await supabase
            .from('animals')
            .update({
                is_at_haras: isAtHaras,
                presence_manual_override: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', animalId)
            .eq('haras_id', harasId);
        if (error) handleSupabaseError(error);
    },

    async getPlantelPresenceCounts(harasId: string): Promise<{ atHaras: number; away: number }> {
        const [{ count: atCount, error: atErr }, { count: awayCount, error: awayErr }] = await Promise.all([
            supabase
                .from('animals')
                .select('id', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .eq('status', 'Ativo')
                .eq('is_at_haras', true),
            supabase
                .from('animals')
                .select('id', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .eq('status', 'Ativo')
                .eq('is_at_haras', false),
        ]);
        if (atErr) handleSupabaseError(atErr);
        if (awayErr) handleSupabaseError(awayErr);
        return { atHaras: atCount || 0, away: awayCount || 0 };
    },

    async getCondominiosVencendo(harasId: string, daysAhead: number = 30): Promise<number> {
        // Conta cotas ativas (end_date null/futuro) com prazo vencendo em até daysAhead dias
        // ou já vencidas que ainda não foram encerradas.
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);
        const futureStr = new Date(today.getTime() + daysAhead * 86400000).toISOString().slice(0, 10);

        const { data, error } = await supabase
            .from('animal_ownership_shares')
            .select('animal_id, termination_type, termination_date, termination_age_years, animals!inner(data_nascimento)')
            .eq('haras_id', harasId)
            .eq('is_primary', true)
            .or(`end_date.is.null,end_date.gte.${todayStr}`)
            .not('termination_type', 'is', null);

        if (error) handleSupabaseError(error);

        type Row = {
            animal_id: string;
            termination_type: 'date' | 'age' | null;
            termination_date: string | null;
            termination_age_years: number | null;
            animals: { data_nascimento: string | null } | { data_nascimento: string | null }[] | null;
        };

        const rows = (data as unknown as Row[] | null) || [];
        const seen = new Set<string>();
        for (const row of rows) {
            let dueDate: Date | null = null;
            if (row.termination_type === 'date' && row.termination_date) {
                dueDate = new Date(row.termination_date);
            } else if (row.termination_type === 'age' && row.termination_age_years) {
                const animalRec = Array.isArray(row.animals) ? row.animals[0] : row.animals;
                const birth = animalRec?.data_nascimento;
                if (birth) {
                    const b = new Date(birth);
                    dueDate = new Date(b.setFullYear(b.getFullYear() + row.termination_age_years));
                }
            }
            if (!dueDate) continue;
            const dueStr = dueDate.toISOString().slice(0, 10);
            if (dueStr <= futureStr) {
                seen.add(row.animal_id);
            }
        }
        return seen.size;
    },
};
