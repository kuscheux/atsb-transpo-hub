-- ─────────────────────────────────────────────────────────────────────────────
-- ATSB Transportation — full schema migration
-- ─────────────────────────────────────────────────────────────────────────────

-- ── chat_messages ─────────────────────────────────────────────────────────────
create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_name  text not null,
  message    text not null,
  user_role  text not null check (user_role in ('coordinator', 'captain', 'dispatcher', 'driver'))
);

alter table public.chat_messages enable row level security;

drop policy if exists "anon read chat"   on public.chat_messages;
drop policy if exists "anon insert chat" on public.chat_messages;

create policy "anon read chat"   on public.chat_messages for select using (true);
create policy "anon insert chat" on public.chat_messages for insert with check (true);

-- ── driver_applications ───────────────────────────────────────────────────────
create table if not exists public.driver_applications (
  id                        uuid primary key default gen_random_uuid(),
  created_at                timestamptz not null default now(),
  driver_name               text not null,
  phone_number              text not null,
  email                     text not null,
  last_5_ssn                text not null,
  hired_to_drive            text not null default '',
  acknowledged_work_times   boolean not null default false,
  acknowledged_vehicle_swap boolean not null default false,
  acknowledged_timecard     boolean not null default false,
  status                    text not null default 'pending' check (status in ('pending', 'approved', 'onboarded')),
  invite_sent               boolean not null default false,
  invite_sent_at            timestamptz,
  notes                     text
);

alter table public.driver_applications enable row level security;

drop policy if exists "anon read apps"   on public.driver_applications;
drop policy if exists "anon insert apps" on public.driver_applications;
drop policy if exists "service all apps" on public.driver_applications;

create policy "anon insert apps" on public.driver_applications for insert with check (true);
create policy "service all apps" on public.driver_applications for all using (true);

-- ── calendar_events ───────────────────────────────────────────────────────────
create table if not exists public.calendar_events (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title      text not null,
  event_date date not null,
  event_type text not null check (event_type in ('shoot', 'travel', 'fitting', 'meeting', 'other')),
  notes      text
);

alter table public.calendar_events enable row level security;

drop policy if exists "anon read events"   on public.calendar_events;
drop policy if exists "anon insert events" on public.calendar_events;

create policy "anon read events"   on public.calendar_events for select using (true);
create policy "anon insert events" on public.calendar_events for all using (true);

-- ── realtime publications ─────────────────────────────────────────────────────
do $$
begin
  -- chat_messages
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;

  -- driver_applications
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'driver_applications'
  ) then
    alter publication supabase_realtime add table public.driver_applications;
  end if;

  -- calendar_events
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'calendar_events'
  ) then
    alter publication supabase_realtime add table public.calendar_events;
  end if;
end $$;
