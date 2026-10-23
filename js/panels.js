import { BASELINE } from './config.js';
import { $, $$, animateNumber, icon } from './dom.js';
import { formatMoney, formatPercent } from './format.js';

/** Textos dinâmicos dos períodos (legenda, cabeçalhos, benchmark). */
export function renderLabels(result) {
  const [prev, curr] = result.labels;
  $$('[data-label="prev"]').forEach((el) => (el.textContent = prev));
  $$('[data-label="curr"]').forEach((el) => (el.textContent = `${curr} (Ativo)`));
  $('#benchmark-text').textContent = result.benchmark;
}

export function renderKpis(result) {
  const { totals, unit, efficiency, labels } = result;
  const saved = totals.delta <= 0;

  animateNumber($('#kpi-total'), totals.b, (v) => formatMoney(v));
  $('#kpi-total-badge').innerHTML = `${icon(saved ? 'down' : 'up')}${formatPercent(totals.pct)} vs ${labels[0]}`;
  $('#kpi-total-caption').textContent = saved ? 'Economia:' : 'Acréscimo:';
  $('#kpi-total-delta').textContent = formatMoney(Math.abs(totals.delta));

  animateNumber($('#kpi-unit'), unit.b, (v) => formatMoney(v));
  const unitPct = ((unit.b - unit.a) / unit.a) * 100;
  $('#kpi-unit-badge').innerHTML = `${icon(unitPct >= 0 ? 'up' : 'down')}${formatPercent(unitPct)} ponderado`;

  animateNumber($('#kpi-efficiency'), efficiency, (v) => `${v.toFixed(1).replace('.', ',')}%`);
  const gain = efficiency - BASELINE.efficiencyPrev;
  $('#kpi-efficiency-badge').innerHTML = `${icon(gain >= 0 ? 'up' : 'down')}${formatPercent(gain, { signed: true }).replace('%', '')} pp otimização`;
  $('#kpi-waste').textContent = formatPercent(100 - efficiency, { signed: false });

  const best = [...result.groups].sort((x, y) => x.delta - y.delta)[0];
  const sign = best.delta <= 0 ? '-' : '+';
  $('#best-saving').textContent = `${sign}${formatMoney(Math.abs(best.delta), { trim: true })} em ${best.name.split(' ')[0].toLowerCase()}`;
}

export function renderInsight(result) {
  const byPct = [...result.groups].sort((x, y) => x.pct - y.pct);
  const lowest = byPct[0];
  const highest = byPct.at(-1);
  const currentLabel = result.labels[1];
  const { totals } = result;

  let html = `O custo consolidado de <b>${lowest.name.toLowerCase()}</b> ${lowest.pct < 0 ? 'retraiu' : 'avançou'} <b>${formatPercent(lowest.pct, { signed: false })} no ${currentLabel}</b>`;
  html += highest.pct > 0 && highest !== lowest
    ? `, enquanto <b class="is-alert">${highest.name.toLowerCase()} subiu ${formatPercent(highest.pct, { signed: false })}</b>, pressionando a margem do trimestre. `
    : '. ';
  html += `No saldo, o custo total ${totals.delta <= 0 ? 'recuou' : 'cresceu'} <b>${formatMoney(Math.abs(totals.delta))}</b>. `;
  html += totals.delta <= 0
    ? 'Recomenda-se manter o hedge físico para as remessas do 4º trimestre.'
    : 'Recomenda-se renegociar contratos e antecipar o hedge das próximas remessas.';
  $('#insight-text').innerHTML = html;
}
