(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Header, scroll progress and active section
  const header = $('.site-header');
  const progress = $('.scroll-progress span');
  const navLinks = $$('.main-nav a[href^="#"]');
  const sections = $$('main section[id]');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;

    let current = 'hero';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 180) current = section.id;
    });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = $('.menu-toggle');
  const nav = $('.main-nav');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Hero carousel
  const slides = $$('.hero-slide');
  const dots = $$('.slider-dots button');
  let slideIndex = 0;
  let slideTimer;
  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
  }
  function autoplay() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(slideIndex + 1), 4800);
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); autoplay(); }));
  autoplay();

  // Counters
  const counters = $$('[data-counter]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: .8 });
  counters.forEach(el => counterObserver.observe(el));

  // Journey timeline
  const gradeContent = {
    9: ['Önce kendini tanı.', 'Öğrencinin ilgi alanları, güçlü yönleri ve öğrenme alışkanlıkları görünür hâle getirilir.'],
    10: ['Doğru yöne bilinçli ilerle.', 'Alan seçimi ve meslek merakı, öğrencinin akademik eğilimiyle birlikte değerlendirilir.'],
    11: ['Hedefini stratejiye dönüştür.', 'Üniversite ve bölüm hedefleri netleştirilir; sınav, deneme ve eksik tamamlama planı oluşturulur.'],
    12: ['Sınavdan tercihe tam destek.', 'YKS performansı, tercih danışmanlığı, motivasyon ve aile iletişimi birlikte yönetilir.']
  };
  $$('.timeline-item').forEach(button => button.addEventListener('click', () => {
    $$('.timeline-item').forEach(x => x.classList.remove('active'));
    button.classList.add('active');
    const [title, text] = gradeContent[button.dataset.grade];
    $('#timelineDetail').innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  }));

  // Scholarship calculator
  const range = $('#percentileRange');
  const value = $('#percentileValue');
  const result = $('#scholarshipResult');
  const message = $('#scholarshipMessage');
  const scholarshipFor = p => {
    if (p <= 3) return [100, 'Üstün başarı dilimi'];
    if (p <= 5) return [90, 'Güçlü başarı dilimi'];
    if (p <= 8) return [80, 'Yüksek başarı dilimi'];
    if (p <= 10) return [70, 'Başarılı öğrenci dilimi'];
    if (p <= 15) return [60, 'Başarı bursu fırsatı'];
    if (p <= 20) return [50, 'Başarı bursu fırsatı'];
    if (p <= 25) return [40, 'Başarı bursu fırsatı'];
    if (p <= 30) return [30, 'Başarı bursu fırsatı'];
    if (p <= 35) return [20, 'Başarı bursu fırsatı'];
    return [0, 'Kayıt avantajları için görüşün'];
  };
  function updateRange() {
    const p = Number(range.value);
    const [rate, label] = scholarshipFor(p);
    value.textContent = p.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    result.textContent = rate ? `%${rate}` : 'Görüşelim';
    message.textContent = label;
    const progress = ((p - Number(range.min)) / (Number(range.max) - Number(range.min))) * 100;
    range.style.setProperty('--range-progress', `${progress}%`);
  }
  range.addEventListener('input', updateRange);
  updateRange();

  // Accordion
  $$('.accordion-item button').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    $$('.accordion-item').forEach(x => x.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }));

  // Button ripple
  $$('.magnetic').forEach(button => {
    button.addEventListener('pointermove', e => {
      const r = button.getBoundingClientRect();
      button.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .05}px, ${(e.clientY - r.top - r.height / 2) * .08}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });

  // Google Sheets ön kayıt bağlantısı
  const formEndpoint = 'https://script.google.com/macros/s/AKfycbznzfn_3doy8gZ9BaB44F7v8lt2GGrv4Z-tFuxIaBRy61eDK5g2KH5rxrzBkV8lxVJA/exec';
  const form = $('#applicationForm');
  const status = $('#formStatus');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'form-status';

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Lütfen zorunlu alanları kontrol edin.';
      status.classList.add('error');
      return;
    }

    const data = new FormData(form);
    const submitButton = $('.submit-btn', form);
    const submitLabel = $('span', submitButton);
    const originalLabel = submitLabel.textContent;
    const percentileInput = String(data.get('percentile') || '').trim().replace(',', '.');
    const percentileNumber = percentileInput ? Number(percentileInput) : null;
    const scholarshipRate = percentileNumber !== null && Number.isFinite(percentileNumber)
      ? scholarshipFor(percentileNumber)[0]
      : '';
    const noteText = String(data.get('message') || '').trim();
    const grade = String(data.get('grade') || '').trim();
    const notes = [`Sınıf: ${grade}`, noteText ? `Not: ${noteText}` : ''].filter(Boolean).join(' | ');
    const consent = $('.check-row input[type="checkbox"]', form).checked;

    const payload = {
      submittedAt: new Date().toISOString(),
      student: String(data.get('studentName') || '').trim(),
      lgsPercentile: percentileInput ? percentileInput.replace('.', ',') : '',
      scholarshipRate,
      parent: String(data.get('parentName') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      campus: String(data.get('campus') || '').trim(),
      consent,
      grade,
      notes,
      message: noteText
    };

    submitButton.disabled = true;
    submitLabel.textContent = 'Gönderiliyor…';
    status.textContent = 'Başvurunuz kaydediliyor…';

    try {
      await fetch(formEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      status.textContent = 'Talebiniz alındı. Eğitim danışmanımız sizinle iletişime geçecektir.';
      status.classList.add('success');
      form.reset();
    } catch (error) {
      status.textContent = 'Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin.';
      status.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
})();
