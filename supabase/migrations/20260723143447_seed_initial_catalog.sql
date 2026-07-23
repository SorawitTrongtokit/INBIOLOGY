begin;

insert into public.instructors (
  name,
  title,
  avatar_url,
  bio,
  experience
)
values (
  'ดร.วิภาวี กิจเจริญ (ครูพี่อิน)',
  'ผู้เชี่ยวชาญด้านชีววิทยา ปริญญาเอก จุฬาฯ',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'ประสบการณ์สอนชีววิทยามากกว่า 10 ปี อดีตตัวแทนโอลิมปิกชีววิทยา เน้นการสอนแบบสร้างภาพจำและความเข้าใจเชิงโครงสร้าง',
  'สอนนักเรียนสอบติดหมอและคณะวิทย์มากกว่า 5,000 คน'
);

insert into public.courses (
  instructor_id,
  code,
  slug,
  title,
  subtitle,
  description,
  category,
  grade_level,
  price,
  original_price,
  tag,
  cover_class,
  art_type,
  highlights,
  duration_minutes,
  is_extra,
  is_popular,
  status,
  published_at
)
values
(
  (select id from public.instructors order by id limit 1),
  'c1',
  'biology-foundations-high-school',
  'ชีววิทยาพื้นฐาน ม.ปลาย',
  'ปูพื้นฐานชีวะ ม.4-ม.6 แน่นปึ้ก',
  'เหมาะสำหรับ ม.4 ที่ต้องการพื้นฐานแน่น เข้าใจกลไกธรรมชาติแบบเชื่อมโยง',
  'basic',
  'ม.4',
  890,
  1290,
  'พื้นฐาน',
  'bg-gradient-to-br from-[#125c3e] to-[#2c7a55]',
  'cell',
  array[
    'ปูพื้นฐานกลไกชีววิทยาตั้งแต่ศูนย์',
    'แผนภาพชีวะสีสันสดใส เข้าใจโครงสร้างเซลล์อย่างรวดเร็ว',
    'มีแบบทดสอบย่อยท้ายบทวิเคราะห์จุดอ่อนรายบุคคล',
    'ดาวน์โหลดไฟล์เอกสาร PDF ประกอบการเรียนฟรี'
  ],
  1440,
  false,
  true,
  'published',
  now()
),
(
  (select id from public.instructors order by id limit 1),
  'c2',
  'biology-exam-tcas',
  'ตะลุยโจทย์ชีวะ ม.ปลาย & TCAS',
  'ตะลุยโจทย์ชีวะ ม.ปลาย และสนามสอบ TCAS',
  'รวมข้อสอบเก่า A-Level, TPAT1 (กสพท) และข้อสอบคัดเลือกย้อนหลัง 10 ปี พร้อมเทคนิคตัดตัวเลือก',
  'exam',
  'ม.ปลาย / TCAS',
  990,
  1490,
  'ยอดนิยม',
  'bg-gradient-to-br from-[#0d4071] to-[#126b8a]',
  'dna',
  array[
    'เจาะลึกแนวข้อสอบ A-Level ชีววิทยาล่าสุด',
    'สูตรลัดและเทคนิคการจำข้อสอบยากใน 30 วินาที',
    'มี Mock Test ลองสอบจริงพร้อมจับเวลาออนไลน์',
    'เฉลยละเอียดทุกข้อแบบเชื่อมโยงบทต่อบท'
  ],
  2100,
  false,
  true,
  'published',
  now()
),
(
  (select id from public.instructors order by id limit 1),
  'c3',
  'genetics-and-dna-technology',
  'เจาะลึกพันธุศาสตร์ & เทคโนโลยี DNA',
  'เข้าใจระบบพันธุกรรม และประยุกต์โจทย์ระดับยาก',
  'เน้นวิเคราะห์โจทย์คำนวณอัตราส่วนพันธุกรรม พันธุศาสตร์ประชากร และชีววิทยายีนระดับโมเลกุล',
  'deep',
  'ม.5',
  790,
  1190,
  'เจาะลึก',
  'bg-gradient-to-br from-[#2e714c] to-[#7d9f4b]',
  'plant',
  array[
    'สูตรการคำนวณ Pedigree และโอกาสเกิดโรคทางพันธุกรรม',
    'อธิบายเทคนิค PCR, Gel Electrophoresis แบบลงลึก',
    'วิเคราะห์โจทย์ประยุกต์ HARD-MODE สำหรับสอบแข่งขัน'
  ],
  1080,
  false,
  false,
  'published',
  now()
),
(
  (select id from public.instructors order by id limit 1),
  'c4',
  'human-body-systems',
  'ระบบต่าง ๆ ในร่างกายมนุษย์',
  'สรุประบบร่างกายแบบเห็นภาพรวมและกลไกโฮมิโอสตาซิส',
  'เจาะลึกระบบหมุนเวียนเลือด ระบบประสาท ต่อมไร้ท่อ ระบบภูมิคุ้มกัน และระบบขับถ่าย',
  'basic',
  'ม.5',
  890,
  1290,
  'แนะนำ',
  'bg-gradient-to-br from-[#f2cf7b] to-[#dd9c5d] text-[#452b1c]',
  'heart',
  array[
    'สรุปแผนภาพการทำงานของหัวใจ หลอดเลือด และระบบประสาท',
    'อธิบายกลไกการหลั่งฮอร์โมนและการรักษาสมดุลร่างกาย',
    'มีภาพ 3D ประกอบความเข้าใจอนาโตมีมนุษย์'
  ],
  1320,
  false,
  false,
  'published',
  now()
),
(
  (select id from public.instructors order by id limit 1),
  'c5',
  'ecology-and-evolution',
  'Ecology & Evolution',
  'นิเวศวิทยา วิวัฒนาการ และพฤติกรรมสัตว์',
  'สรุปเนื้อหานิเวศวิทยา ระบบนิเวศ ประชากรศาสตร์ วิวัฒนาการของสิ่งมีชีวิตและพฤติกรรม',
  'exam',
  'ม.6',
  850,
  1190,
  'ใหม่',
  'bg-gradient-to-br from-[#3f8056] to-[#91b55c]',
  'plant',
  array[
    'สรุปทฤษฎีวิวัฒนาการของชาลส์ ดาร์วิน และ Hardy-Weinberg Law',
    'การวิเคราะห์สายการวิวัฒนาการ (Phylogenetic Tree)',
    'โจทย์คำนวณขนาดประชากรและการรอดชีวิต'
  ],
  1200,
  true,
  false,
  'published',
  now()
),
(
  (select id from public.instructors order by id limit 1),
  'c6',
  'cell-biology-and-biochemistry',
  'Cell Biology & Biochemistry',
  'ชีววิทยาระดับเซลล์และชีวเคมีเชิงลึก',
  'ลงลึกโครงสร้างและกลไกของเซลล์ การขนส่งผ่านเยื่อหุ้มเซลล์ เอนไซม์ และเมแทบอลิซึม',
  'deep',
  'ม.ปลาย / TCAS',
  1090,
  1590,
  'Advanced',
  'bg-gradient-to-br from-[#515a96] to-[#3d7b8c]',
  'micro',
  array[
    'เจาะลึกกระบวนการ Glycolysis, Krebs Cycle & Electron Transport Chain',
    'โครงสร้างสามมิติของเอนไซม์และกลไกการยับยั้ง (Inhibition)',
    'เหมาะสำหรับผู้เตรียมสอบ สอวน. ชีววิทยา และ กสพท.'
  ],
  1680,
  true,
  false,
  'published',
  now()
);

insert into public.course_chapters (course_id, title, position, duration_minutes)
values
  ((select id from public.courses where code = 'c1'), 'บทที่ 1: การศึกษาชีววิทยาและเคมีที่เป็นพื้นฐานของสิ่งมีชีวิต', 1, 270),
  ((select id from public.courses where code = 'c1'), 'บทที่ 2: เซลล์และการทำงานของเซลล์ (Cell Structure & Function)', 2, 375),
  ((select id from public.courses where code = 'c1'), 'บทที่ 3: การสังเคราะห์ด้วยแสงและการเจริญเติบโตของพืช', 3, 345),
  ((select id from public.courses where code = 'c2'), 'ชุดโจทย์ที่ 1: ตะลุยโจทย์พันธุศาสตร์และชีววิทยารุ่นใหม่', 1, 600),
  ((select id from public.courses where code = 'c2'), 'ชุดโจทย์ที่ 2: ตะลุยโจทย์ระบบร่างกายมนุษย์และสัตว์', 2, 720),
  ((select id from public.courses where code = 'c3'), 'บทที่ 1: หลักพันธุศาสตร์ของเมนเดลและส่วนขยาย', 1, 360),
  ((select id from public.courses where code = 'c4'), 'บทที่ 1: ระบบหมุนเวียนเลือดและระบบภูมิคุ้มกัน', 1, 480),
  ((select id from public.courses where code = 'c5'), 'บทที่ 1: ระบบนิเวศและไบโอมต่าง ๆ บนโลก', 1, 300),
  ((select id from public.courses where code = 'c6'), 'บทที่ 1: สรีรวิทยาของเยื่อหุ้มเซลล์และการสื่อสารระหว่างเซลล์', 1, 420);

insert into public.lessons (
  chapter_id,
  title,
  position,
  duration_seconds,
  is_free_preview,
  is_published
)
values
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 1), '1.1 ธรรมชาติของสิ่งมีชีวิตและชีววิทยาน่ารู้', 1, 2700, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 1), '1.2 สารเคมีในสิ่งมีชีวิต: น้ำและแร่ธาตุ', 2, 3000, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 1), '1.3 คาร์โบไฮเดรต โปรตีน ลิพิด และกรดนิวคลีอิก', 3, 4500, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 1), '1.4 ปฏิกิริยาเคมีในเซลล์และเอนไซม์', 4, 6000, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 2), '2.1 โครงสร้างและหน้าที่ของออร์แกเนลล์ต่าง ๆ', 1, 5400, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 2), '2.2 เยื่อหุ้มเซลล์และการลำเลียงสารเข้า-ออกจากเซลล์', 2, 5400, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 2), '2.3 การหายใจระดับเซลล์ (Cellular Respiration)', 3, 7200, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 2), '2.4 การแบ่งเซลล์แบบ Mitosis และ Meiosis', 4, 4500, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 3), '3.1 โครงสร้างของใบและรงควัตถุรับแสง', 1, 3600, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 3), '3.2 ปฏิกิริยาแสง (Light Reaction) และวัฏจักรคาลวิน', 2, 7200, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c1') and position = 3), '3.3 การลำเลียงน้ำ สารอาหาร และฮอร์โมนพืช', 3, 9720, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c2') and position = 1), '1.1 โจทย์การถ่ายทอดลักษณะทางพันธุกรรมตามกฎเมนเดล', 1, 7200, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c2') and position = 1), '1.2 โจทย์เทคโนโลยีทางดีเอ็นเอและพันธุวิศวกรรม', 2, 9000, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c2') and position = 1), '1.3 ตะลุยโจทย์การจำลอง DNA และการสังเคราะห์โปรตีน', 3, 12600, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c2') and position = 2), '2.1 โจทย์ระบบหมุนเวียนเลือดและภูมิคุ้มกัน', 1, 10800, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c2') and position = 2), '2.2 โจทย์ระบบประสาทและอวัยวะรับความรู้สึก', 2, 14400, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c2') and position = 2), '2.3 โจทย์ระบบต่อมไร้ท่อและฮอร์โมนควบคุม', 3, 10800, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c3') and position = 1), '1.1 กฎการรวมกลุ่มอย่างอิสระและการคำนวณจีโนไทป์', 1, 5400, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c3') and position = 1), '1.2 Co-dominance, Incomplete Dominance & Multiple Alleles', 2, 7200, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c3') and position = 1), '1.3 Sex-linked traits & Pedigree Analysis', 3, 9000, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c4') and position = 1), '1.1 โครงสร้างหัวใจ การเต้น และหลอดเลือด', 1, 7200, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c4') and position = 1), '1.2 ส่วนประกอบของเลือดและกลไกการแข็งตัวของเลือด', 2, 7200, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c4') and position = 1), '1.3 ภูมิคุ้มกันแบบดั้งเดิมและแบบจำเพาะ (B-Cell, T-Cell)', 3, 14400, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c5') and position = 1), '1.1 ห่วงโซ่อาหารและสายใยอาหาร (Food Web)', 1, 5400, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c5') and position = 1), '1.2 การหมุนเวียนสาร ไนโตรเจน คาร์บอน ฟอสฟอรัส', 2, 7200, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c5') and position = 1), '1.3 ไบโอมบนบกและไบโอมแหล่งน้ำ', 3, 5400, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c6') and position = 1), '1.1 Fluid Mosaic Model และเยื่อหุ้มเซลล์', 1, 7200, true, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c6') and position = 1), '1.2 Signal Transduction Pathway และ G-Protein', 2, 10800, false, true),
  ((select id from public.course_chapters where course_id = (select id from public.courses where code = 'c6') and position = 1), '1.3 การขนส่งสารแบบ Active Transport & Vesicle', 3, 7200, false, true);

insert into public.articles (
  slug,
  icon,
  category,
  title,
  excerpt,
  status,
  published_at
)
values
  ('dna-replication-memory-guide', 'dna', 'พันธุศาสตร์', 'DNA replication จำอย่างไรให้ไม่สับสน', 'สรุปลำดับขั้นตอนและเอนไซม์สำคัญด้วยภาพจำที่เข้าใจง่าย', 'published', now()),
  ('circulatory-system-in-10-minutes', 'heart-pulse', 'สรีรวิทยา', 'สรุประบบไหลเวียนเลือดใน 10 นาที', 'ทบทวนหัวใจ หลอดเลือด และเส้นทางการไหลเวียนเลือดแบบรวบรัด', 'published', now()),
  ('photosynthesis-from-basics-to-exam', 'leaf', 'พืช', 'Photosynthesis ตั้งแต่พื้นฐานถึงข้อสอบ', 'เชื่อมโยงปฏิกิริยาแสง วัฏจักรคาลวิน และแนวข้อสอบที่พบบ่อย', 'published', now());

commit;
