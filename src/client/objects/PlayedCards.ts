import { GameObjects, Math as PhaserMath, Scene } from "phaser";
import { ICard } from "../../schema/ICard";
import { TrumpIsChosenCommand } from "../../server/commands/TrumpIsChosenCommand";
import { dCard } from "./dCard";

export class PlayedCards extends GameObjects.Container {
  width: number;
  height: number;

  private playedCards: Map<number, ICard>;
  private numberPlayers: number;
  private cards: dCard[];
  private mainPLayerIdx = 0;
  private cardWidth = 0;
  private cartHeight = 0;
  private tmpVec: PhaserMath.Vector2;
  private ANIMATION_DELTA = 10;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    mainPlayerIndex: number,
    cardWidth: number,
    cardHeight: number,
    numPlayers: number = 4,
    playedCards: Map<number, ICard> = new Map<number, ICard>()
  ) {
    super(scene, x, y);

    this.width = width;
    this.height = height;

    this.cardWidth = cardWidth;
    this.cartHeight = cardHeight;

    this.playedCards = new Map();
    playedCards.forEach((card, idx) => {
      this.playedCards.set(idx, card);
    });

    this.numberPlayers = numPlayers;
    this.mainPLayerIdx = mainPlayerIndex;

    this.tmpVec = new PhaserMath.Vector2(0, 0);

    this.cards = [];

    for (const idx of Array(numPlayers).keys()) {
      let position = this.getCardPosition(idx);
      // @ts-ignore
      let card = this.scene.add
        .card(
          position.x,
          position.y,
          this.cardWidth,
          this.cartHeight,
          undefined
        )
        .setVisible(false)
        .setState(2);
      this.cards.push(card);
    }
    this.add(this.cards);
  }

  refresh() {
    this.playedCards.forEach((ICard: ICard, idx: number, _) => {
      let relativeIdx = this.getRelativeIdx(idx);
      const delta = this.getCardPosition(relativeIdx, this.ANIMATION_DELTA);
      const position = this.getCardPosition(relativeIdx);
      if (this.cards[relativeIdx].state == 0) {
        this.cards[relativeIdx].setPosition(delta.x, delta.y);
        this.scene.tweens.add({
          targets: this.cards[relativeIdx],
          x: position.x,
          y: position.y,
          duration: 150,
          onComplete: () => {
            this.cards[relativeIdx].setState(2);
          },
        });
      }
      this.cards[relativeIdx].setVisible(true);
      this.cards[relativeIdx].setCard(ICard);
    });
  }

  clear() {
    this.playedCards.clear();
    this.cards.forEach((card, _) => card.setVisible(false));
    this.refresh();
  }

  getDisplayAnimationDelta(idx: number) {
    if (idx == 0) {
      return {
        x: 0,
        y: this.ANIMATION_DELTA,
      };
    }

    if (idx == 1) {
      return {
        x: -this.ANIMATION_DELTA,
        y: 0,
      };
    }

    if (idx == 2) {
      return {
        x: 0,
        y: -this.ANIMATION_DELTA,
      };
    }

    if (idx == 3) {
      return {
        x: this.ANIMATION_DELTA,
        y: 0,
      };
    }
  }

  getCardPosition(idx: number, delta: number = 0) {
    let rotation = ((2 * Math.PI) / this.numberPlayers) * idx + Math.PI / 2;
    let radius = Math.min(this.width, this.height) / 4 + delta;

    this.tmpVec.set(radius, 0);
    this.tmpVec.rotate(rotation);

    return {
      x: this.tmpVec.x,
      y: this.tmpVec.y,
    };
  }

  setPlayedCard(index: number, card: ICard) {
    let relativeIdx = this.getRelativeIdx(index);
    this.cards[relativeIdx].setState(0);
    this.playedCards.set(index, card);
    this.cards[relativeIdx].setDepth(this.playedCards.size);
    this.scene.sound.play("card_place");
  }

  removePlayedCard(index: number) {
    let relativeIdx = this.getRelativeIdx(index);
    this.cards[relativeIdx].setVisible(false);
    this.playedCards.delete(index);
  }
  setPlayedCards(cards: Map<number, ICard>) {
    cards.forEach((card: ICard, idx: number) => {
      if (!this.cardEquals(card, this.playedCards.get(idx))) {
        this.setPlayedCard(idx, card);
      }
    });
    this.playedCards.forEach((card: ICard, idx: number) => {
      if (!this.cardEquals(card, cards.get(idx))) {
        this.removePlayedCard(idx);
      }
    });
  }

  getRelativeIdx(idx: number) {
    return (idx - this.mainPLayerIdx + this.numberPlayers) % this.numberPlayers;
  }
  cardEquals(c1: ICard, c2: ICard) {
    return c1 && c2 && c1.suit == c2.suit && c1.value == c2.value;
  }

  setMainPlayer(index: number) {
    this.mainPLayerIdx = index;
  }
}
