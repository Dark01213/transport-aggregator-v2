# Mission 01: Domain Types

## 🎯 Objectif

Définir les types de domaine fondamentaux pour l'agrégateur de transport. Vous devez créer des types "branded" pour garantir la sécurité des types, et définir les structures de données principales pour les départs planifiés et leurs statuts.

## ✅ Critères de validation (Done)

- [ ] Types branded créés pour `LineId`, `StopId`, `TripId`
- [ ] Union discriminée `DelayStatus` avec 3 cas: onTime, late, cancelled
- [ ] Interface `PlannedDeparture` avec tous les champs requis
- [ ] Interface `Departure` étendant `PlannedDeparture` avec status
- [ ] Fonctions helper pour créer les types branded
- [ ] Tous les tests passent (npm test)

## ⚠️ Erreurs fréquentes

1. **Oublier le branding** : Un simple `type LineId = string` ne suffit pas
2. **Union non discriminée** : Utiliser `|` sans propriété discriminante
3. **any dans DelayStatus** : L'union doit être exhaustive et typée
4. **Oublier l'extension** : `Departure` doit hériter de `PlannedDeparture`

## 💡 CQFR (Ce Qu'il Faut Retenir)

- **Branded types** : Empêchent les mélanges accidentels d'IDs
- **Unions discriminées** : Pattern `{ type: 'xxx', ...data }` pour un narrowing facile
- **Typage strict** : Aucun `any`, préférer `unknown` + guards
- **Immutabilité** : Les types définissent le contrat, pas l'implémentation
- **DRY** : Utiliser l'héritage d'interface pour éviter la duplication