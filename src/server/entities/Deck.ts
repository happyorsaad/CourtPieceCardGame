import { CardSuit, CardValue } from "../../schema/ICard";
import { Card } from "./Card";

export class Deck {
  cards: Card[] = [];

  constructor() {
    this.fillFreshCards();
  }

  fillFreshCards() {
    this.cards.length = 0;
    [
      CardSuit.CLUBS,
      CardSuit.DIAMONDS,
      CardSuit.HEARTS,
      CardSuit.SPADES,
    ].forEach((suit, _) => {
      [
        CardValue.A,
        CardValue.K,
        CardValue.Q,
        CardValue.J,
        CardValue.C10,
        CardValue.C9,
        CardValue.C8,
        CardValue.C7,
        CardValue.C6,
        CardValue.C5,
        CardValue.C4,
        CardValue.C3,
        CardValue.C2,
      ].forEach((value: CardValue, _) => {
        //@ts-ignore
        this.cards.push(new Card(suit, value));
      });
    });
    this.shuffle(this.cards);
  }

  shuffle(cards: Card[]) {
    let currentIndex = cards.length;
    let randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex],
      ];
    }
  }

  draw(n: number): Card[] {
    n = Math.min(n, this.cards.length);
    return this.cards.splice(0, n);
  }
}
