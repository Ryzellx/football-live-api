import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const searchController = {
  search: async (req: Request, res: Response) => {
    try {
      const q = ((req.query.q as string) || (req.query.term as string) || '').trim();
      if (!q) {
        sendError(res, 'Query parameter "q" is required', 400);
        return;
      }
      const data = await fotmobService.searchAll(q);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[SearchController] search error:', error.message);
      sendError(res, 'Failed to perform search');
    }
  },
};
