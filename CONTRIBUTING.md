# Contributing Guide

This repository uses Cocos Creator 2.4.8 and TypeScript. Keep all code compatible with Cocos Creator 2.x APIs.

## Branch Flow

Use this flow for normal development:

1. Update local branches.
2. Create a feature branch from `develop`.
3. Implement the feature in a focused scope.
4. Test in Cocos Creator before opening a pull request.
5. Open a pull request into `develop`.
6. Merge `develop` into `main` only for stable playable versions.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/player-interaction
```

## Protected Branch Rules

- Do not commit directly to `main`.
- Do not commit directly to `develop` unless the team agrees.
- Use pull requests for review.
- Avoid force pushing shared branches.
- Never delete or regenerate Cocos `.meta` files casually.

## Pull Request Checklist

- The project opens in Cocos Creator 2.4.8.
- The target scene can run without a black screen.
- No Cocos 3.x API is used.
- New scripts use `const { ccclass, property } = cc._decorator;`.
- Relevant `.meta` files are committed.
- `library/`, `local/`, `temp/`, and build output are not committed.
- The PR title follows the commit style when possible.

## Scene And Asset Rules

- Commit `.fire`, `.prefab`, asset files, and their `.meta` files together.
- Do not rename or move assets outside Cocos Editor unless necessary.
- If a scene is changed, mention the scene name in the PR.
- For complex UI or gameplay changes, include basic test steps in the PR.

## Code Rules

- Keep `GameManager` focused on high-level state flow.
- Put UI display logic in UI view classes.
- Keep gameplay data serializable where possible for future multiplayer.
- Avoid direct player singletons. Use `playerId`, `PlayerData`, and manager references.
- Prefer small components with clear ownership.

## Commit Style

See [Commit Convention](docs/COMMIT_CONVENTION.md).

## Branch Names

See [Branch Naming Convention](docs/BRANCH_NAMING.md).
