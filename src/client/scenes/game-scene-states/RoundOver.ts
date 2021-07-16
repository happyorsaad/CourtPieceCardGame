import { GamePlayState } from "../../../schema/GamePlayState";
import { GameStateHelpers } from "../../utilities/GameStateHelpers";
import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class RoundOver implements IState {
  name: number;
  gameScene: GameScene;

  constructor(name: number, gameScene: GameScene) {
    this.name = name;
    this.gameScene = gameScene;
  }

  onEnter() {
    this.gameScene.cardsDisplay.setVisible(false);
    this.gameScene.statusText.setVisible(true);
  }

  onExit() {
    this.gameScene.playedCards.clear();
    this.gameScene.cardsDisplay.setVisible(true);
    this.gameScene.statusText.setVisible(false);
  }

  onUpdate(dt: number) {
    const { playState, FSM, statusText } = this.gameScene;
    if (playState != GamePlayState.ROUND_OVER) {
      FSM.setState(GamePlayState.RUNNING);
    }
    const winners = this.getWinnerNames();
    statusText
      .setText(`${winners.join(" , ")} Have Won This Round\nCongratulation !!`)
      .updateText();
  }

  getWinnerNames(): string[] {
    const { winnerPlayerId, players } = this.gameScene.state;
    const winner = players.get(winnerPlayerId);
    const teammateIndex = (winner.index + 2) % 4;
    const teammate = GameStateHelpers.getPlayerWithIndex(
      this.gameScene.state,
      teammateIndex
    );
    return [winner.name, teammate.name];
  }
}
