// Stage 13: Parallel vs Sequential Loading
// Compare performance of different async strategies

import { httpGet } from './http-wrapper';
import { parseSchedules } from '../domain/dto';
import { PlannedDeparture } from '../domain/types';

export interface LineAggregate {
  lineId: string;
  schedule: PlannedDeparture[];
  loadTime: number;
}

// TODO STAGE 13: Load multiple lines in parallel
// Use Promise.all to load all lines simultaneously
// Track individual load times
export async function loadManyLinesParallel(
  lineIds: string[]
): Promise<LineAggregate[]> {
  throw new Error('TODO STAGE 13');
}

// TODO STAGE 13: Load multiple lines sequentially
// Load one line after another using a for loop
// Track individual load times
export async function loadManyLinesSequential(
  lineIds: string[]
): Promise<LineAggregate[]> {
  throw new Error('TODO STAGE 13');
}

// TODO STAGE 13: Load with concurrency limit
// Load lines with max N concurrent requests
// Useful for rate limiting
export async function loadManyLinesLimited(
  lineIds: string[],
  maxConcurrency: number = 2
): Promise<LineAggregate[]> {
  throw new Error('TODO STAGE 13');
}

// Helper: Load a single line with timing
async function loadLineWithTiming(lineId: string): Promise<LineAggregate> {
  const start = Date.now();
  const data = await httpGet(`schedule.${lineId}.json`);
  const schedule = parseSchedules(data);
  const loadTime = Date.now() - start;
  
  return {
    lineId,
    schedule,
    loadTime
  };
}