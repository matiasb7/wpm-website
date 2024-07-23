import {
  GameId,
  PlayerId,
  PlayerName,
  EditableFields,
  Game,
  Player,
} from "../types";

export default interface IGame {
  getGameKey(gameId: GameId): string;
  getGamePlayersKey(gameId: GameId, playerId: PlayerId | null): string;
  get(gameId: GameId): Promise<Game>;
  getGamePlayers(gameId: GameId): Promise<Array<Player>>;
  generatePlayerId(): PlayerId;
  create(amountPlayers: number): Promise<{ gameId: GameId }>;
  joinGame(
    gameId: GameId,
    playerName: PlayerName,
    playerID?: PlayerId | undefined,
  ): Promise<{ player: Player; players: Player[]; game: Game } | null>;
  update(
    gameId: GameId,
    playerId: PlayerId,
    updates: EditableFields,
  ): Promise<boolean>;
  addPlayer(
    gameId: GameId,
    playerName: PlayerName,
    playerId?: PlayerId,
  ): Promise<Player>;
}
