import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

const leagueId = (req: Request) => (req.query.leagueId as string) || '47';

function pick(data: any, pattern: RegExp, label: string) {
  try {
    const players = data?.stats?.players || [];
    return players.find((p: any) => pattern.test(p.header || '')) || null;
  } catch (error: any) {
    console.error(`[StatsController] ${label} pick error:`, error.message);
    return null;
  }
}

export const statsController = {
  getTopScorers: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /scorer|goals/i, 'topscorers') || (data as any)?.stats || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getTopScorers error:', error.message);
      sendError(res, 'Failed to fetch top scorers');
    }
  },

  getTopAssists: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /assist/i, 'topassists'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getTopAssists error:', error.message);
      sendError(res, 'Failed to fetch top assists');
    }
  },

  getCleanSheets: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /clean sheet|shutout/i, 'cleansheets'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getCleanSheets error:', error.message);
      sendError(res, 'Failed to fetch clean sheets');
    }
  },

  getMostGoals: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /scorer|goals/i, 'mostgoals') || (data as any)?.stats || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostGoals error:', error.message);
      sendError(res, 'Failed to fetch most goals');
    }
  },

  getMostShots: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /shot/i, 'mostshots'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostShots error:', error.message);
      sendError(res, 'Failed to fetch most shots');
    }
  },

  getMostPasses: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /pass/i, 'mostpasses'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostPasses error:', error.message);
      sendError(res, 'Failed to fetch most passes');
    }
  },

  getMostDribbles: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /dribble/i, 'mostdribbles'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostDribbles error:', error.message);
      sendError(res, 'Failed to fetch most dribbles');
    }
  },

  getMostTackles: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /tackle/i, 'mosttackles'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostTackles error:', error.message);
      sendError(res, 'Failed to fetch most tackles');
    }
  },

  getMostSaves: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /save|keeper/i, 'mostsaves'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostSaves error:', error.message);
      sendError(res, 'Failed to fetch most saves');
    }
  },

  getCards: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueDetail(leagueId(req));
      sendSuccess(res, pick(data, /card|yellow|red/i, 'cards'), 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getCards error:', error.message);
      sendError(res, 'Failed to fetch card statistics');
    }
  },
};
