import { MONTHLY, MONTHS } from './config.js';
import { state } from './state.js';
import { $ , icon } from './dom.js';
import { formatPercent, formatRaw, toCurrency } from './format.js';

const TOOLTIP = {
  backgroundColor: '#140F0C',
  borderColor: 'rgba(224,193,160,.25)',
  borderWidth: 1,
  titleColor: '#E6C6A4',
  bodyColor: '#C4AD91',
  padding: 10,
  titleFont: { family: 'Oswald', size: 14 },
};
const GRID = 'rgba(224,193,160,.08)';

let categoriesChart = null;
let monthlyChart = null;

function buildCategoriesChart() {
  return new Chart($('#chart-categories'), {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        { label: '', data: [], backgroundColor: 'rgba(196,173,145,.35)', borderRadius: 4 },
        { label: '', data: [], backgroundColor: '#C86D2B', borderRadius: 4 },
      ],
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      animation: { duration: 700 },
      scales: {
        x: { grid: { color: GRID }, ticks: { callback: (v) => formatRaw(v, { trim: true }) } },
        y: { grid: { display: false }, ticks: { color: '#E6C6A4', font: { weight: 600 } } },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TOOLTIP,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatRaw(ctx.parsed.x)}`,
            afterBody: (items) => `Δ ${formatPercent(state.result.groups[items[0].dataIndex].pct)}`,
          },
        },
      },
    },
  });
}

function buildMonthlyChart() {
  const areaGradient = ({ chart }) => {
    const area = chart.chartArea;
    if (!area) return 'rgba(200,109,43,.3)';
    const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
    gradient.addColorStop(0, 'rgba(200,109,43,.4)');
    gradient.addColorStop(1, 'rgba(200,109,43,0)');
    return gradient;
  };
  return new Chart($('#chart-monthly'), {
    type: 'line',
    data: {
      labels: MONTHS,
      datasets: [
        { label: '', data: [], borderColor: '#C86D2B', borderWidth: 2.5, tension: 0.4, fill: true, pointRadius: 0, pointHoverRadius: 5, pointBackgroundColor: '#ffb689', backgroundColor: areaGradient },
        { label: '', data: [], borderColor: 'rgba(196,173,145,.7)', borderDash: [4, 4], borderWidth: 1.5, tension: 0.4, pointRadius: 0, fill: false },
      ],
    },
    options: {
      maintainAspectRatio: false,
      animation: { duration: 700 },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: GRID, borderDash: [3, 3] }, ticks: { callback: (v) => formatRaw(v, { trim: true }) } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { ...TOOLTIP, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatRaw(ctx.parsed.y)}` } },
      },
    },
  });
}

/** Atualiza (e cria, na primeira chamada) os dois gráficos. */
export function updateCharts(result) {
  if (!window.Chart) return;
  if (!categoriesChart) {
    Chart.defaults.font.family = "'Open Sans', sans-serif";
    Chart.defaults.color = '#C4AD91';
    categoriesChart = buildCategoriesChart();
    monthlyChart = buildMonthlyChart();
  }

  const [labelA, labelB] = result.labels;
  const [setA, setB] = categoriesChart.data.datasets;
  categoriesChart.data.labels = result.groups.map((g) => g.name);
  setA.label = labelA;
  setB.label = labelB;
  setA.data = result.groups.map((g) => toCurrency(g.a));
  setB.data = result.groups.map((g) => toCurrency(g.b));
  categoriesChart.update();

  const otherYear = state.year === 2026 ? 2025 : 2026;
  const series = (year) =>
    MONTHLY[year].map((thousands) => toCurrency(thousands * 1000 * (year === 2026 ? result.ratio : 1)));
  const main = series(state.year);
  const [mainSet, otherSet] = monthlyChart.data.datasets;
  mainSet.data = main;
  mainSet.label = `Safra ${state.year}`;
  otherSet.data = series(otherYear);
  otherSet.label = `Safra ${otherYear}`;
  monthlyChart.update();

  const peak = Math.max(...main);
  $('#peak-tag').innerHTML = `${icon('up')}${MONTHS[main.indexOf(peak)]}: ${formatRaw(peak, { trim: true })} (Pico)`;
}
