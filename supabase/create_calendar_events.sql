-- Run this in your Supabase SQL editor to enable the Production Calendar

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  event_date date not null,
  event_type text not null check (event_type in ('shoot', 'travel', 'fitting', 'meeting', 'other')),
  notes text
);

-- Enable Row Level Security
alter table public.calendar_events enable row level security;

-- Allow anyone with anon key to read events
create policy "Public read" on public.calendar_events
  for select using (true);

-- Allow authenticated users or service role to insert/update/delete
create policy "Service write" on public.calendar_events
  for all using (true);

-- Enable realtime
alter publication supabase_realtime add table public.calendar_events;
