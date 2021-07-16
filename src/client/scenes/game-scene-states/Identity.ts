import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class IdentityState implements IState {
  name: number;
  gameScene: GameScene;

  constructor(name: number, gameScene: GameScene) {
    this.name = name;
    this.gameScene = gameScene;
  }

  onEnter() {}

  onExit() {}

  onUpdate(dt: number) {}
}
