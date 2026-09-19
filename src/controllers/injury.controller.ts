import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

export const injuryController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      sendSuccess(res, { injuries: [], note: 'Daftar cedera global tidak tersedia dari upstream; gunakan /api/injuries/team/:id atau /api/injuries/player/:id' }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[InjuryController] getAll error:', error.message);
      sendError(res, 'Failed to fetch injuries');
    }
  },

  getByTeam: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const detail = await fotmobService.getTeamDetail(id);
      const { injuries } = fotmobService.teamInjuriesAndSuspensions(detail);
      const squad = await fotmobService.getTeamSquad(id);
      sendSuccess(res, { injuries, squad: squad.byPosition, note: 'Upstream tidak menyediakan daftar cedera terpisah; injuries kosong bila tidak ada data' }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[InjuryController] getByTeam error:', error.message);
      sendError(res, 'Failed to fetch team injuries');
    }
  },

  getByPlayer: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Player ID is required', 400);
        return;
      }
      const data = await fotmobService.getPlayerDetail(id);
      sendSuccess(res, (data as any)?.injuryInformation ?? null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[InjuryController] getByPlayer error:', error.message);
      sendError(res, 'Failed to fetch player injuries');
    }
  },
};
