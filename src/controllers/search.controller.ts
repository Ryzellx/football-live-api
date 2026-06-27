import { Request, Response } from 'express';
import { sofascoreService } from '../services/sofascore.service';
import { sendSuccess, sendError } from '../utils/response';

export const searchController = {
  search: async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        sendError(res, 'Query parameter "q" is required', 400);
        return;
      }
      const data = await sofascoreService.search(q);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[SearchController] search error:', error.message);
      sendError(res, 'Failed to perform search');
    }
  },
};
