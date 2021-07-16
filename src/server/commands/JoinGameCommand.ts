import { Command } from "@colyseus/command";
import { CourtPieceState } from "../entities/CourtPieceState";
import { Player } from "../entities/Player";
import { StartNewGameCommand } from "./StartNewGameCommand";

export class JoinGameCommand extends Command<
  CourtPieceState,
  { sessionId: string; name: string }
> {
  validate({ sessionId } = this.payload) {
    return (
      this.state.players.size < this.room.maxClients &&
      !this.state.players.has(sessionId)
    );
  }

  execute({ sessionId, name } = this.payload) {
    const playerIdx = this.state.players.size;
    const player = new Player(sessionId, name, playerIdx);
    if (!this.state.hasOwner) {
      player.isOwner = true;
      this.state.hasOwner = true;
    }
    this.state.players.set(sessionId, player);
    if (this.state.players.size == this.room.maxClients) {
      return [new StartNewGameCommand()];
    }
  }
}
