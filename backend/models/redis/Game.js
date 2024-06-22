import { randomUUID } from "node:crypto";
import { redisClient } from "./redisClient.js";

export default class GameModel {
  static KEY_PREFIX = "game";
  static EXPIRATION_TIME = 3600;
  static EVENTS = {
    PLAYER_ADDED: "playerAdded",
    NEW_PLAYER: "newPlayer",
    WELCOME: "welcome",
    UPDATE: "update",
  };
  static editables = ["wpm", "accuracy"];

  getGameKey = (gameId) => {
    return `${GameModel.KEY_PREFIX}:${gameId}`;
  };

  getGamePlayersKey = (gameId, playerId = null) => {
    return (
      `${GameModel.KEY_PREFIX}:${gameId}:players` +
      (playerId ? `:${playerId}` : "")
    );
  };

  get = async (gameId) => {
    return await redisClient.hGetAll(this.getGameKey(gameId));
  };

  getGamePlayers = async (gameId) => {
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

  create = async (amountPlayers) => {
    this.gameId = randomUUID();
    const key = this.getGameKey(this.gameId);

    await redisClient.hSet(key, {
      state: "waiting",
      winner: "",
      amountPlayers: amountPlayers,
    });

    await redisClient.expire(key, GameModel.EXPIRATION_TIME);
    return { gameId: this.gameId };
  };

  update = async (gameID, playerId, updates) => {
    if (!gameID || !playerId) return false;
    console.log("paso el update");
    const key = this.getGamePlayersKey(gameID, playerId);
    const playerData = await redisClient.hGetAll(key);

    console.log("playerData is: ", playerData);

    GameModel.editables.forEach((key) => {
      if (updates[key]) playerData[key] = updates[key];
    });

    console.log("update key is: ", key);

    await redisClient.hSet(key, playerData);

    console.log(await redisClient.hGetAll(key));
  };

  addPlayer = async (
    gameId,
    playerName,
    playerID = this.generatePlayerId(),
  ) => {
    this.playerID = playerID;
    const key = this.getGamePlayersKey(gameId, this.playerID);
    const player = {
      id: this.playerID,
      name: playerName,
      wpm: "",
      accuracy: "",
    };

    await redisClient.hSet(key, player);
    await redisClient.sAdd(this.getGamePlayersKey(gameId), this.playerID);

    return player;
  };
}
