import { Schema, type } from "@colyseus/schema";
import { IChatMessage } from "../../schema/IChatMessage";

export class ChatMessage extends Schema implements IChatMessage {
  @type("string") owner: string;
  @type("string") message: string;

  constructor(owner: string, message: string) {
    super();
    this.owner = owner;
    this.message = message;
  }
}
