# 📚 GUIDE COMPLET - Transport Aggregator

⚠️ **NOTE**: Ce fichier contient TOUTES les 24 missions avec cours détaillés, exemples et conseils. Regardez votre branche actuelle pour savoir laquelle faire !

---

## Mission 01: Domain Types 🎯

### 📖 Mini-cours : Types Branded et Unions Discriminéeselkthbnijeqd^rsjohbvô$s=rqkjnbsrq^dùklmnb

#### Qu'est-ce qu'un Type Branded ?
Un type branded permet de créer des types distincts basés sur des primitives, évitant les erreurs de mélange :

```typescript
// ❌ Problème sans branding
type LineId = string;
type StopId = string;

const lineId: LineId = "M1";
const stopId: StopId = "Bastille";
// Oups ! Pas d'erreur mais logiquement faux
function findStop(line: LineId, stop: StopId) { /* ... */ }
findStop(stopId, lineId); // Aucune erreur TypeScript !
```

```typescript
// ✅ Solution avec branding
declare const lineIdBrand: unique symbol;
export type LineId = string & { [lineIdBrand]: 'LineId' };

declare const stopIdBrand: unique symbol;
export type StopId = string & { [stopIdBrand]: 'StopId' };

// Maintenant TypeScript détecte l'erreur !
findStop(stopId, lineId); // ❌ Type error !
```

#### Unions Discriminées
Une union discriminée utilise une propriété commune pour différencier les cas :

```typescript
// ✅ Union discriminée avec 'type'
type DelayStatus = 
  | { type: 'onTime' }
  | { type: 'late'; minutes: number }
  | { type: 'cancelled' };

// TypeScript peut faire du narrowing :
function handleDelay(status: DelayStatus) {
  if (status.type === 'late') {
    console.log(`Retard de ${status.minutes} minutes`); // ✅ minutes accessible
  }
}
```

### ✅ Critères de validation
- [ ] Types branded créés pour `LineId`, `StopId`, `TripId` avec `unique symbol`
- [ ] Union discriminée `DelayStatus` avec propriété `type` discriminante
- [ ] Interface `PlannedDeparture` avec tous les champs typés
- [ ] Interface `Departure` étend `PlannedDeparture` avec `status: DelayStatus`
- [ ] Fonctions helper `createLineId()`, `createStopId()`, `createTripId()`
- [ ] Tous les tests passent (`npm test`)

### 🔧 Exercices pratiques

1. **Créez les types branded** (15min)
```typescript
// Votre code ici :
declare const lineIdBrand: unique symbol;
export type LineId = /* à compléter */
```

2. **Testez le branding** (5min)
```typescript
const line = createLineId("M1");
const stop = createStopId("Bastille");
// Cette ligne doit causer une erreur TypeScript :
const mixed: LineId = stop; // ❌ devrait échouer
```

### 💡 CQFR (Ce qu'il faut retenir)
- **Branded types** = sécurité au compile-time, pas de coût runtime
- **`unique symbol`** = garantit l'unicité du brand
- **Unions discriminées** = `type` + narrowing automatique
- **Extension d'interface** = `extends` réutilise les propriétés

### 🐛 Erreurs fréquentes et solutions

1. **❌ Branding simple** :
```typescript
type LineId = string; // Pas de branding !
```
**✅ Solution** : Utiliser `string & { [brand]: 'Type' }`

2. **❌ Union non discriminée** :
```typescript
type Status = 'onTime' | { minutes: number }; // Pas de propriété commune
```
**✅ Solution** : Ajouter `type` dans chaque cas

3. **❌ Oublier l'export** :
```typescript
type LineId = string & { [brand]: 'LineId' }; // Pas exporté !
```
**✅ Solution** : `export type LineId`

### 🔍 Hints progressifs

**Hint 1 (vague)** : Les branded types utilisent intersection avec un objet contenant une propriété unique.

**Hint 2 (précis)** : Utilisez `declare const brand: unique symbol` puis `string & { [brand]: 'TypeName' }`.

**Hint 3 (solution)** : 
```typescript
declare const lineIdBrand: unique symbol;
export type LineId = string & { [lineIdBrand]: 'LineId' };
```

### 🧪 Debugging tips
- Utilisez `npm test -- --verbose` pour voir les détails des erreurs
- Si "Property does not exist", vérifiez vos exports
- Si les tests passent trop facilement, vérifiez le branding avec des assignments croisés

---

## Mission 02: DTO Guards & Parsing 🛡️

### 📖 Mini-cours : Type Guards et Validation

#### Qu'est-ce qu'un Type Guard ?
Un type guard est une fonction qui vérifie le type à runtime ET informe TypeScript :

```typescript
// ❌ Type assertion dangereuse
function parseData(data: unknown) {
  const obj = data as MyType; // Espérons que c'est correct !
  return obj.property; // 💥 Runtime error si data n'est pas MyType
}

// ✅ Type guard sécurisé
function isMyType(data: unknown): data is MyType {
  return data !== null 
    && typeof data === 'object'
    && 'property' in data
    && typeof (data as any).property === 'string';
}

function parseData(data: unknown) {
  if (isMyType(data)) {
    return data.property; // ✅ TypeScript sait que data est MyType
  }
  throw new Error('Invalid data');
}
```

#### Pattern de validation complète
```typescript
interface ScheduleDTO {
  tripId: string;
  stopId: string;
  plannedISO: string;
  platform: string;
  headsign: string;
}

export function isScheduleDTO(value: unknown): value is ScheduleDTO {
  // 1. Vérification de base
  if (value === null || typeof value !== 'object') {
    return false;
  }
  
  const obj = value as any; // Safe cast après vérification
  
  // 2. Vérification de chaque propriété
  return typeof obj.tripId === 'string' &&
         typeof obj.stopId === 'string' &&
         typeof obj.plannedISO === 'string' &&
         typeof obj.platform === 'string' &&
         typeof obj.headsign === 'string';
}
```

### ✅ Critères de validation
- [ ] Guard `isScheduleDTO` valide tous les champs requis
- [ ] Guard `isDelayDTO` valide `status` et `minutes` conditionnels
- [ ] `parseSchedule` convertit DTO → types domaine avec validation
- [ ] `parseDelay` convertit vers union discriminée `DelayStatus`
- [ ] `parseSchedules` et `parseDelays` pour tableaux avec gestion d'erreurs
- [ ] Messages d'erreur informatifs avec index en cas d'échec

### 🔧 Exercices pratiques

1. **Guard simple** (10min)
```typescript
// Complétez ce guard :
export function isScheduleDTO(value: unknown): value is ScheduleDTO {
  if (/* condition de base */) {
    return false;
  }
  const obj = value as any;
  return /* vérifications des propriétés */;
}
```

2. **Guard conditionnel** (15min)
```typescript
// Pour DelayDTO, minutes est requis seulement si status === 'late'
export function isDelayDTO(value: unknown): value is DelayDTO {
  // À vous de jouer !
}
```

3. **Parser avec conversion** (10min)
```typescript
// Convertir DTO vers types domaine
export function parseSchedule(dto: unknown): PlannedDeparture {
  if (!isScheduleDTO(dto)) {
    throw new Error(/* message explicite */);
  }
  return {
    tripId: createTripId(dto.tripId), // Conversion vers branded type
    // ... autres champs
  };
}
```

### 💡 CQFR (Ce qu'il faut retenir)
- **Type guards** = validation runtime + narrowing TypeScript
- **`data is Type`** = signature spéciale pour type narrowing
- **Validation defensive** = vérifier null, typeof, propriétés requises
- **Messages d'erreur** = incluez le contexte (index, valeur reçue)

### 🐛 Erreurs fréquentes et solutions

1. **❌ Pas de vérification de null** :
```typescript
function isType(value: unknown): value is Type {
  return typeof value === 'object' && 'prop' in value; // 💥 null est object !
}
```
**✅ Solution** : `value !== null && typeof value === 'object'`

2. **❌ Oublier le narrowing** :
```typescript
function checkType(value: unknown) {
  return typeof value === 'object'; // Type boolean, pas narrowing
}
```
**✅ Solution** : `function isType(value: unknown): value is Type`

3. **❌ Validation partielle** :
```typescript
function isScheduleDTO(value: unknown): value is ScheduleDTO {
  return 'tripId' in value; // Vérifie qu'une seule propriété !
}
```
**✅ Solution** : Vérifier toutes les propriétés et leurs types

### 🔍 Hints progressifs

**Hint 1** : Un type guard retourne `value is Type` et vérifie chaque propriété.

**Hint 2** : Pour `DelayDTO`, vérifiez que `minutes` existe ET est un nombre quand `status === 'late'`.

**Hint 3** : Pattern complet :
```typescript
export function isScheduleDTO(value: unknown): value is ScheduleDTO {
  return value !== null &&
         typeof value === 'object' &&
         typeof (value as any).tripId === 'string' &&
         /* autres propriétés... */;
}
```

### 📋 Checklist debug
- [ ] Guard retourne `value is Type` (pas `boolean`)
- [ ] Vérification `!== null` avant typeof object
- [ ] Toutes les propriétés vérifiées
- [ ] Cas conditionnel (late status) géré
- [ ] Messages d'erreur avec contexte

---

## Mission 03: HTTP Wrapper 🌐

### 📖 Mini-cours : Promises, Async/Await et Gestion d'Erreurs

#### Promise.race pour timeout
```typescript
// Pattern classique de timeout
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout'));
    }, ms);
    
    // ⚠️ IMPORTANT : Nettoyer le timer !
    promise.finally(() => clearTimeout(timer));
  });
  
  return Promise.race([promise, timeoutPromise]);
}
```

#### AbortController pattern
```typescript
// Annulation standard Web API
const controller = new AbortController();
const signal = controller.signal;

// Vérifier l'annulation
if (signal.aborted) {
  throw new Error('Operation aborted');
}

// Écouter l'annulation
signal.addEventListener('abort', () => {
  // Nettoyer les ressources
});

// Déclencher l'annulation
controller.abort();
```

#### Simulation de latence réaliste
```typescript
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Latence variable pour simuler le réseau
const latency = Math.random() * 150 + 50; // 50-200ms
await sleep(latency);
```

### ✅ Critères de validation
- [ ] `sleep(ms)` retourne `Promise<void>` avec setTimeout
- [ ] `withTimeout<T>` race promise vs timeout avec cleanup
- [ ] `httpGet<T>` générique avec latence simulée aléatoire (50-200ms)
- [ ] Support `AbortSignal` vérifié avant ET après latence
- [ ] Timeout rejette avec `HttpError(code: 'TIMEOUT')`
- [ ] Mapping erreurs : ENOENT → 404, SyntaxError → 500
- [ ] Cleanup des timers sur succès/échec

### 🔧 Exercices pratiques

1. **Sleep function** (5min)
```typescript
function sleep(ms: number): Promise<void> {
  // Votre implémentation ici
}
```

2. **Timeout avec cleanup** (20min)
```typescript
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  // Tips: utilisez Promise.race et n'oubliez pas clearTimeout !
}
```

3. **HttpGet complet** (25min)
```typescript
export async function httpGet<T>(path: string, options: HttpOptions = {}): Promise<T> {
  // 1. Vérifier AbortSignal
  // 2. Créer opération avec latence
  // 3. Appliquer timeout si spécifié
  // 4. Gérer les erreurs avec mapping approprié
}
```

### 💡 CQFR (Ce qu'il faut retenir)
- **Promise.race** = première promesse résolue/rejetée gagne
- **AbortController** = standard pour annulation, compatible avec fetch()
- **Cleanup** = toujours nettoyer timers/listeners pour éviter memory leaks
- **Error mapping** = transformer erreurs système en erreurs métier
- **Latence variable** = Math.random() simule mieux le réseau réel

### 🐛 Erreurs fréquentes et solutions

1. **❌ Memory leak de timer** :
```typescript
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout')), ms); // Timer jamais nettoyé !
});
```
**✅ Solution** : Stocker l'ID et clearTimeout dans finally

2. **❌ AbortSignal ignoré** :
```typescript
export async function httpGet<T>(path: string, options: HttpOptions = {}): Promise<T> {
  await sleep(100);
  return loadJsonFile(path); // Signal jamais vérifié !
}
```
**✅ Solution** : Vérifier options.signal?.aborted avant ET après sleep

3. **❌ Latence fixe** :
```typescript
await sleep(100); // Toujours pareil, pas réaliste
```
**✅ Solution** : `Math.random() * 150 + 50`

4. **❌ Erreurs non typées** :
```typescript
throw new Error('Timeout'); // Error générique
```
**✅ Solution** : `throw new HttpError('Request timeout', 'TIMEOUT')`

### 🔍 Hints progressifs

**Hint 1** : Utilisez Promise.race entre votre opération et une promesse de timeout.

**Hint 2** : Pour le cleanup, stockez l'ID du timer et utilisez promise.finally().

**Hint 3** : Structure recommandée :
```typescript
export async function httpGet<T>(path: string, options: HttpOptions = {}): Promise<T> {
  if (options.signal?.aborted) { /* ... */ }
  
  const operation = async () => {
    const latency = Math.random() * 150 + 50;
    await sleep(latency);
    if (options.signal?.aborted) { /* ... */ }
    return loadJsonFile(path);
  };
  
  return options.timeout ? withTimeout(operation(), options.timeout) : operation();
}
```

### 🧪 Debugging tips
- Testez avec `timeout: 10` pour forcer le timeout
- Utilisez `console.log` pour vérifier l'ordre des opérations
- Testez l'annulation avec `controller.abort()` immédiat
- Vérifiez les types d'erreurs avec `error instanceof HttpError`

---

## Mission 04: Load Basics 📂

### 📖 Mini-cours : Composition de Fonctions et Error Handling

#### Composition de fonctions async
```typescript
// Fonctions simples composées ensemble
async function loadLines(): Promise<string[]> {
  return httpGet<string[]>('lines.json');
}

async function loadStops(): Promise<StopDTO[]> {
  return httpGet<StopDTO[]>('stops.json');
}

// Fonction composée avec logique métier
async function loadStopsByLine(lineId: LineId): Promise<StopDTO[]> {
  const allStops = await loadStops();
  return allStops.filter(stop => stop.lineId === lineId);
}
```

### ✅ Critères de validation
- [ ] `loadLines()` charge `lines.json` et retourne `string[]`
- [ ] `loadStops()` charge `stops.json` et retourne `StopDTO[]`  
- [ ] `loadStopsByLine(lineId)` filtre par LineId
- [ ] Gestion des erreurs HTTP propagées
- [ ] Types de retour corrects et stricts

### 💡 CQFR (Ce qu'il faut retenir)
- **Composition** = combiner fonctions simples pour logique complexe
- **Propagation d'erreurs** = let try/catch à l'appelant
- **Types génériques** = `httpGet<T>` infer le type de retour

---

## Mission 05: Load Schedule 📅

### 📖 Mini-cours : Parsing et Transformation de Données

#### Pattern de chargement avec validation
```typescript
async function loadSchedule(lineId: LineId): Promise<PlannedDeparture[]> {
  const fileName = `schedule.${lineId}.json`;
  const rawData = await httpGet<unknown[]>(fileName);
  return parseSchedules(rawData); // Utilise le parser de mission 2
}
```

### ✅ Critères de validation
- [ ] `loadSchedule(lineId)` charge le bon fichier `schedule.${lineId}.json`
- [ ] Parsing avec `parseSchedules()` (réutilise mission 2)
- [ ] Conversion vers types domaine (`PlannedDeparture[]`)
- [ ] Gestion fichiers manquants (404 → erreur explicite)
- [ ] Support toutes les lignes (M1, M2, M6, T3a, T7)

---

## Mission 06: Normalize & Search 🔍

### 📖 Mini-cours : Traitement de Texte et Algorithmes de Recherche

#### Normalisation de texte
```typescript
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les accents
    .replace(/[\u0300-\u036f]/g, '') // Supprime les marques diacritiques
    .replace(/[^\w\s]/g, '') // Supprime ponctuation
    .trim();
}

// Tests
normalize("Châtelet-Les Halles"); // "chatelet les halles"
normalize("Étoile"); // "etoile"
```

#### Recherche fuzzy simple
```typescript
function searchStops(query: string, stops: StopDTO[]): StopDTO[] {
  const normalizedQuery = normalize(query);
  
  return stops
    .filter(stop => normalize(stop.name).includes(normalizedQuery))
    .sort((a, b) => {
      // Tri par pertinence : exact match en premier
      const aName = normalize(a.name);
      const bName = normalize(b.name);
      
      if (aName.startsWith(normalizedQuery) && !bName.startsWith(normalizedQuery)) return -1;
      if (!aName.startsWith(normalizedQuery) && bName.startsWith(normalizedQuery)) return 1;
      
      return aName.localeCompare(bName);
    });
}
```

### 💡 CQFR (Ce qu'il faut retenir)
- **normalize('NFD')** = décompose les caractères accentués
- **[\u0300-\u036f]** = range Unicode des marques diacritiques
- **includes()** = recherche partielle simple mais efficace
- **startsWith()** = boost de pertinence pour les matchs exacts

---

## Mission 07: Filter Time Window ⏰

### 📖 Mini-cours : Manipulation de Dates et Filtrage Temporel

#### Date parsing et comparaison
```typescript
// Parser ISO string vers Date
const dateTime = new Date('2023-10-15T14:30:00');

// Comparaison de dates
const now = new Date();
const isInFuture = dateTime > now;

// Créer fenêtre temporelle
function createTimeWindow(centerTime: Date, windowMinutes: number) {
  const start = new Date(centerTime.getTime() - windowMinutes * 60000);
  const end = new Date(centerTime.getTime() + windowMinutes * 60000);
  return { start, end };
}
```

#### Filtrage avec fenêtre temporelle
```typescript
function filterByTimeWindow(
  departures: Departure[], 
  centerTime: Date, 
  windowMinutes: number
): Departure[] {
  const { start, end } = createTimeWindow(centerTime, windowMinutes);
  
  return departures.filter(departure => {
    const departureTime = new Date(departure.plannedISO);
    return departureTime >= start && departureTime <= end;
  });
}
```

### ✅ Critères de validation
- [ ] `filterByTimeWindow()` filtre par fenêtre temporelle centrée
- [ ] Support fenêtres futures (prochains départs depuis maintenant)
- [ ] Support fenêtres passées (historique)
- [ ] Gestion edge cases (minuit, changement de jour)
- [ ] Performance optimisée (éviter re-parsing de dates)

### 💡 CQFR (Ce qu'il faut retenir)
- **Date.getTime()** = timestamp millisecondes pour calculs
- **60000** = millisecondes dans une minute
- **ISO strings** = format standard pour dates en JSON
- **Edge cases** = minuit, fuseaux horaires, années bissextiles

---

## Mission 08: Format Lines 🎨

### 📖 Mini-cours : Formatage et Templates

#### Mapping avec emojis
```typescript
const LINE_ICONS: Record<string, string> = {
  'M1': '🚇', 'M2': '🚇', 'M6': '🚇',
  'T3a': '🚊', 'T7': '🚊'
};

function formatLine(lineId: LineId): string {
  const id = lineId as string;
  const icon = LINE_ICONS[id] || '🚌'; // Fallback
  return `${icon} ${id}`;
}
```

### ✅ Critères de validation
- [ ] `formatLine()` ajoute icône appropriée (M→🚇, T→🚊)
- [ ] `formatMultipleLines()` joint avec séparateurs
- [ ] Gestion lignes inconnues avec fallback
- [ ] Format consistant et lisible

---

## Mission 09: Load Delays 📊

### 📖 Mini-cours : Gestion d'Erreurs et Données Manquantes

#### Pattern 404 → tableau vide
```typescript
async function loadDelays(lineId: LineId): Promise<DelayInfo[]> {
  try {
    const fileName = `delays.${lineId}.json`;
    const rawData = await httpGet<unknown[]>(fileName);
    return parseDelays(rawData);
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 404) {
      return []; // Pas de retards = tableau vide
    }
    throw error; // Re-throw autres erreurs
  }
}
```

### ✅ Critères de validation
- [ ] `loadDelays(lineId)` charge `delays.${lineId}.json`
- [ ] Parsing avec validation stricte
- [ ] 404 → `[]` (pas de retards)
- [ ] Support statuts late/cancelled avec minutes

---

## Mission 10: Merge Schedule & Delays 🔗

### 📖 Mini-cours : Jointures de Données et Algorithmes

#### Merge par clé (tripId)
```typescript
function mergeScheduleWithDelays(
  schedule: PlannedDeparture[], 
  delays: DelayInfo[]
): Departure[] {
  // Map pour lookup O(1)
  const delayMap = new Map<string, DelayInfo>();
  delays.forEach(delay => delayMap.set(delay.tripId, delay));
  
  return schedule.map(planned => {
    const delay = delayMap.get(planned.tripId);
    const status: DelayStatus = delay 
      ? parseDelayStatus(delay)
      : { type: 'onTime' };
      
    return { ...planned, status };
  });
}
```

### 💡 CQFR (Ce qu'il faut retenir)
- **Map lookup** = O(1) vs filter O(n) pour jointures
- **Spread operator** = `{...obj, newProp}` pour immutabilité
- **Fallback** = données manquantes → valeur par défaut

---

## Mission 11: Sort & Group 📋

### 📖 Mini-cours : Algorithmes de Tri et Groupement

#### Tri stable par temps
```typescript
function sortByTime(departures: Departure[]): Departure[] {
  return [...departures].sort((a, b) => {
    const timeA = calculateEffectiveTime(a);
    const timeB = calculateEffectiveTime(b);
    return timeA.getTime() - timeB.getTime();
  });
}

function calculateEffectiveTime(departure: Departure): Date {
  const planned = new Date(departure.plannedISO);
  if (departure.status.type === 'late') {
    return new Date(planned.getTime() + departure.status.minutes * 60000);
  }
  return planned;
}
```

#### Groupement avec reduce
```typescript
function groupByStatus(departures: Departure[]): Record<string, Departure[]> {
  return departures.reduce((groups, departure) => {
    const status = departure.status.type;
    if (!groups[status]) groups[status] = [];
    groups[status].push(departure);
    return groups;
  }, {} as Record<string, Departure[]>);
}
```

### ✅ Critères de validation
- [ ] `sortByTime()` tri chronologique (temps effectif)
- [ ] `groupByLine()` et `groupByStatus()` avec Record<string, T[]>
- [ ] Tri stable (ordre préservé pour égalités)
- [ ] Immutabilité (spread avant sort)

---

## Mission 12: Top N Departures 🎯

### 📖 Mini-cours : Sélection et Prioritisation

```typescript
function getTopDepartures(departures: Departure[], limit: number): Departure[] {
  return departures
    .filter(d => d.status.type !== 'cancelled') // Exclure annulés
    .sort((a, b) => {
      // Priorité aux départs à l'heure
      if (a.status.type === 'onTime' && b.status.type !== 'onTime') return -1;
      if (a.status.type !== 'onTime' && b.status.type === 'onTime') return 1;
      
      // Puis tri par temps effectif
      return calculateEffectiveTime(a).getTime() - calculateEffectiveTime(b).getTime();
    })
    .slice(0, limit);
}
```

### 💡 CQFR (Ce qu'il faut retenir)
- **Filter avant sort** = évite tri d'éléments exclus
- **Priorité multi-critères** = conditions dans comparateur
- **slice(0, n)** = prendre les n premiers

---

## Mission 13: Parallel vs Sequential 🏎️

### 📖 Mini-cours : Programmation Asynchrone Avancée

#### Promise.all vs séquentiel
```typescript
// Parallèle - toutes en même temps
async function loadAllLinesParallel(lines: LineId[]): Promise<PlannedDeparture[][]> {
  const promises = lines.map(line => loadSchedule(line));
  return Promise.all(promises); // Échoue si une promesse échoue
}

// Séquentiel - une après l'autre
async function loadAllLinesSequential(lines: LineId[]): Promise<PlannedDeparture[][]> {
  const results: PlannedDeparture[][] = [];
  for (const line of lines) {
    const schedule = await loadSchedule(line);
    results.push(schedule);
  }
  return results;
}

// Safe parallèle - continue même si échecs
async function loadAllLinesSafe(lines: LineId[]): Promise<PromiseSettledResult<PlannedDeparture[]>[]> {
  const promises = lines.map(line => loadSchedule(line));
  return Promise.allSettled(promises);
}
```

### ✅ Critères de validation
- [ ] `loadAllLinesParallel()` avec Promise.all
- [ ] `loadAllLinesSequential()` avec boucle for/await
- [ ] `loadAllLinesSafe()` avec Promise.allSettled
- [ ] Mesure et comparaison des performances
- [ ] Gestion des échecs partiels

### 💡 CQFR (Ce qu'il faut retenir)
- **Promise.all** = parallèle, rapide mais fragile
- **Sequential** = lent mais prévisible
- **Promise.allSettled** = parallèle et robuste
- **PromiseSettledResult** = {status: 'fulfilled'|'rejected', value|reason}

---

## Mission 14: Retry & Fallback 🔄

### 📖 Mini-cours : Résilience et Patterns d'Erreur

#### Retry avec backoff exponentiel
```typescript
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 1;
  
  while (attempt <= maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await sleep(delay);
      attempt++;
    }
  }
  
  throw new Error('Max attempts reached');
}
```

### ✅ Critères de validation
- [ ] `retry()` fonction générique avec generics
- [ ] Backoff exponentiel (délai × 2^attempt)
- [ ] Limite tentatives configurable
- [ ] Logs des tentatives avec détails
- [ ] Fallback strategy sur échec final

---

## Mission 15: Result Type 📦

### 📖 Mini-cours : Programmation Fonctionnelle et Gestion d'Erreurs

#### Pattern Result<T, E>
```typescript
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Constructeurs
function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Méthodes de transformation
function map<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
  return result.success ? ok(fn(result.data)) : result;
}

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.success ? result.data : defaultValue;
}
```

### ✅ Critères de validation
- [ ] Type `Result<T, E>` union discriminée avec success
- [ ] Constructeurs `ok()` et `err()` 
- [ ] `map()` pour transformer succès
- [ ] `mapErr()` pour transformer erreurs
- [ ] `unwrapOr()` avec valeur par défaut

---

## Mission 16: Search Cancellation 🛑

### 📖 Mini-cours : AbortController et Gestion d'Annulation

```typescript
class SearchController {
  private currentController?: AbortController;
  
  async search(query: string): Promise<StopDTO[]> {
    // Annuler recherche précédente
    this.currentController?.abort();
    
    // Nouvelle recherche
    this.currentController = new AbortController();
    const signal = this.currentController.signal;
    
    try {
      const stops = await loadStops({ signal });
      if (signal.aborted) throw new Error('Search cancelled');
      
      return searchStops(query, stops);
    } catch (error) {
      if (signal.aborted) throw new Error('Search cancelled');
      throw error;
    }
  }
  
  cancel() {
    this.currentController?.abort();
  }
}
```

---

## Mission 17: Cache Layer 💾

### 📖 Mini-cours : Mise en Cache et Performance

#### LRU Cache avec TTL
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttlMs: number;
  
  constructor(maxSize: number = 100, ttlMs: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }
  
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    // Vérifier TTL
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Update access
    entry.accessCount++;
    return entry.data;
  }
  
  set(key: string, data: T): void {
    // Éviction LRU si plein
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1
    });
  }
  
  private evictLRU(): void {
    let lruKey = '';
    let lruAccess = Infinity;
    
    for (const [key, entry] of this.cache) {
      if (entry.accessCount < lruAccess) {
        lruAccess = entry.accessCount;
        lruKey = key;
      }
    }
    
    this.cache.delete(lruKey);
  }
}
```

---

## Mission 18: Configuration Options ⚙️

### 📖 Mini-cours : Pattern Options et Configuration

```typescript
interface AggregatorOptions {
  cacheEnabled: boolean;
  cacheTTL: number;
  maxRetries: number;
  timeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

const DEFAULT_OPTIONS: AggregatorOptions = {
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000,
  maxRetries: 3,
  timeout: 10000,
  logLevel: 'info'
};

function mergeOptions(userOptions: Partial<AggregatorOptions>): AggregatorOptions {
  return { ...DEFAULT_OPTIONS, ...userOptions };
}
```

---

## Mission 19: Clean Code Refactoring ✨

### 📖 Mini-cours : Principes SOLID et Clean Code

#### Single Responsibility Principle
```typescript
// ❌ Classe qui fait trop de choses
class TransportService {
  async loadData() { /* ... */ }
  formatDisplay() { /* ... */ }
  validateInput() { /* ... */ }
  sendNotification() { /* ... */ }
}

// ✅ Responsabilités séparées
class DataLoader {
  async loadSchedules() { /* ... */ }
  async loadDelays() { /* ... */ }
}

class DisplayFormatter {
  formatDepartures() { /* ... */ }
  formatLines() { /* ... */ }
}

class InputValidator {
  validateLineId() { /* ... */ }
  validateTimeRange() { /* ... */ }
}
```

#### DRY et fonctions courtes
```typescript
// ❌ Code répétitif et fonction longue
function processTransportData(lineId: string) {
  // 50 lignes de code qui font plusieurs choses...
}

// ✅ DRY et fonctions courtes
function loadAndValidateData(lineId: LineId) {
  const data = loadSchedule(lineId);
  return validateScheduleData(data);
}

function formatForDisplay(data: PlannedDeparture[]) {
  return data.map(formatSingleDeparture);
}

function formatSingleDeparture(departure: PlannedDeparture) {
  // Une seule responsabilité, < 20 lignes
}
```

---

## Mission 20: Main Orchestrator 🎭

### 📖 Mini-cours : Orchestration et Architecture

```typescript
async function main(params: MainOptions): Promise<Result<string, string>> {
  try {
    // 1. Validation des paramètres
    const validatedParams = validateMainOptions(params);
    
    // 2. Chargement parallèle
    const [schedules, delays] = await Promise.all([
      loadAllSchedulesParallel(validatedParams.lines),
      loadAllDelaysParallel(validatedParams.lines)
    ]);
    
    // 3. Fusion des données
    const mergedData = mergeSchedulesWithDelays(schedules, delays);
    
    // 4. Filtrage et tri
    const filtered = filterByStop(mergedData, validatedParams.stop);
    const sorted = sortByTime(filtered);
    const topResults = getTopDepartures(sorted, validatedParams.limit);
    
    // 5. Formatage du rapport
    const report = formatReport(topResults, validatedParams.stop);
    
    return ok(report);
  } catch (error) {
    return err(`Failed to generate report: ${error.message}`);
  }
}
```

---

## Mission 21-24: Tests, Coverage, Alerts & CLI

### 📖 Mini-cours : Testing, Quality & Production

#### Jest Mocks
```typescript
// Mock du module HTTP
jest.mock('../services/http-wrapper');
const mockHttpGet = httpGet as jest.MockedFunction<typeof httpGet>;

describe('loadSchedule', () => {
  it('should load and parse schedule data', async () => {
    mockHttpGet.mockResolvedValue(mockScheduleData);
    
    const result = await loadSchedule(createLineId('M1'));
    
    expect(mockHttpGet).toHaveBeenCalledWith('schedule.M1.json');
    expect(result).toHaveLength(10);
  });
});
```

#### CLI avec yargs
```typescript
#!/usr/bin/env node
import yargs from 'yargs';
import { main } from './main';

const argv = yargs
  .option('lines', {
    alias: 'l',
    describe: 'Transport lines to query',
    type: 'array',
    demandOption: true
  })
  .option('stop', {
    alias: 's', 
    describe: 'Stop name to filter',
    type: 'string',
    demandOption: true
  })
  .help()
  .argv;

main(argv).then(result => {
  if (result.success) {
    console.log(result.data);
  } else {
    console.error(result.error);
    process.exit(1);
  }
});
```

---

## 🎮 Commandes utiles

```bash
# Voir la mission actuelle
git branch --show-current

# Tester avec détails
npm test -- --verbose

# Coverage détaillé  
npm run coverage

# Obtenir un indice
npm run hint

# Mission suivante
npm run next

# Debug TypeScript
npx tsc --noEmit

# Annuler les modifications
npm run reset:here
```

## 🔗 Ressources supplémentaires

- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Documentation officielle
- [Jest Testing Framework](https://jestjs.io/docs/getting-started) - Guide Jest
- [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - Async/await
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) - Narrowing guide

**Bon courage dans votre apprentissage !** 🚀

*Rappel : Ce fichier est une référence complète. Concentrez-vous sur votre branche actuelle et n'hésitez pas à revenir ici pour les concepts théoriques !*