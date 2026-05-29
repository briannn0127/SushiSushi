const { ccclass, property } = cc._decorator;

import { EconomyConfig, GameEvents, OrderData, RevenueResult, SushiData, SushiQuality } from "../data/DataTypes";

@ccclass
export default class EconomyManager extends cc.Component {
    @property
    public startingMoney: number = 1000;

    @property
    public bankruptcyThreshold: number = 0;

    private money: number = 0;
    private totalRevenueToday: number = 0;
    private totalCostToday: number = 0;

    onLoad(): void {
        this.money = this.startingMoney;
    }

    public configure(config: EconomyConfig): void {
        this.startingMoney = config.startingMoney;
        this.bankruptcyThreshold = config.bankruptcyThreshold;
        this.money = config.startingMoney;
        this.totalCostToday = config.dailyCosts.rent + config.dailyCosts.utilities + config.dailyCosts.ingredientBudget + config.dailyCosts.staff;
        cc.systemEvent.emit(GameEvents.MONEY_CHANGED, this.money);
    }

    public addRevenue(order: OrderData, sushi: SushiData, satisfaction: number): RevenueResult {
        var qualityMultiplier = this.getQualityMultiplier(sushi ? sushi.quality : SushiQuality.Normal);
        var basePrice = 100;
        var result: RevenueResult = {
            basePrice: basePrice,
            satisfactionMultiplier: cc.misc.clampf(satisfaction, 0, 1.5),
            qualityMultiplier: qualityMultiplier,
            finalAmount: Math.round(basePrice * satisfaction * qualityMultiplier),
        };

        this.money += result.finalAmount;
        this.totalRevenueToday += result.finalAmount;
        cc.systemEvent.emit(GameEvents.MONEY_CHANGED, this.money);
        return result;
    }

    public applyDailyCosts(): void {
        this.money -= this.totalCostToday;
        cc.systemEvent.emit(GameEvents.MONEY_CHANGED, this.money);
    }

    public isBankrupt(): boolean {
        return this.money <= this.bankruptcyThreshold;
    }

    public getMoney(): number {
        return this.money;
    }

    public getTodayRevenue(): number {
        return this.totalRevenueToday;
    }

    public getTodayCost(): number {
        return this.totalCostToday;
    }

    private getQualityMultiplier(quality: SushiQuality): number {
        switch (quality) {
            case SushiQuality.Poor:
                return 0.6;
            case SushiQuality.Good:
                return 1.25;
            case SushiQuality.Excellent:
                return 1.6;
            default:
                return 1;
        }
    }
}
