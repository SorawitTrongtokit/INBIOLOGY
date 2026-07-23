begin;

set local lock_timeout = '10s';
set local statement_timeout = '120s';

create schema if not exists private;
revoke all on schema private from public;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  grade_level text,
  school text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 150),
  constraint profiles_phone_format check (
    phone is null or phone ~ '^[0-9+() -]{8,20}$'
  ),
  constraint profiles_grade_level_valid check (
    grade_level is null
    or grade_level in ('ม.4', 'ม.5', 'ม.6', 'ม.ปลาย / TCAS')
  )
);

create table public.instructors (
  id bigint generated always as identity primary key,
  name text not null,
  title text not null default '',
  avatar_url text,
  bio text not null default '',
  experience text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint instructors_name_not_blank check (char_length(trim(name)) > 0)
);

create table public.courses (
  id bigint generated always as identity primary key,
  instructor_id bigint not null references public.instructors (id) on delete restrict,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category text not null,
  grade_level text not null,
  price numeric(10, 2) not null default 0,
  original_price numeric(10, 2),
  tag text not null default '',
  cover_class text not null default '',
  art_type text not null default 'cell',
  highlights text[] not null default '{}',
  duration_minutes integer not null default 0,
  is_extra boolean not null default false,
  is_popular boolean not null default false,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint courses_title_not_blank check (char_length(trim(title)) > 0),
  constraint courses_category_valid check (category in ('basic', 'exam', 'deep')),
  constraint courses_grade_level_valid check (
    grade_level in ('ม.4', 'ม.5', 'ม.6', 'ม.ปลาย / TCAS')
  ),
  constraint courses_price_nonnegative check (price >= 0),
  constraint courses_original_price_valid check (
    original_price is null or original_price >= price
  ),
  constraint courses_art_type_valid check (
    art_type in ('cell', 'dna', 'plant', 'heart', 'micro')
  ),
  constraint courses_duration_nonnegative check (duration_minutes >= 0),
  constraint courses_status_valid check (status in ('draft', 'published', 'archived')),
  constraint courses_published_at_required check (
    status <> 'published' or published_at is not null
  )
);

create table public.course_chapters (
  id bigint generated always as identity primary key,
  course_id bigint not null references public.courses (id) on delete cascade,
  title text not null,
  position integer not null,
  duration_minutes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_chapters_title_not_blank check (char_length(trim(title)) > 0),
  constraint course_chapters_position_positive check (position > 0),
  constraint course_chapters_duration_nonnegative check (duration_minutes >= 0),
  constraint course_chapters_course_position_unique unique (course_id, position)
);

create table public.lessons (
  id bigint generated always as identity primary key,
  chapter_id bigint not null references public.course_chapters (id) on delete cascade,
  title text not null,
  description text not null default '',
  position integer not null,
  duration_seconds integer not null default 0,
  is_free_preview boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_title_not_blank check (char_length(trim(title)) > 0),
  constraint lessons_position_positive check (position > 0),
  constraint lessons_duration_nonnegative check (duration_seconds >= 0),
  constraint lessons_chapter_position_unique unique (chapter_id, position)
);

create table public.lesson_assets (
  lesson_id bigint primary key references public.lessons (id) on delete cascade,
  video_storage_path text,
  document_storage_path text,
  updated_at timestamptz not null default now(),
  constraint lesson_assets_has_asset check (
    video_storage_path is not null or document_storage_path is not null
  ),
  constraint lesson_assets_video_path_not_blank check (
    video_storage_path is null or char_length(trim(video_storage_path)) > 0
  ),
  constraint lesson_assets_document_path_not_blank check (
    document_storage_path is null or char_length(trim(document_storage_path)) > 0
  )
);

create table public.enrollments (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id bigint not null references public.courses (id) on delete cascade,
  status text not null default 'active',
  amount_paid numeric(10, 2) not null default 0,
  enrolled_at timestamptz not null default now(),
  expires_at timestamptz,
  completed_at timestamptz,
  primary key (user_id, course_id),
  constraint enrollments_status_valid check (
    status in ('active', 'completed', 'cancelled', 'refunded')
  ),
  constraint enrollments_amount_nonnegative check (amount_paid >= 0),
  constraint enrollments_expiry_valid check (
    expires_at is null or expires_at > enrolled_at
  ),
  constraint enrollments_completion_valid check (
    status <> 'completed' or completed_at is not null
  )
);

create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id bigint not null references public.lessons (id) on delete cascade,
  position_seconds integer not null default 0,
  is_completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, lesson_id),
  constraint lesson_progress_position_nonnegative check (position_seconds >= 0),
  constraint lesson_progress_completion_valid check (
    (is_completed and completed_at is not null)
    or (not is_completed and completed_at is null)
  )
);

create table public.course_reviews (
  id bigint generated always as identity primary key,
  course_id bigint not null references public.courses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null,
  review_text text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_reviews_rating_valid check (rating between 1 and 5),
  constraint course_reviews_text_length check (
    char_length(trim(review_text)) between 10 and 2000
  ),
  constraint course_reviews_status_valid check (
    status in ('pending', 'published', 'rejected')
  ),
  constraint course_reviews_user_course_unique unique (user_id, course_id)
);

create table public.articles (
  id bigint generated always as identity primary key,
  slug text not null unique,
  category text not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint articles_title_not_blank check (char_length(trim(title)) > 0),
  constraint articles_status_valid check (status in ('draft', 'published', 'archived')),
  constraint articles_published_at_required check (
    status <> 'published' or published_at is not null
  )
);

create index courses_instructor_id_idx on public.courses (instructor_id);
create index courses_published_category_idx
  on public.courses (category, published_at desc)
  where status = 'published';
create index courses_published_grade_idx
  on public.courses (grade_level, published_at desc)
  where status = 'published';
create index course_chapters_course_id_idx on public.course_chapters (course_id);
create index lessons_chapter_id_idx on public.lessons (chapter_id);
create index enrollments_course_id_idx on public.enrollments (course_id);
create index enrollments_user_status_idx on public.enrollments (user_id, status);
create index lesson_progress_lesson_id_idx on public.lesson_progress (lesson_id);
create index course_reviews_course_status_created_idx
  on public.course_reviews (course_id, status, created_at desc);
create index course_reviews_user_id_idx on public.course_reviews (user_id);
create index articles_published_at_idx
  on public.articles (published_at desc)
  where status = 'published';

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger instructors_set_updated_at
before update on public.instructors
for each row execute function private.set_updated_at();

create trigger courses_set_updated_at
before update on public.courses
for each row execute function private.set_updated_at();

create trigger course_chapters_set_updated_at
before update on public.course_chapters
for each row execute function private.set_updated_at();

create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function private.set_updated_at();

create trigger lesson_assets_set_updated_at
before update on public.lesson_assets
for each row execute function private.set_updated_at();

create trigger course_reviews_set_updated_at
before update on public.course_reviews
for each row execute function private.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone, grade_level)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'grade_level', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

insert into public.profiles (id, full_name, phone, grade_level)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', ''),
  nullif(raw_user_meta_data ->> 'phone', ''),
  nullif(raw_user_meta_data ->> 'grade_level', '')
from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.courses enable row level security;
alter table public.course_chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_assets enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.course_reviews enable row level security;
alter table public.articles enable row level security;

create policy profiles_select_own
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy profiles_update_own
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy profiles_admin_all
on public.profiles for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy instructors_public_read_active
on public.instructors for select
to anon, authenticated
using (is_active);

create policy instructors_admin_all
on public.instructors for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy courses_public_read_published
on public.courses for select
to anon, authenticated
using (status = 'published');

create policy courses_admin_all
on public.courses for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy course_chapters_public_read
on public.course_chapters for select
to anon, authenticated
using (
  exists (
    select 1
    from public.courses
    where courses.id = course_chapters.course_id
      and courses.status = 'published'
  )
);

create policy course_chapters_admin_all
on public.course_chapters for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy lessons_public_read
on public.lessons for select
to anon, authenticated
using (
  is_published
  and exists (
    select 1
    from public.course_chapters
    join public.courses on courses.id = course_chapters.course_id
    where course_chapters.id = lessons.chapter_id
      and courses.status = 'published'
  )
);

create policy lessons_admin_all
on public.lessons for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy lesson_assets_read_with_access
on public.lesson_assets for select
to anon, authenticated
using (
  exists (
    select 1
    from public.lessons
    join public.course_chapters on course_chapters.id = lessons.chapter_id
    join public.courses on courses.id = course_chapters.course_id
    where lessons.id = lesson_assets.lesson_id
      and lessons.is_published
      and courses.status = 'published'
      and (
        lessons.is_free_preview
        or exists (
          select 1
          from public.enrollments
          where enrollments.user_id = (select auth.uid())
            and enrollments.course_id = courses.id
            and enrollments.status in ('active', 'completed')
            and (
              enrollments.expires_at is null
              or enrollments.expires_at > now()
            )
        )
      )
  )
);

create policy lesson_assets_admin_all
on public.lesson_assets for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy enrollments_select_own
on public.enrollments for select
to authenticated
using ((select auth.uid()) = user_id);

create policy enrollments_admin_all
on public.enrollments for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy lesson_progress_select_own
on public.lesson_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy lesson_progress_insert_own_with_access
on public.lesson_progress for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.lessons
    join public.course_chapters on course_chapters.id = lessons.chapter_id
    where lessons.id = lesson_progress.lesson_id
      and (
        lessons.is_free_preview
        or exists (
          select 1
          from public.enrollments
          where enrollments.user_id = (select auth.uid())
            and enrollments.course_id = course_chapters.course_id
            and enrollments.status in ('active', 'completed')
            and (
              enrollments.expires_at is null
              or enrollments.expires_at > now()
            )
        )
      )
  )
);

create policy lesson_progress_update_own_with_access
on public.lesson_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.lessons
    join public.course_chapters on course_chapters.id = lessons.chapter_id
    where lessons.id = lesson_progress.lesson_id
      and (
        lessons.is_free_preview
        or exists (
          select 1
          from public.enrollments
          where enrollments.user_id = (select auth.uid())
            and enrollments.course_id = course_chapters.course_id
            and enrollments.status in ('active', 'completed')
            and (
              enrollments.expires_at is null
              or enrollments.expires_at > now()
            )
        )
      )
  )
);

create policy lesson_progress_delete_own
on public.lesson_progress for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy lesson_progress_admin_all
on public.lesson_progress for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy course_reviews_public_read_published
on public.course_reviews for select
to anon, authenticated
using (status = 'published');

create policy course_reviews_select_own
on public.course_reviews for select
to authenticated
using ((select auth.uid()) = user_id);

create policy course_reviews_insert_own_enrolled
on public.course_reviews for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
  and exists (
    select 1
    from public.enrollments
    where enrollments.user_id = (select auth.uid())
      and enrollments.course_id = course_reviews.course_id
      and enrollments.status in ('active', 'completed')
  )
);

create policy course_reviews_update_own_pending
on public.course_reviews for update
to authenticated
using ((select auth.uid()) = user_id and status = 'pending')
with check ((select auth.uid()) = user_id and status = 'pending');

create policy course_reviews_delete_own_pending
on public.course_reviews for delete
to authenticated
using ((select auth.uid()) = user_id and status = 'pending');

create policy course_reviews_admin_all
on public.course_reviews for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy articles_public_read_published
on public.articles for select
to anon, authenticated
using (status = 'published');

create policy articles_admin_all
on public.articles for all
to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant usage on schema public to anon, authenticated;

grant select on table
  public.instructors,
  public.courses,
  public.course_chapters,
  public.lessons,
  public.lesson_assets,
  public.course_reviews,
  public.articles
to anon;

grant select on table
  public.profiles,
  public.instructors,
  public.courses,
  public.course_chapters,
  public.lessons,
  public.lesson_assets,
  public.enrollments,
  public.lesson_progress,
  public.course_reviews,
  public.articles
to authenticated;

grant update on table public.profiles to authenticated;
grant insert, update, delete on table public.lesson_progress to authenticated;
grant insert, update, delete on table public.course_reviews to authenticated;

grant insert, update, delete on table
  public.instructors,
  public.courses,
  public.course_chapters,
  public.lessons,
  public.lesson_assets,
  public.enrollments,
  public.articles
to authenticated;

grant usage, select on all sequences in schema public to authenticated;

commit;
