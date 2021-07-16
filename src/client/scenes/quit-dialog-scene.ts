import { Scene } from "phaser";
import { SceneBase } from "./scene-base";

export class QuitDialogScene extends SceneBase {
  private parent: Scene;

  constructor() {
    super({
      key: "QuitDialogScene",
    });
  }

  init(data: any) {
    this.parent = data.parent;
  }

  preload() {
    this.cameras.main.setBackgroundColor("rgb(100,100,100,0.5)");
  }

  create() {
    const dialog = this.rexUI.add.dialog({
      x: this.gameWidth / 2,
      y: this.gameHeight / 2,
      width: 400,
      height: 200,
      background: this.add.rectangle(50, 50, 100, 100, 0x3f72af),

      title: this.rexUI.add.label({
        background: this.add.rectangle(0, 0, 100, 40, 0x003c8f),
        text: this.add.text(0, 0, "Quit Game", {
          fontSize: "24px",
        }),
        space: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10,
        },
      }),

      content: this.add.text(0, 0, "Are You Sure ?", {
        fontSize: "24px",
      }),

      actions: [
        this.add.textButton(0, 0, 50, 35, "Yes", () => {
          this.network.leaveRoom();
          this.network.clear();
          this.scene.stop("GameScene");
          this.scene.stop("WaitingForPlayersScene");
          this.scene.stop("ChatScene");
          this.scene.stop();
          this.scene.run("MenuScene", {
              fromQuitDialog: true
          });
        }),
        this.add.textButton(0, 0, 50, 35, "No", () => {
          this.scene.stop();
        }),
      ],

      space: {
        title: 25,
        content: 25,
        action: 15,

        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },

      align: {
        actions: "right", // 'center'|'left'|'right'
      },

      expand: {
        content: false, // Content is a pure text object
      },
    });
    dialog.layout();
  }

  createLabel(text: string) {
    return this.rexUI.add.label({
      background: this.add.rectangle(0, 0, 0, 0, 0x5e92f3),
      text: this.add.text(0, 0, text, {
        fontSize: "24px",
      }),
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    });
  }
}
