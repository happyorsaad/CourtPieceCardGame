import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { CourtPieceState } from "../entities/CourtPieceState";

export class OnConsentedLeaveCommand extends Command<
  CourtPieceState,
  { sessionId: string }
> {
  execute({ sessionId } = this.payload) {
    if (this.state.playState == GamePlayState.WAITING) {
      this.state.players.delete(sessionId);
    }
    this.room.unlock();
    this.state.players.get(sessionId).hasLeft = true;
  }
}
