import { Direction } from "../schema/Direction";
import { ICard } from "../schema/ICard";
import { GameConfig } from "./config";
import { Avatars } from "./objects/Avatars";
import { dCard } from "./objects/dCard";
import { EmojiBubble } from "./objects/EmojiBubble";
import { InputControls, InputType } from "./objects/InputControls";
import { PlayedCards } from "./objects/PlayedCards";
import { PlayerAvatar } from "./objects/PlayerAvatar";
import { PlayerCardsDisplay } from "./objects/PlayerCardsDisplay";
import { TextButton } from "./objects/TextButton";
import { OnTextInput, OnValidationError, TextInput } from "./objects/TextInput";
import { ThoughtBubble } from "./objects/ThoughtBubble";
import { TrumpChooserScreen } from "./objects/TrumpChooserScreen";
import { StringValidator } from "./utilities/TextValidators";

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener("load", () => {
  const game = new Game(GameConfig);
  Phaser.GameObjects.GameObjectFactory.register(
    "card",
    function (x: number, y: number, w: number, h: number, card: ICard = null) {
      let c = new dCard(this.scene, x, y, w, h, card);
      this.scene.add.existing(c);
      return c;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "playedCards",
    function (
      x: number,
      y: number,
      width: number,
      height: number,
      mainPlayerIndex: number,
      cardWidth: number,
      cardHeight: number,
      numPlayers: number = 4,
      playedCards: Map<number, ICard> = new Map<number, ICard>()
    ) {
      let played = new PlayedCards(
        this.scene,
        x,
        y,
        width,
        height,
        mainPlayerIndex,
        cardWidth,
        cardHeight,
        numPlayers,
        playedCards
      );

      this.scene.add.existing(played);
      return played;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "cardsDisplay",
    function (
      x: number,
      y: number,
      cardWidth: number,
      cardHeight: number,
      playerCards: ICard[] = [],
      numCards: number = 13,
      numCardsPerRow: number = 7,
      onCardClicked?: (card: ICard) => void
    ) {
      let pc = new PlayerCardsDisplay(
        this.scene,
        x,
        y,
        cardWidth,
        cardHeight,
        playerCards,
        numCards,
        numCardsPerRow,
        onCardClicked
      );
      this.scene.add.existing(pc);
      return pc;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "playerAvatar",
    function (
      x: number,
      y: number,
      width: number,
      height: number,
      name: string,
      dir: Direction
    ) {
      let avatar = new PlayerAvatar(this.scene, x, y, width, height, name, dir);
      this.scene.add.existing(avatar);
      return avatar;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "textInput",
    function (
      x: number,
      y: number,
      w: number,
      h: number,
      initText: string,
      onTextInput: OnTextInput,
      validators: StringValidator[],
      onValidationError: OnValidationError,
      style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
      let textInput = new TextInput(
        this.scene,
        x,
        y,
        w,
        h,
        initText,
        onTextInput,
        validators,
        onValidationError,
        style
      );
      this.scene.add.existing(textInput);
      return textInput;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "textButton",
    function (
      x: number,
      y: number,
      width: number,
      height: number,
      text: string,
      onClick: any,
      style: Phaser.Types.GameObjects.Text.TextStyle
    ) {
      let textButton = new TextButton(
        this.scene,
        x,
        y,
        width,
        height,
        text,
        onClick,
        style
      );
      this.scene.add.existing(textButton);
      return textButton;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "avatars",
    function (x: number, y: number, radius: number) {
      let avatars = new Avatars(this.scene, x, y, radius);
      this.scene.add.existing(avatars);
      return avatars;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "controls",
    function (
      x: number,
      y: number,
      buttonSize: number,
      inputTypes: InputType[]
    ) {
      let controls = new InputControls(
        this.scene,
        x,
        y,
        buttonSize,
        inputTypes
      );
      this.scene.add.existing(controls);
      return controls;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "trumpChooser",
    function (
      x: number,
      y: number,
      width: number,
      height: number,
      onTrumpCardSelected: (card: ICard) => void
    ) {
      let chooser = new TrumpChooserScreen(
        this.scene,
        x,
        y,
        width,
        height,
        onTrumpCardSelected
      );
      this.scene.add.existing(chooser);
      return chooser;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "bubble",
    function (x: number, y: number, width: number, height: number) {
      let bubble = new ThoughtBubble(this.scene, x, y, width, height);
      this.scene.add.existing(bubble);
      return bubble;
    }
  );

  Phaser.GameObjects.GameObjectFactory.register(
    "emoji",
    function (x: number, y: number, width: number, height: number) {
      let bubble = new EmojiBubble(this.scene, x, y, width, height);
      this.scene.add.existing(bubble);
      return bubble;
    }
  );
});
