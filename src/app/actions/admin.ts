'use server'

import { createClient } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

const CLIENT_OWNER_ROLE: UserRole = 'criador'
const CLIENT_OWNER_PERMISSIONS = {
    viewHerd: true,
    registerActivities: true,
    healthManagement: true,
    reproduction: true,
    financialManagement: true,
    trainingManagement: true,
    teamManagement: true,
    documentManagement: true,
    fullAdministrative: true,
} as const

// Definir tipos simples para evitar dependência circular ou complexa
interface CreateClientData {
    harasName: string;
    ownerName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    plan: string;
    value: number;
    startDate: string;
    dueDay: number;
    permissions: Record<string, boolean>;
}

export async function createClientAction(data: CreateClientData) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!serviceRoleKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY não encontrada');
            return {
                success: false,
                error: 'SUPABASE_SERVICE_ROLE_KEY não configurada. Verifique o console do servidor.'
            };
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // 1. Criar Usuário de Autenticação
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true,
            user_metadata: {
                full_name: data.ownerName,
                phone: data.phone,
            }
        })

        if (authError) throw new Error('Erro ao criar usuário: ' + authError.message)
        if (!authUser.user) throw new Error('Usuário não criado.')

        const userId = authUser.user.id

        // Calcular data de vencimento
        const dueDate = new Date(data.startDate);
        dueDate.setDate(data.dueDay);
        if (dueDate < new Date(data.startDate)) {
            dueDate.setMonth(dueDate.getMonth() + 1);
        }

        // 2. Criar Haras
        const { data: haras, error: harasError } = await supabase
            .from('haras')
            .insert({
                nome: data.harasName,
                proprietario: data.ownerName,
                email: data.email,
                telefone: data.phone,
                subscription_plan: data.plan,
                subscription_status: 'Ativa',
                subscription_start_date: data.startDate,
                subscription_value: data.value,
                subscription_due_date: dueDate.toISOString(),
            })
            .select()
            .single()

        if (harasError) {
            // Rollback usuário se falhar haras (opcional, mas recomendado)
            await supabase.auth.admin.deleteUser(userId)
            throw new Error('Erro ao criar haras: ' + harasError.message)
        }

        const normalizedRole = CLIENT_OWNER_ROLE

        // 3. Atualizar/Criar Perfil
        // Tenta atualizar primeiro (caso exista trigger)
        const { error: profileError } = await supabase
            .from('profiles')
            .update({
                role: normalizedRole,
                haras_id: haras.id,
                full_name: data.ownerName,
                phone: data.phone,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.ownerName)}&background=random`
            })
            .eq('id', userId)

        // Se der erro ou não atualizar (se profile não existir), faz upsert
        if (profileError) {
            console.log('Update profile failed, trying upsert', profileError)
        }

        // Forçar o upsert para garantir
        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: data.email,
                role: normalizedRole,
                haras_id: haras.id,
                full_name: data.ownerName,
                phone: data.phone,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.ownerName)}&background=random`
            })

        if (upsertError) {
            // Não fazemos rollback total aqui pois o usuário e haras já foram criados, 
            // apenas logamos. O admin pode corrigir depois.
            console.error('Erro ao vincular perfil:', upsertError)
            return { success: true, warning: 'Cliente criado, mas houve erro ao vincular perfil: ' + upsertError.message }
        }

        const { data: roleId, error: ensureRoleError } = await supabase.rpc('ensure_default_haras_role', {
            p_haras_id: haras.id,
            p_role: normalizedRole,
            p_created_by: userId,
        })

        if (ensureRoleError) {
            console.error('Erro ao garantir função padrão do haras:', ensureRoleError)
            return { success: true, warning: 'Cliente criado, mas houve erro ao sincronizar a função padrão da equipe: ' + ensureRoleError.message }
        }

        const { data: teamPermissions, error: teamPermissionsError } = await supabase.rpc('default_team_permissions', {
            p_role: normalizedRole,
        })

        if (teamPermissionsError) {
            console.error('Erro ao carregar permissões padrão da equipe:', teamPermissionsError)
        }

        const { error: harasMemberError } = await supabase
            .from('haras_members')
            .upsert({
                haras_id: haras.id,
                user_id: userId,
                role_id: roleId,
                permissions: teamPermissions || CLIENT_OWNER_PERMISSIONS,
                status: 'Ativo',
                created_by: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'haras_id,user_id',
            })

        if (harasMemberError) {
            console.error('Erro ao sincronizar membro do haras:', harasMemberError)
            return { success: true, warning: 'Cliente criado, mas houve erro ao sincronizar o vínculo na equipe: ' + harasMemberError.message }
        }

        return { success: true }

    } catch (err: unknown) {
        console.error('Create Client Action Error:', err)
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Erro inesperado ao cadastrar cliente.'
        }
    }
}
