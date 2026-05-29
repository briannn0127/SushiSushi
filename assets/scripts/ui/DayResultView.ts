const { ccclass, property } = cc._decorator;

import { DayResultUIModel } from "./UIModels";

export class DayResultEvents {
    public static readonly NEXT_DAY_CLICKED: string = "ui-next-day-clicked";
}

@ccclass
export default class DayResultView extends cc.Component {
    @property(cc.Label)
    public revenueLabel: cc.Label = null;

    @property(cc.Label)
    public fixedCostLabel: cc.Label = null;

    @property(cc.Label)
    public netProfitLabel: cc.Label = null;

    @property(cc.Label)
    public completedOrdersLabel: cc.Label = null;

    @property(cc.Label)
    public failedOrdersLabel: cc.Label = null;

    @property(cc.Label)
    public averageSatisfactionLabel: cc.Label = null;

    @property(cc.Label)
    public bankruptLabel: cc.Label = null;

    @property(cc.Button)
    public nextDayButton: cc.Button = null;

    private warnedFields: { [fieldName: string]: boolean } = {};

    onLoad(): void {
        if (this.nextDayButton) {
            this.nextDayButton.node.on("click", this.onNextDayClicked, this);
        }
        this.hide();
    }

    onDestroy(): void {
        if (this.nextDayButton) {
            this.nextDayButton.node.off("click", this.onNextDayClicked, this);
        }
    }

    public show(model: DayResultUIModel): void {
        this.node.active = true;
        this.updateView(model);
        // TODO: Add fade in / result count-up animation.
    }

    public hide(): void {
        this.node.active = false;
    }

    public updateView(model: DayResultUIModel): void {
        this.setLabel(this.revenueLabel, "Revenue: $" + model.revenue, "DayResultView.revenueLabel");
        this.setLabel(this.fixedCostLabel, "Fixed Cost: $" + model.fixedCost, "DayResultView.fixedCostLabel");
        this.setLabel(this.netProfitLabel, "Net Profit: $" + model.netProfit, "DayResultView.netProfitLabel");
        this.setLabel(this.completedOrdersLabel, "Completed Orders: " + model.completedOrders, "DayResultView.completedOrdersLabel");
        this.setLabel(this.failedOrdersLabel, "Failed Orders: " + model.failedOrders, "DayResultView.failedOrdersLabel");
        this.setLabel(this.averageSatisfactionLabel, "Avg Satisfaction: " + Math.round(model.averageSatisfaction01 * 100) + "%", "DayResultView.averageSatisfactionLabel");
        this.setLabel(this.bankruptLabel, model.bankrupt ? "Bankrupt: Yes" : "Bankrupt: No", "DayResultView.bankruptLabel");
    }

    public onNextDayClicked(): void {
        cc.log("DayResult Next Day clicked.");
        cc.systemEvent.emit(DayResultEvents.NEXT_DAY_CLICKED);
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
