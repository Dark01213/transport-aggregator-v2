# Mission 03: HTTP Wrapper

## 🎯 Objectif

Créer un wrapper HTTP typé qui simule des requêtes réseau en chargeant des fichiers JSON locaux. Le wrapper doit inclure une latence simulée, support du timeout, gestion de l'annulation via AbortSignal, et un mapping d'erreurs approprié.

## ✅ Critères de validation (Done)

- [ ] Fonction `sleep` pour simuler la latence réseau
- [ ] Fonction `withTimeout` pour gérer les timeouts
- [ ] Wrapper `httpGet<T>` générique et typé
- [ ] Latence simulée entre 50-200ms (aléatoire)
- [ ] Support du timeout avec rejet HttpError approprié
- [ ] Support d'AbortSignal pour l'annulation
- [ ] Mapping des erreurs filesystem → HTTP (404, 500)
- [ ] Tous les tests passent (npm test)

## ⚠️ Erreurs fréquentes

1. **Promise.race mal utilisée** : Le timeout doit nettoyer ses ressources
2. **AbortSignal ignoré** : Vérifier signal.aborted avant et pendant
3. **Latence fixe** : Doit être aléatoire pour simuler le réseau
4. **Erreurs non typées** : Toujours throw HttpError, pas Error
5. **Cleanup manquant** : Clear les timeouts si la requête réussit

## 💡 CQFR (Ce Qu'il Faut Retenir)

- **Promise.race** : Pattern pour timeout vs opération async
- **AbortController** : Standard web pour l'annulation
- **Error mapping** : Transformer les erreurs système en erreurs HTTP
- **Generics** : `<T>` pour un typage fort des réponses
- **Simulation réaliste** : Latence variable simule mieux le réseau réel