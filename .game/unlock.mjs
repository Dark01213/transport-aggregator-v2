#!/usr/bin/env node

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

async function runTests() {
  return new Promise((resolve) => {
    const jest = spawn('npm', ['test'], { 
      shell: true,
      stdio: 'inherit'
    });

    jest.on('close', (code) => {
      resolve(code === 0);
    });

    jest.on('error', (err) => {
      console.error(`${colors.red}Error running tests:${colors.reset}`, err);
      resolve(false);
    });
  });
}

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

function getNextBranch() {
  const nextBranchFile = join(__dirname, 'next-branch.b64');
  if (!existsSync(nextBranchFile)) {
    return null;
  }
  
  try {
    const encoded = readFileSync(nextBranchFile, 'utf8').trim();
    return Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return null;
  }
}

async function main() {
  console.log(`\n${colors.cyan}${colors.bright}🎮 Transport Aggregator - Mission Validator${colors.reset}\n`);
  
  const currentBranch = getCurrentBranch();
  if (currentBranch) {
    console.log(`${colors.yellow}Current branch:${colors.reset} ${currentBranch}`);
  }
  
  console.log(`${colors.cyan}Running tests...${colors.reset}\n`);
  
  const testsPass = await runTests();
  
  console.log('');
  
  if (testsPass) {
    console.log(`${colors.green}${colors.bright}✅ MISSION COMPLETE!${colors.reset}\n`);
    
    const nextBranch = getNextBranch();
    
    if (nextBranch && nextBranch.includes('fin')) {
      console.log(`${colors.magenta}${colors.bright}🎉 FÉLICITATIONS! 🎉${colors.reset}`);
      console.log(`${colors.green}Vous avez terminé toutes les missions!${colors.reset}\n`);
      console.log('Bravo pour avoir complété le parcours Transport Aggregator!');
      console.log('Vous maîtrisez maintenant TypeScript strict et l\'async robuste.\n');
    } else if (nextBranch) {
      console.log(`${colors.green}Prochaine mission débloquée:${colors.reset} ${colors.bright}${nextBranch}${colors.reset}\n`);
      console.log('Pour continuer, exécutez:');
      console.log(`  ${colors.cyan}git add .${colors.reset}`);
      console.log(`  ${colors.cyan}git commit -m "Complete ${currentBranch || 'current stage'}"${colors.reset}`);
      console.log(`  ${colors.cyan}git checkout ${nextBranch}${colors.reset}\n`);
      console.log('Puis testez la nouvelle mission:');
      console.log(`  ${colors.cyan}npm test${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Impossible de déterminer la prochaine mission.${colors.reset}`);
      console.log('Vérifiez que vous êtes sur une branche de stage.\n');
    }
  } else {
    console.log(`${colors.red}${colors.bright}❌ TESTS ÉCHOUÉS${colors.reset}\n`);
    console.log('Les tests ne passent pas encore. Continuez à implémenter!');
    console.log(`\nPour obtenir un indice, utilisez: ${colors.cyan}npm run hint${colors.reset}`);
    console.log(`Pour relancer les tests: ${colors.cyan}npm test${colors.reset}\n`);
  }
}

main().catch(console.error);