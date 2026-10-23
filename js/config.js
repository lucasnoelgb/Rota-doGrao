/**
 * Configuração e dados-semente da aplicação (sem lógica).
 * Valores monetários em BRL; a conversão acontece apenas na camada de formatação.
 */

/** Centros de custo exibidos no gráfico de categorias. */
export const COST_GROUPS = ['Grãos Especiais', 'Logística & Frete', 'Embalagens Kraft', 'Torrefação & Cupping'];

/** Lotes iniciais. `group` é o índice em COST_GROUPS; `category` alimenta os filtros. */
export const SEED_LOTS = [
  { name: 'Microlote Alta Mogiana', note: 'Catuaí Amarelo • CD 86pts SCA', category: 'raw', group: 0, costA: 5200, costB: 4450, icon: 'grain' },
  { name: 'Cerrado Catuaí 84+', note: 'Processo Natural • Lote Padrão', category: 'raw', group: 0, costA: 3700, costB: 3300, icon: 'grain' },
  { name: 'Embalagens Kraft 250g / 1kg', note: 'Válvula desgaseificadora + zip', category: 'raw', group: 2, costA: 2100, costB: 1950, icon: 'box' },
  { name: 'Frete SCA Dedicado', note: 'Transporte climatizado fazenda-torrefação', category: 'freight', group: 1, costA: 1850, costB: 2300, icon: 'truck' },
  { name: 'Serviço de Torra Perfil Artesanal', note: 'Atelier Probat 12kg • Gás GLP', category: 'service', group: 3, costA: 2680, costB: 2250, icon: 'fire' },
];

export const CATEGORIES = {
  raw: { label: 'Matéria-Prima', group: 0, icon: 'grain' },
  service: { label: 'Serviços', group: 3, icon: 'fire' },
  freight: { label: 'Frete', group: 1, icon: 'truck' },
};

/** Presets do seletor de período: fatores aplicados aos períodos A e B. */
export const PERIODS = [
  { factorA: 1, factorB: 1, labels: ['Período A', 'Período B'], text: 'Benchmark direto entre Período A (Safra Passada) e Período B (Safra em Curso).' },
  { factorA: 0.09, factorB: 0.1, labels: ['Mês Anterior', 'Mês Atual'], text: 'Benchmark entre o mês anterior e o mês em curso.' },
  { factorA: 0.93, factorB: 1, labels: ['Safra 2024', 'Safra 2025'], text: 'Benchmark entre as safras 2024 e 2025.' },
  { factorA: 1.04, factorB: 0.97, labels: ['Base Auditada', 'Cenário Personalizado'], text: 'Cenário personalizado contra a base auditada.' },
];

/** Para cada opção do seletor de insumo, qual centro de custo ela afeta. */
export const INPUT_TYPE_GROUP = [0, 2, 3, 1, 3];

/** Taxas simuladas (BRL → moeda). */
export const CURRENCIES = {
  BRL: { rate: 1, symbol: 'R$', label: 'BRL (R$)' },
  USD: { rate: 0.1835, symbol: 'US$', label: 'USD (US$)' },
  EUR: { rate: 0.168, symbol: '€', label: 'EUR (€)' },
};

/** Cenário de referência usado para normalizar a simulação. */
export const BASELINE = { cost: 78.5, volume: 180, totalA: 15530, totalB: 14250, efficiency: 94.8, efficiencyPrev: 91.3 };

export const STATUS = {
  optimized: { label: 'Otimizado', tone: '' },
  stable: { label: 'Estável', tone: 'badge--muted' },
  alert: { label: 'Alerta', tone: 'badge--muted' },
};

export const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
/** Desembolso mensal em milhares de BRL. */
export const MONTHLY = {
  2026: [9.2, 9.8, 10.4, 11.6, 12.9, 13.8, 14.6, 16.2, 17.5, 18.4, 15.9, 14.1],
  2025: [10.1, 10.6, 11, 12, 12.8, 13.4, 14.2, 15, 16.1, 16.9, 15.2, 13.8],
};

export const MARKET = { arabicaUsd: 242.8, sacaBrl: 1340, arabicaDay: 1.4, sacaDay: -0.5 };
