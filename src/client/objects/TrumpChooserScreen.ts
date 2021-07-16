import { GameObjects, Scene } from "phaser";
import { CardSuit, CardValue, ICard } from "../../schema/ICard";
import { Card } from "../../server/entities/Card";
import { Theme } from "../theme/GameTheme";
import { PlayerCardsDisplay } from "./PlayerCardsDisplay";

export class TrumpChooserScreen extends GameObjects.Container {
  private aces = [
    new Card(CardSuit.CLUBS, CardValue.A),
    new Card(CardSuit.DIAMONDS, CardValue.A),
    new Card(CardSuit.HEARTS, CardValue.A),
    new Card(CardSuit.SPADES, CardValue.A),
  ];

  private CARD_WIDTH: number = 100;
  private CARD_HEIGHT: number = (this.CARD_WIDTH * 7) / 5;
  private acesDisplay: PlayerCardsDisplay;
  private cardDisplay: PlayerCardsDisplay;
  private background: GameObjects.Graphics;
  private yourCardsText: GameObjects.Text;
  private chooseTrumpText: GameObjects.Text;
  private onTrumpCardSelected: (card: ICard) => void;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    onTrumpCardSelected: (card: ICard) => void
  ) {
    super(scene);

    this.setPosition(x, y);
    this.width = width;
    this.height = height;
    this.onTrumpCardSelected = onTrumpCardSelected;

    this.background = this.scene.add.graphics({ x: 0, y: 0 });
    this.background.fillStyle(Theme.Colors.BACKGROUND, 0.99);
    this.background.fillRoundedRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
      5
    );

    this.yourCardsText = this.scene.add.text(
      -200,
      75,
      "Your Cards :",
      Theme.TextStyles.LABEL_TEXT_LARGE
    );
    this.yourCardsText.setFixedSize(400, 100);

    //@ts-ignore
    this.cardDisplay = new PlayerCardsDisplay(
      scene,
      0,
      175,
      this.CARD_WIDTH * 0.75,
      this.CARD_HEIGHT * 0.75,
      [],
      13,
      7
    );

    this.chooseTrumpText = this.scene.add.text(
      -200,
      -225,
      "Please Choose the Trump Suit !",
      Theme.TextStyles.LABEL_TEXT_LARGE
    );

    this.chooseTrumpText.setFixedSize(400, 100);

    this.acesDisplay = this.scene.add.cardsDisplay(
      0,
      -100,
      this.CARD_WIDTH,
      this.CARD_HEIGHT,
      this.aces,
      4,
      4,
      onTrumpCardSelected
    );

    this.add(this.background);
    this.add(this.acesDisplay);
    this.add(this.cardDisplay);
    this.add(this.chooseTrumpText);
    this.add(this.yourCardsText);
  }

  setPlayerCards(cards: ICard[]) {
    this.cardDisplay.setCards(cards);
  }

  update() {
    this.acesDisplay.refresh();
    this.cardDisplay.refresh();
  }
}
