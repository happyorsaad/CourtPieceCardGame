
export enum CardSuit {
  INVALID = -1,
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
}

export enum CardValue {
  C2 = 0,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9,
  C10,
  J,
  Q,
  K,
  A,
}

export const SUIT_NAMES = [
  CardSuit.CLUBS,
  CardSuit.DIAMONDS,
  CardSuit.HEARTS,
  CardSuit.SPADES,
];

export interface ICard{
  value: CardValue;
  suit: CardSuit;
}
