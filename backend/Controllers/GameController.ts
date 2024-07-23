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
      res.status(400).send("name or amountPlayers missing");
    }
    try {
      const { gameId } = await this.gameModel.create(amountPlayers);
      res.status(200).send(JSON.stringify({ gameId }));
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

  update = async (gameId: GameId, playerId: PlayerId, updates: {}) => {
    if (!gameId || !playerId || !updates) {
      throw new Error("Missing update properties.");
    }

    return await this.gameModel.update(gameId, playerId, updates);
  };
}
