alter table if exists public.user_progress
add column if not exists total_xp integer not null default 0;

update public.user_progress
set total_xp = greatest(
  total_xp,
  coalesce(array_length(completed_lesson_ids, 1), 0) * 10
);

create or replace view public.leaderboard_entries as
select
  row_number() over (
    order by up.total_xp desc, up.streak_count desc, up.updated_at asc, up.user_id asc
  )::integer as rank,
  up.user_id,
  up.nickname,
  up.total_xp,
  up.streak_count,
  coalesce(array_length(up.completed_lesson_ids, 1), 0)::integer as completed_lessons,
  up.updated_at
from public.user_progress up
where up.total_xp > 0;

grant select on public.leaderboard_entries to authenticated;
