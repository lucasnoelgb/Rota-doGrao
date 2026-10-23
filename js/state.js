import { SEED_LOTS } from './config.js';

/** Estado único da aplicação. `result` é preenchido por computeScenario(). */
export const state = {
  period: 0,
  inputType: 0,
  cost: 78.5,
  volume: 180,
  currency: 'BRL',
  filter: 'all',
  year: 2026,
  sortKey: null,
  sortDir: 1,
  lots: SEED_LOTS.map((lot) => ({ ...lot })),
  result: null,
};
