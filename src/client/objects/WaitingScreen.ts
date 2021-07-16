import { GameObjects, Scene } from "phaser";

export class WaitingScreen extends GameObjects.Container {
  private connectedPlayerNames: string[];
  private waitingForPlayersText: GameObjects.Text;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);

    this.waitingForPlayersText = new GameObjects.Text(
      scene,
      0,
      0,
      "Waiting For All The Players To Join !",
      {
        align: "center",
        //@ts-ignore
        fontSize: 15,
      }
    );
    
    this.add(this.waitingForPlayersText);
  }
}
