import { Command } from "@colyseus/command";
import { GamePlayState } from "../../schema/GamePlayState";
import { CardSuit } from "../../schema/ICard";
import { Card } from "../entities/Card";
import { CourtPieceState } from "../entities/CourtPieceState";
import { Player } from "../entities/Player";
import { StartNewRound } from "./StartNewRound";

export class PlayCardCommand extends Command<
  CourtPieceState,
  { sessionId: string; card: Card }
> {
  validate({ sessionId, card } = this.payload) {
    return (
      this.state.playState == GamePlayState.RUNNING &&
      this.state.players.get(sessionId).ownsCard(card) &&
      !this.hasBeenPlayed(card) &&
      this.isCurrentPlayer(sessionId) &&
      this.isOfCorrectSuit(card.suit, this.state.players.get(sessionId))
    );
  }

  execute({ sessionId, card } = this.payload) {
    console.log("PlayCardCommand execute");
    this.state.players.get(sessionId).removeCard(card);
    if (this.state.activeCards.size == 0) {
      this.state.roundSuit = card.suit;
    }

    this.state.activeCards.set(sessionId, new Card(card.suit, card.value));

    if (this.state.activeCards.size == this.room.maxClients) {
      // round over
      const winningPlayer = this.findWinningPlayer();
      this.addWinHandsCount(winningPlayer.index);
      this.state.handsPlayed += 1;
      this.state.winnerPlayerId = winningPlayer.id;
      return [
        new StartNewRound().setPayload({
          lastRoundWinner: winningPlayer,
        }),
      ];
    }

    this.state.currentPlayer =
      (this.state.currentPlayer + 1) % this.room.maxClients;
  }

  addWinHandsCount(winnerIdx: number) {
    const teamName = this.state.getTeamName(winnerIdx);
    this.state.handWins.set(
      teamName,
      (this.state.handWins.get(teamName) || 0) + 1
    );
  }

  findWinningPlayer(): Player {
    const cards = Array.from(this.state.activeCards.values()).filter(
      (card: Card) => {
        return this.isTrump(card) || card.suit == this.state.roundSuit;
      }
    );

    cards.sort((a, b) => {
      if (this.isTrump(a) && this.isTrump(b)) {
        return b.value - a.value;
      }

      if (this.isTrump(a)) {
        return -1;
      }

      if (this.isTrump(b)) {
        return 1;
      }

      return b.value - a.value;
    });

    return this.state.players.get(
      this.getKey(this.state.activeCards, cards[0])
    );
  }

  getKey(map: Map<string, Card>, val: Card) {
    return [...map].find(([key, value]) => val.equals(value))[0];
  }

  isTrump(card: Card): boolean {
    return card.suit == this.state.trumpSuit;
  }

  hasBeenPlayed(card: Card): boolean {
    return this.state.playedCards.some((cardInfo) => {
      return cardInfo.equals(card);
    });
  }

  isOfCorrectSuit(cardSuite: number, player: Player) {
    if (
      this.state.roundSuit == CardSuit.INVALID ||
      cardSuite == this.state.roundSuit
    )
      return true;
    return !player.cards.some(
      (playerCard) => playerCard.suit == this.state.roundSuit
    );
  }

  isCurrentPlayer(sessionId: string) {
    return this.state.players.get(sessionId).index == this.state.currentPlayer;
  }
}
