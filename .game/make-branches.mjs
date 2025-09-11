#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, copyFileSync, rmSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

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

// Branch names for all 24 stages
const branches = [
  'stage-01-domain-types',
  'stage-02-dto-guards',
  'stage-03-http-wrapper',
  'stage-04-load-basics',
  'stage-05-load-schedule',
  'stage-06-normalize-search',
  'stage-07-window-filter',
  'stage-08-format-lines',
  'stage-09-load-delays',
  'stage-10-merge',
  'stage-11-sort-group',
  'stage-12-topN',
  'stage-13-parallel-vs-seq',
  'stage-14-retry-fallback',
  'stage-15-result-du',
  'stage-16-abort-search',
  'stage-17-cache-layer',
  'stage-18-config-options',
  'stage-19-cleanup-refactor',
  'stage-20-main-orchestrator',
  'stage-21-tests-services-mock',
  'stage-22-coverage',
  'stage-23-alerts-summary',
  'stage-24-cli-report'
];

async function execCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: true,
      ...options
    });

    let stdout = '';
    let stderr = '';

    if (proc.stdout) {
      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });
    }

    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed: ${command} ${args.join(' ')}\n${stderr}`));
      }
    });

    proc.on('error', reject);
  });
}

async function initGitIfNeeded() {
  if (!existsSync(join(projectRoot, '.git'))) {
    console.log(`${colors.cyan}Initializing Git repository...${colors.reset}`);
    await execCommand('git', ['init'], { cwd: projectRoot });
    await execCommand('git', ['add', '.'], { cwd: projectRoot });
    await execCommand('git', ['commit', '-m', '"Initial commit"'], { cwd: projectRoot });
  }
}

function copyDirectory(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);

    if (statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

async function createBranch(branchName, stageNumber) {
  console.log(`${colors.cyan}Creating branch: ${colors.bright}${branchName}${colors.reset}`);

  try {
    // Switch to main/master branch first
    try {
      await execCommand('git', ['checkout', 'main'], { cwd: projectRoot });
    } catch {
      try {
        await execCommand('git', ['checkout', 'master'], { cwd: projectRoot });
      } catch {
        // Stay on current branch
      }
    }

    // Create and checkout new branch
    await execCommand('git', ['checkout', '-b', branchName], { cwd: projectRoot });

    // Clean up tests directory first to avoid cross-stage test pollution
    const testsDir = join(projectRoot, 'tests');
    if (existsSync(testsDir)) {
      console.log(`  Cleaning tests directory...`);
      // Remove all test files except placeholder.test.ts
      const testFiles = readdirSync(testsDir);
      for (const testFile of testFiles) {
        if (testFile !== 'placeholder.test.ts') {
          const testFilePath = join(testsDir, testFile);
          if (statSync(testFilePath).isFile()) {
            rmSync(testFilePath);
          }
        }
      }
    }

    // Copy stage content
    const stageDir = join(__dirname, 'stages', `stage-${stageNumber}`);
    if (existsSync(stageDir)) {
      console.log(`  Copying stage ${stageNumber} content...`);
      
      // Copy all files from stage directory to project root, preserving structure
      const entries = readdirSync(stageDir);
      for (const entry of entries) {
        const srcPath = join(stageDir, entry);
        const destPath = join(projectRoot, entry);

        if (statSync(srcPath).isDirectory()) {
          copyDirectory(srcPath, destPath);
        } else if (entry === 'next-branch.b64') {
          // Copy to .game directory
          copyFileSync(srcPath, join(__dirname, 'next-branch.b64'));
        } else if (entry.startsWith('hints.stage-')) {
          // Copy hints to hints directory
          const hintsDir = join(__dirname, 'hints');
          if (!existsSync(hintsDir)) {
            mkdirSync(hintsDir);
          }
          copyFileSync(srcPath, join(hintsDir, entry));
        } else {
          copyFileSync(srcPath, destPath);
        }
      }
    }

    // Always copy MISSIONS-REFERENCE.md from main to each branch
    const missionsRefPath = join(projectRoot, 'MISSIONS-REFERENCE.md');
    if (existsSync(missionsRefPath)) {
      console.log(`  Adding MISSIONS-REFERENCE.md...`);
      // File is already in the working directory from main branch checkout
    }

    // Commit changes
    await execCommand('git', ['add', '.'], { cwd: projectRoot });
    await execCommand('git', ['commit', '-m', `Setup ${branchName}`], { cwd: projectRoot });

    console.log(`  ${colors.green}✓${colors.reset} Branch ${branchName} created\n`);
  } catch (error) {
    console.error(`  ${colors.red}✗${colors.reset} Failed to create branch ${branchName}:`, error.message);
  }
}

async function main() {
  console.log(`\n${colors.magenta}${colors.bright}🚀 Transport Aggregator - Branch Generator${colors.reset}\n`);

  try {
    // Initialize Git if needed
    await initGitIfNeeded();

    // Check if stages directory exists
    const stagesDir = join(__dirname, 'stages');
    if (!existsSync(stagesDir)) {
      console.log(`${colors.yellow}⚠️  Creating stages directory...${colors.reset}`);
      mkdirSync(stagesDir, { recursive: true });
      console.log(`${colors.yellow}Please populate the stages directory with stage content first.${colors.reset}\n`);
      return;
    }

    console.log(`Creating ${branches.length} mission branches...\n`);

    // Create each branch
    for (let i = 0; i < branches.length; i++) {
      const branchName = branches[i];
      const stageNumber = (i + 1).toString().padStart(2, '0');
      await createBranch(branchName, stageNumber);
    }

    // Return to first branch
    console.log(`${colors.cyan}Switching to first mission...${colors.reset}`);
    await execCommand('git', ['checkout', branches[0]], { cwd: projectRoot });

    console.log(`\n${colors.green}${colors.bright}✅ All branches created successfully!${colors.reset}\n`);
    console.log('To start the adventure:');
    console.log(`  ${colors.cyan}git checkout ${branches[0]}${colors.reset}`);
    console.log(`  ${colors.cyan}npm test${colors.reset}\n`);
    console.log('Good luck! 🎮\n');

  } catch (error) {
    console.error(`${colors.red}Error:${colors.reset}`, error);
    process.exit(1);
  }
}

main().catch(console.error);