import GameController from "./controllers/GameController";
import GameModel from "./models/redis/Game";
import { Server } from "socket.io";
import { GameSocket } from "./types";

const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: GameSocket) => {
    const gameController = new GameController({ gameModel: new GameModel() });

    socket.on("join", async (username, gameId, userId) => {
      if (!username || !gameId) return;

      socket.join(gameId);

      let player, players, game;
      if (!userId) {
        const result = await gameController.addPlayerToGame(
          socket,
          username,
          gameId,
        );
        if (!result) return;
        ({ player, players, game } = result);
      } else {
        ({ game, players } = await gameController.getSessionGame(gameId));
        player = players.find((player) => player.id === userId);
      }

      socket.playerID = player?.id;
      socket.gameID = gameId;

      socket.emit(GameModel.EVENTS.WELCOME, {
        player,
        players,
        game,
      });
    });

    socket.on("finish", async ({ wpm, timeStamp, accuracy, winnerId }) => {
      await gameController.update(socket, {
        wpm,
        timeStamp,
        accuracy,
        winnerId,
      });

      if (!socket.gameID) return;

      io.to(socket.gameID).emit(GameModel.EVENTS.UPDATE, {
        type: "updatePlayer",
        player: {
          wpm,
          id: winnerId,
          accuracy,
        },
      });
    });
  });
};

export default setupSocketHandlers;
