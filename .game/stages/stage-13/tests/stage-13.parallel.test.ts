import { 
  loadManyLinesParallel, 
  loadManyLinesSequential,
  loadManyLinesLimited 
} from '../src/services/loaders';

describe('Stage 13 - Parallel vs Sequential', () => {
  const lineIds = ['M1', 'M2', 'M6'];

  describe('Parallel Loading', () => {
    test('should load all lines in parallel', async () => {
      const start = Date.now();
      const results = await loadManyLinesParallel(lineIds);
      const totalTime = Date.now() - start;
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.lineId && r.schedule)).toBe(true);
      
      // Parallel should be faster than sum of individual times
      const sumOfIndividualTimes = results.reduce((sum, r) => sum + r.loadTime, 0);
      expect(totalTime).toBeLessThan(sumOfIndividualTimes * 0.8);
    });

    test('should handle empty array', async () => {
      const results = await loadManyLinesParallel([]);
      expect(results).toEqual([]);
    });

    test('should handle single line', async () => {
      const results = await loadManyLinesParallel(['M1']);
      expect(results).toHaveLength(1);
      expect(results[0].lineId).toBe('M1');
    });

    test('should propagate errors', async () => {
      await expect(loadManyLinesParallel(['INVALID'])).rejects.toThrow();
    });
  });

  describe('Sequential Loading', () => {
    test('should load lines one by one', async () => {
      const start = Date.now();
      const results = await loadManyLinesSequential(lineIds);
      const totalTime = Date.now() - start;
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.lineId && r.schedule)).toBe(true);
      
      // Sequential should take approximately sum of individual times
      const sumOfIndividualTimes = results.reduce((sum, r) => sum + r.loadTime, 0);
      expect(totalTime).toBeGreaterThanOrEqual(sumOfIndividualTimes * 0.9);
    });

    test('should maintain order', async () => {
      const results = await loadManyLinesSequential(lineIds);
      expect(results[0].lineId).toBe('M1');
      expect(results[1].lineId).toBe('M2');
      expect(results[2].lineId).toBe('M6');
    });

    test('should handle errors gracefully', async () => {
      const mixedIds = ['M1', 'INVALID', 'M2'];
      await expect(loadManyLinesSequential(mixedIds)).rejects.toThrow();
    });
  });

  describe('Limited Concurrency', () => {
    test('should limit concurrent requests', async () => {
      const results = await loadManyLinesLimited(lineIds, 2);
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.lineId && r.schedule)).toBe(true);
    });

    test('should be faster than sequential but slower than full parallel', async () => {
      const parallelStart = Date.now();
      await loadManyLinesParallel(lineIds);
      const parallelTime = Date.now() - parallelStart;

      const limitedStart = Date.now();
      await loadManyLinesLimited(lineIds, 2);
      const limitedTime = Date.now() - limitedStart;

      const sequentialStart = Date.now();
      await loadManyLinesSequential(lineIds);
      const sequentialTime = Date.now() - sequentialStart;

      // Limited should be between parallel and sequential
      expect(limitedTime).toBeGreaterThan(parallelTime);
      expect(limitedTime).toBeLessThan(sequentialTime);
    });

    test('should handle concurrency of 1 (sequential)', async () => {
      const results = await loadManyLinesLimited(lineIds, 1);
      expect(results).toHaveLength(3);
    });

    test('should handle concurrency greater than array length', async () => {
      const results = await loadManyLinesLimited(['M1', 'M2'], 10);
      expect(results).toHaveLength(2);
    });
  });

  describe('Performance Comparison', () => {
    test('parallel should be significantly faster for many lines', async () => {
      const manyLines = ['M1', 'M2', 'M6'];

      const parallelStart = Date.now();
      const parallelResults = await loadManyLinesParallel(manyLines);
      const parallelDuration = Date.now() - parallelStart;

      const sequentialStart = Date.now();
      const sequentialResults = await loadManyLinesSequential(manyLines);
      const sequentialDuration = Date.now() - sequentialStart;

      // Same results
      expect(parallelResults.length).toBe(sequentialResults.length);
      
      // Parallel should be at least 30% faster
      expect(parallelDuration).toBeLessThan(sequentialDuration * 0.7);
    });
  });
});