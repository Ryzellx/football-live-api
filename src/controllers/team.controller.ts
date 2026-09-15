import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

const teamId = (req: Request) => String(req.params.id);

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
      const data = await fotmobService.getTeamDetail(teamId(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch team detail');
    }
  },

  getOverview: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamOverview(teamId(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getOverview error:', error.message);
      sendError(res, 'Failed to fetch team overview');
    }
  },

  getSquad: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamDetail(teamId(req));
      sendSuccess(res, data?.squad ?? null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getSquad error:', error.message);
      sendError(res, 'Failed to fetch team squad');
    }
  },

  getFixtures: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamOverview(teamId(req));
      sendSuccess(res, { upcoming: data.upcoming, nextMatch: data.nextMatch }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getFixtures error:', error.message);
      sendError(res, 'Failed to fetch team fixtures');
    }
  },

  getResults: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamOverview(teamId(req));
      sendSuccess(res, { results: data.results, lastMatch: data.lastMatch, form: data.form }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getResults error:', error.message);
      sendError(res, 'Failed to fetch team results');
    }
  },

  getTransfers: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamDetail(teamId(req));
      sendSuccess(res, data?.transfers || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getTransfers error:', error.message);
      sendError(res, 'Failed to fetch team transfers');
    }
  },

  getInjuries: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamDetail(teamId(req));
      sendSuccess(res, data?.squad || data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getInjuries error:', error.message);
      sendError(res, 'Failed to fetch team injuries');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamDetail(teamId(req));
      sendSuccess(res, data?.stats || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch team statistics');
    }
  },

  getNews: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamNews(teamId(req));
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getNews error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

  getVideos: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTeamDetail(teamId(req));
      sendSuccess(res, data?.overview || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TeamController] getVideos error:', error.message);
      sendError(res, 'Failed to fetch team videos');
    }
  },
};
