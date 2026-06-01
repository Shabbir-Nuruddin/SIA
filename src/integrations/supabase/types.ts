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
      active_device_sessions: {
        Row: {
          created_at: string
          device_id: string
          device_type: string
          id: string
          last_seen: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_type: string
          id?: string
          last_seen?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_type?: string
          id?: string
          last_seen?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_ai_modifiers: {
        Row: {
          board: string
          created_at: string
          feature: string
          id: string
          instruction: string
          is_active: boolean
        }
        Insert: {
          board?: string
          created_at?: string
          feature: string
          id?: string
          instruction: string
          is_active?: boolean
        }
        Update: {
          board?: string
          created_at?: string
          feature?: string
          id?: string
          instruction?: string
          is_active?: boolean
        }
        Relationships: []
      }
      ai_key_state: {
        Row: {
          current_index: number
          last_error: string | null
          last_rotated_at: string | null
          provider: string
          total_keys: number
          updated_at: string
        }
        Insert: {
          current_index?: number
          last_error?: string | null
          last_rotated_at?: string | null
          provider: string
          total_keys?: number
          updated_at?: string
        }
        Update: {
          current_index?: number
          last_error?: string | null
          last_rotated_at?: string | null
          provider?: string
          total_keys?: number
          updated_at?: string
        }
        Relationships: []
      }
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
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: number
          path: string | null
          properties: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: number
          path?: string | null
          properties?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: number
          path?: string | null
          properties?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      cached_faq_questions: {
        Row: {
          board: string
          created_at: string
          id: string
          questions: Json
          subject: string
          topic: string
          updated_at: string
        }
        Insert: {
          board: string
          created_at?: string
          id?: string
          questions: Json
          subject: string
          topic: string
          updated_at?: string
        }
        Update: {
          board?: string
          created_at?: string
          id?: string
          questions?: Json
          subject?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      cached_topic_images: {
        Row: {
          board: string
          created_at: string
          id: string
          images: Json
          subject: string
          topic: string
          unit_number: number
          updated_at: string
        }
        Insert: {
          board: string
          created_at?: string
          id?: string
          images: Json
          subject: string
          topic: string
          unit_number: number
          updated_at?: string
        }
        Update: {
          board?: string
          created_at?: string
          id?: string
          images?: Json
          subject?: string
          topic?: string
          unit_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      cached_topic_notes: {
        Row: {
          board: string
          content: Json
          created_at: string
          id: string
          subject: string
          topic: string
          unit_number: number
          updated_at: string
        }
        Insert: {
          board?: string
          content: Json
          created_at?: string
          id?: string
          subject: string
          topic: string
          unit_number: number
          updated_at?: string
        }
        Update: {
          board?: string
          content?: Json
          created_at?: string
          id?: string
          subject?: string
          topic?: string
          unit_number?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
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
      feedback_replies: {
        Row: {
          author_id: string
          created_at: string
          id: string
          is_admin_reply: boolean
          message: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          is_admin_reply?: boolean
          message: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          is_admin_reply?: boolean
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "feedback_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcard_reviews: {
        Row: {
          answer: string
          board: string | null
          box: number
          card_key: string
          correct_streak: number
          created_at: string
          due_at: string
          id: string
          last_reviewed_at: string | null
          question: string
          source: string
          subject: string | null
          topic: string | null
          total_correct: number
          total_reviews: number
          unit_number: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: string
          board?: string | null
          box?: number
          card_key: string
          correct_streak?: number
          created_at?: string
          due_at?: string
          id?: string
          last_reviewed_at?: string | null
          question: string
          source: string
          subject?: string | null
          topic?: string | null
          total_correct?: number
          total_reviews?: number
          unit_number?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string
          board?: string | null
          box?: number
          card_key?: string
          correct_streak?: number
          created_at?: string
          due_at?: string
          id?: string
          last_reviewed_at?: string | null
          question?: string
          source?: string
          subject?: string | null
          topic?: string | null
          total_correct?: number
          total_reviews?: number
          unit_number?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          created_at: string
          game: string
          id: string
          player_name: string
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game?: string
          id?: string
          player_name: string
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          game?: string
          id?: string
          player_name?: string
          score?: number
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
      notes_generation_log: {
        Row: {
          forbidden_keywords_found: string[]
          id: string
          qualification: string
          seed: string
          subject: string
          trigger: string
          ts: string
          unit_topic: string
          unit_topic_name: string | null
          validation_passed: boolean
        }
        Insert: {
          forbidden_keywords_found?: string[]
          id?: string
          qualification: string
          seed: string
          subject: string
          trigger: string
          ts?: string
          unit_topic: string
          unit_topic_name?: string | null
          validation_passed: boolean
        }
        Update: {
          forbidden_keywords_found?: string[]
          id?: string
          qualification?: string
          seed?: string
          subject?: string
          trigger?: string
          ts?: string
          unit_topic?: string
          unit_topic_name?: string | null
          validation_passed?: boolean
        }
        Relationships: []
      }
      onboarding_emails: {
        Row: {
          created_at: string
          email: string
          email_number: number
          error: string | null
          first_name: string | null
          id: string
          scheduled_for: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          email_number: number
          error?: string | null
          first_name?: string | null
          id?: string
          scheduled_for: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          email_number?: number
          error?: string | null
          first_name?: string | null
          id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_streak: number
          daily_reminder_enabled: boolean
          daily_reminder_time: string
          diagnostic_completed: boolean
          display_name: string | null
          dodo_customer_id: string | null
          dodo_subscription_id: string | null
          exam_board: string
          first_name: string | null
          hours_per_day: number
          id: string
          is_admin: boolean
          is_pro: boolean
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
          subscription_status: string | null
          theme: string
          trial_start_date: string | null
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
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          exam_board?: string
          first_name?: string | null
          hours_per_day?: number
          id: string
          is_admin?: boolean
          is_pro?: boolean
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
          subscription_status?: string | null
          theme?: string
          trial_start_date?: string | null
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
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          exam_board?: string
          first_name?: string | null
          hours_per_day?: number
          id?: string
          is_admin?: boolean
          is_pro?: boolean
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
          subscription_status?: string | null
          theme?: string
          trial_start_date?: string | null
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      user_activity: {
        Row: {
          last_heartbeat: string
          total_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          last_heartbeat?: string
          total_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          last_heartbeat?: string
          total_seconds?: number
          updated_at?: string
          user_id?: string
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      record_activity_heartbeat: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
      grade_level: ["A*", "A", "B", "C", "D", "E", "U"],
      plan_tier: ["free", "pro", "advanced"],
      subject_code: ["mathematics", "biology", "chemistry", "physics"],
    },
  },
} as const
