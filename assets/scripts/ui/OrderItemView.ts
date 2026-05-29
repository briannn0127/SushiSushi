const { ccclass, property } = cc._decorator;

import { OrderItemUIModel } from "./UIModels";

@ccclass
export default class OrderItemView extends cc.Component {
    @property(cc.Label)
    public customerNameLabel: cc.Label = null;

    @property(cc.Label)
    public sushiNameLabel: cc.Label = null;

    @property(cc.Label)
    public remainingTimeLabel: cc.Label = null;

    @property(cc.Label)
    public difficultyLabel: cc.Label = null;

    @property(cc.Label)
    public qualityRequirementLabel: cc.Label = null;

    @property(cc.ProgressBar)
    public satisfactionBar: cc.ProgressBar = null;

    @property(cc.Node)
    public warningNode: cc.Node = null;

    @property(cc.Color)
    public normalColor: cc.Color = cc.Color.WHITE;

    @property(cc.Color)
    public warningColor: cc.Color = cc.Color.RED;

    private orderId: string = "";
    private warnedFields: { [fieldName: string]: boolean } = {};

    public bind(model: OrderItemUIModel): void {
        this.orderId = model.orderId;
        this.updateView(model);
    }

    public updateView(model: OrderItemUIModel): void {
        this.setLabel(this.customerNameLabel, model.customerName, "OrderItemView.customerNameLabel");
        this.setLabel(this.sushiNameLabel, model.sushiName, "OrderItemView.sushiNameLabel");
        this.setLabel(this.remainingTimeLabel, Math.ceil(model.remainingWaitSeconds) + "s", "OrderItemView.remainingTimeLabel");
        this.setLabel(this.difficultyLabel, model.difficultyText, "OrderItemView.difficultyLabel");
        this.setLabel(this.qualityRequirementLabel, model.qualityRequirementText, "OrderItemView.qualityRequirementLabel");

        if (this.satisfactionBar) {
            this.satisfactionBar.progress = Math.max(0, Math.min(1, model.satisfaction01));
        } else {
            this.warnOnce("OrderItemView.satisfactionBar is not assigned.", "OrderItemView.satisfactionBar");
        }

        if (this.warningNode) {
            this.warningNode.active = model.warning;
        }

        this.node.color = model.warning ? this.warningColor : this.normalColor;
        // TODO: Add warning blink animation when model.warning is true.
    }

    public getOrderId(): string {
        return this.orderId;
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
