// Initial domain types file
// This will be replaced by stage-specific implementations

export type LineId = string;
export type StopId = string;
export type TripId = string;

export type DelayStatus = any;

export interface PlannedDeparture {
  tripId: TripId;
  stopId: StopId;
  plannedISO: string;
  platform: string;
  headsign: string;
}

export interface Departure extends PlannedDeparture {
  status: DelayStatus;
}

export function createLineId(id: string): LineId {
  return id;
}

export function createStopId(id: string): StopId {
  return id;
}

export function createTripId(id: string): TripId {
  return id;
}