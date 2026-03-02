-- Extend related_entity_type_enum for admin audit (task, admin_user, profile).
-- Canonical schema lives in sline_app; apply this migration to shared DB when dashboard
-- and app use the same database. For production, prefer adding equivalent migration
-- in sline_app/supabase/migrations so app repo remains source of truth.
-- Requires PostgreSQL 15+ for IF NOT EXISTS; otherwise remove IF NOT EXISTS and run once.

ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'task';
ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'admin_user';
ALTER TYPE related_entity_type_enum ADD VALUE IF NOT EXISTS 'profile';
