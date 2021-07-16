import * as Colyseus from "colyseus.js";
import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { MessageCodes } from "../../schema/MessageCodes";
import { NetworkEvents } from "../../schema/NetworkEvents";
import { NetworkConfig } from "./NetworkConfig";

export class ColyseusPlugin extends Phaser.Plugins.BasePlugin {
  private client: Colyseus.Client;
  private events: Phaser.Events.EventEmitter;
  private roomName: string;
  private room: Colyseus.Room<ICourtPieceState>;

  roomId: string;
  sessionId: string;
  gameState: ICourtPieceState;
  isConnected = false;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    this.events = new Phaser.Events.EventEmitter();
  }

  init(config: NetworkConfig) {
    this.client = new Colyseus.Client(config.url);
    this.roomName = config.roomName;
  }

  async joinOrCreate(options: any = {}) {
    try {
      const room = await this.client.joinOrCreate(this.roomName, options);
      console.log("joined successfully", room);
      this.configureRoom(room);
      this.events.emit(NetworkEvents.JOINED_ROOM, room);
    } catch (e) {
      console.error("join error", e);
      this.events.emit(NetworkEvents.JOIN_ERROR, e);
    }
  }

  async create(options: any = {}) {
    try {
      const room = await this.client.create(this.roomName, options);
      console.log("joined successfully", room);
      this.configureRoom(room);
      this.events.emit(NetworkEvents.JOINED_ROOM, room);
    } catch (e) {
      console.error("join error", e);
      this.events.emit(NetworkEvents.JOIN_ERROR, e);
    }
  }

  async join(options: any = {}) {
    try {
      const room = await this.client.join(this.roomName, options);
      console.log("joined successfully", room);
      this.configureRoom(room);
      this.events.emit(NetworkEvents.JOINED_ROOM, room);
    } catch (e) {
      console.error("join error", e);
      this.events.emit(NetworkEvents.JOIN_ERROR, e);
    }
  }

  async joinById(roomId: string, options: any = {}) {
    try {
      const room = await this.client.joinById(roomId, options);
      console.log("joined successfully", room);
      this.configureRoom(room);
      this.events.emit(NetworkEvents.JOINED_ROOM, room);
    } catch (e) {
      console.error("join error", e);
      this.events.emit(NetworkEvents.JOIN_ERROR, e);
    }
  }

  async reconnect(roomId: string, sessionId: string) {
    try {
      const room = await this.client.reconnect(roomId, sessionId);
      console.log("joined successfully", room);
      this.configureRoom(room);
      this.events.emit(NetworkEvents.JOINED_ROOM, room);
    } catch (e) {
      console.error("join error", e);
      this.events.emit(NetworkEvents.RECONNECT_ERROR, e);
    }
  }

  clear() {
    sessionStorage.removeItem("roomId");
    sessionStorage.removeItem("sessionId");
  }

  leaveRoom() {
    this.room.leave();
  }

  onMessage(type: string | number, callback: any) {
    this.room.onMessage(type, callback);
  }

  configureRoom(room: Colyseus.Room) {
    this.room = room;
    this.roomId = room.id;
    this.sessionId = room.sessionId;
    this.gameState = room.state;

    localStorage.setItem("roomId", this.roomId);
    localStorage.setItem("sessionId", this.sessionId);

    this.room.onStateChange((gameState: ICourtPieceState) => {
      console.log("init : state changed");
      this.gameState = gameState;
      this.events.emit(NetworkEvents.ROOM_STATE_CHANGED, gameState);
    });

    this.room.onLeave((code) => {
      console.log("client left the room ", code);
      this.room = null;
      this.roomId = null;
      this.sessionId = null;
      this.events.emit(NetworkEvents.LEFT_ROOM, code);
    });

    this.room.onError((code, message) => {
      console.log("oops, error ocurred:");
      console.log(message);
      this.events.emit(NetworkEvents.ROOM_ERROR, code, message);
    });

    Object.values(MessageCodes).forEach((msgType, idx) => {
        this.room.onMessage(msgType, (message) => {
            this.events.emit(NetworkEvents.ON_MESSAGE, msgType, message);
        })
    });
  }

  on(event: string, callback: Function, context?: any) {
    this.events.on(event, callback, context);
  }

  once(event: string, callback: Function, context?: any) {
    this.events.once(event, callback, context);
  }

  off(event: string, callback?: Function, context?: any) {
    this.events.off(event, callback, context);
  }

  send(type: string | number, message: any = {}) {
    this.room.send(type, message);
  }
}
