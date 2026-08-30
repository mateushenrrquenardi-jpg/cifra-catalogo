/**
 * Script para gerar o arquivo index.json do catálogo.
 * Lê todos os arquivos .md dentro de musicas/ e gera index.json na raiz do repositório.
 * 
 * Execução: node scripts/gerar-indice.js
 */

import fs from 'fs';
import path from 'path';

const CATALOGO_DIR = path.resolve('./musicas');
const OUTPUT_FILE = path.resolve('./index.json');

function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    return { metadata: {}, body: '' };
  }

  const trimmed = content.trim();
  if (!trimmed.startsWith('---')) {
    return { metadata: {}, body: trimmed };
  }

  const secondDashIndex = trimmed.indexOf('---', 3);
  if (secondDashIndex === -1) {
    return { metadata: {}, body: trimmed };
  }

  const yamlBlock = trimmed.substring(3, secondDashIndex).trim();
  const body = trimmed.substring(secondDashIndex + 3).trim();
  const metadata = parseSimpleYaml(yamlBlock);

  return { metadata, body };
}

function parseSimpleYaml(yamlText) {
  const result = {};
  const lines = yamlText.split('\n');
  let currentKey = null;
  let currentList = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const listItemMatch = trimmedLine.match(/^-\s+(.*)$/);
    if (listItemMatch && currentKey && currentList !== null) {
      currentList.push(listItemMatch[1].trim());
      continue;
    }

    if (currentKey && currentList !== null) {
      result[currentKey] = currentList;
      currentKey = null;
      currentList = null;
    }

    const kvMatch = trimmedLine.match(/^([a-z_][a-z0-9_]*)\s*:\s*(.*)$/i);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();

      if (value === '' || value === '[]') {
        currentKey = key;
        currentList = [];
      } else {
        result[key] = value;
        currentKey = null;
        currentList = null;
      }
    }
  }

  if (currentKey && currentList !== null) {
    result[currentKey] = currentList;
  }

  return result;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md') && file !== 'README.md') {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function generateIndex() {
  console.log('🔍 Escaneando diretório de músicas...');
  const files = getAllFiles(CATALOGO_DIR);
  console.log(`📄 Encontrados ${files.length} arquivo(s) .md`);

  const catalog = [];

  for (const filePath of files) {
    const relativePath = path.relative('.', filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, body } = parseFrontmatter(content);

    catalog.push({
      path: relativePath,
      metadata,
      body
    });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
  console.log(`✅ ${OUTPUT_FILE} gerado com sucesso contendo ${catalog.length} música(s)!`);
}

generateIndex();
