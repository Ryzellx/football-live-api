import { Router } from 'express';
import { competitionController } from '../controllers/competition.controller';

const router = Router();

router.get('/competitions', competitionController.getAll);
router.get('/competition/:id', competitionController.getDetail);
router.get('/competition/:id/overview', competitionController.getOverview);
router.get('/competition/:id/standings', competitionController.getStandings);
router.get('/competition/:id/fixtures', competitionController.getFixtures);
router.get('/competition/:id/results', competitionController.getResults);
router.get('/competition/:id/topscorers', competitionController.getTopScorers);
router.get('/competition/:id/topassists', competitionController.getTopAssists);
router.get('/competition/:id/topkeepers', competitionController.getTopKeepers);
router.get('/competition/:id/cards', competitionController.getCards);
router.get('/competition/:id/stats', competitionController.getStats);
router.get('/competition/:id/xg-table', competitionController.getXgTable);

// Alias /league/:id/* agar Refoot cukup pakai satu pola ID liga
router.get('/league/:id/results', competitionController.getResults);
router.get('/league/:id/topscorers', competitionController.getTopScorers);
router.get('/league/:id/topassists', competitionController.getTopAssists);
router.get('/league/:id/topkeepers', competitionController.getTopKeepers);
router.get('/league/:id/cards', competitionController.getCards);
router.get('/league/:id/stats', competitionController.getStats);
router.get('/league/:id/xg-table', competitionController.getXgTable);
router.get('/league/:id/table', competitionController.getStandings);

export default router;
