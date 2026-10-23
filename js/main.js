import { state } from './state.js';
import { computeScenario } from './calculator.js';
import { updateCharts } from './charts.js';
import { renderInsight, renderKpis, renderLabels } from './panels.js';
import { renderTable } from './table.js';
import { initControls } from './controls.js';
import { initLotModal } from './modal.js';
import { initNavSpy } from './nav.js';
import { startTicker } from './ticker.js';

/** Ponto único de redesenho: estado → cálculo → UI. */
function render() {
  state.result = computeScenario(state);
  renderLabels(state.result);
  renderKpis(state.result);
  updateCharts(state.result);
  renderInsight(state.result);
  renderTable(state.result);
}

initControls(render);
initLotModal(render);
initNavSpy();
startTicker();
render();
