import { Command } from "@colyseus/command";
import { CourtPieceState } from "../entities/CourtPieceState";
export class NewOwnerCommand extends Command<
  CourtPieceState,
  { lastOwnerId: string }
> {
  execute({ lastOwnerId } = this.payload) {
    if (this.state.players.get(lastOwnerId).isConnected)
      // owner returned
      return;

    let newOwner: string;
    this.state.players.forEach((player, id) => {
      if (player.isConnected) newOwner = id;
    });

    if (newOwner) {
      this.state.players.get(newOwner).isOwner = true;
      this.state.players.get(lastOwnerId).isOwner = false;
    } else {
      console.log("no new owner found, disconnecting all");
      this.room.disconnect();
    }
  }
}
