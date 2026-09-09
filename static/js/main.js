document.addEventListener('DOMContentLoaded', () => {
  // ========== Theme Toggle ==========
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  }

  // ========== Language Switcher ==========
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('lang') || 'pt-BR';

  setLanguage(currentLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      localStorage.setItem('lang', lang);
    });
  });

  function setLanguage(lang) {
    currentLang = lang;
    html.setAttribute('lang', lang === 'pt-BR' ? 'pt-BR' : lang);
    
    langBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });

    const t = translations[lang] || translations['pt-BR'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });
  }

  // ========== Mobile Menu ==========
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.className = sidebar.classList.contains('open') ? 'bi bi-x-lg' : 'bi bi-list';
  });

  overlay.addEventListener('click', closeMenu);
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) closeMenu();
    });
  });

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.querySelector('i').className = 'bi bi-list';
  }

  // ========== Active Nav on Scroll ==========
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ========== Smooth scroll for anchor links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== Animate progress bars on view ==========
  const progressFills = document.querySelectorAll('.progress-fill');
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--progress');
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  progressFills.forEach(fill => {
    fill.style.width = '0';
    progressObserver.observe(fill);
  });

  // ========== Contact form feedback (client-side only) ==========
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Keep original action, just show loading state
      const btn = document.getElementById('btnEnviar');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> ...';
      }
    });
  }
});
