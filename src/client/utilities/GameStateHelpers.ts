import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { IPlayer } from "../../schema/IPlayer";

export class GameStateHelpers {
  static getPlayerWithIndex(gameState: ICourtPieceState, idx: number): IPlayer {
    return [...gameState.players.values()].find(
      (player) => player.index == idx
    );
  }
}
