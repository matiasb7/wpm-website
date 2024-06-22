import GameModel from "../Models/redis/Game";
import IGame from "../Interfaces/IGame";
import { Request, Response } from "express";
import { GameId, GameSocket, PlayerName } from "../types";

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

  getSessionGame = async (id: GameId, socket: GameSocket) => {
    try {
      const game = await this.gameModel.get(id);
      const players = await this.gameModel.getGamePlayers(id);
      return { game, players };
    } catch (e) {
      socket.emit("error", { message: "Failed to update player" });
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

  update = async (socket: GameSocket, updates: {}) => {
    try {
      if (!socket.gameID || !socket.playerID) {
        socket.emit("error", { message: "Missing properties." });
        return;
      }

      await this.gameModel.update(socket.gameID, socket.playerID, updates);
      socket.in(socket.gameID);
    } catch (e) {
      socket.emit("error", { message: "Failed to update player" });
    }
  };

  addPlayerToGame = async (
    socket: GameSocket,
    username: PlayerName,
    gameId: GameId,
  ) => {
    try {
      const player = await this.gameModel.addPlayer(gameId, username);
      const players = await this.gameModel.getGamePlayers(gameId);
      const game = await this.gameModel.get(gameId);

      socket.to(gameId).emit(GameModel.EVENTS.UPDATE, {
        type: "newPlayers",
        players,
      });

      return { player, players, game };
    } catch (e) {
      socket.emit("error", { message: "Failed to add player" });
      return false;
    }
  };
}
