-- Auth migration — run in Supabase SQL editor on project bfuasmjhcfzhcwfoqgvf

-- ─────────────────────────────────────────
-- 1. Profiles table
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  user_name text not null,
  user_role text not null default 'coordinator'
    check (user_role in ('coordinator','captain','dispatcher','driver')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "service role manage profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- Add to realtime
alter publication supabase_realtime add table public.profiles;

-- ─────────────────────────────────────────
-- 2. Auto-create profile on signup
-- ─────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, user_name, user_role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'user_role', 'coordinator')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- 3. Tighten RLS — chat_messages
-- ─────────────────────────────────────────
drop policy if exists "Anyone can insert chat messages" on public.chat_messages;
drop policy if exists "Anyone can read chat messages" on public.chat_messages;

create policy "Authenticated users can read chat"
  on public.chat_messages for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert chat"
  on public.chat_messages for insert
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- 4. Tighten RLS — calendar_events
-- ─────────────────────────────────────────
-- If calendar_events table exists, tighten its policies.
-- (If not yet created, the original supabase-setup.sql handles it.)
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'calendar_events') then
    -- Drop any existing open policies
    execute 'drop policy if exists "Anyone can read calendar events" on public.calendar_events';
    execute 'drop policy if exists "Anyone can insert calendar events" on public.calendar_events';
    execute 'drop policy if exists "Anyone can update calendar events" on public.calendar_events';

    execute $p$
      create policy "Authenticated users can manage calendar"
        on public.calendar_events for all
        using (auth.role() = 'authenticated')
        with check (auth.role() = 'authenticated')
    $p$;
  end if;
end;
$$;

-- ─────────────────────────────────────────
-- 5. Tighten RLS — driver_applications
-- ─────────────────────────────────────────
-- Keep anon INSERT (public hire form), tighten SELECT + UPDATE to authenticated.
drop policy if exists "Authenticated users can read applications" on public.driver_applications;
drop policy if exists "Authenticated users can update applications" on public.driver_applications;

create policy "Authenticated users can read applications"
  on public.driver_applications for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update applications"
  on public.driver_applications for update
  using (auth.role() = 'authenticated');

-- "Anyone can submit application" INSERT policy stays untouched.
