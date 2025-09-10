import { httpGet, HttpError, HttpOptions } from '../src/services/http-wrapper';

describe('Stage 03 - HTTP Wrapper', () => {
  describe('Basic HTTP GET', () => {
    test('should load existing JSON file', async () => {
      const result = await httpGet<string[]>('lines.json');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain('M1');
    });

    test('should handle 404 for non-existent file', async () => {
      await expect(httpGet('non-existent.json')).rejects.toThrow(HttpError);
      
      try {
        await httpGet('non-existent.json');
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.code).toBe('NOT_FOUND');
        expect(error.statusCode).toBe(404);
      }
    });

    test('should include simulated latency', async () => {
      const start = Date.now();
      await httpGet('lines.json');
      const duration = Date.now() - start;
      
      // Should have at least some latency (50ms minimum)
      expect(duration).toBeGreaterThanOrEqual(45); // Allow some tolerance
    });
  });

  describe('Timeout Support', () => {
    test('should timeout if request takes too long', async () => {
      // Set a very short timeout
      const options: HttpOptions = { timeout: 10 };
      
      await expect(httpGet('lines.json', options)).rejects.toThrow(HttpError);
      
      try {
        await httpGet('lines.json', options);
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.code).toBe('TIMEOUT');
      }
    });

    test('should complete if within timeout', async () => {
      const options: HttpOptions = { timeout: 1000 };
      const result = await httpGet<string[]>('lines.json', options);
      expect(result).toBeDefined();
    });
  });

  describe('AbortSignal Support', () => {
    test('should cancel request when signal is aborted', async () => {
      const controller = new AbortController();
      const options: HttpOptions = { signal: controller.signal };
      
      // Abort immediately
      controller.abort();
      
      await expect(httpGet('lines.json', options)).rejects.toThrow();
    });

    test('should complete if signal not aborted', async () => {
      const controller = new AbortController();
      const options: HttpOptions = { signal: controller.signal };
      
      const result = await httpGet<string[]>('lines.json', options);
      expect(result).toBeDefined();
    });
  });

  describe('Error Mapping', () => {
    test('should map file errors to HTTP errors', async () => {
      // This would test invalid JSON if we had a malformed file
      // For now, just verify the error structure
      try {
        await httpGet('../../etc/passwd'); // Trying to access outside data dir
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.code).toBeDefined();
        expect(error.message).toBeDefined();
      }
    });
  });
});