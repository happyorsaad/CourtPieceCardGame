import { GameObjects, Scene } from "phaser";
import { EMOJIS } from "../../schema/Emojis";
import { ThoughtBubble } from "./ThoughtBubble";

export class EmojiBubble extends GameObjects.Container {
  private thoughtBubble: ThoughtBubble;
  private emojiText: GameObjects.Text;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y);
    this.setDisplaySize(width, height);
    this.thoughtBubble = this.scene.add.bubble(x, y, width, height);
    this.emojiText = scene.add.text(100, 100, "hello").setOrigin(0.5, 0.5);
    this.add(this.thoughtBubble);
    this.add(this.emojiText);
  }

  setEmoji(emoji: EMOJIS) {
    this.emojiText.setText(emoji).updateText();
  }
}
