import {
  ScheduleDTO,
  DelayDTO,
  isScheduleDTO,
  isDelayDTO,
  parseSchedule,
  parseDelay,
  parseSchedules,
  parseDelays
} from '../src/domain/dto';

describe('Stage 02 - DTO Guards & Parsing', () => {
  describe('Type Guards', () => {
    test('isScheduleDTO should validate correct object', () => {
      const valid: ScheduleDTO = {
        tripId: 'M1-2025-09-10-0815-BAST',
        stopId: 'Bastille',
        plannedISO: '2025-09-10T08:15:00Z',
        platform: '1',
        headsign: 'La Défense'
      };
      expect(isScheduleDTO(valid)).toBe(true);
    });

    test('isScheduleDTO should reject invalid objects', () => {
      expect(isScheduleDTO(null)).toBe(false);
      expect(isScheduleDTO(undefined)).toBe(false);
      expect(isScheduleDTO({})).toBe(false);
      expect(isScheduleDTO({ tripId: 'M1' })).toBe(false); // Missing fields
      expect(isScheduleDTO({ 
        tripId: 123, // Wrong type
        stopId: 'Bastille',
        plannedISO: '2025-09-10T08:15:00Z',
        platform: '1',
        headsign: 'La Défense'
      })).toBe(false);
    });

    test('isDelayDTO should validate onTime status', () => {
      const valid: DelayDTO = {
        tripId: 'M1-2025-09-10-0815-BAST',
        status: 'onTime'
      };
      expect(isDelayDTO(valid)).toBe(true);
    });

    test('isDelayDTO should validate late status with minutes', () => {
      const valid: DelayDTO = {
        tripId: 'M1-2025-09-10-0815-BAST',
        status: 'late',
        minutes: 5
      };
      expect(isDelayDTO(valid)).toBe(true);
    });

    test('isDelayDTO should reject invalid delay objects', () => {
      expect(isDelayDTO(null)).toBe(false);
      expect(isDelayDTO({ tripId: 'M1' })).toBe(false); // Missing status
      expect(isDelayDTO({ 
        tripId: 'M1',
        status: 'unknown' // Invalid status
      })).toBe(false);
      expect(isDelayDTO({ 
        tripId: 'M1',
        status: 'late' // Missing minutes for late status
      })).toBe(false);
    });
  });

  describe('Parsers', () => {
    test('parseSchedule should parse valid DTO', () => {
      const dto = {
        tripId: 'M1-2025-09-10-0815-BAST',
        stopId: 'Bastille',
        plannedISO: '2025-09-10T08:15:00Z',
        platform: '1',
        headsign: 'La Défense'
      };
      
      const result = parseSchedule(dto);
      expect(result.tripId).toBeDefined();
      expect(result.stopId).toBeDefined();
      expect(result.plannedISO).toBe('2025-09-10T08:15:00Z');
      expect(result.platform).toBe('1');
      expect(result.headsign).toBe('La Défense');
    });

    test('parseSchedule should throw on invalid input', () => {
      expect(() => parseSchedule(null)).toThrow();
      expect(() => parseSchedule({})).toThrow();
      expect(() => parseSchedule({ tripId: 'M1' })).toThrow();
    });

    test('parseDelay should parse onTime status', () => {
      const dto = {
        tripId: 'M1-2025-09-10-0815-BAST',
        status: 'onTime'
      };
      
      const result = parseDelay(dto);
      expect(result.type).toBe('onTime');
    });

    test('parseDelay should parse late status', () => {
      const dto = {
        tripId: 'M1-2025-09-10-0815-BAST',
        status: 'late',
        minutes: 7
      };
      
      const result = parseDelay(dto);
      expect(result.type).toBe('late');
      expect((result as any).minutes).toBe(7);
    });

    test('parseDelay should parse cancelled status', () => {
      const dto = {
        tripId: 'M1-2025-09-10-0815-BAST',
        status: 'cancelled'
      };
      
      const result = parseDelay(dto);
      expect(result.type).toBe('cancelled');
    });

    test('parseSchedules should parse array', () => {
      const data = [
        {
          tripId: 'M1-2025-09-10-0815-BAST',
          stopId: 'Bastille',
          plannedISO: '2025-09-10T08:15:00Z',
          platform: '1',
          headsign: 'La Défense'
        }
      ];
      
      const result = parseSchedules(data);
      expect(result).toHaveLength(1);
      expect(result[0].tripId).toBeDefined();
    });

    test('parseDelays should parse array', () => {
      const data = [
        { tripId: 'M1-001', status: 'onTime' },
        { tripId: 'M1-002', status: 'late', minutes: 3 },
        { tripId: 'M1-003', status: 'cancelled' }
      ];
      
      const result = parseDelays(data);
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe('onTime');
      expect(result[1].type).toBe('late');
      expect(result[2].type).toBe('cancelled');
    });
  });
});