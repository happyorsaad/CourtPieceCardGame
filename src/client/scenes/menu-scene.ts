import { App } from "@capacitor/app";
import { GameObjects } from "phaser";
import { Toast } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { NetworkEvents } from "../../schema/NetworkEvents";
import { InputControls, InputType } from "../objects/InputControls";
import { Theme } from "../theme/GameTheme";
import { generateName } from "../utilities/RandomNameGenerator";
import { isNotEmpty, noSpaces } from "../utilities/TextValidators";
import { SceneBase } from "./scene-base";

export class MenuScene extends SceneBase {
  private playerName: string;
  private errorToast: Toast;
  private inputControls: InputControls;

  constructor() {
    super({ key: "MenuScene" });
  }

  preload(): void {
    this.setPlayerName(generateName(2));

    this.network.on(
      NetworkEvents.JOINED_ROOM,
      () => {
        this.hideSpinner();
        this.scene.switch("WaitingForPlayersScene");
      },
      this
    );

    this.network.on(
      NetworkEvents.JOIN_ERROR,
      () => {
        //@ts-ignore
        this.hideSpinner();
        this.onError("Could Not Connect To The Server !");
      },
      this
    );

    this.network.on(NetworkEvents.RECONNECT_ERROR, () => {
      console.log("Could Not Reconnect to Existing Session !");
    });

    if (this.hasSession) {
      this.network.reconnect(this.lsRoomId, this.lsSessionId);
    }
  }

  create(): void {
    this.createBanner();
    this.createNameLabel();
    this.createPlayerNameInput();
    this.createButtons();
    this.createErrorToast();
    this.createControls();
  }

  createBanner() {
    this.alignGrid.alignedText(
      this.add.text(0, 0, "Court Piece", Theme.TextStyles.BANNER_TEXT),
      64,
      30,
      100,
      30
    );
  }

  createNameLabel() {
    this.alignGrid.alignedText(
      this.add.text(
        0,
        0,
        "Welcome, Please Enter Your Name !",
        Theme.TextStyles.LABEL_TEXT_LARGE
      ),
      64,
      47.5,
      60,
      30
    );
  }

  createPlayerNameInput() {
    const { x, y, width, height } = this.alignGrid.getBoundsFor(64, 39, 45, 4);
    this.add.textInput(
      x,
      y,
      width,
      height,
      this.playerName,
      this.setPlayerName.bind(this),
      [noSpaces, isNotEmpty],
      this.onError.bind(this),
      Theme.TextStyles.INPUT_TEXT
    );
  }

  createControls() {
    this.inputControls = this.alignGrid.placeAtTopRight(
      this.add.controls(0, 0, 75, [InputType.SOUND])
    );
  }

  createButtons() {
    const { x, y, width, height } = this.alignGrid.getBoundsFor(
      64 + 17.5,
      57,
      35,
      5
    );
    const buttons = this.rexUI.add.buttons({
      x: x,
      y: y,
      width: width,
      height: height,
      orientation: 1,
      buttons: [
        this.createButton(
          width,
          height,
          "Random Match",
          this.onRandomMatch.bind(this)
        ),
        this.createButton(
          width,
          height,
          "Create Game",
          this.onCreateRoom.bind(this)
        ),
        this.createButton(
          width,
          height,
          "Join Game",
          this.onJoinRoom.bind(this)
        ),
      ],
      expand: false,
      click: {
        mode: "pointerup",
        clickInterval: 100,
      },
      space: {
        item: 10,
      },
    });
    buttons.layout();
  }

  private createButton(
    w: number,
    h: number,
    text: string,
    callback: Function
  ): GameObjects.Text {
    return this.add.textButton(
      0,
      0,
      w,
      h,
      text,
      callback,
      Theme.TextStyles.TEXT_BUTTON
    );
  }

  createErrorToast() {
    this.errorToast = this.rexUI.add
      .toast({
        background: this.add.rectangle(0, 0, 1, 1, Theme.Colors.RED),
        text: this.add.text(0, 0, "", Theme.TextStyles.ERROR_TEXT),
        space: {
          left: 10,
          right: 10,
          top: 5,
          bottom: 5,
        },
      })
      .setDisplayTime(2000);
    this.alignGrid.placeItemAt(64 + 7.5, 68, 15, 5, this.errorToast);
  }

  setPlayerName(text: string) {
    this.playerName = text;
    this.registry.set("PlayerName", this.playerName);
  }

  onError(error: string) {
    this.hideSpinner();
    console.log("error_ ", error);
    this.errorToast.showMessage(error);
  }

  onJoinRoom() {
    console.log("onJoinRoom");
    this.scene.switch("JoinRoomScene");
  }

  onCreateRoom() {
    console.log("onCreateRoom");
    this.showSpinner();
    this.network.create({
      name: this.playerName,
    });
  }

  onRandomMatch() {
    console.log("onRandomMatch");
    this.showSpinner();
    this.network.joinOrCreate({
      name: this.playerName,
    });
  }

  update() {
    this.inputControls.refresh();
  }

  onBackPressed() {
    console.log("onBackPressed: MenuScene");
    App.exitApp();
  }
}
