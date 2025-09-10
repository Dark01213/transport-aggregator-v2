Pour créer un branded type en TypeScript, utilisez un symbole unique:
```typescript
declare const brand: unique symbol;
type BrandedType = string & { [brand]: 'MyBrand' };
```
---
Pour l'union discriminée DelayStatus, pensez à un pattern comme:
```typescript
type Status = 
  | { type: 'onTime' }
  | { type: 'late'; minutes: number }
  | { type: 'cancelled' }
```
---
Les fonctions helper doivent faire un cast explicite:
```typescript
function createId(value: string): BrandedId {
  return value as BrandedId;
}
```
N'oubliez pas que Departure extends PlannedDeparture!