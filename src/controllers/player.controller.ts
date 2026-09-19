import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM, CACHE_LONG } from '../middleware/cache';

const pid = (req: Request) => String(req.params.id || '').trim();

export const playerController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const q = (req.query.q as string) || '';
      if (!q) {
        sendSuccess(res, { message: 'Use /api/search?q=<player> to find players.' });
        return;
      }
      const data = await fotmobService.searchAll(q);
      sendSuccess(res, data.players, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[PlayerController] getAll error:', error.message);
      sendError(res, 'Failed to fetch players');
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
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
      console.error('[PlayerController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch player detail');
    }
  },

  getOverview: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[PlayerController] getOverview error:', error.message);
      sendError(res, 'Failed to fetch player overview');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerSeason(id);
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[PlayerController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch player statistics');
    }
  },

  getMatches: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      sendSuccess(res, (data as any)?.recentMatches || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[PlayerController] getMatches error:', error.message);
      sendError(res, 'Failed to fetch player matches');
    }
  },

  getSeason: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerSeason(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[PlayerController] getSeason error:', error.message);
      sendError(res, 'Failed to fetch player season stats');
    }
  },

  getHistory: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerHistory(id);
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[PlayerController] getHistory error:', error.message);
      sendError(res, 'Failed to fetch player history');
    }
  },

  getTransfers: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const history = await fotmobService.getPlayerHistory(id);
      const items: any[] = history?.careerItems?.senior?.teamEntries || history?.teamEntries || [];
      sendSuccess(res, { transfers: items }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[PlayerController] getTransfers error:', error.message);
      sendError(res, 'Failed to fetch player transfers');
    }
  },

  getInjuries: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      sendSuccess(res, (data as any)?.injuryInformation ?? null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[PlayerController] getInjuries error:', error.message);
      sendError(res, 'Failed to fetch player injuries');
    }
  },

  getNews: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      const teamId = (data as any)?.primaryTeam?.teamId;
      const news = teamId ? await fotmobService.getTeamNews(String(teamId)) : { data: [], note: 'Player news mengikuti berita tim utama' };
      sendSuccess(res, news, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[PlayerController] getNews error:', error.message);
      sendError(res, 'Failed to fetch player news');
    }
  },

  getValue: async (req: Request, res: Response) => {
    try {
      const id = pid(req);
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      sendSuccess(res, (data as any)?.marketValues || null, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[PlayerController] getValue error:', error.message);
      sendError(res, 'Failed to fetch player market value');
    }
  },
};
