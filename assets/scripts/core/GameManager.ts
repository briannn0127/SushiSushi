const { ccclass, property } = cc._decorator;

import CustomerManager from "../customer/CustomerManager";
import { GameEvents, GameState, LevelConfig, SerializableGameState } from "../data/DataTypes";
import EconomyManager from "../economy/EconomyManager";
import OrderManager from "../order/OrderManager";
import PlayerManager from "../player/PlayerManager";
import InputManager from "./InputManager";
import TimeManager from "./TimeManager";

@ccclass
export default class GameManager extends cc.Component {
    @property(OrderManager)
    public orderManager: OrderManager = null;

    @property(CustomerManager)
    public customerManager: CustomerManager = null;

    @property(EconomyManager)
    public economyManager: EconomyManager = null;

    @property(PlayerManager)
    public playerManager: PlayerManager = null;

    @property(TimeManager)
    public timeManager: TimeManager = null;

    @property(InputManager)
    public inputManager: InputManager = null;

    @property
    public dayLengthSeconds: number = 180;

    @property
    public customerSpawnIntervalSeconds: number = 8;

    private state: GameState = GameState.Ready;
    private day: number = 1;
    private remainingDaySeconds: number = 180;
    private customerSpawnTimer: number = 0;

    onLoad(): void {
        this.remainingDaySeconds = this.dayLengthSeconds;
        if (this.timeManager) {
            this.timeManager.configure(this.dayLengthSeconds);
        }
        this.setState(GameState.Ready);
    }

    start(): void {
        this.startDay();
    }

    update(dt: number): void {
        if (this.inputManager && this.inputManager.consumePausePressed()) {
            this.togglePause();
        }

        if (this.state !== GameState.Playing) {
            return;
        }

        var dayEnded = false;
        if (this.timeManager) {
            dayEnded = this.timeManager.tick(dt);
            this.remainingDaySeconds = this.timeManager.getRemainingSeconds();
        } else {
            this.remainingDaySeconds -= dt;
            cc.systemEvent.emit(GameEvents.DAY_TIME_CHANGED, Math.max(0, this.remainingDaySeconds));
            dayEnded = this.remainingDaySeconds <= 0;
        }

        this.customerSpawnTimer -= dt;

        if (this.customerSpawnTimer <= 0) {
            this.customerSpawnTimer = this.customerSpawnIntervalSeconds;
            if (this.customerManager) {
                this.customerManager.spawnCustomer();
            }
        }

        if (dayEnded) {
            this.endDay();
        }
    }

    public configureLevel(levelConfig: LevelConfig): void {
        this.dayLengthSeconds = levelConfig.dayLengthSeconds;
        this.customerSpawnIntervalSeconds = levelConfig.customerSpawnIntervalSeconds;
        this.remainingDaySeconds = this.dayLengthSeconds;
        if (this.timeManager) {
            this.timeManager.configure(this.dayLengthSeconds);
        }

        if (this.customerManager) {
            this.customerManager.configure(levelConfig.recipeIds);
        }

        if (this.economyManager) {
            this.economyManager.configure(levelConfig.economy);
        }
    }

    public startDay(): void {
        this.remainingDaySeconds = this.dayLengthSeconds;
        if (this.timeManager) {
            this.timeManager.startDay();
        }
        this.customerSpawnTimer = 1;
        this.setState(GameState.Playing);
    }

    public pauseGame(): void {
        if (this.state === GameState.Playing) {
            if (this.timeManager) {
                this.timeManager.setPaused(true);
            }
            this.setState(GameState.Paused);
        }
    }

    public resumeGame(): void {
        if (this.state === GameState.Paused) {
            if (this.timeManager) {
                this.timeManager.setPaused(false);
            }
            this.setState(GameState.Playing);
        }
    }

    public togglePause(): void {
        if (this.state === GameState.Playing) {
            this.pauseGame();
            return;
        }

        if (this.state === GameState.Paused) {
            this.resumeGame();
        }
    }

    public getState(): GameState {
        return this.state;
    }

    public getDay(): number {
        return this.day;
    }

    public endDay(): void {
        if (this.economyManager) {
            this.economyManager.applyDailyCosts();
            this.setState(this.economyManager.isBankrupt() ? GameState.GameOver : GameState.DayEnd);
        } else {
            this.setState(GameState.DayEnd);
        }

        cc.systemEvent.emit(GameEvents.DAY_ENDED, this.day);
    }

    public getSerializableState(): SerializableGameState {
        return {
            state: this.state,
            day: this.day,
            remainingDaySeconds: this.remainingDaySeconds,
            money: this.economyManager ? this.economyManager.getMoney() : 0,
            players: this.playerManager ? this.playerManager.getPlayers() : [],
            activeOrders: this.orderManager ? this.orderManager.getActiveOrders() : [],
        };
    }

    public setState(nextState: GameState): void {
        if (this.state === nextState) {
            return;
        }

        this.state = nextState;
        cc.systemEvent.emit(GameEvents.GAME_STATE_CHANGED, this.state);
    }
}
