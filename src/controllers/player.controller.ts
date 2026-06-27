import { Request, Response } from 'express';
import { sofascoreService } from '../services/sofascore.service';
import { sendSuccess, sendError } from '../utils/response';

export const playerController = {
  getAll: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a player listing endpoint. Use /api/search?q=<player> to find players.',
    });
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerDetail(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch player detail');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerStatistics(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch player statistics');
    }
  },

  getMatches: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerMatches(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getMatches error:', error.message);
      sendError(res, 'Failed to fetch player matches');
    }
  },

  getSeason: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerSeason(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getSeason error:', error.message);
      sendError(res, 'Failed to fetch player season stats');
    }
  },

  getHistory: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerHistory(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getHistory error:', error.message);
      sendError(res, 'Failed to fetch player history');
    }
  },

  getTransfers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerTransfers(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getTransfers error:', error.message);
      sendError(res, 'Failed to fetch player transfers');
    }
  },

  getInjuries: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerInjuries(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getInjuries error:', error.message);
      sendError(res, 'Failed to fetch player injuries');
    }
  },

  getNews: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getPlayerNews(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[PlayerController] getNews error:', error.message);
      sendError(res, 'Failed to fetch player news');
    }
  },
};
