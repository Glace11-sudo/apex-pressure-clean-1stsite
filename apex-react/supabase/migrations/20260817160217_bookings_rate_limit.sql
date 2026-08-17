-- Caps booking submissions to 3 per phone number per calendar day.
-- Enforced in the database (not just the frontend) so it can't be bypassed
-- by calling the Supabase API directly.
create or replace function public.enforce_booking_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submissions_today integer;
begin
  select count(*) into submissions_today
  from public.bookings
  where phone = new.phone
    and created_at >= date_trunc('day', now())
    and created_at < date_trunc('day', now()) + interval '1 day';

  if submissions_today >= 3 then
    raise exception 'You have reached the daily limit of 3 booking requests for this phone number. Please call us directly at 443-351-8124.';
  end if;

  return new;
end;
$$;

create trigger bookings_rate_limit
  before insert on public.bookings
  for each row
  execute function public.enforce_booking_rate_limit();
