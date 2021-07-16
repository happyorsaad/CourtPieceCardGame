import { Avatars } from "../client/objects/Avatars";
import { dCard } from "../client/objects/dCard";
import { EmojiBubble } from "../client/objects/EmojiBubble";
import { InputControls, InputType } from "../client/objects/InputControls";
import { PlayedCards } from "../client/objects/PlayedCards";
import { PlayerCardsDisplay } from "../client/objects/PlayerCardsDisplay";
import { TextButton } from "../client/objects/TextButton";
import { TextInput } from "../client/objects/TextInput";
import { ThoughtBubble } from "../client/objects/ThoughtBubble";
import { TrumpChooserScreen } from "../client/objects/TrumpChooserScreen";
import { StringValidator } from "../client/utilities/TextValidators";
import { ICard } from "../schema/ICard";
//@ts-ignore
import InputTextPlugin from "phaser3-rex-plugins/plugins/inputtext-plugin.js";

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      textButton(
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        onClick: Function,
        style: any
      ): TextButton;

      textInput(
        x: number,
        y: number,
        width: number,
        height: number,
        initText: string,
        onEnter: Function,
        validators: StringValidator[],
        onError: Function,
        style: Phaser.Types.GameObjects.Text.TextStyle
      ): TextInput;

      controls(
        x: number,
        y: number,
        buttonSize: number,
        inputTypes: InputType[]
      ): InputControls;

      avatars(x: number, y: number, radius: number): Avatars;

      card(x: number, y: number, w: number, h: number, ICard: ICard): dCard;

      playedCards(
        x: number,
        y: number,
        width: number,
        height: number,
        mainPlayerIndex: number,
        cardWidth: number,
        cardHeight: number,
        numPlayers: number,
        playedCards: Map<number, ICard>
      ): PlayedCards;

      cardsDisplay(
        x: number,
        y: number,
        cardWidth: number,
        cardHeight: number,
        playerCards: ICard[],
        numCards: number,
        numCardsPerRow: number,
        onCardClicked?: (card: ICard) => void
      ): PlayerCardsDisplay;

      trumpChooser(
        x: number,
        y: number,
        width: number,
        height: number,
        onTrumpCardSelected: Function
      ): TrumpChooserScreen;

      bubble(
        x: number,
        y: number,
        width: number,
        height: number
      ): ThoughtBubble;

      rexInputText(
        x: number,
        y: number,
        width: number,
        height: number,
        config: any
      ): InputTextPlugin;

      emoji(x: number, y: number, width: number, height: number): EmojiBubble;
    }
  }
}
