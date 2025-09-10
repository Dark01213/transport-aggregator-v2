// Stage 04: Load Basics
// Load lines and stops from JSON files

import { httpGet } from './http-wrapper';
import { LineId, StopId, createLineId, createStopId } from '../domain/types';

export interface Stop {
  lineId: LineId;
  stopId: StopId;
  name: string;
}

// TODO STAGE 04: Load all available lines
export async function loadLines(): Promise<LineId[]> {
  throw new Error('TODO STAGE 04');
}

// TODO STAGE 04: Load stops for a specific line
// Should filter stops by lineId
export async function loadStops(lineId: LineId): Promise<Stop[]> {
  throw new Error('TODO STAGE 04');
}