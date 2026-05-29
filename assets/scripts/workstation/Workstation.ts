const { ccclass, property } = cc._decorator;

import { IInteractable } from "../interaction/IInteractable";

export enum WorkstationType {
    Generic = "Generic",
    Cutting = "Cutting",
    Assembly = "Assembly",
    Cooking = "Cooking",
    Serving = "Serving",
}

@ccclass
export default class Workstation extends cc.Component implements IInteractable {
    @property
    public workstationId: string = "workstation";

    @property
    public displayName: string = "Workstation";

    @property
    public interactionPrompt: string = "Press E to interact";

    @property
    public isBusy: boolean = false;

    public workstationType: WorkstationType = WorkstationType.Generic;

    public getDisplayName(): string {
        return this.displayName;
    }

    public getInteractionPrompt(): string {
        return this.interactionPrompt;
    }

    public canInteract(playerId: string, playerNode?: cc.Node): boolean {
        return !this.isBusy;
    }

    public interact(playerId: string, playerNode?: cc.Node): void {
        if (!this.canInteract(playerId, playerNode)) {
            return;
        }

        this.onInteract(playerId, playerNode);
    }

    protected onInteract(playerId: string, playerNode?: cc.Node): void {
        // TODO: Subclasses trigger station-specific workflows, QTE, or inventory exchange here.
        cc.log("Player " + playerId + " interacted with workstation: " + this.displayName);
    }

    protected setBusy(busy: boolean): void {
        this.isBusy = busy;
    }
}
