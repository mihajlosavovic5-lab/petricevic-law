// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.querySelectorAll('.clip-reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 100);
    });
    document.querySelectorAll('.hero-text .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 300 + i * 120);
    });
    document.getElementById('heroDivider').classList.add('visible');
    setTimeout(() => document.getElementById('heroBadge').classList.add('visible'), 800);
  }, 1600);
});

// ── SCROLL PROGRESS ──
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  bar.style.width = pct + '%';
});

// ── NAV SHRINK ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── SMOOTH SCROLL ──
function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start = null;
  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function step(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
    else {
      window.scrollTo(0, targetY);
      document.documentElement.scrollTop = targetY;
      document.body.scrollTop = targetY;
    }
  }
  requestAnimationFrame(step);
}

function scrollToEl(el, duration) {
  const navH = document.getElementById('navbar').offsetHeight;
  const top = el.getBoundingClientRect().top + window.scrollY - navH;
  smoothScrollTo(top, duration || 1100);
}

// Nav links + hero CTA buttons
document.querySelectorAll('.nav-links a[href^="#"], .hero-btns a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); scrollToEl(target); }
  });
});

// ── BACK TO TOP ──
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
    backToTop.style.transform = 'translateY(0)';
    backToTop.style.pointerEvents = 'auto';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'translateY(12px)';
    backToTop.style.pointerEvents = 'none';
  }
});

// ── PARALLAX HERO IMAGE ──
const heroImg = document.getElementById('heroImg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroImg.style.transform = `translateY(${y * 0.25}px)`;
  }
});

// ── SECTION ENTRANCE ──
const sectionEntranceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionEntranceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.section-entrance').forEach(el => sectionEntranceObserver.observe(el));

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .stagger').forEach(el => {
  if (!el.closest('.hero-text')) observer.observe(el);
});

// ── LANGUAGE TOGGLE ──
let lang = 'sr';
const langBtn = document.getElementById('langBtn');

langBtn.addEventListener('click', () => {
  const loader = document.getElementById('loader');
  const loaderLine = loader.querySelector('.loader-line');
  loaderLine.style.animation = 'none';
  loaderLine.offsetHeight;
  loaderLine.style.animation = 'loaderExpand 0.3s ease forwards';
  loader.classList.remove('hidden');

  setTimeout(() => {
    lang = lang === 'sr' ? 'en' : 'sr';
    const flagImg = document.getElementById('langFlag');
    if (lang === 'sr') {
      flagImg.src = 'https://flagcdn.com/w40/rs.png';
      flagImg.alt = 'Srpski';
      langBtn.title = 'Prebaci na engleski';
    } else {
      flagImg.src = 'https://flagcdn.com/w40/gb.png';
      flagImg.alt = 'English';
      langBtn.title = 'Switch to Serbian';
    }
    applyLang();
    setTimeout(() => loader.classList.add('hidden'), 200);
  }, 350);
});

function applyLang() {
  document.querySelectorAll('[data-sr][data-en]').forEach(el => {
    const val = lang === 'sr' ? el.getAttribute('data-sr') : el.getAttribute('data-en');
    if (val !== null) el.innerHTML = val;
  });
  document.querySelectorAll('[data-ph-sr]').forEach(el => {
    el.placeholder = lang === 'sr' ? el.getAttribute('data-ph-sr') : el.getAttribute('data-ph-en');
  });
  document.documentElement.lang = lang;
}

// ── COPY TO CLIPBOARD ──
function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1800);
  });
}

// ── ACTIVE NAV LINK ──
const navSectionIds = ['home', 'about', 'oblasti', 'cases', 'izjave', 'contact'];
const navLinkEls = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  const navH = document.getElementById('navbar').offsetHeight;
  const scrollY = window.scrollY + navH + 10;
  let current = navSectionIds[0];
  navSectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  navLinkEls.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  const isOpen = mobileNav.classList.contains('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
  document.documentElement.style.overflow = isOpen ? 'hidden' : '';
  backToTop.style.opacity = isOpen ? '0' : (window.scrollY > 400 ? '1' : '0');
  backToTop.style.pointerEvents = isOpen ? 'none' : (window.scrollY > 400 ? 'auto' : 'none');
});
const closeNav = () => {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  if (window.scrollY > 400) {
    backToTop.style.opacity = '1';
    backToTop.style.pointerEvents = 'auto';
  }
};
document.getElementById('mobileNavClose').addEventListener('click', closeNav);
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeNav();
      const target = document.querySelector(href);
      if (target) {
        setTimeout(() => scrollToEl(target, 1100), 420);
      }
    } else {
      closeNav();
    }
  });
});
