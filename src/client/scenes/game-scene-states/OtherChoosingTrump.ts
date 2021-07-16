import { GamePlayState } from "../../../schema/GamePlayState";
import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class OtherChoosingTrump implements IState {
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
    this.gameScene.cardsDisplay.setVisible(true);
    this.gameScene.statusText.setVisible(false);
    this.gameScene.avatars.resetState();
  }

  onUpdate(dt: number) {
    const { playState, FSM, statusText, avatars, state, myIndex } = this.gameScene;
    const { players, trumpPlayerId } = this.gameScene.state;
    if (playState == GamePlayState.RUNNING) {
      FSM.setState(GamePlayState.RUNNING);
    }
    const trumpPlayerName = players.get(trumpPlayerId).name || "";
    statusText.setText(`${trumpPlayerName} is choosing trump`);
    avatars.setChoosingTrump(players.get(trumpPlayerId).index, myIndex);
    avatars.refresh();
  }
}
