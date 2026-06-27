import { Router } from 'express';
import { playerController } from '../controllers/player.controller';

const router = Router();

router.get('/players', playerController.getAll);
router.get('/player/:id', playerController.getDetail);
router.get('/player/:id/statistics', playerController.getStatistics);
router.get('/player/:id/matches', playerController.getMatches);
router.get('/player/:id/season', playerController.getSeason);
router.get('/player/:id/history', playerController.getHistory);
router.get('/player/:id/transfers', playerController.getTransfers);
router.get('/player/:id/injuries', playerController.getInjuries);
router.get('/player/:id/news', playerController.getNews);

export default router;
