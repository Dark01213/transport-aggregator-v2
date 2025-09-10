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

// Sleep helper for simulated latency
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Timeout wrapper - race promise against timeout
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new HttpError('Request timeout', 'TIMEOUT'));
    }, timeoutMs);
    
    // Clean up timer if promise resolves first
    promise.then(() => clearTimeout(timer)).catch(() => clearTimeout(timer));
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Main HTTP GET wrapper with offline simulation
export async function httpGet<T>(
  path: string,
  options: HttpOptions = {}
): Promise<T> {
  // Check abort signal first
  if (options.signal?.aborted) {
    throw new HttpError('Request aborted', 'ABORTED');
  }
  
  // Create the full operation including latency
  const operation = async () => {
    // Simulated latency (50-200ms random)
    const latency = Math.random() * 150 + 50;
    await sleep(latency);
    
    // Check abort signal again after latency
    if (options.signal?.aborted) {
      throw new HttpError('Request aborted', 'ABORTED');
    }
    
    // Load the JSON file
    return loadJsonFile(path);
  };
  
  // Apply timeout if specified
  if (options.timeout) {
    return withTimeout(operation(), options.timeout);
  }
  
  return operation();
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