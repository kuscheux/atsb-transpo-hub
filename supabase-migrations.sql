-- Run these in the Supabase SQL editor for project bfuasmjhcfzhcwfoqgvf
-- https://supabase.com/dashboard/project/bfuasmjhcfzhcwfoqgvf/sql

-- ── 0. Storage bucket for Mixamo FBX animations ───────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('animations', 'animations', true, 52428800, null)
on conflict (id) do nothing;

-- Public read policy (anyone can download animations)
create policy "Public read animations" on storage.objects
  for select using (bucket_id = 'animations');

-- Authenticated upload (coordinators/captains can add new animations)
create policy "Authenticated upload animations" on storage.objects
  for insert with check (
    bucket_id = 'animations' and auth.role() = 'authenticated'
  );

-- ── 0b. Storage buckets for uploads ─────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('chat-photos', 'chat-photos', true, 10485760)   -- 10 MB limit
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit)
values ('license-photos', 'license-photos', false, 20971520)  -- 20 MB, private
on conflict (id) do nothing;

create policy "Public read chat photos" on storage.objects
  for select using (bucket_id = 'chat-photos');
create policy "Auth upload chat photos" on storage.objects
  for insert with check (bucket_id = 'chat-photos' and auth.role() = 'authenticated');

create policy "Auth read license photos" on storage.objects
  for select using (bucket_id = 'license-photos' and auth.role() = 'authenticated');
create policy "Anon upload license photos" on storage.objects
  for insert with check (bucket_id = 'license-photos');

-- ── 0c. New columns ───────────────────────────────────────────────────────────
alter table public.chat_messages
  add column if not exists image_url text;

alter table public.driver_applications
  add column if not exists license_front_url text,
  add column if not exists license_back_url  text;

-- ── 1. Chat DM support ────────────────────────────────────────────────────────
alter table public.chat_messages
  add column if not exists user_id       uuid references auth.users(id),
  add column if not exists recipient_id  uuid references auth.users(id);

-- ── 2. Role permissions (RBAC toggles) ───────────────────────────────────────
create table if not exists public.role_permissions (
  role    text    not null,
  section text    not null,
  allowed boolean not null default true,
  primary key (role, section)
);
alter table public.role_permissions enable row level security;

drop policy if exists "coords manage perms" on public.role_permissions;
create policy "coords manage perms" on public.role_permissions
  for all using (
    exists(
      select 1 from public.profiles
      where id = auth.uid() and user_role in ('coordinator','captain')
    )
  );

insert into public.role_permissions (role, section, allowed) values
  ('captain',    'transpo',      true),
  ('captain',    'apps',         true),
  ('captain',    'union_portal', true),
  ('dispatcher', 'transpo',      true),
  ('dispatcher', 'apps',         false),
  ('dispatcher', 'union_portal', true),
  ('driver',     'transpo',      false),
  ('driver',     'apps',         false),
  ('driver',     'union_portal', true)
on conflict do nothing;

-- ── 3. AI knowledge base ──────────────────────────────────────────────────────
create table if not exists public.knowledge_items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text not null,
  category   text not null default 'general',
  created_at timestamptz default now()
);
alter table public.knowledge_items enable row level security;

create policy "authenticated read knowledge" on public.knowledge_items
  for select using (auth.role() = 'authenticated');
create policy "coordinators manage knowledge" on public.knowledge_items
  for all using (
    exists(
      select 1 from public.profiles
      where id = auth.uid() and user_role in ('coordinator','captain')
    )
  );

-- ── 4. External integrations tokens ──────────────────────────────────────────
create table if not exists public.user_integrations (
  user_id       uuid references auth.users(id) on delete cascade not null,
  provider      text not null,
  access_token  text,
  refresh_token text,
  expires_at    timestamptz,
  primary key (user_id, provider)
);
alter table public.user_integrations enable row level security;
create policy "own integrations" on public.user_integrations
  for all using (auth.uid() = user_id);
