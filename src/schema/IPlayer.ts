import { ArraySchema } from "@colyseus/schema";
import { ICard } from "./ICard";

export interface IPlayer {
  cards: ArraySchema<ICard>;
  id: string;
  name: string;
  index: number;
  isConnected: boolean;
  hasLeft: boolean;
  isOwner: boolean
}
