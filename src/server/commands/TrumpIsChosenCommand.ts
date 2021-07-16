import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { CardSuit } from "../../schema/ICard";
import { CourtPieceState } from "../entities/CourtPieceState";

export class TrumpIsChosenCommand extends Command<
  CourtPieceState,
  { sessionId: string; trumpSuit: number }
> {
  validate({ sessionId } = this.payload) {
    return (
      sessionId == this.state.trumpPlayerId &&
      this.state.trumpSuit == CardSuit.INVALID
    );
  }

  execute({ trumpSuit } = this.payload) {
    console.log("TrumpIsChosenCommand");
    this.state.playState = GamePlayState.RUNNING;
    this.state.trumpSuit = trumpSuit;
    this.state.currentPlayer = this.state.players.get(
      this.state.trumpPlayerId
    ).index;
    this.state.players.forEach((player, playerId) => {
      const cards =
        playerId == this.state.trumpPlayerId
          ? this.state.deck.draw(8)
          : this.state.deck.draw(13); 
      player.assignCards(cards);
    });
  }
}
