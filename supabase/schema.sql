create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated;

create table if not exists private.admin_allowlist (
  email text primary key check (email = lower(email))
);
revoke all on private.admin_allowlist from public, anon, authenticated;

insert into private.admin_allowlist (email)
values ('shreegangafiresafety@gmail.com')
on conflict (email) do nothing;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.admin_allowlist
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

create table if not exists public.site_settings (
  key text primary key check (key = 'main'),
  customers_served integer not null default 12 check (customers_served between 0 and 1000000)
);
insert into public.site_settings (key, customers_served) values ('main', 12)
on conflict (key) do nothing;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  category text not null check (char_length(category) between 1 and 80),
  alt text not null check (char_length(alt) between 1 and 240),
  image_url text not null,
  storage_path text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists projects_published_order_idx on public.projects (published, sort_order);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  venue text not null check (char_length(venue) between 1 and 120),
  customer text not null check (char_length(customer) between 1 and 100),
  rating numeric(2,1) not null check (rating between 0.5 and 5 and rating * 2 = trunc(rating * 2)),
  location text check (location is null or char_length(location) <= 100),
  feedback_before text not null check (char_length(feedback_before) <= 220),
  feedback_highlight text not null check (char_length(feedback_highlight) between 1 and 180),
  feedback_after text not null check (char_length(feedback_after) <= 220),
  published boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists reviews_published_created_idx on public.reviews (published, created_at desc);

alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.reviews enable row level security;
revoke all on public.site_settings, public.projects, public.reviews from anon, authenticated;
grant select on public.site_settings, public.projects, public.reviews to anon, authenticated;
grant insert, update, delete on public.site_settings, public.projects, public.reviews to authenticated;

create policy "Public can read site settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "Admin manages site settings" on public.site_settings
  for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public reads published projects" on public.projects
  for select to anon, authenticated using (published);
create policy "Admin manages projects" on public.projects
  for all to authenticated using (private.is_admin()) with check (private.is_admin());
create policy "Public reads published reviews" on public.reviews
  for select to anon, authenticated using (published);
create policy "Admin manages reviews" on public.reviews
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

insert into public.projects (title, category, alt, image_url, sort_order) values
  ('Indoor fire hose reel and cabinet', 'Firefighting equipment', 'Wall-mounted red fire hose reel and fire hose cabinet in an indoor facility', '/images/projects/fire-safety-equipment.webp', 0),
  ('Building entrance fire safety system', 'Hose reel & pipework', 'Red fire hose reel, cabinet and firefighting pipework beside a building entrance', '/images/projects/building-entrance-system.webp', 1),
  ('Outdoor hose reel installation', 'Hose reel & pipework', 'Outdoor fire hose reel and red riser connected to a pipeline in a landscaped area', '/images/projects/outdoor-hose-reel.webp', 2),
  ('Indoor hose reel and pipework', 'Hose reel & pipework', 'Red indoor fire hose reel connected to a horizontal firefighting pipe and valve', '/images/projects/indoor-hose-reel.webp', 3),
  ('Outdoor reel and pipeline connection', 'Hose reel & pipework', 'Outdoor red fire hose reel riser with a firefighting pipeline running underground', '/images/projects/outdoor-hose-reel-pipeline.webp', 4),
  ('Firefighting pipeline installation', 'Pipeline installation', 'Firefighting pipeline laid through an open trench beside a landscaped walkway', '/images/projects/trench-pipeline-installation.webp', 5),
  ('Fire pump and water storage', 'Pump & water storage', 'Red fire pump and pipework connected to a ribbed water storage tank', '/images/projects/fire-pump-water-tank.webp', 6)
on conflict do nothing;

insert into public.reviews (venue, customer, rating, location, feedback_before, feedback_highlight, feedback_after) values
  ('Ashirwad Resort', 'Ramnivas', 4.5, 'Baghpat', 'Noted the ', 'fair, affordable price', ' for the work.'),
  ('Sarita Garden', 'Denash Chauhan', 4.5, 'Baghpat', 'Was happy with the ', 'quality of the work', ' and its neat finish.'),
  ('Eicher Agency', 'Mukesh Goel', 5, 'Delhi', 'Appreciated the ', 'good-quality fittings', ' used in the installation.'),
  ('Kusum Banquet', 'Ashish Rathi', 5, 'Janshat Road', 'Was pleased with the ', 'neat finishing', ' of the completed work.'),
  ('Pyare Lal Mandap', 'Navneet Sharma', 4, 'Delhi', 'Valued that the work was ', 'completed on time', '.'),
  ('DAV Hospital', 'Rakhi', 5, 'Lucknow', 'Appreciated the ', 'quality workmanship', ' and good fittings.'),
  ('Chauhan Banquet', 'Kuldeep Chauhan', 4.5, 'Delhi', 'Found the pricing ', 'reasonable and affordable', ' for the project.'),
  ('The Elite Hotel', 'Vipin Nain', 5, 'Lucknow', 'Liked the ', 'quality fittings', ' and clean finish.'),
  ('Jyoti Nursing', 'Mohd Azam', 4, 'Lucknow', 'Recognised the ', 'on-time completion', ' and quality of the work.')
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-photos', 'project-photos', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads project photos" on storage.objects
  for select to anon, authenticated using (bucket_id = 'project-photos');
create policy "Admin uploads project photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'project-photos' and private.is_admin());
create policy "Admin updates project photos" on storage.objects
  for update to authenticated using (bucket_id = 'project-photos' and private.is_admin()) with check (bucket_id = 'project-photos' and private.is_admin());
create policy "Admin deletes project photos" on storage.objects
  for delete to authenticated using (bucket_id = 'project-photos' and private.is_admin());
