-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New query → Paste → Run

-- Sessions table
create table if not exists sessions (
  id          text primary key,
  device_id   text not null,
  dump_text   text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on every row change
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sessions_updated_at on sessions;
create trigger sessions_updated_at
  before update on sessions
  for each row execute procedure touch_updated_at();

-- Index for fast device lookup
create index if not exists sessions_device_id_idx on sessions(device_id);
create index if not exists sessions_updated_at_idx on sessions(updated_at desc);

-- RLS: open access (device_id acts as the implicit auth)
alter table sessions enable row level security;

create policy "anyone can read sessions"
  on sessions for select using (true);

create policy "anyone can insert sessions"
  on sessions for insert with check (true);

create policy "anyone can update sessions"
  on sessions for update using (true);
