import { randomUUID } from "node:crypto";
import { redisClient } from "./redisClient";
import {
  type GameId,
  type PlayerId,
  type PlayerName,
  type EditableFields,
  EditableKeys,
  GameState,
  GameEditableKeys,
  GameEditableFields,
} from "../../types";
import IGame from "../../Interfaces/IGame";
import { UserFriendlyError } from "../../utils/error";
import IPhrase, { languagesType } from "../../Interfaces/IPhrase";

export default class GameModel implements IGame {
  phraseModel: IPhrase;
  static KEY_PREFIX = "game";
  static EXPIRATION_TIME = 600; // in seconds
  static EVENTS = {
    PLAYER_ADDED: "playerAdded",
    NEW_PLAYER: "newPlayer",
    WELCOME: "welcome",
    UPDATE: "update",
    ERROR: "error",
    READY_TO_PLAY: "readyToPlay",
  };
  static editable: EditableKeys[] = ["wpm", "accuracy"];
  static gameEditable: GameEditableKeys[] = ["state"];
  settings = {
    maxPlayers: 10,
    minPlayers: 2,
  };

  constructor({ phraseModel }: { phraseModel: IPhrase }) {
    this.phraseModel = phraseModel;
  }

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
      phrase: gameData.phrase,
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

  create = async (amountPlayers: number, lang: languagesType = "en") => {
    const gameId = randomUUID();
    const key = this.getGameKey(gameId);

    const phrase = (await this.phraseModel.get({ lang })) || "";

    await redisClient.hSet(key, {
      state: "waiting",
      winner: "",
      amountPlayers: amountPlayers,
      phrase: phrase,
    });

    await redisClient.expire(key, GameModel.EXPIRATION_TIME);
    return { gameId: gameId, phrase };
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

  updateGame = async (gameId: GameId, updates: GameEditableFields) => {
    let data: Partial<GameEditableFields> = {};
    (Object.keys(updates) as GameEditableKeys[]).forEach((key) => {
      if (GameModel.gameEditable.includes(key)) {
        data[key] = updates[key]!.toString();
      }
    });

    if (Object.keys(data).length === 0) return false;

    const key = this.getGameKey(gameId);
    const game = this.get(gameId);
    if (!game) return false;

    await redisClient.hSet(key, {
      ...data,
    });

    return true;
  };

  addPlayer = async (
    gameId: GameId,
    playerName: PlayerName,
    playerID: PlayerId = this.generatePlayerId(),
  ) => {
    const singlePlayerKey = this.getGamePlayersKey(gameId, playerID);
    const playersKey = this.getGamePlayersKey(gameId);
    const player = {
      id: playerID,
      name: playerName,
      wpm: "",
      accuracy: "",
    };

    await redisClient
      .multi()
      .hSet(singlePlayerKey, player)
      .sAdd(playersKey, playerID)
      .expire(singlePlayerKey, GameModel.EXPIRATION_TIME)
      .expire(playersKey, GameModel.EXPIRATION_TIME)
      .exec();

    return player;
  };

  joinGame = async (
    gameId: GameId,
    playerName: PlayerName,
    playerID?: PlayerId | undefined,
  ) => {
    const game = await this.get(gameId);
    if (!game || game.state !== "waiting") {
      throw new UserFriendlyError({
        message: "Game was not found or it has already started!",
      });
    }

    const players = await this.getGamePlayers(gameId);

    let player = null;
    if (!playerID) {
      if (players.length >= game.amountPlayers) {
        throw new UserFriendlyError({
          message: "Game has reached max amount of players!",
        });
      }
      player = await this.addPlayer(gameId, playerName);
      players.push(player);
    } else {
      player = players.find((player) => player.id === playerID)!;
    }

    if (!player) return null;
    const shouldStartGame = Number(game.amountPlayers) === players.length;

    if (shouldStartGame) {
      await this.updateGame(gameId, { state: "playing" });
    }

    return { players, game, shouldStartGame, player };
  };

  quitGame = async (gameId: GameId, playerID: PlayerId) => {
    const playerKey = this.getGamePlayersKey(gameId, playerID);
    await redisClient.del(playerKey);

    const playersSetKey = this.getGamePlayersKey(gameId);
    await redisClient.sRem(playersSetKey, playerID);
    return true;
  };
}
