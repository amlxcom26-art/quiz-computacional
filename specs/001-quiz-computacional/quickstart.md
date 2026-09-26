# Quickstart & Validation Guide: Quiz Computacional

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Date**: 2026-09-26

Este guia orienta a inicialização, execução local e validação ponta a ponta dos cenários de teste da aplicação Quiz Computacional.

---

## 1. Pré-Requisitos

- **Navegador Web Moderno**: Chrome, Firefox, Safari ou Edge (com suporte a ES6 e CSS3).
- **Node.js** (opcional, v18+): Apenas para execução dos testes unitários automatizados (`node --test`).

---

## 2. Como Executar a Aplicação

Não é necessário nenhum comando de build ou instalação de pacotes npm (`npm install`).

### Opção A: Servidor HTTP Local (Recomendado)
Para evitar bloqueios de CORS ao ler arquivos JSON locais:
```bash
# Via Python (embutido na maioria dos sistemas):
python -m http.server 8000

# Ou via npx (Node):
npx serve .
```
Abra o navegador em: `http://localhost:8000`

### Opção B: Abertura Direta do Arquivo
- Dê um duplo clique no arquivo `index.html` ou abra via caminho no navegador (`file:///.../index.html`). O carregador de dados conta com fallback integrado para execução sem servidor HTTP.

---

## 3. Como Executar os Testes Automatizados

Para validar as regras de negócio e integridade dos dados:
```bash
# Executar todos os testes com o runner nativo do Node.js:
node --test tests/
```

**Resultados esperados**:
- Validação estrutural do `questions.json` (10 questões, exatamente 4 alternativas por questão, 1 correta e 3 distratores).
- Teste do motor `QuizEngine`: cálculo de acertos, erros, percentual `(acertos/10)*100`, bloqueio de seleção pós-confirmação, navegação da barra numérica e integridade do gabarito após o embaralhamento Fisher-Yates.

---

## 4. Cenários de Validação Manual (Ponta a Ponta)

Consulte o [Data Model](data-model.md) e os [Contratos de UI](contracts/ui-states-contract.md) para detalhes de estados visuais.

### Cenário 1: Resolução de Questão com Acerto
1. Abra a aplicação.
2. Verifique se a Questão 1 de 10 é exibida com seu enunciado e 4 alternativas. O botão "Confirmar Resposta" deve estar desabilitado.
3. Clique em uma alternativa. O botão deve ficar destacado como selecionado e "Confirmar Resposta" deve habilitar.
4. Clique em "Confirmar Resposta".
5. **Resultado Esperado**: As alternativas travam (não permitem troca de opção). Exibe badge verde de acerto, destaca a alternativa correta em verde com ícone `✓`, exibe a explicação pedagógica e mostra o botão "Próxima Questão".

### Cenário 2: Resolução de Questão com Erro
1. Na questão ativa, selecione intencionalmente uma alternativa incorreta e clique em "Confirmar Resposta".
2. **Resultado Esperado**: A alternativa incorreta escolhida fica destacada em vermelho com ícone `✕`, a alternativa correta é simultaneamente destacada em verde com ícone `✓`, exibe a explicação pedagógica e habilita o avanço para a próxima questão.

### Cenário 3: Navegação e Revisão na Barra Numérica
1. Tendo respondido as questões 1 e 2, observe a barra numérica de questões no cabeçalho.
2. Clique no número `1`.
3. **Resultado Esperado**: A aplicação exibe a Questão 1 em modo somente leitura (mantendo a resposta submetida, o gabarito e a explicação).
4. Tente clicar no número `5` (questão ainda não alcançada).
5. **Resultado Esperado**: O clique é bloqueado e a questão 5 não é exibida.
6. Clique no número `3` para voltar à questão corrente não respondida.

### Cenário 4: Apuração de Resultados e Reinício com Embaralhamento
1. Responda todas as 10 questões (ex.: 8 acertos e 2 erros).
2. Na 10ª questão, clique em "Ver Resultado".
3. **Resultado Esperado**: A tela de resultados finais é exibida com:
   - "Acertos: 8"
   - "Erros: 2"
   - "Aproveitamento: 80%"
   - Mensagem pedagógica condizente: *"Excelente domínio! Parabéns pelo seu conhecimento em fundamentos de computação!"*
4. Clique em "Reiniciar Quiz".
5. **Resultado Esperado**: A aplicação retorna para a Questão 1, com pontuação zerada, seleções limpas e a ordem das 10 questões e de suas 4 alternativas reorganizada aleatoriamente.
