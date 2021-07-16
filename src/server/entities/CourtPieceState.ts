import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GamePlayState } from "../../schema/GamePlayState";
import { CardSuit } from "../../schema/ICard";
import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { TeamNames } from "../../schema/TeamNames";
import { Card } from "./Card";
import { ChatMessage } from "./ChatMessage";
import { Deck } from "./Deck";
import { Player } from "./Player";

export const DEFAULT_ROUNDS_PER_GAME = 13;

export class CourtPieceState extends Schema implements ICourtPieceState {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type("int8") currentPlayer = 0;
  @type({ map: "int8" }) handWins = new MapSchema<number>();
  @type("int16") playState: number = GamePlayState.WAITING;
  @type({ map: Card }) activeCards = new MapSchema<Card>();
  @type("int16") roundNumber: number = 0;
  @type("int8") trumpSuit: number = CardSuit.INVALID;
  @type("int8") roundSuit: number = CardSuit.INVALID;
  @type("string") trumpPlayerId: string;
  @type("string") winnerPlayerId: string;
  @type([ChatMessage]) chatMessages = new ArraySchema<ChatMessage>();
  @type({ map: "int8" }) gameWins = new MapSchema<number>();

  hasOwner: boolean = false;
  deck: Deck;
  playedCards: Card[];
  handsPlayed: number;
  roundsPerGame: number = DEFAULT_ROUNDS_PER_GAME;

  constructor(options?: any) {
    super();
    this.deck = new Deck();
    this.trumpSuit = CardSuit.INVALID;
    this.playedCards = [];
    this.roundsPerGame = options?.endOn7 ? 7 : DEFAULT_ROUNDS_PER_GAME;
    this.playState = GamePlayState.WAITING;
    this.initScores();
  }

  initScores() {
    Object.keys(TeamNames).forEach((name, _) => {
      this.gameWins.set(name, 0);
    });
    Object.keys(TeamNames).forEach((name, _) => {
      this.handWins.set(name, 0);
    });
  }

  createPlayer(sessionId: string, name: string, idx: number) {
    let player = new Player(sessionId, name, idx);
    this.players.set(sessionId, player);
  }

  removePlayer(id: string) {
    this.players.delete(id);
  }

  getPlayer(id: string): Player {
    return this.players.get(id);
  }

  resetScores() {
    Object.keys(TeamNames).forEach((name, _) => {
      this.handWins.set(name, 0);
    });
  }

  dispose() {}

  getTeamName(playerIdx: number): string {
    return playerIdx % 2 == 0 ? TeamNames.RED : TeamNames.BLUE;
  }

  getHandCountsOf(playerIdx: number) {
    return this.handWins.get(this.getTeamName(playerIdx));
  }
}
