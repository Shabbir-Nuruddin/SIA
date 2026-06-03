-- Teacher-set, AI-generated HPL learning targets per student. Visible to the
-- student and their linked parent (so parents see targets without a PTM).

create table if not exists public.student_targets (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid references public.profiles(id) on delete set null,
  period     text,                       -- e.g. 'This week', 'Next 2 weeks'
  content    text not null,              -- the target (markdown), HPL-framed
  status     text not null default 'sent',
  created_at timestamptz not null default now()
);
create index if not exists idx_student_targets_student on public.student_targets (student_id, created_at desc);

alter table public.student_targets enable row level security;

-- Teacher manages targets they authored.
drop policy if exists student_targets_teacher on public.student_targets;
create policy student_targets_teacher on public.student_targets for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- Student reads their own targets.
drop policy if exists student_targets_student on public.student_targets;
create policy student_targets_student on public.student_targets for select
  using (auth.uid() = student_id);

-- Linked parent reads their child's targets.
drop policy if exists student_targets_parent on public.student_targets;
create policy student_targets_parent on public.student_targets for select
  using (exists (
    select 1 from public.sia_parent_child l
    where l.parent_id = auth.uid() and l.child_id = public.student_targets.student_id
  ));
