const { ccclass, property } = cc._decorator;

import { GameEvents } from "../data/DataTypes";

@ccclass
export default class TimeManager extends cc.Component {
    @property
    public dayLengthSeconds: number = 180;

    @property
    public timeScale: number = 1;

    private remainingSeconds: number = 180;
    private paused: boolean = true;

    onLoad(): void {
        this.remainingSeconds = this.dayLengthSeconds;
    }

    public configure(dayLengthSeconds: number): void {
        this.dayLengthSeconds = dayLengthSeconds;
        this.remainingSeconds = dayLengthSeconds;
        cc.systemEvent.emit(GameEvents.DAY_TIME_CHANGED, this.remainingSeconds);
    }

    public startDay(): void {
        this.remainingSeconds = this.dayLengthSeconds;
        this.paused = false;
        cc.systemEvent.emit(GameEvents.DAY_TIME_CHANGED, this.remainingSeconds);
    }

    public setPaused(paused: boolean): void {
        this.paused = paused;
    }

    public tick(dt: number): boolean {
        if (this.paused) {
            return false;
        }

        this.remainingSeconds = Math.max(0, this.remainingSeconds - dt * this.timeScale);
        cc.systemEvent.emit(GameEvents.DAY_TIME_CHANGED, this.remainingSeconds);
        return this.remainingSeconds <= 0;
    }

    public getRemainingSeconds(): number {
        return this.remainingSeconds;
    }
}
