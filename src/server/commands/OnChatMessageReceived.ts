import { Command } from "@colyseus/command";
import { ChatMessage } from "../entities/ChatMessage";
import { CourtPieceState } from "../entities/CourtPieceState";

const MAX_CHAT_MESSAGES = 200;

export class OnChatMessageReceived extends Command<
  CourtPieceState,
  { sessionId: string; message: string }
> {
  validate({ sessionId } = this.payload) {
    return this.state.players.has(sessionId);
  }

  execute({ sessionId, message } = this.payload) {
    if (this.state.chatMessages.length > MAX_CHAT_MESSAGES) {
      this.state.chatMessages.shift();
    }
    this.state.chatMessages.push(new ChatMessage(sessionId, message));
  }
}
