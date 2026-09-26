# Implementation Plan: Quiz Computacional

**Branch**: `001-quiz-computacional` | **Date**: 2026-09-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-quiz-computacional/spec.md`

## Summary

O Quiz Computacional é uma aplicação web educacional estática e responsiva, desenvolvida em HTML5 semântico, CSS3 moderno e Vanilla JavaScript (ES6+), sem a utilização de frameworks frontend, backend ou bancos de dados. A aplicação apresenta sequencialmente 10 questões de múltipla escolha sobre fundamentos de computação (com exatamente 4 alternativas e 1 gabarito correto por questão) carregadas a partir de um arquivo JSON local. A arquitetura é rigorosamente particionada em três camadas desacopladas: **Apresentação** (`index.html`, CSS e `quiz-ui.js`), **Dados** (`questions.json` e carregador) e **Lógica do Quiz** (`quiz-engine.js`), fornecendo feedback imediato com justificativa pedagógica, barra numérica de revisão de histórico, apuração automática de pontuação com faixas qualitativas de aproveitamento e reinício com embaralhamento Fisher-Yates.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript puro (ECMAScript 2022 / ES6+)

**Primary Dependencies**: Nenhuma (Vanilla Web Platform pura, zero frameworks ou bibliotecas externas)

**Storage**: Arquivo estático local `data/questions.json` para o banco de 10 questões; estado da sessão gerenciado em memória pelo runtime JavaScript

**Testing**: Testes unitários e de integração utilizando o test runner nativo do Node.js (`node:test` e `node:assert`) sem dependências npm

**Target Platform**: Navegadores web modernos (Chrome, Firefox, Safari, Edge) em desktop, tablets e smartphones (Mobile-First responsivo)

**Project Type**: Single Page Application (SPA) web estática desacoplada

**Performance Goals**: Carregamento da página < 1s; resposta visual a cliques/seleção < 50ms; exibição de feedback imediato < 200ms

**Constraints**: Funcionamento direto no navegador (suporte a servidor HTTP local e fallback para protocolo `file://`); código estritamente modularizado separando apresentação, dados e lógica; sem backend, autenticação ou banco de dados

**Scale/Scope**: 10 questões fundamentais de computação, 4 alternativas por questão, 1 tela principal com alternância de estados (quiz ativo e resultado final)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio Constitucional | Status | Justificativa / Mecanismo de Conformidade |
|---|---|---|
| **I. Interface Amigável para Estudantes** | **PASS** | Layout limpo, responsivo, sem distrações cognitivas ou termos excessivamente técnicos na interface. |
| **II. Organização, Legibilidade e Manutenibilidade** | **PASS** | Código categorizado em pastas dedicadas (`css/`, `js/data/`, `js/logic/`, `js/ui/`), separando completamente DOM e regras de negócio. |
| **III. Quatro Alternativas Exatas por Questão** | **PASS** | JSON Schema e validação em tempo de execução no `QuizEngine` garantem rigorosamente 4 alternativas por questão. |
| **IV. Alternativa Correta Única** | **PASS** | Cada questão no JSON possui exatamente um `correctAlternativeId` mapeado para uma das 4 opções, com 3 distratores. |
| **V. Feedback Imediato ao Estudante** | **PASS** | Ao confirmar a resposta, a interface exibe imediatamente indicação de acerto ou erro, destaca o gabarito e exibe a explicação pedagógica. |
| **VI. Cálculo Automático de Pontuação** | **PASS** | O `QuizEngine` calcula acertos, erros e o percentual `(acertos / 10) * 100` de forma determinística e automática. |
| **VII. Simplicidade e Minimalismo de Dependências** | **PASS** | Uso exclusivo de HTML5, CSS3 e JS puro. Zero dependências externas de produção. |
| **VIII. Verificabilidade Objetiva e Testabilidade** | **PASS** | `QuizEngine` testável de forma unitária sem emulação de DOM através de `node --test tests/`. |

## Project Structure

### Documentation (this feature)

```text
specs/001-quiz-computacional/
├── spec.md              # Especificação de requisitos e esclarecimentos
├── plan.md              # Este plano de implementação técnica
├── research.md          # Pesquisa técnica e decisões de arquitetura
├── data-model.md        # Entidades, validações e máquina de estados
├── quickstart.md        # Guia de inicialização e cenários de teste ponta a ponta
└── contracts/           # Contratos formais de interfaces
    ├── questions-schema.json    # Schema JSON da base de 10 questões
    ├── quiz-engine-api.md       # Contrato da API da lógica de negócio
    └── ui-states-contract.md    # Contrato de apresentação e estados da UI
```

### Source Code (repository root)

```text
quiz-computacional/
├── index.html                   # Estrutura semântica HTML5 e contêineres principais
├── data/
│   └── questions.json           # Banco estático de 10 questões sobre fundamentos de computação
├── css/
│   ├── style.css                # Estilos base, variáveis CSS, tipografia e componentes visuais
│   └── responsive.css           # Regras de responsividade mobile-first e adaptações de tela
├── js/
│   ├── data/
│   │   └── question-loader.js   # Carregador de dados com fallback para fetch/file protocol
│   ├── logic/
│   │   └── quiz-engine.js       # Lógica pura do quiz, máquina de estados, pontuação e Fisher-Yates
│   └── ui/
│       └── quiz-ui.js           # Gerenciador de eventos do DOM, renderização e feedback
├── tests/
│   ├── quiz-engine.test.js      # Testes unitários automatizados da lógica e pontuação
│   └── questions-data.test.js   # Testes automatizados de validação dos dados de questions.json
└── package.json                 # Definição de scripts de execução de testes (node --test)
```

**Structure Decision**: A estrutura foi concebida para atender à exigência expressa do usuário de separação estrita entre apresentação (`index.html`, `css/`, `js/ui/`), dados (`data/`, `js/data/`) e lógica do quiz (`js/logic/`). O isolamento de `quiz-engine.js` garante que a lógica de avaliação educacional permaneça 100% testável independentemente do navegador.

## Complexity Tracking

> **Nenhuma violação constitucional detectada.** A arquitetura adotada mantém a complexidade estritamente mínima e essencial para a entrega dos requisitos.
