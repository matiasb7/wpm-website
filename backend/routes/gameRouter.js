// gameRouter.js
import { Router } from 'express';
import GameController from '../controllers/GameController.js';
import GameModel from '../models/redis/Game.js';

const gameRouter = Router();
const gameController = new GameController({ gameModel: new GameModel() });

gameRouter.post('/start', gameController.start);
gameRouter.get('/create', gameController.create);
gameRouter.post('/:id/join', gameController.addPlayerToGame);
gameRouter.get('/:id', gameController.get);
gameRouter.get('/:id/players', gameController.getPlayers);

export default gameRouter;
