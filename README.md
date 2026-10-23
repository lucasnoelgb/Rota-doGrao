# Rota do Grão

Dashboard de gestão financeira e análise de custos para a cadeia do café especial.
Projeto em HTML, CSS e JavaScript puros (módulos ES), sem etapa de build obrigatória.

## Executar

Os módulos ES não carregam via `file://`; sirva a pasta por HTTP:

```bash
npm start            # ou: python3 -m http.server 8080
# abra http://localhost:8080
```

## Estrutura

```
index.html            marcação semântica + sprite de ícones SVG
css/
  tokens.css          variáveis de design (cores, tipografia, espaçamento)
  base.css            reset, fundo atmosférico, utilitários
  layout.css          cabeçalho, hero, grids, rodapé
  components.css      botões, cards, formulários, KPIs, tabela, modal, toast
  responsive.css      breakpoints (1024 / 768 / 640)
js/
  main.js             ponto de entrada: estado → cálculo → render
  config.js           constantes e dados-semente
  state.js            estado único da aplicação
  calculator.js       lógica de negócio pura (sem DOM)
  format.js           moeda, porcentagem e parsing pt-BR
  dom.js              helpers de DOM, toast, animação numérica
  charts.js           gráficos Chart.js
  panels.js           KPIs, legenda e insight
  table.js            tabela, filtros e ordenação
  controls.js         eventos de formulário e ações
  modal.js            <dialog> de novo lote
  ticker.js           cotações simuladas
  nav.js              scroll-spy do menu
build.py              gera dist/rota-do-grao.html (arquivo único)
```

## Princípios

- **Fluxo unidirecional:** eventos alteram `state`; `render()` recalcula e redesenha tudo.
- **Lógica separada da UI:** `calculator.js` é uma função pura, fácil de testar.
- **Acessibilidade:** landmarks, rótulos, `aria-pressed`, `aria-sort`, `aria-live`, `<dialog>` nativo, respeito a `prefers-reduced-motion`.
- **Segurança:** texto digitado pelo usuário passa por `escapeHtml` antes do `innerHTML`.
- Os valores são simulados; as taxas de câmbio são fictícias.
