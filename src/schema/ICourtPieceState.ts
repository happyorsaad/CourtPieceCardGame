import { ArraySchema, MapSchema } from "@colyseus/schema";
import { GamePlayState } from "./GamePlayState";
import { CardSuit, ICard } from "./ICard";
import { IChatMessage } from "./IChatMessage";
import { IPlayer } from "./IPlayer";

export interface ICourtPieceState {
  players: MapSchema<IPlayer>;
  currentPlayer: number;
  playState: GamePlayState;
  activeCards: MapSchema<ICard>;
  roundNumber: number;
  trumpSuit: CardSuit;
  roundSuit: CardSuit;
  trumpPlayerId: string;
  winnerPlayerId: string;
  chatMessages: ArraySchema<IChatMessage>;
  gameWins: MapSchema<number>;
  handWins: MapSchema<number>;
}
