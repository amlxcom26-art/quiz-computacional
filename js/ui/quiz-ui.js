/**
 * QuizUI - Camada de Apresentação e Interação com o Usuário
 * Totalmente desacoplada da lógica de regras de negócio (QuizEngine) e da fonte de dados (QuestionLoader).
 */

import { loadQuestions } from '../data/question-loader.js';
import { QuizEngine } from '../logic/quiz-engine.js';

class QuizUI {
  constructor() {
    this.engine = null;

    // Elementos da interface
    this.navQuestionList = document.getElementById('nav-question-list');
    this.quizView = document.getElementById('quiz-view');
    this.resultsView = document.getElementById('results-view');

    this.progressLabel = document.getElementById('question-progress-label');
    this.statementEl = document.getElementById('question-statement');
    this.alternativesContainer = document.getElementById('alternatives-container');

    this.feedbackContainer = document.getElementById('feedback-container');
    this.feedbackBadge = document.getElementById('feedback-badge');
    this.feedbackExplanation = document.getElementById('feedback-explanation');

    this.btnConfirm = document.getElementById('btn-confirm');
    this.btnNext = document.getElementById('btn-next');
    this.btnRestart = document.getElementById('btn-restart');

    this.statPercentage = document.getElementById('stat-percentage');
    this.statCorrect = document.getElementById('stat-correct');
    this.statIncorrect = document.getElementById('stat-incorrect');
    this.resultsFeedbackMessage = document.getElementById('results-feedback-message');
  }

  /**
   * Inicializa a aplicação web carregando as questões e instanciando o motor
   */
  async init() {
    this.bindGlobalEvents();

    try {
      this.statementEl.textContent = 'Carregando questões...';
      const questions = await loadQuestions();
      this.engine = new QuizEngine(questions, true);
      this.render();
    } catch (err) {
      this.statementEl.textContent = 'Erro ao inicializar o questionário. Por favor, recarregue a página.';
      console.error('Falha na inicialização do Quiz:', err);
    }
  }

  /**
   * Associa os eventos de clique e teclado dos botões principais
   */
  bindGlobalEvents() {
    // Botão Confirmar
    this.btnConfirm.addEventListener('click', () => {
      if (!this.engine) return;
      const res = this.engine.confirmAnswer();
      if (res.success) {
        this.render();
        // Foca automaticamente no botão Próxima Questão para navegação fluida por teclado
        this.btnNext.focus();
      }
    });

    // Botão Próxima Questão / Ver Resultados
    this.btnNext.addEventListener('click', () => {
      if (!this.engine) return;
      const res = this.engine.nextQuestion();
      this.render();
    });

    // Botão Reiniciar Quiz
    this.btnRestart.addEventListener('click', () => {
      if (!this.engine) return;
      this.engine.restart();
      this.render();
    });

    // Suporte a teclado no container de alternativas (Setas para cima/baixo)
    this.alternativesContainer.addEventListener('keydown', (e) => {
      if (!this.engine) return;
      const state = this.engine.getCurrentQuestionState();
      if (state.isConfirmed) return;

      const items = Array.from(this.alternativesContainer.querySelectorAll('.alternative-item'));
      const currentIndex = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
      }
    });
  }

  /**
   * Renderiza a visão atual (Quiz ou Resultados)
   */
  render() {
    if (!this.engine) return;

    if (this.engine.status === 'COMPLETED') {
      this.renderResults();
    } else {
      this.renderQuiz();
    }

    this.renderNavBar();
  }

  /**
   * Renderiza a barra numérica de navegação/histórico de questões
   */
  renderNavBar() {
    this.navQuestionList.innerHTML = '';
    const summary = this.engine.getNavigationSummary();

    summary.forEach((item) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-btn';
      btn.textContent = item.number;

      // Status visual e semântico
      if (item.isCurrent) {
        btn.classList.add('is-current');
        btn.setAttribute('aria-current', 'step');
      }

      if (item.isConfirmed) {
        if (item.isCorrect) {
          btn.classList.add('is-answered-correct');
          btn.setAttribute('aria-label', `Questão ${item.number}: Respondida e Correta`);
        } else {
          btn.classList.add('is-answered-incorrect');
          btn.setAttribute('aria-label', `Questão ${item.number}: Respondida e Incorreta`);
        }
      } else {
        btn.setAttribute('aria-label', `Questão ${item.number}`);
      }

      if (!item.isAccessible) {
        btn.classList.add('is-locked');
        btn.disabled = true;
        btn.setAttribute('aria-label', `Questão ${item.number}: Bloqueada`);
      } else {
        btn.disabled = false;
        btn.addEventListener('click', () => {
          const navigated = this.engine.goToQuestion(item.index);
          if (navigated) {
            this.render();
          }
        });
      }

      li.appendChild(btn);
      this.navQuestionList.appendChild(li);
    });
  }

  /**
   * Renderiza a questão ativa e suas 4 alternativas
   */
  renderQuiz() {
    this.resultsView.classList.add('hidden');
    this.quizView.classList.remove('hidden');

    const state = this.engine.getCurrentQuestionState();

    // Atualiza progresso e enunciado
    this.progressLabel.textContent = `Questão ${state.questionNumber} de ${state.totalQuestions}`;
    this.statementEl.textContent = state.statement;

    // Renderiza as alternativas
    this.alternativesContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    state.alternatives.forEach((alt, idx) => {
      const isSelected = state.selectedAlternativeId === alt.id;
      const item = document.createElement('div');
      item.className = 'alternative-item';
      item.setAttribute('role', 'radio');
      item.setAttribute('tabindex', state.isConfirmed ? '-1' : (isSelected ? '0' : '-1'));
      item.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      item.dataset.id = alt.id;

      // Primeiro elemento ou selecionado recebe tabindex 0 se não confirmado
      if (!state.isConfirmed && (isSelected || (idx === 0 && !state.selectedAlternativeId))) {
        item.setAttribute('tabindex', '0');
      }

      // Estados de seleção e correção pós-confirmação
      if (isSelected) {
        item.classList.add('is-selected');
      }

      if (state.isConfirmed) {
        item.classList.add('is-disabled');
        item.setAttribute('aria-disabled', 'true');

        if (alt.id === state.correctAlternativeId) {
          item.classList.add('is-correct');
        } else if (isSelected && !state.isCorrect) {
          item.classList.add('is-incorrect');
        }
      }

      // Letra indicadora (A, B, C, D)
      const letterSpan = document.createElement('span');
      letterSpan.className = 'alternative-letter';
      letterSpan.textContent = letters[idx] || '';

      // Texto da alternativa
      const textSpan = document.createElement('span');
      textSpan.className = 'alternative-text';
      textSpan.textContent = alt.text;

      item.appendChild(letterSpan);
      item.appendChild(textSpan);

      // Eventos de seleção antes da confirmação
      if (!state.isConfirmed) {
        const handleSelect = () => {
          this.engine.selectAlternative(alt.id);
          this.render();
        };

        item.addEventListener('click', handleSelect);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        });
      }

      this.alternativesContainer.appendChild(item);
    });

    // Renderiza Feedback
    if (state.isConfirmed) {
      this.feedbackContainer.classList.remove('hidden');

      if (state.isCorrect) {
        this.feedbackContainer.className = 'feedback-container feedback-correct';
        this.feedbackBadge.innerHTML = '<span>✓</span> <span>Resposta Correta!</span>';
      } else {
        this.feedbackContainer.className = 'feedback-container feedback-incorrect';
        this.feedbackBadge.innerHTML = '<span>✕</span> <span>Resposta Incorreta</span>';
      }

      this.feedbackExplanation.textContent = state.explanation;
    } else {
      this.feedbackContainer.classList.add('hidden');
      this.feedbackExplanation.textContent = '';
    }

    // Gerencia botões de ação
    if (!state.isConfirmed) {
      this.btnConfirm.classList.remove('hidden');
      this.btnConfirm.disabled = state.selectedAlternativeId === null;
      this.btnNext.classList.add('hidden');
    } else {
      this.btnConfirm.classList.add('hidden');
      this.btnNext.classList.remove('hidden');

      if (state.index === state.totalQuestions - 1) {
        this.btnNext.textContent = 'Ver Resultados';
      } else if (state.index < state.highestReachedIndex) {
        this.btnNext.textContent = 'Avançar';
      } else {
        this.btnNext.textContent = 'Próxima Questão';
      }
    }
  }

  /**
   * Renderiza a tela de resultados finais com estatísticas e mensagem qualitativa
   */
  renderResults() {
    this.quizView.classList.add('hidden');
    this.resultsView.classList.remove('hidden');

    const result = this.engine.getResult();

    this.statPercentage.textContent = `${result.percentage}%`;
    this.statCorrect.textContent = result.totalCorrect;
    this.statIncorrect.textContent = result.totalIncorrect;
    this.resultsFeedbackMessage.textContent = result.message;

    // Foca o botão de reinício para facilidade de teclado
    this.btnRestart.focus();
  }
}

// Inicialização automática quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const app = new QuizUI();
  app.init();
});

export { QuizUI };
