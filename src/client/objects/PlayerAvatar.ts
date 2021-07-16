import { GameObjects, Scene } from "phaser";
import { Direction } from "../../schema/Direction";
import { EMOJIS } from "../../schema/Emojis";
import { IPlayer } from "../../schema/IPlayer";
import { Theme } from "../theme/GameTheme";
import { EmojiBubble } from "./EmojiBubble";
import { ThoughtBubble } from "./ThoughtBubble";

export enum AvatarState {
  DOING_NOTHING,
  CHOOSING_TRUMP,
  CHOOSING_CARD,
}
export class PlayerAvatar extends GameObjects.Container {
  private dir: number;
  private PADDING = 10;
  private BUBBLE_PADDING = 10;
  private avatarImage: GameObjects.Image;
  private playerName: GameObjects.Text;
  private emoji: GameObjects.Text;
  private bubble: ThoughtBubble;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    dir: Direction
  ) {
    super(scene, x, y);

    this.width = width;
    this.height = height;

    this.name = name;
    this.dir = dir;

    this.initName();
    this.initAvatarImage();
    this.initThoughtBubble();
  }

  preUpdate() {}
  initName() {
    let position = { x: 0, y: 0 };
    switch (this.dir) {
      case Direction.UP:
        position.y = -this.height * 0.6;
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
      case Direction.DOWN:
        position.y = this.height * 0.6;
        break;
    }

    this.playerName = this.scene.add
      .text(position.x, position.y, this.name, Theme.TextStyles.LABEL_TEXT_SMALL)
      .setOrigin(0.5, 0.5);
    this.add(this.playerName);
  }

  initAvatarImage() {
    this.avatarImage = this.scene.add
      .image(0, 0, "avatars", "a_up.gif")
      .setDisplaySize(
        this.width - 2 * this.PADDING,
        this.height - 2 * this.PADDING
      );
    this.add(this.avatarImage);
  }

  initThoughtBubble() {
    let position = { x: 0, y: 0 };
    let bubbleWidth = this.width * 0.75;
    let bubbleHeight = bubbleWidth;

    switch (this.dir) {
      case Direction.UP:
      case Direction.DOWN:
      case Direction.RIGHT:
      case Direction.LEFT:
        position.x = bubbleWidth * 0.25;
        position.y = -this.height / 2 - bubbleHeight + this.BUBBLE_PADDING;
        break;
    }

    this.bubble = this.scene.add.bubble(
      position.x,
      position.y,
      bubbleWidth,
      bubbleHeight
    );

    this.emoji = this.scene.add
      .text(
        position.x + bubbleWidth / 2,
        position.y + bubbleHeight / 2 + this.BUBBLE_PADDING / 2,
        EMOJIS.THINKING,
        {
          align: "center",
          fontSize: "30px",
          color: "0xffffff",
        }
      )
      .setOrigin(0.5, 0.5)
      .setDisplaySize(bubbleWidth * 0.6, bubbleHeight * 0.6);

    this.add(this.bubble);
    this.add(this.emoji);
  }

  setPlayerDetails(IPlayer: IPlayer) {
    this.playerName.setText(IPlayer.name);
    this.playerName.updateText();
    const prefix = ["a", "b", "e", "d"];
    const suffix = this.getDirectionString();
    this.avatarImage.setTexture(
      "avatars",
      `${prefix[IPlayer.index]}_${suffix}.gif`
    );
    if (this.dir == Direction.RIGHT) {
      this.avatarImage.setFlipX(true);
    }
    this.avatarImage.update();
  }

  getDirectionString() {
    switch (this.dir) {
      case Direction.UP:
        return "up";
      case Direction.DOWN:
        return "down";
      case Direction.LEFT:
      case Direction.RIGHT:
        return "left";
    }
  }

  setCurrentState(state: AvatarState) {
    this.setState(state);
  }

  showBubble(emoji: EMOJIS) {
    this.emoji.setText(emoji).updateText();
    this.emoji.setVisible(true);
    this.bubble.setVisible(true);
  }

  hideBubble() {
    this.emoji.setVisible(false);
    this.bubble.setVisible(false);
  }

  refresh() {
    switch (this.state) {
      case AvatarState.CHOOSING_CARD:
        if (this.avatarImage.postPipelines.length == 0) {
          this.scene.outline.add(this.avatarImage, {
            thickness: 3,
          });
        }
        break;
      case AvatarState.CHOOSING_TRUMP:
        this.showBubble(EMOJIS.THINKING);
        break;
      case AvatarState.DOING_NOTHING:
        this.hideBubble();
        this.scene.outline.remove(this.avatarImage);
        break;
    }
  }
}
