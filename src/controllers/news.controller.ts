import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

export const newsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10) || 1;
      const data = await fotmobService.getNewsLatest(page);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getAll error:', error.message);
      sendError(res, 'Failed to fetch news');
    }
  },

  getLatest: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10) || 1;
      const data = await fotmobService.getNewsLatest(page);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getLatest error:', error.message);
      sendError(res, 'Failed to fetch latest news');
    }
  },

  getBreaking: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10) || 1;
      const data = await fotmobService.getNewsLatest(page);
      const list: any[] = Array.isArray(data) ? data : [];
      sendSuccess(res, list.slice(0, 10), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getBreaking error:', error.message);
      sendError(res, 'Failed to fetch breaking news');
    }
  },

  getTrending: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTrendingNews();
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getTrending error:', error.message);
      sendError(res, 'Failed to fetch trending news');
    }
  },

  getByTeam: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamNews(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getByTeam error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

  getByPlayer: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const detail = await fotmobService.getPlayerDetail(id);
      const teamId = detail?.primaryTeam?.teamId;
      if (!teamId) {
        sendSuccess(res, { data: [], note: 'Player news mengikuti berita tim utama; tim utama tidak tersedia' }, 'fotmob', CACHE_MEDIUM);
        return;
      }
      const data = await fotmobService.getTeamNews(String(teamId));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getByPlayer error:', error.message);
      sendError(res, 'Failed to fetch player news');
    }
  },

  getByCompetition: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueNews(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[NewsController] getByCompetition error:', error.message);
      sendError(res, 'Failed to fetch competition news');
    }
  },
};
