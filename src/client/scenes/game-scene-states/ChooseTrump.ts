import { GamePlayState } from "../../../schema/GamePlayState";
import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class ChooseTrump implements IState {
  name: number;
  gameScene: GameScene;

  constructor(name: number, gameScene: GameScene) {
    this.name = name;
    this.gameScene = gameScene;
  }

  onEnter() {
    this.gameScene.hideGamePlayObjects();
    this.gameScene.trumpChooserScreen.setVisible(true);
  }

  onExit() {
    this.gameScene.showGamePlayObjects();
    this.gameScene.trumpChooserScreen.setVisible(false);
  }

  onUpdate(dt: number) {
    const { playState, myCards } = this.gameScene;
    if (playState == GamePlayState.RUNNING) {
      this.gameScene.FSM.setState(GamePlayState.RUNNING);
      return;
    }
    this.gameScene.trumpChooserScreen.setPlayerCards(myCards);
    this.gameScene.trumpChooserScreen.update();
  }
}
