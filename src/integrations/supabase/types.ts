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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_questions: {
        Row: {
          awarded_marks: number | null
          created_at: string
          difficulty: string
          feedback: string | null
          id: string
          mark_scheme: string | null
          marks: number
          question_text: string
          question_type: string
          student_answer: string | null
          subject: Database["public"]["Enums"]["subject_code"]
          topic: string
          unit_number: number | null
          user_id: string
        }
        Insert: {
          awarded_marks?: number | null
          created_at?: string
          difficulty: string
          feedback?: string | null
          id?: string
          mark_scheme?: string | null
          marks?: number
          question_text: string
          question_type: string
          student_answer?: string | null
          subject: Database["public"]["Enums"]["subject_code"]
          topic: string
          unit_number?: number | null
          user_id: string
        }
        Update: {
          awarded_marks?: number | null
          created_at?: string
          difficulty?: string
          feedback?: string | null
          id?: string
          mark_scheme?: string | null
          marks?: number
          question_text?: string
          question_type?: string
          student_answer?: string | null
          subject?: Database["public"]["Enums"]["subject_code"]
          topic?: string
          unit_number?: number | null
          user_id?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          created_at: string
          exam_date: string
          exam_type: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          subject: string | null
          topics: string[]
          unit_numbers: number[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          exam_date: string
          exam_type?: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          subject?: string | null
          topics?: string[]
          unit_numbers?: number[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          exam_date?: string
          exam_type?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          subject?: string | null
          topics?: string[]
          unit_numbers?: number[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mock_paper_questions: {
        Row: {
          awarded_marks: number | null
          command_word: string | null
          created_at: string
          feedback: string | null
          flagged: boolean
          id: string
          mark_scheme: string | null
          marks: number
          mock_paper_id: string
          model_answer: string | null
          options: Json | null
          question_index: number
          question_text: string
          question_type: string
          student_answer: string | null
          topic: string
          user_id: string
        }
        Insert: {
          awarded_marks?: number | null
          command_word?: string | null
          created_at?: string
          feedback?: string | null
          flagged?: boolean
          id?: string
          mark_scheme?: string | null
          marks: number
          mock_paper_id: string
          model_answer?: string | null
          options?: Json | null
          question_index: number
          question_text: string
          question_type: string
          student_answer?: string | null
          topic: string
          user_id: string
        }
        Update: {
          awarded_marks?: number | null
          command_word?: string | null
          created_at?: string
          feedback?: string | null
          flagged?: boolean
          id?: string
          mark_scheme?: string | null
          marks?: number
          mock_paper_id?: string
          model_answer?: string | null
          options?: Json | null
          question_index?: number
          question_text?: string
          question_type?: string
          student_answer?: string | null
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_paper_questions_mock_paper_id_fkey"
            columns: ["mock_paper_id"]
            isOneToOne: false
            referencedRelation: "mock_papers"
            referencedColumns: ["id"]
          },
        ]
      }
      mock_papers: {
        Row: {
          awarded_marks: number | null
          created_at: string
          difficulty_mix: string
          estimated_grade: string | null
          id: string
          question_types: string[]
          started_at: string
          status: string
          subject: Database["public"]["Enums"]["subject_code"]
          submitted_at: string | null
          time_limit_minutes: number
          topics: string[]
          total_marks: number
          units: number[]
          user_id: string
        }
        Insert: {
          awarded_marks?: number | null
          created_at?: string
          difficulty_mix?: string
          estimated_grade?: string | null
          id?: string
          question_types?: string[]
          started_at?: string
          status?: string
          subject: Database["public"]["Enums"]["subject_code"]
          submitted_at?: string | null
          time_limit_minutes: number
          topics?: string[]
          total_marks: number
          units: number[]
          user_id: string
        }
        Update: {
          awarded_marks?: number | null
          created_at?: string
          difficulty_mix?: string
          estimated_grade?: string | null
          id?: string
          question_types?: string[]
          started_at?: string
          status?: string
          subject?: Database["public"]["Enums"]["subject_code"]
          submitted_at?: string | null
          time_limit_minutes?: number
          topics?: string[]
          total_marks?: number
          units?: number[]
          user_id?: string
        }
        Relationships: []
      }
      note_annotations: {
        Row: {
          created_at: string
          highlighted_text: string
          id: string
          note: string
          topic_notes_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          highlighted_text: string
          id?: string
          note?: string
          topic_notes_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          highlighted_text?: string
          id?: string
          note?: string
          topic_notes_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_annotations_topic_notes_id_fkey"
            columns: ["topic_notes_id"]
            isOneToOne: false
            referencedRelation: "topic_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          current_streak: number
          daily_reminder_enabled: boolean
          daily_reminder_time: string
          diagnostic_completed: boolean
          display_name: string | null
          exam_board: string
          first_name: string | null
          hours_per_day: number
          id: string
          last_name: string | null
          last_session_date: string | null
          notes_week_count: number
          notes_week_reset_at: string
          notification_enabled: boolean
          notification_prompted: boolean
          notification_time: string
          onboarded: boolean
          plan: Database["public"]["Enums"]["plan_tier"]
          pomodoro_break_minutes: number
          pomodoro_work_minutes: number
          questions_today_count: number
          questions_today_reset_at: string
          rest_days: number[]
          study_start_time: string
          theme: string
          tutor_message_count: number
          tutorial_completed: boolean
          xp: number
        }
        Insert: {
          created_at?: string
          current_streak?: number
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          diagnostic_completed?: boolean
          display_name?: string | null
          exam_board?: string
          first_name?: string | null
          hours_per_day?: number
          id: string
          last_name?: string | null
          last_session_date?: string | null
          notes_week_count?: number
          notes_week_reset_at?: string
          notification_enabled?: boolean
          notification_prompted?: boolean
          notification_time?: string
          onboarded?: boolean
          plan?: Database["public"]["Enums"]["plan_tier"]
          pomodoro_break_minutes?: number
          pomodoro_work_minutes?: number
          questions_today_count?: number
          questions_today_reset_at?: string
          rest_days?: number[]
          study_start_time?: string
          theme?: string
          tutor_message_count?: number
          tutorial_completed?: boolean
          xp?: number
        }
        Update: {
          created_at?: string
          current_streak?: number
          daily_reminder_enabled?: boolean
          daily_reminder_time?: string
          diagnostic_completed?: boolean
          display_name?: string | null
          exam_board?: string
          first_name?: string | null
          hours_per_day?: number
          id?: string
          last_name?: string | null
          last_session_date?: string | null
          notes_week_count?: number
          notes_week_reset_at?: string
          notification_enabled?: boolean
          notification_prompted?: boolean
          notification_time?: string
          onboarded?: boolean
          plan?: Database["public"]["Enums"]["plan_tier"]
          pomodoro_break_minutes?: number
          pomodoro_work_minutes?: number
          questions_today_count?: number
          questions_today_reset_at?: string
          rest_days?: number[]
          study_start_time?: string
          theme?: string
          tutor_message_count?: number
          tutorial_completed?: boolean
          xp?: number
        }
        Relationships: []
      }
      roadmap_nodes: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          node_order: number
          node_type: string
          scheduled_date: string
          science_method: string | null
          score_percent: number | null
          source_node_id: string | null
          status: string
          subject: string | null
          topic_name: string | null
          unit_code: string | null
          unit_name: string | null
          unit_number: number | null
          unlocks_after_node_id: string | null
          user_id: string
          why_now_text: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          node_order: number
          node_type: string
          scheduled_date: string
          science_method?: string | null
          score_percent?: number | null
          source_node_id?: string | null
          status?: string
          subject?: string | null
          topic_name?: string | null
          unit_code?: string | null
          unit_name?: string | null
          unit_number?: number | null
          unlocks_after_node_id?: string | null
          user_id: string
          why_now_text?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          node_order?: number
          node_type?: string
          scheduled_date?: string
          science_method?: string | null
          score_percent?: number | null
          source_node_id?: string | null
          status?: string
          subject?: string | null
          topic_name?: string | null
          unit_code?: string | null
          unit_name?: string | null
          unit_number?: number | null
          unlocks_after_node_id?: string | null
          user_id?: string
          why_now_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_nodes_unlocks_after_node_id_fkey"
            columns: ["unlocks_after_node_id"]
            isOneToOne: false
            referencedRelation: "roadmap_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: string
          method: string
          order_index: number
          session_date: string
          start_time: string | null
          status: string
          subject: string | null
          topic_name: string | null
          unit_number: number | null
          user_id: string
          why_now_text: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          method?: string
          order_index?: number
          session_date: string
          start_time?: string | null
          status?: string
          subject?: string | null
          topic_name?: string | null
          unit_number?: number | null
          user_id: string
          why_now_text?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          method?: string
          order_index?: number
          session_date?: string
          start_time?: string | null
          status?: string
          subject?: string | null
          topic_name?: string | null
          unit_number?: number | null
          user_id?: string
          why_now_text?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed_at: string
          duration_minutes: number
          id: string
          subject: Database["public"]["Enums"]["subject_code"] | null
          topic: string | null
          unit_number: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          duration_minutes?: number
          id?: string
          subject?: Database["public"]["Enums"]["subject_code"] | null
          topic?: string | null
          unit_number?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          duration_minutes?: number
          id?: string
          subject?: Database["public"]["Enums"]["subject_code"] | null
          topic?: string | null
          unit_number?: number | null
          user_id?: string
        }
        Relationships: []
      }
      topic_notes: {
        Row: {
          content: Json
          created_at: string
          id: string
          subject: string
          topic: string
          unit_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          subject: string
          topic: string
          unit_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          subject?: string
          topic?: string
          unit_number?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topic_progress: {
        Row: {
          created_at: string
          id: string
          last_score_percent: number | null
          questions_attempted: number
          questions_correct: number
          subject: string
          topic_name: string
          unit_number: number | null
          updated_at: string
          user_id: string
          weak_flag: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          last_score_percent?: number | null
          questions_attempted?: number
          questions_correct?: number
          subject: string
          topic_name: string
          unit_number?: number | null
          updated_at?: string
          user_id: string
          weak_flag?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          last_score_percent?: number | null
          questions_attempted?: number
          questions_correct?: number
          subject?: string
          topic_name?: string
          unit_number?: number | null
          updated_at?: string
          user_id?: string
          weak_flag?: boolean
        }
        Relationships: []
      }
      user_subjects: {
        Row: {
          created_at: string
          current_grade: Database["public"]["Enums"]["grade_level"]
          exam_date: string
          id: string
          paper_duration_minutes: number
          subject: Database["public"]["Enums"]["subject_code"]
          target_grade: Database["public"]["Enums"]["grade_level"]
          unit_name: string
          unit_number: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_grade: Database["public"]["Enums"]["grade_level"]
          exam_date: string
          id?: string
          paper_duration_minutes: number
          subject: Database["public"]["Enums"]["subject_code"]
          target_grade: Database["public"]["Enums"]["grade_level"]
          unit_name: string
          unit_number: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_grade?: Database["public"]["Enums"]["grade_level"]
          exam_date?: string
          id?: string
          paper_duration_minutes?: number
          subject?: Database["public"]["Enums"]["subject_code"]
          target_grade?: Database["public"]["Enums"]["grade_level"]
          unit_name?: string
          unit_number?: number
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
      grade_level: "A*" | "A" | "B" | "C" | "D" | "E" | "U"
      plan_tier: "free" | "pro" | "advanced"
      subject_code: "mathematics" | "biology" | "chemistry" | "physics"
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
      grade_level: ["A*", "A", "B", "C", "D", "E", "U"],
      plan_tier: ["free", "pro", "advanced"],
      subject_code: ["mathematics", "biology", "chemistry", "physics"],
    },
  },
} as const
