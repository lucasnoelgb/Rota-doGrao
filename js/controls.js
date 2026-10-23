import { CURRENCIES } from './config.js';
import { state } from './state.js';
import { $, $$, showToast } from './dom.js';
import { parseDecimal } from './format.js';

const setPressed = (buttons, activeButton) =>
  buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === activeButton)));

/** Liga formulário, alternadores, filtros, ordenação e ações. `render` redesenha a UI. */
export function initControls(render) {
  const costInput = $('#cost');
  const volumeInput = $('#volume');

  $('#cost-form').addEventListener('submit', (event) => {
    event.preventDefault();
    state.period = $('#period').selectedIndex;
    state.inputType = $('#input-type').selectedIndex;
    state.cost = parseDecimal(costInput.value) || 78.5;
    state.volume = Math.max(1, Math.round(parseDecimal(volumeInput.value)) || 180);
    costInput.value = state.cost.toFixed(2).replace('.', ',');
    volumeInput.value = state.volume;
    render();
    showToast('Simulação recalculada');
  });

  const nudgeVolume = (step) => {
    volumeInput.value = Math.max(1, Math.round(parseDecimal(volumeInput.value)) + step);
  };
  $('#volume-dec').addEventListener('click', () => nudgeVolume(-10));
  $('#volume-inc').addEventListener('click', () => nudgeVolume(10));

  const currencyButtons = $$('#currency-switch button');
  $('#currency-switch').addEventListener('click', (event) => {
    const button = event.target.closest('[data-currency]');
    if (!button) return;
    state.currency = button.dataset.currency;
    setPressed(currencyButtons, button);
    $('#currency-label').textContent = CURRENCIES[state.currency].label;
    $('#currency-symbol').textContent = CURRENCIES[state.currency].symbol;
    render();
    showToast(`Cotação base: ${CURRENCIES[state.currency].label} (taxa simulada)`);
  });

  const yearButtons = $$('#year-toggle button');
  $('#year-toggle').addEventListener('click', (event) => {
    const button = event.target.closest('[data-year]');
    if (!button) return;
    state.year = Number(button.dataset.year);
    setPressed(yearButtons, button);
    render();
  });

  $('#filter-chips').addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    state.filter = chip.dataset.filter;
    render();
  });

  $('.data-table thead').addEventListener('click', (event) => {
    const button = event.target.closest('[data-sort]');
    if (!button) return;
    const key = button.dataset.sort;
    state.sortDir = state.sortKey === key ? -state.sortDir : 1;
    state.sortKey = key;
    render();
  });

  $('#btn-csv').addEventListener('click', async () => {
    const header = 'Item;Periodo A;Periodo B;Variacao;Variacao %';
    const lines = state.result.rows.map((r) =>
      [r.name, r.costA.toFixed(2), r.costB.toFixed(2), r.delta.toFixed(2), r.pct.toFixed(1)].join(';'));
    try {
      await navigator.clipboard.writeText([header, ...lines].join('\n'));
      showToast('CSV copiado para a área de transferência');
    } catch {
      showToast('Não foi possível copiar neste ambiente');
    }
  });

  $('#btn-print').addEventListener('click', () => {
    try { window.print(); } catch { showToast('Impressão indisponível neste ambiente'); }
  });
  $('#btn-alerts').addEventListener('click', (event) => {
    event.currentTarget.querySelector('.icon-btn__badge')?.remove();
    showToast('Arábica NY em alta; frete rodoviário segue pressionado');
  });
  $('#btn-settings').addEventListener('click', () => {
    $('#custos').scrollIntoView();
    costInput.focus();
  });
}
