create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service text not null check (service in ('Power Wash')),
  service_date date not null,
  service_time text not null,
  name text not null,
  phone text not null,
  address text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- Public booking form can create requests, but can't read anyone's data back.
create policy "Anyone can submit a booking"
  on public.bookings
  for insert
  to anon
  with check (true);
