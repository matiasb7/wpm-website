import GameController from "./controllers/GameController.js";
import GameModel from "./models/redis/Game.js";

const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    const gameController = new GameController({ gameModel: new GameModel() });

    socket.on("join", async (username, gameId, userId) => {
      if (!username || !gameId) return;

      socket.join(gameId);

      let player, players, game;
      if (!userId) {
        ({ player, players, game } = await gameController.addPlayerToGame(
          socket,
          username,
          gameId,
        ));
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
