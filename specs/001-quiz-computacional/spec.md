# Feature Specification: Quiz Computacional

**Feature Branch**: `001-quiz-computacional`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "Desenvolver uma aplicação educacional chamada Quiz Computacional. A aplicação permitirá que um estudante pratique conhecimentos básicos de Computação respondendo questões de múltipla escolha. Ao iniciar o quiz, o estudante deverá visualizar uma questão por vez. Cada questão deverá apresentar: o enunciado, quatro alternativas, apenas uma alternativa correta. O estudante deverá selecionar uma alternativa e confirmar sua resposta. Depois da confirmação, a aplicação deverá informar se a resposta está correta ou incorreta. O estudante poderá então avançar para a próxima questão. O quiz terá inicialmente 10 questões. Ao finalizar todas as questões, a aplicação deverá apresentar: quantidade de acertos, quantidade de erros, percentual de acertos. O estudante deverá poder reiniciar o quiz. Não haverá cadastro ou autenticação nesta primeira versão."

## Clarifications

### Session 2026-09-26
- Q: Quando o estudante confirmar uma resposta incorreta, a aplicação deve revelar imediatamente qual era a alternativa correta e apresentar uma breve explicação pedagógica na própria tela? (FR-006) → A: Indicar o erro, destacar visualmente qual é a alternativa correta e exibir uma breve explicação pedagógica (Opção A).
- Q: O estudante pode retornar para visualizar questões e feedbacks anteriores durante o quiz, ou a navegação deve ser estritamente sequencial para a frente? (FR-008) → A: Permitir navegação livre entre as questões já respondidas por meio de um menu/barra numérica de questões (modo somente leitura com feedback mantido, sem alterar respostas já confirmadas) (Opção C).
- Q: Ao reiniciar o quiz (ou iniciar uma nova tentativa), o sistema deve embaralhar a ordem das questões e das alternativas, ou deve manter sempre a ordem original fixa? (FR-013) → A: Embaralhar aleatoriamente a ordem das 10 questões e a disposição das 4 alternativas a cada reinício/nova tentativa (Opção A).
- Q: Além da contagem de acertos, erros e percentual, a tela de resultados deve apresentar mensagens de avaliação pedagógica baseadas em faixas de aproveitamento? (FR-011) → A: Exibir acertos, erros, percentual e uma mensagem pedagógica de desempenho correspondente à faixa de aproveitamento atingida (Opção A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Resolução de Questões com Feedback Imediato (Priority: P1)

Como um estudante de conceitos introdutórios de computação,
quero visualizar uma questão por vez com quatro alternativas, selecionar minha resposta e confirmar para receber feedback imediato,
para que eu possa praticar e validar meus conhecimentos conceituais de forma interativa.

**Why this priority**: Constitui o núcleo funcional e pedagógico da aplicação (MVP). Sem a capacidade de ler a questão, escolher uma alternativa e receber feedback imediato, a aplicação educacional não cumpre seu objetivo primordial.

**Independent Test**: Pode ser testado de ponta a ponta iniciando o quiz, selecionando uma alternativa em uma questão, confirmando a resposta, verificando o retorno explícito de acerto/erro e avançando para a questão seguinte.

**Acceptance Scenarios**:

1. **Given** que o estudante iniciou o quiz, **When** a questão for renderizada na tela, **Then** o sistema deve exibir o enunciado e exatamente quatro alternativas distintas de resposta.
2. **Given** que o estudante selecionou uma das quatro alternativas, **When** acionar a ação de confirmação, **Then** o sistema deve registrar a escolha, bloquear alterações na questão atual e informar imediatamente se a resposta está correta ou incorreta; em caso de erro, deve destacar visualmente a alternativa correta e apresentar uma explicação pedagógica.
3. **Given** que a resposta foi confirmada e o feedback foi visualizado, **When** o estudante acionar o comando de avançar, **Then** o sistema deve apresentar a próxima questão da sequência com opções desmarcadas.
4. **Given** que nenhuma alternativa foi selecionada na questão em exibição, **When** o estudante tentar confirmar, **Then** o sistema não deve processar a confirmação e deve orientar a seleção de uma opção.
5. **Given** que o estudante já respondeu e confirmou questões anteriores, **When** selecionar o número de uma questão respondida na barra numérica, **Then** o sistema deve exibir a questão correspondente em modo somente leitura (mantendo a seleção do estudante, o gabarito e a explicação pedagógica) sem permitir alteração da resposta.

---

### User Story 2 - Apuração de Desempenho e Resultado Final (Priority: P2)

Como um estudante que completou o questionário,
quero visualizar um sumário com total de acertos, total de erros e meu percentual de aproveitamento,
para que eu compreenda meu nível de domínio sobre os tópicos de computação abordados.

**Why this priority**: Consolida a experiência de avaliação, fornecendo a métrica de aproveitamento global após a conclusão das 10 questões.

**Independent Test**: Pode ser testado respondendo a todas as 10 questões da aplicação e validando se a tela final exibe com exatidão matemática o número de acertos, o número de erros e a porcentagem correspondente.

**Acceptance Scenarios**:

1. **Given** que o estudante confirmou a resposta da 10ª (última) questão, **When** avançar para o encerramento do quiz, **Then** o sistema deve apresentar a tela de resultados finais.
2. **Given** que o estudante acertou 7 questões e errou 3 questões, **When** a tela de resultado for exibida, **Then** o sistema deve apresentar exatamente "Acertos: 7", "Erros: 3", "Aproveitamento: 70%" e a mensagem pedagógica condizente com a faixa de desempenho (ex.: "Bom desempenho! Continue praticando.").
3. **Given** que a tela de resultados foi carregada, **When** inspecionada, **Then** a soma de acertos e erros deve totalizar exatamente 10 questões.

---

### User Story 3 - Reinício do Questionário (Priority: P3)

Como um estudante na tela de resultados,
quero acionar a opção de reiniciar o quiz,
para que eu possa praticar novamente e tentar melhorar meu aproveitamento.

**Why this priority**: Promove o ciclo contínuo de aprendizado e fixação de conteúdo por meio de repetição deliberada sem necessidade de reiniciar a aplicação externamente.

**Independent Test**: Pode ser testado na tela de resultados finais acionando o botão de reiniciar e verificando se a aplicação retorna à primeira questão com contadores de pontuação e seleções zerados.

**Acceptance Scenarios**:

1. **Given** que o estudante se encontra na tela de resultados finais, **When** acionar o comando de reiniciar o quiz, **Then** o sistema deve restaurar o quiz para a Questão 1, redefinir os contadores de acertos e erros para zero, limpar seleções prévias e embaralhar aleatoriamente a ordem das 10 questões bem como as 4 alternativas de cada questão.

---

### Edge Cases

- **Tentativa de confirmação sem seleção**: Se o estudante acionar o botão de confirmação sem ter escolhido nenhuma alternativa, a confirmação deve ser impedida, mantendo o estudante na mesma questão com indicação visual para selecionar uma alternativa.
- **Tentativa de avançar antes de confirmar**: O botão de avanço para a questão seguinte não deve permitir prosseguir até que a confirmação da questão atual tenha sido efetivamente realizada.
- **Tentativa de alteração pós-confirmação**: Uma vez confirmada a alternativa, a seleção fica travada para evitar que o estudante altere sua resposta após ver o feedback de acerto ou erro.
- **Navegação na última questão**: Na 10ª questão, após a confirmação do feedback, o comando de avançar deve direcionar explicitamente para a tela de resultados finais em vez de tentar buscar uma 11ª questão.
- **Acesso a questões futuras na barra numérica**: Números de questões ainda não alcançadas na barra numérica devem permanecer desabilitados para clique, impedindo que o estudante pule questões sem responder a questão corrente.
- **Integridade do gabarito no embaralhamento**: O embaralhamento aleatório das 10 questões e das 4 alternativas de cada questão deve garantir que a associação de cada alternativa com sua condição de acerto/erro e explicação permaneça íntegra e sem distorções.
- **Recarregamento ou reinício prematuro**: Se a aplicação for recarregada pelo estudante durante a resolução, o comportamento padrão previsto para esta versão sem persistência é reiniciar a sessão a partir da primeira questão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE apresentar exatamente uma questão por vez durante a execução do quiz.
- **FR-002**: Cada questão DEVE apresentar um enunciado compreensível e estritamente quatro alternativas de resposta.
- **FR-003**: Cada questão DEVE conter rigorosamente uma única alternativa correta e três alternativas incorretas (distratores).
- **FR-004**: O sistema DEVE permitir que o estudante escolha apenas uma alternativa por questão antes de confirmar.
- **FR-005**: O sistema DEVE exigir que uma alternativa seja selecionada antes de permitir a confirmação da resposta.
- **FR-006**: O sistema DEVE fornecer feedback imediato logo após a confirmação da alternativa: indicar acerto ou erro, destacar visualmente a alternativa correta em caso de erro e exibir uma breve explicação pedagógica justificando a resposta.
- **FR-007**: O sistema DEVE congelar/desabilitar a modificação da alternativa selecionada imediatamente após a confirmação.
- **FR-008**: O sistema DEVE disponibilizar uma barra ou menu numérico de questões (1 a 10) que permita ao estudante navegar livremente para rever questões já respondidas em modo somente leitura, mantendo questões futuras bloqueadas até que a questão corrente seja confirmada.
- **FR-009**: O quiz DEVE disponibilizar inicialmente um conjunto estruturado de exatamente 10 questões abordando fundamentos básicos de computação.
- **FR-010**: O sistema DEVE computar a pontuação de forma 100% automática, registrando o total de acertos e erros acumulados.
- **FR-011**: Ao finalizar a 10ª questão, o sistema DEVE exibir a tela de resultado com a quantidade de acertos, a quantidade de erros, o percentual de acertos e uma mensagem pedagógica qualitativa de aproveitamento (ex.: abaixo de 50%, de 50% a 70%, 80% ou mais).
- **FR-012**: O percentual de acertos DEVE ser calculado matematicamente pela fórmula: `(total_acertos / total_questoes) * 100`.
- **FR-013**: O sistema DEVE disponibilizar uma ação de reinício do quiz na tela de resultados que restaure a aplicação para a Questão 1 com a pontuação zerada, embaralhando aleatoriamente a ordem das 10 questões e a disposição das 4 alternativas de cada questão.
- **FR-014**: O sistema NÃO DEVE requerer qualquer modalidade de cadastro, credenciais ou autenticação para a utilização do quiz nesta versão.
- **FR-015**: O sistema DEVE permitir a transição sequencial para a próxima questão não respondida exclusivamente após a confirmação da resposta da questão atual.

### Key Entities *(include if feature involves data)*

- **Questao**: Representa a unidade avaliativa de computação. Possui atributos conceituais como identificador único, texto do enunciado, coleção de exatamente 4 alternativas, indicador da alternativa correta e texto de feedback pedagógico.
- **Alternativa**: Representa cada uma das 4 opções de resposta vinculadas a uma questão, contendo um identificador e o texto explicativo da opção.
- **SessaoQuiz**: Modela o estado da tentativa em andamento de um estudante, contendo o índice da questão atual (1 a 10), alternativa selecionada no momento, estado de confirmação (respondida ou pendente), contador de acertos e contador de erros.
- **ResultadoQuiz**: Modela o consolidado de aproveitamento ao final das 10 questões, contendo contagem de acertos, contagem de erros, total de questões (10), percentual de aproveitamento apurado e mensagem de orientação pedagógica associada à faixa atingida.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O estudante deve conseguir iniciar a resolução do quiz imediatamente após abrir a aplicação, em menos de 3 segundos, sem qualquer barreira de login ou formulários prévios.
- **SC-002**: 100% das questões exibidas na aplicação contêm rigorosamente quatro alternativas e uma única resposta correta verificável.
- **SC-003**: O feedback sobre acerto ou erro deve ser exibido ao estudante em menos de 500 milissegundos após a ação de confirmação da resposta.
- **SC-004**: O cálculo final de acertos, erros e percentual deve atingir 100% de exatidão matemática em qualquer combinação de respostas submetidas.
- **SC-005**: 100% dos estudantes que alcançarem a tela de resultados conseguem reiniciar o quiz com apenas uma interação (um clique), retornando ao estado inicial com sucesso.

## Assumptions

- A aplicação será executada em ambiente padrão de navegador web (computadores de mesa, laptops ou dispositivos móveis).
- O banco de 10 questões de computação básica será incorporado estaticamente na aplicação nesta versão inicial, sem necessidade de conexão com banco de dados externo ou servidor remoto.
- Os tópicos de computação básica cobrirão conceitos fundamentais como lógica de programação, representação de dados (binário/bits), hardware e software, redes e algoritmos simples.
- Como não há autenticação ou persistência externa nesta versão, o encerramento da aba ou recarregamento forçado da página pelo navegador reinicia a sessão do quiz para a Questão 1.
- Toda a interface gráfica, enunciados das questões, alternativas e mensagens de feedback serão disponibilizados em Português do Brasil (PT-BR).
