import { GameObjects, Scene } from "phaser";
import { Direction } from "../../schema/Direction";
import { IPlayer } from "../../schema/IPlayer";
import { AvatarState, PlayerAvatar } from "./PlayerAvatar";

const AVATAR_SIZE = 75;
export class Avatars extends GameObjects.Container {
  private avatars: Map<number, PlayerAvatar>;
  currentPlayer = 0;

  constructor(scene: Scene, x: number, y: number, radius: number) {
    super(scene, x, y);
    this.width = radius;
    this.height = radius;
    this.setupAvatars();
  }

  setupAvatars() {
    this.avatars = new Map();
    [Direction.DOWN, Direction.LEFT, Direction.UP, Direction.RIGHT].forEach(
      (dir, idx) => {
        //@ts-ignore
        const avatar = this.scene.add.playerAvatar(
          0,
          0,
          AVATAR_SIZE,
          AVATAR_SIZE,
          "3",
          dir
        );
        this.avatars.set(idx, avatar);
      }
    );

    const avatars = [...this.avatars.values()];
    Phaser.Utils.Array.RotateRight(avatars);
    this.add(avatars);

    const circle = new Phaser.Geom.Circle(0, 0, this.width);
    Phaser.Actions.PlaceOnCircle(avatars, circle);
  }

  setCurrentPlayer(idx: number, mainPlayerId: number) {
    this.avatars.forEach((avatar) => {
      avatar.setCurrentState(AvatarState.DOING_NOTHING);
    });
    this.currentPlayer = this.getRelativeIdx(idx, mainPlayerId);
    this.avatars
      .get(this.currentPlayer)
      .setCurrentState(AvatarState.CHOOSING_CARD);
  }

  setChoosingTrump(idx: number, mainPlayerId: number) {
    this.avatars.forEach((avatar) => {
      avatar.setCurrentState(AvatarState.DOING_NOTHING);
    });
    this.currentPlayer = this.getRelativeIdx(idx, mainPlayerId);
    this.avatars
      .get(this.currentPlayer)
      .setCurrentState(AvatarState.CHOOSING_TRUMP);
  }

  resetState() {
    this.avatars.forEach((avatar) => {
      avatar.setCurrentState(AvatarState.DOING_NOTHING);
    });
  }

  setPlayerInfo(playersInfo: Map<string, IPlayer>, mainPlayerId: number) {
    [...playersInfo.values()].forEach((playerInfo) => {
      const relativeIdx = this.getRelativeIdx(playerInfo.index, mainPlayerId);
      this.avatars.get(relativeIdx).setPlayerDetails(playerInfo);
    });
  }

  getRelativeIdx(idx: number, mainPLayerIdx: number) {
    return (idx - mainPLayerIdx + 4) % 4;
  }

  refresh() {
    this.avatars.forEach((avatar) => {
      avatar.refresh();
    });
  }
}
