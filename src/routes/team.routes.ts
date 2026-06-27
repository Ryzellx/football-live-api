import { Router } from 'express';
import { teamController } from '../controllers/team.controller';

const router = Router();

router.get('/teams', teamController.getAll);
router.get('/team/:id', teamController.getDetail);
router.get('/team/:id/squad', teamController.getSquad);
router.get('/team/:id/fixtures', teamController.getFixtures);
router.get('/team/:id/results', teamController.getResults);
router.get('/team/:id/transfers', teamController.getTransfers);
router.get('/team/:id/injuries', teamController.getInjuries);
router.get('/team/:id/statistics', teamController.getStatistics);
router.get('/team/:id/news', teamController.getNews);
router.get('/team/:id/videos', teamController.getVideos);

export default router;
