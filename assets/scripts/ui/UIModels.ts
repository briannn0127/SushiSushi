const { ccclass, property } = cc._decorator;

import { GameState } from "../data/DataTypes";

export interface PlayerHandUIModel {
    playerId: string;
    displayName: string;
    itemId: string;
}

export interface HUDUIModel {
    money: number;
    remainingSeconds: number;
    day: number;
    tier: number;
    gameState: GameState;
    playerHands: PlayerHandUIModel[];
    interactableName: string;
}

export interface OrderItemUIModel {
    orderId: string;
    customerName: string;
    sushiName: string;
    remainingWaitSeconds: number;
    maxWaitSeconds: number;
    satisfaction01: number;
    difficultyText: string;
    qualityRequirementText: string;
    warning: boolean;
}

export interface DayResultUIModel {
    revenue: number;
    fixedCost: number;
    netProfit: number;
    completedOrders: number;
    failedOrders: number;
    averageSatisfaction01: number;
    bankrupt: boolean;
}

@ccclass
export class UIModels extends cc.Component {
    // Marker component for Cocos Creator script discovery. UI data uses exported interfaces above.
}
