const { ccclass, property } = cc._decorator;

import { IInteractable } from "./IInteractable";
import PlayerHand from "../player/PlayerHand";

@ccclass
export default class IngredientBox extends cc.Component implements IInteractable {
    @property
    public itemId: string = "rice";

    @property
    public displayName: string = "Rice Box";

    public getDisplayName(): string {
        return this.displayName;
    }

    public getInteractionPrompt(): string {
        return "Press E to take " + this.getReadableItemName();
    }

    public canInteract(playerId: string, playerNode?: cc.Node): boolean {
        var hand = this.getPlayerHand(playerNode);
        return !!hand && !hand.hasItem();
    }

    public interact(playerId: string, playerNode?: cc.Node): void {
        var hand = this.getPlayerHand(playerNode);
        if (!hand) {
            cc.warn("PlayerHand not found on player: " + playerId);
            return;
        }

        if (!hand.holdItem(this.itemId)) {
            cc.log("Player " + playerId + " cannot take " + this.itemId + " because hand is occupied.");
            return;
        }

        cc.log("Player " + playerId + " took ingredient: " + this.itemId);
    }

    private getPlayerHand(playerNode?: cc.Node): PlayerHand {
        if (!playerNode) {
            return null;
        }

        return playerNode.getComponent(PlayerHand);
    }

    private getReadableItemName(): string {
        if (this.displayName) {
            return this.displayName.replace(" Box", "");
        }

        if (!this.itemId) {
            return "";
        }

        return this.itemId.charAt(0).toUpperCase() + this.itemId.substr(1);
    }
}
