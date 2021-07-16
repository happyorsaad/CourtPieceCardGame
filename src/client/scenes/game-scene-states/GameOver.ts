import { GamePlayState } from "../../../schema/GamePlayState";
import { TeamNames } from "../../../schema/TeamNames";
import { GameStateHelpers } from "../../utilities/GameStateHelpers";
import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class GameOver implements IState {
  name: number;
  gameScene: GameScene;

  constructor(name: number, gameScene: GameScene) {
    this.name = name;
    this.gameScene = gameScene;
  }

  onEnter() {
    this.gameScene.cardsDisplay.setVisible(false);
    this.gameScene.statusText.setVisible(true);
    const emitter =
      this.getWinnerTeam() == TeamNames.BLUE
        ? this.gameScene.blueBurst
        : this.gameScene.redBurst;
    Phaser.Utils.Array.NumberArray(0, 40).forEach((idx) => {
      const x = Phaser.Math.Between(0, this.gameScene.gameWidth);
      const y = Phaser.Math.Between(0, this.gameScene.gameHeight);
      this.gameScene.time.delayedCall(Phaser.Math.Between(0, 1000), () => {
        emitter.explode(100, x, y);
      });
    });
  }

  onExit() {
    this.gameScene.playedCards.clear();
    this.gameScene.cardsDisplay.setVisible(true);
    this.gameScene.statusText.setVisible(false);
  }

  onUpdate(dt: number) {
    const { playState, FSM, statusText } = this.gameScene;
    if (playState != GamePlayState.GAME_OVER) {
      FSM.setState(GamePlayState.RUNNING);
    }
    const winners = this.getWinnerNames();
    statusText
      .setText(`${winners.join(" , ")} Have Won The Game\nCongratulation !!`)
      .updateText();
  }

  getWinnerTeam() {
    const { winnerPlayerId, players } = this.gameScene.state;
    const winner = players.get(winnerPlayerId).index;
    return winner == 0 || winner == 2 ? TeamNames.RED : TeamNames.BLUE;
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
