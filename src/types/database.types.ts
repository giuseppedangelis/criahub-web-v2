export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          title: string
          type: string
          unread: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          title: string
          type: string
          unread?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          title?: string
          type?: string
          unread?: boolean | null
        }
        Relationships: []
      }
      animal_link_queue: {
        Row: {
          confidence: number | null
          created_at: string
          created_by: string | null
          haras_id: string
          id: string
          match_type: string
          official_abccmm_rowid: string | null
          official_animal_id: string | null
          official_registry: string | null
          payload: Json
          provisional_animal_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          haras_id: string
          id?: string
          match_type?: string
          official_abccmm_rowid?: string | null
          official_animal_id?: string | null
          official_registry?: string | null
          payload?: Json
          provisional_animal_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by?: string | null
          haras_id?: string
          id?: string
          match_type?: string
          official_abccmm_rowid?: string | null
          official_animal_id?: string | null
          official_registry?: string | null
          payload?: Json
          provisional_animal_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_link_queue_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_link_queue_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_link_queue_official_animal_id_fkey"
            columns: ["official_animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_link_queue_provisional_animal_id_fkey"
            columns: ["provisional_animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_link_queue_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_location_history: {
        Row: {
          animal_id: string
          changed_at: string
          changed_by: string | null
          created_at: string
          haras_id: string
          id: string
          location_name: string
          location_type: string
          new_location: string
          notes: string | null
          previous_location: string | null
          reason: string | null
          service_type: string | null
        }
        Insert: {
          animal_id: string
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          haras_id: string
          id?: string
          location_name: string
          location_type: string
          new_location: string
          notes?: string | null
          previous_location?: string | null
          reason?: string | null
          service_type?: string | null
        }
        Update: {
          animal_id?: string
          changed_at?: string
          changed_by?: string | null
          created_at?: string
          haras_id?: string
          id?: string
          location_name?: string
          location_type?: string
          new_location?: string
          notes?: string | null
          previous_location?: string | null
          reason?: string | null
          service_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_location_history_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_location_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_location_history_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_ownership_shares: {
        Row: {
          animal_id: string
          created_at: string
          end_date: string | null
          haras_id: string
          id: string
          is_external: boolean
          is_primary: boolean
          notes: string | null
          owner_name: string
          owner_profile_id: string | null
          percentage: number
          physical_location: string | null
          source: string | null
          start_date: string | null
          termination_age_years: number | null
          termination_date: string | null
          termination_type: string | null
          updated_at: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          end_date?: string | null
          haras_id: string
          id?: string
          is_external?: boolean
          is_primary?: boolean
          notes?: string | null
          owner_name: string
          owner_profile_id?: string | null
          percentage: number
          physical_location?: string | null
          source?: string | null
          start_date?: string | null
          termination_age_years?: number | null
          termination_date?: string | null
          termination_type?: string | null
          updated_at?: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          end_date?: string | null
          haras_id?: string
          id?: string
          is_external?: boolean
          is_primary?: boolean
          notes?: string | null
          owner_name?: string
          owner_profile_id?: string | null
          percentage?: number
          physical_location?: string | null
          source?: string | null
          start_date?: string | null
          termination_age_years?: number | null
          termination_date?: string | null
          termination_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_ownership_shares_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_ownership_shares_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_ownership_shares_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_videos: {
        Row: {
          animal_id: string
          caption: string | null
          created_at: string | null
          duration: string | null
          haras_id: string
          id: string
          source: string | null
          thumbnail_url: string | null
          title: string
          type: string | null
          updated_at: string | null
          url: string
          visibility: string | null
        }
        Insert: {
          animal_id: string
          caption?: string | null
          created_at?: string | null
          duration?: string | null
          haras_id: string
          id?: string
          source?: string | null
          thumbnail_url?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          url: string
          visibility?: string | null
        }
        Update: {
          animal_id?: string
          caption?: string | null
          created_at?: string | null
          duration?: string | null
          haras_id?: string
          id?: string
          source?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_videos_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_videos_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          abccmm_rowid: string | null
          andamento: string | null
          categoria: string
          chip: string | null
          created_at: string | null
          criador: string | null
          dados_genealogicos: Json | null
          data_nascimento: string | null
          documents: string[] | null
          father_name: string | null
          foto_url: string | null
          haras_id: string
          haras_origem: string | null
          height: number | null
          id: string
          images: string[] | null
          ingestion_source: string
          is_at_haras: boolean
          localizacao: string | null
          mae_id: string | null
          marca: string | null
          mother_name: string | null
          nome: string
          observacoes: string | null
          pai_id: string | null
          para_venda: boolean | null
          pelagem: string | null
          piquete: string | null
          presence_manual_override: boolean
          proprietario: string | null
          registro: string | null
          sexo: string
          status: string | null
          status_manejo: string | null
          tipo_servico: string | null
          updated_at: string | null
          valor_venda: number | null
          weight: number | null
        }
        Insert: {
          abccmm_rowid?: string | null
          andamento?: string | null
          categoria: string
          chip?: string | null
          created_at?: string | null
          criador?: string | null
          dados_genealogicos?: Json | null
          data_nascimento?: string | null
          documents?: string[] | null
          father_name?: string | null
          foto_url?: string | null
          haras_id: string
          haras_origem?: string | null
          height?: number | null
          id?: string
          images?: string[] | null
          ingestion_source?: string
          is_at_haras?: boolean
          localizacao?: string | null
          mae_id?: string | null
          marca?: string | null
          mother_name?: string | null
          nome: string
          observacoes?: string | null
          pai_id?: string | null
          para_venda?: boolean | null
          pelagem?: string | null
          piquete?: string | null
          presence_manual_override?: boolean
          proprietario?: string | null
          registro?: string | null
          sexo: string
          status?: string | null
          status_manejo?: string | null
          tipo_servico?: string | null
          updated_at?: string | null
          valor_venda?: number | null
          weight?: number | null
        }
        Update: {
          abccmm_rowid?: string | null
          andamento?: string | null
          categoria?: string
          chip?: string | null
          created_at?: string | null
          criador?: string | null
          dados_genealogicos?: Json | null
          data_nascimento?: string | null
          documents?: string[] | null
          father_name?: string | null
          foto_url?: string | null
          haras_id?: string
          haras_origem?: string | null
          height?: number | null
          id?: string
          images?: string[] | null
          ingestion_source?: string
          is_at_haras?: boolean
          localizacao?: string | null
          mae_id?: string | null
          marca?: string | null
          mother_name?: string | null
          nome?: string
          observacoes?: string | null
          pai_id?: string | null
          para_venda?: boolean | null
          pelagem?: string | null
          piquete?: string | null
          presence_manual_override?: boolean
          proprietario?: string | null
          registro?: string | null
          sexo?: string
          status?: string | null
          status_manejo?: string | null
          tipo_servico?: string | null
          updated_at?: string | null
          valor_venda?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_mae_id_fkey"
            columns: ["mae_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_pai_id_fkey"
            columns: ["pai_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_registrations: {
        Row: {
          animal_id: string
          auction_id: string
          comprador_cidade: string | null
          comprador_nome: string | null
          created_at: string | null
          descricao_catalogo: string | null
          documentos_urls: string[] | null
          haras_id: string
          id: string
          numero_lote: number | null
          preco_estimado: number | null
          preco_reserva: number | null
          preco_venda: number | null
          updated_at: string | null
          vendido: boolean | null
        }
        Insert: {
          animal_id: string
          auction_id: string
          comprador_cidade?: string | null
          comprador_nome?: string | null
          created_at?: string | null
          descricao_catalogo?: string | null
          documentos_urls?: string[] | null
          haras_id: string
          id?: string
          numero_lote?: number | null
          preco_estimado?: number | null
          preco_reserva?: number | null
          preco_venda?: number | null
          updated_at?: string | null
          vendido?: boolean | null
        }
        Update: {
          animal_id?: string
          auction_id?: string
          comprador_cidade?: string | null
          comprador_nome?: string | null
          created_at?: string | null
          descricao_catalogo?: string | null
          documentos_urls?: string[] | null
          haras_id?: string
          id?: string
          numero_lote?: number | null
          preco_estimado?: number | null
          preco_reserva?: number | null
          preco_venda?: number | null
          updated_at?: string | null
          vendido?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_registrations_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_registrations_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_registrations_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          comissao_percentual: number | null
          created_at: string | null
          data_leilao: string
          haras_id: string
          id: string
          local: string | null
          nome: string
          observacoes: string | null
          organizador: string | null
          status: string | null
          tipo: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          comissao_percentual?: number | null
          created_at?: string | null
          data_leilao: string
          haras_id: string
          id?: string
          local?: string | null
          nome: string
          observacoes?: string | null
          organizador?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          comissao_percentual?: number | null
          created_at?: string | null
          data_leilao?: string
          haras_id?: string
          id?: string
          local?: string | null
          nome?: string
          observacoes?: string | null
          organizador?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      awards: {
        Row: {
          animal_id: string
          categoria: string | null
          colocacao: string
          created_at: string | null
          data_evento: string
          evento: string
          haras_id: string
          id: string
          juiz: string | null
          local: string | null
          observacoes: string | null
          pontuacao: number | null
          source: string | null
          source_event_code: string | null
          source_hash: string | null
          source_rowid: string | null
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          categoria?: string | null
          colocacao: string
          created_at?: string | null
          data_evento: string
          evento: string
          haras_id: string
          id?: string
          juiz?: string | null
          local?: string | null
          observacoes?: string | null
          pontuacao?: number | null
          source?: string | null
          source_event_code?: string | null
          source_hash?: string | null
          source_rowid?: string | null
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          categoria?: string | null
          colocacao?: string
          created_at?: string | null
          data_evento?: string
          evento?: string
          haras_id?: string
          id?: string
          juiz?: string | null
          local?: string | null
          observacoes?: string | null
          pontuacao?: number | null
          source?: string | null
          source_event_code?: string | null
          source_hash?: string | null
          source_rowid?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      breeding_events: {
        Row: {
          created_at: string
          created_by: string | null
          event_at: string
          haras_id: string
          id: string
          mare_id: string
          method: string
          motility_percent: number | null
          motility_quality: string | null
          notes: string | null
          semen_type: string | null
          stallion_id: string
          status: string
          straws_used: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_at?: string
          haras_id: string
          id?: string
          mare_id: string
          method: string
          motility_percent?: number | null
          motility_quality?: string | null
          notes?: string | null
          semen_type?: string | null
          stallion_id: string
          status?: string
          straws_used?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_at?: string
          haras_id?: string
          id?: string
          mare_id?: string
          method?: string
          motility_percent?: number | null
          motility_quality?: string | null
          notes?: string | null
          semen_type?: string | null
          stallion_id?: string
          status?: string
          straws_used?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "breeding_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_mare_id_fkey"
            columns: ["mare_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_stallion_id_fkey"
            columns: ["stallion_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      coverings: {
        Row: {
          created_at: string | null
          data_cobertura: string
          egua_id: string
          garanhao_id: string
          haras_id: string
          id: string
          observacoes: string | null
          tipo: string
          tipo_semen: string | null
          updated_at: string | null
          veterinario: string | null
        }
        Insert: {
          created_at?: string | null
          data_cobertura: string
          egua_id: string
          garanhao_id: string
          haras_id: string
          id?: string
          observacoes?: string | null
          tipo: string
          tipo_semen?: string | null
          updated_at?: string | null
          veterinario?: string | null
        }
        Update: {
          created_at?: string | null
          data_cobertura?: string
          egua_id?: string
          garanhao_id?: string
          haras_id?: string
          id?: string
          observacoes?: string | null
          tipo?: string
          tipo_semen?: string | null
          updated_at?: string | null
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coverings_egua_id_fkey"
            columns: ["egua_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coverings_garanhao_id_fkey"
            columns: ["garanhao_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coverings_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          animal_id: string | null
          created_at: string | null
          file_url: string
          haras_id: string
          id: string
          observacoes: string | null
          tamanho_bytes: number | null
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          file_url: string
          haras_id: string
          id?: string
          observacoes?: string | null
          tamanho_bytes?: number | null
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          file_url?: string
          haras_id?: string
          id?: string
          observacoes?: string | null
          tamanho_bytes?: number | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      embryos: {
        Row: {
          available: number
          created_at: string | null
          donor_id: string
          grade: string | null
          haras_id: string
          id: string
          method: string | null
          observations: string | null
          production_date: string
          quantity: number
          stallion_id: string | null
          status: string | null
          storage_type: string | null
          updated_at: string | null
          veterinarian: string | null
        }
        Insert: {
          available: number
          created_at?: string | null
          donor_id: string
          grade?: string | null
          haras_id: string
          id?: string
          method?: string | null
          observations?: string | null
          production_date: string
          quantity: number
          stallion_id?: string | null
          status?: string | null
          storage_type?: string | null
          updated_at?: string | null
          veterinarian?: string | null
        }
        Update: {
          available?: number
          created_at?: string | null
          donor_id?: string
          grade?: string | null
          haras_id?: string
          id?: string
          method?: string | null
          observations?: string | null
          production_date?: string
          quantity?: number
          stallion_id?: string | null
          status?: string | null
          storage_type?: string | null
          updated_at?: string | null
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "embryos_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embryos_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embryos_stallion_id_fkey"
            columns: ["stallion_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          animal_id: string | null
          auto_gerado: boolean | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          descricao: string | null
          haras_id: string
          id: string
          local: string | null
          observacoes: string | null
          origem: string | null
          origem_id: string | null
          responsavel: string | null
          status: string | null
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          animal_id?: string | null
          auto_gerado?: boolean | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          descricao?: string | null
          haras_id: string
          id?: string
          local?: string | null
          observacoes?: string | null
          origem?: string | null
          origem_id?: string | null
          responsavel?: string | null
          status?: string | null
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string | null
          auto_gerado?: boolean | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          descricao?: string | null
          haras_id?: string
          id?: string
          local?: string | null
          observacoes?: string | null
          origem?: string | null
          origem_id?: string | null
          responsavel?: string | null
          status?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          animal_id: string
          created_at: string | null
          data_exame: string
          file_urls: string[] | null
          haras_id: string
          id: string
          laboratorio: string | null
          observacoes: string | null
          resultado: string | null
          tipo_exame: string
          updated_at: string | null
          veterinario: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          data_exame: string
          file_urls?: string[] | null
          haras_id: string
          id?: string
          laboratorio?: string | null
          observacoes?: string | null
          resultado?: string | null
          tipo_exame: string
          updated_at?: string | null
          veterinario?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          data_exame?: string
          file_urls?: string[] | null
          haras_id?: string
          id?: string
          laboratorio?: string | null
          observacoes?: string | null
          resultado?: string | null
          tipo_exame?: string
          updated_at?: string | null
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      gestations: {
        Row: {
          covering_id: string | null
          created_at: string | null
          data_diagnostico: string
          data_parto: string | null
          data_prevista_parto: string | null
          egua_id: string
          garanhao_id: string | null
          haras_id: string
          id: string
          intervalo_p4: number | null
          observacoes: string | null
          potro_id: string | null
          status: string | null
          tipo_diagnostico: string | null
          updated_at: string | null
        }
        Insert: {
          covering_id?: string | null
          created_at?: string | null
          data_diagnostico: string
          data_parto?: string | null
          data_prevista_parto?: string | null
          egua_id: string
          garanhao_id?: string | null
          haras_id: string
          id?: string
          intervalo_p4?: number | null
          observacoes?: string | null
          potro_id?: string | null
          status?: string | null
          tipo_diagnostico?: string | null
          updated_at?: string | null
        }
        Update: {
          covering_id?: string | null
          created_at?: string | null
          data_diagnostico?: string
          data_parto?: string | null
          data_prevista_parto?: string | null
          egua_id?: string
          garanhao_id?: string | null
          haras_id?: string
          id?: string
          intervalo_p4?: number | null
          observacoes?: string | null
          potro_id?: string | null
          status?: string | null
          tipo_diagnostico?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gestations_covering_id_fkey"
            columns: ["covering_id"]
            isOneToOne: false
            referencedRelation: "coverings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gestations_egua_id_fkey"
            columns: ["egua_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gestations_garanhao_id_fkey"
            columns: ["garanhao_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gestations_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gestations_potro_id_fkey"
            columns: ["potro_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      haras: {
        Row: {
          cidade: string | null
          created_at: string | null
          email: string | null
          estado: string | null
          id: string
          logo_url: string | null
          nome: string
          proprietario: string | null
          subscription_due_date: string | null
          subscription_plan: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_value: number | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          proprietario?: string | null
          subscription_due_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_value?: number | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          proprietario?: string | null
          subscription_due_date?: string | null
          subscription_plan?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_value?: number | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      haras_members: {
        Row: {
          created_at: string
          created_by: string | null
          haras_id: string
          id: string
          permissions: Json
          role_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          haras_id: string
          id?: string
          permissions?: Json
          role_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          haras_id?: string
          id?: string
          permissions?: Json
          role_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haras_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haras_members_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haras_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "haras_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haras_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      haras_roles: {
        Row: {
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          created_at: string
          created_by: string | null
          description: string | null
          haras_id: string
          id: string
          name: string
          permissions: Json
          updated_at: string
          user_type: string
        }
        Insert: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          haras_id: string
          id?: string
          name: string
          permissions?: Json
          updated_at?: string
          user_type?: string
        }
        Update: {
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          haras_id?: string
          id?: string
          name?: string
          permissions?: Json
          updated_at?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "haras_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haras_roles_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      haras_settings: {
        Row: {
          backup_settings: Json
          created_at: string | null
          haras_id: string
          location_settings: Json
          notification_settings: Json
          privacy_settings: Json
          updated_at: string | null
        }
        Insert: {
          backup_settings?: Json
          created_at?: string | null
          haras_id: string
          location_settings?: Json
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string | null
        }
        Update: {
          backup_settings?: Json
          created_at?: string | null
          haras_id?: string
          location_settings?: Json
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haras_settings_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: true
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      health_audit_logs: {
        Row: {
          action: string
          after_data: Json | null
          animal_id: string | null
          before_data: Json | null
          changed_at: string
          changed_by: string | null
          haras_id: string
          id: string
          record_id: string
          table_name: string
        }
        Insert: {
          action: string
          after_data?: Json | null
          animal_id?: string | null
          before_data?: Json | null
          changed_at?: string
          changed_by?: string | null
          haras_id: string
          id?: string
          record_id: string
          table_name: string
        }
        Update: {
          action?: string
          after_data?: Json | null
          animal_id?: string | null
          before_data?: Json | null
          changed_at?: string
          changed_by?: string | null
          haras_id?: string
          id?: string
          record_id?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_audit_logs_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_audit_logs_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      health_batch_event_animals: {
        Row: {
          animal_id: string
          batch_event_id: string
          created_at: string
          haras_id: string
          id: string
        }
        Insert: {
          animal_id: string
          batch_event_id: string
          created_at?: string
          haras_id: string
          id?: string
        }
        Update: {
          animal_id?: string
          batch_event_id?: string
          created_at?: string
          haras_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_batch_event_animals_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_batch_event_animals_batch_event_id_fkey"
            columns: ["batch_event_id"]
            isOneToOne: false
            referencedRelation: "health_batch_events"
            referencedColumns: ["id"]
          },
        ]
      }
      health_batch_events: {
        Row: {
          application_date: string
          created_at: string
          created_by: string | null
          expiration_date: string | null
          haras_id: string
          id: string
          lot_code: string | null
          notes: string | null
          procedure_name: string
          procedure_type: string
          updated_at: string
          veterinarian: string | null
        }
        Insert: {
          application_date?: string
          created_at?: string
          created_by?: string | null
          expiration_date?: string | null
          haras_id: string
          id?: string
          lot_code?: string | null
          notes?: string | null
          procedure_name: string
          procedure_type: string
          updated_at?: string
          veterinarian?: string | null
        }
        Update: {
          application_date?: string
          created_at?: string
          created_by?: string | null
          expiration_date?: string | null
          haras_id?: string
          id?: string
          lot_code?: string | null
          notes?: string | null
          procedure_name?: string
          procedure_type?: string
          updated_at?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_batch_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          animal_id: string
          created_at: string | null
          custo: number | null
          data_procedimento: string
          descricao: string | null
          haras_id: string
          id: string
          medication_plan: Json
          observacoes: string | null
          proximadata: string | null
          tipo: string
          updated_at: string | null
          veterinario: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          custo?: number | null
          data_procedimento: string
          descricao?: string | null
          haras_id: string
          id?: string
          medication_plan?: Json
          observacoes?: string | null
          proximadata?: string | null
          tipo: string
          updated_at?: string | null
          veterinario?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          custo?: number | null
          data_procedimento?: string
          descricao?: string | null
          haras_id?: string
          id?: string
          medication_plan?: Json
          observacoes?: string | null
          proximadata?: string | null
          tipo?: string
          updated_at?: string | null
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      import_history: {
        Row: {
          arquivo_nome: string
          avisos: number
          created_at: string | null
          erros: number
          haras_id: string
          id: string
          log_detalhado: Json | null
          status: string
          sucesso: number
          tempo_processamento: number | null
          total_linhas: number
          user_id: string
        }
        Insert: {
          arquivo_nome: string
          avisos: number
          created_at?: string | null
          erros: number
          haras_id: string
          id?: string
          log_detalhado?: Json | null
          status: string
          sucesso: number
          tempo_processamento?: number | null
          total_linhas: number
          user_id: string
        }
        Update: {
          arquivo_nome?: string
          avisos?: number
          created_at?: string | null
          erros?: number
          haras_id?: string
          id?: string
          log_detalhado?: Json | null
          status?: string
          sucesso?: number
          tempo_processamento?: number | null
          total_linhas?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_history_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inseminations: {
        Row: {
          created_at: string | null
          data_inseminacao: string
          egua_id: string
          garanhao_id: string | null
          haras_id: string
          id: string
          observacoes: string | null
          tipo_semen: string
          veterinario: string | null
        }
        Insert: {
          created_at?: string | null
          data_inseminacao: string
          egua_id: string
          garanhao_id?: string | null
          haras_id: string
          id?: string
          observacoes?: string | null
          tipo_semen: string
          veterinario?: string | null
        }
        Update: {
          created_at?: string | null
          data_inseminacao?: string
          egua_id?: string
          garanhao_id?: string | null
          haras_id?: string
          id?: string
          observacoes?: string | null
          tipo_semen?: string
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inseminations_egua_id_fkey"
            columns: ["egua_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inseminations_garanhao_id_fkey"
            columns: ["garanhao_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inseminations_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          api_key: string | null
          connected: boolean | null
          created_at: string | null
          id: string
          last_sync: string | null
          name: string
          public_key: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          name: string
          public_key?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          connected?: boolean | null
          created_at?: string | null
          id?: string
          last_sync?: string | null
          name?: string
          public_key?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          categoria: string
          created_at: string | null
          haras_id: string
          id: string
          lida: boolean | null
          link: string | null
          mensagem: string
          prioridade: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Insert: {
          categoria: string
          created_at?: string | null
          haras_id: string
          id?: string
          lida?: boolean | null
          link?: string | null
          mensagem: string
          prioridade?: string | null
          tipo: string
          titulo: string
          user_id: string
        }
        Update: {
          categoria?: string
          created_at?: string | null
          haras_id?: string
          id?: string
          lida?: boolean | null
          link?: string | null
          mensagem?: string
          prioridade?: string | null
          tipo?: string
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ovulations: {
        Row: {
          created_at: string | null
          data_ovulacao: string
          egua_id: string
          haras_id: string
          id: string
          observacoes: string | null
          veterinario: string | null
        }
        Insert: {
          created_at?: string | null
          data_ovulacao: string
          egua_id: string
          haras_id: string
          id?: string
          observacoes?: string | null
          veterinario?: string | null
        }
        Update: {
          created_at?: string | null
          data_ovulacao?: string
          egua_id?: string
          haras_id?: string
          id?: string
          observacoes?: string | null
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ovulations_egua_id_fkey"
            columns: ["egua_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ovulations_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      ovules: {
        Row: {
          available: number
          collection_date: string
          created_at: string | null
          donor_id: string
          haras_id: string
          id: string
          method: string | null
          observations: string | null
          quality: string | null
          quantity: number
          status: string | null
          updated_at: string | null
          veterinarian: string | null
        }
        Insert: {
          available: number
          collection_date: string
          created_at?: string | null
          donor_id: string
          haras_id: string
          id?: string
          method?: string | null
          observations?: string | null
          quality?: string | null
          quantity: number
          status?: string | null
          updated_at?: string | null
          veterinarian?: string | null
        }
        Update: {
          available?: number
          collection_date?: string
          created_at?: string | null
          donor_id?: string
          haras_id?: string
          id?: string
          method?: string | null
          observations?: string | null
          quality?: string | null
          quantity?: number
          status?: string | null
          updated_at?: string | null
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ovules_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ovules_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_validations: {
        Row: {
          created_at: string | null
          created_by: string | null
          data: Json
          haras_id: string
          id: string
          status: string
          type: string
          validated_at: string | null
          validated_by: string | null
          validation_notes: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          data: Json
          haras_id: string
          id?: string
          status?: string
          type: string
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          data?: Json
          haras_id?: string
          id?: string
          status?: string
          type?: string
          validated_at?: string | null
          validated_by?: string | null
          validation_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pending_validations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_validations_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pending_validations_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_metrics: {
        Row: {
          active_users: number
          created_at: string | null
          id: string
          month: string
          new_haras: number
          storage_used_bytes: number
          total_animals: number
          total_haras: number
          year: number
        }
        Insert: {
          active_users: number
          created_at?: string | null
          id?: string
          month: string
          new_haras?: number
          storage_used_bytes?: number
          total_animals: number
          total_haras: number
          year: number
        }
        Update: {
          active_users?: number
          created_at?: string | null
          id?: string
          month?: string
          new_haras?: number
          storage_used_bytes?: number
          total_animals?: number
          total_haras?: number
          year?: number
        }
        Relationships: []
      }
      profile_settings: {
        Row: {
          created_at: string | null
          notification_settings: Json
          privacy_settings: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          notification_settings?: Json
          privacy_settings?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cep: string | null
          city: string | null
          complement: string | null
          created_at: string | null
          email: string
          full_name: string | null
          haras_id: string | null
          id: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          role: string
          state: string | null
          status: string
          street: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          haras_id?: string | null
          id: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          role: string
          state?: string | null
          status?: string
          street?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cep?: string | null
          city?: string | null
          complement?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          haras_id?: string | null
          id?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          role?: string
          state?: string | null
          status?: string
          street?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_haras"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          agendado_para: string | null
          arquivo_url: string | null
          created_at: string | null
          criado_por: string | null
          formato: string
          haras_id: string
          id: string
          nome: string
          parametros: Json | null
          status: string
          tamanho_bytes: number | null
          tipo: string
          updated_at: string | null
        }
        Insert: {
          agendado_para?: string | null
          arquivo_url?: string | null
          created_at?: string | null
          criado_por?: string | null
          formato: string
          haras_id: string
          id?: string
          nome: string
          parametros?: Json | null
          status?: string
          tamanho_bytes?: number | null
          tipo: string
          updated_at?: string | null
        }
        Update: {
          agendado_para?: string | null
          arquivo_url?: string | null
          created_at?: string | null
          criado_por?: string | null
          formato?: string
          haras_id?: string
          id?: string
          nome?: string
          parametros?: Json | null
          status?: string
          tamanho_bytes?: number | null
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      reproduction_documents: {
        Row: {
          animal_id: string | null
          created_at: string | null
          created_by: string | null
          document_type: string
          embryo_id: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          gestation_id: string | null
          haras_id: string
          id: string
          ovule_id: string | null
          reproductive_event_id: string | null
          title: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type: string
          embryo_id?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          gestation_id?: string | null
          haras_id: string
          id?: string
          ovule_id?: string | null
          reproductive_event_id?: string | null
          title: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          embryo_id?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          gestation_id?: string | null
          haras_id?: string
          id?: string
          ovule_id?: string | null
          reproductive_event_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reproduction_documents_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_documents_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_documents_embryo_id_fkey"
            columns: ["embryo_id"]
            isOneToOne: false
            referencedRelation: "embryos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_documents_gestation_id_fkey"
            columns: ["gestation_id"]
            isOneToOne: false
            referencedRelation: "gestations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_documents_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_documents_ovule_id_fkey"
            columns: ["ovule_id"]
            isOneToOne: false
            referencedRelation: "ovules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_documents_reproductive_event_id_fkey"
            columns: ["reproductive_event_id"]
            isOneToOne: false
            referencedRelation: "reproductive_events"
            referencedColumns: ["id"]
          },
        ]
      }
      reproduction_protocol_applications: {
        Row: {
          animal_id: string
          created_at: string | null
          created_by: string | null
          haras_id: string
          id: string
          notes: string | null
          protocol_id: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          created_by?: string | null
          haras_id: string
          id?: string
          notes?: string | null
          protocol_id: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          created_by?: string | null
          haras_id?: string
          id?: string
          notes?: string | null
          protocol_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reproduction_protocol_applications_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_protocol_applications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_protocol_applications_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_protocol_applications_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "reproduction_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      reproduction_protocol_steps: {
        Row: {
          created_at: string | null
          day_offset: number
          description: string | null
          id: string
          name: string
          protocol_id: string
          sort_order: number | null
          step_type: string
        }
        Insert: {
          created_at?: string | null
          day_offset: number
          description?: string | null
          id?: string
          name: string
          protocol_id: string
          sort_order?: number | null
          step_type: string
        }
        Update: {
          created_at?: string | null
          day_offset?: number
          description?: string | null
          id?: string
          name?: string
          protocol_id?: string
          sort_order?: number | null
          step_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reproduction_protocol_steps_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "reproduction_protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      reproduction_protocols: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          haras_id: string
          id: string
          is_active: boolean | null
          name: string
          total_days: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          haras_id: string
          id?: string
          is_active?: boolean | null
          name: string
          total_days?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          haras_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          total_days?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reproduction_protocols_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproduction_protocols_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      reproductive_events: {
        Row: {
          animal_id: string
          auto_generated: boolean | null
          created_at: string | null
          details: Json | null
          event_date: string
          event_type: string
          haras_id: string
          id: string
          mare_id: string | null
          observations: string | null
          priority: string | null
          protocol: string | null
          semen_type: string | null
          stallion_id: string | null
          status: string | null
          updated_at: string | null
          veterinarian: string | null
        }
        Insert: {
          animal_id: string
          auto_generated?: boolean | null
          created_at?: string | null
          details?: Json | null
          event_date: string
          event_type: string
          haras_id: string
          id?: string
          mare_id?: string | null
          observations?: string | null
          priority?: string | null
          protocol?: string | null
          semen_type?: string | null
          stallion_id?: string | null
          status?: string | null
          updated_at?: string | null
          veterinarian?: string | null
        }
        Update: {
          animal_id?: string
          auto_generated?: boolean | null
          created_at?: string | null
          details?: Json | null
          event_date?: string
          event_type?: string
          haras_id?: string
          id?: string
          mare_id?: string | null
          observations?: string | null
          priority?: string | null
          protocol?: string | null
          semen_type?: string | null
          stallion_id?: string | null
          status?: string | null
          updated_at?: string | null
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reproductive_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproductive_events_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproductive_events_mare_id_fkey"
            columns: ["mare_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproductive_events_stallion_id_fkey"
            columns: ["stallion_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      reproductive_exams: {
        Row: {
          animal_id: string
          cervix_score: number
          created_at: string
          created_by: string | null
          exam_at: string
          follicle_left_size: number | null
          follicle_right_size: number | null
          haras_id: string
          id: string
          induction: boolean
          inductor: string | null
          intrauterine_fluid: boolean
          notes: string | null
          updated_at: string
          uterine_edema: number
        }
        Insert: {
          animal_id: string
          cervix_score: number
          created_at?: string
          created_by?: string | null
          exam_at?: string
          follicle_left_size?: number | null
          follicle_right_size?: number | null
          haras_id: string
          id?: string
          induction?: boolean
          inductor?: string | null
          intrauterine_fluid?: boolean
          notes?: string | null
          updated_at?: string
          uterine_edema: number
        }
        Update: {
          animal_id?: string
          cervix_score?: number
          created_at?: string
          created_by?: string | null
          exam_at?: string
          follicle_left_size?: number | null
          follicle_right_size?: number | null
          haras_id?: string
          id?: string
          induction?: boolean
          inductor?: string | null
          intrauterine_fluid?: boolean
          notes?: string | null
          updated_at?: string
          uterine_edema?: number
        }
        Relationships: [
          {
            foreignKeyName: "reproductive_exams_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reproductive_exams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          animal_id: string
          auction_id: string | null
          comprador_cidade: string | null
          comprador_cpf: string | null
          comprador_email: string | null
          comprador_estado: string | null
          comprador_nome: string
          comprador_telefone: string | null
          contrato_assinado: boolean | null
          created_at: string | null
          data_venda: string
          forma_pagamento: string | null
          haras_id: string
          id: string
          observacoes: string | null
          tipo_venda: string
          transferencia_concluida: boolean | null
          updated_at: string | null
          valor: number
        }
        Insert: {
          animal_id: string
          auction_id?: string | null
          comprador_cidade?: string | null
          comprador_cpf?: string | null
          comprador_email?: string | null
          comprador_estado?: string | null
          comprador_nome: string
          comprador_telefone?: string | null
          contrato_assinado?: boolean | null
          created_at?: string | null
          data_venda: string
          forma_pagamento?: string | null
          haras_id: string
          id?: string
          observacoes?: string | null
          tipo_venda: string
          transferencia_concluida?: boolean | null
          updated_at?: string | null
          valor: number
        }
        Update: {
          animal_id?: string
          auction_id?: string | null
          comprador_cidade?: string | null
          comprador_cpf?: string | null
          comprador_email?: string | null
          comprador_estado?: string | null
          comprador_nome?: string
          comprador_telefone?: string | null
          contrato_assinado?: boolean | null
          created_at?: string | null
          data_venda?: string
          forma_pagamento?: string | null
          haras_id?: string
          id?: string
          observacoes?: string | null
          tipo_venda?: string
          transferencia_concluida?: boolean | null
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      semen_inventory_stallion: {
        Row: {
          available_paletas: number
          created_at: string
          haras_id: string
          id: string
          stallion_id: string
          total_entries_paletas: number
          total_outputs_paletas: number
          updated_at: string
        }
        Insert: {
          available_paletas?: number
          created_at?: string
          haras_id: string
          id?: string
          stallion_id: string
          total_entries_paletas?: number
          total_outputs_paletas?: number
          updated_at?: string
        }
        Update: {
          available_paletas?: number
          created_at?: string
          haras_id?: string
          id?: string
          stallion_id?: string
          total_entries_paletas?: number
          total_outputs_paletas?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "semen_inventory_stallion_stallion_id_fkey"
            columns: ["stallion_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      semen_movements: {
        Row: {
          breeding_event_id: string | null
          created_at: string
          created_by: string | null
          haras_id: string
          id: string
          movement_type: string
          notes: string | null
          reason: string | null
          semen_type: string | null
          stallion_id: string
          units_paletas: number
        }
        Insert: {
          breeding_event_id?: string | null
          created_at?: string
          created_by?: string | null
          haras_id: string
          id?: string
          movement_type: string
          notes?: string | null
          reason?: string | null
          semen_type?: string | null
          stallion_id: string
          units_paletas: number
        }
        Update: {
          breeding_event_id?: string | null
          created_at?: string
          created_by?: string | null
          haras_id?: string
          id?: string
          movement_type?: string
          notes?: string | null
          reason?: string | null
          semen_type?: string | null
          stallion_id?: string
          units_paletas?: number
        }
        Relationships: [
          {
            foreignKeyName: "semen_movements_breeding_event_id_fkey"
            columns: ["breeding_event_id"]
            isOneToOne: false
            referencedRelation: "breeding_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semen_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "semen_movements_stallion_id_fkey"
            columns: ["stallion_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          animals: Json | null
          attachments: Json | null
          completion_date: string | null
          created_at: string | null
          created_by: string | null
          description: string
          estimated_value: number | null
          final_value: number | null
          haras_id: string
          id: string
          notes: string | null
          number: string | null
          scheduled_date: string | null
          status: string
          supplier: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          animals?: Json | null
          attachments?: Json | null
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          estimated_value?: number | null
          final_value?: number | null
          haras_id: string
          id?: string
          notes?: string | null
          number?: string | null
          scheduled_date?: string | null
          status?: string
          supplier?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          animals?: Json | null
          attachments?: Json | null
          completion_date?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          estimated_value?: number | null
          final_value?: number | null
          haras_id?: string
          id?: string
          notes?: string | null
          number?: string | null
          scheduled_date?: string | null
          status?: string
          supplier?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_orders_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_files: {
        Row: {
          animal_id: string | null
          bucket_name: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          haras_id: string
          id: string
          mime_type: string | null
          user_id: string | null
        }
        Insert: {
          animal_id?: string | null
          bucket_name: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          haras_id: string
          id?: string
          mime_type?: string | null
          user_id?: string | null
        }
        Update: {
          animal_id?: string | null
          bucket_name?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          haras_id?: string
          id?: string
          mime_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_files_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_files_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          max_horses: number
          max_users: number
          name: string
          price: number
          storage: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          max_horses: number
          max_users: number
          name: string
          price: number
          storage: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          max_horses?: number
          max_users?: number
          name?: string
          price?: number
          storage?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          id: string
          integration_id: string | null
          log_time: string | null
          log_type: string
          message: string
        }
        Insert: {
          id?: string
          integration_id?: string | null
          log_time?: string | null
          log_type: string
          message: string
        }
        Update: {
          id?: string
          integration_id?: string | null
          log_time?: string | null
          log_type?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_alerts: {
        Row: {
          created_at: string | null
          description: string | null
          haras_id: string | null
          id: string
          module: string
          resolved_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          haras_id?: string | null
          id?: string
          module: string
          resolved_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          haras_id?: string | null
          id?: string
          module?: string
          resolved_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_alerts_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      task_executions: {
        Row: {
          attachments: Json
          created_at: string
          executed_at: string
          executed_by: string
          haras_id: string
          id: string
          metadata: Json
          notes: string | null
          outcome: string
          task_id: string
        }
        Insert: {
          attachments?: Json
          created_at?: string
          executed_at?: string
          executed_by: string
          haras_id: string
          id?: string
          metadata?: Json
          notes?: string | null
          outcome: string
          task_id: string
        }
        Update: {
          attachments?: Json
          created_at?: string
          executed_at?: string
          executed_by?: string
          haras_id?: string
          id?: string
          metadata?: Json
          notes?: string | null
          outcome?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_executions_executed_by_fkey"
            columns: ["executed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_executions_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_executions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          animal_id: string | null
          auto_generated: boolean
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          documents: Json | null
          due_date: string
          haras_id: string
          id: string
          last_execution_id: string | null
          observations: string | null
          photos: Json | null
          priority: string
          responsible_id: string | null
          source_id: string | null
          source_table: string | null
          started_at: string | null
          status: string
          task_number: number
          task_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          animal_id?: string | null
          auto_generated?: boolean
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          documents?: Json | null
          due_date: string
          haras_id: string
          id?: string
          last_execution_id?: string | null
          observations?: string | null
          photos?: Json | null
          priority?: string
          responsible_id?: string | null
          source_id?: string | null
          source_table?: string | null
          started_at?: string | null
          status?: string
          task_number?: number
          task_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string | null
          auto_generated?: boolean
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          documents?: Json | null
          due_date?: string
          haras_id?: string
          id?: string
          last_execution_id?: string | null
          observations?: string | null
          photos?: Json | null
          priority?: string
          responsible_id?: string | null
          source_id?: string | null
          source_table?: string | null
          started_at?: string | null
          status?: string
          task_number?: number
          task_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_last_execution_id_fkey"
            columns: ["last_execution_id"]
            isOneToOne: false
            referencedRelation: "task_executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          animal_id: string | null
          categoria: string
          created_at: string | null
          data_transacao: string
          descricao: string
          forma_pagamento: string | null
          haras_id: string
          id: string
          observacoes: string | null
          tipo: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          animal_id?: string | null
          categoria: string
          created_at?: string | null
          data_transacao: string
          descricao: string
          forma_pagamento?: string | null
          haras_id: string
          id?: string
          observacoes?: string | null
          tipo: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          animal_id?: string | null
          categoria?: string
          created_at?: string | null
          data_transacao?: string
          descricao?: string
          forma_pagamento?: string | null
          haras_id?: string
          id?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccines: {
        Row: {
          animal_id: string
          created_at: string | null
          data_aplicacao: string
          data_proxima_dose: string | null
          fabricante: string | null
          haras_id: string
          id: string
          lote: string | null
          nome_vacina: string
          observacoes: string | null
          updated_at: string | null
          veterinario: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          data_aplicacao: string
          data_proxima_dose?: string | null
          fabricante?: string | null
          haras_id: string
          id?: string
          lote?: string | null
          nome_vacina: string
          observacoes?: string | null
          updated_at?: string | null
          veterinario?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          data_aplicacao?: string
          data_proxima_dose?: string | null
          fabricante?: string | null
          haras_id?: string
          id?: string
          lote?: string | null
          nome_vacina?: string
          observacoes?: string | null
          updated_at?: string | null
          veterinario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccines_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccines_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
      vet_tasks: {
        Row: {
          animal_id: string | null
          auto_generated: boolean
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string
          haras_id: string
          id: string
          priority: string
          source_id: string | null
          source_table: string | null
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          animal_id?: string | null
          auto_generated?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date: string
          haras_id: string
          id?: string
          priority?: string
          source_id?: string | null
          source_table?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          animal_id?: string | null
          auto_generated?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string
          haras_id?: string
          id?: string
          priority?: string
          source_id?: string | null
          source_table?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_tasks_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          animal_id: string
          created_at: string | null
          descricao: string | null
          duracao: number | null
          haras_id: string
          id: string
          thumbnail_url: string | null
          titulo: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          descricao?: string | null
          duracao?: number | null
          haras_id: string
          id?: string
          thumbnail_url?: string | null
          titulo: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          descricao?: string | null
          duracao?: number | null
          haras_id?: string
          id?: string
          thumbnail_url?: string | null
          titulo?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_haras_id_fkey"
            columns: ["haras_id"]
            isOneToOne: false
            referencedRelation: "haras"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_collaborator: {
        Args: {
          p_created_by?: string
          p_email: string
          p_full_name: string
          p_haras_id: string
          p_password: string
          p_permissions?: Json
          p_phone?: string
          p_role: string
          p_role_id?: string
          p_status?: string
        }
        Returns: Json
      }
      default_haras_role_name: { Args: { p_role: string }; Returns: string }
      default_team_permissions: { Args: { p_role: string }; Returns: Json }
      ensure_default_haras_role: {
        Args: { p_created_by?: string; p_haras_id: string; p_role: string }
        Returns: string
      }
      generate_condominio_notifications: {
        Args: { p_haras_id: string }
        Returns: number
      }
      get_current_user_sessions: {
        Args: never
        Returns: {
          created_at: string
          id: string
          ip: unknown
          not_after: string
          refreshed_at: string
          updated_at: string
          user_agent: string
        }[]
      }
      get_dashboard_snapshot: {
        Args: {
          p_activities_limit?: number
          p_events_limit?: number
          p_haras_id: string
          p_months?: number
        }
        Returns: Json
      }
      get_reproduction_stats: {
        Args: { p_haras_id: string; p_year?: number }
        Returns: Json
      }
      is_admin_user: { Args: never; Returns: boolean }
      list_haras_assignable_members: {
        Args: { p_haras_id: string }
        Returns: {
          email: string
          full_name: string
          membership_status: string
          role: string
          user_id: string
        }[]
      }
      normalize_app_role: { Args: { p_role: string }; Returns: string }
      remove_haras_member: {
        Args: { p_haras_id: string; p_user_id: string }
        Returns: Json
      }
      revoke_current_user_session: {
        Args: { p_session_id: string }
        Returns: undefined
      }
      set_haras_member_status: {
        Args: { p_haras_id: string; p_status: string; p_user_id: string }
        Returns: Json
      }
      user_belongs_to_haras: { Args: { p_haras_id: string }; Returns: boolean }
      user_can_manage_haras_admin: {
        Args: { p_haras_id: string }
        Returns: boolean
      }
      user_can_manage_haras_data: {
        Args: { p_haras_id: string }
        Returns: boolean
      }
      user_can_manage_haras_roles: {
        Args: { p_haras_id: string }
        Returns: boolean
      }
      user_can_manage_haras_team: {
        Args: { p_haras_id: string }
        Returns: boolean
      }
      user_can_read_haras_profiles: {
        Args: { p_haras_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
