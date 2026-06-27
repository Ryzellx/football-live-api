import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const fotmobController = {
  // GET /api/fotmob/match/:id
  getMatchDetail: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        sendError(res, 'Match ID is required', 400);
        return;
      }

      const data = await fotmobService.getMatchByFotmobId(id);
      if (!data) {
        sendError(res, `Match not found: ${id}`, 404);
        return;
      }

      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error(`[FotMobController] getMatchDetail error:`, error.message);
      sendError(res, 'Failed to fetch match details');
    }
  },

  // GET /api/fotmob/search?q=...
  search: async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string) || '';
      if (!query) {
        sendError(res, 'Search query is required', 400);
        return;
      }

      const results = await fotmobService.searchMatches(query);
      sendSuccess(res, { matches: results }, 'fotmob');
    } catch (error: any) {
      console.error(`[FotMobController] search error:`, error.message);
      sendError(res, 'Failed to search matches');
    }
  },
};
