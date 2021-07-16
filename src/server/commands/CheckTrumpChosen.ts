import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { CardSuit, SUIT_NAMES } from "../../schema/ICard";
import { CourtPieceState } from "../entities/CourtPieceState";
import { getRandomItem } from "../utils";

export class CheckTrumpChosen extends Command<
  CourtPieceState,
  { waitFor: number }
> {
  validate() {
    return this.state.playState == GamePlayState.CHOOSING_TRUMP;
  }

  async execute({ waitFor } = this.payload) {
    await this.delay(waitFor);
    if (
      this.state.playState == GamePlayState.CHOOSING_TRUMP ||
      this.state.trumpSuit == CardSuit.INVALID
    ) {
      this.state.trumpSuit = getRandomItem(SUIT_NAMES);
      this.state.playState = GamePlayState.RUNNING;
    }
  }
}
