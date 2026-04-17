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
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          session_id: string
          source: string
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
          source?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
          source?: string
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          citations: Json
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          citations?: Json
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          citations?: Json
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          source: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          source?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          source?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      content_embeddings: {
        Row: {
          chunk_index: number
          content: string
          created_at: string
          embedding: string | null
          id: string
          metadata: Json
          source_id: string
          source_type: string
          title: string
          token_count: number | null
          updated_at: string
          url: string | null
        }
        Insert: {
          chunk_index?: number
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json
          source_id: string
          source_type: string
          title: string
          token_count?: number | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          chunk_index?: number
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json
          source_id?: string
          source_type?: string
          title?: string
          token_count?: number | null
          updated_at?: string
          url?: string | null
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
      forum_posts: {
        Row: {
          body: string
          created_at: string
          id: string
          status: string
          thread_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          status?: string
          thread_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          status?: string
          thread_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          last_activity_at: string
          reply_count: number
          slug: string
          status: string
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          last_activity_at?: string
          reply_count?: number
          slug: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          last_activity_at?: string
          reply_count?: number
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
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
      lead_inbox: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          notes: string | null
          payload: Json | null
          phone: string | null
          source: string
          source_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          payload?: Json | null
          phone?: string | null
          source: string
          source_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          notes?: string | null
          payload?: Json | null
          phone?: string | null
          source?: string
          source_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_certificates: {
        Row: {
          certificate_number: string
          id: string
          issued_at: string
          module_id: string
          module_title: string
          pdf_url: string | null
          score_pct: number | null
          user_id: string
        }
        Insert: {
          certificate_number: string
          id?: string
          issued_at?: string
          module_id: string
          module_title: string
          pdf_url?: string | null
          score_pct?: number | null
          user_id: string
        }
        Update: {
          certificate_number?: string
          id?: string
          issued_at?: string
          module_id?: string
          module_title?: string
          pdf_url?: string | null
          score_pct?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_certificates_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_chapters: {
        Row: {
          bengali_glossary: Json | null
          content_markdown: string
          created_at: string
          display_order: number
          estimated_minutes: number
          exam_traps: string | null
          id: string
          is_published: boolean
          module_id: string
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bengali_glossary?: Json | null
          content_markdown?: string
          created_at?: string
          display_order?: number
          estimated_minutes?: number
          exam_traps?: string | null
          id?: string
          is_published?: boolean
          module_id: string
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bengali_glossary?: Json | null
          content_markdown?: string
          created_at?: string
          display_order?: number
          estimated_minutes?: number
          exam_traps?: string | null
          id?: string
          is_published?: boolean
          module_id?: string
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_chapters_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          audience: string
          certificate_label: string | null
          cover_emoji: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_published: boolean
          issues_certificate: boolean
          pass_percentage: number
          slug: string
          subtitle: string | null
          title: string
          total_chapters: number
          updated_at: string
        }
        Insert: {
          audience?: string
          certificate_label?: string | null
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_published?: boolean
          issues_certificate?: boolean
          pass_percentage?: number
          slug: string
          subtitle?: string | null
          title: string
          total_chapters?: number
          updated_at?: string
        }
        Update: {
          audience?: string
          certificate_label?: string | null
          cover_emoji?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_published?: boolean
          issues_certificate?: boolean
          pass_percentage?: number
          slug?: string
          subtitle?: string | null
          title?: string
          total_chapters?: number
          updated_at?: string
        }
        Relationships: []
      }
      market_updates: {
        Row: {
          ai_generated: boolean
          ai_model: string | null
          ai_provider: string | null
          approved_at: string | null
          approved_by: string | null
          bank_nifty_change_pct: number | null
          bank_nifty_close: number | null
          created_at: string
          created_by: string | null
          crude_change_pct: number | null
          crude_price: number | null
          data_source: string | null
          gold_change_pct: number | null
          gold_price: number | null
          headline: string
          id: string
          key_movers: Json | null
          market_sentiment: string | null
          meta_description: string | null
          meta_title: string | null
          nifty_change: number | null
          nifty_change_pct: number | null
          nifty_close: number | null
          published_at: string | null
          raw_ai_output: Json | null
          scheduled_for: string | null
          sensex_change: number | null
          sensex_change_pct: number | null
          sensex_close: number | null
          silver_change_pct: number | null
          silver_price: number | null
          status: string
          summary: string
          update_date: string
          updated_at: string
          usd_inr: number | null
          usd_inr_change_pct: number | null
          view_count: number
          what_it_means: string | null
        }
        Insert: {
          ai_generated?: boolean
          ai_model?: string | null
          ai_provider?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_nifty_change_pct?: number | null
          bank_nifty_close?: number | null
          created_at?: string
          created_by?: string | null
          crude_change_pct?: number | null
          crude_price?: number | null
          data_source?: string | null
          gold_change_pct?: number | null
          gold_price?: number | null
          headline: string
          id?: string
          key_movers?: Json | null
          market_sentiment?: string | null
          meta_description?: string | null
          meta_title?: string | null
          nifty_change?: number | null
          nifty_change_pct?: number | null
          nifty_close?: number | null
          published_at?: string | null
          raw_ai_output?: Json | null
          scheduled_for?: string | null
          sensex_change?: number | null
          sensex_change_pct?: number | null
          sensex_close?: number | null
          silver_change_pct?: number | null
          silver_price?: number | null
          status?: string
          summary: string
          update_date: string
          updated_at?: string
          usd_inr?: number | null
          usd_inr_change_pct?: number | null
          view_count?: number
          what_it_means?: string | null
        }
        Update: {
          ai_generated?: boolean
          ai_model?: string | null
          ai_provider?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bank_nifty_change_pct?: number | null
          bank_nifty_close?: number | null
          created_at?: string
          created_by?: string | null
          crude_change_pct?: number | null
          crude_price?: number | null
          data_source?: string | null
          gold_change_pct?: number | null
          gold_price?: number | null
          headline?: string
          id?: string
          key_movers?: Json | null
          market_sentiment?: string | null
          meta_description?: string | null
          meta_title?: string | null
          nifty_change?: number | null
          nifty_change_pct?: number | null
          nifty_close?: number | null
          published_at?: string | null
          raw_ai_output?: Json | null
          scheduled_for?: string | null
          sensex_change?: number | null
          sensex_change_pct?: number | null
          sensex_close?: number | null
          silver_change_pct?: number | null
          silver_price?: number | null
          status?: string
          summary?: string
          update_date?: string
          updated_at?: string
          usd_inr?: number | null
          usd_inr_change_pct?: number | null
          view_count?: number
          what_it_means?: string | null
        }
        Relationships: []
      }
      newsletter_campaigns: {
        Row: {
          clicked_count: number
          created_at: string
          created_by: string | null
          html_body: string
          id: string
          opened_count: number
          preheader: string | null
          recipient_count: number
          scheduled_for: string | null
          sent_at: string | null
          source_id: string | null
          source_type: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          clicked_count?: number
          created_at?: string
          created_by?: string | null
          html_body: string
          id?: string
          opened_count?: number
          preheader?: string | null
          recipient_count?: number
          scheduled_for?: string | null
          sent_at?: string | null
          source_id?: string | null
          source_type?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          clicked_count?: number
          created_at?: string
          created_by?: string | null
          html_body?: string
          id?: string
          opened_count?: number
          preheader?: string | null
          recipient_count?: number
          scheduled_for?: string | null
          sent_at?: string | null
          source_id?: string | null
          source_type?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_sends: {
        Row: {
          campaign_id: string
          created_at: string
          email: string
          error_message: string | null
          first_clicked_at: string | null
          id: string
          open_token: string
          opened_at: string | null
          status: string
          subscriber_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          email: string
          error_message?: string | null
          first_clicked_at?: string | null
          id?: string
          open_token?: string
          opened_at?: string | null
          status?: string
          subscriber_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          email?: string
          error_message?: string | null
          first_clicked_at?: string | null
          id?: string
          open_token?: string
          opened_at?: string | null
          status?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "newsletter_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sends_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "subscribers"
            referencedColumns: ["id"]
          },
        ]
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
      partner_chapter_progress: {
        Row: {
          chapter_id: string
          completed_at: string
          id: string
          module_id: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          completed_at?: string
          id?: string
          module_id: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          completed_at?: string
          id?: string
          module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_chapter_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "learning_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_chapter_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
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
      partner_module_progress: {
        Row: {
          best_quiz_score_pct: number | null
          chapters_completed: number
          completed_at: string | null
          created_at: string
          id: string
          last_activity_at: string
          module_id: string
          quiz_score_pct: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          best_quiz_score_pct?: number | null
          chapters_completed?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          last_activity_at?: string
          module_id: string
          quiz_score_pct?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          best_quiz_score_pct?: number | null
          chapters_completed?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          last_activity_at?: string
          module_id?: string
          quiz_score_pct?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_module_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_service_areas: {
        Row: {
          city: string | null
          created_at: string
          id: string
          is_primary: boolean
          partner_id: string
          pincode: string
          state: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          partner_id: string
          pincode: string
          state?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          partner_id?: string
          pincode?: string
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_service_areas_partner_id_fkey"
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
      quiz_attempts: {
        Row: {
          chapter_id: string | null
          created_at: string
          ease_factor: number
          id: string
          interval_days: number
          is_correct: boolean
          module_id: string
          next_review_at: string | null
          question_id: string
          response_seconds: number | null
          selected_index: number
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          is_correct: boolean
          module_id: string
          next_review_at?: string | null
          question_id: string
          response_seconds?: number | null
          selected_index: number
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          is_correct?: boolean
          module_id?: string
          next_review_at?: string | null
          question_id?: string
          response_seconds?: number | null
          selected_index?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "learning_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          chapter_id: string | null
          correct_index: number
          created_at: string
          difficulty: string
          explanation: string | null
          id: string
          is_active: boolean
          module_id: string
          options: Json
          question: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          chapter_id?: string | null
          correct_index: number
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          module_id: string
          options: Json
          question: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          chapter_id?: string | null
          correct_index?: number
          created_at?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          is_active?: boolean
          module_id?: string
          options?: Json
          question?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "learning_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
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
      subscribers: {
        Row: {
          confirmation_token: string
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          language: string
          name: string | null
          source: string
          status: string
          unsubscribe_token: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmation_token?: string
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          language?: string
          name?: string | null
          source?: string
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmation_token?: string
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          language?: string
          name?: string | null
          source?: string
          status?: string
          unsubscribe_token?: string
          unsubscribed_at?: string | null
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
      video_resources: {
        Row: {
          audience: string
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number
          duration_seconds: number | null
          id: string
          is_published: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
          youtube_id: string
        }
        Insert: {
          audience?: string
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          duration_seconds?: number | null
          id?: string
          is_published?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
          youtube_id: string
        }
        Update: {
          audience?: string
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          duration_seconds?: number | null
          id?: string
          is_published?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_partners_by_location: {
        Args: { _city?: string; _limit?: number; _pincode?: string }
        Returns: {
          arn_number: string
          city: string
          full_name: string
          match_type: string
          partner_id: string
          pincode: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      match_content_embeddings: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          similarity: number
          source_id: string
          source_type: string
          title: string
          url: string
        }[]
      }
      trigger_embed_content: {
        Args: { _source_id: string; _source_type: string }
        Returns: undefined
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
