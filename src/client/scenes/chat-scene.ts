import "phaser";
import {
  Label,
  Sizer,
  TextArea,
} from "phaser3-rex-plugins/templates/ui/ui-components";
import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { MessageCodes } from "../../schema/MessageCodes";
import { NetworkEvents } from "../../schema/NetworkEvents";
import { ChatMessage } from "../../server/entities/ChatMessage";
import { TextInput } from "../objects/TextInput";
import { Theme } from "../theme/GameTheme";
import { SceneBase } from "./scene-base";

export class ChatScene extends SceneBase {
  private chatArea: TextArea;
  private chatInput: TextInput;
  private width: number;
  private height: number;
  private chatColors: string[];

  private open = false;
  private sizer: Sizer;
  private header: Label;

  constructor() {
    super({
      key: "ChatScene",
    });
    const color = new Phaser.Display.Color();
    this.chatColors = [...Array(4).keys()].map((_) =>
      this.toColorString(color.random(50))
    );
  }

  toColorString(color: Phaser.Display.Color) {
    return Phaser.Display.Color.RGBToString(color.red, color.green, color.blue);
  }

  preload() {
    this.width = this.gameWidth * 0.3;
    this.height = this.gameHeight * 0.8;
    this.scene.bringToTop();

    this.network.on(
      NetworkEvents.ROOM_STATE_CHANGED,
      (state: ICourtPieceState) => {
        state.chatMessages.onAdd = (msg, idx) => {
          if (msg.owner !== this.network.sessionId) this.sound.play("ping");
        };
      }
    );

    this.events.on("pause", () => {
      this.scene.get("ChatScene").scene.stop();
    });
  }

  create() {
    this.createChatArea();
    this.createChatInput();

    this.sizer = this.rexUI.add
      .sizer({
        x: this.gameWidth - this.width / 2,
        y: this.gameHeight - this.height * 0.1,
        orientation: 1,
        space: { item: 5 },
      })
      .setOrigin(0.5, 0.5);

    this.header = this.createChatHeader();
    this.sizer.add(this.header);
    this.sizer.layout();
  }

  createChatArea() {
    this.chatArea = this.rexUI.add
      .textArea({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height * 0.8,
        background: this.add.rectangle(
          100,
          100,
          200,
          200,
          Theme.Colors.CHAT_BACKGROUND
        ),
        text: this.rexUI.add.BBCodeText().setColor(0).setFontSize(15),
        slider: {
          track: this.add.rectangle(
            0,
            0,
            10,
            10,
            Theme.Colors.PROGRESS_BAR_TEXT
          ),
          thumb: this.add.rectangle(
            0,
            0,
            10,
            10,
            Theme.Colors.PROGRESS_BAR_TRACKING
          ),
        },
        space: {
          left: 5,
          top: 2,
          bottom: 10,
          right: 5,
        },
        clamplChildOY: true,
      })
      .layout()
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setVisible(false);

    this.input.setDraggable(this.chatArea);

    this.chatArea.on("drag", (pointer: any) => {
      this.sizer.x = pointer.x;
      this.sizer.y = pointer.y;
    });
  }

  createChatInput() {
    this.chatInput = this.add
      .textInput(
        0,
        0,
        this.width,
        this.height * 0.1,
        "",
        this.onSend.bind(this),
        [],
        () => {},
        Theme.TextStyles.INPUT_TEXT_CHAT
      )
      .setOrigin(0.5, 0.5)
      .setVisible(false);
    return this.chatInput;
  }

  toggle() {
    this.open = !this.open;
    if (!this.open) {
      this.closeChatBox();
    } else {
      this.openChatBox();
    }
  }

  closeChatBox() {
    this.sizer.removeAll();
    this.chatArea.setVisible(false);
    this.chatInput.setVisible(false);
    this.sizer.setPosition(this.chatInput.x, this.chatInput.y);
    this.sizer.add(this.header);
    this.sizer.layout();
  }

  openChatBox() {
    this.sizer.removeAll();
    this.chatArea.setVisible(true);
    this.chatInput.setVisible(true);
    this.sizer.add(this.header);
    this.sizer.add(this.chatArea);
    this.sizer.add(this.chatInput);
    this.sizer.y -= this.height / 2 - this.chatInput.height / 2;
    this.sizer.y = Math.min(this.gameHeight - this.height / 2, this.sizer.y);
    this.sizer.layout();
  }
  createChatHeader() {
    const header = this.rexUI.add.label({
      width: this.width,
      height: this.height * 0.1,
      orientation: 0,
      background: this.add.rectangle(0, 0, 10, 10, 0xeeeeee),
      text: this.add.text(0, 0, "Chat Room", {
        color: Theme.Colors.SHADOW_COLOR,
        padding: {
          x: 10,
        },
      }),
    });
    header.setInteractive().on("pointerdown", () => {
      this.toggle();
    });
    return header;
  }
  onSend(text: string) {
    if (text.length == 0) return;
    this.chatInput.clear();
    this.chatInput.focus();
    this.appendMessage(new ChatMessage(this.network.sessionId, text));
    this.network.send(MessageCodes.CHAT_MESSAGE, {
      msg: text,
    });
  }

  messageToString(message: ChatMessage) {
    const idx = this.network.gameState?.players.get(message.owner)?.index || 0;
    return `[b][color=${this.chatColors[idx]}][${message.owner}][/color][/b]\n${message.message}\n\n`;
  }

  appendMessage(message: ChatMessage) {
    const str = this.messageToString(message);
    this.chatArea.appendText(str).scrollToBottom();
  }

  setMessages(messages: ChatMessage[]) {
    const msgs: string[] = [];
    messages.forEach((message) => {
      msgs.push(this.messageToString(message));
    });
    this.chatArea.setText(msgs.join("")).scrollToBottom();
  }

  update() {
    const { chatMessages, players } = this.network.gameState;
    this.setMessages(
      chatMessages.map(
        (msg: any) => new ChatMessage(players.get(msg.owner).name, msg.message)
      )
    );
  }
}
