const { ccclass, property } = cc._decorator;

import { GameEvents, SerializableGameState } from "../data/DataTypes";

export enum NetworkMode {
    Offline = "Offline",
    Client = "Client",
    Host = "Host",
}

@ccclass
export default class NetworkManager extends cc.Component {
    @property
    public mode: string = NetworkMode.Offline;

    @property
    public endpoint: string = "";

    private connected: boolean = false;

    public connect(): void {
        // TODO: Future phase: connect through WebSocket, Steam Networking, or platform service.
        this.connected = false;
        this.mode = NetworkMode.Offline;
    }

    public disconnect(): void {
        this.connected = false;
    }

    public isConnected(): boolean {
        return this.connected;
    }

    public sendGameState(state: SerializableGameState): void {
        if (!this.connected) {
            return;
        }

        // TODO: Serialize and send authoritative/snapshot state.
    }

    public receiveGameState(state: SerializableGameState): void {
        // TODO: Validate, reconcile, then dispatch to local systems.
        cc.systemEvent.emit(GameEvents.NETWORK_STATE_RECEIVED, state);
    }
}
