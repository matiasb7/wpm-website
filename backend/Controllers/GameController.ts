import IGame from "../Interfaces/IGame";
import { Request, Response } from "express";
import { GameId, PlayerId, PlayerName } from "../types";
import { UserFriendlyError } from "../utils/error";

export default class GameController {
  gameModel: IGame;

  constructor({ gameModel }: { gameModel: IGame }) {
    this.gameModel = gameModel;
  }

  start = async (req: Request, res: Response) => {
    const { amountPlayers } = req.body;
    if (!amountPlayers) {
      res.status(400).send("Please provide amount of players.");
      return;
    }

    const players = Number(amountPlayers);
    if (
      players > this.gameModel.settings.maxPlayers ||
      players < this.gameModel.settings.minPlayers
    ) {
      res
        .status(400)
        .send("Please provide amount of players between 1 and 10.");
      return;
    }

    try {
      const { gameId, phrase } = await this.gameModel.create(amountPlayers);
      res.status(200).send(JSON.stringify({ gameId, phrase }));
    } catch (e) {
      res.status(500).send("error creating game");
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const game = await this.gameModel.get(id);
      res.status(200).send(JSON.stringify({ game }));
    } catch (e) {
      res.status(400).send("Game not found");
    }
  };

  getPlayers = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const players = await this.gameModel.getGamePlayers(id);
      res.status(200).send(JSON.stringify({ players }));
    } catch (e) {
      res.status(400).send("Game not found");
    }
  };

  join = async ({
    username,
    gameId,
    userId,
  }: {
    username: PlayerName;
    gameId: GameId;
    userId: PlayerId | undefined;
  }) => {
    if (!username && !gameId) throw new Error("Missing properties.");
    const gameData = await this.gameModel.joinGame(gameId, username, userId);
    if (!gameData) {
      throw new UserFriendlyError({
        message: "There was an issue adding the player to the game.",
      });
    }
    return gameData;
  };

  quit = async ({ userId, gameId }: { gameId: GameId; userId: PlayerId }) => {
    if (!userId && !gameId) throw new Error("Missing properties.");
    await this.gameModel.quitGame(gameId, userId);
    const players = await this.gameModel.getGamePlayers(gameId);
    return { players };
  };

  update = async (gameId: GameId, playerId: PlayerId, updates: {}) => {
    if (!gameId || !updates) {
      throw new Error("Missing update properties.");
    }
    return this.gameModel.update(gameId, playerId, updates);
  };
}
