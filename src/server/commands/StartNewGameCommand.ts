import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { CourtPieceState } from "../entities/CourtPieceState";
import { getRandomItem } from "../utils";
import { SendChooseTrumpMessageCommand } from "./SendChooseTrumpMessageCommand";

export class StartNewGameCommand extends Command<CourtPieceState> {
  execute() {
    console.log("StartNewGameCommand");
    this.state.playState = GamePlayState.RUNNING;
    this.state.deck.fillFreshCards();
    this.state.currentPlayer = 0;
    this.room.lock();
    this.state.resetScores();
    return [
      new SendChooseTrumpMessageCommand().setPayload({
        sessionId: getRandomItem(this.state.players).id,
      }),
    ];
  }
}
