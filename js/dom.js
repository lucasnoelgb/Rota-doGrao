/** Helpers de DOM sem dependência de domínio. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Escapa texto de usuário antes de inseri-lo via innerHTML. */
export const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (ch) => ENTITIES[ch]);

/** Marcação de um ícone do sprite definido no index.html. */
export const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Anima um número até `target`, escrevendo o texto formatado em `el`. */
export function animateNumber(el, target, format) {
  const from = el._value ?? target * 0.85;
  el._value = target;
  if (prefersReducedMotion()) {
    el.textContent = format(target);
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 600);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = format(from + (target - from) * eased);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

let toastTimer;
export function showToast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}
