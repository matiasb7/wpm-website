import {
  GameId,
  PlayerId,
  PlayerName,
  EditableFields,
  Game,
  Player,
} from "../types";

export default interface IGame {
  settings: { maxPlayers: number; minPlayers: number };
  getGameKey(gameId: GameId): string;
  getGamePlayersKey(gameId: GameId, playerId: PlayerId | null): string;
  get(gameId: GameId): Promise<Game>;
  getGamePlayers(gameId: GameId): Promise<Array<Player>>;
  generatePlayerId(): PlayerId;
  create(amountPlayers: number): Promise<{ gameId: GameId; phrase: string }>;
  joinGame(
    gameId: GameId,
    playerName: PlayerName,
    playerID?: PlayerId | undefined,
  ): Promise<{
    player: Player;
    players: Player[];
    game: Game;
    shouldStartGame: boolean;
  } | null>;
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
  quitGame(userId: PlayerId, gameId: GameId): Promise<boolean>;
}
