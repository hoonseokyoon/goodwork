-- Enable required PostgreSQL extensions
create extension if not exists pg_trgm;
create extension if not exists pgcrypto; -- provides gen_random_uuid()
