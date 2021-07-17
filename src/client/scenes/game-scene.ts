import { Game, GameObjects } from "phaser";
import { GamePlayState } from "../../schema/GamePlayState";
import { CardSuit, CardValue, ICard } from "../../schema/ICard";
import { ICourtPieceState } from "../../schema/ICourtPieceState";
import { IPlayer } from "../../schema/IPlayer";
import { MessageCodes } from "../../schema/MessageCodes";
import { NetworkEvents } from "../../schema/NetworkEvents";
import { TeamNames } from "../../schema/TeamNames";
import { Card } from "../../server/entities/Card";
import { Avatars } from "../objects/Avatars";
import { dCard } from "../objects/dCard";
import { InputControls, InputType } from "../objects/InputControls";
import { PlayedCards } from "../objects/PlayedCards";
import { PlayerCardsDisplay } from "../objects/PlayerCardsDisplay";
import { TrumpChooserScreen } from "../objects/TrumpChooserScreen";
import { Theme } from "../theme/GameTheme";
import { ChooseTrump } from "./game-scene-states/ChooseTrump";
import { GameOver } from "./game-scene-states/GameOver";
import { GameRunning } from "./game-scene-states/GameRunning";
import { IdentityState } from "./game-scene-states/Identity";
import { OtherChoosingTrump } from "./game-scene-states/OtherChoosingTrump";
import { PlayerDisconnected } from "./game-scene-states/PlayerDisconnected";
import { RoundOver } from "./game-scene-states/RoundOver";
import StateMachine from "./game-scene-states/StateManager";
import { SceneBase } from "./scene-base";

export class GameScene extends SceneBase {
  playerCards: ICard[] = [];
  playedCardsInfo: Map<number, ICard> = new Map();
  currentPlayer: number = 0;
  playerIndex: number = 0;

  trumpChooserScreen: TrumpChooserScreen;
  cardsDisplay: PlayerCardsDisplay;

  private CARD_HEIGHT = 90;
  private CARD_WIDTH = (this.CARD_HEIGHT * 5) / 7;
  private WORLD_WIDTH = 1280;
  private WORLD_HEIGHT = 720;
  private NUM_PLAYERS = 4;
  private NUM_CARDS = 13;
  private NUM_CARDS_PER_ROW = 7;
  private TABLE_X = 640;
  private TABLE_Y = 200;

  private inputControls: InputControls;

  playedCards: PlayedCards;
  FSM: StateMachine;
  statusText: GameObjects.Text;
  avatars: Avatars;
  currentTrump: dCard;
  dCurrentTeam: GameObjects.Sprite;
  handScoreBlue: GameObjects.Text;
  handScoreRed: GameObjects.Text;
  gameScoreBlue: GameObjects.Text;
  gameScoreRed: GameObjects.Text;
  TABLE_RADIUS: number;
  redBurst: GameObjects.Particles.ParticleEmitter;
  blueBurst: GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: "GameScene" });
  }

  configureFSM() {
    this.FSM = new StateMachine();
    this.FSM.addState(
      GamePlayState.CHOOSING_TRUMP,
      new ChooseTrump(GamePlayState.CHOOSING_TRUMP, this)
    )
      .addState(-1, new IdentityState(-1, this))
      .addState(
        GamePlayState.RUNNING,
        new GameRunning(GamePlayState.RUNNING, this)
      )
      .addState(
        GamePlayState.OTHER_CHOOSING_TRUMP,
        new OtherChoosingTrump(GamePlayState.OTHER_CHOOSING_TRUMP, this)
      )
      .addState(
        GamePlayState.PLAYER_DISCONNECTED,
        new PlayerDisconnected(GamePlayState.PLAYER_DISCONNECTED, this)
      )
      .addState(
        GamePlayState.ROUND_OVER,
        new RoundOver(GamePlayState.ROUND_OVER, this)
      )
      .addState(
        GamePlayState.GAME_OVER,
        new GameOver(GamePlayState.GAME_OVER, this)
      );

    this.FSM.setState(-1);
  }

  preload(): void {
    console.log("preload: gamescene");
    this.configureFSM();

    this.TABLE_X = this.gameWidth / 2;
    this.TABLE_Y = this.gameHeight * 0.35;
    this.TABLE_RADIUS = this.gameHeight * 0.2;

    this.network.on(NetworkEvents.LEFT_ROOM, () => {
      if (this.scene.isActive()) {
        this;
        this.scene.switch("ServerDisconnectedScene");
      }
    });

    this.network.on(
      NetworkEvents.ROOM_STATE_CHANGED,
      (state: ICourtPieceState) => {
        const { playState, players } = state;
        console.log("init: state changed game-scene");
        console.log(
          this.network.sessionId,
          players
            .get(this.network.sessionId)
            .cards.map((card) => `${card.suit}:${card.value}`)
            .join(",")
        );
      }
    );
  }

  init() {
    console.log("init: gamescene");
  }

  update() {
    console.log("update");
    this.inputControls.update();
    this.FSM.update(10);
  }

  create(): void {
    console.log("create: gamescene");
    this.avatars = this.add.avatars(
      this.TABLE_X,
      this.TABLE_Y,
      this.TABLE_RADIUS
    );
    this.trumpChooserScreen = this.add
      .trumpChooser(
        this.gameWidth / 2,
        this.gameHeight / 2,
        this.gameWidth,
        this.gameHeight,
        this.onTrumpCardSelected.bind(this)
      )
      .setVisible(false);

    this.inputControls = this.alignGrid.placeAtTopRight(
      this.add.controls(0, 0, 75, [InputType.SOUND, InputType.QUIT])
    );

    this.playedCards = this.add.playedCards(
      this.TABLE_X,
      this.TABLE_Y,
      this.gameWidth * 0.35,
      this.gameHeight * 0.35,
      this.playerIndex,
      this.CARD_WIDTH * 0.9,
      this.CARD_HEIGHT * 0.9,
      this.NUM_PLAYERS,
      this.playedCardsInfo
    );

    this.cardsDisplay = this.add.cardsDisplay(
      this.gameWidth / 2,
      this.gameHeight * 0.75,
      this.CARD_WIDTH,
      this.CARD_HEIGHT,
      this.playerCards,
      this.NUM_CARDS,
      this.NUM_CARDS_PER_ROW,
      this.onDisplayCardSelected.bind(this)
    );

    this.statusText = this.add
      .text(
        this.WORLD_WIDTH / 2,
        this.gameHeight * 0.8,
        "",
        Object.assign(Theme.TextStyles.LABEL_TEXT_LARGE, {
          wordWrap: {
            width: 300,
          },
        })
      )
      .setOrigin(0.5, 0.5);

    this.currentTrump = this.add.card(
      0,
      0,
      60,
      (60 * 7) / 5,
      new Card(CardSuit.INVALID, CardValue.A)
    );

    const sizer = this.rexUI.add.sizer({
      x: 100,
      y: 400,
      orientation: 1,
      space: { item: 15 },
      anchor: {
        left: "0%+20%",
        centerY: "center",
      },
    });

    const scoreW = 100;
    const scoreH = 35;

    this.dCurrentTeam = this.add
      .sprite(0, 0, "playing_cards", "cardBack_blue1.png")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(50, 50);

    this.handScoreBlue = this.add
      .text(0, 0, "0", Theme.TextStyles.SCORE_TEXT)
      .setBackgroundColor(Theme.Colors.BLUE_S)
      .setFixedSize(scoreW, scoreH);

    this.handScoreRed = this.add
      .text(0, 0, "0", Theme.TextStyles.SCORE_TEXT)
      .setBackgroundColor(Theme.Colors.RED_S)
      .setFixedSize(scoreW, scoreH);

    this.gameScoreBlue = this.add
      .text(0, 0, "0", Theme.TextStyles.SCORE_TEXT)
      .setBackgroundColor(Theme.Colors.BLUE_S)
      .setFixedSize(scoreW, scoreH);

    this.gameScoreRed = this.add
      .text(0, 0, "0", Theme.TextStyles.SCORE_TEXT)
      .setBackgroundColor(Theme.Colors.RED_S)
      .setFixedSize(scoreW, scoreH);

    sizer.add(
      this.add.text(0, 0, "Hands Won", Theme.TextStyles.LABEL_TEXT_LARGE)
    );
    sizer.add(this.handScoreBlue);
    sizer.add(this.handScoreRed);
    sizer.add(
      this.add.text(0, 0, "Games Won", Theme.TextStyles.LABEL_TEXT_LARGE)
    );
    sizer.add(this.gameScoreBlue);
    sizer.add(this.gameScoreRed);
    sizer.add(
      this.add.text(0, 0, "Trump Suit", Theme.TextStyles.LABEL_TEXT_LARGE)
    );
    sizer.add(this.currentTrump);
    sizer.add(
      this.add.text(0, 0, "Your Team", Theme.TextStyles.LABEL_TEXT_LARGE)
    );
    sizer.add(this.dCurrentTeam);
    sizer.layout();

    this.scene.run("ChatScene", {
      x: 800,
      y: -1,
      width: 200,
      height: 600,
    });

    this.FSM.setState(GamePlayState.RUNNING);

    this.redBurst = this.createEmitter("red_spark");
    this.blueBurst = this.createEmitter("blue_spark");
  }

  createEmitter(asset: string) : GameObjects.Particles.ParticleEmitter{
    return this.add.particles(asset).createEmitter({
      x: 400,
      y: 300,
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: "SCREEN",
      lifespan: 600,
      gravityY: 800,
    }).stop();
  }

  hideGamePlayObjects() {
    this.playedCards.setVisible(false);
    this.cardsDisplay.setVisible(false);
  }

  showGamePlayObjects() {
    this.playedCards.setVisible(true);
    this.cardsDisplay.setVisible(true);
  }

  get playState(): GamePlayState {
    return this.state.playState;
  }

  get myPlayer(): IPlayer {
    return this.state.players.get(this.playerId);
  }

  get myCards(): ICard[] {
    return this.network.gameState.players.get(this.network.sessionId).cards;
  }

  get myIndex(): number {
    return this.myPlayer.index;
  }

  get myTeam(): TeamNames {
    return this.myIndex % 2 == 0 ? TeamNames.RED : TeamNames.BLUE;
  }

  onBackPressed() {
    this.scene.run("QuitDialogScene");
  }

  // message events
  onDisplayCardSelected(card: ICard) {
    this.sound.play("click");
    console.log("dis[;ay selected played", card.suit, card.value);
    this.network.send(MessageCodes.PLAY_CARD, {
      card: card,
    });
  }

  onTrumpCardSelected(card: ICard) {
    this.sound.play("click");
    console.log("Trump Selected");
    this.network.send(MessageCodes.TRUMP_CHOSEN, {
      suit: card.suit,
    });
  }
}
