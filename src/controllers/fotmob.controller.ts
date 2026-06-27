import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const fotmobController = {
  // GET /api/fotmob/match/:id
  getMatchDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) { sendError(res, 'Match ID is required', 400); return; }
      const data = await fotmobService.getMatchByFotmobId(id);
      if (!data) { sendError(res, `Match not found: ${id}`, 404); return; }
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getMatchDetail error:', error.message);
      sendError(res, 'Failed to fetch match details');
    }
  },

  // GET /api/fotmob/club/:id
  getClubDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) { sendError(res, 'Club ID is required', 400); return; }
      const data = await fotmobService.getClubDetail(id);
      if (!data) { sendError(res, `Club not found: ${id}`, 404); return; }
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getClubDetail error:', error.message);
      sendError(res, 'Failed to fetch club details');
    }
  },

  // GET /api/fotmob/player/:id
  getPlayerDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) { sendError(res, 'Player ID is required', 400); return; }
      const data = await fotmobService.getPlayerDetail(id);
      if (!data) { sendError(res, `Player not found: ${id}`, 404); return; }
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getPlayerDetail error:', error.message);
      sendError(res, 'Failed to fetch player details');
    }
  },

  // GET /api/fotmob/matches/date/:date
  getMatchesByDate: async (req: Request, res: Response) => {
    try {
      const date = req.params.date as string;
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        sendError(res, 'Valid date YYYY-MM-DD required', 400); return;
      }
      const data = await fotmobService.getMatchesByDate(date);
      sendSuccess(res, data, 'fotmob');
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
      if (!from || !to) { sendError(res, 'from and to params required', 400); return; }
      const data = await fotmobService.getMatchesByDateRange(from, to);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getMatchesByRange error:', error.message);
      sendError(res, 'Failed to fetch matches');
    }
  },

  // GET /api/fotmob/search/all?q=...
  searchAll: async (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string) || '';
      if (!q) { sendError(res, 'Query required', 400); return; }
      const data = await fotmobService.searchAll(q);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] search error:', error.message);
      sendError(res, 'Failed to search');
    }
  },

  // GET /api/fotmob/league/:id
  getLeagueDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) { sendError(res, 'League ID is required', 400); return; }
      const data = await fotmobService.getLeagueDetail(id);
      if (!data) { sendError(res, `League not found: ${id}`, 404); return; }
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[FotMob] getLeagueDetail error:', error.message);
      sendError(res, 'Failed to fetch league details');
    }
  },
};
