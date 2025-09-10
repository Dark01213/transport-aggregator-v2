Pour un type guard robuste, vérifiez d'abord que value est un objet:
```typescript
function isDTO(value: unknown): value is MyDTO {
  return value !== null 
    && typeof value === 'object'
    && 'field' in value
    && typeof (value as any).field === 'string';
}
```
---
Pour le status 'late', n'oubliez pas de vérifier la présence ET le type de minutes:
```typescript
if (dto.status === 'late') {
  if (typeof dto.minutes !== 'number' || dto.minutes <= 0) {
    throw new Error('Late status requires positive minutes');
  }
}
```
---
Pour parser un tableau, utilisez Array.isArray() puis map avec validation:
```typescript
if (!Array.isArray(data)) {
  throw new Error('Expected array, got ' + typeof data);
}
return data.map((item, index) => {
  try {
    return parseItem(item);
  } catch (e) {
    throw new Error(`Invalid item at index ${index}: ${e.message}`);
  }
});
```