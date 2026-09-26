/**
 * Módulo de Carregamento de Questões - Quiz Computacional
 * Suporta fetch assíncrono (servidor HTTP) e fallback embutido (protocolo file://)
 */

export const FALLBACK_QUESTIONS = [
  {
    id: "q01",
    statement: "Qual é a menor unidade básica de informação tratada por um computador digital?",
    alternatives: [
      { id: "q01_a", text: "Bit (dígito binário 0 ou 1)" },
      { id: "q01_b", text: "Byte (conjunto de 8 bits)" },
      { id: "q01_c", text: "Kilobyte (1024 bytes)" },
      { id: "q01_d", text: "Pixel (ponto de exibição gráfico)" }
    ],
    correctAlternativeId: "q01_a",
    explanation: "O bit (binary digit) é a unidade atômica fundamental da computação digital, podendo assumir exclusivamente os valores 0 ou 1. Um byte, por sua vez, é formado por um agrupamento de 8 bits."
  },
  {
    id: "q02",
    statement: "Sobre a memória RAM (Random Access Memory) de um computador, é correto afirmar que:",
    alternatives: [
      { id: "q02_a", text: "É uma memória volátil que perde seus dados quando o computador é desligado." },
      { id: "q02_b", text: "É uma memória permanente utilizada para guardar arquivos pessoais e fotos." },
      { id: "q02_c", text: "É mais lenta que um disco rígido convencional (HDD)." },
      { id: "q02_d", text: "Substitui completamente a necessidade de uma CPU no sistema." }
    ],
    correctAlternativeId: "q02_a",
    explanation: "A memória RAM é volátil, ou seja, necessita de energia elétrica contínua para reter informações. Quando o computador é desligado, todo o seu conteúdo temporário é esvaziado."
  },
  {
    id: "q03",
    statement: "Qual é a função primordial da Unidade Central de Processamento (CPU / Processador)?",
    alternatives: [
      { id: "q03_a", text: "Executar instruções de programas, realizar cálculos aritméticos e operações lógicas." },
      { id: "q03_b", text: "Fornecer energia elétrica para todos os componentes internos da placa-mãe." },
      { id: "q03_c", text: "Apenas exibir imagens e vídeos na tela do monitor." },
      { id: "q03_d", text: "Armazenar fisicamente todos os programas instalados de forma permanente." }
    ],
    correctAlternativeId: "q03_a",
    explanation: "A CPU é considerada o cérebro do computador. Ela busca, decodifica e executa as instruções dos programas armazenados na memória, realizando cálculos lógicos e aritméticos."
  },
  {
    id: "q04",
    statement: "Em programação, o que caracteriza formalmente um 'Algoritmo'?",
    alternatives: [
      { id: "q04_a", text: "Uma sequência finita, ordenada e não ambígua de instruções para solucionar um problema." },
      { id: "q04_b", text: "Uma peça de hardware instalada no gabinete para acelerar gráficos 3D." },
      { id: "q04_c", text: "Um erro de sintaxe que impede o programa de ser compilado." },
      { id: "q04_d", text: "Uma linguagem de programação proprietária criada pela Microsoft." }
    ],
    correctAlternativeId: "q04_a",
    explanation: "Um algoritmo é uma receita passo a passo: um conjunto finito de ações claras e ordenadas que transformam dados de entrada em uma saída esperada para solucionar uma tarefa."
  },
  {
    id: "q05",
    statement: "Qual dos seguintes softwares exemplifica um Sistema Operacional?",
    alternatives: [
      { id: "q05_a", text: "Linux" },
      { id: "q05_b", text: "Google Chrome" },
      { id: "q05_c", text: "Microsoft Word" },
      { id: "q05_d", text: "HTML5" }
    ],
    correctAlternativeId: "q05_a",
    explanation: "Linux (assim como Windows e macOS) é um sistema operacional, responsável por gerenciar os recursos de hardware, processos e prover uma camada de interface para a execução de outros softwares."
  },
  {
    id: "q06",
    statement: "Em lógica de programação, qual estrutura é utilizada para desviar o fluxo de execução baseado em uma condição verdadeira ou falsa?",
    alternatives: [
      { id: "q06_a", text: "Estrutura condicional (if / else)" },
      { id: "q06_b", text: "Variável global" },
      { id: "q06_c", text: "Comentário de código" },
      { id: "q06_d", text: "Declaração de constante matemática" }
    ],
    correctAlternativeId: "q06_a",
    explanation: "As estruturas condicionais (como se/senão ou if/else) avaliam uma expressão lógica booleana e decidem qual bloco de código deve ser executado de acordo com o resultado."
  },
  {
    id: "q07",
    statement: "No contexto das redes de computadores e da Internet, o que é um endereço IP?",
    alternatives: [
      { id: "q07_a", text: "Um identificador numérico exclusivo associado a cada dispositivo em uma rede." },
      { id: "q07_b", text: "O nome de usuário utilizado para acessar redes Wi-Fi públicas." },
      { id: "q07_c", text: "A velocidade máxima de transmissão do cabo de fibra óptica." },
      { id: "q07_d", text: "Um programa antivírus instalado no roteador." }
    ],
    correctAlternativeId: "q07_a",
    explanation: "O Protocolo de Internet (IP) atribui um endereço numérico único a cada dispositivo conectado a uma rede, permitindo o endereçamento, roteamento e entrega de pacotes de dados."
  },
  {
    id: "q08",
    statement: "Em lógica booleana, para que a operação lógica 'E' (AND) resulte em VERDADEIRO (True), é necessário que:",
    alternatives: [
      { id: "q08_a", text: "Todas as proposições de entrada sejam obrigatoriamente verdadeiras." },
      { id: "q08_b", text: "Pelo menos uma das proposições de entrada seja verdadeira." },
      { id: "q08_c", text: "Todas as proposições de entrada sejam falsas." },
      { id: "q08_d", text: "Apenas a primeira proposição seja verdadeira e as demais falsas." }
    ],
    correctAlternativeId: "q08_a",
    explanation: "Na tabela-verdade do operador lógico E (AND), a saída só é verdadeira quando todas as entradas analisadas forem simultaneamente verdadeiras (1 AND 1 = 1)."
  },
  {
    id: "q09",
    statement: "Qual é a principal diferença entre um Compilador e um Interpretador?",
    alternatives: [
      { id: "q09_a", text: "O compilador traduz todo o código antes da execução, enquanto o interpretador o analisa linha por linha durante a execução." },
      { id: "q09_b", text: "O compilador serve apenas para desenhar interfaces visuais e o interpretador para gerenciar memórias." },
      { id: "q09_c", text: "O compilador executa apenas no smartphone e o interpretador no computador desktop." },
      { id: "q09_d", text: "Não existe diferença; ambos são sinônimos perfeitos da mesma tecnologia." }
    ],
    correctAlternativeId: "q09_a",
    explanation: "Compiladores traduzem o código-fonte integralmente em código de máquina (ou bytecode) gerando um executável prévio, enquanto interpretadores leem, traduzem e executam as instruções sequencialmente em tempo real."
  },
  {
    id: "q10",
    statement: "Na estrutura de dados do tipo 'Fila' (Queue), qual regra define a inserção e remoção de elementos?",
    alternatives: [
      { id: "q10_a", text: "FIFO (First In, First Out): o primeiro elemento a entrar é o primeiro a sair." },
      { id: "q10_b", text: "LIFO (Last In, First Out): o último elemento a entrar é o primeiro a sair." },
      { id: "q10_c", text: "Random Access: elementos são removidos em ordem estritamente aleatória." },
      { id: "q10_d", text: "Priority Invert: elementos mais novos sempre cancelam os mais antigos." }
    ],
    correctAlternativeId: "q10_a",
    explanation: "Uma fila segue a regra FIFO (Primeiro a Entrar, Primeiro a Sair), similar a uma fila de banco do mundo real: os novos itens chegam ao final e os itens atendidos/removidos saem pela frente."
  }
];

/**
 * Carrega a base de 10 questões, priorizando fetch assíncrono e usando fallback em caso de erro
 * @param {string} [dataPath='data/questions.json'] Caminho do arquivo JSON
 * @returns {Promise<Array>} Array com 10 questões
 */
export async function loadQuestions(dataPath = 'data/questions.json') {
  if (typeof fetch === 'function') {
    try {
      const response = await fetch(dataPath);
      if (response.ok) {
        const questions = await response.json();
        if (Array.isArray(questions) && questions.length === 10) {
          return questions;
        }
      }
    } catch {
      // Fallback em caso de erro de rede ou restrição de CORS em file://
    }
  }

  // Fallback seguro embutido
  return JSON.parse(JSON.stringify(FALLBACK_QUESTIONS));
}
