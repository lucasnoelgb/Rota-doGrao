import { CATEGORIES, STATUS } from './config.js';
import { state } from './state.js';
import { $, $$, escapeHtml, icon } from './dom.js';
import { formatMoney, formatPercent, formatSignedMoney } from './format.js';

const FILTERS = [['all', 'Todos os Itens'], ...Object.entries(CATEGORIES).map(([key, c]) => [key, c.label])];

function renderChips(rows) {
  const count = (key) => (key === 'all' ? rows.length : rows.filter((r) => r.category === key).length);
  $('#filter-chips').innerHTML = FILTERS.map(([key, label]) =>
    `<button class="chip" type="button" data-filter="${key}" aria-pressed="${state.filter === key}">${label} (${count(key)})</button>`).join('');
}

function visibleRows(rows) {
  const filtered = rows.filter((r) => state.filter === 'all' || r.category === state.filter);
  const key = state.sortKey;
  if (!key) return filtered;
  return [...filtered].sort((a, b) =>
    (typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : a[key] - b[key]) * state.sortDir);
}

function renderRow(row) {
  const tone = row.delta < 0 ? 'var(--color-accent)' : row.delta > 0 ? 'var(--color-warn)' : 'var(--color-text-muted)';
  const status = STATUS[row.status];
  const cell = (content, color) => `<td class="cell-value is-end"${color ? ` style="color:${color}"` : ''}>${content}</td>`;
  return `<tr>
    <td><div class="lot"><span class="lot__icon">${icon(row.icon)}</span><div><b>${escapeHtml(row.name)}</b><small>${escapeHtml(row.note)}</small></div></div></td>
    ${cell(formatMoney(row.costA), 'var(--color-text-muted)')}
    ${cell(formatMoney(row.costB))}
    ${cell(formatSignedMoney(row.delta), tone)}
    ${cell(formatPercent(row.pct), tone)}
    <td class="is-center"><span class="badge ${status.tone}">${status.label}</span></td>
  </tr>`;
}

function renderSortState() {
  $$('th[aria-sort]').forEach((th) => {
    const active = th.querySelector('[data-sort]')?.dataset.sort === state.sortKey;
    th.setAttribute('aria-sort', active ? (state.sortDir === 1 ? 'ascending' : 'descending') : 'none');
  });
}

export function renderTable({ rows }) {
  renderChips(rows);
  const list = visibleRows(rows);
  $('#table-body').innerHTML = list.length
    ? list.map(renderRow).join('')
    : '<tr><td class="empty-row" colspan="6">Nenhum registro nesta categoria.</td></tr>';
  $('#table-count').textContent = `Exibindo ${list.length} de ${rows.length} registros homologados para a Safra 2025/2026`;
  renderSortState();
}
