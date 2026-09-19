import { Router } from 'express';
import { matchController } from '../controllers/match.controller';

const router = Router();

router.get('/matches/live', matchController.getLive);
router.get('/matches/notable', matchController.getNotable);
router.get('/matches/today', matchController.getToday);
router.get('/matches/tomorrow', matchController.getTomorrow);
router.get('/matches/yesterday', matchController.getYesterday);
router.get('/matches/date/:date', matchController.getByDate);
router.get('/matches/range', matchController.getMatchesRange);
router.get('/match/:id', matchController.getDetail);
router.get('/match/:id/overview', matchController.getOverview);
router.get('/match/:id/summary', matchController.getSummary);
router.get('/match/:id/events', matchController.getEvents);
router.get('/match/:id/timeline', matchController.getTimeline);
router.get('/match/:id/statistics', matchController.getStatistics);
router.get('/match/:id/lineups', matchController.getLineups);
router.get('/match/:id/ratings', matchController.getPlayerStats);
router.get('/match/:id/player-stats', matchController.getPlayerStats);
router.get('/match/:id/shotmap', matchController.getShotmap);
router.get('/match/:id/heatmap', matchController.getHeatmap);
router.get('/match/:id/momentum', matchController.getMomentum);
router.get('/match/:id/commentary', matchController.getCommentary);
router.get('/match/:id/info', matchController.getInfo);
router.get('/match/:id/highlights', matchController.getHighlights);
router.get('/match/:id/media', matchController.getHighlights);
router.get('/match/:id/h2h', matchController.getH2H);
router.get('/match/:id/table', matchController.getTable);
router.get('/match/:id/odds', matchController.getOdds);
router.get('/match/:id/tv', matchController.getTv);

export default router;
