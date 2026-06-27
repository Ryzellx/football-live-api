import { Router } from 'express';
import { matchController } from '../controllers/match.controller';

const router = Router();

router.get('/matches/live', matchController.getLive);
router.get('/matches/today', matchController.getToday);
router.get('/matches/tomorrow', matchController.getTomorrow);
router.get('/matches/yesterday', matchController.getYesterday);
router.get('/matches/date/:date', matchController.getByDate);
router.get('/match/:id', matchController.getDetail);
router.get('/match/:id/events', matchController.getEvents);
router.get('/match/:id/statistics', matchController.getStatistics);
router.get('/match/:id/lineups', matchController.getLineups);
router.get('/match/:id/player-stats', matchController.getPlayerStats);
router.get('/match/:id/commentary', matchController.getCommentary);
router.get('/match/:id/highlights', matchController.getHighlights);
router.get('/match/:id/h2h', matchController.getH2H);
router.get('/match/:id/odds', matchController.getOdds);
router.get('/match/:id/predictions', matchController.getPredictions);

export default router;
