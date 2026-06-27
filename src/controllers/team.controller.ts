import { Request, Response } from 'express';
import { sofascoreService } from '../services/sofascore.service';
import { sendSuccess, sendError } from '../utils/response';

export const teamController = {
  getAll: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a team listing endpoint. Use /api/search?q=<team> to find teams.',
    });
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamDetail(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch team detail');
    }
  },

  getSquad: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamSquad(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getSquad error:', error.message);
      sendError(res, 'Failed to fetch team squad');
    }
  },

  getFixtures: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamFixtures(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getFixtures error:', error.message);
      sendError(res, 'Failed to fetch team fixtures');
    }
  },

  getResults: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamResults(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getResults error:', error.message);
      sendError(res, 'Failed to fetch team results');
    }
  },

  getTransfers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamTransfers(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getTransfers error:', error.message);
      sendError(res, 'Failed to fetch team transfers');
    }
  },

  getInjuries: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamInjuries(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getInjuries error:', error.message);
      sendError(res, 'Failed to fetch team injuries');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamStatistics(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch team statistics');
    }
  },

  getNews: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamNews(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getNews error:', error.message);
      sendError(res, 'Failed to fetch team news');
    }
  },

  getVideos: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getTeamVideos(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[TeamController] getVideos error:', error.message);
      sendError(res, 'Failed to fetch team videos');
    }
  },
};
