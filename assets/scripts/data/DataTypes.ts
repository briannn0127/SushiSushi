const { ccclass, property } = cc._decorator;

export enum GameState {
    Ready = "Ready",
    Loading = "Loading",
    Playing = "Playing",
    Paused = "Paused",
    DayEnd = "DayEnd",
    GameOver = "GameOver",
}

export enum Direction {
    Up = "Up",
    Down = "Down",
    Left = "Left",
    Right = "Right",
}

export enum IngredientType {
    Fish = "Fish",
    Rice = "Rice",
    Nori = "Nori",
    Topping = "Topping",
    Sauce = "Sauce",
}

export enum HandItemType {
    None = "None",
    Ingredient = "Ingredient",
    Sushi = "Sushi",
}

export enum QTEResult {
    Success = "Success",
    Normal = "Normal",
    Fail = "Fail",
}

export enum SushiQuality {
    Poor = "Poor",
    Normal = "Normal",
    Good = "Good",
    Excellent = "Excellent",
}

export enum PlayerAction {
    Interact = "Interact",
    Cancel = "Cancel",
}

export interface Vector2Data {
    x: number;
    y: number;
}

export interface IngredientData {
    id: string;
    displayName: string;
    type: IngredientType;
    baseCost: number;
    freshness: number;
}

export interface SushiData {
    id: string;
    recipeId: string;
    displayName: string;
    quality: SushiQuality;
    ingredients: IngredientData[];
    priceMultiplier: number;
}

export interface RecipeData {
    id: string;
    displayName: string;
    requiredIngredientIds: string[];
    basePrice: number;
    requiredStations: string[];
    targetPrepSeconds: number;
}

export interface OrderData {
    id: string;
    customerId: string;
    recipeId: string;
    createdAt: number;
    maxWaitSeconds: number;
    fulfilled: boolean;
}

export interface CustomerData {
    id: string;
    displayName: string;
    patienceSeconds: number;
    baseTipMultiplier: number;
}

export interface DailyCostData {
    rent: number;
    utilities: number;
    ingredientBudget: number;
    staff: number;
}

export interface EconomyConfig {
    startingMoney: number;
    bankruptcyThreshold: number;
    dailyCosts: DailyCostData;
}

export interface LevelConfig {
    id: string;
    displayName: string;
    dayLengthSeconds: number;
    customerSpawnIntervalSeconds: number;
    maxCustomers: number;
    recipeIds: string[];
    economy: EconomyConfig;
}

export interface PlayerData {
    playerId: string;
    displayName: string;
    position: Vector2Data;
    facing: Direction;
    handItem: HandItemData;
    isLocal: boolean;
}

export interface HandItemData {
    type: HandItemType;
    ingredient?: IngredientData;
    sushi?: SushiData;
}

export interface RevenueResult {
    basePrice: number;
    satisfactionMultiplier: number;
    qualityMultiplier: number;
    finalAmount: number;
}

export interface SerializableGameState {
    state: GameState;
    day: number;
    remainingDaySeconds: number;
    money: number;
    players: PlayerData[];
    activeOrders: OrderData[];
}

export class GameEvents {
    public static readonly GAME_STATE_CHANGED: string = "game-state-changed";
    public static readonly DAY_TIME_CHANGED: string = "day-time-changed";
    public static readonly DAY_ENDED: string = "day-ended";
    public static readonly MONEY_CHANGED: string = "money-changed";
    public static readonly ORDER_CREATED: string = "order-created";
    public static readonly ORDER_COMPLETED: string = "order-completed";
    public static readonly CUSTOMER_SPAWNED: string = "customer-spawned";
    public static readonly PLAYER_ACTION: string = "player-action";
    public static readonly PLAYER_MOVEMENT: string = "player-movement";
    public static readonly PLAYER_DATA_CHANGED: string = "player-data-changed";
    public static readonly PLAYER_HAND_CHANGED: string = "player-hand-changed";
    public static readonly NETWORK_STATE_RECEIVED: string = "network-state-received";
}

@ccclass
export class DataTypes extends cc.Component {
    // Marker component for Cocos Creator script discovery. Runtime data lives in exported interfaces above.
}
