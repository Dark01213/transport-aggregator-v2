#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m'
};

function getCurrentBranch() {
  try {
    const gitHead = readFileSync(join(dirname(__dirname), '.git', 'HEAD'), 'utf8').trim();
    if (gitHead.startsWith('ref: refs/heads/')) {
      return gitHead.replace('ref: refs/heads/', '');
    }
    return null;
  } catch {
    return null;
  }
}

function getStageNumber(branchName) {
  if (!branchName) return null;
  const match = branchName.match(/stage-(\d+)/);
  return match ? match[1].padStart(2, '0') : null;
}

function getHintCount() {
  const countFile = join(__dirname, 'current-hint-count');
  if (!existsSync(countFile)) {
    return 0;
  }
  try {
    return parseInt(readFileSync(countFile, 'utf8').trim()) || 0;
  } catch {
    return 0;
  }
}

function saveHintCount(count) {
  const countFile = join(__dirname, 'current-hint-count');
  writeFileSync(countFile, count.toString());
}

function getHints(stageNumber) {
  const hintFile = join(__dirname, 'hints', `hints.stage-${stageNumber}.md`);
  if (!existsSync(hintFile)) {
    return null;
  }
  
  try {
    const content = readFileSync(hintFile, 'utf8');
    const hints = content.split('---').map(h => h.trim()).filter(h => h);
    return hints;
  } catch {
    return null;
  }
}

function main() {
  console.log(`\n${colors.cyan}${colors.bright}💡 Transport Aggregator - Système d'Indices${colors.reset}\n`);
  
  const currentBranch = getCurrentBranch();
  if (!currentBranch) {
    console.log(`${colors.yellow}⚠️  Impossible de déterminer la branche actuelle.${colors.reset}`);
    console.log('Assurez-vous d\'être dans un dépôt Git.\n');
    return;
  }
  
  const stageNumber = getStageNumber(currentBranch);
  if (!stageNumber) {
    console.log(`${colors.yellow}⚠️  Cette branche n'est pas une mission.${colors.reset}`);
    console.log('Les indices sont disponibles uniquement sur les branches stage-XX.\n');
    return;
  }
  
  console.log(`${colors.dim}Mission actuelle: ${currentBranch}${colors.reset}\n`);
  
  const hints = getHints(stageNumber);
  if (!hints || hints.length === 0) {
    console.log(`${colors.yellow}Aucun indice disponible pour cette mission.${colors.reset}\n`);
    return;
  }
  
  let hintCount = getHintCount();
  
  // Reset hint count if branch changed
  const lastBranchFile = join(__dirname, 'last-hint-branch');
  const lastBranch = existsSync(lastBranchFile) ? readFileSync(lastBranchFile, 'utf8').trim() : '';
  if (lastBranch !== currentBranch) {
    hintCount = 0;
    writeFileSync(lastBranchFile, currentBranch);
  }
  
  if (hintCount >= hints.length) {
    console.log(`${colors.yellow}Vous avez déjà consulté tous les indices disponibles (${hints.length}/${hints.length}).${colors.reset}\n`);
    console.log(`${colors.dim}Rappel des indices précédents:${colors.reset}\n`);
    hints.forEach((hint, index) => {
      console.log(`${colors.magenta}Indice ${index + 1}/${hints.length}:${colors.reset}`);
      console.log(hint);
      console.log('');
    });
    return;
  }
  
  const currentHint = hints[hintCount];
  hintCount++;
  saveHintCount(hintCount);
  
  console.log(`${colors.green}${colors.bright}Indice ${hintCount}/${hints.length}:${colors.reset}\n`);
  console.log(currentHint);
  console.log('');
  
  if (hintCount < hints.length) {
    console.log(`${colors.dim}${hints.length - hintCount} indice(s) restant(s).${colors.reset}`);
    console.log(`Utilisez à nouveau ${colors.cyan}npm run hint${colors.reset} pour le prochain indice.\n`);
  } else {
    console.log(`${colors.yellow}C'était le dernier indice disponible!${colors.reset}`);
    console.log('Bonne chance pour compléter la mission! 💪\n');
  }
}

main();