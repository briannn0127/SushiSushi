const { ccclass, property } = cc._decorator;

import GameManager from "../core/GameManager";
import TimeManager from "../core/TimeManager";
import { GameEvents, GameState, OrderData, SushiData } from "../data/DataTypes";
import EconomyManager from "../economy/EconomyManager";
import InteractionSystem from "../interaction/InteractionSystem";
import OrderManager from "../order/OrderManager";
import PlayerController from "../player/PlayerController";
import PlayerHand from "../player/PlayerHand";
import DayResultView, { DayResultEvents } from "./DayResultView";
import HUDView from "./HUDView";
import InteractionPromptView from "./InteractionPromptView";
import OrderListView from "./OrderListView";
import PauseMenuView, { PauseMenuEvents } from "./PauseMenuView";
import { DayResultUIModel, HUDUIModel, OrderItemUIModel, PlayerHandUIModel } from "./UIModels";

@ccclass
export default class UIManager extends cc.Component {
    @property(HUDView)
    public hudView: HUDView = null;

    @property(OrderListView)
    public orderListView: OrderListView = null;

    @property(InteractionPromptView)
    public interactionPromptView: InteractionPromptView = null;

    @property(PauseMenuView)
    public pauseMenuView: PauseMenuView = null;

    @property(DayResultView)
    public dayResultView: DayResultView = null;

    @property(GameManager)
    public gameManager: GameManager = null;

    @property(TimeManager)
    public timeManager: TimeManager = null;

    @property(OrderManager)
    public orderManager: OrderManager = null;

    @property(EconomyManager)
    public economyManager: EconomyManager = null;

    @property(InteractionSystem)
    public interactionSystem: InteractionSystem = null;

    @property([PlayerController])
    public observedPlayers: PlayerController[] = [];

    @property([PlayerHand])
    public observedPlayerHands: PlayerHand[] = [];

    @property
    public orderWarningSeconds: number = 8;

    private currentMoney: number = 0;
    private currentRemainingSeconds: number = 0;
    private completedOrders: number = 0;
    private failedOrders: number = 0;
    private totalSatisfaction: number = 0;
    private satisfactionSamples: number = 0;
    private warnedFields: { [fieldName: string]: boolean } = {};

    onEnable(): void {
        cc.systemEvent.on(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
        cc.systemEvent.on(GameEvents.DAY_TIME_CHANGED, this.onDayTimeChanged, this);
        cc.systemEvent.on(GameEvents.MONEY_CHANGED, this.onMoneyChanged, this);
        cc.systemEvent.on(GameEvents.ORDER_CREATED, this.onOrderChanged, this);
        cc.systemEvent.on(GameEvents.ORDER_COMPLETED, this.onOrderCompleted, this);
        cc.systemEvent.on(GameEvents.DAY_ENDED, this.onDayEnded, this);
        cc.systemEvent.on(PauseMenuEvents.RESUME_CLICKED, this.onResumeClicked, this);
        cc.systemEvent.on(PauseMenuEvents.RESTART_DAY_CLICKED, this.onRestartDayClicked, this);
        cc.systemEvent.on(PauseMenuEvents.MAIN_MENU_CLICKED, this.onMainMenuClicked, this);
        cc.systemEvent.on(PauseMenuEvents.SETTINGS_CLICKED, this.onSettingsClicked, this);
        cc.systemEvent.on(DayResultEvents.NEXT_DAY_CLICKED, this.onNextDayClicked, this);
    }

    onDisable(): void {
        cc.systemEvent.off(GameEvents.GAME_STATE_CHANGED, this.onGameStateChanged, this);
        cc.systemEvent.off(GameEvents.DAY_TIME_CHANGED, this.onDayTimeChanged, this);
        cc.systemEvent.off(GameEvents.MONEY_CHANGED, this.onMoneyChanged, this);
        cc.systemEvent.off(GameEvents.ORDER_CREATED, this.onOrderChanged, this);
        cc.systemEvent.off(GameEvents.ORDER_COMPLETED, this.onOrderCompleted, this);
        cc.systemEvent.off(GameEvents.DAY_ENDED, this.onDayEnded, this);
        cc.systemEvent.off(PauseMenuEvents.RESUME_CLICKED, this.onResumeClicked, this);
        cc.systemEvent.off(PauseMenuEvents.RESTART_DAY_CLICKED, this.onRestartDayClicked, this);
        cc.systemEvent.off(PauseMenuEvents.MAIN_MENU_CLICKED, this.onMainMenuClicked, this);
        cc.systemEvent.off(PauseMenuEvents.SETTINGS_CLICKED, this.onSettingsClicked, this);
        cc.systemEvent.off(DayResultEvents.NEXT_DAY_CLICKED, this.onNextDayClicked, this);
    }

    start(): void {
        this.showHUD();
        this.hidePauseMenu();
        if (this.dayResultView) {
            this.dayResultView.hide();
        }
    }

    update(): void {
        this.updateHUD();
        this.updateOrders();
        this.updateInteractionPrompt();
    }

    public showHUD(): void {
        if (!this.hudView) {
            this.warnMissing("UIManager.hudView");
            return;
        }

        this.hudView.show();
    }

    public showPauseMenu(): void {
        if (!this.pauseMenuView) {
            this.warnMissing("UIManager.pauseMenuView");
            return;
        }

        this.pauseMenuView.show();
    }

    public hidePauseMenu(): void {
        if (!this.pauseMenuView) {
            this.warnMissing("UIManager.pauseMenuView");
            return;
        }

        this.pauseMenuView.hide();
    }

    public showDayResult(model?: DayResultUIModel): void {
        if (!this.dayResultView) {
            this.warnMissing("UIManager.dayResultView");
            return;
        }

        this.dayResultView.show(model || this.createDayResultModel());
    }

    public updateHUD(): void {
        if (!this.hudView) {
            return;
        }

        this.hudView.updateView(this.createHUDModel());
    }

    public updateOrders(): void {
        if (!this.orderListView) {
            return;
        }

        this.orderListView.updateOrders(this.createOrderModels());
    }

    public showInteractionPrompt(prompt: string): void {
        if (!this.interactionPromptView) {
            this.warnMissing("UIManager.interactionPromptView");
            return;
        }

        this.interactionPromptView.showPrompt(prompt);
    }

    public hideInteractionPrompt(): void {
        if (!this.interactionPromptView) {
            return;
        }

        this.interactionPromptView.hide();
    }

    private updateInteractionPrompt(): void {
        var prompt = this.getCurrentInteractionPrompt();
        if (prompt) {
            this.showInteractionPrompt(prompt);
        } else {
            this.hideInteractionPrompt();
        }
    }

    private createHUDModel(): HUDUIModel {
        return {
            money: this.economyManager ? this.economyManager.getMoney() : this.currentMoney,
            remainingSeconds: this.timeManager ? this.timeManager.getRemainingSeconds() : this.currentRemainingSeconds,
            day: this.gameManager ? this.gameManager.getDay() : 1,
            gameState: this.gameManager ? this.gameManager.getState() : GameState.Ready,
            playerHands: this.createPlayerHandModels(),
            interactableName: this.getCurrentInteractableName(),
        };
    }

    private createPlayerHandModels(): PlayerHandUIModel[] {
        var models: PlayerHandUIModel[] = [];
        for (var i = 0; i < this.observedPlayerHands.length; i++) {
            var hand = this.observedPlayerHands[i];
            if (!hand) {
                continue;
            }

            var playerId = hand.getPlayerId();
            models.push({
                playerId: playerId,
                displayName: playerId,
                itemId: hand.hasItem() ? hand.getItemId() : "",
            });
        }
        return models;
    }

    private createOrderModels(): OrderItemUIModel[] {
        if (!this.orderManager) {
            return [];
        }

        var orders = this.orderManager.getActiveOrders();
        var models: OrderItemUIModel[] = [];
        var now = cc.director.getTotalTime() / 1000;

        for (var i = 0; i < orders.length; i++) {
            var order = orders[i];
            var elapsed = now - order.createdAt;
            var remaining = Math.max(0, order.maxWaitSeconds - elapsed);
            var satisfaction = order.maxWaitSeconds > 0 ? remaining / order.maxWaitSeconds : 0;
            var recipe = this.orderManager.getRecipe(order.recipeId);

            models.push({
                orderId: order.id,
                customerName: order.customerId || "Customer",
                sushiName: recipe ? recipe.displayName : order.recipeId,
                remainingWaitSeconds: remaining,
                maxWaitSeconds: order.maxWaitSeconds,
                satisfaction01: satisfaction,
                difficultyText: this.getDifficultyText(order.maxWaitSeconds),
                qualityRequirementText: "Normal",
                warning: remaining <= this.orderWarningSeconds,
            });
        }

        return models;
    }

    private createDayResultModel(): DayResultUIModel {
        var revenue = this.economyManager ? this.economyManager.getTodayRevenue() : 0;
        var fixedCost = this.economyManager ? this.economyManager.getTodayCost() : 0;
        var activeOrderCount = this.orderManager ? this.orderManager.getActiveOrders().length : 0;
        var failed = this.failedOrders + activeOrderCount;
        var avg = this.satisfactionSamples > 0 ? this.totalSatisfaction / this.satisfactionSamples : 0;

        return {
            revenue: revenue,
            fixedCost: fixedCost,
            netProfit: revenue - fixedCost,
            completedOrders: this.completedOrders,
            failedOrders: failed,
            averageSatisfaction01: avg,
            bankrupt: this.economyManager ? this.economyManager.isBankrupt() : false,
        };
    }

    private getCurrentInteractableName(): string {
        if (!this.interactionSystem || this.observedPlayers.length === 0 || !this.observedPlayers[0]) {
            return "";
        }

        return this.interactionSystem.getCurrentInteractableName(this.observedPlayers[0].node);
    }

    private getCurrentInteractionPrompt(): string {
        if (!this.interactionSystem || this.observedPlayers.length === 0 || !this.observedPlayers[0]) {
            return "";
        }

        return this.interactionSystem.getCurrentPrompt(this.observedPlayers[0].node);
    }

    private getDifficultyText(maxWaitSeconds: number): string {
        if (maxWaitSeconds <= 25) {
            return "Hard";
        }

        if (maxWaitSeconds <= 45) {
            return "Normal";
        }

        return "Easy";
    }

    private onGameStateChanged(state: GameState): void {
        if (state === GameState.Paused) {
            this.showPauseMenu();
        } else {
            this.hidePauseMenu();
        }

        if (state === GameState.DayEnd || state === GameState.GameOver) {
            this.showDayResult();
        }
    }

    private onDayTimeChanged(remainingSeconds: number): void {
        this.currentRemainingSeconds = remainingSeconds;
    }

    private onMoneyChanged(money: number): void {
        this.currentMoney = money;
    }

    private onOrderChanged(order: OrderData): void {
        this.updateOrders();
    }

    private onOrderCompleted(order: OrderData, sushi: SushiData): void {
        this.completedOrders++;
        var now = cc.director.getTotalTime() / 1000;
        var remaining = Math.max(0, order.maxWaitSeconds - (now - order.createdAt));
        var satisfaction = order.maxWaitSeconds > 0 ? remaining / order.maxWaitSeconds : 0;
        this.totalSatisfaction += Math.max(0, Math.min(1, satisfaction));
        this.satisfactionSamples++;
        this.updateOrders();
    }

    private onDayEnded(day: number): void {
        this.showDayResult();
    }

    private onResumeClicked(): void {
        if (this.gameManager) {
            this.gameManager.resumeGame();
        }
    }

    private onRestartDayClicked(): void {
        cc.log("Restart Day requested. TODO: reload current day scene or reset day state.");
    }

    private onMainMenuClicked(): void {
        cc.log("Main Menu requested. TODO: load main menu scene.");
    }

    private onSettingsClicked(): void {
        cc.log("Settings requested. TODO: show settings panel.");
    }

    private onNextDayClicked(): void {
        cc.log("Next Day requested. TODO: advance to next day.");
    }

    private warnMissing(fieldName: string): void {
        if (this.warnedFields[fieldName]) {
            return;
        }

        this.warnedFields[fieldName] = true;
        cc.warn(fieldName + " is not assigned.");
    }
}
