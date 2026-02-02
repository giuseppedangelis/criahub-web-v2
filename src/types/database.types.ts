export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Apenas os 3 roles principais para a versão web
export type UserRole = 'admin' | 'criador' | 'assessor' | 'acessor'

export type AnimalSex = 'Macho' | 'Fêmea'

export type AnimalCategory =
  | 'Potro'
  | 'Potranca'
  | 'Garanhão'
  | 'Égua'
  | 'Castrado'

export type AnimalStatus =
  | 'Ativo'
  | 'Vendido'
  | 'Falecido'
  | 'Transferido'
  | 'Em serviço'

export type ReproductiveEventType =
  | 'cobertura'
  | 'inseminacao'
  | 'coleta_ovulos'
  | 'transferencia_embriao'

export type GestationStatus =
  | 'confirmada'
  | 'em_andamento'
  | 'nascimento'
  | 'aborto'
  | 'reabsorvida'

export type TransactionType = 'receita' | 'despesa'

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
  | 'outros'

export type ServiceOrderStatus =
  | 'pendente'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado'

export type NotificationType =
  | 'saude'
  | 'reproducao'
  | 'financeiro'
  | 'geral'
  | 'sistema'

export type HarasMemberRole = 'owner' | 'manager' | 'employee'

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
          created_at: string
          updated_at: string
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
          updated_at?: string
        }
      }
      haras: {
        Row: {
          id: string
          nome: string
          owner_id: string
          cnpj: string | null
          address: string | null
          city: string | null
          state: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          subscription_plan: string
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          owner_id: string
          cnpj?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          subscription_plan?: string
          subscription_status?: string
        }
        Update: {
          nome?: string
          owner_id?: string
          cnpj?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          subscription_plan?: string
          subscription_status?: string
          updated_at?: string
        }
      }
      haras_members: {
        Row: {
          id: string
          haras_id: string
          user_id: string
          role: HarasMemberRole
          permissions: Json
          created_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          user_id: string
          role: HarasMemberRole
          permissions?: Json
        }
        Update: {
          haras_id?: string
          user_id?: string
          role?: HarasMemberRole
          permissions?: Json
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
          sexo: AnimalSex
          categoria: AnimalCategory
          data_nascimento: string | null
          pelagem: string | null
          status: AnimalStatus
          pai_id: string | null
          mae_id: string | null
          localizacao: string | null
          piquete: string | null
          haras_origem: string | null
          para_venda: boolean | null
          valor_venda: number | null
          foto_url: string | null
          observacoes: string | null
          weight: number | null
          height: number | null
          father_name: string | null
          mother_name: string | null
          status_manejo: string | null
          tipo_servico: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          nome: string
          registro?: string | null
          chip?: string | null
          marca?: string | null
          sexo: AnimalSex
          categoria: AnimalCategory
          data_nascimento?: string | null
          pelagem?: string | null
          status?: AnimalStatus
          pai_id?: string | null
          mae_id?: string | null
          localizacao?: string | null
          piquete?: string | null
          haras_origem?: string | null
          para_venda?: boolean | null
          valor_venda?: number | null
          foto_url?: string | null
          observacoes?: string | null
          weight?: number | null
          height?: number | null
          father_name?: string | null
          mother_name?: string | null
          status_manejo?: string | null
          tipo_servico?: string | null
        }
        Update: {
          haras_id?: string
          nome?: string
          registro?: string | null
          chip?: string | null
          marca?: string | null
          sexo?: AnimalSex
          categoria?: AnimalCategory
          data_nascimento?: string | null
          pelagem?: string | null
          status?: AnimalStatus
          pai_id?: string | null
          mae_id?: string | null
          localizacao?: string | null
          piquete?: string | null
          haras_origem?: string | null
          para_venda?: boolean | null
          valor_venda?: number | null
          foto_url?: string | null
          observacoes?: string | null
          weight?: number | null
          height?: number | null
          father_name?: string | null
          mother_name?: string | null
          status_manejo?: string | null
          tipo_servico?: string | null
          updated_at?: string
        }
      }
      animal_videos: {
        Row: {
          id: string
          animal_id: string
          haras_id: string
          title: string
          url: string
          source: string | null
          type: string | null
          visibility: string | null
          caption: string | null
          duration: string | null
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          animal_id: string
          haras_id: string
          title: string
          url: string
          source?: string | null
          type?: string | null
          visibility?: string | null
          caption?: string | null
          duration?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          animal_id?: string
          haras_id?: string
          title?: string
          url?: string
          source?: string | null
          type?: string | null
          visibility?: string | null
          caption?: string | null
          duration?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
      }
      reproductive_events: {
        Row: {
          id: string
          haras_id: string
          animal_id: string
          event_type: ReproductiveEventType
          event_date: string
          stallion_id: string | null
          mare_id: string | null
          veterinarian: string | null
          protocol: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          animal_id: string
          event_type: ReproductiveEventType
          event_date: string
          stallion_id?: string | null
          mare_id?: string | null
          veterinarian?: string | null
          protocol?: string | null
          observations?: string | null
        }
        Update: {
          haras_id?: string
          animal_id?: string
          event_type?: ReproductiveEventType
          event_date?: string
          stallion_id?: string | null
          mare_id?: string | null
          veterinarian?: string | null
          protocol?: string | null
          observations?: string | null
          updated_at?: string
        }
      }
      gestations: {
        Row: {
          id: string
          haras_id: string
          mare_id: string
          stallion_id: string | null
          reproductive_event_id: string | null
          start_date: string
          expected_birth_date: string | null
          actual_birth_date: string | null
          status: GestationStatus
          foal_id: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          mare_id: string
          stallion_id?: string | null
          reproductive_event_id?: string | null
          start_date: string
          expected_birth_date?: string | null
          actual_birth_date?: string | null
          status?: GestationStatus
          foal_id?: string | null
          observations?: string | null
        }
        Update: {
          haras_id?: string
          mare_id?: string
          stallion_id?: string | null
          reproductive_event_id?: string | null
          start_date?: string
          expected_birth_date?: string | null
          actual_birth_date?: string | null
          status?: GestationStatus
          foal_id?: string | null
          observations?: string | null
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          haras_id: string
          type: TransactionType
          category: TransactionCategory
          amount: number
          description: string
          date: string
          animal_id: string | null
          reference_id: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          type: TransactionType
          category: TransactionCategory
          amount: number
          description: string
          date: string
          animal_id?: string | null
          reference_id?: string | null
          created_by: string
        }
        Update: {
          haras_id?: string
          type?: TransactionType
          category?: TransactionCategory
          amount?: number
          description?: string
          date?: string
          animal_id?: string | null
          reference_id?: string | null
          updated_at?: string
        }
      }
      service_orders: {
        Row: {
          id: string
          haras_id: string
          client_haras_id: string
          animal_id: string
          service_type: string
          status: ServiceOrderStatus
          price: number
          start_date: string
          end_date: string | null
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          client_haras_id: string
          animal_id: string
          service_type: string
          status?: ServiceOrderStatus
          price: number
          start_date: string
          end_date?: string | null
          observations?: string | null
        }
        Update: {
          haras_id?: string
          client_haras_id?: string
          animal_id?: string
          service_type?: string
          status?: ServiceOrderStatus
          price?: number
          start_date?: string
          end_date?: string | null
          observations?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          message: string
          read?: boolean
          data?: Json | null
        }
        Update: {
          user_id?: string
          type?: NotificationType
          title?: string
          message?: string
          read?: boolean
          data?: Json | null
        }
      }
      events: {
        Row: {
          id: string
          haras_id: string
          title: string
          type: string
          start_date: string
          end_date: string | null
          description: string | null
          animal_id: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          haras_id: string
          title: string
          type: string
          start_date: string
          end_date?: string | null
          description?: string | null
          animal_id?: string | null
          created_by?: string | null
        }
        Update: {
          haras_id?: string
          title?: string
          type?: string
          start_date?: string
          end_date?: string | null
          description?: string | null
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
      user_role: UserRole
      animal_sex: AnimalSex
      animal_category: AnimalCategory
      animal_status: AnimalStatus
      reproductive_event_type: ReproductiveEventType
      gestation_status: GestationStatus
      transaction_type: TransactionType
      transaction_category: TransactionCategory
      service_order_status: ServiceOrderStatus
      notification_type: NotificationType
      haras_member_role: HarasMemberRole
    }
  }
}

// Helper types para exportação direta das tabelas
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Haras = Database['public']['Tables']['haras']['Row']
export type HarasMember = Database['public']['Tables']['haras_members']['Row']
export type Animal = Database['public']['Tables']['animals']['Row']
export type AnimalVideo = Database['public']['Tables']['animal_videos']['Row']
export type ReproductiveEvent = Database['public']['Tables']['reproductive_events']['Row']
export type Gestation = Database['public']['Tables']['gestations']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type ServiceOrder = Database['public']['Tables']['service_orders']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Event = Database['public']['Tables']['events']['Row']
