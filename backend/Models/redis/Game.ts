import { randomUUID } from "node:crypto";
import { redisClient } from "./redisClient";

import {
  type GameId,
  type PlayerId,
  type PlayerName,
  type EditableFields,
  EditableKeys,
  GameState,
} from "../../types";
import IGame from "../../Interfaces/IGame";

export default class GameModel implements IGame {
  static KEY_PREFIX = "game";
  static EXPIRATION_TIME = 3600;
  static EVENTS = {
    PLAYER_ADDED: "playerAdded",
    NEW_PLAYER: "newPlayer",
    WELCOME: "welcome",
    UPDATE: "update",
  };
  static editable: EditableKeys[] = ["wpm", "accuracy"];

  getGameKey = (gameId: GameId) => {
    return `${GameModel.KEY_PREFIX}:${gameId}`;
  };

  getGamePlayersKey = (gameId: GameId, playerId: PlayerId | null = null) => {
    return (
      `${GameModel.KEY_PREFIX}:${gameId}:players` +
      (playerId ? `:${playerId}` : "")
    );
  };

  get = async (gameId: GameId) => {
    // return await redisClient.hGetAll(this.getGameKey(gameId));
    const gameData: { [key: string]: string } = await redisClient.hGetAll(
      this.getGameKey(gameId),
    );
    return {
      state: gameData.state as GameState,
      winner: gameData.winner,
      amountPlayers: parseInt(gameData.amountPlayers, 10),
    };
  };

  getGamePlayers = async (gameId: GameId) => {
    const playerIDs = await redisClient.sMembers(
      this.getGamePlayersKey(gameId),
    );

    const players = playerIDs.map(async (id) => {
      const key = this.getGamePlayersKey(gameId, id);
      const playerName = await redisClient.hGet(key, "name");
      const accuracy = await redisClient.hGet(key, "accuracy");
      const wpm = await redisClient.hGet(key, "wpm");
      return {
        id,
        name: playerName,
        wpm,
        accuracy,
      };
    });

    return await Promise.all(players);
  };

  generatePlayerId = () => {
    return randomUUID();
  };

  create = async (amountPlayers: number) => {
    const gameId = randomUUID();
    const key = this.getGameKey(gameId);

    await redisClient.hSet(key, {
      state: "waiting",
      winner: "",
      amountPlayers: amountPlayers,
    });

    await redisClient.expire(key, GameModel.EXPIRATION_TIME);
    return { gameId: gameId };
  };

  update = async (
    gameID: GameId,
    playerId: PlayerId,
    updates: EditableFields,
  ) => {
    if (!gameID || !playerId) return false;
    const key = this.getGamePlayersKey(gameID, playerId);
    const playerData = await redisClient.hGetAll(key);

    GameModel.editable.forEach((key) => {
      if (updates[key]) {
        playerData[key] = updates[key]!.toString();
      }
    });

    await redisClient.hSet(key, playerData);
    return true;
  };

  addPlayer = async (
    gameId: GameId,
    playerName: PlayerName,
    playerID: PlayerId = this.generatePlayerId(),
  ) => {
    const key = this.getGamePlayersKey(gameId, playerID);
    const player = {
      id: playerID,
      name: playerName,
      wpm: "",
      accuracy: "",
    };

    await redisClient.hSet(key, player);
    await redisClient.sAdd(this.getGamePlayersKey(gameId), playerID);

    return player;
  };
}
