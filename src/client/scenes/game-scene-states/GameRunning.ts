import { GamePlayState } from "../../../schema/GamePlayState";
import { CardSuit, CardValue, ICard } from "../../../schema/ICard";
import { TeamNames } from "../../../schema/TeamNames";
import { Card } from "../../../server/entities/Card";
import { GameScene } from "../game-scene";
import { IState } from "./IState";

export class GameRunning implements IState {
  name: number;
  gameScene: GameScene;

  constructor(name: number, gameScene: GameScene) {
    this.name = name;
    this.gameScene = gameScene;
  }

  onEnter() {}

  onExit() {}

  onUpdate(dt: number) {
    const { playState, trumpPlayerId } = this.gameScene.state;
    const { FSM } = this.gameScene;

    if (this.shouldIChooseTrump(playState, trumpPlayerId)) {
      FSM.setState(GamePlayState.CHOOSING_TRUMP);
    } else if (this.otherPlayerChoosingTrump(playState, trumpPlayerId)) {
      FSM.setState(GamePlayState.OTHER_CHOOSING_TRUMP);
    } else if (this.hasSomeoneDisconnected()) {
      FSM.setState(GamePlayState.PLAYER_DISCONNECTED);
    } else if (playState == GamePlayState.ROUND_OVER) {
      FSM.setState(GamePlayState.ROUND_OVER);
    } else if (playState == GamePlayState.GAME_OVER) {
      FSM.setState(GamePlayState.GAME_OVER);
    }

    this.updatePlayerInfo();
    this.updatePlayerCards();
    this.updateScores();
    this.updatePlayedCards();
    this.updateCurrentTrump();
    this.updateCurrentTeam();
    this.updateAvatars();
  }

  updateAvatars() {
    const { avatars, state, myIndex } = this.gameScene;
    avatars.setCurrentPlayer(state.currentPlayer, myIndex);
    avatars.refresh();
  }

  updateCurrentTrump() {
    this.gameScene.currentTrump.setCard(
      new Card(this.gameScene.state.trumpSuit, CardValue.A)
    );
  }

  updateCurrentTeam() {
    const { myTeam, dCurrentTeam } = this.gameScene;
    dCurrentTeam.setTexture(
      "playing_cards",
      myTeam == TeamNames.RED ? "cardBack_red1.png" : "cardBack_blue1.png"
    );
  }

  hasSomeoneDisconnected() {
    const { state: gameState } = this.gameScene;
    return [...gameState.players.values()].some(
      (player) => !player.isConnected
    );
  }

  otherPlayerChoosingTrump(playState: GamePlayState, trumpPlayerId: string) {
    return (
      playState == GamePlayState.CHOOSING_TRUMP &&
      trumpPlayerId != this.gameScene.playerId
    );
  }
  shouldIChooseTrump(playState: GamePlayState, trumpPlayerId: string) {
    return (
      playState == GamePlayState.CHOOSING_TRUMP &&
      trumpPlayerId == this.gameScene.playerId
    );
  }

  updatePlayerInfo() {
    const { myIndex } = this.gameScene;
    const { players } = this.gameScene.state;
    this.gameScene.avatars.setPlayerInfo(players, myIndex);
  }

  updatePlayedCards() {
    const { myIndex, playedCards, playedCardsInfo } = this.gameScene;
    playedCards.setMainPlayer(myIndex);
    const { activeCards } = this.gameScene.state;
    playedCardsInfo.clear();
    activeCards.forEach((card: ICard, playerId: string) => {
      playedCardsInfo.set(this.getPlayerIndex(playerId), card);
    });
    playedCards.setPlayedCards(playedCardsInfo);
    playedCards.refresh();
  }

  updatePlayerCards() {
    const { myCards, cardsDisplay, myIndex } = this.gameScene;

    cardsDisplay.setCards(myCards);
    cardsDisplay.setDisabledCards(
      myCards.filter(
        (card) => !this.isOfCorrectSuit(card.suit, myIndex, myCards)
      )
    );
    cardsDisplay.refresh();
  }

  isOfCorrectSuit(
    cardSuite: number,
    myIndex: number,
    myCards: ICard[]
  ): boolean {
    const { roundSuit, trumpSuit, currentPlayer } = this.gameScene.state;
    if (currentPlayer !== myIndex) return true;
    if (roundSuit == CardSuit.INVALID || cardSuite == roundSuit) return true;
    return !myCards.some((playerCard) => playerCard.suit == roundSuit);
  }

  updateScores() {
    const { handScoreRed, handScoreBlue } = this.gameScene;
    const { gameScoreRed, gameScoreBlue } = this.gameScene;
    const { handWins, gameWins } = this.gameScene.state;
    handScoreRed.setText(handWins.get(TeamNames.RED).toString()).updateText();
    gameScoreRed.setText(gameWins.get(TeamNames.RED).toString()).updateText();
    handScoreBlue.setText(handWins.get(TeamNames.BLUE).toString()).updateText();
    gameScoreBlue.setText(gameWins.get(TeamNames.BLUE).toString()).updateText();
  }

  getPlayerIndex(playerId: string) {
    return this.gameScene.state.players.get(playerId).index;
  }
}
