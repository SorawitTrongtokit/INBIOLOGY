create table public.lesson_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  constraint lesson_notes_content_length check (char_length(content) <= 20000)
);

create index lesson_notes_lesson_id_idx on public.lesson_notes (lesson_id);

create trigger lesson_notes_set_updated_at
before update on public.lesson_notes
for each row execute function private.set_updated_at();

alter table public.lesson_notes enable row level security;

create policy lesson_notes_admin_all
on public.lesson_notes
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy lesson_notes_select_own
on public.lesson_notes
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy lesson_notes_insert_own_with_access
on public.lesson_notes
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.lessons
    join public.course_chapters on course_chapters.id = lessons.chapter_id
    where lessons.id = lesson_notes.lesson_id
      and (
        lessons.is_free_preview
        or exists (
          select 1
          from public.enrollments
          where enrollments.user_id = (select auth.uid())
            and enrollments.course_id = course_chapters.course_id
            and enrollments.status in ('active', 'completed')
            and (enrollments.expires_at is null or enrollments.expires_at > now())
        )
      )
  )
);

create policy lesson_notes_update_own_with_access
on public.lesson_notes
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.lessons
    join public.course_chapters on course_chapters.id = lessons.chapter_id
    where lessons.id = lesson_notes.lesson_id
      and (
        lessons.is_free_preview
        or exists (
          select 1
          from public.enrollments
          where enrollments.user_id = (select auth.uid())
            and enrollments.course_id = course_chapters.course_id
            and enrollments.status in ('active', 'completed')
            and (enrollments.expires_at is null or enrollments.expires_at > now())
        )
      )
  )
);

create policy lesson_notes_delete_own
on public.lesson_notes
for delete
to authenticated
using ((select auth.uid()) = user_id);

create table public.lesson_questions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id bigint not null references public.lessons(id) on delete cascade,
  question text not null,
  answer text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  answered_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint lesson_questions_question_length
    check (char_length(trim(question)) between 5 and 2000),
  constraint lesson_questions_answer_length
    check (answer is null or char_length(answer) <= 5000),
  constraint lesson_questions_status_check
    check (status in ('pending', 'answered', 'closed'))
);

create index lesson_questions_user_created_idx
on public.lesson_questions (user_id, created_at desc);

create index lesson_questions_lesson_created_idx
on public.lesson_questions (lesson_id, created_at desc);

create trigger lesson_questions_set_updated_at
before update on public.lesson_questions
for each row execute function private.set_updated_at();

alter table public.lesson_questions enable row level security;

create policy lesson_questions_admin_all
on public.lesson_questions
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

create policy lesson_questions_select_own
on public.lesson_questions
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy lesson_questions_insert_own_with_access
on public.lesson_questions
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.lessons
    join public.course_chapters on course_chapters.id = lessons.chapter_id
    where lessons.id = lesson_questions.lesson_id
      and (
        lessons.is_free_preview
        or exists (
          select 1
          from public.enrollments
          where enrollments.user_id = (select auth.uid())
            and enrollments.course_id = course_chapters.course_id
            and enrollments.status in ('active', 'completed')
            and (enrollments.expires_at is null or enrollments.expires_at > now())
        )
      )
  )
);

create policy lesson_questions_delete_pending_own
on public.lesson_questions
for delete
to authenticated
using ((select auth.uid()) = user_id and status = 'pending');
