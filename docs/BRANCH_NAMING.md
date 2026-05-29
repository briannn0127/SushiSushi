# Branch Naming Convention

Use lowercase branch names with hyphens.

## Main Branches

```text
main
develop
```

- `main`: stable playable versions only
- `develop`: integration branch for active development

## Feature Branches

```text
feature/<short-description>
```

Examples:

```text
feature/player-hand-ui
feature/order-list-view
feature/cutting-qte
feature/customer-spawn
```

## Bug Fix Branches

```text
fix/<short-description>
```

Examples:

```text
fix/interaction-range
fix/hud-null-label
fix/main-scene-black-screen
```

## Release Branches

```text
release/<version>
```

Examples:

```text
release/v0.1.0
release/demo-week-01
```

## Hotfix Branches

```text
hotfix/<short-description>
```

Examples:

```text
hotfix/build-start-scene
hotfix/missing-meta-files
```

## Rules

- Branch from `develop` for normal work.
- Branch from `main` only for `hotfix/*`.
- Keep one feature per branch.
- Delete remote feature branches after merge.
