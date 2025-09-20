-- Core domain tables sourced from the planning document
-- 1) Institutions
create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  origin_notion_id text unique,
  slug text unique,
  name text not null,
  kind institution_kind default 'other',
  religious_order text,
  website_url text,
  sns jsonb,
  phone text,
  email text,
  address text,
  lat double precision,
  lng double precision,
  donation jsonb,
  volunteer_contact text,
  description text,
  status status_type default 'active',
  source_urls jsonb,
  last_crawled_at timestamptz,
  confidence int default 70,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint chk_lat check (lat is null or (lat between -90 and 90)),
  constraint chk_lng check (lng is null or (lng between -180 and 180))
);

create index if not exists institutions_name_trgm on public.institutions using gin (name gin_trgm_ops);
create index if not exists institutions_lat_lng on public.institutions (lat, lng);

create trigger trg_institutions_updated_at
before update on public.institutions
for each row execute function set_updated_at();

-- 2) Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  origin_notion_id text unique,
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  category text,
  price numeric,
  unit text,
  buy_url text,
  image_url text,
  stock_status product_stock_status default 'unknown',
  description text,
  last_seen_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists products_name_trgm on public.products using gin (name gin_trgm_ops);
create index if not exists products_inst_idx on public.products (institution_id);

create trigger trg_products_updated_at
before update on public.products
for each row execute function set_updated_at();

-- 3) Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  origin_notion_id text unique,
  institution_id uuid not null references public.institutions(id) on delete cascade,
  title text not null,
  kind event_kind default 'other',
  start_at timestamptz,
  end_at timestamptz,
  rrule text,
  location text,
  signup_url text,
  has_fee boolean,
  price numeric,
  note text,
  source_url text,
  last_seen_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint chk_time_order check (start_at is null or end_at is null or start_at <= end_at)
);

create index if not exists events_title_trgm on public.events using gin (title gin_trgm_ops);
create index if not exists events_time on public.events (start_at, end_at);
create index if not exists events_inst_idx on public.events (institution_id);

create trigger trg_events_updated_at
before update on public.events
for each row execute function set_updated_at();

-- 4) Updates (change log)
create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  entity text not null,
  entity_id uuid not null,
  action text not null,
  source text,
  source_url text,
  diff jsonb,
  author text,
  created_at timestamptz default now()
);

create index if not exists updates_entity_idx on public.updates (entity, entity_id, created_at desc);
