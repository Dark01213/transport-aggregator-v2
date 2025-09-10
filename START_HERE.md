# 🚀 Transport Aggregator - Quick Start

## Installation complète

```bash
# 1. Installer les dépendances
npm install

# 2. Générer les 24 branches de missions
node .game/make-branches.mjs

# 3. Commencer la première mission
git checkout stage-01-domain-types

# 4. Lancer les tests (ils sont rouges par défaut)
npm test

# 5. Implémenter le code dans src/domain/types.ts

# 6. Relancer les tests jusqu'à ce qu'ils passent
npm test

# 7. Débloquer la mission suivante
npm run next
```

## Commandes essentielles

| Commande | Action |
|----------|--------|
| `npm test` | Valider la mission actuelle |
| `npm run next` | Passer à la mission suivante |
| `npm run hint` | Obtenir un indice (3 max) |
| `npm run reset:here` | Annuler les modifications locales |
| `npm run coverage` | Voir la couverture de code |

## Structure des missions

1. **Chaque branche = 1 mission** avec tests KO par défaut
2. **Fichiers à modifier** : Cherchez les `TODO STAGE XX`
3. **Tests** : Dans `/tests/stage-XX.*.test.ts`
4. **Mission briefing** : `README.mission.md` dans chaque branche
5. **Indices progressifs** : 3 par mission via `npm run hint`

## Workflow type

```bash
# Sur une nouvelle mission
git branch --show-current    # Voir la mission actuelle
npm test                      # Voir ce qui doit être fait
npm run hint                  # Si bloqué
# ... coder ...
npm test                      # Valider
npm run next                  # Mission suivante !
```

## Mode équipe

- **2-3 personnes** : Mob programming sur missions 1-6
- **Pair programming** : Missions 7-18 en binômes
- **Solo + review** : Missions 19-24 avec code review

## Arcs de progression

1. **Foundations (1-5)** : Types, guards, HTTP wrapper
2. **Search & Utils (6-8)** : Normalisation, filtrage, formatage
3. **Delays & Merge (9-12)** : Fusion de données, tri, groupement
4. **Async Orchestration (13-16)** : Parallel, retry, cancellation
5. **Quality & Performance (17-20)** : Cache, config, orchestration
6. **Tests & Hardening (21-24)** : Mocks, coverage, reporting

## Troubleshooting

```bash
# Perdu dans les branches ?
git branch -a                 # Voir toutes les branches
git checkout stage-01-domain-types  # Retour au début

# Tests cassés après modification ?
npm run reset:here            # Annuler les changements locaux

# Voir la branche actuelle ?
git branch --show-current
```

## Tips

- 📖 Lisez toujours `README.mission.md` en premier
- 🧪 Les tests sont votre spécification
- 💡 Les indices sont progressifs (du plus vague au plus précis)
- 🎯 Focus sur faire passer les tests, pas sur la perfection
- 🔄 Commitez à chaque mission réussie

**Bon courage et amusez-vous bien !** 🎮