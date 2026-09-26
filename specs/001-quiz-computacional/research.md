# Research & Technical Decisions: Quiz Computacional

**Feature**: [spec.md](spec.md) | **Date**: 2026-09-26

Este documento consolida a pesquisa técnica, decisões de arquitetura e mitigação de riscos para a implementação do Quiz Computacional como aplicação web estática.

---

## 1. Arquitetura da Aplicação Web sem Frameworks

### Decisão
Adotar uma arquitetura modular em Vanilla JavaScript (ES6+), orientada a eventos e separada em três camadas estritas:
1. **Camada de Apresentação (UI / View)**: `js/ui/quiz-ui.js` + `index.html` + `css/style.css` e `css/responsive.css`. Responsável por renderizar o DOM, manipular classes visuais (feedback verde/vermelho, estados de botões) e capturar eventos do usuário.
2. **Camada de Lógica de Negócio (Engine / State)**: `js/logic/quiz-engine.js`. Módulo puro (sem dependência de DOM / `window` / `document`), implementando a máquina de estados da sessão do quiz, regras de pontuação, validação de alternativas, controle da barra numérica e embaralhamento.
3. **Camada de Dados**: `data/questions.json` + `js/data/question-loader.js`. Fonte única de verdade das questões de fundamentos de computação.

### Rationale
- Cumpre estritamente os Princípios II (Organização e Manutenibilidade) e VII (Simplicidade e Minimalismo) da Constituição do projeto.
- Ao manter `quiz-engine.js` totalmente desacoplado do DOM, viabiliza-se a testabilidade automatizada e isolada (Princípio VIII) usando o test runner nativo do Node.js sem necessidade de emuladores pesados de DOM como JSDOM.

### Alternativas Consideradas
- **Micro-frameworks (ex.: Preact, Alpine.js, Lit)**: Rejeitados por violar a restrição explícita do usuário ("JavaScript puro, não utilizar frameworks frontend") e o Princípio VII da Constituição.
- **Script monolítico único (`app.js`)**: Rejeitado pois acoplaria manipulação de DOM à lógica de pontuação, dificultando testes unitários e manutenções futuras.

---

## 2. Carregamento de Dados Locais (JSON) e Compatibilidade de Execução

### Decisão
Implementar um módulo de carregamento (`question-loader.js`) que realiza `fetch('data/questions.json')` quando executado sob protocolo HTTP/HTTPS (ex.: servidor estático local, Live Server, `npx serve` ou Python HTTP server), e fornece um *fallback* seguro embutido caso o estudante abra o arquivo diretamente via protocolo `file://` (onde restrições de CORS do navegador podem bloquear requisições `fetch` locais).

### Rationale
- Permite que a aplicação funcione em qualquer cenário: tanto em servidores de hospedagem estática quanto em ambientes acadêmicos onde o aluno apenas dá dois cliques em `index.html`.
- Garante conformidade com o requisito do usuário: "As questões devem ficar inicialmente em um arquivo JSON local. A aplicação deve funcionar diretamente no navegador."

### Alternativas Consideradas
- **Apenas `fetch('questions.json')` estrito**: Poderia causar falha silenciosa de CORS se o estudante abrir diretamente via duplo clique (`file:///.../index.html`) no Chrome ou Edge.
- **Armazenar questões hardcoded em variável JS global**: Rejeitado, pois desrespeitaria o requisito expresso de manter as questões em arquivo JSON isolado.

---

## 3. Algoritmo de Embaralhamento (Shuffling) e Integridade de Gabarito

### Decisão
Utilizar o algoritmo clássico de **Fisher-Yates (Knuth) Shuffle** em `quiz-engine.js`.
- O algoritmo é aplicado de forma desacoplada: primeiro para permutar a lista das 10 questões; depois, para permutar as 4 alternativas de cada questão.
- Cada alternativa possui um identificador imutável (ex.: `id: "alt_1"`, `id: "alt_2"`). O gabarito na questão aponta para o `correctAlternativeId` imutável.

### Rationale
- O Fisher-Yates possui complexidade $O(N)$ em tempo e $O(1)$ em memória, garantindo distribuição estatisticamente uniforme e justa.
- Usar IDs estáveis desacopla o gabarito da posição física da alternativa (A, B, C, D ou índices 0 a 3), eliminando qualquer risco de corrupção do gabarito durante o embaralhamento.

### Alternativas Consideradas
- **`array.sort(() => Math.random() - 0.5)`**: Rejeitado formalmente, pois introduz viés estatístico significativo e não garante aleatoriedade homogênea entre diferentes engines de JavaScript.

---

## 4. Estratégia de Responsividade (Desktop e Smartphone)

### Decisão
Adotar abordagem **Mobile-First** utilizando CSS3 puro moderno:
- **Layout Flexbox e CSS Grid** com unidades relativas (`rem`, `%`, `clamp()`).
- Breakpoints simples:
  - Mobile: `< 600px` (alternativas dispostas verticalmente em pilha, botões com altura mínima de 48px para toque confortável, barra numérica horizontal com rolagem suave ou grid compacto).
  - Tablet/Desktop: `>= 600px` (conteúdo centralizado em container card com largura máxima de 760px, tipografia proporcional e espaçamento refinado).
- Eliminação total de bibliotecas de UI (sem Bootstrap, Tailwind ou bibliotecas externas de ícones). Ícones e marcadores visuais usarão caracteres Unicode / SVG inline leves.

### Rationale
- Atende ao Princípio I da Constituição (Interface Amigável e simples para estudantes) e ao requisito de responsividade em desktop e smartphone com zero dependências externas.

---

## 5. Estratégia de Testes Automatizados

### Decisão
Utilizar o **Node.js Native Test Runner** (`node:test` e `node:assert`), disponível a partir do Node.js v18/v20+, para executar testes unitários automatizados da lógica de negócio e validação estrutural do JSON.

### Rationale
- **Zero Dependências**: Não exige instalação de `jest`, `mocha`, `vitest` ou `npm install`. Basta executar `node --test tests/`.
- Permite validação objetiva (Princípio VIII) das regras de cálculo de pontuação, porcentagem, integridade das 4 alternativas, seleção única, bloqueio pós-confirmação e garantia de embaralhamento sem alterar gabarito.
