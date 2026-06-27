import { Request, Response } from 'express';
import { sofascoreService } from '../services/sofascore.service';
import { sendSuccess, sendError } from '../utils/response';

export const statsController = {
  getTopScorers: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getTopScorers();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getTopScorers error:', error.message);
      sendError(res, 'Failed to fetch top scorers');
    }
  },

  getTopAssists: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getTopAssists();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getTopAssists error:', error.message);
      sendError(res, 'Failed to fetch top assists');
    }
  },

  getCleanSheets: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getCleanSheets();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getCleanSheets error:', error.message);
      sendError(res, 'Failed to fetch clean sheets');
    }
  },

  getMostGoals: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getMostGoals();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getMostGoals error:', error.message);
      sendError(res, 'Failed to fetch most goals');
    }
  },

  getMostShots: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getMostShots();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getMostShots error:', error.message);
      sendError(res, 'Failed to fetch most shots');
    }
  },

  getMostPasses: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getMostPasses();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getMostPasses error:', error.message);
      sendError(res, 'Failed to fetch most passes');
    }
  },

  getMostDribbles: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getMostDribbles();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getMostDribbles error:', error.message);
      sendError(res, 'Failed to fetch most dribbles');
    }
  },

  getMostTackles: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getMostTackles();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getMostTackles error:', error.message);
      sendError(res, 'Failed to fetch most tackles');
    }
  },

  getMostSaves: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getMostSaves();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getMostSaves error:', error.message);
      sendError(res, 'Failed to fetch most saves');
    }
  },

  getCards: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getCards();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[StatsController] getCards error:', error.message);
      sendError(res, 'Failed to fetch card statistics');
    }
  },
};
