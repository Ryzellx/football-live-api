import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { config } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_SHORT, CACHE_MEDIUM, CACHE_LONG } from '../middleware/cache';

const need = (v: any) => typeof v === 'string' && v.trim().length > 0;
const tz = (req: Request) => (req.query.timezone as string) || config.defaultTimezone;
const cc = (req: Request) => (req.query.ccode3 as string) || config.defaultCcode3;

export const fotmobController = {
  // GET /api/fotmob/matches/live?timezone=&ccode3=
  getLive: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLiveMatches(tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[FotMob] getLive error:', error.message);
      sendError(res, 'Failed to fetch live matches');
    }
  },

  // GET /api/fotmob/matches/notable
  getNotable: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getNotableMatches();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getNotable error:', error.message);
      sendError(res, 'Failed to fetch notable matches');
    }
  },

  // GET /api/fotmob/matches/date/:date (YYYY-MM-DD atau YYYYMMDD)
  getMatchesByDate: async (req: Request, res: Response) => {
    try {
      const date = req.params.date as string;
      if (!date || !/^(\d{4}-\d{2}-\d{2}|\d{8})$/.test(date)) {
        sendError(res, 'Valid date YYYY-MM-DD (or YYYYMMDD) required', 400);
        return;
      }
      const data = await fotmobService.getMatchesByDate(date, tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchesByDate error:', error.message);
      sendError(res, 'Failed to fetch matches');
    }
  },

  // GET /api/fotmob/matches/range?from=...&to=...
  getMatchesByRange: async (req: Request, res: Response) => {
    try {
      const from = req.query.from as string;
      const to = req.query.to as string;
      if (!from || !to) {
        sendError(res, 'from and to params required', 400);
        return;
      }
      const data = await fotmobService.getMatchesByDateRange(from, to, tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchesByRange error:', error.message);
      sendError(res, 'Failed to fetch matches');
    }
  },

  // GET /api/fotmob/leagues (direktori semua liga)
  getAllLeagues: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getAllLeagues();
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[FotMob] getAllLeagues error:', error.message);
      sendError(res, 'Failed to fetch leagues directory');
    }
  },

  // GET /api/fotmob/leagues/grouped (populer + grup benua siap-render)
  getLeaguesGrouped: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeaguesGrouped();
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[FotMob] getLeaguesGrouped error:', error.message);
      sendError(res, 'Failed to fetch grouped leagues');
    }
  },

  // GET /api/fotmob/league/:id
  getLeagueDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'League ID is required', 400);
        return;
      }
      const ccode3 = cc(req);
      const data = await fotmobService.getLeagueDetail(id, ccode3);
      if (!data) {
        sendError(res, `League not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[FotMob] getLeagueDetail error:', error.message);
      sendError(res, 'Failed to fetch league details');
    }
  },

  // GET /api/fotmob/league/:id/table
  getLeagueTable: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'League ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueTable(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeagueTable error:', error.message);
      sendError(res, 'Failed to fetch league table');
    }
  },

  // GET /api/fotmob/league/:id/fixtures?season=2026/2027
  getLeagueFixtures: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'League ID is required', 400);
        return;
      }
      const season = (req.query.season as string) || '2026/2027';
      const data = await fotmobService.getLeagueFixtures(id, season);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeagueFixtures error:', error.message);
      sendError(res, 'Failed to fetch league fixtures');
    }
  },

  // GET /api/fotmob/league/:id/news
  getLeagueNews: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'League ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueNews(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getLeagueNews error:', error.message);
      sendError(res, 'Failed to fetch league news');
    }
  },

  // GET /api/fotmob/league/:id/difficulty
  getFixtureDifficulty: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'League ID is required', 400);
        return;
      }
      const data = await fotmobService.getFixtureDifficulty(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getFixtureDifficulty error:', error.message);
      sendError(res, 'Failed to fetch fixture difficulty');
    }
  },

  // GET /api/fotmob/league/:id/overview?season=
  getLeagueOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'League ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueOverview(id, req.query.season as string | undefined);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeagueOverview error:', error.message);
      sendError(res, 'Failed to fetch league overview');
    }
  },

  // GET /api/fotmob/match/:id (detail lengkap: lineup, stats, xG, shotmap, momentum, H2H)
  getMatchDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchByFotmobId(id);
      if (!data) {
        sendError(res, `Match not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[FotMob] getMatchDetail error:', error.message);
      sendError(res, 'Failed to fetch match details');
    }
  },

  // GET /api/fotmob/match/:id/overview
  getMatchOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[FotMob] getMatchOverview error:', error.message);
      sendError(res, 'Failed to fetch match overview');
    }
  },

  // GET /api/fotmob/match/:id/summary
  getMatchSummary: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchSummary(id);
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[FotMob] getMatchSummary error:', error.message);
      sendError(res, 'Failed to fetch match summary');
    }
  },

  // GET /api/fotmob/match/:id/shotmap
  getMatchShotmap: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchDetail(id);
      sendSuccess(res, data?.content?.shotmap ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[FotMob] getMatchShotmap error:', error.message);
      sendError(res, 'Failed to fetch shotmap');
    }
  },

  // GET /api/fotmob/match/:id/momentum
  getMatchMomentum: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchDetail(id);
      sendSuccess(res, data?.content?.momentum ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[FotMob] getMatchMomentum error:', error.message);
      sendError(res, 'Failed to fetch momentum');
    }
  },

  // GET /api/fotmob/match/:id/h2h
  getMatchH2h: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchDetail(id);
      sendSuccess(res, data?.content?.h2h ?? null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchH2h error:', error.message);
      sendError(res, 'Failed to fetch head-to-head');
    }
  },

  // GET /api/fotmob/match/:id/media
  getMatchMedia: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchMedia(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getMatchMedia error:', error.message);
      sendError(res, 'Failed to fetch match media');
    }
  },

  // GET /api/fotmob/match/:id/odds
  getMatchOdds: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const data = await fotmobService.getMatchOdds(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getMatchOdds error:', error.message);
      sendError(res, 'Failed to fetch match odds');
    }
  },

  // GET /api/fotmob/match/:id/tv?countryCode=ID
  getTvListings: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Match ID is required', 400);
        return;
      }
      const countryCode = (req.query.countryCode as string) || 'ID';
      const data = await fotmobService.getTvListings(id, countryCode);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getTvListings error:', error.message);
      sendError(res, 'Failed to fetch TV listings');
    }
  },

  // GET /api/fotmob/club/:id  (alias /api/fotmob/team/:id)
  getClubDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Club ID is required', 400);
        return;
      }
      const data = await fotmobService.getClubDetail(id, cc(req));
      if (!data) {
        sendError(res, `Club not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getClubDetail error:', error.message);
      sendError(res, 'Failed to fetch club details');
    }
  },

  // GET /api/fotmob/team/:id/overview
  getTeamOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getTeamOverview error:', error.message);
      sendError(res, 'Failed to fetch team overview');
    }
  },

  // GET /api/fotmob/team/:id/fixtures
  getTeamFixtures: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, { upcoming: data.upcoming, nextMatch: data.nextMatch }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getTeamFixtures error:', error.message);
      sendError(res, 'Failed to fetch team fixtures');
    }
  },

  // GET /api/fotmob/team/:id/results
  getTeamResults: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, { results: data.results, lastMatch: data.lastMatch, form: data.form }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getTeamResults error:', error.message);
      sendError(res, 'Failed to fetch team results');
    }
  },

  // GET /api/fotmob/team/:id/news
  getTeamNews: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamNews(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getTeamNews error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

  // GET /api/fotmob/team/:id/stats?tournamentId=47
  getTeamSeasonStats: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const tournamentId = req.query.tournamentId as string;
      if (!need(id) || !need(tournamentId)) {
        sendError(res, 'Team ID and tournamentId query required', 400);
        return;
      }
      const data = await fotmobService.getTeamSeasonStats(id, tournamentId);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getTeamSeasonStats error:', error.message);
      sendError(res, 'Failed to fetch team season stats');
    }
  },

  // GET /api/fotmob/player/:id
  getPlayerDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      if (!data) {
        sendError(res, `Player not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[FotMob] getPlayerDetail error:', error.message);
      sendError(res, 'Failed to fetch player details');
    }
  },

  // GET /api/fotmob/player/:id/overview
  getPlayerOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[FotMob] getPlayerOverview error:', error.message);
      sendError(res, 'Failed to fetch player overview');
    }
  },

  // GET /api/fotmob/search/all?q=...  (+ alias ?term=...)
  searchAll: async (req: Request, res: Response) => {
    try {
      const q = ((req.query.q as string) || (req.query.term as string) || '').trim();
      if (!q) {
        sendError(res, 'Query required (?q= or ?term=)', 400);
        return;
      }
      const data = await fotmobService.searchAll(q);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] search error:', error.message);
      sendError(res, 'Failed to search');
    }
  },

  // GET /api/fotmob/search/suggest?term=...
  searchSuggest: async (req: Request, res: Response) => {
    try {
      const term = ((req.query.term as string) || (req.query.q as string) || '').trim();
      if (!term) {
        sendError(res, 'Query required (?term= or ?q=)', 400);
        return;
      }
      const data = await fotmobService.searchSuggest(term);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] suggest error:', error.message);
      sendError(res, 'Failed to search');
    }
  },

  // GET /api/fotmob/news/world?page=1
  getWorldNews: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10) || 1;
      const data = await fotmobService.getWorldNews(page);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] worldnews error:', error.message);
      sendError(res, 'Failed to fetch news');
    }
  },

  // GET /api/fotmob/news/trending
  getTrendingNews: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTrendingNews();
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] trending error:', error.message);
      sendError(res, 'Failed to fetch trending news');
    }
  },

  // GET /api/fotmob/transfers
  getTransfers: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTransfers();
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] transfers error:', error.message);
      sendError(res, 'Failed to fetch transfers');
    }
  },
};
