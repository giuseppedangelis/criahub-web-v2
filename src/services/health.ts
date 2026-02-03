// ============================================
// HEALTH SERVICE
// Gerencia procedimentos, vacinas e exames
// ============================================

import { supabase, handleSupabaseError, getCurrentHarasId } from './base';
import type {
    HealthRecord,
    VaccineRecord,
    ExamRecord,
    CreateHealthRecordInput,
    CreateVaccineInput,
    CreateExamInput
} from '@/types';

const PROCEDURE_TYPE_DB_MAP: Record<string, string> = {
    consulta: 'Consulta',
    cirurgia: 'Cirurgia',
    dentista: 'Dentista',
    casqueamento: 'Casqueamento',
    vermifugacao: 'Vermifuga\u00e7\u00e3o',
    vacinacao: 'Vacina\u00e7\u00e3o',
    exame: 'Exame',
    outro: 'Outro',
    emergencia: 'Outro'
};

function normalizeKey(value: string | null | undefined): string {
    if (!value) return '';
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function toDbProcedureType(value: string): string {
    const key = normalizeKey(value);
    return PROCEDURE_TYPE_DB_MAP[key] || value;
}

async function resolveHarasId(animalId: string, explicitHarasId?: string): Promise<string | null> {
    if (explicitHarasId) return explicitHarasId;
    const currentHarasId = await getCurrentHarasId();
    if (currentHarasId) return currentHarasId;

    const { data, error } = await supabase
        .from('animals')
        .select('haras_id')
        .eq('id', animalId)
        .single();

    if (error) handleSupabaseError(error);
    return (data as { haras_id?: string | null })?.haras_id || null;
}

async function uploadExamFiles(animalId: string, files?: File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const uploaded: string[] = [];
    for (const file of files) {
        const ext = file.name.split('.').pop();
        const fileName = `${animalId}/exams/${Date.now()}_${Math.random().toString(36).substring(7)}${ext ? `.${ext}` : ''}`;

        const { error: uploadError } = await supabase.storage
            .from('animals')
            .upload(fileName, file);

        if (uploadError) handleSupabaseError(uploadError);

        const { data } = supabase.storage
            .from('animals')
            .getPublicUrl(fileName);

        if (data?.publicUrl) uploaded.push(data.publicUrl);
    }

    return uploaded;
}

function mapHealthRecord(row: any): HealthRecord {
    return {
        id: row.id,
        animal_id: row.animal_id,
        haras_id: row.haras_id,
        procedure_date: row.data_procedimento,
        type: row.tipo,
        veterinarian: row.veterinario ?? null,
        description: row.descricao ?? null,
        cost: row.custo ?? null,
        next_date: row.proximadata ?? null,
        observations: row.observacoes ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

function mapVaccine(row: any): VaccineRecord {
    return {
        id: row.id,
        animal_id: row.animal_id,
        haras_id: row.haras_id,
        name: row.nome_vacina,
        application_date: row.data_aplicacao,
        next_dose_date: row.data_proxima_dose ?? null,
        lot: row.lote ?? null,
        manufacturer: row.fabricante ?? null,
        veterinarian: row.veterinario ?? null,
        observations: row.observacoes ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

function mapExam(row: any): ExamRecord {
    return {
        id: row.id,
        animal_id: row.animal_id,
        haras_id: row.haras_id,
        exam_type: row.tipo_exame,
        exam_date: row.data_exame,
        veterinarian: row.veterinario ?? null,
        laboratory: row.laboratorio ?? null,
        result: row.resultado ?? null,
        file_urls: row.file_urls ?? null,
        observations: row.observacoes ?? null,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

export const healthService = {
    async listHealthRecords(animalId: string): Promise<HealthRecord[]> {
        const { data, error } = await supabase
            .from('health_records')
            .select('*')
            .eq('animal_id', animalId)
            .order('data_procedimento', { ascending: false });

        if (error) handleSupabaseError(error);
        return (data || []).map(mapHealthRecord);
    },

    async createHealthRecord(input: CreateHealthRecordInput): Promise<HealthRecord> {
        const harasId = await resolveHarasId(input.animal_id, input.haras_id);
        if (!harasId) {
            throw new Error('Haras nao encontrado para registrar procedimento.');
        }

        const dbInput = {
            haras_id: harasId,
            animal_id: input.animal_id,
            data_procedimento: input.procedure_date,
            tipo: toDbProcedureType(input.type),
            veterinario: input.veterinarian || null,
            descricao: input.description || null,
            custo: input.cost ?? null,
            proximadata: input.next_date || null,
            observacoes: input.observations || null
        };

        const { data, error } = await supabase
            .from('health_records')
            .insert(dbInput)
            .select('*')
            .single();

        if (error) handleSupabaseError(error);
        return mapHealthRecord(data);
    },

    async listVaccines(animalId: string): Promise<VaccineRecord[]> {
        const { data, error } = await supabase
            .from('vaccines')
            .select('*')
            .eq('animal_id', animalId)
            .order('data_aplicacao', { ascending: false });

        if (error) handleSupabaseError(error);
        return (data || []).map(mapVaccine);
    },

    async createVaccine(input: CreateVaccineInput): Promise<VaccineRecord> {
        const harasId = await resolveHarasId(input.animal_id, input.haras_id);
        if (!harasId) {
            throw new Error('Haras nao encontrado para registrar vacina.');
        }

        const dbInput = {
            haras_id: harasId,
            animal_id: input.animal_id,
            nome_vacina: input.name,
            data_aplicacao: input.application_date,
            data_proxima_dose: input.next_dose_date || null,
            lote: input.lot || null,
            fabricante: input.manufacturer || null,
            veterinario: input.veterinarian || null,
            observacoes: input.observations || null
        };

        const { data, error } = await supabase
            .from('vaccines')
            .insert(dbInput)
            .select('*')
            .single();

        if (error) handleSupabaseError(error);
        return mapVaccine(data);
    },

    async listExams(animalId: string): Promise<ExamRecord[]> {
        const { data, error } = await supabase
            .from('exams')
            .select('*')
            .eq('animal_id', animalId)
            .order('data_exame', { ascending: false });

        if (error) handleSupabaseError(error);
        return (data || []).map(mapExam);
    },

    async createExam(input: CreateExamInput): Promise<ExamRecord> {
        const harasId = await resolveHarasId(input.animal_id, input.haras_id);
        if (!harasId) {
            throw new Error('Haras nao encontrado para registrar exame.');
        }

        const uploadedUrls = await uploadExamFiles(input.animal_id, input.files);
        const fileUrls = [...(input.file_urls || []), ...uploadedUrls];

        const dbInput = {
            haras_id: harasId,
            animal_id: input.animal_id,
            tipo_exame: input.exam_type,
            data_exame: input.exam_date,
            veterinario: input.veterinarian || null,
            laboratorio: input.laboratory || null,
            resultado: input.result || null,
            file_urls: fileUrls.length > 0 ? fileUrls : null,
            observacoes: input.observations || null
        };

        const { data, error } = await supabase
            .from('exams')
            .insert(dbInput)
            .select('*')
            .single();

        if (error) handleSupabaseError(error);
        return mapExam(data);
    },

    /**
     * Resumo de saude do haras
     */
    async getHealthSummary(harasId: string): Promise<{
        totalAnimals: number;
        vaccinatedUpToDate: number;
        vaccineOverdue: number;
        activeAlerts: number;
        totalProcedures: number;
    }> {
        const today = new Date().toISOString().split('T')[0];

        const [
            { count: animalsCount, error: animalsError },
            { count: overdueCount, error: overdueError },
            { count: upToDateCount, error: upToDateError },
            { count: noNextDoseCount, error: noNextDoseError },
            { count: alertsCount, error: alertsError },
            { count: proceduresCount, error: proceduresError },
        ] = await Promise.all([
            supabase
                .from('animals')
                .select('*', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .eq('status', 'Ativo'),
            supabase
                .from('vaccines')
                .select('*', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .lt('data_proxima_dose', today),
            supabase
                .from('vaccines')
                .select('*', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .gte('data_proxima_dose', today),
            supabase
                .from('vaccines')
                .select('*', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .is('data_proxima_dose', null),
            supabase
                .from('system_alerts')
                .select('*', { count: 'exact', head: true })
                .eq('haras_id', harasId)
                .eq('module', 'saude')
                .is('resolved_at', null),
            supabase
                .from('health_records')
                .select('*', { count: 'exact', head: true })
                .eq('haras_id', harasId),
        ]);

        if (animalsError) handleSupabaseError(animalsError);
        if (overdueError) handleSupabaseError(overdueError);
        if (upToDateError) handleSupabaseError(upToDateError);
        if (noNextDoseError) handleSupabaseError(noNextDoseError);
        if (alertsError) handleSupabaseError(alertsError);
        if (proceduresError) handleSupabaseError(proceduresError);

        return {
            totalAnimals: animalsCount || 0,
            vaccinatedUpToDate: (upToDateCount || 0) + (noNextDoseCount || 0),
            vaccineOverdue: overdueCount || 0,
            activeAlerts: alertsCount || 0,
            totalProcedures: proceduresCount || 0,
        };
    },
};
