// Stage 10: Merge Planning and Delays
// Join scheduled departures with real-time delay information

import { PlannedDeparture, Departure, DelayStatus } from '../domain/types';

// TODO STAGE 10: Merge planning with delays by tripId
// - Join on tripId
// - Default to onTime if no delay info found
// - Should be O(n+m) not O(n*m) complexity
export function merge(
  planning: PlannedDeparture[],
  delays: Array<{ tripId: string; status: DelayStatus }>
): Departure[] {
  throw new Error('TODO STAGE 10');
}

// TODO STAGE 10: Create a Map for efficient lookup
// Helper to convert delays array to Map<tripId, DelayStatus>
export function createDelayMap(
  delays: Array<{ tripId: string; status: DelayStatus }>
): Map<string, DelayStatus> {
  throw new Error('TODO STAGE 10');
}

// TODO STAGE 10: Apply delay status to a planned departure
export function applyDelay(
  planned: PlannedDeparture,
  status: DelayStatus
): Departure {
  throw new Error('TODO STAGE 10');
}