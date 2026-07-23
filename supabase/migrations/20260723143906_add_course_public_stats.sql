begin;

set local lock_timeout = '10s';
set local statement_timeout = '30s';

alter table public.courses
add column rating_average numeric(2, 1) not null default 0
  check (rating_average between 0 and 5),
add column reviews_count integer not null default 0
  check (reviews_count >= 0),
add column students_count integer not null default 0
  check (students_count >= 0);

update public.courses
set
  rating_average = course_stats.rating_average,
  reviews_count = course_stats.reviews_count,
  students_count = course_stats.students_count
from (
  values
    ('c1', 4.9::numeric, 328, 2450),
    ('c2', 5.0::numeric, 512, 3890),
    ('c3', 4.8::numeric, 189, 1620),
    ('c4', 4.9::numeric, 240, 1980),
    ('c5', 4.8::numeric, 145, 1210),
    ('c6', 4.9::numeric, 290, 2100)
) as course_stats(code, rating_average, reviews_count, students_count)
where public.courses.code = course_stats.code;

commit;
