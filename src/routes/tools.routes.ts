import { Router } from 'express';
import { toolsController } from '../controllers/tools.controller';

const router = Router();

router.get('/tools/fifa-rankings', toolsController.getFifaRankings);
router.get('/tools/team-of-the-week', toolsController.getTeamOfTheWeek);
router.get('/tools/predictor', toolsController.getPredictor);
router.get('/tools/lineup-builder', toolsController.getLineupBuilder);
router.get('/tools/tv', toolsController.getTv);

export default router;
