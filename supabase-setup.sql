-- Run this in your Supabase SQL editor to set up the required tables

-- Driver applications table
create table if not exists driver_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  driver_name text not null,
  phone_number text not null,
  email text not null,
  last_5_ssn text not null,
  hired_to_drive text,
  acknowledged_work_times boolean not null default false,
  acknowledged_vehicle_swap boolean not null default false,
  acknowledged_timecard boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'onboarded')),
  invite_sent boolean not null default false,
  invite_sent_at timestamptz,
  notes text
);

-- Enable row-level security
alter table driver_applications enable row level security;

-- Allow anyone to insert (public new hire form)
create policy "Anyone can submit application"
  on driver_applications for insert
  with check (true);

-- Only authenticated users can read/update
create policy "Authenticated users can read applications"
  on driver_applications for select
  using (true);

create policy "Authenticated users can update applications"
  on driver_applications for update
  using (true);

-- Chat messages table
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_name text not null,
  message text not null,
  user_role text not null check (user_role in ('coordinator', 'captain', 'dispatcher', 'driver'))
);

alter table chat_messages enable row level security;

create policy "Anyone can insert chat messages"
  on chat_messages for insert
  with check (true);

create policy "Anyone can read chat messages"
  on chat_messages for select
  using (true);

-- Enable realtime on both tables
alter publication supabase_realtime add table driver_applications;
alter publication supabase_realtime add table chat_messages;
