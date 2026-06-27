import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';

const router = Router();

router.get('/stats/topscorers', statsController.getTopScorers);
router.get('/stats/topassists', statsController.getTopAssists);
router.get('/stats/clean-sheets', statsController.getCleanSheets);
router.get('/stats/most-goals', statsController.getMostGoals);
router.get('/stats/most-shots', statsController.getMostShots);
router.get('/stats/most-passes', statsController.getMostPasses);
router.get('/stats/most-dribbles', statsController.getMostDribbles);
router.get('/stats/most-tackles', statsController.getMostTackles);
router.get('/stats/most-saves', statsController.getMostSaves);
router.get('/stats/cards', statsController.getCards);

export default router;
