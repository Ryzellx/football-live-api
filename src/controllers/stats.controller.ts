import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

const leagueId = (req: Request) => (req.query.leagueId as string) || (req.params.id as string) || '47';

function pick(data: any, pattern: RegExp) {
  try {
    const players = data?.stats?.players || [];
    return players.find((p: any) => pattern.test(p.header || '')) || null;
  } catch {
    return null;
  }
}

export const statsController = {
  getTopScorers: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Top scorer');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getTopScorers error:', error.message);
      sendError(res, 'Failed to fetch top scorers');
    }
  },

  getTopAssists: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Assist');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getTopAssists error:', error.message);
      sendError(res, 'Failed to fetch top assists');
    }
  },

  getCleanSheets: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Clean sheet');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getCleanSheets error:', error.message);
      sendError(res, 'Failed to fetch clean sheets');
    }
  },

  getMostGoals: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Goals per 90|Top scorer');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostGoals error:', error.message);
      sendError(res, 'Failed to fetch most goals');
    }
  },

  getMostShots: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Shot');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostShots error:', error.message);
      sendError(res, 'Failed to fetch most shots');
    }
  },

  getMostPasses: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Accurate pass|Pass');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostPasses error:', error.message);
      sendError(res, 'Failed to fetch most passes');
    }
  },

  getMostDribbles: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Dribble');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostDribbles error:', error.message);
      sendError(res, 'Failed to fetch most dribbles');
    }
  },

  getMostTackles: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Tackle');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostTackles error:', error.message);
      sendError(res, 'Failed to fetch most tackles');
    }
  },

  getMostSaves: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Save|Goals prevented');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getMostSaves error:', error.message);
      sendError(res, 'Failed to fetch most saves');
    }
  },

  getCards: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getLeagueStatFull(leagueId(req), 'Yellow|Red|card');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getCards error:', error.message);
      sendError(res, 'Failed to fetch card statistics');
    }
  },

  getLeaderboard: async (req: Request, res: Response) => {
    try {
      const id = leagueId(req);
      const metric = String(req.params.metric || req.query.metric || 'goals');
      const map: Record<string, string> = {
        goals: 'Top scorer',
        assists: 'Assist',
        rating: 'FotMob rating',
        xg: 'Expected goals \\(xG\\)',
        xa: 'Expected assist',
        shots: 'Shot',
        chances: 'Chances created|Big chances created',
        passes: 'Accurate pass',
        tackles: 'Tackle',
        interceptions: 'Interception',
        recoveries: 'Recover',
        dribbles: 'Dribble',
        cleansheets: 'Clean sheet',
        saves: 'Save',
        cards: 'Yellow|Red|card',
        minutes: 'Minutes played',
      };
      const header = map[metric.toLowerCase()] || metric;
      const detail: any = await fotmobService.getLeagueDetail(id);
      const found = (detail?.stats?.players || []).find((p: any) => new RegExp(header, 'i').test(String(p?.header || '')));
      if (!found) {
        sendError(res, `Metric not available: ${metric}`, 404);
        return;
      }
      const data = await fotmobService.getLeagueStatFull(id, header);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[StatsController] getLeaderboard error:', error.message);
      sendError(res, 'Failed to fetch leaderboard');
    }
  },
};

export { pick };
