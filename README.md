# quiz-computacional

Aplicação web educacional interativa desenvolvida para estudantes praticarem conceitos fundamentais de computação (Hardware, Sistemas Operacionais, Redes, Algoritmos, Binário, Memória, Compiladores, Banco de Dados, Segurança e Nuvem).

## 🚀 Tecnologias Utilizadas

- **HTML5** Estrutura semântica e acessível (WAI-ARIA)
- **CSS3** Estilização moderna, variáveis CSS (Design Tokens) e layout responsivo Mobile-First
- **JavaScript Puro** (ES6+ Vanilla, sem frameworks frontend)
- **Node.js** Test runner nativo (`node --test`) para garantia de qualidade sem dependências externas de runtime

## 🏛️ Arquitetura e Organização

O projeto adota uma arquitetura em 3 camadas estritas:
1. **Camada de Apresentação (UI)** (`index.html`, `css/style.css`, `css/responsive.css`, `js/ui/quiz-ui.js`):
   - Renderização dinâmica do questionário e da barra numérica de navegação.
   - Feedback visual imediato com destaque de acertos/erros e explicações pedagógicas.
   - Navegação por teclado completa e alvos de toque otimizados para smartphones ($\ge 48\text{px}$).
2. **Camada de Lógica de Negócio (Engine)** (`js/logic/quiz-engine.js`):
   - Motor puro totalmente desacoplado do DOM e testável no Node.js.
   - Máquina de estados da sessão do quiz (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`).
   - Algoritmo de embaralhamento **Fisher-Yates (Knuth Shuffle)** com preservação estrita da integridade do gabarito.
   - Apuração de métricas de desempenho e categorização por faixas de aproveitamento.
3. **Camada de Dados** (`data/questions.json`, `js/data/question-loader.js`):
   - 10 questões rigorosamente com 4 alternativas cada, 1 única correta e 3 distratores.
   - Carregador assíncrono com suporte a servidores HTTP e fallback automático para o protocolo `file://`.

## 📦 Como Executar a Aplicação

Não requer comandos de build nem instalação de dependências npm (`npm install`).

### Opção 1: Servidor HTTP Local (Recomendado)
Para executar via servidor local e testar requisições assíncronas padrão:
```bash
# Via Python:
python -m http.server 8000
```
Em seguida, abra o navegador em: `http://localhost:8000`

### Opção 2: Execução Direta via Navegador
Dê um duplo clique no arquivo `index.html` ou abra pelo caminho no navegador (`file:///.../index.html`). O sistema conta com fallback automático para execução local imediata.

## 🧪 Testes Automatizados

Para rodar todos os testes unitários do motor e validação de schema das questões:
```bash
npm test
# ou diretamente via Node.js nativo:
node --test tests/questions-data.test.js tests/quiz-engine.test.js
```

## 📄 Licença

Este projeto está sob a licença MIT.
