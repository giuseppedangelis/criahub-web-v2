// ============================================
// ANIMALS SERVICE
// Gerencia operações com animais
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import * as XLSX from 'xlsx';
import { decode } from 'html-entities';
import type {
    Animal,
    AnimalSex,
    AnimalGenealogy,
    AnimalFilters,
    CreateAnimalInput,
    UpdateAnimalInput,
    PaginationParams,
    PaginatedResponse,
    GenealogyNode,
    ABCCMMImportResult
} from '@/types';

const CATEGORY_MAPPING: Record<string, string> = {
    'potro': 'Potro',
    'potra': 'Potranca',
    'garanhao': 'Garanhão',
    'egua': 'Égua',
    'castrado': 'Castrado'
};

// Reverse mapping: database values -> frontend values
const DB_TO_FRONTEND_CATEGORY: Record<string, string> = {
    'Potro': 'potro',
    'Potranca': 'potra',
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
    'Provisorio': 'provisorio',
    'Provisório': 'provisorio',
    'Vendido': 'vendido',
    'Falecido': 'morto',
    'Transferido': 'emprestado'
};

const REVERSE_STATUS_MAPPING: Record<string, string> = Object.entries(STATUS_MAPPING).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as Record<string, string>);

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

        let query = supabase
            .from('animals')
            .select(`
                id, abccmm_rowid, haras_id, nome, registro, chip, marca,
                sexo, categoria, data_nascimento, pelagem, andamento,
                status, status_manejo, pai_id, mae_id, localizacao, piquete,
                height, weight, haras_origem, tipo_servico, para_venda, valor_venda,
                foto_url, images, documents, observacoes, father_name, mother_name,
                criador, proprietario,
                created_at, updated_at
            `, { count: 'exact' });

        // Aplicar filtros
        if (filters.haras_id) {
            query = query.eq('haras_id', filters.haras_id);
        }
        if (filters.sex) {
            query = query.eq('sexo', filters.sex);
        }
        if (filters.category) {
            query = query.eq('categoria', CATEGORY_MAPPING[filters.category] || filters.category);
        }
        if (filters.status) {
            // Mapear status do filtro para status do banco
            const dbStatus = REVERSE_STATUS_MAPPING[filters.status] || filters.status;
            query = query.eq('status', dbStatus);
        }
        if (filters.search) {
            query = query.or(`nome.ilike.%${filters.search}%,registro.ilike.%${filters.search}%`);
        }

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
            brand: item.marca,
            sex: item.sexo,
            birth_date: item.data_nascimento,
            coat_color: item.pelagem,
            gait: item.andamento,
            weight: item.weight,
            height: item.height,
            origin_haras: item.haras_origem,
            status: STATUS_MAPPING[item.status] || item.status?.toLowerCase(),
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
        }));

        return formatPaginatedResponse(mappedData as Animal[], count || 0, pagination);
    },

    /**
     * Busca um animal pelo ID com dados completos para a ficha do animal
     */
    async getById(id: string): Promise<Animal | null> {
        // Buscar dados do animal
        const { data: animalData, error: animalError } = await supabase
            .from('animals')
            .select(`
                id, haras_id, nome, registro, chip, marca,
                sexo, categoria, data_nascimento, pelagem, andamento,
                status, status_manejo, pai_id, mae_id, localizacao, piquete,
                height, weight, haras_origem, tipo_servico, para_venda, valor_venda,
                foto_url, images, documents, observacoes, father_name, mother_name,
                criador, proprietario,
                created_at, updated_at
            `)
            .eq('id', id)
            .single();

        console.log('Raw animal data from DB:', JSON.stringify(animalData, null, 2));
        console.log('Raw images from DB:', JSON.stringify((animalData as any)?.images));
        console.log('Raw documents from DB:', JSON.stringify((animalData as any)?.documents));

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
            brand: data.marca,
            sex: data.sexo,
            category: REVERSE_CATEGORY_MAPPING[data.categoria] || data.categoria,
            birth_date: data.data_nascimento,
            coat_color: data.pelagem,
            gait: data.andamento,
            status: STATUS_MAPPING[data.status] || data.status?.toLowerCase(),
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
            marca: data.marca,
            birthDate: data.data_nascimento,
            harasOrigem: data.haras_origem,
            localizacao: data.localizacao,
            servicoTipo: data.tipo_servico,
            haras: harasData?.name || '-',
            image: data.foto_url || '',

            // Adicionar relacionamentos
            father: fatherData,
            mother: motherData,

            // Status no plantel (mapear do status)
            statusAtividade: data.status === 'Ativo' ? 'Ativo' : 'Inativo',

            // Dados calculados
            filhos: offspringCount || 0,
            coverageCount,
            lastReproductiveEvent,

            // Dados que não existem no banco (inicializar como null/0)
            premiacoes: 0,
            videos: [],
            reproductionType: data.tipo_servico,
            activeForReproduction: data.para_venda,
            statusHistorico: [],
            motivoInativacao: parseStatusManejo(data.status_manejo)?.motivo || (data.status !== 'Ativo' ? data.status : null),
            dataInativacao: parseStatusManejo(data.status_manejo)?.data || null,

            // Outros campos
            father_name: data.father_name,
            mother_name: data.mother_name,
            criador: data.criador,
            proprietario: data.proprietario,
            observations: data.observacoes,
        };

        return mappedData as unknown as Animal;
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
        const resolvedStatus = input.status
            ? (REVERSE_STATUS_MAPPING[input.status] ?? input.status)
            : 'Ativo';

        const normalizedImages = input.images && input.images.length > 0 ? input.images : undefined;
        const mainImageUrl = input.main_image_url || (normalizedImages ? normalizedImages[0] : undefined);

        const dbInput = {
            haras_id: input.haras_id,
            nome: input.name,
            registro: input.registry_number,
            chip: input.chip_number,
            marca: input.brand,
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
        if (updateData.brand !== undefined) dbInput.marca = updateData.brand;
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
                id, haras_id, nome, registro, chip, marca,
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
            brand: item.marca,
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
            .select('id, nome, registro')
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
            .select('id, nome, registro')
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

        const toInsert: Array<{
            haras_id: string;
            abccmm_rowid: string;
            nome: string;
            registro: string;
            sexo: AnimalSex;
            categoria: string;
            status: string;
            data_nascimento: string | null;
            chip: string | null;
            pelagem: string | null;
            criador: string | null;
            proprietario: string | null;
            father_name: string | null;
            mother_name: string | null;
            dados_genealogicos: ExtendedGenealogyData | null;
        }> = [];
        const toUpdate: Array<{
            id: string;
            payload: {
                abccmm_rowid: string;
                nome: string;
                registro: string;
                sexo: AnimalSex;
                categoria: string;
                status: string;
                data_nascimento: string | null;
                chip: string | null;
                pelagem: string | null;
                criador: string | null;
                proprietario: string | null;
                father_name: string | null;
                mother_name: string | null;
                dados_genealogicos: ExtendedGenealogyData | null;
            };
        }> = [];

        Array.from(seedMap.values()).forEach((seed) => {
            const details = linkSeedMap.get(seed.rowid);
            const payload = {
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
                dados_genealogicos: details?.dadosGenealogicos ?? null,
            };

            const existingId = existingByRowId.get(seed.rowid);

            if (existingId) {
                toUpdate.push({ id: existingId, payload });
                return;
            }

            toInsert.push({
                haras_id: harasId,
                ...payload,
            });
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
                    .update(item.payload)
                    .eq('id', item.id)
                    .eq('haras_id', harasId);

                if (error) handleSupabaseError(error);
                updatedCount += 1;
                idsByRowId.set(item.payload.abccmm_rowid, item.id);
                idsByRegistro.set(item.payload.registro, item.id);
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
                    .update(item.payload)
                    .eq('id', item.id)
                    .eq('haras_id', harasId);

                if (error) handleSupabaseError(error);
            }
            reportProgress(90 + ((chunkIndex + 1) / linkChunks.length) * 9, 'Construindo árvore genealógica...');
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
        const { data, error } = await supabase
            .from('animals')
            .select('sexo')
            .eq('haras_id', harasId)
            .eq('status', 'Ativo');

        if (error) handleSupabaseError(error);

        const males = data?.filter((a: any) => a.sexo === 'Macho').length || 0;
        const females = data?.filter((a: any) => a.sexo === 'Fêmea').length || 0;

        return { males, females };
    }
};
