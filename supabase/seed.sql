-- ============================================================================
-- AgriShare — optional demo seed data
--
-- resources.owner_id and demand_posts.user_id both reference public.users,
-- which only gets a row once someone actually signs up (via the trigger in
-- schema.sql). So this can't be run blind on an empty project — sign up 2-3
-- test accounts through the app first (Signup page), then:
--
--   1. Go to Supabase → Authentication → Users, copy the UUIDs of your test
--      accounts.
--   2. Replace the placeholder UUIDs below with real ones.
--   3. Run this file in the SQL editor.
-- ============================================================================

-- Replace these with real ids from Authentication → Users before running.
-- \set owner_1 'REPLACE-WITH-REAL-UUID'
-- \set owner_2 'REPLACE-WITH-REAL-UUID'

insert into public.resources
  (owner_id, type, category, name, description, quantity, unit, price, price_unit, location, latitude, longitude, available_from, status)
values
  ('REPLACE-WITH-REAL-UUID', 'Tractor', 'machinery', 'Mahindra 575 DI Tractor, 47 HP',
   'Well-maintained 47 HP tractor available for ploughing, tilling and trolley haulage.',
   '2019 model, serviced every season', 'hour', 650, 'per hour', 'Bhinay, Ajmer, Rajasthan',
   26.3762, 74.6399, current_date, 'available'),

  ('REPLACE-WITH-REAL-UUID', 'Wheat Straw (Bhusa)', 'crop_residue', 'Dry Wheat Straw (Bhusa), Baled',
   'Clean, dry wheat straw baled and ready for pickup. Good for cattle fodder or mulching.',
   '50 quintals', 'quintal', 320, 'per quintal', 'Kishangarh, Ajmer, Rajasthan',
   26.5893, 74.8656, current_date, 'available');

insert into public.demand_posts
  (user_id, resource_type, category, quantity, budget, required_date, location, latitude, longitude, status)
values
  ('REPLACE-WITH-REAL-UUID', 'Combine Harvester', 'machinery', '8 acres', '₹2,000–2,500 / acre',
   current_date + interval '5 days', 'Bhinay, Ajmer, Rajasthan', 26.3762, 74.6399, 'open');
