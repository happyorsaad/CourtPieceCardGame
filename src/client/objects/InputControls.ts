import { GameObjects, Scene } from "phaser";
import { Buttons } from "phaser3-rex-plugins/templates/ui/ui-components.js";

export enum InputType {
  QUIT,
  SOUND,
  FULLSCREEN,
}

export class InputControls extends GameObjects.Container {
  private inputTypes: InputType[];
  private buildFactory: Map<InputType, Function> = new Map();
  private itemWidth: number;
  private anchor: any;
  private soundIcon: GameObjects.Sprite;
  private fullSCreen: GameObjects.Sprite;
  private soundOn: boolean;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    buttonSize: number,
    inputTypes: InputType[],
    anchor: any = {}
  ) {
    super(scene, x, y);

    this.width = buttonSize * inputTypes.length;
    this.height = buttonSize;

    this.anchor = anchor || {};
    this.itemWidth = buttonSize;

    this.setDisplaySize(this.width, this.height);

    this.inputTypes = inputTypes;
    this.buildFactory.set(InputType.QUIT, this.createQuitButton.bind(this));
    this.buildFactory.set(InputType.SOUND, this.createSoundButton.bind(this));
    this.buildFactory.set(
      InputType.FULLSCREEN,
      this.createFullScreenButton.bind(this)
    );

    const icons = inputTypes
      .map((type) => this.buildFactory.get(type)())
      .map((obj: GameObjects.Image) =>
        obj.setDisplaySize(this.itemWidth, this.itemWidth)
      );

    this.add(icons);

    const buttons = new Buttons(this.scene, {
      width: this.width,
      height: this.height,
      orientation: 0,
      buttons: icons,
      align: "center",
      space: { item: 5 },
      anchor: this.anchor,
    });

    this.soundOn = !this.scene.sound.mute;

    buttons.on(
      "button.click",
      (
        button: Phaser.GameObjects.GameObject,
        groupName: any,
        index: any,
        pointer: any,
        event: any
      ) => {
        this.scene.sound.play("click");
        switch (button.state) {
          case InputType.QUIT:
            this.scene.scene.run("QuitDialogScene");
            break;
          case InputType.FULLSCREEN:
            if (this.scene.scale.isFullscreen) {
              this.scene.scale.stopFullscreen();
            } else {
              this.scene.scale.startFullscreen();
            }
            break;
          case InputType.SOUND:
            this.soundOn = !this.soundOn;
            this.scene.sound.setMute(!this.soundOn);
            this.refresh();
            break;
        }
      }
    );

    buttons.layout();
    this.scene.add.existing(buttons);
  }

  createQuitButton() {
    return this.scene.add
      .image(0, 0, "icons", "power-button.png")
      .setState(InputType.QUIT);
  }

  createSoundButton() {
    this.soundIcon = this.scene.add
      .sprite(
        0,
        0,
        "icons",
        this.scene.sound.mute ? "speaker-off.png" : "speaker.png"
      )
      .setState(InputType.SOUND);
    return this.soundIcon;
  }

  createFullScreenButton() {
    this.fullSCreen = this.scene.add
      .sprite(
        0,
        0,
        "icons",
        this.scene.scale.isFullscreen ? "contract.png" : "expand.png"
      )
      .setState(InputType.FULLSCREEN);
    return this.fullSCreen;
  }

  refresh() {
    this.soundIcon?.setTexture(
      "icons",
      !this.soundOn ? "speaker-off.png" : "speaker.png"
    );

    this.fullSCreen?.setTexture(
      "icons",
      this.scene.scale.isFullscreen ? "contract.png" : "expand.png"
    );
  }
}
