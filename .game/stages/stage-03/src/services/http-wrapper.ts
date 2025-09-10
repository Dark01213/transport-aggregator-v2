// Stage 03: HTTP Wrapper (Offline Simulation)
// Simulated HTTP client with latency, timeout, and error handling

import { readFileSync } from 'fs';
import { join } from 'path';

export interface HttpOptions {
  timeout?: number; // milliseconds
  retries?: number;
  signal?: AbortSignal; // For cancellation
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// TODO STAGE 03: Implement sleep helper for simulated latency
function sleep(ms: number): Promise<void> {
  throw new Error('TODO STAGE 03');
}

// TODO STAGE 03: Implement timeout wrapper
// Should race a promise against a timeout
// If timeout wins, reject with HttpError (code: 'TIMEOUT')
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  throw new Error('TODO STAGE 03');
}

// TODO STAGE 03: Implement the main HTTP GET wrapper
// This simulates network requests by reading local JSON files
// Should include:
// - Simulated latency (50-200ms random)
// - Timeout support
// - AbortSignal support  
// - Error mapping (file not found → 404, etc.)
export async function httpGet<T>(
  path: string,
  options: HttpOptions = {}
): Promise<T> {
  throw new Error('TODO STAGE 03');
}

// Helper: Load JSON file (simulate HTTP response)
function loadJsonFile(filePath: string): any {
  try {
    const projectRoot = process.cwd();
    const fullPath = join(projectRoot, 'data', filePath);
    const content = readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new HttpError('Not Found', 'NOT_FOUND', 404);
    }
    if (error.name === 'SyntaxError') {
      throw new HttpError('Invalid JSON', 'INVALID_JSON', 500);
    }
    throw new HttpError('Server Error', 'SERVER_ERROR', 500);
  }
}