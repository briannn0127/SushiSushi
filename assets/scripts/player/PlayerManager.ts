const { ccclass, property } = cc._decorator;

import { GameEvents, PlayerData } from "../data/DataTypes";
import PlayerController from "./PlayerController";

@ccclass
export default class PlayerManager extends cc.Component {
    @property([PlayerController])
    public playerControllers: PlayerController[] = [];

    private players: { [playerId: string]: PlayerData } = {};

    onEnable(): void {
        cc.systemEvent.on(GameEvents.PLAYER_DATA_CHANGED, this.onPlayerDataChanged, this);
    }

    onDisable(): void {
        cc.systemEvent.off(GameEvents.PLAYER_DATA_CHANGED, this.onPlayerDataChanged, this);
    }

    start(): void {
        this.refreshPlayersFromScene();
    }

    public refreshPlayersFromScene(): void {
        this.players = {};
        for (var i = 0; i < this.playerControllers.length; i++) {
            var data = this.playerControllers[i].getPlayerData();
            this.players[data.playerId] = data;
        }
    }

    public getPlayer(playerId: string): PlayerData {
        return this.players[playerId] || null;
    }

    public getPlayers(): PlayerData[] {
        var list: PlayerData[] = [];
        for (var key in this.players) {
            if (this.players.hasOwnProperty(key)) {
                list.push(this.players[key]);
            }
        }
        return list;
    }

    private onPlayerDataChanged(data: PlayerData): void {
        this.players[data.playerId] = data;
    }
}
