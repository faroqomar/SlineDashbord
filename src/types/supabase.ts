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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          actor_id: string
          created_at: string | null
          entity_id: string
          entity_type: string
          event_type: string
          id: string
          is_read: boolean | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          actor_id: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          event_type: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          actor_id?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          event_type?: string
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      availability_slots: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          is_blocked: boolean
          provider_id: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          is_blocked?: boolean
          provider_id: string
          starts_at: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          is_blocked?: boolean
          provider_id?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_slots_provider"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          id: string
          note: string | null
          package_id: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price: number | null
          provider_id: string
          requirements: Json | null
          slot_id: string | null
          status: Database["public"]["Enums"]["booking_status_enum"]
          task_id: string | null
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          package_id?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price?: number | null
          provider_id: string
          requirements?: Json | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status_enum"]
          task_id?: string | null
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          package_id?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price?: number | null
          provider_id?: string
          requirements?: Json | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status_enum"]
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_mvp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_provider"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      conversation_presence: {
        Row: {
          conversation_id: string
          is_typing: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          is_typing?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          is_typing?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_presence_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_presence_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_presence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          deleted_at_user1: string | null
          deleted_at_user2: string | null
          id: string
          initiated_by: string | null
          last_message_at: string | null
          task_id: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at_user1?: string | null
          deleted_at_user2?: string | null
          id?: string
          initiated_by?: string | null
          last_message_at?: string | null
          task_id?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at_user1?: string | null
          deleted_at_user2?: string | null
          id?: string
          initiated_by?: string | null
          last_message_at?: string | null
          task_id?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_mvp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      favorites: {
        Row: {
          client_id: string
          created_at: string
          freelancer_id: string
          id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          freelancer_id: string
          id?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          freelancer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "favorites_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_size: number | null
          attachment_type: string | null
          attachment_url: string | null
          content: string
          conversation_id: string | null
          created_at: string | null
          delivered_at: string | null
          id: string
          message_type: Database["public"]["Enums"]["message_type_enum"]
          payload: Json
          receiver_id: string | null
          seen_at: string | null
          sender_id: string | null
        }
        Insert: {
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_type?: string | null
          attachment_url?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_type_enum"]
          payload?: Json
          receiver_id?: string | null
          seen_at?: string | null
          sender_id?: string | null
        }
        Update: {
          attachment_name?: string | null
          attachment_size?: number | null
          attachment_type?: string | null
          attachment_url?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          id?: string
          message_type?: Database["public"]["Enums"]["message_type_enum"]
          payload?: Json
          receiver_id?: string | null
          seen_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "user_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_fk"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_fk"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          owner_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          owner_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          owner_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_role: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          roles: string[] | null
          skills: string[] | null
        }
        Insert: {
          active_role?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          roles?: string[] | null
          skills?: string[] | null
        }
        Update: {
          active_role?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          roles?: string[] | null
          skills?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_tasks: {
        Row: {
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_mvp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          delivery_days: number | null
          description: string | null
          freelancer_id: string
          id: string
          image_urls: string[] | null
          price: number | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          freelancer_id: string
          id?: string
          image_urls?: string[] | null
          price?: number | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          freelancer_id?: string
          id?: string
          image_urls?: string[] | null
          price?: number | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      task_requests: {
        Row: {
          amount: number | null
          bidder_id: string | null
          created_at: string
          days: number
          deleted_at: string | null
          duration_days: number | null
          freelancer_id: string | null
          id: string
          initiated_by: string | null
          message: string | null
          note: string | null
          price: number
          status: string
          task_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          bidder_id?: string | null
          created_at?: string
          days: number
          deleted_at?: string | null
          duration_days?: number | null
          freelancer_id?: string | null
          id?: string
          initiated_by?: string | null
          message?: string | null
          note?: string | null
          price: number
          status?: string
          task_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          bidder_id?: string | null
          created_at?: string
          days?: number
          deleted_at?: string | null
          duration_days?: number | null
          freelancer_id?: string | null
          id?: string
          initiated_by?: string | null
          message?: string | null
          note?: string | null
          price?: number
          status?: string
          task_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_requests_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_requests_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_requests_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_requests_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "task_requests_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_requests_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_requests_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_mvp"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_freelancer_id: string | null
          budget: number
          budget_cents: number | null
          category: string | null
          category_id: string | null
          client_id: string | null
          created_at: string
          deadline: string | null
          description: string
          freelancer_id: string | null
          hour_rate_bigint: number | null
          id: string
          image_paths: string[] | null
          owner_id: string | null
          packages: Json | null
          session_price_bigint: number | null
          skills: string[] | null
          status: string
          task_type: Database["public"]["Enums"]["task_type_enum"]
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_freelancer_id?: string | null
          budget: number
          budget_cents?: number | null
          category?: string | null
          category_id?: string | null
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          description: string
          freelancer_id?: string | null
          hour_rate_bigint?: number | null
          id?: string
          image_paths?: string[] | null
          owner_id?: string | null
          packages?: Json | null
          session_price_bigint?: number | null
          skills?: string[] | null
          status?: string
          task_type?: Database["public"]["Enums"]["task_type_enum"]
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_freelancer_id?: string | null
          budget?: number
          budget_cents?: number | null
          category?: string | null
          category_id?: string | null
          client_id?: string | null
          created_at?: string
          deadline?: string | null
          description?: string
          freelancer_id?: string | null
          hour_rate_bigint?: number | null
          id?: string
          image_paths?: string[] | null
          owner_id?: string | null
          packages?: Json | null
          session_price_bigint?: number | null
          skills?: string[] | null
          status?: string
          task_type?: Database["public"]["Enums"]["task_type_enum"]
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_freelancer_id_fkey"
            columns: ["assigned_freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_freelancer_id_fkey"
            columns: ["assigned_freelancer_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_ref"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          related_entity_id: string | null
          related_entity_type: string | null
          related_txn_id: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          related_txn_id?: string | null
          status: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          related_txn_id?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      work_logs: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_private: boolean
          metadata: Json | null
          related_entity_id: string
          related_entity_type: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          metadata?: Json | null
          related_entity_id: string
          related_entity_type: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          metadata?: Json | null
          related_entity_id?: string
          related_entity_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_logs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_logs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      tasks_mvp: {
        Row: {
          assigned_freelancer_id: string | null
          budget_cents: number | null
          category_id: string | null
          client_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string | null
          image_paths: string[] | null
          skills: string[] | null
          status: string | null
          task_type: Database["public"]["Enums"]["task_type_enum"] | null
          title: string | null
        }
        Insert: {
          assigned_freelancer_id?: string | null
          budget_cents?: number | null
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string | null
          image_paths?: string[] | null
          skills?: string[] | null
          status?: string | null
          task_type?: Database["public"]["Enums"]["task_type_enum"] | null
          title?: string | null
        }
        Update: {
          assigned_freelancer_id?: string | null
          budget_cents?: number | null
          category_id?: string | null
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string | null
          image_paths?: string[] | null
          skills?: string[] | null
          status?: string | null
          task_type?: Database["public"]["Enums"]["task_type_enum"] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_freelancer_id_fkey"
            columns: ["assigned_freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_freelancer_id_fkey"
            columns: ["assigned_freelancer_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_conversations: {
        Row: {
          created_at: string | null
          id: string | null
          task_id: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          task_id?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          task_id?: string | null
          user1_id?: string | null
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_mvp"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: never
          email?: string | null
          full_name?: never
          id?: string | null
        }
        Update: {
          avatar_url?: never
          email?: string | null
          full_name?: never
          id?: string | null
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          available_balance: number | null
          held_balance: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_task_request:
        | {
            Args: { p_request_id: string }
            Returns: {
              amount: number | null
              bidder_id: string | null
              created_at: string
              days: number
              deleted_at: string | null
              duration_days: number | null
              freelancer_id: string | null
              id: string
              initiated_by: string | null
              message: string | null
              note: string | null
              price: number
              status: string
              task_id: string
              updated_at: string | null
            }
            SetofOptions: {
              from: "*"
              to: "task_requests"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | { Args: { p_request_id: string; p_task_id: string }; Returns: string }
      fn_log_acceptance_message: {
        Args: {
          p_conversation_id: string
          p_freelancer: string
          p_owner: string
          p_task_id: string
        }
        Returns: string
      }
      is_client: { Args: { uid: string }; Returns: boolean }
      is_conversation_participant: {
        Args: { convo_id: string; uid: string }
        Returns: boolean
      }
      is_freelancer: { Args: { uid: string }; Returns: boolean }
      is_work_log_participant: {
        Args: { p_entity_id: string; p_entity_type: string; p_user_id: string }
        Returns: boolean
      }
      mark_conversation_delivered: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      mark_conversation_seen: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      process_expired_requests: { Args: never; Returns: Json }
      process_payment_event: {
        Args: { p_entity_id: string; p_event: string; p_type: string }
        Returns: Json
      }
      reject_task_request:
        | {
            Args: { p_request_id: string }
            Returns: {
              amount: number | null
              bidder_id: string | null
              created_at: string
              days: number
              deleted_at: string | null
              duration_days: number | null
              freelancer_id: string | null
              id: string
              initiated_by: string | null
              message: string | null
              note: string | null
              price: number
              status: string
              task_id: string
              updated_at: string | null
            }
            SetofOptions: {
              from: "*"
              to: "task_requests"
              isOneToOne: true
              isSetofReturn: false
            }
          }
        | { Args: { p_request_id: string; p_task_id: string }; Returns: string }
      replace_task_request: {
        Args: {
          p_days: number
          p_freelancer_id: string
          p_message: string
          p_price: number
          p_task_id: string
        }
        Returns: undefined
      }
      search_profiles: {
        Args: {
          limit_val?: number
          offset_val?: number
          query: string
          role_filter?: string
        }
        Returns: {
          active_role: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          roles: string[] | null
          skills: string[] | null
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      search_tasks: {
        Args: { limit_val?: number; offset_val?: number; query: string }
        Returns: {
          assigned_freelancer_id: string | null
          budget: number
          budget_cents: number | null
          category: string | null
          category_id: string | null
          client_id: string | null
          created_at: string
          deadline: string | null
          description: string
          freelancer_id: string | null
          hour_rate_bigint: number | null
          id: string
          image_paths: string[] | null
          owner_id: string | null
          packages: Json | null
          session_price_bigint: number | null
          skills: string[] | null
          status: string
          task_type: Database["public"]["Enums"]["task_type_enum"]
          title: string
          updated_at: string | null
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "tasks"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      start_task_conversation_v1: {
        Args: { p_task_id: string }
        Returns: {
          created_at: string | null
          deleted_at_user1: string | null
          deleted_at_user2: string | null
          id: string
          initiated_by: string | null
          last_message_at: string | null
          task_id: string | null
          user1_id: string | null
          user2_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "conversations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      submit_task_request: {
        Args: { p_duration_days: number; p_price: number; p_task_id: string }
        Returns: string
      }
    }
    Enums: {
      booking_status_enum:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "canceled"
        | "completed"
        | "paid_request_pending"
        | "active"
        | "delivered"
        | "refunded"
        | "expired_unanswered"
      message_type_enum:
        | "text"
        | "system"
        | "offer"
        | "offer_update"
        | "offer_accepted"
        | "offer_rejected"
        | "delivery_submitted"
        | "end_early_request"
        | "dispute_report"
      payment_status_enum: "unpaid" | "held" | "released" | "refunded"
      task_type_enum: "tender" | "booking"
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
      booking_status_enum: [
        "pending",
        "confirmed",
        "in_progress",
        "canceled",
        "completed",
        "paid_request_pending",
        "active",
        "delivered",
        "refunded",
        "expired_unanswered",
      ],
      message_type_enum: [
        "text",
        "system",
        "offer",
        "offer_update",
        "offer_accepted",
        "offer_rejected",
        "delivery_submitted",
        "end_early_request",
        "dispute_report",
      ],
      payment_status_enum: ["unpaid", "held", "released", "refunded"],
      task_type_enum: ["tender", "booking"],
    },
  },
} as const
