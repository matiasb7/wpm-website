import { GameId, GameSocket, PlayerId, PlayerName } from "../types";
import { Server } from "socket.io";
import GameModel from "../Models/redis/Game";
import { SocketCustomError } from "../utils/error";
import GameController from "../Controllers/GameController";

type finishPayload = {
  wpm: string;
  timeStamp: string;
  accuracy: string;
  winnerId: string;
};

class SocketHandler {
  private io: Server;
  private socket: GameSocket;
  private gameController: GameController;

  constructor(io: Server, socket: GameSocket, gameController: GameController) {
    this.io = io;
    this.socket = socket;
    this.gameController = gameController;
  }

  finish = async ({ wpm, timeStamp, accuracy, winnerId }: finishPayload) => {
    if (!this.socket.gameID || !this.socket.playerID) return;
    try {
      const update = await this.gameController.update(
        this.socket.gameID,
        this.socket.playerID,
        {
          wpm,
          timeStamp,
          accuracy,
          winnerId,
        },
      );

      if (update) {
        this.socket.in(this.socket.gameID);
        this.io.to(this.socket.gameID).emit(GameModel.EVENTS.UPDATE, {
          type: "updatePlayer",
          player: {
            wpm,
            id: winnerId,
            accuracy,
          },
        });
      } else {
        this.socket.emit(GameModel.EVENTS.ERROR, {
          message: "Failed to update player",
        });
      }
    } catch (e) {
      const message =
        e instanceof SocketCustomError ? e.message : "Failed to update player";
      this.socket.emit(GameModel.EVENTS.ERROR, { message });
    }
  };

  join = async (username: PlayerName, gameId: GameId, userId: PlayerId) => {
    this.socket.join(gameId);
    try {
      const { player, players, game } = await this.gameController.join({
        username,
        gameId,
        userId,
      });
      this.socket.playerID = player?.id;
      this.socket.gameID = gameId;

      if (!userId) {
        this.socket.to(gameId).emit(GameModel.EVENTS.UPDATE, {
          type: "newPlayers",
          players,
        });
      }

      this.socket.emit(GameModel.EVENTS.WELCOME, {
        player,
        players,
        game,
      });
    } catch (e) {
      console.error(e);
      const message =
        e instanceof SocketCustomError
          ? e.message
          : "There was an error, please try again later. ";
      this.socket.emit(GameModel.EVENTS.ERROR, { message });
    }
  };
}

export default SocketHandler;
