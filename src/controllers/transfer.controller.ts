import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const transferController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTransfers();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[TransferController] getAll error:', error.message);
      sendError(res, 'Failed to fetch transfers');
    }
  },

  getLatest: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTransfers();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[TransferController] getLatest error:', error.message);
      sendError(res, 'Failed to fetch latest transfers');
    }
  },

  getRumours: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTransfers();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[TransferController] getRumours error:', error.message);
      sendError(res, 'Failed to fetch transfer rumours');
    }
  },

  getOfficial: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTransfers();
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[TransferController] getOfficial error:', error.message);
      sendError(res, 'Failed to fetch official transfers');
    }
  },
};
