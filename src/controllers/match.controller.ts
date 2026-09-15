import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { config } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_SHORT, CACHE_MEDIUM } from '../middleware/cache';

const matchId = (req: Request) => String(req.params.id);
const tz = (req: Request) => (req.query.timezone as string) || config.defaultTimezone;
const cc = (req: Request) => (req.query.ccode3 as string) || config.defaultCcode3;

export const matchController = {
  getLive: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLiveMatches(tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getLive error:', error.message);
      sendError(res, 'Failed to fetch live matches');
    }
  },

  getToday: async (req: Request, res: Response) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await fotmobService.getMatchesByDate(today, tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getToday error:', error.message);
      sendError(res, "Failed to fetch today's matches");
    }
  },

  getTomorrow: async (req: Request, res: Response) => {
    try {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const data = await fotmobService.getMatchesByDate(d.toISOString().split('T')[0], tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getTomorrow error:', error.message);
      sendError(res, "Failed to fetch tomorrow's matches");
    }
  },

  getYesterday: async (req: Request, res: Response) => {
    try {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const data = await fotmobService.getMatchesByDate(d.toISOString().split('T')[0], tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getYesterday error:', error.message);
      sendError(res, "Failed to fetch yesterday's matches");
    }
  },

  getByDate: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchesByDate(String(req.params.date), tz(req), cc(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getByDate error:', error.message);
      sendError(res, 'Failed to fetch matches by date');
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch match detail');
    }
  },

  getOverview: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchOverview(matchId(req));
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getOverview error:', error.message);
      sendError(res, 'Failed to fetch match overview');
    }
  },

  getEvents: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.matchFacts || data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getEvents error:', error.message);
      sendError(res, 'Failed to fetch match events');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.stats ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch match statistics');
    }
  },

  getLineups: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.lineup ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getLineups error:', error.message);
      sendError(res, 'Failed to fetch match lineups');
    }
  },

  getPlayerStats: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.playerStats ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getPlayerStats error:', error.message);
      sendError(res, 'Failed to fetch player stats');
    }
  },

  getShotmap: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.shotmap ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getShotmap error:', error.message);
      sendError(res, 'Failed to fetch shotmap');
    }
  },

  getMomentum: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.momentum ?? null, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getMomentum error:', error.message);
      sendError(res, 'Failed to fetch momentum');
    }
  },

  getCommentary: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchSummary(matchId(req));
      sendSuccess(res, data, 'fotmob', CACHE_SHORT);
    } catch (error: any) {
      console.error('[MatchController] getCommentary error:', error.message);
      sendError(res, 'Failed to fetch match commentary');
    }
  },

  getHighlights: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchMedia(matchId(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getHighlights error:', error.message);
      sendError(res, 'Failed to fetch match highlights');
    }
  },

  getH2H: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.h2h ?? null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getH2H error:', error.message);
      sendError(res, 'Failed to fetch head-to-head');
    }
  },

  getTable: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchDetail(matchId(req));
      sendSuccess(res, data?.content?.table ?? null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getTable error:', error.message);
      sendError(res, 'Failed to fetch mini-table');
    }
  },

  getOdds: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getMatchOdds(matchId(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getOdds error:', error.message);
      sendError(res, 'Failed to fetch match odds');
    }
  },

  getPredictions: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTvListings(matchId(req), (req.query.countryCode as string) || 'ID');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getPredictions error:', error.message);
      sendError(res, 'Failed to fetch match predictions');
    }
  },

  // GET /api/matches/range?from=YYYY-MM-DD&to=YYYY-MM-DD (maks 14 hari)
  getMatchesRange: async (req: Request, res: Response) => {
    try {
      const from = req.query.from as string;
      const to = req.query.to as string;
      if (!from || !to) {
        sendError(res, 'Both "from" and "to" query parameters (YYYY-MM-DD) are required', 400);
        return;
      }
      if (!/^(\d{4}-\d{2}-\d{2}|\d{8})$/.test(from) || !/^(\d{4}-\d{2}-\d{2}|\d{8})$/.test(to)) {
        sendError(res, 'Dates must be in YYYY-MM-DD format', 400);
        return;
      }
      const data = await fotmobService.getMatchesByDateRange(from, to, tz(req), cc(req));
      sendSuccess(res, { from, to, ...data }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[MatchController] getMatchesRange error:', error.message);
      sendError(res, 'Failed to fetch matches by range');
    }
  },
};
