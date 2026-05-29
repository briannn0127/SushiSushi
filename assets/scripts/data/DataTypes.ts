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

export enum PlayerAction {
    Move = "Move",
    Interact = "Interact",
    Confirm = "Confirm",
    Cancel = "Cancel",
    Pause = "Pause",
}

export enum PlayerRole {
    Chef = "Chef",
    Server = "Server",
    Fisher = "Fisher",
    Flexible = "Flexible",
}

export enum HandItemType {
    None = "None",
    Ingredient = "Ingredient",
    Sushi = "Sushi",
    Plate = "Plate",
    Trash = "Trash",
}

export enum IngredientType {
    Fish = "Fish",
    Rice = "Rice",
    Nori = "Nori",
    Egg = "Egg",
    Topping = "Topping",
    Sauce = "Sauce",
    Plate = "Plate",
}

export enum IngredientState {
    Raw = "Raw",
    Washed = "Washed",
    Sliced = "Sliced",
    Cooked = "Cooked",
    Assembled = "Assembled",
    Plated = "Plated",
    Overcooked = "Overcooked",
    Spoiled = "Spoiled",
    Perfect = "Perfect",
    Trashed = "Trashed",
}

export enum ProcessingState {
    None = "None",
    Fishing = "Fishing",
    Washing = "Washing",
    Slicing = "Slicing",
    CookingRice = "CookingRice",
    Assembling = "Assembling",
    Plating = "Plating",
    Serving = "Serving",
    Trashing = "Trashing",
}

export enum IngredientRarity {
    Common = "Common",
    Uncommon = "Uncommon",
    Rare = "Rare",
    Epic = "Epic",
    Legendary = "Legendary",
}

export enum QualityGrade {
    Poor = "Poor",
    Normal = "Normal",
    Good = "Good",
    Excellent = "Excellent",
    Perfect = "Perfect",
}

export enum SushiQuality {
    Poor = "Poor",
    Normal = "Normal",
    Good = "Good",
    Excellent = "Excellent",
    Perfect = "Perfect",
}

export enum SushiType {
    SalmonNigiri = "SalmonNigiri",
    TunaNigiri = "TunaNigiri",
    EggNigiri = "EggNigiri",
    MakiRoll = "MakiRoll",
    Sashimi = "Sashimi",
    ChefSpecial = "ChefSpecial",
}

export enum RecipeStepType {
    Fishing = "Fishing",
    Wash = "Wash",
    SliceQTE = "SliceQTE",
    CookRice = "CookRice",
    Assemble = "Assemble",
    Plate = "Plate",
    Serve = "Serve",
    Trash = "Trash",
}

export enum StationType {
    FishingDock = "FishingDock",
    WashStation = "WashStation",
    CuttingStation = "CuttingStation",
    RiceCooker = "RiceCooker",
    AssemblyStation = "AssemblyStation",
    PlatingStation = "PlatingStation",
    ServingCounter = "ServingCounter",
    TrashBin = "TrashBin",
}

export enum StationState {
    Idle = "Idle",
    Busy = "Busy",
    Blocked = "Blocked",
    NeedsCleanup = "NeedsCleanup",
    Disabled = "Disabled",
}

export enum QTEResult {
    Perfect = "Perfect",
    Success = "Success",
    Normal = "Normal",
    Fail = "Fail",
}

export enum OrderType {
    Normal = "Normal",
    Timed = "Timed",
    VIP = "VIP",
    Combo = "Combo",
    Preference = "Preference",
}

export enum OrderState {
    Created = "Created",
    Waiting = "Waiting",
    ReadyToServe = "ReadyToServe",
    Completed = "Completed",
    Failed = "Failed",
    WrongServed = "WrongServed",
    Expired = "Expired",
}

export enum CustomerState {
    Entering = "Entering",
    WaitingSeat = "WaitingSeat",
    Ordering = "Ordering",
    WaitingFood = "WaitingFood",
    Eating = "Eating",
    Rating = "Rating",
    Leaving = "Leaving",
}

export enum CustomerPreferenceType {
    LikesIngredient = "LikesIngredient",
    DislikesIngredient = "DislikesIngredient",
    MinimumQuality = "MinimumQuality",
    FastService = "FastService",
    RareFishOnly = "RareFishOnly",
}

export enum GameEvent {
    GameStateChanged = "GameStateChanged",
    DayStarted = "DayStarted",
    DayTimeChanged = "DayTimeChanged",
    DayEnded = "DayEnded",
    PlayerJoined = "PlayerJoined",
    PlayerLeft = "PlayerLeft",
    PlayerMoved = "PlayerMoved",
    PlayerInteracted = "PlayerInteracted",
    PlayerHandChanged = "PlayerHandChanged",
    IngredientPickedUp = "IngredientPickedUp",
    IngredientProcessed = "IngredientProcessed",
    QTEStarted = "QTEStarted",
    QTECompleted = "QTECompleted",
    SushiAssembled = "SushiAssembled",
    OrderCreated = "OrderCreated",
    OrderServed = "OrderServed",
    OrderCompleted = "OrderCompleted",
    OrderFailed = "OrderFailed",
    CustomerSpawned = "CustomerSpawned",
    CustomerStateChanged = "CustomerStateChanged",
    CustomerSatisfactionChanged = "CustomerSatisfactionChanged",
    MoneyChanged = "MoneyChanged",
    ReputationChanged = "ReputationChanged",
    TierChanged = "TierChanged",
    UIWarningRaised = "UIWarningRaised",
    NetworkStateReceived = "NetworkStateReceived",
}

export interface Vector2Data {
    x: number;
    y: number;
}

export interface SerializableEvent {
    eventId: string;
    type: GameEvent;
    sourcePlayerId?: string;
    frame?: number;
    timestamp: number;
    payload: any;
}

export interface PlayerData {
    playerId: string;
    displayName: string;
    role?: PlayerRole;
    position: Vector2Data;
    facing: Direction;
    handItem: HandItemData;
    isLocal: boolean;
    connected?: boolean;
}

export interface HandItemData {
    type: HandItemType;
    itemId?: string;
    ingredient?: IngredientData;
    sushi?: SushiData;
}

export interface IngredientData {
    id: string;
    displayName: string;
    type: IngredientType;
    state?: IngredientState;
    processingState?: ProcessingState;
    rarity?: IngredientRarity;
    quality?: QualityGrade;
    freshness: number;
    baseCost: number;
    createdAt?: number;
    expiresAt?: number;
    sourcePlayerId?: string;
}

export interface RecipeStepData {
    stepType: RecipeStepType;
    stationType: StationType;
    requiredIngredientTypes: IngredientType[];
    durationSeconds: number;
    qteRequired: boolean;
}

export interface RecipeData {
    id: string;
    sushiType?: SushiType;
    displayName: string;
    requiredIngredientTypes?: IngredientType[];
    requiredIngredientIds?: string[];
    steps?: RecipeStepData[];
    basePrice: number;
    requiredStations?: string[];
    targetPrepSeconds: number;
    minimumQuality?: QualityGrade;
    unlockTier?: number;
}

export interface SushiData {
    id: string;
    recipeId: string;
    sushiType?: SushiType;
    displayName: string;
    quality: SushiQuality;
    ingredients: IngredientData[];
    freshness?: number;
    priceMultiplier: number;
    assembledByPlayerId?: string;
}

export interface CustomerPreferenceData {
    type: CustomerPreferenceType;
    targetId?: string;
    value?: string;
    weight: number;
}

export interface OrderData {
    id: string;
    customerId: string;
    type?: OrderType;
    state?: OrderState;
    recipeId: string;
    comboRecipeIds?: string[];
    createdAt: number;
    maxWaitSeconds: number;
    fulfilled: boolean;
    requiredQuality?: QualityGrade;
    customerPreferences?: CustomerPreferenceData[];
    priceMultiplier?: number;
}

export interface CustomerData {
    id: string;
    displayName: string;
    state?: CustomerState;
    orderIds?: string[];
    patienceSeconds: number;
    satisfaction?: number;
    baseTipMultiplier: number;
    preferences: CustomerPreferenceData[];
    seatId?: string;
}

export interface StationData {
    stationId: string;
    displayName: string;
    stationType: StationType;
    state: StationState;
    position: Vector2Data;
    currentProcessingState: ProcessingState;
    assignedPlayerId?: string;
    inputItemIds: string[];
    outputItemIds: string[];
    progress01: number;
    unlocked: boolean;
}

export interface DailyCostData {
    rent: number;
    utilities: number;
    ingredientBudget: number;
    staff: number;
    maintenance?: number;
}

export interface EconomyConfig {
    startingMoney: number;
    bankruptcyThreshold: number;
    baseReputation: number;
    baseCustomerTraffic: number;
    tierUpgradeCost: number;
    dailyCosts: DailyCostData;
}

export interface DayConfig {
    day: number;
    tier: number;
    dayLengthSeconds: number;
    startingMoneyOverride?: number;
    fixedCostMultiplier: number;
    customerSpawnConfig: CustomerSpawnConfig;
    recipeUnlockConfig: RecipeUnlockConfig;
    stationUnlockConfig: StationUnlockConfig;
    difficultyScalingConfig: DifficultyScalingConfig;
}

export interface CustomerSpawnConfig {
    initialDelaySeconds: number;
    spawnIntervalSeconds: number;
    maxCustomersInShop: number;
    vipChance: number;
    comboOrderChance: number;
}

export interface RecipeUnlockConfig {
    unlockedRecipeIds: string[];
    newlyUnlockedRecipeIds: string[];
}

export interface StationUnlockConfig {
    unlockedStationTypes: StationType[];
    newlyUnlockedStationTypes: StationType[];
}

export interface DifficultyScalingConfig {
    patienceMultiplier: number;
    priceMultiplier: number;
    spawnRateMultiplier: number;
    qualityRequirementBias: number;
}

export interface LevelConfig {
    id: string;
    displayName: string;
    dayLengthSeconds?: number;
    customerSpawnIntervalSeconds?: number;
    maxCustomers?: number;
    recipeIds?: string[];
    dayConfigs?: DayConfig[];
    economy: EconomyConfig;
}

export interface RevenueResult {
    basePrice: number;
    tipAmount: number;
    satisfactionMultiplier: number;
    qualityMultiplier: number;
    preferenceMultiplier: number;
    finalAmount: number;
}

export interface DayResultData {
    day: number;
    tier: number;
    revenue: number;
    tips: number;
    fixedCosts: number;
    ingredientCosts: number;
    netProfit: number;
    completedOrders: number;
    failedOrders: number;
    wrongOrders: number;
    averageSatisfaction: number;
    reputationDelta: number;
    bankrupt: boolean;
}

export interface SerializableGameState {
    state: GameState;
    day: number;
    tier?: number;
    remainingDaySeconds: number;
    money: number;
    reputation?: number;
    players: PlayerData[];
    customers?: CustomerData[];
    activeOrders: OrderData[];
    stations?: StationData[];
}

// Backward-compatible event names used by the current prototype scripts.
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
