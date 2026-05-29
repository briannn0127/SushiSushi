const { ccclass, property } = cc._decorator;

import { IInteractable } from "./IInteractable";

@ccclass
export default class InteractionSystem extends cc.Component {
    @property
    public interactionRadius: number = 80;

    @property(cc.Node)
    public interactableRoot: cc.Node = null;

    private currentTarget: cc.Component = null;

    update(): void {
        // TODO: Connect prompt UI when HUD is ready.
    }

    public tryInteract(playerNode: cc.Node): boolean {
        var target = this.findNearestInteractable(playerNode);
        if (!target) {
            return false;
        }

        var playerId = this.getPlayerId(playerNode);
        var interactable = target as any as IInteractable;
        if (!interactable.canInteract(playerId, playerNode)) {
            return false;
        }

        interactable.interact(playerId, playerNode);
        return true;
    }

    public getCurrentPrompt(playerNode: cc.Node): string {
        var target = this.findNearestInteractable(playerNode);
        if (!target) {
            return "";
        }

        return (target as any as IInteractable).getInteractionPrompt();
    }

    public getCurrentInteractableName(playerNode: cc.Node): string {
        var target = this.findNearestInteractable(playerNode);
        if (!target) {
            return "";
        }

        return (target as any as IInteractable).getDisplayName();
    }

    private findNearestInteractable(playerNode: cc.Node): cc.Component {
        var root = this.interactableRoot || this.node;
        var components = root.getComponentsInChildren(cc.Component);
        var nearest: cc.Component = null;
        var nearestDistance = Number.MAX_VALUE;

        for (var i = 0; i < components.length; i++) {
            var component = components[i] as any;
            if (!component.getDisplayName || !component.getInteractionPrompt || !component.canInteract || !component.interact) {
                continue;
            }

            var dx = playerNode.x - components[i].node.x;
            var dy = playerNode.y - components[i].node.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= this.interactionRadius && distance < nearestDistance) {
                nearest = components[i];
                nearestDistance = distance;
            }
        }

        this.currentTarget = nearest;
        return this.currentTarget;
    }

    private getPlayerId(playerNode: cc.Node): string {
        var controller = playerNode.getComponent("PlayerController") as any;
        return controller && controller.playerId ? controller.playerId : playerNode.name;
    }
}
