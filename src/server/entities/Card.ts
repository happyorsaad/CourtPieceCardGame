import { Schema, type } from "@colyseus/schema";
import { CardSuit, CardValue, ICard } from "../../schema/ICard";
export class Card extends Schema implements ICard {
  @type("int8") suit: CardSuit;
  @type("int8") value: CardValue;

  constructor(suit: CardSuit, value: CardValue) {
    super();
    this.suit = suit;
    this.value = value;
  }

  equals(other: Card) {
    return this.suit == other.suit && this.value == other.value;
  }
}
