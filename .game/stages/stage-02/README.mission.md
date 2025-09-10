# Mission 02: DTO Guards & Parsing

## 🎯 Objectif

Implémenter des type guards robustes et des fonctions de parsing pour valider et transformer les données externes (JSON) en types de domaine sûrs. Vous devez garantir que toutes les données entrantes sont validées avant utilisation.

## ✅ Critères de validation (Done)

- [ ] Type guard `isScheduleDTO` validant tous les champs requis
- [ ] Type guard `isDelayDTO` gérant les 3 statuts avec validation
- [ ] Parser `parseSchedule` transformant DTO → PlannedDeparture
- [ ] Parser `parseDelay` transformant DTO → DelayStatus  
- [ ] Parsers de tableaux avec validation complète
- [ ] Messages d'erreur descriptifs en cas d'échec
- [ ] Tous les tests passent (npm test)

## ⚠️ Erreurs fréquentes

1. **Validation incomplète** : Oublier de vérifier le type de chaque champ
2. **Late sans minutes** : Le status 'late' DOIT avoir un champ minutes
3. **Type assertion unsafe** : Utiliser `as` sans validation préalable
4. **Erreurs peu claires** : Throw "Invalid" au lieu de décrire le problème
5. **Oublier null/undefined** : Les guards doivent gérer tous les cas

## 💡 CQFR (Ce Qu'il Faut Retenir)

- **Defense in depth** : Valider tôt, valider souvent
- **Type narrowing** : Les guards permettent à TS d'inférer les types
- **Fail fast** : Erreur immédiate avec message clair > bug silencieux
- **Unknown over any** : Toujours partir d'`unknown` pour les données externes
- **Composition** : Réutiliser les guards simples pour les cas complexes