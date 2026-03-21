alter table if exists public.user_progress
  alter column completed_lesson_ids type text[]
  using (
    case
      when completed_lesson_ids is null then '{}'::text[]
      else array(
        select value::text
        from unnest(completed_lesson_ids) as value
      )
    end
  );

alter table if exists public.user_progress
  alter column completed_lesson_ids set default '{}'::text[];

alter table if exists public.user_progress
  alter column last_opened_lesson_id type text
  using (
    case
      when last_opened_lesson_id is null then null
      else last_opened_lesson_id::text
    end
  );

update public.user_progress
set total_xp = coalesce(array_length(completed_lesson_ids, 1), 0) * 10;

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
