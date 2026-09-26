# Contract: UI Presentation & States

**Feature**: [spec.md](../spec.md) | **Date**: 2026-09-26

Este documento define o contrato da camada de apresentação (`index.html`, `css/style.css`, `css/responsive.css` e `js/ui/quiz-ui.js`).

---

## 1. Estrutura de Contêineres e Telas

A interface é composta por uma única página com duas seções principais alternadas dinamicamente:
1. `#quiz-view`: Visualização interativa da questão e barra de progresso/navegação.
2. `#results-view`: Visualização dos resultados finais de pontuação e aproveitamento.

```html
<main id="app" class="quiz-container">
  <!-- Cabeçalho com Título e Barra Numérica -->
  <header class="quiz-header">
    <h1 class="quiz-title">Quiz Computacional</h1>
    <nav aria-label="Navegação de Questões" class="question-nav">
      <ol id="nav-question-list" class="nav-question-list">
        <!-- 10 botões de questão gerados dinamicamente (1 a 10) -->
      </ol>
    </nav>
  </header>

  <!-- Visualização do Quiz (Questão Ativa) -->
  <section id="quiz-view" class="view-section">
    <div class="question-progress" id="question-progress-label">Questão 1 de 10</div>
    <h2 class="question-statement" id="question-statement">Enunciado da questão</h2>
    
    <div class="alternatives-group" id="alternatives-container" role="radiogroup" aria-labelledby="question-statement">
      <!-- 4 botões de alternativas -->
    </div>

    <!-- Área de Feedback Imediato -->
    <div id="feedback-container" class="feedback-container hidden" aria-live="polite">
      <div id="feedback-badge" class="feedback-badge"></div>
      <p id="feedback-explanation" class="feedback-explanation"></p>
    </div>

    <!-- Barra de Ações -->
    <div class="actions-bar">
      <button id="btn-confirm" class="btn btn-primary" disabled>Confirmar Resposta</button>
      <button id="btn-next" class="btn btn-secondary hidden">Próxima Questão</button>
    </div>
  </section>

  <!-- Visualização dos Resultados Finais -->
  <section id="results-view" class="view-section hidden" aria-labelledby="results-title">
    <h2 id="results-title" class="results-title">Desempenho Final</h2>
    <div class="score-card">
      <div class="score-stat stat-percentage">
        <span class="stat-value" id="stat-percentage">70%</span>
        <span class="stat-label">Aproveitamento</span>
      </div>
      <div class="score-stat stat-correct">
        <span class="stat-value" id="stat-correct">7</span>
        <span class="stat-label">Acertos</span>
      </div>
      <div class="score-stat stat-incorrect">
        <span class="stat-value" id="stat-incorrect">3</span>
        <span class="stat-label">Erros</span>
      </div>
    </div>
    <div id="results-feedback-message" class="results-feedback-message">
      <!-- Mensagem pedagógica por faixa de desempenho -->
    </div>
    <button id="btn-restart" class="btn btn-primary btn-large">Reiniciar Quiz</button>
  </section>
</main>
```

---

## 2. Estados Visuais dos Elementos

### 2.1 Alternativas (`.alternative-item`)
- **Estado Padrão**: Borda neutra, fundo claro, cursor pointer.
- **Selecionada (`.is-selected`)**: Destaque em azul pedagógico, borda espessa, `aria-checked="true"`.
- **Correta (`.is-correct`)**: Destaque verde (`#16a34a`), ícone de acerto `✓`, borda destacada.
- **Incorreta (`.is-incorrect`)**: Destaque vermelho/coral (`#dc2626`), ícone de erro `✕`, texto tachado suave ou fundo contrastante.
- **Desabilitada (`.is-disabled`)**: `pointer-events: none`, bloqueio de hover e interação após confirmação.

### 2.2 Itens da Barra Numérica (`.nav-btn`)
- **Atual (`.is-current`)**: Anel de foco destacado ao redor do número.
- **Respondida com Acerto (`.is-answered-correct`)**: Fundo verde suave.
- **Respondida com Erro (`.is-answered-incorrect`)**: Fundo vermelho suave.
- **Bloqueada (`.is-locked`)**: Opacidade reduzida, cursor `not-allowed`, atributo `disabled`.

### 2.3 Botões de Ação
- `#btn-confirm`: Habilitado somente se houver uma opção selecionada e a questão ainda não tiver sido confirmada.
- `#btn-next`: Oculto durante a seleção; exibido e habilitado assim que a confirmação ocorre.
