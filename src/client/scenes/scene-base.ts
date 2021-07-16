import { App } from "@capacitor/app";
import { Scene } from "phaser";
import Spinner from "phaser3-rex-plugins/templates/spinner/spinner/Spinner";
import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { AlignGrid } from "../utilities/AlignGrid";

export class SceneBase extends Scene {
  private grid: AlignGrid;
  private spinner: Spinner;

  constructor(config: any) {
    super(config);
    App.addListener("backButton", () => {
      if (this.scene.isActive()) {
        this.onBackPressed();
      }
    });
  }

  private createAlignGrid() {
    return new AlignGrid({
      scene: this,
      cols: 128,
      rows: 72,
      height: this.game.renderer.height,
      width: this.game.renderer.width,
    });
  }

  private createSpinner(): Spinner {
    return this.alignGrid.placeAtBottomCenter(
      this.rSpinner.add
        .dots({
          width: 75,
          height: 75,
        })
        .setVisible(false)
        .setDepth(10)
        .setOrigin(0.5)
    );
  }

  public get alignGrid() {
    if (!this.grid) {
      this.grid = this.createAlignGrid();
    }
    return this.grid;
  }

  public get gameWidth(): number {
    return this.sys.game.config.width as number;
  }

  public get gameHeight(): number {
    return this.sys.game.config.height as number;
  }

  public get state(): ICourtPieceState {
    return this.network.gameState;
  }

  public get playerId(): string {
    return this.network?.sessionId;
  }

  protected setView(): void {
    this.cameras.main.centerOn(0, 0);
  }

  public get hasSession(): boolean {
    return (
      localStorage.getItem("roomId") != null &&
      localStorage.getItem("sessionId") != null
    );
  }

  public get lsRoomId(): string {
    return localStorage.getItem("roomId");
  }

  public get lsSessionId(): string {
    return localStorage.getItem("sessionId");
  }

  showSpinner() {
    this.spinner = this.spinner || this.createSpinner();
    this.spinner.setVisible(true);
  }

  hideSpinner() {
    this.spinner = this.spinner || this.createSpinner();
    this.spinner.setVisible(false);
  }

  onBackPressed() {
    console.log("onBackPressed", this.scene.key);
  }
}
