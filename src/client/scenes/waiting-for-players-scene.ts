import { GameObjects } from "phaser";
import { GamePlayState } from "../../schema/GamePlayState";
import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { IPlayer } from "../../schema/IPlayer";
import { NetworkEvents } from "../../schema/NetworkEvents";
import { InputType } from "../objects/InputControls";
import { Theme } from "../theme/GameTheme";
import { SceneBase } from "./scene-base";

export class WaitingForPlayersScene extends SceneBase {
  private waitingText: GameObjects.Text;
  private connectedTexts: GameObjects.Text[];

  constructor() {
    super({ key: "WaitingForPlayersScene" });
    this.connectedTexts = [];
  }

  preload() {
    this.network.on(NetworkEvents.LEFT_ROOM, () => {
      if (this.scene.isActive()) this.scene.switch("ServerDisconnectedScene");
    });

    this.network.on(
      NetworkEvents.ROOM_STATE_CHANGED,
      (state: ICourtPieceState) => {
        if (!this.scene.isActive()) return;
        const { playState, players } = state;
        if (
          playState == GamePlayState.RUNNING ||
          playState == GamePlayState.CHOOSING_TRUMP
        ) {
          this.scene.start("GameScene");
        }

        state.players.forEach((player: IPlayer, sessionId: string) => {
          this.connectedTexts[player.index].setVisible(true);
          this.connectedTexts[player.index].setText(`"${player.name}" joined`);
        });
      }
    );

    this.events.on("pause", function () {
      console.log("game-scene paused");
    });

    this.events.on("resume", function () {
      console.log("game-scene resumed");
    });

    this.events.on("shutdown", function () {
      console.log("game-scene shutdown");
    });

    this.events.on("wake", function () {
      console.log("game-scene wake");
    });
  }

  create() {
    console.log("init: waitingh for pl;ayer");
    this.waitingText = this.alignGrid.alignedText(
      this.add.text(
        0,
        0,
        "Waiting For Other Players To Join !",
        Theme.TextStyles.LABEL_TEXT_LARGE
      ),
      64,
      35,
      50,
      5
    );

    this.connectedTexts = [...Array(4).keys()].map((idx) =>
      this.alignGrid.alignedText(
        this.add.text(0, 0, "", Theme.TextStyles.LABEL_TEXT_LARGE),
        64,
        45 + idx * 5,
        50,
        5
      )
    );

    this.alignGrid.alignedText(
      this.add.text(0, 0, `Room Id: ${this.network.roomId}`, {
        align: "center",
        fontSize: "50px",
        shadow: {
          offsetX: 2,
          fill: true,
        },
      }),
      64,
      20,
      100,
      5
    );

    this.alignGrid.placeAtTopRight(
      this.add.controls(0, 0, 75, [InputType.SOUND, InputType.QUIT])
    );
  }

  onBackPressed() {
    this.scene.run("QuitDialogScene");
  }
}
