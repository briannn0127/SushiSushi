const { ccclass, property } = cc._decorator;

import InputManager from "../core/InputManager";
import { Direction, GameEvents, GameState, HandItemType, PlayerData, Vector2Data } from "../data/DataTypes";
import InteractionSystem from "../interaction/InteractionSystem";
import PlayerHand from "./PlayerHand";

@ccclass
export default class PlayerController extends cc.Component {
    @property
    public playerId: string = "player-1";

    @property
    public displayName: string = "Chef";

    @property
    public moveSpeed: number = 180;

    @property(InteractionSystem)
    public interactionSystem: InteractionSystem = null;

    @property(InputManager)
    public inputManager: InputManager = null;

    @property(PlayerHand)
    public playerHand: PlayerHand = null;

    private movement: Vector2Data = { x: 0, y: 0 };
    private facing: Direction = Direction.Down;
    private canMove: boolean = true;

    onLoad(): void {
        if (!this.playerHand) {
            this.playerHand = this.getComponent(PlayerHand);
        }
    }

    onEnable(): void {
        cc.systemEvent.on(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
    }

    onDisable(): void {
        cc.systemEvent.off(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
    }

    update(dt: number): void {
        if (!this.inputManager) {
            return;
        }

        this.movement = this.inputManager.getMovement();

        if (!this.canMove) {
            return;
        }

        this.node.x += this.movement.x * this.moveSpeed * dt;
        this.node.y += this.movement.y * this.moveSpeed * dt;

        if (this.movement.x !== 0 || this.movement.y !== 0) {
            this.updateFacing(this.movement);
            this.emitPlayerDataChanged();
        }

        if (this.inputManager.consumeInteractPressed() && this.interactionSystem) {
            this.interactionSystem.tryInteract(this.node);
        }
    }

    public setMovementEnabled(enabled: boolean): void {
        this.canMove = enabled;
    }

    public getPlayerData(): PlayerData {
        var itemId = this.playerHand ? this.playerHand.getItemId() : "";
        return {
            playerId: this.playerId,
            displayName: this.displayName,
            position: { x: this.node.x, y: this.node.y },
            facing: this.facing,
            handItem: itemId ? { type: HandItemType.Ingredient, ingredient: null } : { type: HandItemType.None },
            isLocal: true,
        };
    }

    private updateFacing(movement: Vector2Data): void {
        if (Math.abs(movement.x) > Math.abs(movement.y)) {
            this.facing = movement.x > 0 ? Direction.Right : Direction.Left;
            return;
        }

        this.facing = movement.y > 0 ? Direction.Up : Direction.Down;
    }

    private onGameStateChanged(state: GameState): void {
        this.canMove = state === GameState.Playing;
    }

    private emitPlayerDataChanged(): void {
        cc.systemEvent.emit(GameEvents.PLAYER_DATA_CHANGED, this.getPlayerData());
    }
}
