import { Router } from 'express';
import { newsController } from '../controllers/news.controller';

const router = Router();

router.get('/news', newsController.getAll);
router.get('/news/latest', newsController.getLatest);
router.get('/news/trending', newsController.getTrending);
router.get('/news/team/:id', newsController.getByTeam);
router.get('/news/player/:id', newsController.getByPlayer);
router.get('/news/competition/:id', newsController.getByCompetition);

export default router;
