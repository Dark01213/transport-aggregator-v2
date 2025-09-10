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

// Type guard for ScheduleDTO
export function isScheduleDTO(value: unknown): value is ScheduleDTO {
  return (
    value !== null &&
    typeof value === 'object' &&
    'tripId' in value &&
    typeof (value as any).tripId === 'string' &&
    'stopId' in value &&
    typeof (value as any).stopId === 'string' &&
    'plannedISO' in value &&
    typeof (value as any).plannedISO === 'string' &&
    'platform' in value &&
    typeof (value as any).platform === 'string' &&
    'headsign' in value &&
    typeof (value as any).headsign === 'string'
  );
}

// Type guard for DelayDTO
export function isDelayDTO(value: unknown): value is DelayDTO {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  
  const obj = value as any;
  
  if (!('tripId' in obj) || typeof obj.tripId !== 'string') {
    return false;
  }
  
  if (!('status' in obj) || !['onTime', 'late', 'cancelled'].includes(obj.status)) {
    return false;
  }
  
  if (obj.status === 'late') {
    return 'minutes' in obj && typeof obj.minutes === 'number' && obj.minutes > 0;
  }
  
  return true;
}

// Parse ScheduleDTO to PlannedDeparture
export function parseSchedule(dto: unknown): PlannedDeparture {
  if (!isScheduleDTO(dto)) {
    throw new Error('Invalid ScheduleDTO: missing or invalid fields');
  }
  
  return {
    tripId: createTripId(dto.tripId),
    stopId: createStopId(dto.stopId),
    plannedISO: dto.plannedISO,
    platform: dto.platform,
    headsign: dto.headsign
  };
}

// Parse DelayDTO to DelayStatus
export function parseDelay(dto: unknown): DelayStatus {
  if (!isDelayDTO(dto)) {
    throw new Error('Invalid DelayDTO');
  }
  
  const delayDto = dto as DelayDTO;
  
  switch (delayDto.status) {
    case 'onTime':
      return { type: 'onTime' };
    case 'late':
      return { type: 'late', minutes: delayDto.minutes! };
    case 'cancelled':
      return { type: 'cancelled' };
    default:
      throw new Error(`Unknown status: ${delayDto.status}`);
  }
}

// Parse array of schedules with validation
export function parseSchedules(data: unknown): PlannedDeparture[] {
  if (!Array.isArray(data)) {
    throw new Error(`Expected array, got ${typeof data}`);
  }
  
  return data.map((item, index) => {
    try {
      return parseSchedule(item);
    } catch (e: any) {
      throw new Error(`Invalid item at index ${index}: ${e.message}`);
    }
  });
}

// Parse array of delays with validation
export function parseDelays(data: unknown): DelayStatus[] {
  if (!Array.isArray(data)) {
    throw new Error(`Expected array, got ${typeof data}`);
  }
  
  return data.map((item, index) => {
    try {
      return parseDelay(item);
    } catch (e: any) {
      throw new Error(`Invalid item at index ${index}: ${e.message}`);
    }
  });
}