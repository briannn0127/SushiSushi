# SushiSushi

2D / 2.5D sushi restaurant co-op management game prototype built with **Cocos Creator 2.4.8** and **TypeScript**.

The project is currently focused on building a clean, expandable gameplay and UI architecture before full production content is added.

## Version

- Engine: Cocos Creator 2.4.8
- Language: TypeScript
- Architecture: `cc.Component`
- Target: Single-player prototype first, future 2-4 player online co-op

## Current Features

- Player movement with WASD
- Player hand item system
- Ingredient boxes, such as rice and fish
- Workstation interaction skeleton
- Interaction prompt UI
- HUD for game state, money, time, day, hand item, and interactable name
- Pause state support
- Scene bootstrap helper for creating a playable test scene

## Project Structure

See [Project Structure](docs/PROJECT_STRUCTURE.md).

## Team Git Flow

This project uses a lightweight Git Flow for a 3-5 person game team:

- `main`: stable playable builds only
- `develop`: integration branch for tested features
- `feature/*`: individual feature work
- `fix/*`: bug fixes
- `release/*`: release stabilization
- `hotfix/*`: urgent fixes based on `main`

Start new work from `develop`, then open a pull request back into `develop`.
Only merge `develop` into `main` when the build is stable and playable.

Read:

- [Contributing Guide](CONTRIBUTING.md)
- [Branch Naming Convention](docs/BRANCH_NAMING.md)
- [Commit Convention](docs/COMMIT_CONVENTION.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)

## Main Scene Setup

Create the first scene manually in Cocos Creator:

1. Open the project with Cocos Creator 2.4.8.
2. Create a new scene.
3. Add an empty node named `SceneBootstrap`.
4. Attach `MainSceneInitializer` to `SceneBootstrap`.
5. Save the scene as:

```text
assets/scenes/MainScene.fire
```

6. Add `MainScene.fire` to Build Settings and set it as the first/start scene.

When the scene starts, `MainSceneInitializer` creates a playable prototype layout with:

- Canvas
- Main Camera
- GameRoot
- Managers
- Player
- UIRoot
- RiceBox
- FishBox
- CuttingStation
- AssemblyStation

## Basic Test

After pressing Play:

- The screen should not be black.
- A blue player square should be visible.
- HUD labels should be visible.
- `W/A/S/D` moves the player.
- Move near `RiceBox`.
- Press `E` to take `rice`.
- HUD should update the hand item.

## Notes

- Do not use Cocos Creator 3.x APIs in this project.
- Keep game logic separated from UI rendering.
- Avoid direct player singletons; use `PlayerData`, `PlayerManager`, and event-driven flows for future multiplayer support.
- Do not commit `library/`, `local/`, `temp/`, or build output.
