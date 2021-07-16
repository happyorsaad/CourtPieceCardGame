import { ArraySchema, filter, Schema, type } from "@colyseus/schema";
import { Client } from "colyseus";
import { IPlayer } from "../../schema/IPlayer";
import { Card } from "./Card";

//0:7,1:2,1:7,1:11,1:12,2:3,2:6,2:12,3:2,3:3,3:5,3:10,3:12
//0:7,1:2,1:11,1:12,2:3,2:6,2:12,3:2,3:3,3:5,3:10,3:12

export class Player extends Schema implements IPlayer {
  @filter(function (
    this: Player,
    client: Client,
    value: Player["cards"],
    root: Schema
  ) {
    return client.sessionId === this.id;
  })
  @type([Card])
  cards = new ArraySchema<Card>();

  id: string = "";

  @type("string")
  name: string = "";

  @type("int8")
  index: number;

  @type("boolean")
  isConnected: boolean;

  @type("boolean")
  hasLeft: boolean;

  isOwner: boolean = false;

  constructor(id: string, name: string, idx: number) {
    super();
    this.id = id;
    this.name = name || id;
    this.index = idx;
    this.isConnected = true;
    this.hasLeft = false;
  }

  assignCards(cards: Card[] = []) {
    cards.forEach((card, _) => {
      this.cards.push(card);
    });
  }

  removeCard(card: Card) {
    const index = this.cards.findIndex((item) => item.equals(card));
    this.cards.splice(index, 1);
  }

  refresh() {
    this.cards.splice(0, this.cards.length);
  }
  
  ownsCard(cardInfo: Card): boolean {
    return this.cards.find((card) => card.equals(cardInfo)) !== undefined;
  }
}
