const { ccclass, property } = cc._decorator;

import { GameEvents } from "../data/DataTypes";

@ccclass
export default class PlayerHand extends cc.Component {
    @property
    public playerId: string = "player-1";

    private currentItemId: string = "";

    public holdItem(itemId: string): boolean {
        if (this.hasItem()) {
            cc.log("Player " + this.playerId + " already has item: " + this.currentItemId);
            return false;
        }

        this.currentItemId = itemId;
        cc.systemEvent.emit(GameEvents.PLAYER_HAND_CHANGED, this.playerId, this.currentItemId);
        return true;
    }

    public clearItem(): void {
        this.currentItemId = "";
        cc.systemEvent.emit(GameEvents.PLAYER_HAND_CHANGED, this.playerId, this.currentItemId);
    }

    public hasItem(): boolean {
        return this.currentItemId !== "";
    }

    public getItemId(): string {
        return this.currentItemId;
    }

    public getPlayerId(): string {
        return this.playerId;
    }
}
