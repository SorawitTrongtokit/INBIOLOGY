alter table public.profiles
  add column if not exists email text;

update public.profiles as profile
set email = auth_user.email
from auth.users as auth_user
where auth_user.id = profile.id
  and profile.email is distinct from auth_user.email;

create unique index if not exists profiles_email_lower_unique_idx
  on public.profiles (lower(email))
  where email is not null;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.profiles (id, email, full_name, phone, grade_level)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'grade_level', '')
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$function$;

revoke all privileges on public.profiles from anon;
revoke insert, delete, truncate, references, trigger, update
  on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone, grade_level, school, avatar_url, updated_at)
  on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'course-videos',
    'course-videos',
    false,
    2147483648,
    array['video/mp4', 'video/webm', 'video/quicktime']
  ),
  (
    'course-documents',
    'course-documents',
    false,
    52428800,
    array['application/pdf']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists course_assets_select_authorized on storage.objects;
drop policy if exists course_assets_insert_admin on storage.objects;
drop policy if exists course_assets_update_admin on storage.objects;
drop policy if exists course_assets_delete_admin on storage.objects;

create policy course_assets_select_authorized
on storage.objects
for select
to authenticated
using (
  bucket_id in ('course-videos', 'course-documents')
  and name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
  and (
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    or exists (
      select 1
      from public.enrollments as enrollment
      where enrollment.user_id = (select auth.uid())
        and enrollment.course_id = (
          case
            when storage.objects.name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
              then ((storage.foldername(storage.objects.name))[2])::bigint
            else null
          end
        )
        and enrollment.status in ('active', 'completed')
        and (enrollment.expires_at is null or enrollment.expires_at > now())
    )
    or exists (
      select 1
      from public.lessons as lesson
      join public.course_chapters as chapter on chapter.id = lesson.chapter_id
      where lesson.id = (
          case
            when storage.objects.name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
              then ((storage.foldername(storage.objects.name))[4])::bigint
            else null
          end
        )
        and chapter.course_id = (
          case
            when storage.objects.name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
              then ((storage.foldername(storage.objects.name))[2])::bigint
            else null
          end
        )
        and lesson.is_free_preview
        and lesson.is_published
    )
  )
);

create policy course_assets_insert_admin
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('course-videos', 'course-documents')
  and name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy course_assets_update_admin
on storage.objects
for update
to authenticated
using (
  bucket_id in ('course-videos', 'course-documents')
  and name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
)
with check (
  bucket_id in ('course-videos', 'course-documents')
  and name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);

create policy course_assets_delete_admin
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('course-videos', 'course-documents')
  and name ~ '^courses/[0-9]+/lessons/[0-9]+/[^/]+$'
  and ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
);
