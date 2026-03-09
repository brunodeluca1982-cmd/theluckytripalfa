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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      evento_item_sponsored: {
        Row: {
          ativo: boolean
          badge_texto: string
          destaque: boolean
          evento_id: string
          evento_item_id: string
          id: string
          sponsor_id: string
        }
        Insert: {
          ativo?: boolean
          badge_texto?: string
          destaque?: boolean
          evento_id: string
          evento_item_id: string
          id?: string
          sponsor_id: string
        }
        Update: {
          ativo?: boolean
          badge_texto?: string
          destaque?: boolean
          evento_id?: string
          evento_item_id?: string
          id?: string
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_item_sponsored_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_item_sponsored_evento_item_id_fkey"
            columns: ["evento_item_id"]
            isOneToOne: false
            referencedRelation: "evento_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_item_sponsored_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "evento_sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      evento_itens: {
        Row: {
          ativo: boolean
          bairro: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          evento_id: string
          google_maps_url: string | null
          id: string
          instagram: string | null
          local_nome: string | null
          ordem: number
          slug: string
          tags: string[] | null
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          bairro?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          evento_id: string
          google_maps_url?: string | null
          id?: string
          instagram?: string | null
          local_nome?: string | null
          ordem?: number
          slug: string
          tags?: string[] | null
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          bairro?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          evento_id?: string
          google_maps_url?: string | null
          id?: string
          instagram?: string | null
          local_nome?: string | null
          ordem?: number
          slug?: string
          tags?: string[] | null
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_itens_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      evento_sponsor_placements: {
        Row: {
          ativo: boolean
          created_at: string
          cta_label: string | null
          cta_link: string | null
          evento_id: string
          id: string
          media_url: string | null
          ordem: number
          placement: string
          sponsor_id: string
          subtitulo: string | null
          titulo: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          evento_id: string
          id?: string
          media_url?: string | null
          ordem?: number
          placement: string
          sponsor_id: string
          subtitulo?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          evento_id?: string
          id?: string
          media_url?: string | null
          ordem?: number
          placement?: string
          sponsor_id?: string
          subtitulo?: string | null
          titulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_sponsor_placements_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evento_sponsor_placements_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "evento_sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      evento_sponsors: {
        Row: {
          ativo: boolean
          badge_texto: string
          created_at: string
          evento_id: string
          id: string
          link_url: string | null
          logo_url: string | null
          prioridade: number
          sponsor_nome: string
          sponsor_slug: string
          tracking_tag: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          badge_texto?: string
          created_at?: string
          evento_id: string
          id?: string
          link_url?: string | null
          logo_url?: string | null
          prioridade?: number
          sponsor_nome: string
          sponsor_slug: string
          tracking_tag?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          badge_texto?: string
          created_at?: string
          evento_id?: string
          id?: string
          link_url?: string | null
          logo_url?: string | null
          prioridade?: number
          sponsor_nome?: string
          sponsor_slug?: string
          tracking_tag?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evento_sponsors_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          ativo: boolean
          botao_label: string | null
          botao_link: string | null
          cor_hex: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          descricao_curta: string | null
          descricao_longa: string | null
          destino: string
          hero_media_url: string | null
          id: string
          prioridade: number
          slug: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          botao_label?: string | null
          botao_link?: string | null
          cor_hex?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao_curta?: string | null
          descricao_longa?: string | null
          destino?: string
          hero_media_url?: string | null
          id?: string
          prioridade?: number
          slug: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          botao_label?: string | null
          botao_link?: string | null
          cor_hex?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          descricao_curta?: string | null
          descricao_longa?: string | null
          destino?: string
          hero_media_url?: string | null
          id?: string
          prioridade?: number
          slug?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      experience_media: {
        Row: {
          created_at: string
          experience_slug: string
          id: string
          is_active: boolean
          media_type: string
          media_url: string
          sort_order: number
          title: string | null
        }
        Insert: {
          created_at?: string
          experience_slug: string
          id?: string
          is_active?: boolean
          media_type?: string
          media_url: string
          sort_order?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          experience_slug?: string
          id?: string
          is_active?: boolean
          media_type?: string
          media_url?: string
          sort_order?: number
          title?: string | null
        }
        Relationships: []
      }
      experiencia_media: {
        Row: {
          created_at: string
          experiencia_id: string
          id: string
          ordem: number
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          experiencia_id: string
          id?: string
          ordem?: number
          type: string
          url: string
        }
        Update: {
          created_at?: string
          experiencia_id?: string
          id?: string
          ordem?: number
          type?: string
          url?: string
        }
        Relationships: []
      }
      home_hero_items: {
        Row: {
          button_label: string
          created_at: string
          destination_slug: string | null
          id: string
          instagram_media_id: string | null
          is_active: boolean
          permalink: string | null
          show_on_home: boolean
          sort_order: number
          subtitle: string | null
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          button_label?: string
          created_at?: string
          destination_slug?: string | null
          id?: string
          instagram_media_id?: string | null
          is_active?: boolean
          permalink?: string | null
          show_on_home?: boolean
          sort_order?: number
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          button_label?: string
          created_at?: string
          destination_slug?: string | null
          id?: string
          instagram_media_id?: string | null
          is_active?: boolean
          permalink?: string | null
          show_on_home?: boolean
          sort_order?: number
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      place_photos: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          photo_last_fetched_at: string | null
          photo_source: string
          photo_url: string | null
          place_id: string | null
          place_query: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          photo_last_fetched_at?: string | null
          photo_source?: string
          photo_url?: string | null
          place_id?: string | null
          place_query: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          photo_last_fetched_at?: string | null
          photo_source?: string
          photo_url?: string | null
          place_id?: string | null
          place_query?: string
          updated_at?: string
        }
        Relationships: []
      }
      places_cache: {
        Row: {
          address: string | null
          created_at: string
          google_maps_url: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          phone: string | null
          photo_refs: string[] | null
          place_id: string
          price_level: number | null
          rating: number | null
          types: string[] | null
          updated_at: string
          user_ratings_total: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          google_maps_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          phone?: string | null
          photo_refs?: string[] | null
          place_id: string
          price_level?: number | null
          rating?: number | null
          types?: string[] | null
          updated_at?: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          google_maps_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          phone?: string | null
          photo_refs?: string[] | null
          place_id?: string
          price_level?: number | null
          rating?: number | null
          types?: string[] | null
          updated_at?: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Relationships: []
      }
      roteiro_itens: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          day_index: number
          id: string
          lat: number | null
          lng: number | null
          name: string
          neighborhood: string | null
          notes: string | null
          order_in_day: number
          place_id: string | null
          ref_table: string | null
          roteiro_id: string
          source: string
          time_slot: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          day_index?: number
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          neighborhood?: string | null
          notes?: string | null
          order_in_day?: number
          place_id?: string | null
          ref_table?: string | null
          roteiro_id: string
          source?: string
          time_slot?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          day_index?: number
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          neighborhood?: string | null
          notes?: string | null
          order_in_day?: number
          place_id?: string | null
          ref_table?: string | null
          roteiro_id?: string
          source?: string
          time_slot?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
