import { MARKET } from './config.js';
import { $ } from './dom.js';
import { formatPercent } from './format.js';

const brl = new Intl.NumberFormat('pt-BR');

function paintDelta(el, pct) {
  el.textContent = `${pct >= 0 ? '▲' : '▼'} ${formatPercent(pct, { signed: false })}`;
  el.className = `quote__delta ${pct >= 0 ? 'is-up' : 'is-down'}`;
}

/** Simula cotações ao vivo com um passeio aleatório. */
export function startTicker(intervalMs = 3500) {
  let arabica = MARKET.arabicaUsd;
  let saca = MARKET.sacaBrl;
  setInterval(() => {
    arabica = Math.max(200, arabica + (Math.random() - 0.48) * 1.1);
    saca = Math.max(1200, saca + (Math.random() - 0.5) * 6);
    $('#quote-ny').textContent = `US$ ${arabica.toFixed(2).replace('.', ',')}`;
    $('#quote-saca').textContent = `R$ ${brl.format(Math.round(saca))}`;
    paintDelta($('#quote-ny-delta'), (arabica / MARKET.arabicaUsd - 1) * 100 + MARKET.arabicaDay);
    paintDelta($('#quote-saca-delta'), (saca / MARKET.sacaBrl - 1) * 100 + MARKET.sacaDay);
  }, intervalMs);
}
