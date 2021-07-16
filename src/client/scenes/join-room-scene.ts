import { Toast } from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { NetworkEvents } from "../../schema/NetworkEvents";
import { InputControls, InputType } from "../objects/InputControls";
import { TextButton } from "../objects/TextButton";
import { TextInput } from "../objects/TextInput";
import { Theme } from "../theme/GameTheme";
import { isNotEmpty, noSpaces } from "../utilities/TextValidators";
import { SceneBase } from "./scene-base";

export class JoinRoomScene extends SceneBase {
  private roomId: string;
  private roomNameInput: TextInput;
  private errorToast: Toast;
  private inputControls: InputControls;

  constructor() {
    super({ key: "JoinRoomScene" });
    this.roomId = "room_id";
  }

  preload(): void {
    console.log("preload: join room");
  }

  create(): void {
    this.createTextInput();
    this.createJoinButton();
    this.createBackButton();
    this.createErrorToast();
    this.createControls();
  }

  configureEventCallbacks() {
    this.network.on(
      NetworkEvents.JOINED_ROOM,
      () => {
        this.scene.switch("WaitingForPlayersScene");
      },
      this
    );
    this.network.on(
      NetworkEvents.JOIN_ERROR,
      () => {
        this.onError(
          "Could Not Connect To The Room, Make Sure the ID is correct !"
        );
      },
      this
    );
    this.input.keyboard.on("keydown-ESC", this.onBackPressed.bind(this));
  }

  createControls() {
    this.inputControls = this.alignGrid.placeAtTopRight(
      this.add.controls(0, 75, 75, [InputType.SOUND])
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

  createTextInput() {
    const { x, y, width, height } = this.alignGrid.getBoundsFor(64, 36, 40, 5);
    this.roomNameInput = this.add.textInput(
      x,
      y,
      width,
      height,
      this.roomId,
      this.setRoomName.bind(this),
      [noSpaces, isNotEmpty],
      this.onError.bind(this),
      Theme.TextStyles.INPUT_TEXT
    );
  }

  createJoinButton() {
    let { x, y, width, height } = this.alignGrid.getBoundsFor(64, 45, 20, 5);
    this.add.textButton(
      x,
      y,
      width,
      height,
      "Join",
      this.onJoinRoom.bind(this),
      Theme.TextStyles.TEXT_BUTTON
    );
  }

  createBackButton() {
    let { x, y, width, height } = this.alignGrid.getBoundsFor(10, 65, 10, 5);
    this.add.textButton(
      x,
      y,
      width,
      height,
      "Back",
      this.onBackPressed.bind(this),
      Theme.TextStyles.TEXT_BUTTON
    );
  }

  setRoomName(text: string) {
    this.roomId = text;
  }

  onError(error: string) {
    console.log("error_ ", error);
    this.errorToast.showMessage(error);
    // @ts-ignore
    this.hideSpinner();
  }

  onJoinRoom() {
    console.log("onJoinRoom");
    this.roomNameInput.closeIfOpened();
    this.showSpinner();
    const playerName = this.registry.get("PlayerName") || undefined;
    this.network.joinById(this.roomId, {
      name: playerName,
    });
  }

  onBackPressed() {
    console.log("onBackPressed: JoinRoomScene");
    this.scene.switch("MenuScene");
  }

  update() {
    this.inputControls.refresh();
  }
}
