import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const injuryController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.searchAll('injury');
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[InjuryController] getAll error:', error.message);
      sendError(res, 'Failed to fetch injuries');
    }
  },

  getByTeam: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamDetail(String(req.params.id));
      sendSuccess(res, (data as any)?.squad || data, 'fotmob');
    } catch (error: any) {
      console.error('[InjuryController] getByTeam error:', error.message);
      sendError(res, 'Failed to fetch team injuries');
    }
  },

  getByPlayer: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getPlayerDetail(String(req.params.id));
      sendSuccess(res, (data as any)?.injuryInformation || null, 'fotmob');
    } catch (error: any) {
      console.error('[InjuryController] getByPlayer error:', error.message);
      sendError(res, 'Failed to fetch player injuries');
    }
  },
};
