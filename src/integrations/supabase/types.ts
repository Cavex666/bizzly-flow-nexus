export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          bank_details: string | null
          client_city: string | null
          company_name: string | null
          contact_person: string
          contact_person_authorities: string | null
          contact_person_authorities_prepositional: string | null
          contact_person_name: string | null
          contact_person_name_genitive: string | null
          contact_person_position: string | null
          contact_person_position_genitive: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          bank_details?: string | null
          client_city?: string | null
          company_name?: string | null
          contact_person: string
          contact_person_authorities?: string | null
          contact_person_authorities_prepositional?: string | null
          contact_person_name?: string | null
          contact_person_name_genitive?: string | null
          contact_person_position?: string | null
          contact_person_position_genitive?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          bank_details?: string | null
          client_city?: string | null
          company_name?: string | null
          contact_person?: string
          contact_person_authorities?: string | null
          contact_person_authorities_prepositional?: string | null
          contact_person_name?: string | null
          contact_person_name_genitive?: string | null
          contact_person_position?: string | null
          contact_person_position_genitive?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          bank_details: string | null
          company_name: string | null
          contact_person: string | null
          contact_person_authorities: string | null
          contact_person_name: string | null
          contact_person_name_genitive: string | null
          contact_person_position: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bank_details?: string | null
          company_name?: string | null
          contact_person?: string | null
          contact_person_authorities?: string | null
          contact_person_name?: string | null
          contact_person_name_genitive?: string | null
          contact_person_position?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bank_details?: string | null
          company_name?: string | null
          contact_person?: string | null
          contact_person_authorities?: string | null
          contact_person_name?: string | null
          contact_person_name_genitive?: string | null
          contact_person_position?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      document_history: {
        Row: {
          action: string
          created_at: string
          description: string | null
          document_id: string
          id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          document_id: string
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          document_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_history_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "project_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          created_at: string
          document_type: string
          file_url: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          currency: string | null
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_documents: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string
          file_url: string | null
          generation_date: string | null
          id: string
          is_generated: boolean | null
          notes: string | null
          project_id: string
          template_data: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type: string
          file_url?: string | null
          generation_date?: string | null
          id?: string
          is_generated?: boolean | null
          notes?: string | null
          project_id: string
          template_data?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string
          file_url?: string | null
          generation_date?: string | null
          id?: string
          is_generated?: boolean | null
          notes?: string | null
          project_id?: string
          template_data?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          due_date: string | null
          id: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_type: string
          project_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_type: string
          project_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_type?: string
          project_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_authority_basis: string | null
          client_city: string | null
          client_contact_person: string | null
          client_contact_person_genitive: string | null
          client_contact_position: string | null
          client_contact_position_genitive: string | null
          client_country: string | null
          client_id: string | null
          client_name: string | null
          contract_number: string | null
          contractor_authority_basis: string | null
          contractor_contact_person: string | null
          contractor_contact_person_genitive: string | null
          contractor_contact_position: string | null
          contractor_contact_position_genitive: string | null
          created_at: string
          currency: string | null
          description: string | null
          end_date: string | null
          full_project_name: string | null
          id: string
          name: string
          payment_model: string | null
          prepayment_amount: number | null
          prepayment_percentage: number | null
          progress: number | null
          short_project_name: string | null
          start_date: string | null
          status: string
          unit_count: number | null
          unit_price: number | null
          updated_at: string
          user_id: string
          vat_amount: number | null
          vat_enabled: boolean
          vat_rate: number | null
          work_days_type: string | null
          work_duration_days: number | null
          work_start_date: string | null
        }
        Insert: {
          budget?: number | null
          client_authority_basis?: string | null
          client_city?: string | null
          client_contact_person?: string | null
          client_contact_person_genitive?: string | null
          client_contact_position?: string | null
          client_contact_position_genitive?: string | null
          client_country?: string | null
          client_id?: string | null
          client_name?: string | null
          contract_number?: string | null
          contractor_authority_basis?: string | null
          contractor_contact_person?: string | null
          contractor_contact_person_genitive?: string | null
          contractor_contact_position?: string | null
          contractor_contact_position_genitive?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          full_project_name?: string | null
          id?: string
          name: string
          payment_model?: string | null
          prepayment_amount?: number | null
          prepayment_percentage?: number | null
          progress?: number | null
          short_project_name?: string | null
          start_date?: string | null
          status?: string
          unit_count?: number | null
          unit_price?: number | null
          updated_at?: string
          user_id: string
          vat_amount?: number | null
          vat_enabled?: boolean
          vat_rate?: number | null
          work_days_type?: string | null
          work_duration_days?: number | null
          work_start_date?: string | null
        }
        Update: {
          budget?: number | null
          client_authority_basis?: string | null
          client_city?: string | null
          client_contact_person?: string | null
          client_contact_person_genitive?: string | null
          client_contact_position?: string | null
          client_contact_position_genitive?: string | null
          client_country?: string | null
          client_id?: string | null
          client_name?: string | null
          contract_number?: string | null
          contractor_authority_basis?: string | null
          contractor_contact_person?: string | null
          contractor_contact_person_genitive?: string | null
          contractor_contact_position?: string | null
          contractor_contact_position_genitive?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          full_project_name?: string | null
          id?: string
          name?: string
          payment_model?: string | null
          prepayment_amount?: number | null
          prepayment_percentage?: number | null
          progress?: number | null
          short_project_name?: string | null
          start_date?: string | null
          status?: string
          unit_count?: number | null
          unit_price?: number | null
          updated_at?: string
          user_id?: string
          vat_amount?: number | null
          vat_enabled?: boolean
          vat_rate?: number | null
          work_days_type?: string | null
          work_duration_days?: number | null
          work_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
