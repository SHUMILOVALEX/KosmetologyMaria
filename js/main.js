/* =========================================================
   PURA SKIN STUDIO — общий скрипт для всех страниц
   =========================================================
   ЧТО МЕНЯТЬ ПРИ ЗАПОЛНЕНИИ САЙТА СВОИМИ ДАННЫМИ:
   Правьте только объект CONFIG ниже — имя, город, телефон,
   соцсети и часы работы обновятся сразу на всех страницах,
   везде где стоит атрибут data-cfg="..." или data-cfg-href="...".
   ========================================================= */

const CONFIG = {
  studioName:   'PURA SKIN STUDIO',
  masterName:   'Мария Шумилова',
  specialty:    'Косметолог-эстетист, специалист по проблемной и возрастной коже',
  city:         'Челябинск',
  email:        'hello@puraskin.studio',
  instagram:    '@mari_shymi',
  instagramUrl: 'https://instagram.com/mari_shymi',
  telegram:     '@mari_shymi',
  telegramUrl:  'https://t.me/mari_shymi',
  vk:           'mari2406ptrv',
  vkUrl:        'https://vk.com/mari2406ptrv',
  workHours:    'Пн–Сб, 10:00–20:00',
  year:         '2026',
};

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initHeaderScroll();
  initMobileMenu();
  initReveal();
  initAccordion();
  initGalleryFilters();
  initBookingForm();
  markActiveNav();
});

/* ---------- 1. Подстановка данных студии ---------- */
function applyConfig(){
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const key = el.getAttribute('data-cfg');
    if (CONFIG[key] !== undefined) el.textContent = CONFIG[key];
  });

  document.querySelectorAll('[data-cfg-href]').forEach(el => {
    const key = el.getAttribute('data-cfg-href');
    const map = {
      email: `mailto:${CONFIG.email}`,
      instagram: CONFIG.instagramUrl,
      telegram: CONFIG.telegramUrl,
      vk: CONFIG.vkUrl,
    };
    if (map[key]) el.setAttribute('href', map[key]);
  });
}

/* ---------- 2. Header: уменьшение при скролле ---------- */
function initHeaderScroll(){
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('shrink');
    else header.classList.remove('shrink');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- 3. Мобильное меню ---------- */
function initMobileMenu(){
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;
  const closeBtn = menu.querySelector('.mobile-menu-close');

  const toggle = () => {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-open');
    document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
  };

  burger.addEventListener('click', toggle);
  if (closeBtn) closeBtn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) toggle();
  }));
}

/* ---------- 4. Scroll-reveal анимации ---------- */
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ---------- 5. FAQ / раскрывающиеся блоки услуг ---------- */
function initAccordion(){
  document.querySelectorAll('.accordion-item').forEach(item => {
    const q = item.querySelector('.accordion-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const parent = item.closest('.accordion');
      const exclusive = parent && parent.hasAttribute('data-exclusive');
      if (exclusive){
        parent.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) other.classList.remove('is-open');
        });
      }
      item.classList.toggle('is-open');
    });
  });
}

/* ---------- 6. Фильтры галереи "До/После" ---------- */
function initGalleryFilters(){
  const groups = document.querySelectorAll('[data-filter-group]');
  const cards = document.querySelectorAll('[data-tags]');
  if (!groups.length || !cards.length) return;

  const active = {};
  groups.forEach(g => active[g.getAttribute('data-filter-group')] = 'all');

  function applyFilters(){
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(' ');
      const visible = Object.values(active).every(v => v === 'all' || tags.includes(v));
      card.style.display = visible ? '' : 'none';
    });
  }

  groups.forEach(group => {
    const key = group.getAttribute('data-filter-group');
    group.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        active[key] = btn.getAttribute('data-filter-value');
        applyFilters();
      });
    });
  });
}

/* ---------- 7. Форма онлайн-записи ---------- */
function initBookingForm(){
  const form = document.querySelector('#booking-form');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.booking-step'));
  const dots = Array.from(document.querySelectorAll('.step-dot'));
  let current = 0;

  function showStep(i){
    steps.forEach((s, idx) => s.style.display = idx === i ? '' : 'none');
    dots.forEach((d, idx) => d.classList.toggle('active', idx <= i));
    current = i;
  }

  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => { if (current < steps.length - 1) showStep(current + 1); window.scrollTo({top: form.offsetTop - 130, behavior:'smooth'}); });
  });
  form.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => { if (current > 0) showStep(current - 1); window.scrollTo({top: form.offsetTop - 130, behavior:'smooth'}); });
  });

  // выбор карточек услуги
  function selectService(card){
    card.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const label = form.querySelector('#selected-service-label');
    if (label) label.textContent = card.querySelector('h3, b')?.textContent || '';
  }
  form.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => selectService(card));
  });

  // предзаполнение услуги из ссылки вида booking.html?service=cleaning
  const knownServices = ['massage','peeling','pro-care','biorevitalization','cleaning','treatment','home-care'];
  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (requestedService && knownServices.includes(requestedService)){
    const match = form.querySelector(`.option-card[data-service="${requestedService}"]`);
    if (match) selectService(match);
  }

  // выбор времени
  form.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.parentElement.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  showStep(0);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // ВАЖНО: это фронтенд-демонстрация. Реальная отправка заявки
    // не производится — нужна интеграция с CRM/почтой/Telegram-ботом.
    // См. README.md, раздел "Форма записи".
    const nameField = form.querySelector('#client-name');
    const confirmName = document.querySelector('#confirm-name');
    if (confirmName) confirmName.textContent = nameField && nameField.value ? nameField.value : 'Вы';
    form.querySelectorAll('.booking-step').forEach(s => s.style.display = 'none');
    const confirmPanel = document.querySelector('#booking-confirm');
    if (confirmPanel) confirmPanel.style.display = '';
    const stepsRow = document.querySelector('.steps-row');
    if (stepsRow) stepsRow.style.display = 'none';
    window.scrollTo({top: form.offsetTop - 130, behavior:'smooth'});
  });
}

/* ---------- 8. Подсветка активного пункта меню ---------- */
function markActiveNav(){
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) a.classList.add('active');
  });
}
