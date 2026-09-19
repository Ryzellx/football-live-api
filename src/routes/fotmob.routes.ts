import { Router } from 'express';
import { fotmobController } from '../controllers/fotmob.controller';

const router = Router();

// Live & kalender
router.get('/matches/live', fotmobController.getLive);
router.get('/matches/notable', fotmobController.getNotable);
router.get('/matches/date/:date', fotmobController.getMatchesByDate);
router.get('/matches/range', fotmobController.getMatchesByRange);

// Liga (kompat: mentah, tanpa normalisasi tabel)
router.get('/leagues', fotmobController.getAllLeagues);
router.get('/leagues/grouped', fotmobController.getLeaguesGrouped);
router.get('/league/:id', fotmobController.getLeagueDetail);
router.get('/league/:id/overview', fotmobController.getLeagueOverview);
router.get('/league/:id/fixtures', fotmobController.getLeagueFixtures);
router.get('/league/:id/news', fotmobController.getLeagueNews);
router.get('/league/:id/difficulty', fotmobController.getFixtureDifficulty);

// Pertandingan detail (kompat mentah)
router.get('/match/:id', fotmobController.getMatchDetail);
router.get('/match/:id/overview', fotmobController.getMatchOverview);
router.get('/match/:id/summary', fotmobController.getMatchSummary);
router.get('/match/:id/shotmap', fotmobController.getMatchShotmap);
router.get('/match/:id/heatmap', fotmobController.getMatchHeatmap);
router.get('/match/:id/momentum', fotmobController.getMatchMomentum);
router.get('/match/:id/h2h', fotmobController.getMatchH2h);
router.get('/match/:id/media', fotmobController.getMatchMedia);
router.get('/match/:id/odds', fotmobController.getMatchOdds);
router.get('/match/:id/tv', fotmobController.getTvListings);

// Tim
router.get('/team/:id', fotmobController.getClubDetail);
router.get('/club/:id', fotmobController.getClubDetail);
router.get('/team/:id/overview', fotmobController.getTeamOverview);
router.get('/team/:id/fixtures', fotmobController.getTeamFixtures);
router.get('/team/:id/results', fotmobController.getTeamResults);
router.get('/team/:id/news', fotmobController.getTeamNews);
router.get('/team/:id/stats', fotmobController.getTeamSeasonStats);

// Pemain
router.get('/player/:id', fotmobController.getPlayerDetail);
router.get('/player/:id/overview', fotmobController.getPlayerOverview);

// Search (hidup, bukan stub)
router.get('/search/all', fotmobController.searchAll);
router.get('/search', fotmobController.searchAll);
router.get('/search/suggest', fotmobController.searchSuggest);

// Berita & transfer
router.get('/news/world', fotmobController.getWorldNews);
router.get('/news/trending', fotmobController.getTrendingNews);
router.get('/transfers', fotmobController.getTransfers);

export default router;
