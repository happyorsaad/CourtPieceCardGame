import { GameObjects, Scene } from "phaser";
import { CardSuit, CardValue, ICard } from "../../schema/ICard";
import { Card } from "../../server/entities/Card";
import { Theme } from "../theme/GameTheme";

const SHADOW_WIDTH: number = 3;

export class dCard extends GameObjects.Container {
  width: number;
  height: number;
  cardInfo: ICard;

  private cardSprite: GameObjects.Sprite;
  private shadowRect: GameObjects.Graphics;
  
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    card: ICard = null
  ) {
    super(scene, x, y);
    this.width = width;
    this.height = height;
    this.setPosition(x, y);
    this.initShadow();
    this.initSprite();
    this.setCard(card);
  }

  private initShadow() {
    const { width, height } = this;
    this.shadowRect = this.scene.add.graphics({ x: 0, y: 0 });
    this.shadowRect.fillStyle(Theme.Colors.SHADOW_COLOR, 0.5);
    this.shadowRect.fillRoundedRect(
      -width / 2 + SHADOW_WIDTH,
      -height / 2 + SHADOW_WIDTH,
      width,
      height,
      5
    );
    this.add(this.shadowRect);
  }

  private initSprite() {
    this.cardSprite = this.scene.add
      .sprite(0, 0, "playing_cards", "cardBack_blue1.png")
      .setAngle(90)
      .setFlipY(true)
      .setDisplaySize(this.height, this.width);
    this.add(this.cardSprite);
  }

  setCard(cardInfo: ICard) {
    if (!cardInfo) return;
    this.cardInfo = cardInfo;
    this.cardSprite.setTexture(
      "playing_cards",
      this.getCardImageName(cardInfo)
    );
    this.cardSprite.update();
  }

  setTint(color: number){
    this.cardSprite.setTint(color);
  }

  removeTint(){
    this.cardSprite.clearTint();
  }

  private getCardImageName(card: ICard): string {
    if (this.cardInfo.suit == CardSuit.INVALID) return "cardBack_blue2.png";
    let suite_names: string[] = ["Clubs", "Diamonds", "Hearts", "Spades"];
    let value_names: string[] = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
      "A",
    ];
    return `card${suite_names[card.suit]}${value_names[card.value]}.png`;
  }
}
