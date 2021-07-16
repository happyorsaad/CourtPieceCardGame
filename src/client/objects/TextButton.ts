import { GameObjects, Scene } from "phaser";

export class TextButton extends GameObjects.Text {
  private defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    align: "center",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontSize : "20px",
    fontStyle: "bold",
    padding: {
      x: 5,
      y: 10,
    },
  };
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    onClick: any,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    super(scene, x, y, text, style);

    if (!style) {
      this.setStyle(this.defaultStyle);
    }

    onClick = onClick || function () {};

    this.setFixedSize(width, height);
    this.setInteractive({
      useHandCursor: true,
    });
    this.on("pointerdown", () => {
      this.scene.sound.play("click");
      onClick()
    });
    this.on("pointerover", () => {
      this.setTint(0xD7FBE8);
    });
    this.on("pointerout", () => {
      this.clearTint();
    });
  }
}
