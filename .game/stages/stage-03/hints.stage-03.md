Pour implémenter sleep, créez une Promise qui se résout après un délai:
```typescript
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```
---
Pour withTimeout, utilisez Promise.race avec un timeout qui rejette:
```typescript
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new HttpError('Timeout', 'TIMEOUT')), ms)
  );
  return Promise.race([promise, timeout]);
}
```
---
Pour httpGet, vérifiez d'abord l'AbortSignal, ajoutez la latence, puis utilisez withTimeout:
```typescript
export async function httpGet<T>(path: string, options: HttpOptions = {}): Promise<T> {
  if (options.signal?.aborted) {
    throw new HttpError('Aborted', 'ABORTED');
  }
  
  // Latence aléatoire
  const latency = Math.random() * 150 + 50;
  await sleep(latency);
  
  const loadPromise = Promise.resolve(loadJsonFile(path));
  
  if (options.timeout) {
    return withTimeout(loadPromise, options.timeout);
  }
  
  return loadPromise;
}
```