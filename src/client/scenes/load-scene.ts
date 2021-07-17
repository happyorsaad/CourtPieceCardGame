import { Theme } from "../theme/GameTheme";
import { SceneBase } from "./scene-base";

export class LoadScene extends SceneBase {
  private bounds: any;

  constructor() {
    super({ key: "LoadScene" });
  }

  preload(): void {
    this.scale.lockOrientation(Phaser.Scale.LANDSCAPE);
    console.log("load-scene");

    this.bounds = {
      x: this.gameWidth / 2,
      y: this.gameHeight / 2,
      radius: 75,
    };

    //@ts-ignore
    const circularProgress = this.add.rexCircularProgressCanvas({
      x: this.bounds.x,
      y: this.bounds.y,
      radius: this.bounds.radius,

      trackColor: Theme.Colors.PROGRESS_BAR_TRACKING,
      barColor: Theme.Colors.PROGRESS_BAR_TEXT,
      textColor: Theme.Colors.PROGRESS_BAR_TEXT,
      textFont: "20px",
      textFormatCallback: (value: number) => {
        return Math.floor(value * 100).toString();
      },
      value: 0,
    });

    this.load.multiatlas(
      "playing_cards",
      "../../assets/sprites/playing_cards.json",
      "../../assets/sprites/"
    );

    this.load.multiatlas(
      "icons",
      "../../assets/sprites/icons.json",
      "../../assets/sprites/"
    );

    this.load.multiatlas(
      "avatars",
      "../../assets/sprites/avatars.json",
      "../../assets/sprites/"
    );

    this.load.image("blue_spark", "assets/particles/blue.png");
    this.load.image("red_spark", "assets/particles/red.png");

    this.load.audio("click", "../../assets/sounds/button_click.wav");
    this.load.audio("card_place", "../../assets/sounds/card_place.ogg");
    this.load.audio("card_slide", "../../assets/sounds/card_slide.ogg");
    this.load.audio("ping", "../../assets/sounds/ping.wav");
    this.load.audio("success", "../../assets/sounds/success.wav");

    this.load.on("progress", (value: number) => {
      circularProgress.setValue(value);
    });

    this.load.on("complete", () => {
      circularProgress.destroy();
      this.scene.start("MenuScene");
    });
  }
}
