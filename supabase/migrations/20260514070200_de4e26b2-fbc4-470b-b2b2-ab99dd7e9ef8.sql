create table public.notes_generation_log (
  id uuid primary key default gen_random_uuid(),
  qualification text not null,
  subject text not null,
  unit_topic text not null,
  unit_topic_name text,
  ts timestamptz not null default now(),
  seed text not null,
  trigger text not null check (trigger in ('initial','cache_clear','validation_retry')),
  validation_passed boolean not null,
  forbidden_keywords_found text[] not null default '{}'
);
alter table public.notes_generation_log enable row level security;
create policy "admin reads notes log" on public.notes_generation_log
  for select using (public.has_role(auth.uid(),'admin'));
create policy "service inserts notes log" on public.notes_generation_log
  for insert with check (auth.role() = 'service_role');
create index idx_notes_log_ts on public.notes_generation_log(ts desc);