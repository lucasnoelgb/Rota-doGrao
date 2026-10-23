import { $$ } from './dom.js';

/** Destaca no menu a seção atualmente visível. */
export function initNavSpy() {
  const links = $$('.main-nav__link');
  const observer = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((entry) => {
      links.forEach((link) => link.setAttribute('aria-current', String(link.hash === `#${entry.target.id}`)));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
  });
}
