import { Game, GameId, GameSocket, PlayerId, PlayerName } from "../types";
import { Server } from "socket.io";
import GameModel from "../Models/redis/Game";
import {
  ERROR_MESSAGES,
  SocketCustomError,
  UserFriendlyError,
} from "../utils/error";
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
    if (!this.socket.gameID || !this.socket.playerID) {
      this.socket.emit(GameModel.EVENTS.ERROR, {
        message: ERROR_MESSAGES.general,
      });
      return;
    }
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
        e instanceof UserFriendlyError ? e.message : "Failed to update player";
      this.socket.emit(GameModel.EVENTS.ERROR, { message });
    }
  };

  quit = async () => {
    if (!this.socket.gameID || !this.socket.playerID) {
      this.socket.emit(GameModel.EVENTS.ERROR, {
        message: ERROR_MESSAGES.general,
      });
      return;
    }
    const userId = this.socket.playerID;
    const gameId = this.socket.gameID;
    const { players } = await this.gameController.quit({
      gameId,
      userId,
    });

    this.socket.to(gameId).emit(GameModel.EVENTS.UPDATE, {
      type: "players",
      players,
    });
  };

  join = async (username: PlayerName, gameId: GameId, userId: PlayerId) => {
    this.socket.join(gameId);
    try {
      const { player, players, game, shouldStartGame } =
        await this.gameController.join({
          username,
          gameId,
          userId,
        });
      this.socket.playerID = player?.id;
      this.socket.gameID = gameId;

      if (!userId) {
        this.socket.to(gameId).emit(GameModel.EVENTS.UPDATE, {
          type: "players",
          players,
        });
      }

      this.socket.emit(GameModel.EVENTS.WELCOME, {
        player,
        players,
        game,
      });

      if (shouldStartGame) {
        // if (true) {
        this.io.to(gameId).emit(GameModel.EVENTS.READY_TO_PLAY);
      }
    } catch (e) {
      console.log("paso pun error");
      const message =
        e instanceof UserFriendlyError
          ? e.message
          : "There was an error, please try again later. ";
      this.socket.emit(GameModel.EVENTS.ERROR, { message });
    }
  };
}

export default SocketHandler;
