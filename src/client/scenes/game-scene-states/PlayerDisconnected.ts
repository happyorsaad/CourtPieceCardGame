import { GamePlayState } from "../../../schema/GamePlayState";
import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class PlayerDisconnected implements IState {
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
  }

  onUpdate(dt: number) {
    const { playState, FSM, state } = this.gameScene;
    const allConnected = ![...state.players.values()].some(
      (player) => !player.isConnected
    );

    if (allConnected) {
      FSM.setState(GamePlayState.RUNNING);
    }

    const disconnectedPlayers = [...state.players.values()]
      .filter((info) => !info.isConnected)
      .map((info) => info.name);

    this.gameScene.statusText.setText(
      `${disconnectedPlayers.join(", ")} ${
        disconnectedPlayers.length == 1 ? "has" : "have"
      } disconnected.\n\nWaiting ....`
    );
  }
}
