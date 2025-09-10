// Stage 01: Domain Types
// Define the core domain types for the transport aggregator

// Branded types using unique symbols
declare const lineIdBrand: unique symbol;
declare const stopIdBrand: unique symbol;
declare const tripIdBrand: unique symbol;

export type LineId = string & { [lineIdBrand]: 'LineId' };
export type StopId = string & { [stopIdBrand]: 'StopId' };
export type TripId = string & { [tripIdBrand]: 'TripId' };

// DelayStatus discriminated union
export type DelayStatus = 
  | { type: 'onTime' }
  | { type: 'late'; minutes: number }
  | { type: 'cancelled' };

// PlannedDeparture interface
export interface PlannedDeparture {
  tripId: TripId;
  stopId: StopId;
  plannedISO: string;
  platform: string;
  headsign: string;
}

// Departure extends PlannedDeparture
export interface Departure extends PlannedDeparture {
  status: DelayStatus;
}

// Helper functions for branded types
export function createLineId(id: string): LineId {
  return id as LineId;
}

export function createStopId(id: string): StopId {
  return id as StopId;
}

export function createTripId(id: string): TripId {
  return id as TripId;
}