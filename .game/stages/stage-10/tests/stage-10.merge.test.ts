import { merge, createDelayMap, applyDelay } from '../src/services/merge';
import { PlannedDeparture, DelayStatus, createTripId, createStopId } from '../src/domain/types';

describe('Stage 10 - Merge', () => {
  const planning: PlannedDeparture[] = [
    {
      tripId: createTripId('M1-001'),
      stopId: createStopId('Bastille'),
      plannedISO: '2025-09-10T08:00:00Z',
      platform: '1',
      headsign: 'La Défense'
    },
    {
      tripId: createTripId('M1-002'),
      stopId: createStopId('Bastille'),
      plannedISO: '2025-09-10T08:05:00Z',
      platform: '1',
      headsign: 'La Défense'
    },
    {
      tripId: createTripId('M1-003'),
      stopId: createStopId('Bastille'),
      plannedISO: '2025-09-10T08:10:00Z',
      platform: '1',
      headsign: 'La Défense'
    }
  ];

  const delays = [
    { tripId: 'M1-001', status: { type: 'onTime' } as DelayStatus },
    { tripId: 'M1-002', status: { type: 'late', minutes: 5 } as DelayStatus },
    { tripId: 'M1-003', status: { type: 'cancelled' } as DelayStatus }
  ];

  describe('createDelayMap', () => {
    test('should create Map from delays array', () => {
      const map = createDelayMap(delays);
      expect(map.size).toBe(3);
      expect(map.get('M1-001')?.type).toBe('onTime');
      expect(map.get('M1-002')?.type).toBe('late');
      expect(map.get('M1-003')?.type).toBe('cancelled');
    });

    test('should handle empty array', () => {
      const map = createDelayMap([]);
      expect(map.size).toBe(0);
    });
  });

  describe('applyDelay', () => {
    test('should apply onTime status', () => {
      const departure = applyDelay(planning[0], { type: 'onTime' });
      expect(departure.status.type).toBe('onTime');
      expect(departure.tripId).toBe(planning[0].tripId);
    });

    test('should apply late status', () => {
      const departure = applyDelay(planning[1], { type: 'late', minutes: 7 });
      expect(departure.status.type).toBe('late');
      expect((departure.status as any).minutes).toBe(7);
    });

    test('should apply cancelled status', () => {
      const departure = applyDelay(planning[2], { type: 'cancelled' });
      expect(departure.status.type).toBe('cancelled');
    });
  });

  describe('merge', () => {
    test('should merge planning with delays', () => {
      const result = merge(planning, delays);
      
      expect(result).toHaveLength(3);
      expect(result[0].status.type).toBe('onTime');
      expect(result[1].status.type).toBe('late');
      expect(result[2].status.type).toBe('cancelled');
    });

    test('should default to onTime when no delay info', () => {
      const planningExtra = [...planning, {
        tripId: createTripId('M1-004'),
        stopId: createStopId('Bastille'),
        plannedISO: '2025-09-10T08:15:00Z',
        platform: '1',
        headsign: 'La Défense'
      }];
      
      const result = merge(planningExtra, delays);
      expect(result).toHaveLength(4);
      expect(result[3].status.type).toBe('onTime');
    });

    test('should handle empty delays', () => {
      const result = merge(planning, []);
      expect(result).toHaveLength(3);
      expect(result.every(d => d.status.type === 'onTime')).toBe(true);
    });

    test('should handle empty planning', () => {
      const result = merge([], delays);
      expect(result).toHaveLength(0);
    });

    test('should be performant (not O(n*m))', () => {
      // Create large datasets
      const largePlanning = Array.from({ length: 1000 }, (_, i) => ({
        tripId: createTripId(`M1-${i}`),
        stopId: createStopId('Test'),
        plannedISO: '2025-09-10T08:00:00Z',
        platform: '1',
        headsign: 'Test'
      }));
      
      const largeDelays = Array.from({ length: 1000 }, (_, i) => ({
        tripId: `M1-${i}`,
        status: { type: 'onTime' } as DelayStatus
      }));
      
      const start = Date.now();
      const result = merge(largePlanning, largeDelays);
      const duration = Date.now() - start;
      
      expect(result).toHaveLength(1000);
      expect(duration).toBeLessThan(100); // Should be fast, not quadratic
    });
  });
});