import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

const need = (v: any) => typeof v === 'string' && v.trim().length > 0;
const badId = (res: Response, label: string) => sendError(res, `${label} is required`, 400);

export const fotmobController = {
  getLive: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLiveMatches(
        (req.query.timezone as string) || 'Asia/Jakarta',
        (req.query.ccode3 as string) || 'IDN',
      );
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLive error:', error.message);
      sendError(res, 'Failed to fetch live matches');
    }
  },

  getNotable: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getNotableMatches();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getNotable error:', error.message);
      sendError(res, 'Failed to fetch notable matches');
    }
  },

  getMatchesByDate: async (req: Request, res: Response) => {
    try {
      const date = req.params.date as string;
      if (!date || !/^(\d{4}-\d{2}-\d{2}|\d{8})$/.test(date)) {
        sendError(res, 'Valid date YYYY-MM-DD (or YYYYMMDD) required', 400);
        return;
      }
      const data = await fotmobService.getMatchesByDate(
        date,
        (req.query.timezone as string) || 'Asia/Jakarta',
        (req.query.ccode3 as string) || 'IDN',
      );
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchesByDate error:', error.message);
      sendError(res, 'Failed to fetch matches');
    }
  },

  getMatchesByRange: async (req: Request, res: Response) => {
    try {
      const from = req.query.from as string;
      const to = req.query.to as string;
      if (!from || !to) {
        sendError(res, 'from and to params required', 400);
        return;
      }
      const data = await fotmobService.getMatchesByDateRange(
        from,
        to,
        (req.query.timezone as string) || 'Asia/Jakarta',
        (req.query.ccode3 as string) || 'IDN',
      );
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchesByRange error:', error.message);
      sendError(res, 'Failed to fetch matches');
    }
  },

  getAllLeagues: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getAllLeagues();
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getAllLeagues error:', error.message);
      sendError(res, 'Failed to fetch leagues directory');
    }
  },

  getLeaguesGrouped: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeaguesGrouped();
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeaguesGrouped error:', error.message);
      sendError(res, 'Failed to fetch grouped leagues');
    }
  },

  getLeagueDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'League ID');
        return;
      }
      const data = await fotmobService.getLeagueDetail(id, (req.query.ccode3 as string) || 'GBR');
      if (!data) {
        sendError(res, `League not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeagueDetail error:', error.message);
      sendError(res, 'Failed to fetch league details');
    }
  },

  getLeagueTable: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'League ID');
        return;
      }
      const scope = ((req.query.scope as string) || 'all') as any;
      const data = await fotmobService.getLeagueTableNormalized(id, scope);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeagueTable error:', error.message);
      sendError(res, 'Failed to fetch league table');
    }
  },

  getLeagueFixtures: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'League ID');
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

  getLeagueNews: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'League ID');
        return;
      }
      const data = await fotmobService.getLeagueNews(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getLeagueNews error:', error.message);
      sendError(res, 'Failed to fetch league news');
    }
  },

  getFixtureDifficulty: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'League ID');
        return;
      }
      const data = await fotmobService.getFixtureDifficulty(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getFixtureDifficulty error:', error.message);
      sendError(res, 'Failed to fetch fixture difficulty');
    }
  },

  getLeagueOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'League ID');
        return;
      }
      const data = await fotmobService.getLeagueOverview(id, req.query.season as string | undefined);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getLeagueOverview error:', error.message);
      sendError(res, 'Failed to fetch league overview');
    }
  },

  getMatchDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchDetail(id);
      if (!data) {
        sendError(res, `Match not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchDetail error:', error.message);
      sendError(res, 'Failed to fetch match details');
    }
  },

  getMatchOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchOverview error:', error.message);
      sendError(res, 'Failed to fetch match overview');
    }
  },

  getMatchSummary: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchSummary(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchSummary error:', error.message);
      sendError(res, 'Failed to fetch match summary');
    }
  },

  getMatchShotmap: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchShotmap(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchShotmap error:', error.message);
      sendError(res, 'Failed to fetch shotmap');
    }
  },

  getMatchMomentum: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchMomentum(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchMomentum error:', error.message);
      sendError(res, 'Failed to fetch momentum');
    }
  },

  getMatchHeatmap: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchHeatmap(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchHeatmap error:', error.message);
      sendError(res, 'Failed to fetch heatmap');
    }
  },

  getMatchH2h: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchH2H(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getMatchH2h error:', error.message);
      sendError(res, 'Failed to fetch head-to-head');
    }
  },

  getMatchMedia: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchMedia(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getMatchMedia error:', error.message);
      sendError(res, 'Failed to fetch match media');
    }
  },

  getMatchOdds: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
        return;
      }
      const data = await fotmobService.getMatchOdds(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getMatchOdds error:', error.message);
      sendError(res, 'Failed to fetch match odds');
    }
  },

  getTvListings: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Match ID');
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

  getClubDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Club ID');
        return;
      }
      const data = await fotmobService.getTeamDetail(id, (req.query.ccode3 as string) || 'IDN');
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

  getTeamOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Team ID');
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getTeamOverview error:', error.message);
      sendError(res, 'Failed to fetch team overview');
    }
  },

  getTeamFixtures: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Team ID');
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, { upcoming: data.upcoming, nextMatch: data.nextMatch }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getTeamFixtures error:', error.message);
      sendError(res, 'Failed to fetch team fixtures');
    }
  },

  getTeamResults: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Team ID');
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, { results: data.results, lastMatch: data.lastMatch, form: data.form }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getTeamResults error:', error.message);
      sendError(res, 'Failed to fetch team results');
    }
  },

  getTeamNews: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Team ID');
        return;
      }
      const data = await fotmobService.getTeamNews(id);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getTeamNews error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

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

  getPlayerDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Player ID');
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      if (!data) {
        sendError(res, `Player not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getPlayerDetail error:', error.message);
      sendError(res, 'Failed to fetch player details');
    }
  },

  getPlayerOverview: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!need(id)) {
        badId(res, 'Player ID');
        return;
      }
      const data = await fotmobService.getPlayerOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] getPlayerOverview error:', error.message);
      sendError(res, 'Failed to fetch player overview');
    }
  },

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

  getTrendingNews: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTrendingNews();
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] trending error:', error.message);
      sendError(res, 'Failed to fetch trending news');
    }
  },

  getTransfers: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10) || 50));
      const data = await fotmobService.getTransfers('all', limit);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[FotMob] transfers error:', error.message);
      sendError(res, 'Failed to fetch transfers');
    }
  },
};
