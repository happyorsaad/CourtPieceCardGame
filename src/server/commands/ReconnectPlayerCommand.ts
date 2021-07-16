import { Command } from "@colyseus/command";
import { CourtPieceState } from "../entities/CourtPieceState";

export class ReconnectPlayerCommand extends Command<
  CourtPieceState,
  { sessionId: string }
> {
  execute({ sessionId } = this.payload) {
    let player = this.state.players.get(sessionId);
    player.isConnected = true;
  }
}
