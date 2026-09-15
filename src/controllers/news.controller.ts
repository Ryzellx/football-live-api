import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const newsController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10) || 1;
      const data = await fotmobService.getWorldNews(page);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[NewsController] getAll error:', error.message);
      sendError(res, 'Failed to fetch news');
    }
  },

  getLatest: async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query.page as string) || '1', 10) || 1;
      const data = await fotmobService.getWorldNews(page);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[NewsController] getLatest error:', error.message);
      sendError(res, 'Failed to fetch latest news');
    }
  },

  getTrending: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTrendingNews();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[NewsController] getTrending error:', error.message);
      sendError(res, 'Failed to fetch trending news');
    }
  },

  getByTeam: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamNews(String(req.params.id));
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[NewsController] getByTeam error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

  getByPlayer: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getPlayerDetail(String(req.params.id));
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[NewsController] getByPlayer error:', error.message);
      sendError(res, 'Failed to fetch player news');
    }
  },

  getByCompetition: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueNews(String(req.params.id));
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[NewsController] getByCompetition error:', error.message);
      sendError(res, 'Failed to fetch competition news');
    }
  },
};
