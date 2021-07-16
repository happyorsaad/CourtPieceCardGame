import { TextButton } from "../objects/TextButton";
import { Theme } from "../theme/GameTheme";
import { AlignGrid } from "../utilities/AlignGrid";
import { SceneBase } from "./scene-base";

export class ServerDisconnectedScene extends SceneBase {
  private exitButton: TextButton;

  constructor() {
    super({ key: "ServerDisconnectedScene" });
  }

  create(): void {
    this.createExitButton();
    let bounds = this.alignGrid.getBoundsFor(64, 35, 60, 30);
    this.add
      .text(
        bounds.x,
        bounds.y,
        "Client Has Disconnected from the Server.\nTry Refreshing !",
        {
          align: "center",
          fontSize: "30px",
          color: "#ffffff",
          wordWrap: {
            width: bounds.width,
          },
        }
      )
      .setFixedSize(bounds.width, bounds.height);
    this.input.keyboard.on("keydown-ESC", this.onBackPressed.bind(this));
  }

  createExitButton() {
    let { x, y, width, height } = this.alignGrid.getBoundsFor(64, 45, 20, 5);
    this.exitButton = this.add.textButton(
      x,
      y,
      width,
      height,
      "Exit",
      this.onBackPressed.bind(this),
      Theme.TextStyles.TEXT_BUTTON
    );
  }

  onBackPressed() {
    this.scene.switch("MenuScene");
  }
}
