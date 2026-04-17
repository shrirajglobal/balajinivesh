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
      blog_categories: {
        Row: {
          audience: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          audience?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          audience?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_generation_jobs: {
        Row: {
          ai_model: string
          ai_provider: string
          audience: string
          category_id: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          generated_post_id: string | null
          id: string
          raw_output: Json | null
          scheduled_publish_at: string | null
          status: string
          topic: string
          updated_at: string
        }
        Insert: {
          ai_model?: string
          ai_provider?: string
          audience?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          raw_output?: Json | null
          scheduled_publish_at?: string | null
          status?: string
          topic: string
          updated_at?: string
        }
        Update: {
          ai_model?: string
          ai_provider?: string
          audience?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          generated_post_id?: string | null
          id?: string
          raw_output?: Json | null
          scheduled_publish_at?: string | null
          status?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_generation_jobs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_generation_jobs_generated_post_id_fkey"
            columns: ["generated_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          ai_generated: boolean
          audience: string
          author_name: string
          category_id: string | null
          content: string
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          excerpt: string
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          scheduled_for: string | null
          slug: string
          status: string
          subtitle: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          ai_generated?: boolean
          audience?: string
          author_name?: string
          category_id?: string | null
          content: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          slug: string
          status?: string
          subtitle?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          ai_generated?: boolean
          audience?: string
          author_name?: string
          category_id?: string | null
          content?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          id: string
          issued_at: string
          segment: Database["public"]["Enums"]["education_segment"]
          user_id: string
        }
        Insert: {
          certificate_number: string
          id?: string
          issued_at?: string
          segment: Database["public"]["Enums"]["education_segment"]
          user_id: string
        }
        Update: {
          certificate_number?: string
          id?: string
          issued_at?: string
          segment?: Database["public"]["Enums"]["education_segment"]
          user_id?: string
        }
        Relationships: []
      }
      education_progress: {
        Row: {
          completed_at: string
          id: string
          segment: Database["public"]["Enums"]["education_segment"]
          topic_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          segment: Database["public"]["Enums"]["education_segment"]
          topic_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          segment?: Database["public"]["Enums"]["education_segment"]
          topic_id?: string
          user_id?: string
        }
        Relationships: []
      }
      gift_claims: {
        Row: {
          address: string
          city: string
          created_at: string
          full_name: string
          id: string
          phone: string
          pincode: string
          segment: Database["public"]["Enums"]["education_segment"]
          status: Database["public"]["Enums"]["gift_claim_status"]
          user_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          full_name: string
          id?: string
          phone: string
          pincode: string
          segment: Database["public"]["Enums"]["education_segment"]
          status?: Database["public"]["Enums"]["gift_claim_status"]
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          pincode?: string
          segment?: Database["public"]["Enums"]["education_segment"]
          status?: Database["public"]["Enums"]["gift_claim_status"]
          user_id?: string
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          category: string
          config: Json
          created_at: string
          display_name: string
          enabled: boolean
          id: string
          is_default: boolean
          last_test_at: string | null
          last_test_message: string | null
          last_test_status: string | null
          provider_key: string
          secret_names: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          config?: Json
          created_at?: string
          display_name: string
          enabled?: boolean
          id?: string
          is_default?: boolean
          last_test_at?: string | null
          last_test_message?: string | null
          last_test_status?: string | null
          provider_key: string
          secret_names?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          config?: Json
          created_at?: string
          display_name?: string
          enabled?: boolean
          id?: string
          is_default?: boolean
          last_test_at?: string | null
          last_test_message?: string | null
          last_test_status?: string | null
          provider_key?: string
          secret_names?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          city: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          profession: string
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          profession: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          profession?: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      partner_aum_data: {
        Row: {
          amc_name: string
          aum_amount: number
          client_id: string | null
          created_at: string
          id: string
          month_year: string
          partner_id: string
          scheme_name: string
        }
        Insert: {
          amc_name: string
          aum_amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          month_year: string
          partner_id: string
          scheme_name: string
        }
        Update: {
          amc_name?: string
          aum_amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          month_year?: string
          partner_id?: string
          scheme_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_aum_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "partner_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_aum_data_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_clients: {
        Row: {
          client_name: string
          created_at: string
          folio_number: string | null
          id: string
          pan_number: string | null
          partner_id: string
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          folio_number?: string | null
          id?: string
          pan_number?: string | null
          partner_id: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          folio_number?: string | null
          id?: string
          pan_number?: string | null
          partner_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_clients_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_commissions: {
        Row: {
          amc_name: string
          commission_amount: number
          created_at: string
          id: string
          month_year: string
          partner_id: string
          status: string
        }
        Insert: {
          amc_name: string
          commission_amount?: number
          created_at?: string
          id?: string
          month_year: string
          partner_id: string
          status?: string
        }
        Update: {
          amc_name?: string
          commission_amount?: number
          created_at?: string
          id?: string
          month_year?: string
          partner_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          partner_id: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          partner_id: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          partner_id?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_leads_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          arn_number: string | null
          created_at: string
          euin: string | null
          id: string
          joined_date: string
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          arn_number?: string | null
          created_at?: string
          euin?: string | null
          id?: string
          joined_date?: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          arn_number?: string | null
          created_at?: string
          euin?: string | null
          id?: string
          joined_date?: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rta_uploads: {
        Row: {
          admin_id: string | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          records_processed: number | null
          status: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          records_processed?: number | null
          status?: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          records_processed?: number | null
          status?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "partner" | "user"
      education_segment: "homemakers" | "kids"
      gift_claim_status: "pending" | "shipped" | "delivered"
      partner_status:
        | "pending"
        | "approved"
        | "rejected"
        | "active"
        | "inactive"
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
      app_role: ["admin", "partner", "user"],
      education_segment: ["homemakers", "kids"],
      gift_claim_status: ["pending", "shipped", "delivered"],
      partner_status: ["pending", "approved", "rejected", "active", "inactive"],
    },
  },
} as const
