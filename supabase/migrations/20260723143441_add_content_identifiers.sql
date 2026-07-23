alter table public.courses
add column code text not null unique;

alter table public.courses
add constraint courses_code_format
check (code ~ '^c[0-9]+$');

alter table public.articles
add column icon text not null default 'file-text';
