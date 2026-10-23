import { CATEGORIES, PERIODS } from './config.js';
import { state } from './state.js';
import { $, $$, showToast } from './dom.js';
import { parseDecimal } from './format.js';

/** Liga o <dialog> de novo lote. `onAdded` é chamado após inserir o lote. */
export function initLotModal(onAdded) {
  const dialog = $('#lot-modal');
  const form = $('#lot-form');
  const nameInput = $('#lot-name');

  $('#btn-new-lot').addEventListener('click', () => {
    dialog.showModal();
    nameInput.focus();
  });
  $$('[data-close]', dialog).forEach((btn) => btn.addEventListener('click', () => dialog.close()));
  // Clique no backdrop (o próprio <dialog>) fecha o modal.
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const costA = parseDecimal($('#lot-cost-a').value);
    const costB = parseDecimal($('#lot-cost-b').value);
    if (!name || (!costA && !costB)) {
      showToast('Informe o nome e ao menos um valor');
      return;
    }
    const category = $('#lot-category').value;
    const preset = PERIODS[state.period];
    state.lots.push({
      name,
      note: `${CATEGORIES[category].label} • Lote adicionado`,
      category,
      group: CATEGORIES[category].group,
      icon: CATEGORIES[category].icon,
      // Armazena na base do período 1 para que o fator do preset seja reaplicado corretamente.
      costA: costA / preset.factorA,
      costB: costB / preset.factorB,
    });
    form.reset();
    dialog.close();
    onAdded();
    showToast('Lote adicionado à análise');
  });
}
