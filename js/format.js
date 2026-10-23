import { CURRENCIES } from './config.js';
import { state } from './state.js';

const formatters = {};
const currencyFormatter = (code) =>
  (formatters[code] ??= new Intl.NumberFormat('pt-BR', { style: 'currency', currency: code }));

/** Converte BRL para a moeda ativa. */
export const toCurrency = (valueBrl) => valueBrl * CURRENCIES[state.currency].rate;

/** Formata um valor já convertido na moeda ativa. `trim` remove ",00". */
export function formatRaw(value, { trim = false } = {}) {
  const text = currencyFormatter(state.currency).format(value);
  return trim ? text.replace(/,00$/, '') : text;
}

/** Formata um valor em BRL na moeda ativa. */
export const formatMoney = (valueBrl, options) => formatRaw(toCurrency(valueBrl), options);

export const formatSignedMoney = (valueBrl) =>
  `${valueBrl > 0 ? '+ ' : valueBrl < 0 ? '- ' : ''}${formatMoney(Math.abs(valueBrl))}`;

export function formatPercent(value, { signed = true, digits = 1 } = {}) {
  const sign = signed ? (value > 0 ? '+' : value < 0 ? '-' : '') : '';
  return `${sign}${Math.abs(value).toFixed(digits).replace('.', ',')}%`;
}

/** Interpreta números no padrão pt-BR ("1.234,56"). */
export const parseDecimal = (text) => parseFloat(String(text).replace(/\./g, '').replace(',', '.')) || 0;
