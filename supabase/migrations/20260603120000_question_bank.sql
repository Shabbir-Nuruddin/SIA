-- Shared question / mock-paper reuse pool — saves AI credits by reusing
-- previously generated sets across users, while ensuring the SAME user never
-- gets the same set twice. Populated and read only by edge functions via the
-- service role (which bypasses RLS).

create table if not exists public.question_bank (
  id uuid primary key default gen_random_uuid(),
  kind text not null,            -- 'topical' | 'mock'
  board text not null,
  subject text not null,
  signature text not null,       -- normalised request key (topic/difficulty/type/etc.)
  payload jsonb not null,        -- the generated questions array (+ any meta)
  created_at timestamptz not null default now()
);
create index if not exists idx_question_bank_lookup
  on public.question_bank (kind, board, subject, signature, created_at desc);

create table if not exists public.user_seen_bank (
  user_id uuid not null references auth.users (id) on delete cascade,
  bank_id uuid not null references public.question_bank (id) on delete cascade,
  seen_at timestamptz not null default now(),
  primary key (user_id, bank_id)
);
create index if not exists idx_user_seen_bank_user on public.user_seen_bank (user_id);

-- RLS on, with no client policies: only the service role (edge functions) touches these.
alter table public.question_bank enable row level security;
alter table public.user_seen_bank enable row level security;
