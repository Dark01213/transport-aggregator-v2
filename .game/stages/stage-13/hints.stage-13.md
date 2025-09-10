Pour le chargement parallèle, utilisez Promise.all avec map:
```typescript
async function loadManyLinesParallel(lineIds: string[]): Promise<LineAggregate[]> {
  const promises = lineIds.map(id => loadLineWithTiming(id));
  return Promise.all(promises);
}
```
---
Pour le séquentiel, utilisez une boucle for...of avec await:
```typescript
async function loadManyLinesSequential(lineIds: string[]): Promise<LineAggregate[]> {
  const results: LineAggregate[] = [];
  for (const lineId of lineIds) {
    const result = await loadLineWithTiming(lineId);
    results.push(result);
  }
  return results;
}
```
---
Pour la concurrence limitée, traitez par chunks:
```typescript
async function loadManyLinesLimited(lineIds: string[], max: number): Promise<LineAggregate[]> {
  const results: LineAggregate[] = [];
  
  for (let i = 0; i < lineIds.length; i += max) {
    const chunk = lineIds.slice(i, i + max);
    const chunkResults = await Promise.all(
      chunk.map(id => loadLineWithTiming(id))
    );
    results.push(...chunkResults);
  }
  
  return results;
}
```