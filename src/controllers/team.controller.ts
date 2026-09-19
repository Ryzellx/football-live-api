import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

const teamId = (req: Request) => String(req.params.id || '').trim();

export const teamController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getAllLeagues();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[TeamController] getAll error:', error.message);
      sendError(res, 'Failed to fetch teams directory');
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamDetail(id);
      if (!data) {
        sendError(res, `Team not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch team detail');
    }
  },

  getOverview: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getOverview error:', error.message);
      sendError(res, 'Failed to fetch team overview');
    }
  },

  getSquad: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamSquad(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getSquad error:', error.message);
      sendError(res, 'Failed to fetch team squad');
    }
  },

  getFixtures: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, { upcoming: data.upcoming, nextMatch: data.nextMatch }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getFixtures error:', error.message);
      sendError(res, 'Failed to fetch team fixtures');
    }
  },

  getResults: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamOverview(id);
      sendSuccess(res, { results: data.results, lastMatch: data.lastMatch, form: data.form }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getResults error:', error.message);
      sendError(res, 'Failed to fetch team results');
    }
  },

  getTransfers: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamDetail(id);
      sendSuccess(res, data?.transfers || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getTransfers error:', error.message);
      sendError(res, 'Failed to fetch team transfers');
    }
  },

  getInjuries: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamSquad(id);
      sendSuccess(res, { injuries: [], note: 'Injury list tidak tersedia terpisah dari upstream; lihat squad/byPosition', squad: data }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getInjuries error:', error.message);
      sendError(res, 'Failed to fetch team injuries');
    }
  },

  getSuspensions: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const detail = await fotmobService.getTeamDetail(id);
      const { suspensions } = fotmobService.teamInjuriesAndSuspensions(detail);
      sendSuccess(res, { suspensions, note: 'Suspension terpisah tidak tersedia dari upstream bila kosong' }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getSuspensions error:', error.message);
      sendError(res, 'Failed to fetch team suspensions');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const tournamentId = req.query.tournamentId as string | undefined;
      if (tournamentId) {
        const stats = await fotmobService.getTeamSeasonStats(id, tournamentId);
        sendSuccess(res, stats, 'fotmob', CACHE_MEDIUM);
        return;
      }
      const data = await fotmobService.getTeamDetail(id);
      sendSuccess(res, data?.stats || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch team statistics');
    }
  },

  getNews: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamNews(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getNews error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

  getVideos: async (req: Request, res: Response) => {
    try {
      const id = teamId(req);
      if (!id) {
        sendError(res, 'Team ID is required', 400);
        return;
      }
      const data = await fotmobService.getTeamDetail(id);
      sendSuccess(res, data?.overview || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getVideos error:', error.message);
      sendError(res, 'Failed to fetch team videos');
    }
  },
};
