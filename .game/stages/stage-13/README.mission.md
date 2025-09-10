# Mission 13: Parallel vs Sequential

## 🎯 Objectif

Implémenter et comparer différentes stratégies de chargement asynchrone : parallèle complet avec Promise.all, séquentiel avec boucle for, et concurrence limitée. Comprendre les compromis entre performance et contrôle des ressources.

## ✅ Critères de validation (Done)

- [ ] `loadManyLinesParallel` utilise Promise.all
- [ ] `loadManyLinesSequential` charge une ligne après l'autre
- [ ] `loadManyLinesLimited` respecte la limite de concurrence
- [ ] Tracking correct des temps de chargement individuels
- [ ] Parallel significativement plus rapide que sequential
- [ ] Limited entre parallel et sequential en performance
- [ ] Gestion correcte des erreurs dans tous les cas
- [ ] Tous les tests passent (npm test)

## ⚠️ Erreurs fréquentes

1. **Promise.all mal utilisé** : Ne pas mapper correctement vers des promesses
2. **Await dans map** : `map(async x => await ...)` ne fait pas ce qu'on pense
3. **For...of vs for** : for...of avec await est séquentiel, pas parallèle
4. **Concurrence non limitée** : Traiter tous en parallèle au lieu de N à la fois
5. **Perte d'ordre** : Les résultats doivent garder l'ordre des inputs

## 💡 CQFR (Ce Qu'il Faut Retenir)

- **Promise.all** : Tout en parallèle, échoue au premier échec
- **Sequential** : Contrôle total, mais plus lent
- **Limited concurrency** : Compromis pour APIs avec rate limiting
- **Performance** : Parallel ~= max(times), Sequential ~= sum(times)
- **Error handling** : Promise.allSettled pour continuer malgré les erreurs