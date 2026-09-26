# Contract: QuizEngine API

**Feature**: [spec.md](../spec.md) | **Date**: 2026-09-26

Este documento define o contrato da classe ou módulo `QuizEngine` (`js/logic/quiz-engine.js`), responsável por gerenciar a lógica de negócio de forma isolada do DOM.

---

## 1. Construtor e Inicialização

```javascript
class QuizEngine {
  /**
   * Inicializa o motor com a lista de questões.
   * Valida se existem 10 questões, cada uma com 4 alternativas e 1 resposta correta.
   * @param {Array<Question>} questions - Array com as 10 questões base.
   * @param {boolean} [autoShuffle=true] - Se deve aplicar o embaralhamento na inicialização.
   */
  constructor(questions, autoShuffle = true);
}
```

---

## 2. Métodos Públicos

### 2.1 `startSession()`
Reinicia e embaralha a sessão a partir da primeira questão.
- **Retorno**: `void`
- **Efeito colateral**: Zera contadores, limpa histórico de respostas, embaralha as 10 questões e as 4 alternativas de cada questão (via Fisher-Yates), define `currentIndex = 0`, `highestReachedIndex = 0` e `status = 'IN_PROGRESS'`.

---

### 2.2 `selectAlternative(alternativeId)`
Registra a seleção de uma das alternativas da questão ativa pelo estudante.
- **Parâmetros**:
  - `alternativeId` (`string`): ID da alternativa clicada (deve pertencer à questão ativa).
- **Retorno**: `boolean` (`true` se seleção foi aceita, `false` se a questão já estiver confirmada).
- **Regras**: Não permite alterar seleção se a questão atual já foi confirmada (`isConfirmed === true`).

---

### 2.3 `confirmAnswer()`
Confirma a alternativa selecionada na questão ativa e processa a avaliação pedagógica.
- **Retorno**: `EvaluationResult`
  ```javascript
  {
    success: boolean,        // true se havia alternativa selecionada e a confirmação ocorreu
    isCorrect?: boolean,     // true se a alternativa escolhida é a correta
    selectedId?: string,     // ID da alternativa escolhida
    correctId?: string,      // ID da alternativa correta
    explanation?: string,    // Explicação pedagógica
    error?: string           // "NO_SELECTION" se nenhuma alternativa foi selecionada
  }
  ```
- **Regras**:
  - Se nenhuma alternativa foi selecionada: retorna `{ success: false, error: 'NO_SELECTION' }`.
  - Se já estava confirmada: retorna o resultado já existente sem reprocessar pontuação.
  - Atualiza o contador de acertos/erros da sessão de forma determinística.

---

### 2.4 `nextQuestion()`
Avança sequencialmente para a próxima questão do quiz.
- **Retorno**: `NavigationResult`
  ```javascript
  {
    advanced: boolean,       // true se avançou ou concluiu
    isCompleted: boolean,    // true se a última questão (10ª) foi finalizada
    nextIndex?: number       // Novo índice da questão ativa (0 a 9)
  }
  ```
- **Regras**:
  - Só permite avançar se a questão ativa já estiver confirmada (`isConfirmed === true`).
  - Se `currentIndex < 9`: avança para `currentIndex + 1` e atualiza `highestReachedIndex`.
  - Se `currentIndex === 9`: finaliza a sessão (`status = 'COMPLETED'`) e retorna `isCompleted: true`.

---

### 2.5 `goToQuestion(index)`
Navega diretamente para uma questão específica da barra numérica de histórico.
- **Parâmetros**:
  - `index` (`number`): Índice alvo (0 a 9).
- **Retorno**: `boolean` (`true` se navegação permitida, `false` se bloqueada).
- **Regras**:
  - Só é permitida a navegação se `index <= highestReachedIndex`.
  - Se `index > highestReachedIndex`: bloqueia a navegação (retorna `false`), impedindo pulo de questões não respondidas.

---

### 2.6 `restart()`
Restaura o quiz ao estado inaugural.
- **Retorno**: `void`
- **Efeito**: Equivale a chamar `startSession()`.

---

### 2.7 `getCurrentQuestionState()`
Retorna a projeção do estado atual para consumo da camada de apresentação (UI).
- **Retorno**:
  ```javascript
  {
    index: number,                     // 0 a 9 (Questão index + 1)
    totalQuestions: 10,
    statement: string,
    alternatives: Array<{ id: string, text: string }>,
    selectedAlternativeId: string | null,
    isConfirmed: boolean,
    isCorrect: boolean | null,
    correctAlternativeId: string | null, // Revelado apenas se isConfirmed === true
    explanation: string | null,          // Revelado apenas se isConfirmed === true
    highestReachedIndex: number
  }
  ```

---

### 2.8 `getResult()`
Calcula e retorna os resultados finais consolidados.
- **Retorno**: `QuizResult`
  ```javascript
  {
    totalQuestions: 10,
    totalCorrect: number,
    totalIncorrect: number,
    percentage: number,                  // ex: 70
    tier: 'LOW' | 'MEDIUM' | 'HIGH',
    message: string
  }
  ```
