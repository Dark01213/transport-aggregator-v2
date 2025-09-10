// Stage 01: Domain Types
// Define the core domain types for the transport aggregator

// TODO STAGE 01: Define branded types for IDs
// Hint: Use type branding pattern with a unique symbol
export type LineId = string; // TODO: Make this a branded type
export type StopId = string; // TODO: Make this a branded type 
export type TripId = string; // TODO: Make this a branded type

// TODO STAGE 01: Define DelayStatus as a discriminated union
// Should handle: onTime, late (with minutes), cancelled
export type DelayStatus = any; // TODO: Replace with proper union type

// TODO STAGE 01: Define PlannedDeparture interface
export interface PlannedDeparture {
  // TODO: Add required fields
  // tripId, stopId, plannedISO, platform, headsign
}

// TODO STAGE 01: Define Departure interface (extends PlannedDeparture)
export interface Departure extends PlannedDeparture {
  // TODO: Add status field
}

// TODO STAGE 01: Create helper functions for branded types
export function createLineId(id: string): LineId {
  throw new Error('TODO STAGE 01');
}

export function createStopId(id: string): StopId {
  throw new Error('TODO STAGE 01');
}

export function createTripId(id: string): TripId {
  throw new Error('TODO STAGE 01');
}