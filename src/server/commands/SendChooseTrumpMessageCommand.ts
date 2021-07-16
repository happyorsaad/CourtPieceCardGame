import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { MessageCodes } from "../../schema/MessageCodes";
import { CourtPieceState } from "../entities/CourtPieceState";
import { CheckTrumpChosen } from "./CheckTrumpChosen";

const MAX_WAIT_TIME_FOR_TRUMP = 3 * 60 * 1000;
const TRUMP_CHOOSE_CARD_NUMBER = 5;

export class SendChooseTrumpMessageCommand extends Command<
  CourtPieceState,
  { sessionId: string }
> {
  execute({ sessionId } = this.payload) {
    this.state.playState = GamePlayState.CHOOSING_TRUMP;
    this.state.players
      .get(sessionId)
      .assignCards(this.state.deck.draw(TRUMP_CHOOSE_CARD_NUMBER));

    const client = this.room.clients.find(
      (client) => client.sessionId == sessionId
    );

    this.state.trumpPlayerId = sessionId;
    client.send(MessageCodes.CHOOSE_TRUMP, {});

    console.log("SendChooseTrumpMessageCommand");
    
    return [
      new CheckTrumpChosen().setPayload({ waitFor: MAX_WAIT_TIME_FOR_TRUMP }),
    ];
  }
}
