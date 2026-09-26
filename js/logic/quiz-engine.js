/**
 * QuizEngine - Motor de Lógica de Negócio do Quiz Computacional
 * Totalmente desacoplado do DOM e agnóstico de ambiente (funciona no Browser e no Node.js)
 */

export class QuizEngine {
  /**
   * Construtor do QuizEngine
   * @param {Array} questions - Lista das 10 questões básicas de computação
   * @param {boolean} [autoShuffle=true] - Se deve aplicar o embaralhamento inicial
   */
  constructor(questions, autoShuffle = true) {
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('O QuizEngine exige exatamente 10 questões.');
    }

    // Validação constitucional de 4 alternativas e 1 correta
    for (const q of questions) {
      if (!q.alternatives || q.alternatives.length !== 4) {
        throw new Error(`A questão ${q.id} deve conter rigorosamente 4 alternativas.`);
      }
      if (!q.correctAlternativeId) {
        throw new Error(`A questão ${q.id} deve possuir uma alternativa correta definida.`);
      }
      const match = q.alternatives.some((alt) => alt.id === q.correctAlternativeId);
      if (!match) {
        throw new Error(`A alternativa correta ${q.correctAlternativeId} não foi encontrada na questão ${q.id}.`);
      }
    }

    this.rawQuestions = questions;
    this.autoShuffle = autoShuffle;

    this.questions = [];
    this.currentIndex = 0;
    this.highestReachedIndex = 0;
    this.answers = {}; // Record<string, { questionId, selectedAlternativeId, isConfirmed, isCorrect }>
    this.status = 'NOT_STARTED'; // 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

    this.startSession();
  }

  /**
   * Algoritmo de embaralhamento de Fisher-Yates (Knuth Shuffle)
   * Retorna uma nova cópia do array permutada aleatoriamente
   * @param {Array} array
   * @returns {Array}
   */
  static shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Inicia ou reinicia uma sessão de quiz com novo embaralhamento
   */
  startSession() {
    // Clona profundamente as questões brutas
    let sessionQuestions = JSON.parse(JSON.stringify(this.rawQuestions));

    if (this.autoShuffle) {
      // 1. Embaralha a ordem das questões
      sessionQuestions = QuizEngine.shuffle(sessionQuestions);
      // 2. Embaralha a ordem das alternativas de cada questão
      sessionQuestions = sessionQuestions.map((q) => ({
        ...q,
        alternatives: QuizEngine.shuffle(q.alternatives)
      }));
    }

    this.questions = sessionQuestions;
    this.currentIndex = 0;
    this.highestReachedIndex = 0;
    this.answers = {};

    for (const q of this.questions) {
      this.answers[q.id] = {
        questionId: q.id,
        selectedAlternativeId: null,
        isConfirmed: false,
        isCorrect: null
      };
    }

    this.status = 'IN_PROGRESS';
  }

  /**
   * Seleciona uma alternativa para a questão ativa
   * @param {string} alternativeId
   * @returns {boolean} true se a seleção foi aceita
   */
  selectAlternative(alternativeId) {
    if (this.status !== 'IN_PROGRESS') return false;

    const currentQuestion = this.questions[this.currentIndex];
    if (!currentQuestion) return false;

    const answer = this.answers[currentQuestion.id];
    if (answer.isConfirmed) {
      // Questão já confirmada, modificações estão travadas
      return false;
    }

    const altExists = currentQuestion.alternatives.some((alt) => alt.id === alternativeId);
    if (!altExists) return false;

    answer.selectedAlternativeId = alternativeId;
    return true;
  }

  /**
   * Confirma a alternativa selecionada na questão ativa
   * @returns {Object} Resultado da avaliação
   */
  confirmAnswer() {
    if (this.status !== 'IN_PROGRESS') {
      return { success: false, error: 'QUIZ_NOT_IN_PROGRESS' };
    }

    const currentQuestion = this.questions[this.currentIndex];
    const answer = this.answers[currentQuestion.id];

    if (!answer.selectedAlternativeId) {
      return { success: false, error: 'NO_SELECTION' };
    }

    if (answer.isConfirmed) {
      return {
        success: true,
        alreadyConfirmed: true,
        isCorrect: answer.isCorrect,
        selectedId: answer.selectedAlternativeId,
        correctId: currentQuestion.correctAlternativeId,
        explanation: currentQuestion.explanation
      };
    }

    answer.isConfirmed = true;
    answer.isCorrect = answer.selectedAlternativeId === currentQuestion.correctAlternativeId;

    return {
      success: true,
      alreadyConfirmed: false,
      isCorrect: answer.isCorrect,
      selectedId: answer.selectedAlternativeId,
      correctId: currentQuestion.correctAlternativeId,
      explanation: currentQuestion.explanation
    };
  }

  /**
   * Avança sequencialmente para a próxima questão do quiz
   * @returns {Object}
   */
  nextQuestion() {
    if (this.status !== 'IN_PROGRESS') {
      return { advanced: false, isCompleted: this.status === 'COMPLETED' };
    }

    const currentQuestion = this.questions[this.currentIndex];
    const answer = this.answers[currentQuestion.id];

    if (!answer.isConfirmed) {
      // Bloqueia avanço antes de confirmar a resposta
      return { advanced: false, error: 'UNCONFIRMED_QUESTION' };
    }

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
      if (this.currentIndex > this.highestReachedIndex) {
        this.highestReachedIndex = this.currentIndex;
      }
      return {
        advanced: true,
        isCompleted: false,
        nextIndex: this.currentIndex
      };
    }

    // Concluiu a última questão (10ª)
    this.status = 'COMPLETED';
    return {
      advanced: true,
      isCompleted: true
    };
  }

  /**
   * Navega diretamente para uma questão específica da barra de histórico
   * @param {number} targetIndex - Índice alvo (0 a 9)
   * @returns {boolean} true se a navegação foi permitida
   */
  goToQuestion(targetIndex) {
    if (this.status !== 'IN_PROGRESS') return false;
    if (typeof targetIndex !== 'number' || targetIndex < 0 || targetIndex >= this.questions.length) {
      return false;
    }

    // Permite navegar apenas para questões já alcançadas
    if (targetIndex > this.highestReachedIndex) {
      return false;
    }

    this.currentIndex = targetIndex;
    return true;
  }

  /**
   * Reinicia o quiz para a Questão 1 com novo embaralhamento
   */
  restart() {
    this.startSession();
  }

  /**
   * Projeta o estado da questão ativa para consumo da UI
   * @returns {Object}
   */
  getCurrentQuestionState() {
    const q = this.questions[this.currentIndex];
    const answer = this.answers[q.id];

    return {
      index: this.currentIndex,
      questionNumber: this.currentIndex + 1,
      totalQuestions: this.questions.length,
      statement: q.statement,
      alternatives: q.alternatives.map((alt) => ({
        id: alt.id,
        text: alt.text
      })),
      selectedAlternativeId: answer.selectedAlternativeId,
      isConfirmed: answer.isConfirmed,
      isCorrect: answer.isCorrect,
      correctAlternativeId: answer.isConfirmed ? q.correctAlternativeId : null,
      explanation: answer.isConfirmed ? q.explanation : null,
      highestReachedIndex: this.highestReachedIndex
    };
  }

  /**
   * Retorna o sumário da barra de navegação para todas as 10 questões
   * @returns {Array<Object>}
   */
  getNavigationSummary() {
    return this.questions.map((q, index) => {
      const answer = this.answers[q.id];
      return {
        index,
        number: index + 1,
        isCurrent: index === this.currentIndex,
        isAccessible: index <= this.highestReachedIndex,
        isConfirmed: answer.isConfirmed,
        isCorrect: answer.isCorrect
      };
    });
  }

  /**
   * Calcula o resultado final consolidado
   * @returns {Object}
   */
  getResult() {
    let totalCorrect = 0;
    let totalIncorrect = 0;

    for (const q of this.questions) {
      const answer = this.answers[q.id];
      if (answer.isConfirmed && answer.isCorrect) {
        totalCorrect += 1;
      } else if (answer.isConfirmed && answer.isCorrect === false) {
        totalIncorrect += 1;
      }
    }

    const totalQuestions = this.questions.length;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);

    let tier = 'MEDIUM';
    let message = 'Bom desempenho! Você compreende a maioria dos conceitos básicos, mas ainda pode melhorar.';

    if (percentage < 50) {
      tier = 'LOW';
      message = 'Precisa revisar os conceitos fundamentais de computação. Tente novamente!';
    } else if (percentage >= 80) {
      tier = 'HIGH';
      message = 'Excelente domínio! Parabéns pelo seu conhecimento em fundamentos de computação!';
    }

    return {
      totalQuestions,
      totalCorrect,
      totalIncorrect,
      percentage,
      tier,
      message
    };
  }
}
