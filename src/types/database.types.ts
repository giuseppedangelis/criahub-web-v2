export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Apenas os 3 roles principais para a versão web
export type UserRole = 'admin' | 'criador' | 'assessor'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: UserRole
          haras_id: string | null
          phone: string | null
          location: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role: UserRole
          haras_id?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: UserRole
          haras_id?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
        }
      }
      haras: {
        Row: {
          id: string
          nome: string
          endereco: string | null
          cidade: string | null
          estado: string | null
          telefone: string | null
          email: string | null
          logo_url: string | null
          plano: string | null
          plano_status: string | null
          plano_expira_em: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          nome: string
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          telefone?: string | null
          email?: string | null
          logo_url?: string | null
          plano?: string | null
          plano_status?: string | null
          plano_expira_em?: string | null
        }
        Update: {
          nome?: string
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          telefone?: string | null
          email?: string | null
          logo_url?: string | null
          plano?: string | null
          plano_status?: string | null
          plano_expira_em?: string | null
        }
      }
      animals: {
        Row: {
          id: string
          haras_id: string
          nome: string
          registro: string | null
          chip: string | null
          marca: string | null
          sexo: 'Macho' | 'Fêmea'
          categoria: string
          pelagem: string | null
          data_nascimento: string | null
          pai_id: string | null
          mae_id: string | null
          localizacao: string | null
          piquete: string | null
          status: string | null
          para_venda: boolean | null
          valor_venda: number | null
          foto_url: string | null
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          haras_id: string
          nome: string
          registro?: string | null
          chip?: string | null
          marca?: string | null
          sexo: 'Macho' | 'Fêmea'
          categoria: string
          pelagem?: string | null
          data_nascimento?: string | null
          pai_id?: string | null
          mae_id?: string | null
          localizacao?: string | null
          piquete?: string | null
          status?: string | null
          para_venda?: boolean | null
          valor_venda?: number | null
          foto_url?: string | null
          observacoes?: string | null
        }
        Update: {
          haras_id?: string
          nome?: string
          registro?: string | null
          chip?: string | null
          marca?: string | null
          sexo?: 'Macho' | 'Fêmea'
          categoria?: string
          pelagem?: string | null
          data_nascimento?: string | null
          pai_id?: string | null
          mae_id?: string | null
          localizacao?: string | null
          piquete?: string | null
          status?: string | null
          para_venda?: boolean | null
          valor_venda?: number | null
          foto_url?: string | null
          observacoes?: string | null
        }
      }
      gestations: {
        Row: {
          id: string
          egua_id: string
          garanhao_id: string | null
          data_cobertura: string | null
          data_confirmacao: string | null
          data_prevista_parto: string | null
          confirmada: boolean | null
          status: string | null
          potro_id: string | null
          veterinario: string | null
          observacoes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          egua_id: string
          garanhao_id?: string | null
          data_cobertura?: string | null
          data_confirmacao?: string | null
          data_prevista_parto?: string | null
          confirmada?: boolean | null
          status?: string | null
          potro_id?: string | null
          veterinario?: string | null
          observacoes?: string | null
        }
        Update: {
          egua_id?: string
          garanhao_id?: string | null
          data_cobertura?: string | null
          data_confirmacao?: string | null
          data_prevista_parto?: string | null
          confirmada?: boolean | null
          status?: string | null
          potro_id?: string | null
          veterinario?: string | null
          observacoes?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          haras_id: string
          tipo: string
          categoria: string
          descricao: string | null
          valor: number
          data: string
          forma_pagamento: string | null
          status: string | null
          animal_id: string | null
          fornecedor: string | null
          observacoes: string | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          haras_id: string
          tipo: string
          categoria: string
          descricao?: string | null
          valor: number
          data: string
          forma_pagamento?: string | null
          status?: string | null
          animal_id?: string | null
          fornecedor?: string | null
          observacoes?: string | null
          created_by?: string | null
        }
        Update: {
          haras_id?: string
          tipo?: string
          categoria?: string
          descricao?: string | null
          valor?: number
          data?: string
          forma_pagamento?: string | null
          status?: string | null
          animal_id?: string | null
          fornecedor?: string | null
          observacoes?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          categoria: string
          prioridade: string | null
          titulo: string
          mensagem: string | null
          link: string | null
          lida: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          categoria: string
          prioridade?: string | null
          titulo: string
          mensagem?: string | null
          link?: string | null
          lida?: boolean | null
        }
        Update: {
          user_id?: string
          categoria?: string
          prioridade?: string | null
          titulo?: string
          mensagem?: string | null
          link?: string | null
          lida?: boolean | null
        }
      }
      events: {
        Row: {
          id: string
          haras_id: string
          titulo: string
          tipo: string
          data_inicio: string
          data_fim: string | null
          descricao: string | null
          animal_id: string | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          haras_id: string
          titulo: string
          tipo: string
          data_inicio: string
          data_fim?: string | null
          descricao?: string | null
          animal_id?: string | null
          created_by?: string | null
        }
        Update: {
          haras_id?: string
          titulo?: string
          tipo?: string
          data_inicio?: string
          data_fim?: string | null
          descricao?: string | null
          animal_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Haras = Database['public']['Tables']['haras']['Row']
export type Animal = Database['public']['Tables']['animals']['Row']
export type Gestation = Database['public']['Tables']['gestations']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Event = Database['public']['Tables']['events']['Row']
