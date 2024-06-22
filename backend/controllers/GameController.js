import res from "express/lib/response.js";
import GameModel from "../models/redis/Game.js";

export default class GameController {
  constructor({ gameModel }) {
    this.gameModel = gameModel;
  }

  start = async (req, res) => {
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

  create = async (req, res) => {
    const gameId = await this.gameModel.create();
    res.status(200).send(JSON.stringify({ gameId }));
  };

  get = async (req, res) => {
    try {
      const { id } = req.params;
      const game = await this.gameModel.get(id);
      res.status(200).send(JSON.stringify({ game }));
    } catch (e) {
      res.status(400).send("game not found");
    }
  };

  getSessionGame = async (id) => {
    const game = await this.gameModel.get(id);
    const players = await this.gameModel.getGamePlayers(id);
    return { game, players };
  };

  getPlayers = async (req, res) => {
    const { id } = req.params;
    const players = await this.gameModel.getGamePlayers(id);

    res.status(200).send(JSON.stringify({ players }));
  };

  update = async (socket, updates) => {
    try {
      await this.gameModel.update(socket.gameID, socket.playerID, updates);
      socket.in(socket.gameID);
    } catch (e) {
      console.error(e);
      socket.emit("error", { message: "Failed to update player" });
    }
  };

  addPlayerToGame = async (socket, username, gameId) => {
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
      console.error(e);
      socket.emit("error", { message: "Failed to add player" });
    }
  };
}
