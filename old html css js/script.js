const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.course-card');

filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');

    const category = button.dataset.filter;
    cards.forEach(card => {
      const isExtraHidden = card.classList.contains('extra-course') && !document.body.classList.contains('show-all-courses');
      const matches = category === 'all' || card.dataset.category === category;
      card.style.display = matches && !isExtraHidden ? '' : 'none';
    });
  });
});

const showAllBtn = document.getElementById('showAllBtn');
showAllBtn.addEventListener('click', () => {
  document.body.classList.toggle('show-all-courses');
  document.querySelectorAll('.extra-course').forEach(card => card.classList.toggle('hidden'));
  const expanded = document.body.classList.contains('show-all-courses');
  showAllBtn.textContent = expanded ? 'ซ่อนคอร์สเพิ่มเติม ↑' : 'ดูคอร์สทั้งหมด →';

  const activeFilter = document.querySelector('.filter.active');
  activeFilter.click();
});

const modal = document.getElementById('courseModal');
const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};
const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

document.getElementById('previewBtn').addEventListener('click', openModal);
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
