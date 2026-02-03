// ============================================
// COLLABORATORS SERVICE
// Gerencia criação de colaboradores (usuários do haras)
// ============================================

import { supabase, handleSupabaseError } from './base';

export interface CreateCollaboratorInput {
    full_name: string;
    email: string;
    password: string;
    role: 'acessor' | 'assessor' | 'veterinario' | 'peao' | 'funcionario';
    haras_id: string;
    permissions?: Record<string, any>;
}

export const collaboratorsService = {
    /**
     * Cria um novo colaborador
     * Chama função SQL que usa SECURITY DEFINER
     */
    async createCollaborator(input: CreateCollaboratorInput): Promise<{ user_id: string }> {
        try {
            // Chamar função SQL
            const { data, error } = await supabase.rpc('create_collaborator', {
                p_email: input.email,
                p_password: input.password,
                p_full_name: input.full_name,
                p_role: input.role,
                p_haras_id: input.haras_id
            });

            if (error) {
                console.error('Erro ao criar colaborador:', error);
                throw error;
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            return { user_id: data.user_id };
        } catch (error) {
            console.error('Error creating collaborator:', error);
            throw error;
        }
    }
};
