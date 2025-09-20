-- Enumerated types shared across tables
do $$
begin
  if not exists (select 1 from pg_type where typname = 'institution_kind') then
    create type institution_kind as enum ('monastery','convent','other');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_type') then
    create type status_type as enum ('active','dormant');
  end if;
  if not exists (select 1 from pg_type where typname = 'product_stock_status') then
    create type product_stock_status as enum ('in_stock','out_of_stock','unknown');
  end if;
  if not exists (select 1 from pg_type where typname = 'event_kind') then
    create type event_kind as enum ('volunteer','retreat','class','other');
  end if;
end
$$;
