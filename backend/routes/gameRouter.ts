// gameRouter.js
import { Router } from "express";
import GameController from "../Controllers/GameController";
import GameModel from "../Models/redis/Game";
import PhraseLocal from "../Models/PhraseLocal";
import PhraseController from "../Controllers/PhraseController";

const gameRouter = Router();
const gameController = new GameController({
  gameModel: new GameModel({ phraseModel: new PhraseLocal() }),
});
const phraseController = new PhraseController({
  phraseModel: new PhraseLocal(),
});

gameRouter.post("/start", gameController.start);
gameRouter.get("/phrase", phraseController.get);
gameRouter.get("/:id", gameController.get);
gameRouter.get("/:id/players", gameController.getPlayers);

export default gameRouter;
