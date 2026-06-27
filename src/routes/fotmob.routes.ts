import { Router } from 'express';
import { fotmobController } from '../controllers/fotmob.controller';

const router = Router();

// Match detail
router.get('/match/:id', fotmobController.getMatchDetail);

// Club detail
router.get('/club/:id', fotmobController.getClubDetail);

// Player detail
router.get('/player/:id', fotmobController.getPlayerDetail);

// Matches by date
router.get('/matches/date/:date', fotmobController.getMatchesByDate);

// Matches by range
router.get('/matches/range', fotmobController.getMatchesByRange);

// Search
router.get('/search/all', fotmobController.searchAll);

// League detail
router.get('/league/:id', fotmobController.getLeagueDetail);

export default router;
