// Stage 02: DTO Guards & Parsing
// Type guards and parsers for external data

import { PlannedDeparture, DelayStatus, createTripId, createStopId } from './types';

// DTOs from external sources (JSON files)
export interface ScheduleDTO {
  tripId: string;
  stopId: string;
  plannedISO: string;
  platform: string;
  headsign: string;
}

export interface DelayDTO {
  tripId: string;
  status: 'onTime' | 'late' | 'cancelled';
  minutes?: number;
}

// TODO STAGE 02: Implement type guard for ScheduleDTO
export function isScheduleDTO(value: unknown): value is ScheduleDTO {
  throw new Error('TODO STAGE 02');
}

// TODO STAGE 02: Implement type guard for DelayDTO
export function isDelayDTO(value: unknown): value is DelayDTO {
  throw new Error('TODO STAGE 02');
}

// TODO STAGE 02: Parse ScheduleDTO to PlannedDeparture
// Should validate and transform the DTO
// Throw descriptive errors if validation fails
export function parseSchedule(dto: unknown): PlannedDeparture {
  throw new Error('TODO STAGE 02');
}

// TODO STAGE 02: Parse DelayDTO to DelayStatus
// Should handle all three status types correctly
export function parseDelay(dto: unknown): DelayStatus {
  throw new Error('TODO STAGE 02');
}

// TODO STAGE 02: Parse array of schedules with validation
export function parseSchedules(data: unknown): PlannedDeparture[] {
  throw new Error('TODO STAGE 02');
}

// TODO STAGE 02: Parse array of delays with validation
export function parseDelays(data: unknown): DelayStatus[] {
  throw new Error('TODO STAGE 02');
}