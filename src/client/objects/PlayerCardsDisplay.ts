import { GameObjects, Scene } from "phaser";
import { CardSuit, CardValue, ICard } from "../../schema/ICard";
import { Card } from "../../server/entities/Card";
import { Theme } from "../theme/GameTheme";
import { dCard } from "./dCard";

export class PlayerCardsDisplay extends GameObjects.Container {
  private numCards: number;
  private cardWidth: number;
  private cardHeight: number;
  private numCardsPerRow: number;
  private playerCards: ICard[] = [];
  private disabledCards: ICard[] = [];
  private cards: dCard[] = [];
  private MARGIN_X = 10;
  private MARGIN_Y = 10;
  private onCardClicked: (card: ICard) => void;
  private invalidCard = new Card(CardSuit.INVALID, CardValue.A);

  constructor(
    scene: Scene,
    x: number,
    y: number,
    cardWidth: number,
    cardHeight: number,
    playerCards: ICard[] = [],
    numCards: number = 13,
    numCardsPerRow: number = 7,
    onCardClicked?: (card: ICard) => void
  ) {
    super(scene);

    this.setPosition(x, y);
    this.cardWidth = cardWidth;
    this.cardHeight = cardHeight;
    this.numCards = numCards;
    this.numCardsPerRow = numCardsPerRow;
    this.playerCards = playerCards;
    this.onCardClicked = onCardClicked;

    this.initCards();
    this.refresh();
  }
  initCards() {
    console.log("display : init cards");
    const { scene, numCards, cardWidth, cardHeight, cards } = this;
    for (const idx of Array(numCards).keys()) {
      let card = new dCard(scene, 0, 0, cardWidth, cardHeight);
      cards.push(card);
      // card.setVisible(false);
      const position = this.getCardDisplayPosition(idx, numCards);
      card.setX(position.x);
      card.setY(position.y);
      this.add(card);
      if (this.onCardClicked) {
        //@ts-ignore
        const tap = this.scene.rexGestures.add.tap(card);
        tap.on("2tap", (tap: any, gameObject: any, lastPointer: any) => {
          this.onCardClicked(card.cardInfo);
        });
        card.setInteractive({ useHandCursor: true });
      }
    }
  }

  isDisabled(card: ICard) {
    return this.disabledCards.some((c) => c.suit == card.suit);
  }

  setCards(cardsInfo: ICard[]) {
    this.playerCards.length = 0;
    cardsInfo.forEach((card) => {
      this.playerCards.push(card);
    });
    this.playerCards.sort((c1, c2) => {
      return c1.suit * 13 + c1.value - (c2.suit * 13 + c2.value);
    });
    // console.log("length", this.playerCards.length);
    // console.log(this.playerCards.map(card=> `${card.suit}:${card.value}`).join(","));
  }

  setDisabledCards(cardsInfo: ICard[]) {
    this.disabledCards = cardsInfo;
  }

  refresh() {
    this.cards.forEach((card, _) => {
      card.removeTint();
      card.setVisible(false);
      card.setCard(this.invalidCard);
    });
    this.playerCards.forEach((pCard, idx) => {
      let position = this.getCardDisplayPosition(idx, this.playerCards.length);
      this.cards[idx].setVisible(true);
      this.cards[idx].setCard(pCard);
      this.scene.tweens.add({
        targets: this.cards[idx],
        x: position.x,
        y: position.y,
        duration: 200,
      });
      if (this.isDisabled(pCard)) {
        this.cards[idx].setTint(Theme.Colors.CARD_TINT);
      } else {
        this.cards[idx].removeTint();
      }
    });
  }

  getCardDisplayPosition(idx: number, numberCards: number) {
    let col = idx % this.numCardsPerRow;
    let row = Math.floor(idx / this.numCardsPerRow);

    let boxWidth = this.cardWidth + this.MARGIN_X;
    let boxHeight = this.cardHeight + this.MARGIN_Y;

    let del =
      Math.min(this.numCardsPerRow, numberCards - row * this.numCardsPerRow) *
      boxWidth;

    return {
      x: -del / 2 + col * boxWidth + boxWidth / 2,
      y: row * boxHeight + this.MARGIN_Y / 2,
    };
  }
}
