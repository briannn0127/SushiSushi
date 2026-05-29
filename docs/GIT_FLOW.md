# Git Flow

This project uses a simple Git Flow suitable for a 3-5 person Cocos game team.

## Branch Roles

```text
main      stable playable builds
develop   integration branch
feature/* feature work
fix/*     bug fixes
release/* release stabilization
hotfix/*  urgent production fixes
```

## Normal Feature Flow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/order-ui

# work, test, commit

git push -u origin feature/order-ui
```

Open a pull request:

```text
feature/order-ui -> develop
```

## Release Flow

When `develop` is stable:

```bash
git checkout develop
git pull origin develop
git checkout -b release/v0.1.0
```

After QA:

```text
release/v0.1.0 -> main
release/v0.1.0 -> develop
```

Tag the release after merging to `main`:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Hotfix Flow

```bash
git checkout main
git pull origin main
git checkout -b hotfix/main-scene-start
```

After the fix:

```text
hotfix/main-scene-start -> main
hotfix/main-scene-start -> develop
```

## Conflict Rules

- Resolve Cocos `.meta` conflicts carefully.
- Ask the owner before replacing scene or prefab changes.
- Do not force push shared branches.
- If a scene conflict is hard to resolve, coordinate in Editor and recommit the resolved scene.
