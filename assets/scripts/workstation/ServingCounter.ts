const { ccclass, property } = cc._decorator;

import PlayerHand from "../player/PlayerHand";
import Workstation from "./Workstation";

@ccclass
export default class ServingCounter extends Workstation {
    onLoad(): void {
        if (this.displayName === "Workstation") {
            this.displayName = "Serving Counter";
        }

        if (this.interactionPrompt === "Press E to interact") {
            this.interactionPrompt = "Press E to serve";
        }
    }

    protected onInteract(playerId: string, playerNode?: cc.Node): void {
        var hand = playerNode ? playerNode.getComponent(PlayerHand) : null;
        if (!hand || !hand.hasItem()) {
            cc.log("Player " + playerId + " has nothing to serve.");
            return;
        }

        cc.log("Player " + playerId + " served item: " + hand.getItemId());
        hand.clearItem();
    }
}
