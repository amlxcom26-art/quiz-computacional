# Quiz Computacional 💻🎯

> Uma aplicação web interativa, responsiva e educacional para prática e fixação de conceitos fundamentais de Ciência da Computação.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen?style=for-the-badge)
![License MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 🌐 Demonstração Online (GitHub Pages)

Acesse a aplicação em tempo real diretamente pelo navegador:  
👉 **[https://amlxcom26-art.github.io/quiz-computacional/](https://amlxcom26-art.github.io/quiz-computacional/)**

---

## 📌 Sobre o Projeto

O **Quiz Computacional** foi desenvolvido com o propósito de auxiliar estudantes na autoavaliação e aprendizado ativo de fundamentos da computação. A aplicação funciona integralmente no navegador (client-side), sem necessidade de frameworks pesados, bibliotecas externas ou backend complexo.

### 🌟 Principais Funcionalidades

- **10 Questões Abrangentes**: Cobre Hardware, Sistemas Operacionais, Redes de Computadores, Algoritmos, Aritmética Binária, Memória Cache/RAM, Compiladores, Bancos de Dados, Segurança da Informação e Computação em Nuvem.
- **Rigor Estrutural**: Cada questão possui exatamente 4 alternativas (1 gabarito oficial e 3 distratores plausíveis).
- **Feedback Pedagógico Imediato**: Ao confirmar cada resposta, o estudante visualiza instantaneamente se acertou (verde) ou errou (vermelho), com destaque da alternativa correta e explicação conceitual detalhada.
- **Congelamento Pós-Confirmação**: Impede a alteração da resposta após a submissão para preservar a integridade da avaliação.
- **Barra Numérica de Navegação e Revisão**: Permite navegar e revisar questões já respondidas em modo somente leitura, enquanto questões futuras permanecem bloqueadas até a confirmação sequencial.
- **Apuração Final Inteligente**: Relatório consolidado com total de acertos, erros, porcentagem de aproveitamento e mensagem qualitativa por faixa de pontuação (<50%, 50–70%, ≥80%).
- **Reinício com Embaralhamento**: Reinicia a sessão reordenando aleatoriamente as questões e as 4 alternativas via **Fisher-Yates Shuffle**, garantindo dinamismo e gabarito sempre consistente.
- **Design Mobile-First e Acessível**: Totalmente responsivo para smartphones e desktops, alvos de toque $\ge 48\text{px}$, foco visível e navegação por teclado (Enter, Espaço e Setas).

---

## 🏛️ Arquitetura em 3 Camadas

O código foi construído com estrita separação de responsabilidades e desacoplamento:

```
quiz-computacional/
├── css/
│   ├── style.css           # Variáveis visuais (Design Tokens), temas e componentes
│   └── responsive.css      # Otimização mobile-first e acessibilidade de foco
├── data/
│   └── questions.json      # Base de dados estruturada com as 10 questões
├── js/
│   ├── data/
│   │   └── question-loader.js  # Carregador assíncrono com fallback para file://
│   ├── logic/
│   │   └── quiz-engine.js      # Motor puro de regras de negócio (isolado do DOM)
│   └── ui/
│       └── quiz-ui.js          # Camada de apresentação e manipulação do DOM
├── tests/
│   ├── questions-data.test.js  # Testes de validação da base de dados JSON
│   └── quiz-engine.test.js     # Testes unitários do motor de lógica
├── index.html              # Estrutura semântica HTML5
├── package.json            # Configuração e script de testes (Zero dependências)
└── README.md               # Documentação do projeto
```

1. **Camada de Apresentação (UI)** (`index.html`, `css/`, `js/ui/quiz-ui.js`):
   Responsável pela interface do usuário, eventos de clique/teclado, classes CSS de feedback e transição entre telas (`#quiz-view` e `#results-view`).
2. **Camada de Lógica de Negócio (Engine)** (`js/logic/quiz-engine.js`):
   Motor puro em Vanilla JS, sem qualquer dependência do DOM (`window` ou `document`). Gerencia a máquina de estados, validação de respostas, cálculo de pontuação e embaralhamento. Permite execução tanto no navegador quanto em ambientes de teste headless (Node.js).
3. **Camada de Dados** (`data/questions.json`, `js/data/question-loader.js`):
   Fonte única de verdade das questões. Inclui carregamento assíncrono padrão via `fetch()` e um *fallback* inteligente para quando o estudante abre o arquivo diretamente sem servidor web.

---

## 🚀 Como Executar

A aplicação é 100% estática e não exige comandos de build (`npm install`, webpack, etc.).

### Opção 1: Servidor HTTP Local (Recomendado)
Para evitar bloqueios de CORS ao ler arquivos JSON locais:
```bash
# Utilizando Python (já presente na maioria dos sistemas):
python -m http.server 8000
```
Em seguida, abra o navegador em: [http://localhost:8000](http://localhost:8000)

### Opção 2: Abertura Direta (Sem Servidor)
Basta dar um duplo clique no arquivo [`index.html`](index.html) ou abri-lo pelo navegador (`file:///caminho/para/index.html`). O mecanismo de *fallback* embutido carregará o quiz imediatamente.

### Opção 3: Publicação no GitHub Pages
O projeto já está 100% preparado com `.nojekyll`, caminhos relativos e workflow do GitHub Actions (`.github/workflows/deploy.yml`):
1. Acesse o seu repositório no GitHub: **[amlxcom26-art/quiz-computacional](https://github.com/amlxcom26-art/quiz-computacional)**
2. Clique na aba **Settings** (Configurações) > **Pages** (no menu lateral esquerdo).
3. Na seção **Build and deployment**:
   - Em **Source**, selecione **GitHub Actions** (para deploy automático contínuo via workflow) OU **Deploy from a branch** (selecionando a branch `main` e pasta `/ (root)`).
4. Em instantes, sua aplicação estará no ar no endereço:  
   👉 **[https://amlxcom26-art.github.io/quiz-computacional/](https://amlxcom26-art.github.io/quiz-computacional/)**

---

## 🧪 Testes Automatizados

O projeto utiliza o **Test Runner nativo do Node.js** (`node:test` e `node:assert`), eliminando a necessidade de instalar bibliotecas pesadas de testes como Jest ou Vitest.

Para rodar todos os testes automatizados:
```bash
npm test
```
Ou diretamente pelo Node:
```bash
node --test tests/questions-data.test.js tests/quiz-engine.test.js
```

### O que é validado pelos testes?
- **Schema e Integridade dos Dados**: Valida se `questions.json` contém exatamente 10 questões, exatamente 4 alternativas por questão, 1 gabarito válido e explicações não vazias.
- **Regras de Negócio**: Valida seleção única, bloqueio de confirmação sem seleção, avaliação de acerto e erro, travamento pós-confirmação e bloqueio de saltos não permitidos na barra numérica.
- **Cálculo de Desempenho**: Valida fórmulas de porcentagem e mapeamento correto de mensagens pedagógicas por faixas.
- **Embaralhamento Fisher-Yates**: Valida que a ordem das questões e alternativas muda mantendo o gabarito 100% íntegro.

---

## ♿ Acessibilidade e Teclado

A aplicação foi projetada com boas práticas de usabilidade e WAI-ARIA:
- `role="radiogroup"` e `role="radio"` para alternativas.
- `aria-live="polite"` na área de progresso e feedbacks imediatos para leitores de tela.
- Navegação por teclado:
  - <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>: Percorre os elementos interativos.
  - <kbd>↑</kbd> / <kbd>↓</kbd> (Setas): Alterna entre as opções de resposta.
  - <kbd>Enter</kbd> ou <kbd>Espaço</kbd>: Seleciona a alternativa focada ou confirma/avança.
  - Anéis de foco nítidos (`:focus-visible`) para usuários que navegam sem mouse.

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo de licença para mais detalhes.