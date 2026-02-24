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
      accounts: {
        Row: {
          account_code: string
          account_type: Database["public"]["Enums"]["ledger_account_type_enum"]
          created_at: string
          currency: string
          id: string
          owner_id: string | null
        }
        Insert: {
          account_code: string
          account_type: Database["public"]["Enums"]["ledger_account_type_enum"]
          created_at?: string
          currency?: string
          id?: string
          owner_id?: string | null
        }
        Update: {
          account_code?: string
          account_type?: Database["public"]["Enums"]["ledger_account_type_enum"]
          created_at?: string
          currency?: string
          id?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      admin_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          target_id: string | null
          target_resource: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_resource: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_resource?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_active_at: string | null
          permissions: Json | null
          role: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          last_active_at?: string | null
          permissions?: Json | null
          role: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_active_at?: string | null
          permissions?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          event_type: string | null
          id: string
          journal_entry_id: string | null
          meta: Json
          related_entity_id: string | null
          related_entity_type: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          journal_entry_id?: string | null
          meta?: Json
          related_entity_id?: string | null
          related_entity_type?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          journal_entry_id?: string | null
          meta?: Json
          related_entity_id?: string | null
          related_entity_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "vw_admin_journal_ledger"
            referencedColumns: ["journal_id"]
          },
          {
            foreignKeyName: "audit_logs_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "vw_wallet_activity_user"
            referencedColumns: ["journal_entry_id"]
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
          delivered_at: string | null
          id: string
          note: string | null
          package_id: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price: number | null
          provider_id: string
          requirements: Json | null
          review_expires_at: string | null
          revision_note: string | null
          revision_requested_at: string | null
          revisions_total: number | null
          revisions_used: number | null
          slot_id: string | null
          status: Database["public"]["Enums"]["booking_status_enum"]
          task_id: string | null
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          note?: string | null
          package_id?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price?: number | null
          provider_id: string
          requirements?: Json | null
          review_expires_at?: string | null
          revision_note?: string | null
          revision_requested_at?: string | null
          revisions_total?: number | null
          revisions_used?: number | null
          slot_id?: string | null
          status?: Database["public"]["Enums"]["booking_status_enum"]
          task_id?: string | null
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          note?: string | null
          package_id?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price?: number | null
          provider_id?: string
          requirements?: Json | null
          review_expires_at?: string | null
          revision_note?: string | null
          revision_requested_at?: string | null
          revisions_total?: number | null
          revisions_used?: number | null
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
      change_requests: {
        Row: {
          applied_contract_version: number | null
          created_at: string
          days_diff: number | null
          id: string
          price_diff: number | null
          related_entity_id: string
          related_entity_type: string
          requester_id: string
          resolved_at: string | null
          scope_diff: string | null
          status: string
        }
        Insert: {
          applied_contract_version?: number | null
          created_at?: string
          days_diff?: number | null
          id?: string
          price_diff?: number | null
          related_entity_id: string
          related_entity_type: string
          requester_id: string
          resolved_at?: string | null
          scope_diff?: string | null
          status?: string
        }
        Update: {
          applied_contract_version?: number | null
          created_at?: string
          days_diff?: number | null
          id?: string
          price_diff?: number | null
          related_entity_id?: string
          related_entity_type?: string
          requester_id?: string
          resolved_at?: string | null
          scope_diff?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
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
      dispute_evidence: {
        Row: {
          created_at: string | null
          description: string | null
          dispute_id: string | null
          file_type: string | null
          file_url: string
          id: string
          uploader_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dispute_id?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          uploader_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dispute_id?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_evidence_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_evidence_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_evidence_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          content: string
          created_at: string | null
          dispute_id: string | null
          id: string
          is_admin: boolean | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          is_admin?: boolean | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          dispute_id?: string | null
          id?: string
          is_admin?: boolean | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
        ]
      }
      disputes: {
        Row: {
          complainant_id: string
          created_at: string | null
          defendant_id: string | null
          id: string
          reason: string
          resolution: string | null
          resolved_at: string | null
          status: string | null
          task_id: string
        }
        Insert: {
          complainant_id: string
          created_at?: string | null
          defendant_id?: string | null
          id?: string
          reason: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          task_id: string
        }
        Update: {
          complainant_id?: string
          created_at?: string | null
          defendant_id?: string | null
          id?: string
          reason?: string
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_defendant_id_fkey"
            columns: ["defendant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_defendant_id_fkey"
            columns: ["defendant_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "disputes_initiator_id_fkey"
            columns: ["complainant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_initiator_id_fkey"
            columns: ["complainant_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "disputes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_mvp"
            referencedColumns: ["id"]
          },
        ]
      }
      extension_requests: {
        Row: {
          created_at: string
          id: string
          new_deadline: string
          reason: string | null
          related_entity_id: string
          related_entity_type: string
          requester_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          new_deadline: string
          reason?: string | null
          related_entity_id: string
          related_entity_type: string
          requester_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          new_deadline?: string
          reason?: string | null
          related_entity_id?: string
          related_entity_type?: string
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "extension_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extension_requests_requester_id_fkey"
            columns: ["requester_id"]
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
      journal_entries: {
        Row: {
          created_at: string
          created_by: string | null
          currency: string
          event_type: Database["public"]["Enums"]["payment_event_type_enum"]
          id: string
          idempotency_key: string
          meta: Json
          related_entity_id: string | null
          related_entity_type:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency?: string
          event_type: Database["public"]["Enums"]["payment_event_type_enum"]
          id?: string
          idempotency_key: string
          meta?: Json
          related_entity_id?: string | null
          related_entity_type?:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          status?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency?: string
          event_type?: Database["public"]["Enums"]["payment_event_type_enum"]
          id?: string
          idempotency_key?: string
          meta?: Json
          related_entity_id?: string | null
          related_entity_type?:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          status?: string
        }
        Relationships: []
      }
      ledger_lines: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          currency: string
          direction: Database["public"]["Enums"]["ledger_direction_enum"]
          id: string
          journal_entry_id: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          currency?: string
          direction: Database["public"]["Enums"]["ledger_direction_enum"]
          id?: string
          journal_entry_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          currency?: string
          direction?: Database["public"]["Enums"]["ledger_direction_enum"]
          id?: string
          journal_entry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "vw_admin_journal_ledger"
            referencedColumns: ["journal_id"]
          },
          {
            foreignKeyName: "ledger_lines_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "vw_wallet_activity_user"
            referencedColumns: ["journal_entry_id"]
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
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_wallet_frozen: boolean | null
          metadata: Json | null
          roles: string[] | null
          skills: string[] | null
          status: string | null
        }
        Insert: {
          active_role?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_wallet_frozen?: boolean | null
          metadata?: Json | null
          roles?: string[] | null
          skills?: string[] | null
          status?: string | null
        }
        Update: {
          active_role?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_wallet_frozen?: boolean | null
          metadata?: Json | null
          roles?: string[] | null
          skills?: string[] | null
          status?: string | null
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
      support_tickets: {
        Row: {
          assignee_id: string | null
          category: string
          created_at: string | null
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          category: string
          created_at?: string | null
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          category?: string
          created_at?: string | null
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      task_requests: {
        Row: {
          amount: number | null
          awarded_at: string | null
          awarded_by: string | null
          bidder_id: string | null
          client_id: string | null
          created_at: string
          days: number
          deleted_at: string | null
          duration_days: number | null
          freelancer_id: string | null
          id: string
          initiated_by: string | null
          message: string | null
          note: string | null
          payment_deadline: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price: number
          status: string
          task_id: string
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          awarded_at?: string | null
          awarded_by?: string | null
          bidder_id?: string | null
          client_id?: string | null
          created_at?: string
          days: number
          deleted_at?: string | null
          duration_days?: number | null
          freelancer_id?: string | null
          id?: string
          initiated_by?: string | null
          message?: string | null
          note?: string | null
          payment_deadline?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price: number
          status?: string
          task_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          awarded_at?: string | null
          awarded_by?: string | null
          bidder_id?: string | null
          client_id?: string | null
          created_at?: string
          days?: number
          deleted_at?: string | null
          duration_days?: number | null
          freelancer_id?: string | null
          id?: string
          initiated_by?: string | null
          message?: string | null
          note?: string | null
          payment_deadline?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_enum"]
            | null
          price?: number
          status?: string
          task_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_requests_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "task_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_requests_client_id_fkey"
            columns: ["client_id"]
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
          delivered_at: string | null
          description: string
          freelancer_id: string | null
          hour_rate_bigint: number | null
          id: string
          image_paths: string[] | null
          owner_id: string | null
          packages: Json | null
          review_expires_at: string | null
          revision_note: string | null
          revision_requested_at: string | null
          revisions_total: number | null
          revisions_used: number | null
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
          delivered_at?: string | null
          description: string
          freelancer_id?: string | null
          hour_rate_bigint?: number | null
          id?: string
          image_paths?: string[] | null
          owner_id?: string | null
          packages?: Json | null
          review_expires_at?: string | null
          revision_note?: string | null
          revision_requested_at?: string | null
          revisions_total?: number | null
          revisions_used?: number | null
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
          delivered_at?: string | null
          description?: string
          freelancer_id?: string | null
          hour_rate_bigint?: number | null
          id?: string
          image_paths?: string[] | null
          owner_id?: string | null
          packages?: Json | null
          review_expires_at?: string | null
          revision_note?: string | null
          revision_requested_at?: string | null
          revisions_total?: number | null
          revisions_used?: number | null
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
      ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
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
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      work_contracts: {
        Row: {
          contract_hash: string
          created_at: string
          id: string
          related_entity_id: string
          related_entity_type: string
          snapshot: Json
          version: number
        }
        Insert: {
          contract_hash: string
          created_at?: string
          id?: string
          related_entity_id: string
          related_entity_type: string
          snapshot: Json
          version: number
        }
        Update: {
          contract_hash?: string
          created_at?: string
          id?: string
          related_entity_id?: string
          related_entity_type?: string
          snapshot?: Json
          version?: number
        }
        Relationships: []
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
      vw_admin_journal_ledger: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          event_type:
            | Database["public"]["Enums"]["payment_event_type_enum"]
            | null
          fee_amount: number | null
          gross_amount: number | null
          initiator_user_id: string | null
          journal_id: string | null
          meta_full: Json | null
          meta_masked: Json | null
          net_amount: number | null
          payee_user_id: string | null
          payer_user_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          event_type?:
            | Database["public"]["Enums"]["payment_event_type_enum"]
            | null
          fee_amount?: never
          gross_amount?: never
          initiator_user_id?: never
          journal_id?: string | null
          meta_full?: Json | null
          meta_masked?: never
          net_amount?: never
          payee_user_id?: never
          payer_user_id?: never
          status?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          event_type?:
            | Database["public"]["Enums"]["payment_event_type_enum"]
            | null
          fee_amount?: never
          gross_amount?: never
          initiator_user_id?: never
          journal_id?: string | null
          meta_full?: Json | null
          meta_masked?: never
          net_amount?: never
          payee_user_id?: never
          payer_user_id?: never
          status?: string | null
        }
        Relationships: []
      }
      vw_financial_metrics_period: {
        Row: {
          currency: string | null
          gmv: number | null
          period: string | null
          period_end: string | null
          period_start: string | null
          refunds: number | null
          revenue: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      vw_financial_metrics_realtime: {
        Row: {
          calculated_at: string | null
          currency: string | null
          escrow_account_balance_iqd: number | null
          escrow_held_iqd: number | null
          gmv_iqd: number | null
          lifetime_refunds_iqd: number | null
          platform_cash_iqd: number | null
          revenue_account_balance_iqd: number | null
          revenue_iqd: number | null
        }
        Relationships: []
      }
      vw_unified_payable_items: {
        Row: {
          amount: number | null
          client_id: string | null
          created_at: string | null
          currency: string | null
          entity_id: string | null
          entity_type: string | null
          payment_status: string | null
          provider_id: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          currency?: never
          entity_id?: string | null
          entity_type?: never
          payment_status?: never
          provider_id?: string | null
          status?: never
        }
        Update: {
          amount?: number | null
          client_id?: string | null
          created_at?: string | null
          currency?: never
          entity_id?: string | null
          entity_type?: never
          payment_status?: never
          provider_id?: string | null
          status?: never
        }
        Relationships: [
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
      vw_unified_work_items: {
        Row: {
          client_id: string | null
          deadline: string | null
          delivered_at: string | null
          dispute_requires_user_action: boolean | null
          freelancer_id: string | null
          id: string | null
          last_activity_at: string | null
          needs_review: boolean | null
          price: number | null
          resolution_type: string | null
          review_expires_at: string | null
          revisions_total: number | null
          revisions_used: number | null
          sort_rank: number | null
          source_status: string | null
          source_type: string | null
          title: string | null
          unified_status: string | null
          work_item_id: string | null
        }
        Relationships: []
      }
      vw_wallet_activity_user: {
        Row: {
          amount_gross: number | null
          amount_net: number | null
          counterparty_user_id: string | null
          created_at: string | null
          currency: string | null
          event_type:
            | Database["public"]["Enums"]["payment_event_type_enum"]
            | null
          fee_amount: number | null
          journal_entry_id: string | null
          related_entity_id: string | null
          related_entity_type:
            | Database["public"]["Enums"]["related_entity_type_enum"]
            | null
          status: string | null
        }
        Relationships: []
      }
      vw_wallet_balances_user: {
        Row: {
          available_balance: number | null
          currency: string | null
          held_balance: number | null
          pending_withdrawal_balance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_owner_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
              awarded_at: string | null
              awarded_by: string | null
              bidder_id: string | null
              client_id: string | null
              created_at: string
              days: number
              deleted_at: string | null
              duration_days: number | null
              freelancer_id: string | null
              id: string
              initiated_by: string | null
              message: string | null
              note: string | null
              payment_deadline: string | null
              payment_status:
                | Database["public"]["Enums"]["payment_status_enum"]
                | null
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
      admin_process_wallet_freeze: {
        Args: {
          p_admin_id: string
          p_freeze: boolean
          p_reason: string
          p_user_id: string
        }
        Returns: undefined
      }
      admin_process_withdrawal: {
        Args: {
          p_admin_id: string
          p_decision: string
          p_reason: string
          p_request_id: string
        }
        Returns: undefined
      }
      admin_resolve_dispute: {
        Args: { p_decision: string; p_dispute_id: string }
        Returns: undefined
      }
      award_task_offer: {
        Args: { p_client_id?: string; p_request_id: string }
        Returns: Json
      }
      cleanup_expired_awards: { Args: never; Returns: undefined }
      fn_financial_metrics_period: {
        Args: { p_period_end: string; p_period_start: string }
        Returns: {
          currency: string
          gmv: number
          refund_rate: number
          refunds: number
          revenue: number
          take_rate: number
        }[]
      }
      fn_log_acceptance_message: {
        Args: {
          p_conversation_id: string
          p_freelancer: string
          p_owner: string
          p_task_id: string
        }
        Returns: string
      }
      get_client_awarded_unpaid_offers: {
        Args: { p_client_id?: string }
        Returns: {
          awarded_at: string
          days: number
          freelancer_avatar: string
          freelancer_id: string
          freelancer_name: string
          note: string
          payment_deadline: string
          price: number
          request_id: string
          task_id: string
          task_title: string
        }[]
      }
      get_freelancer_awarded_unpaid_offers: {
        Args: { p_freelancer_id?: string }
        Returns: {
          awarded_at: string
          client_avatar: string
          client_id: string
          client_name: string
          days: number
          note: string
          payment_deadline: string
          price: number
          request_id: string
          task_id: string
          task_title: string
        }[]
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
      pay_awarded_offer: {
        Args: { p_client_id?: string; p_request_id: string }
        Returns: Json
      }
      process_expired_requests: { Args: never; Returns: Json }
      process_payment_event_ledger: {
        Args: {
          p_amount_gross?: number
          p_currency?: string
          p_event_type: string
          p_idempotency_key: string
          p_meta?: Json
          p_related_entity_id: string
          p_related_entity_type: string
        }
        Returns: Json
      }
      reject_task_request:
        | {
            Args: { p_request_id: string }
            Returns: {
              amount: number | null
              awarded_at: string | null
              awarded_by: string | null
              bidder_id: string | null
              client_id: string | null
              created_at: string
              days: number
              deleted_at: string | null
              duration_days: number | null
              freelancer_id: string | null
              id: string
              initiated_by: string | null
              message: string | null
              note: string | null
              payment_deadline: string | null
              payment_status:
                | Database["public"]["Enums"]["payment_status_enum"]
                | null
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
      rpc_accept_change_request: {
        Args: { request_id: string }
        Returns: undefined
      }
      rpc_approve_delivery: {
        Args: { entity_id: string; entity_type: string }
        Returns: undefined
      }
      rpc_finalize_auto_approval: {
        Args: { entity_id: string; entity_type: string }
        Returns: string
      }
      rpc_request_revision: {
        Args: { entity_id: string; entity_type: string; p_note: string }
        Returns: undefined
      }
      rpc_submit_delivery: {
        Args: { entity_id: string; entity_type: string; note: string }
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
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_wallet_frozen: boolean | null
          metadata: Json | null
          roles: string[] | null
          skills: string[] | null
          status: string | null
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
          delivered_at: string | null
          description: string
          freelancer_id: string | null
          hour_rate_bigint: number | null
          id: string
          image_paths: string[] | null
          owner_id: string | null
          packages: Json | null
          review_expires_at: string | null
          revision_note: string | null
          revision_requested_at: string | null
          revisions_total: number | null
          revisions_used: number | null
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
      journal_status_enum: "posted" | "voided"
      ledger_account_type_enum:
        | "asset"
        | "liability"
        | "revenue"
        | "expense"
        | "equity"
      ledger_direction_enum: "DEBIT" | "CREDIT"
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
      payment_event_type_enum:
        | "escrow_hold"
        | "release_with_fee"
        | "refund"
        | "withdrawal_request"
        | "deposit"
        | "withdrawal_complete"
        | "withdrawal_failed"
        | "admin_credit"
        | "admin_adjustment"
        | "reversal"
        | "gateway_escrow"
      payment_status_enum: "unpaid" | "held" | "released" | "refunded"
      related_entity_type_enum:
        | "booking"
        | "task_request"
        | "withdrawal_request"
        | "admin_adjustment"
      task_type_enum: "tender" | "booking"
      withdrawal_status_enum:
        | "requested"
        | "processing"
        | "completed"
        | "failed"
        | "canceled"
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
      journal_status_enum: ["posted", "voided"],
      ledger_account_type_enum: [
        "asset",
        "liability",
        "revenue",
        "expense",
        "equity",
      ],
      ledger_direction_enum: ["DEBIT", "CREDIT"],
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
      payment_event_type_enum: [
        "escrow_hold",
        "release_with_fee",
        "refund",
        "withdrawal_request",
        "deposit",
        "withdrawal_complete",
        "withdrawal_failed",
        "admin_credit",
        "admin_adjustment",
        "reversal",
        "gateway_escrow",
      ],
      payment_status_enum: ["unpaid", "held", "released", "refunded"],
      related_entity_type_enum: [
        "booking",
        "task_request",
        "withdrawal_request",
        "admin_adjustment",
      ],
      task_type_enum: ["tender", "booking"],
      withdrawal_status_enum: [
        "requested",
        "processing",
        "completed",
        "failed",
        "canceled",
      ],
    },
  },
} as const
