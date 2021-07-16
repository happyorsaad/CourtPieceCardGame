import { Dispatcher } from "@colyseus/command";
import { Room, Client } from "colyseus";
import { MessageCodes } from "../../schema/MessageCodes";
import { JoinGameCommand } from "../commands/JoinGameCommand";
import { NewOwnerCommand } from "../commands/NewOwnerCommand";
import { OnChatMessageReceived } from "../commands/OnChatMessageReceived";
import { OnConsentedLeaveCommand } from "../commands/OnConsentedLeaveCommand";
import { PlayCardCommand } from "../commands/PlayCardCommand";
import { ReconnectPlayerCommand } from "../commands/ReconnectPlayerCommand";
import { TrumpIsChosenCommand } from "../commands/TrumpIsChosenCommand";
import { CourtPieceState, DEFAULT_ROUNDS_PER_GAME } from "../entities/CourtPieceState";
import { Player } from "../entities/Player";
export class CourtPieceRoom extends Room<CourtPieceState> {
  private MAX_PLAYERS: number = 4;
  private dispatcher: Dispatcher;

  clientMap: WeakMap<Player, Client>;

  constructor() {
    super();
    this.clientMap = new WeakMap<Player, Client>();
  }

  onCreate(options: any) {
    this.maxClients = this.MAX_PLAYERS;
    this.dispatcher = new Dispatcher(this);
    this.clock.start();
    this.setState(new CourtPieceState());

    this.onMessage(MessageCodes.PLAY_CARD, (client, message) => {
      this.dispatcher.dispatch(
        new PlayCardCommand().setPayload({
          sessionId: client.sessionId,
          card: message.card,
        })
      );
    });

    this.onMessage(MessageCodes.TRUMP_CHOSEN, (client, message) => {
      this.dispatcher.dispatch(
        new TrumpIsChosenCommand().setPayload({
          trumpSuit: message.suit,
          sessionId: client.sessionId,
        })
      );
    });

    this.onMessage(MessageCodes.CHAT_MESSAGE, (client, message) => {
      this.dispatcher.dispatch(
        new OnChatMessageReceived().setPayload({
          sessionId: client.sessionId,
          message: message.msg,
        })
      );
    });
  }

  onJoin(client: Client, options: any) {
    console.log("onJoin", client.sessionId);
    this.state.roundsPerGame = options.endOn7 ? 7 : DEFAULT_ROUNDS_PER_GAME;
    this.dispatcher.dispatch(new JoinGameCommand(), {
      sessionId: client.sessionId,
      name: options.name,
    });
  }

  async onLeave(client: Client, consented: boolean) {
    let player = this.state.players.get(client.sessionId);
    player.isConnected = false;

    if (consented) {
      this.dispatcher.dispatch(new OnConsentedLeaveCommand(), {
        sessionId: client.sessionId,
      });
      return;
    }

    let replaceOwnerTimeout;
    if (player.isOwner) {
      console.log(client.sessionId + " was owner");
      replaceOwnerTimeout = this.clock.setTimeout(
        () =>
          this.dispatcher.dispatch(new NewOwnerCommand(), {
            lastOwnerId: client.sessionId,
          }),
        15_000
      );
    }

    console.log("on Leave");

    try {
      console.log("waiting for reconnection from :", client.sessionId);
      await this.allowReconnection(client, 60 * 5);
      console.log("reconnected");

      if (replaceOwnerTimeout) replaceOwnerTimeout.clear();
      this.dispatcher.dispatch(new ReconnectPlayerCommand(), {
        sessionId: client.sessionId,
      });
    } catch {
      player.hasLeft = true;
    }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
