// gameRouter.js
import { Router } from "express";
import GameController from "../controllers/GameController";
import GameModel from "../models/redis/Game";

const gameRouter = Router();
const gameController = new GameController({ gameModel: new GameModel() });

gameRouter.post("/start", gameController.start);
gameRouter.get("/:id", gameController.get);
gameRouter.get("/:id/players", gameController.getPlayers);

export default gameRouter;
