# Commit Convention

Use concise commits with a clear type and scope.

```text
type(scope): short description
```

Examples:

```text
feat(ui): add order list view
fix(player): stop movement while paused
docs(git): add branch naming convention
chore(project): update gitignore
refactor(core): split time manager from game manager
```

## Types

- `feat`: new gameplay, UI, system, or content feature
- `fix`: bug fix
- `docs`: documentation only
- `style`: formatting only, no behavior change
- `refactor`: code restructuring without behavior change
- `test`: test or verification support
- `chore`: project setup, config, build, maintenance
- `art`: textures, sprites, animation, audio, visual assets
- `scene`: Cocos scene or prefab changes

## Scopes

Common scopes:

- `core`
- `player`
- `interaction`
- `ui`
- `order`
- `customer`
- `economy`
- `workstation`
- `scene`
- `docs`
- `project`

## Rules

- Keep commits focused.
- Prefer multiple small commits over one unclear large commit.
- Mention scene or prefab changes explicitly when relevant.
- Do not mix unrelated gameplay, UI, and asset changes in one commit unless the feature requires it.
