// ============================================
// ANIMALS SERVICE
// Gerencia operações com animais
// ============================================

import { supabase, applyPagination, formatPaginatedResponse, handleSupabaseError } from './base';
import type {
    Animal,
    AnimalGenealogy,
    AnimalFilters,
    CreateAnimalInput,
    UpdateAnimalInput,
    PaginationParams,
    PaginatedResponse,
    GenealogyNode
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
    'Vendido': 'vendido',
    'Falecido': 'morto',
    'Transferido': 'emprestado'
};

const REVERSE_STATUS_MAPPING: Record<string, string> = Object.entries(STATUS_MAPPING).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {} as Record<string, string>);

const GENEALOGY_SELECT_FIELDS = `
    id, nome, registro, foto_url, images, pai_id, mae_id, father_name, mother_name
`;

function mapGenealogyNode(row: any): GenealogyNode {
    const images = Array.isArray(row.images) ? row.images : [];
    const mainImage = row.foto_url || (images.length > 0 ? images[0] : null);

    return {
        id: row.id,
        name: row.nome,
        registry_number: row.registro ?? null,
        main_image_url: mainImage,
        father_id: row.pai_id ?? null,
        mother_id: row.mae_id ?? null,
        father_name: row.father_name ?? null,
        mother_name: row.mother_name ?? null
    };
}

async function fetchGenealogyNodesByIds(ids: string[]): Promise<GenealogyNode[]> {
    if (!ids.length) return [];

    const { data, error } = await supabase
        .from('animals')
        .select(GENEALOGY_SELECT_FIELDS)
        .in('id', ids);

    if (error) handleSupabaseError(error);

    return (data || []).map(mapGenealogyNode);
}

function getUniqueIds(ids: Array<string | null | undefined>): string[] {
    return Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
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
                id, haras_id, nome, registro, chip, marca,
                sexo, categoria, data_nascimento, pelagem, andamento,
                status, status_manejo, pai_id, mae_id, localizacao, piquete,
                height, weight, haras_origem, tipo_servico, para_venda, valor_venda,
                foto_url, images, documents, observacoes, father_name, mother_name,
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

        let currentIds = getUniqueIds([root.father_id, root.mother_id]);

        for (let level = 0; level < 3 && currentIds.length > 0; level++) {
            const fetched = await fetchGenealogyNodesByIds(currentIds);
            fetched.forEach((node) => {
                nodes[node.id] = node;
            });

            currentIds = getUniqueIds(
                fetched.flatMap((node) => [node.father_id, node.mother_id])
            );
        }

        return { root, nodes };
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
