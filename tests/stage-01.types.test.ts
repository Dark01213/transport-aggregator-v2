import {
  LineId,
  StopId,
  TripId,
  DelayStatus,
  PlannedDeparture,
  Departure,
  createLineId,
  createStopId,
  createTripId
} from '../src/domain/types';

describe('Stage 01 - Domain Types', () => {
  describe('Branded Types', () => {
    test('should create LineId', () => {
      const lineId = createLineId('M1');
      expect(lineId).toBeDefined();
      // TypeScript should enforce type safety
      // LineId is assignable to string but not vice versa
      const str: string = lineId;
    });

    test('should create StopId', () => {
      const stopId = createStopId('Bastille');
      expect(stopId).toBeDefined();
      // StopId is assignable to string but not vice versa
      const str: string = stopId;
    });

    test('should create TripId', () => {
      const tripId = createTripId('M1-2025-09-10-0815-BAST');
      expect(tripId).toBeDefined();
      // TripId is assignable to string but not vice versa
      const str: string = tripId;
    });
  });

  describe('DelayStatus Union', () => {
    test('should handle onTime status', () => {
      const status: DelayStatus = { type: 'onTime' };
      expect(status.type).toBe('onTime');
    });

    test('should handle late status with minutes', () => {
      const status: DelayStatus = { type: 'late', minutes: 5 };
      expect(status.type).toBe('late');
      expect(status.minutes).toBe(5);
    });

    test('should handle cancelled status', () => {
      const status: DelayStatus = { type: 'cancelled' };
      expect(status.type).toBe('cancelled');
    });
  });

  describe('PlannedDeparture Interface', () => {
    test('should define PlannedDeparture with all fields', () => {
      const departure: PlannedDeparture = {
        tripId: createTripId('M1-2025-09-10-0815-BAST'),
        stopId: createStopId('Bastille'),
        plannedISO: '2025-09-10T08:15:00Z',
        platform: '1',
        headsign: 'La Défense'
      };

      expect(departure.tripId).toBeDefined();
      expect(departure.stopId).toBeDefined();
      expect(departure.plannedISO).toBe('2025-09-10T08:15:00Z');
      expect(departure.platform).toBe('1');
      expect(departure.headsign).toBe('La Défense');
    });
  });

  describe('Departure Interface', () => {
    test('should extend PlannedDeparture with status', () => {
      const departure: Departure = {
        tripId: createTripId('M1-2025-09-10-0815-BAST'),
        stopId: createStopId('Bastille'),
        plannedISO: '2025-09-10T08:15:00Z',
        platform: '1',
        headsign: 'La Défense',
        status: { type: 'late', minutes: 3 }
      };

      expect(departure.status).toBeDefined();
      expect(departure.status.type).toBe('late');
    });
  });
});