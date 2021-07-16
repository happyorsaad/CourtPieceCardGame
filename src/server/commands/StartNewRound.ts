import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { CardSuit } from "../../schema/ICard";
import { TeamNames } from "../../schema/TeamNames";
import { CourtPieceState } from "../entities/CourtPieceState";
import { Player } from "../entities/Player";
import { SendChooseTrumpMessageCommand } from "./SendChooseTrumpMessageCommand";

const WAIT_TIME = 3000;
export class StartNewRound extends Command<
  CourtPieceState,
  { lastRoundWinner: Player }
> {
  async execute({ lastRoundWinner } = this.payload) {
    console.log("StartNewRound : ");
    console.log(this.state.roundsPerGame);

    this.state.roundNumber += 1;
    if (this.isGameOver()) {
      this.state.playState = GamePlayState.GAME_OVER;
      const teamName =
        this.state.handWins.get(TeamNames.BLUE) >
        this.state.handWins.get(TeamNames.RED)
          ? TeamNames.BLUE
          : TeamNames.RED;

      this.state.winnerPlayerId = this.getRandomWinnerId(teamName);
      const currentScore = this.state.gameWins.get(teamName);
      this.state.gameWins.set(teamName, currentScore + 1);
      this.state.resetScores();
    } else {
      this.state.playState = GamePlayState.ROUND_OVER;
    }

    await this.delay(WAIT_TIME);

    this.state.activeCards.clear();
    this.state.currentPlayer = lastRoundWinner.index;
    this.state.roundSuit = CardSuit.INVALID;
    this.state.playState = GamePlayState.RUNNING;
  }

  isGameOver() {
    return (
      this.state.roundNumber % this.state.roundsPerGame == 0 ||
      this.state.handWins.get(TeamNames.RED) == 7 ||
      this.state.handWins.get(TeamNames.BLUE) == 7
    );
  }

  getRandomWinnerId(team: TeamNames) {
    let idx = -1;
    switch (team) {
      case TeamNames.BLUE:
        idx = Math.random() < 0.5 ? 1 : 3;
        break;
      case TeamNames.RED:
        idx = Math.random() < 0.5 ? 0 : 2;
        break;
    }
    return [...this.state.players.values()].find(
      (player) => player.index == idx
    ).id;
  }
}
