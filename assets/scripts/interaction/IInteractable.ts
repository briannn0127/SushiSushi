const { ccclass, property } = cc._decorator;

export interface IInteractable {
    getDisplayName(): string;
    getInteractionPrompt(): string;
    canInteract(playerId: string, playerNode?: cc.Node): boolean;
    interact(playerId: string, playerNode?: cc.Node): void;
}

@ccclass
export class IInteractableMarker extends cc.Component {
    // Optional marker for editor search. Real interactables implement IInteractable.
}
