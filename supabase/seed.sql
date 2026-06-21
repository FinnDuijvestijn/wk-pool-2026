-- ============================================================
--  WK Pool 2026 — seed: pre-loaded pool members (group phase)
--  Run AFTER schema.sql. Safe to run more than once.
--
--  These rows are created UNCLAIMED (claimed=false, empty password):
--  they show up in the register dropdown with their group-phase total
--  already filled in. The first person to pick a name + set a password
--  "claims" the account, after which it disappears from the dropdown.
--
--  Admins can adjust group_points per person from the Admin page at any
--  time (even before someone registers), so people see their points the
--  moment they log in.
-- ============================================================

-- The admin (FC Duijf) is already registered as user 'Duijf' — just set the total.
update public.users set group_points = 649 where username = 'Duijf';

insert into public.users (username, password_hash, is_admin, paid, group_points, claimed) values
  ('TeamBVD',                      '', false, false, 791, false),
  ('Taradonna',                    '', false, false, 786, false),
  ('Amberkel',                     '', false, false, 785, false),
  ('adrenaline',                   '', false, false, 785, false),
  ('Carmenkist',                   '', false, false, 777, false),
  ('Koeman medior',                '', false, false, 767, false),
  ('Wilma',                        '', false, false, 764, false),
  ('Joost 006',                    '', false, false, 762, false),
  ('Bixie',                        '', false, false, 740, false),
  ('Rode Duivel incognito',        '', false, false, 739, false),
  ('Rachelli Balotelli',           '', false, false, 738, false),
  ('jelle_master',                 '', false, false, 724, false),
  ('don''t hassle the hoff',       '', false, false, 724, false),
  ('TobiBryant',                   '', false, false, 710, false),
  ('Houtkampie',                   '', false, false, 708, false),
  ('Thurkije',                     '', false, false, 694, false),
  ('PwemmaPoulemaestro',           '', false, false, 663, false),
  ('Reneetjuhgirl',                '', false, false, 657, false),
  ('ANR-WK-anti-expert',           '', false, false, 649, false),
  ('LotjeK',                       '', false, false, 648, false),
  ('Salala',                       '', false, false, 648, false),
  ('Pluijmpie',                    '', false, false, 618, false),
  ('The Defender',                 '', false, false, 565, false),
  ('All Stars',                    '', false, false, 315, false),
  ('De springveer uit Teteringen', '', false, false,   0, false)
on conflict (username) do nothing;
