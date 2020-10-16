interface IParams {
    isDestroy?: boolean;
    isDebug?: boolean;
    connectURL: string;
    lastHealth: number;
    timeoutObj?: number;
    reconnectObj?: number;
    heartbeatIdleTime?: number;
    heartbeatInterval?: number;
    heartbeatCMessage?: string;
    heartbeatSMessage?: string;
    reconnectTime?: number;
}

interface IOptions {
    isDestroy?: boolean;
    isDebug?: boolean;
    onopen?: Function;
    onmessage?: Function;
    onerror?: Function;
    onclose?: Function;
    destroy?: Function;
}

declare class KaliSocket {
    Params: IParams;
    constructor(wsurl: string);
    init(): void;
    onopen(event: object): void;
    onmessage(event: object): void;
    onerror(event: object): void;
    onclose(event: object): void;
    send(msg: string | object): void;
    deteck(): void;
    destroy(): void;
    heartReset(): void;
    reconnect(): void;
    heartStart(heartbeatIdleTime?: IOptions, heartbeatInterval?: IOptions, heartbeatCMessage?: IOptions): void;
    create(Ioptions?: IOptions): void;
}