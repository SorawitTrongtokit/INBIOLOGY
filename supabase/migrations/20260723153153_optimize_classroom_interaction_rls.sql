drop policy lesson_notes_admin_all on public.lesson_notes;
drop policy lesson_notes_select_own on public.lesson_notes;
drop policy lesson_notes_insert_own_with_access on public.lesson_notes;
drop policy lesson_notes_update_own_with_access on public.lesson_notes;
drop policy lesson_notes_delete_own on public.lesson_notes;

create policy lesson_notes_select_owner_or_admin
on public.lesson_notes for select to authenticated
using (
  (select auth.uid()) = user_id
  or (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
);

create policy lesson_notes_insert_owner_or_admin
on public.lesson_notes for insert to authenticated
with check (
  (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  or (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.lessons
      join public.course_chapters on course_chapters.id = lessons.chapter_id
      where lessons.id = lesson_notes.lesson_id
        and (
          lessons.is_free_preview
          or exists (
            select 1 from public.enrollments
            where enrollments.user_id = (select auth.uid())
              and enrollments.course_id = course_chapters.course_id
              and enrollments.status in ('active', 'completed')
              and (enrollments.expires_at is null or enrollments.expires_at > now())
          )
        )
    )
  )
);

create policy lesson_notes_update_owner_or_admin
on public.lesson_notes for update to authenticated
using (
  (select auth.uid()) = user_id
  or (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
)
with check (
  (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  or (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.lessons
      join public.course_chapters on course_chapters.id = lessons.chapter_id
      where lessons.id = lesson_notes.lesson_id
        and (
          lessons.is_free_preview
          or exists (
            select 1 from public.enrollments
            where enrollments.user_id = (select auth.uid())
              and enrollments.course_id = course_chapters.course_id
              and enrollments.status in ('active', 'completed')
              and (enrollments.expires_at is null or enrollments.expires_at > now())
          )
        )
    )
  )
);

create policy lesson_notes_delete_owner_or_admin
on public.lesson_notes for delete to authenticated
using (
  (select auth.uid()) = user_id
  or (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
);

drop policy lesson_questions_admin_all on public.lesson_questions;
drop policy lesson_questions_select_own on public.lesson_questions;
drop policy lesson_questions_insert_own_with_access on public.lesson_questions;
drop policy lesson_questions_delete_pending_own on public.lesson_questions;

create policy lesson_questions_select_owner_or_admin
on public.lesson_questions for select to authenticated
using (
  (select auth.uid()) = user_id
  or (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
);

create policy lesson_questions_insert_owner_or_admin
on public.lesson_questions for insert to authenticated
with check (
  (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  or (
    (select auth.uid()) = user_id
    and exists (
      select 1
      from public.lessons
      join public.course_chapters on course_chapters.id = lessons.chapter_id
      where lessons.id = lesson_questions.lesson_id
        and (
          lessons.is_free_preview
          or exists (
            select 1 from public.enrollments
            where enrollments.user_id = (select auth.uid())
              and enrollments.course_id = course_chapters.course_id
              and enrollments.status in ('active', 'completed')
              and (enrollments.expires_at is null or enrollments.expires_at > now())
          )
        )
    )
  )
);

create policy lesson_questions_update_admin
on public.lesson_questions for update to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy lesson_questions_delete_owner_or_admin
on public.lesson_questions for delete to authenticated
using (
  (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  or ((select auth.uid()) = user_id and status = 'pending')
);
