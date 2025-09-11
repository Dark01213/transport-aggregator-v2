# 📚 TOUTES LES MISSIONS - Transport Aggregator

⚠️ **NOTE**: Ce fichier contient TOUTES les missions comme référence. Regardez votre branche actuelle pour savoir laquelle faire !

---

## Mission 01: Domain Types

### 🎯 Objectif
Définir les types de domaine fondamentaux pour l'agrégateur de transport. Vous devez créer des types "branded" pour garantir la sécurité des types, et définir les structures de données principales pour les départs planifiés et leurs statuts.

### ✅ Critères de validation
- [ ] Types branded créés pour `LineId`, `StopId`, `TripId`
- [ ] Union discriminée `DelayStatus` avec 3 cas: onTime, late, cancelled
- [ ] Interface `PlannedDeparture` avec tous les champs requis
- [ ] Interface `Departure` étendant `PlannedDeparture` avec status
- [ ] Fonctions helper pour créer les types branded
- [ ] Tous les tests passent (npm test)

### ⚠️ Erreurs fréquentes
1. **Oublier le branding** : Un simple `type LineId = string` ne suffit pas
2. **Union non discriminée** : Utiliser `|` sans propriété discriminante
3. **any dans DelayStatus** : L'union doit être exhaustive et typée
4. **Oublier l'extension** : `Departure` doit hériter de `PlannedDeparture`

---

## Mission 02: DTO Guards & Parsing

### 🎯 Objectif
Créer des guards TypeScript pour valider et parser les données JSON en types domaine. Les guards doivent être stricts et rejeter toute donnée malformée.

### ✅ Critères de validation
- [ ] Guard `isScheduleDTO` pour valider les arrêts
- [ ] Guard `isDelayDTO` pour les départs planifiés
- [ ] Fonction `parseSchedule` qui parse et valide un tableau d'arrêts
- [ ] Fonction `parseSchedules` avec validation complète
- [ ] Gestion des cas d'erreur (données manquantes, types incorrects)

### ⚠️ Erreurs fréquentes
1. **Validation incomplète** : Oublier de vérifier tous les champs
2. **Type assertions dangereuses** : Utiliser `as` au lieu de guards
3. **Pas de narrowing** : Les guards doivent faire du type narrowing
4. **Oublier le late status** : Le guard doit accepter 'late' avec minutes

---

## Mission 03: HTTP Wrapper

### 🎯 Objectif
Créer un wrapper HTTP typé qui simule des requêtes réseau en chargeant des fichiers JSON locaux. Le wrapper doit inclure une latence simulée, support du timeout, gestion de l'annulation via AbortSignal, et un mapping d'erreurs approprié.

### ✅ Critères de validation
- [ ] Fonction `sleep` pour simuler la latence réseau
- [ ] Fonction `withTimeout` pour gérer les timeouts
- [ ] Wrapper `httpGet<T>` générique et typé
- [ ] Latence simulée entre 50-200ms (aléatoire)
- [ ] Support du timeout avec rejet HttpError approprié
- [ ] Support d'AbortSignal pour l'annulation
- [ ] Mapping des erreurs filesystem → HTTP (404, 500)

### ⚠️ Erreurs fréquentes
1. **Promise.race mal utilisée** : Le timeout doit nettoyer ses ressources
2. **AbortSignal ignoré** : Vérifier signal.aborted avant et pendant
3. **Latence fixe** : Doit être aléatoire pour simuler le réseau
4. **Erreurs non typées** : Toujours throw HttpError, pas Error
5. **Cleanup manquant** : Clear les timeouts si la requête réussit

---

## Mission 04: Load Basics

### 🎯 Objectif
Implémenter les fonctions de chargement basiques pour les lignes et les arrêts en utilisant le wrapper HTTP.

### ✅ Critères de validation
- [ ] Fonction `loadLines` qui charge la liste des lignes
- [ ] Fonction `loadStops` qui charge tous les arrêts
- [ ] Fonction `loadStopsByLine` qui filtre les arrêts par ligne
- [ ] Gestion des erreurs HTTP
- [ ] Types de retour corrects

---

## Mission 05: Load Schedule

### 🎯 Objectif
Charger et parser les plannings de départs pour une ligne donnée.

### ✅ Critères de validation
- [ ] Fonction `loadSchedule` qui charge le planning d'une ligne
- [ ] Parsing et validation des données
- [ ] Conversion en types domaine
- [ ] Gestion des fichiers manquants
- [ ] Support de toutes les lignes (M1, M2, M6, T3a, T7)

---

## Mission 06: Normalize & Search

### 🎯 Objectif
Implémenter la normalisation de texte et la recherche fuzzy pour les arrêts.

### ✅ Critères de validation
- [ ] Fonction `normalize` qui enlève accents, casse, ponctuation
- [ ] Fonction `searchStops` avec recherche partielle
- [ ] Support des recherches avec/sans accents
- [ ] Résultats triés par pertinence

---

## Mission 07: Filter Time Window

### 🎯 Objectif
Filtrer les départs dans une fenêtre temporelle donnée.

### ✅ Critères de validation
- [ ] Fonction `filterByTimeWindow` 
- [ ] Support des fenêtres futures (prochains départs)
- [ ] Support des fenêtres passées (historique)
- [ ] Gestion des edge cases (minuit, etc.)

---

## Mission 08: Format Lines

### 🎯 Objectif
Formater l'affichage des lignes de transport avec leurs icônes.

### ✅ Critères de validation
- [ ] Fonction `formatLine` avec icônes (M→🚇, T→🚊)
- [ ] Fonction `formatMultipleLines` pour les listes
- [ ] Gestion des lignes inconnues
- [ ] Format lisible et cohérent

---

## Mission 09: Load Delays

### 🎯 Objectif
Charger les informations de retard temps réel pour une ligne.

### ✅ Critères de validation
- [ ] Fonction `loadDelays` qui charge les retards
- [ ] Parsing et validation des données de retard
- [ ] Gestion des cas sans retard (404 → tableau vide)
- [ ] Support de tous les status (late, cancelled)

---

## Mission 10: Merge Schedule & Delays

### 🎯 Objectif
Fusionner les horaires planifiés avec les retards temps réel.

### ✅ Critères de validation
- [ ] Fonction `mergeScheduleWithDelays`
- [ ] Matching par tripId
- [ ] Application correcte des retards (ajout minutes)
- [ ] Départs sans retard → status onTime
- [ ] Préservation des départs non affectés

---

## Mission 11: Sort & Group

### 🎯 Objectif
Trier et grouper les départs par différents critères.

### ✅ Critères de validation
- [ ] Fonction `sortByTime` (ordre chronologique)
- [ ] Fonction `groupByLine` (groupement par ligne)
- [ ] Fonction `groupByStatus` (onTime, late, cancelled)
- [ ] Stabilité du tri

---

## Mission 12: Top N Departures

### 🎯 Objectif
Sélectionner les N prochains départs les plus pertinents.

### ✅ Critères de validation
- [ ] Fonction `getTopDepartures` avec limite configurable
- [ ] Exclusion des départs annulés
- [ ] Priorité aux départs à l'heure
- [ ] Tri par temps effectif (planifié + retard)

---

## Mission 13: Parallel vs Sequential

### 🎯 Objectif
Implémenter le chargement parallèle et séquentiel avec gestion d'erreurs.

### ✅ Critères de validation
- [ ] Fonction `loadAllLinesParallel` avec Promise.all
- [ ] Fonction `loadAllLinesSequential` avec boucle
- [ ] Fonction `loadAllLinesSafe` avec Promise.allSettled
- [ ] Comparaison des performances
- [ ] Gestion des échecs partiels

---

## Mission 14: Retry & Fallback

### 🎯 Objectif
Implémenter un mécanisme de retry avec backoff exponentiel.

### ✅ Critères de validation
- [ ] Fonction `retry` générique
- [ ] Backoff exponentiel (délai doublé)
- [ ] Limite de tentatives configurable
- [ ] Fallback sur échec final
- [ ] Logs des tentatives

---

## Mission 15: Result Type

### 🎯 Objectif
Créer un type Result<T, E> pour la gestion d'erreurs fonctionnelle.

### ✅ Critères de validation
- [ ] Type `Result<T, E>` avec Ok et Err
- [ ] Fonctions `ok()` et `err()` constructeurs
- [ ] Méthode `map` pour transformer les succès
- [ ] Méthode `mapErr` pour transformer les erreurs
- [ ] Méthode `unwrapOr` avec valeur par défaut

---

## Mission 16: Search Cancellation

### 🎯 Objectif
Implémenter l'annulation de recherche avec AbortController.

### ✅ Critères de validation
- [ ] Support AbortSignal dans la recherche
- [ ] Annulation propre des requêtes en cours
- [ ] UI feedback sur annulation
- [ ] Nettoyage des ressources
- [ ] Tests avec timeouts courts

---

## Mission 17: Cache Layer

### 🎯 Objectif
Ajouter une couche de cache pour optimiser les performances.

### ✅ Critères de validation
- [ ] Cache LRU avec taille limite
- [ ] TTL configurable
- [ ] Invalidation sur mise à jour
- [ ] Métriques de hit/miss
- [ ] Cache warming au démarrage

---

## Mission 18: Configuration Options

### 🎯 Objectif
Créer un système de configuration centralisé.

### ✅ Critères de validation
- [ ] Interface `AggregatorOptions`
- [ ] Valeurs par défaut sensées
- [ ] Validation des options
- [ ] Merge avec défauts
- [ ] Options par environnement

---

## Mission 19: Clean Code Refactoring

### 🎯 Objectif
Refactorer le code pour respecter les principes SOLID et clean code.

### ✅ Critères de validation
- [ ] Single Responsibility Principle
- [ ] DRY (Don't Repeat Yourself)
- [ ] Fonctions < 20 lignes
- [ ] Noms explicites
- [ ] Commentaires minimaux (code auto-documenté)

---

## Mission 20: Main Orchestrator

### 🎯 Objectif
Créer l'orchestrateur principal qui combine tous les composants.

### ✅ Critères de validation
- [ ] Fonction `main` qui coordonne tout
- [ ] Chargement parallèle des données
- [ ] Fusion schedules + delays
- [ ] Filtrage et tri
- [ ] Formatage du rapport final
- [ ] Gestion des échecs partiels

---

## Mission 21: Tests with Mocks

### 🎯 Objectif
Écrire des tests unitaires avec des mocks Jest.

### ✅ Critères de validation
- [ ] Mocks pour les appels HTTP
- [ ] Tests isolés par composant
- [ ] Assertions sur les appels
- [ ] Tests des cas d'erreur
- [ ] Coverage > 70%

---

## Mission 22: Coverage 80%+

### 🎯 Objectif
Atteindre 80% de couverture de code avec des tests pertinents.

### ✅ Critères de validation
- [ ] Coverage global > 80%
- [ ] Branches coverage > 75%
- [ ] Pas de tests inutiles
- [ ] Edge cases couverts
- [ ] Rapport HTML généré

---

## Mission 23: Alert Summary

### 🎯 Objectif
Créer un système de résumé des alertes et problèmes.

### ✅ Critères de validation
- [ ] Détection des retards importants (>10min)
- [ ] Comptage des annulations
- [ ] Alertes par ligne
- [ ] Formatage lisible
- [ ] Priorité des alertes

---

## Mission 24: CLI Report

### 🎯 Objectif
Créer un rapport CLI final avec toutes les informations.

### ✅ Critères de validation
- [ ] Interface ligne de commande
- [ ] Arguments pour filtrer (ligne, arrêt, fenêtre)
- [ ] Affichage coloré (si terminal supporte)
- [ ] Mode verbose/quiet
- [ ] Export JSON optionnel
- [ ] Statistiques finales

---

## 🎮 Commandes utiles

```bash
# Voir la mission actuelle
git branch --show-current

# Tester
npm test

# Obtenir un indice
npm run hint

# Mission suivante
npm run next

# Annuler les modifications
npm run reset:here
```

**Bon courage !** 🚀