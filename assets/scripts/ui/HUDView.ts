const { ccclass, property } = cc._decorator;

import { HUDUIModel } from "./UIModels";

@ccclass
export default class HUDView extends cc.Component {
    @property(cc.Label)
    public moneyLabel: cc.Label = null;

    @property(cc.Label)
    public timeLabel: cc.Label = null;

    @property(cc.Label)
    public dayLabel: cc.Label = null;

    @property(cc.Label)
    public handItemLabel: cc.Label = null;

    @property(cc.Label)
    public interactableLabel: cc.Label = null;

    @property(cc.Label)
    public gameStateLabel: cc.Label = null;

    private warnedFields: { [fieldName: string]: boolean } = {};

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
    }

    public updateView(model: HUDUIModel): void {
        this.setLabel(this.moneyLabel, "Money: $" + model.money, "HUDView.moneyLabel");
        this.setLabel(this.timeLabel, "Time: " + this.formatTime(model.remainingSeconds), "HUDView.timeLabel");
        this.setLabel(this.dayLabel, "Day: " + model.day, "HUDView.dayLabel");
        this.setLabel(this.handItemLabel, "Hand: " + this.formatHands(model), "HUDView.handItemLabel");
        this.setLabel(this.interactableLabel, "Interact: " + (model.interactableName || "None"), "HUDView.interactableLabel");
        this.setLabel(this.gameStateLabel, "State: " + model.gameState, "HUDView.gameStateLabel");
    }

    private formatHands(model: HUDUIModel): string {
        if (!model.playerHands || model.playerHands.length === 0) {
            return "Empty";
        }

        var parts: string[] = [];
        for (var i = 0; i < model.playerHands.length; i++) {
            var hand = model.playerHands[i];
            parts.push(hand.displayName + ": " + (hand.itemId || "Empty"));
        }
        return parts.join(" | ");
    }

    private formatTime(totalSeconds: number): string {
        var clamped = Math.max(0, Math.floor(totalSeconds));
        var minutes = Math.floor(clamped / 60);
        var seconds = clamped % 60;
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    private setLabel(label: cc.Label, text: string, fieldName: string): void {
        if (!label) {
            this.warnOnce(fieldName + " is not assigned.", fieldName);
            return;
        }

        label.string = text;
    }

    private warnOnce(message: string, key: string): void {
        if (this.warnedFields[key]) {
            return;
        }

        this.warnedFields[key] = true;
        cc.warn(message);
    }
}
