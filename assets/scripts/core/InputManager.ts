const { ccclass, property } = cc._decorator;

import { Vector2Data } from "../data/DataTypes";

@ccclass
export default class InputManager extends cc.Component {
    private pressedKeys: { [key: number]: boolean } = {};
    private downThisFrame: { [key: number]: boolean } = {};
    private movement: Vector2Data = { x: 0, y: 0 };

    onEnable(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDisable(): void {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(): void {
        this.updateMovement();
    }

    public getMovement(): Vector2Data {
        return { x: this.movement.x, y: this.movement.y };
    }

    public isKeyPressed(keyCode: number): boolean {
        return !!this.pressedKeys[keyCode];
    }

    public consumeInteractPressed(): boolean {
        return this.consumeKeyDown(cc.macro.KEY.e);
    }

    public consumeConfirmPressed(): boolean {
        return this.consumeKeyDown(cc.macro.KEY.space);
    }

    public consumePausePressed(): boolean {
        return this.consumeKeyDown(cc.macro.KEY.escape);
    }

    private onKeyDown(event: cc.Event.EventKeyboard): void {
        if (!this.pressedKeys[event.keyCode]) {
            this.downThisFrame[event.keyCode] = true;
        }

        this.pressedKeys[event.keyCode] = true;
    }

    private onKeyUp(event: cc.Event.EventKeyboard): void {
        this.pressedKeys[event.keyCode] = false;
    }

    private consumeKeyDown(keyCode: number): boolean {
        if (!this.downThisFrame[keyCode]) {
            return false;
        }

        this.downThisFrame[keyCode] = false;
        return true;
    }

    private updateMovement(): void {
        var x = 0;
        var y = 0;

        if (this.isKeyPressed(cc.macro.KEY.a) || this.isKeyPressed(cc.macro.KEY.left)) {
            x -= 1;
        }

        if (this.isKeyPressed(cc.macro.KEY.d) || this.isKeyPressed(cc.macro.KEY.right)) {
            x += 1;
        }

        if (this.isKeyPressed(cc.macro.KEY.w) || this.isKeyPressed(cc.macro.KEY.up)) {
            y += 1;
        }

        if (this.isKeyPressed(cc.macro.KEY.s) || this.isKeyPressed(cc.macro.KEY.down)) {
            y -= 1;
        }

        var length = Math.sqrt(x * x + y * y);
        this.movement.x = length > 0 ? x / length : 0;
        this.movement.y = length > 0 ? y / length : 0;
    }
}
