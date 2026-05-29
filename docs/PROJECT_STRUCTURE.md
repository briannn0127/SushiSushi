# Project Structure

This project is organized for a commercial-grade Cocos Creator 2.4.8 TypeScript game.

```text
assets/
  scripts/
    core/          Game state, input, scene bootstrap, time flow
    player/        Player movement, player hand, player data management
    interaction/   Interactable interfaces and interaction objects
    customer/      Customer spawning and customer logic
    order/         Order lifecycle and recipe lookup
    sushi/         Sushi and ingredient domain logic
    workstation/   Cutting, assembly, cooking, serving stations
    qte/           QTE and minigame systems
    economy/       Money, revenue, daily cost, bankruptcy logic
    ui/            UIManager and panel/view scripts
    camera/        Camera follow and scene camera behavior
    data/          Serializable data models and shared enums
    utils/         Small reusable helpers
    network/       Future multiplayer skeleton
  scenes/          Cocos scene files
  prefabs/         Reusable nodes and UI prefabs
  textures/        Sprites and texture assets
  audio/           Music and sound effects
  animations/      Animation clips
  resources/       Runtime-loaded resources
```

## Cocos Files To Commit

Commit these:

- `assets/**`
- `settings/**`
- `project.json`
- `package.json`
- `tsconfig.json`
- `jsconfig.json`
- `creator.d.ts`
- `.meta` files next to committed assets

Do not commit these:

- `library/`
- `local/`
- `temp/`
- `build/`
- `preview-template/`
- `node_modules/`

## Ownership Guidelines

- `core/`: application state and orchestration only
- `ui/`: labels, panels, buttons, prompts, order UI
- `player/`: player movement and player-owned data
- `interaction/`: detection and interactable contracts
- `workstation/`: cooking/cutting/assembly/serving station behavior
- `data/`: shared interfaces and enums, no scene-specific logic
- `network/`: future networking boundary, no direct gameplay rendering
