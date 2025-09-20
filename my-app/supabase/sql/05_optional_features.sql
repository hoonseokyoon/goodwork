-- Optional but recommended features
-- News cards
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  origin_notion_id text unique,
  title text not null,
  summary text,
  image_url text,
  published_at timestamptz,
  source_name text,
  source_url text,
  tags text[] default '{}',
  institution_id uuid references public.institutions(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists news_time_idx on public.news (published_at desc);
create index if not exists news_tags_gin on public.news using gin (tags);

create trigger trg_news_updated_at
before update on public.news
for each row execute function set_updated_at();

-- Bounding box RPC for map views
create or replace function public.institutions_in_bbox(
  p_min_lat double precision,
  p_min_lng double precision,
  p_max_lat double precision,
  p_max_lng double precision
) returns setof public.institutions
language sql
stable
as $$
  select * from public.institutions
  where lat between p_min_lat and p_max_lat
    and lng between p_min_lng and p_max_lng;
$$;

-- For large scale geospatial workloads consider enabling PostGIS:
-- create extension if not exists postgis;
