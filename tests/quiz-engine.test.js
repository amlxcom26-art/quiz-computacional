import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { QuizEngine } from '../js/logic/quiz-engine.js';
import { FALLBACK_QUESTIONS } from '../js/data/question-loader.js';

describe('QuizEngine - Testes de Unidade', () => {
  let engine;

  beforeEach(() => {
    // Usamos autoShuffle=false para testes determinísticos
    engine = new QuizEngine(FALLBACK_QUESTIONS, false);
  });

  describe('User Story 1: Seleção, Confirmação, Feedback e Navegação (T008, T009)', () => {
    test('Deve inicializar na primeira questão com seleções vazias e não confirmada', () => {
      const state = engine.getCurrentQuestionState();
      assert.equal(state.index, 0);
      assert.equal(state.questionNumber, 1);
      assert.equal(state.totalQuestions, 10);
      assert.equal(state.selectedAlternativeId, null);
      assert.equal(state.isConfirmed, false);
      assert.equal(state.isCorrect, null);
      assert.equal(state.correctAlternativeId, null); // Oculto antes da confirmação
      assert.equal(state.explanation, null); // Oculto antes da confirmação
      assert.equal(state.alternatives.length, 4);
    });

    test('Deve permitir selecionar e trocar de alternativa antes de confirmar (FR-004)', () => {
      const selectedFirst = engine.selectAlternative('q01_b');
      assert.equal(selectedFirst, true);
      assert.equal(engine.getCurrentQuestionState().selectedAlternativeId, 'q01_b');

      const selectedSecond = engine.selectAlternative('q01_a');
      assert.equal(selectedSecond, true);
      assert.equal(engine.getCurrentQuestionState().selectedAlternativeId, 'q01_a');
    });

    test('Deve rejeitar confirmação sem seleção prévia (FR-005)', () => {
      const result = engine.confirmAnswer();
      assert.equal(result.success, false);
      assert.equal(result.error, 'NO_SELECTION');
      assert.equal(engine.getCurrentQuestionState().isConfirmed, false);
    });

    test('Deve avaliar acerto com sucesso e revelar feedback (FR-006)', () => {
      engine.selectAlternative('q01_a'); // Alternativa correta da q01
      const evalResult = engine.confirmAnswer();

      assert.equal(evalResult.success, true);
      assert.equal(evalResult.isCorrect, true);
      assert.equal(evalResult.selectedId, 'q01_a');
      assert.equal(evalResult.correctId, 'q01_a');
      assert.ok(evalResult.explanation.length > 0);

      const state = engine.getCurrentQuestionState();
      assert.equal(state.isConfirmed, true);
      assert.equal(state.isCorrect, true);
      assert.equal(state.correctAlternativeId, 'q01_a');
      assert.ok(state.explanation.length > 0);
    });

    test('Deve avaliar erro destacando a alternativa correta e explicação (FR-006)', () => {
      engine.selectAlternative('q01_b'); // Alternativa incorreta da q01
      const evalResult = engine.confirmAnswer();

      assert.equal(evalResult.success, true);
      assert.equal(evalResult.isCorrect, false);
      assert.equal(evalResult.selectedId, 'q01_b');
      assert.equal(evalResult.correctId, 'q01_a'); // Revela qual era a correta

      const state = engine.getCurrentQuestionState();
      assert.equal(state.isConfirmed, true);
      assert.equal(state.isCorrect, false);
      assert.equal(state.correctAlternativeId, 'q01_a');
    });

    test('Deve travar modificação da resposta após confirmação (FR-007)', () => {
      engine.selectAlternative('q01_a');
      engine.confirmAnswer();

      // Tentativa de alterar a alternativa após confirmação
      const attemptChange = engine.selectAlternative('q01_c');
      assert.equal(attemptChange, false);
      assert.equal(engine.getCurrentQuestionState().selectedAlternativeId, 'q01_a');
    });

    test('Deve bloquear avanço sequencial se a questão não foi confirmada (FR-015)', () => {
      const advanceAttempt = engine.nextQuestion();
      assert.equal(advanceAttempt.advanced, false);
      assert.equal(advanceAttempt.error, 'UNCONFIRMED_QUESTION');
      assert.equal(engine.getCurrentQuestionState().index, 0);
    });

    test('Deve permitir avançar sequencialmente após confirmação (FR-008)', () => {
      engine.selectAlternative('q01_a');
      engine.confirmAnswer();

      const advanceResult = engine.nextQuestion();
      assert.equal(advanceResult.advanced, true);
      assert.equal(advanceResult.isCompleted, false);
      assert.equal(advanceResult.nextIndex, 1);
      assert.equal(engine.getCurrentQuestionState().index, 1);
    });

    test('Deve permitir navegar para questões anteriores já respondidas na barra numérica (FR-008)', () => {
      // Questão 1 (índice 0)
      engine.selectAlternative('q01_a');
      engine.confirmAnswer();
      engine.nextQuestion();

      // Questão 2 (índice 1)
      assert.equal(engine.getCurrentQuestionState().index, 1);
      engine.selectAlternative('q02_a');
      engine.confirmAnswer();

      // Voltar para Questão 1 pela barra numérica
      const wentBack = engine.goToQuestion(0);
      assert.equal(wentBack, true);
      assert.equal(engine.getCurrentQuestionState().index, 0);
      assert.equal(engine.getCurrentQuestionState().isConfirmed, true);

      // Retornar para Questão 2
      const wentForward = engine.goToQuestion(1);
      assert.equal(wentForward, true);
      assert.equal(engine.getCurrentQuestionState().index, 1);
    });

    test('Deve bloquear navegação na barra numérica para questões futuras não alcançadas', () => {
      // Estamos na Questão 1 (índice 0)
      const jumpAttempt = engine.goToQuestion(5);
      assert.equal(jumpAttempt, false);
      assert.equal(engine.getCurrentQuestionState().index, 0);
    });
  });

  describe('User Story 2: Apuração e Faixas de Pontuação (T014, T015)', () => {
    test('Deve calcular corretamente 10 acertos (100%) com faixa HIGH', () => {
      // Responde todas as 10 questões corretamente
      for (let i = 0; i < 10; i++) {
        const state = engine.getCurrentQuestionState();
        const question = engine.questions[i];
        engine.selectAlternative(question.correctAlternativeId);
        engine.confirmAnswer();
        engine.nextQuestion();
      }

      assert.equal(engine.status, 'COMPLETED');
      const result = engine.getResult();
      assert.equal(result.totalQuestions, 10);
      assert.equal(result.totalCorrect, 10);
      assert.equal(result.totalIncorrect, 0);
      assert.equal(result.percentage, 100);
      assert.equal(result.tier, 'HIGH');
      assert.match(result.message, /Excelente domínio/);
    });

    test('Deve calcular 7 acertos e 3 erros (70%) com faixa MEDIUM (FR-011, FR-012)', () => {
      for (let i = 0; i < 10; i++) {
        const question = engine.questions[i];
        if (i < 7) {
          engine.selectAlternative(question.correctAlternativeId); // 7 acertos
        } else {
          // Escolhe uma alternativa incorreta propositalmente
          const wrongAlt = question.alternatives.find(a => a.id !== question.correctAlternativeId);
          engine.selectAlternative(wrongAlt.id);
        }
        engine.confirmAnswer();
        engine.nextQuestion();
      }

      assert.equal(engine.status, 'COMPLETED');
      const result = engine.getResult();
      assert.equal(result.totalCorrect, 7);
      assert.equal(result.totalIncorrect, 3);
      assert.equal(result.percentage, 70);
      assert.equal(result.tier, 'MEDIUM');
      assert.match(result.message, /Bom desempenho/);
    });

    test('Deve calcular 3 acertos (30%) com faixa LOW', () => {
      for (let i = 0; i < 10; i++) {
        const question = engine.questions[i];
        if (i < 3) {
          engine.selectAlternative(question.correctAlternativeId);
        } else {
          const wrongAlt = question.alternatives.find(a => a.id !== question.correctAlternativeId);
          engine.selectAlternative(wrongAlt.id);
        }
        engine.confirmAnswer();
        engine.nextQuestion();
      }

      const result = engine.getResult();
      assert.equal(result.totalCorrect, 3);
      assert.equal(result.totalIncorrect, 7);
      assert.equal(result.percentage, 30);
      assert.equal(result.tier, 'LOW');
      assert.match(result.message, /Precisa revisar os conceitos/);
    });
  });

  describe('User Story 3: Reinício e Embaralhamento (T019, T020)', () => {
    test('Deve restaurar o estado inicial ao reiniciar o quiz (FR-013)', () => {
      // Responde 2 questões
      engine.selectAlternative('q01_a');
      engine.confirmAnswer();
      engine.nextQuestion();

      engine.selectAlternative('q02_a');
      engine.confirmAnswer();

      // Reinicia
      engine.restart();

      assert.equal(engine.currentIndex, 0);
      assert.equal(engine.highestReachedIndex, 0);
      assert.equal(engine.status, 'IN_PROGRESS');

      const state = engine.getCurrentQuestionState();
      assert.equal(state.index, 0);
      assert.equal(state.isConfirmed, false);
      assert.equal(state.selectedAlternativeId, null);
    });

    test('O algoritmo Fisher-Yates deve preservar a integridade do gabarito único em todas as 10 questões', () => {
      const shuffledEngine = new QuizEngine(FALLBACK_QUESTIONS, true);

      assert.equal(shuffledEngine.questions.length, 10);
      shuffledEngine.questions.forEach((q) => {
        assert.equal(q.alternatives.length, 4);
        const correctAlts = q.alternatives.filter(a => a.id === q.correctAlternativeId);
        assert.equal(correctAlts.length, 1, `Gabarito da questão ${q.id} foi corrompido no embaralhamento`);
      });
    });
  });
});
