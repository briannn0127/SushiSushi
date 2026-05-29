const { ccclass, property } = cc._decorator;

import { GameEvent, ProcessingState, QTEResult, StationType, Vector2Data } from "./DataTypes";

export interface BaseEventPayload {
    eventId: string;
    type: GameEvent;
    sourcePlayerId?: string;
    timestamp: number;
}

export interface PlayerMovePayload extends BaseEventPayload {
    playerId: string;
    position: Vector2Data;
    velocity: Vector2Data;
}

export interface PlayerInteractPayload extends BaseEventPayload {
    playerId: string;
    targetId: string;
    stationType?: StationType;
}

export interface PlayerHandChangedPayload extends BaseEventPayload {
    playerId: string;
    itemId: string;
    itemType: string;
}

export interface IngredientProcessedPayload extends BaseEventPayload {
    playerId: string;
    stationId: string;
    inputItemIds: string[];
    outputItemIds: string[];
    processingState: ProcessingState;
}

export interface QTECompletedPayload extends BaseEventPayload {
    playerId: string;
    stationId: string;
    qteId: string;
    result: QTEResult;
    score01: number;
}

export interface OrderCreatedPayload extends BaseEventPayload {
    orderId: string;
    customerId: string;
    recipeId: string;
    maxWaitSeconds: number;
}

export interface OrderServedPayload extends BaseEventPayload {
    playerId: string;
    orderId: string;
    servedItemId: string;
}

export interface OrderResolvedPayload extends BaseEventPayload {
    orderId: string;
    correct: boolean;
    satisfaction01: number;
    revenue: number;
    reason?: string;
}

export interface CustomerStateChangedPayload extends BaseEventPayload {
    customerId: string;
    fromState: string;
    toState: string;
}

export interface EconomyChangedPayload extends BaseEventPayload {
    money: number;
    reputation: number;
    deltaMoney: number;
    deltaReputation: number;
}

export type SerializableGameEventPayload =
    PlayerMovePayload |
    PlayerInteractPayload |
    PlayerHandChangedPayload |
    IngredientProcessedPayload |
    QTECompletedPayload |
    OrderCreatedPayload |
    OrderServedPayload |
    OrderResolvedPayload |
    CustomerStateChangedPayload |
    EconomyChangedPayload;

@ccclass
export class EventTypes extends cc.Component {
    // Marker component for Cocos Creator script discovery. Payload interfaces are exported above.
}
