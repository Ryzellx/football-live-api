import { Router } from 'express';
import { competitionController } from '../controllers/competition.controller';

const router = Router();

router.get('/competitions', competitionController.getAll);
router.get('/competition/:id', competitionController.getDetail);
router.get('/competition/:id/standings', competitionController.getStandings);
router.get('/competition/:id/fixtures', competitionController.getFixtures);
router.get('/competition/:id/results', competitionController.getResults);
router.get('/competition/:id/topscorers', competitionController.getTopScorers);
router.get('/competition/:id/topassists', competitionController.getTopAssists);
router.get('/competition/:id/topkeepers', competitionController.getTopKeepers);
router.get('/competition/:id/cards', competitionController.getCards);

export default router;
