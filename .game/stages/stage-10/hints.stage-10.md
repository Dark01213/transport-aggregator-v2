Pour optimiser la fusion, créez d'abord une Map des retards:
```typescript
const delayMap = new Map(delays.map(d => [d.tripId, d.status]));
```
Ensuite parcourez planning une seule fois en faisant des lookups O(1).
---
N'oubliez pas le status par défaut onTime si aucun retard trouvé:
```typescript
const status = delayMap.get(planned.tripId) || { type: 'onTime' };
return { ...planned, status };
```
---
La complexité O(n*m) viendrait d'un find() dans la boucle:
```typescript
// MAUVAIS: O(n*m)
planning.map(p => ({
  ...p,
  status: delays.find(d => d.tripId === p.tripId)?.status || { type: 'onTime' }
}))

// BON: O(n+m) avec Map
const map = new Map(...);
planning.map(p => ({ ...p, status: map.get(p.tripId) || { type: 'onTime' }}))
```