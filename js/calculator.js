import { BASELINE, COST_GROUPS, INPUT_TYPE_GROUP, PERIODS } from './config.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function statusFor(pct) {
  if (pct <= -10) return 'optimized';
  if (pct > 10) return 'alert';
  return 'stable';
}

/**
 * Função pura: dado o estado de entrada, devolve linhas, totais, grupos e KPIs.
 * Sem acesso a DOM ou a estado global, o que facilita testes.
 */
export function computeScenario({ period, inputType, cost, volume, lots }) {
  const preset = PERIODS[period];
  const scale = (cost * volume) / (BASELINE.cost * BASELINE.volume);
  const affectedGroup = INPUT_TYPE_GROUP[inputType];

  const rows = lots.map((lot) => {
    const costA = lot.costA * preset.factorA;
    const costB = lot.costB * preset.factorB * (lot.group === affectedGroup ? scale : 1);
    const delta = costB - costA;
    const pct = costA ? (delta / costA) * 100 : 0;
    return { ...lot, costA, costB, delta, pct, status: statusFor(pct) };
  });

  const sum = (list, key) => list.reduce((acc, row) => acc + row[key], 0);
  const totalA = sum(rows, 'costA');
  const totalB = sum(rows, 'costB');

  const groups = COST_GROUPS.map((name, index) => {
    const members = rows.filter((row) => row.group === index);
    const a = sum(members, 'costA');
    const b = sum(members, 'costB');
    return { name, a, b, delta: b - a, pct: a ? ((b - a) / a) * 100 : 0 };
  });

  const safeVolume = Math.max(volume, 1);
  const efficiency = clamp(
    BASELINE.efficiency + (1 - totalB / totalA / (BASELINE.totalB / BASELINE.totalA)) * 20, 70, 99.5);

  return {
    rows,
    groups,
    totals: { a: totalA, b: totalB, delta: totalB - totalA, pct: totalA ? ((totalB - totalA) / totalA) * 100 : 0 },
    unit: { a: totalA / safeVolume, b: totalB / safeVolume },
    efficiency,
    /** Razão entre o custo atual e o cenário de referência (escala a curva mensal). */
    ratio: totalB / BASELINE.totalB,
    labels: preset.labels,
    benchmark: preset.text,
  };
}
