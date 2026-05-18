/* portfolio.js — shared JS for embedded.html + ds.html */

// ─── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── Mobile nav toggle ─────────────────────────────────────
const hamburger = document.getElementById('pf-hamburger');
const mobileMenu = document.getElementById('pf-mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const open = mobileMenu.classList.contains('open');
    hamburger.setAttribute('aria-expanded', open);
    hamburger.querySelectorAll('span')[0].style.transform = open ? 'rotate(45deg) translate(4px, 4px)' : '';
    hamburger.querySelectorAll('span')[1].style.opacity  = open ? '0' : '1';
    hamburger.querySelectorAll('span')[2].style.transform = open ? 'rotate(-45deg) translate(4px, -4px)' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });
}

// ─── Nav shrink on scroll ──────────────────────────────────
const pfNav = document.querySelector('.pf-nav');
if (pfNav) {
  window.addEventListener('scroll', () => {
    pfNav.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.07)'
      : '';
  }, { passive: true });
}

// ─── Smooth scroll for in-page anchors ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
