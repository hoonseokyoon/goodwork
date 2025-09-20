-- Row Level Security and read-only policies
alter table public.institutions enable row level security;
alter table public.products     enable row level security;
alter table public.events       enable row level security;
alter table public.updates      enable row level security;
alter table public.news         enable row level security;

create policy anon_read_institutions on public.institutions for select using (true);
create policy anon_read_products     on public.products     for select using (true);
create policy anon_read_events       on public.events       for select using (true);
create policy anon_read_updates      on public.updates      for select using (true);
create policy anon_read_news         on public.news         for select using (true);

grant execute on function public.institutions_in_bbox(double precision,double precision,double precision,double precision) to anon, authenticated;
