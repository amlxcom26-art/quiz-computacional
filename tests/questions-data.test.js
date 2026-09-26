import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsFilePath = path.resolve(__dirname, '../data/questions.json');

describe('Validação da Base de Dados de Questões (questions.json)', () => {
  test('O arquivo questions.json deve existir e ser um JSON válido', () => {
    assert.ok(fs.existsSync(questionsFilePath), 'Arquivo data/questions.json não encontrado');
    const content = fs.readFileSync(questionsFilePath, 'utf-8');
    const data = JSON.parse(content);
    assert.ok(Array.isArray(data), 'A raiz de questions.json deve ser um Array');
  });

  test('A base deve conter rigorosamente 10 questões', () => {
    const data = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));
    assert.equal(data.length, 10, 'A quantidade de questões deve ser exatamente 10');
  });

  test('Todas as questões devem possuir ID único, enunciado e explicação pedagógica não vazios', () => {
    const data = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));
    const ids = new Set();

    data.forEach((q, index) => {
      assert.ok(q.id && typeof q.id === 'string', `Questão no índice ${index} deve ter um id válido`);
      assert.ok(!ids.has(q.id), `ID duplicado detectado: ${q.id}`);
      ids.add(q.id);

      assert.ok(q.statement && typeof q.statement === 'string' && q.statement.trim().length >= 10,
        `Enunciado da questão ${q.id} deve ter no mínimo 10 caracteres`);
      assert.ok(q.explanation && typeof q.explanation === 'string' && q.explanation.trim().length >= 10,
        `Explicação da questão ${q.id} deve ter no mínimo 10 caracteres`);
    });
  });

  test('Cada questão deve possuir rigorosamente 4 alternativas distintas (Princípio III da Constituição)', () => {
    const data = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));

    data.forEach((q) => {
      assert.ok(Array.isArray(q.alternatives), `Questão ${q.id} deve ter uma lista de alternativas`);
      assert.equal(q.alternatives.length, 4, `Questão ${q.id} deve ter exatamente 4 alternativas`);

      const altIds = new Set();
      const altTexts = new Set();

      q.alternatives.forEach((alt, altIndex) => {
        assert.ok(alt.id && typeof alt.id === 'string', `Alternativa ${altIndex} de ${q.id} deve ter id válido`);
        assert.ok(!altIds.has(alt.id), `ID de alternativa duplicado em ${q.id}: ${alt.id}`);
        altIds.add(alt.id);

        assert.ok(alt.text && typeof alt.text === 'string' && alt.text.trim().length > 0,
          `Texto da alternativa ${alt.id} não pode ser vazio`);
        assert.ok(!altTexts.has(alt.text.trim().toLowerCase()),
          `Texto de alternativa duplicado em ${q.id}: ${alt.text}`);
        altTexts.add(alt.text.trim().toLowerCase());
      });
    });
  });

  test('Cada questão deve possuir rigorosamente uma alternativa correta (Princípio IV da Constituição)', () => {
    const data = JSON.parse(fs.readFileSync(questionsFilePath, 'utf-8'));

    data.forEach((q) => {
      assert.ok(q.correctAlternativeId && typeof q.correctAlternativeId === 'string',
        `Questão ${q.id} deve definir correctAlternativeId`);

      const matchingAlts = q.alternatives.filter((alt) => alt.id === q.correctAlternativeId);
      assert.equal(matchingAlts.length, 1,
        `Questão ${q.id} deve ter exatamente uma alternativa correspondente a correctAlternativeId`);
    });
  });
});
