import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM } from '../middleware/cache';

export const transferController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10) || 50));
      const data = await fotmobService.getTransfers('all', limit);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getAll error:', error.message);
      sendError(res, 'Failed to fetch transfers');
    }
  },

  getLatest: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10) || 50));
      const data = await fotmobService.getTransfers('latest', limit);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getLatest error:', error.message);
      sendError(res, 'Failed to fetch latest transfers');
    }
  },

  getRumours: async (req: Request, res: Response) => {
    try {
      const data = await fotmobService.getTransfersRaw();
      const teamId = (req.query.teamId as string) || null;
      const allRumours: any[] = [];
      if (teamId) {
        try {
          const team = await fotmobService.getTeamDetail(teamId);
          const rumours = team?.transfers?.allRumours || team?.transfers?.data?.rumours || [];
          sendSuccess(res, { rumours, total: rumours.length }, 'fotmob', CACHE_MEDIUM);
          return;
        } catch {
          // fallthrough ke payload global
        }
      }
      sendSuccess(res, { rumours: allRumours, note: 'Rumor terpisah tidak tersedia dari upstream global; gunakan /api/team/:id/transfers untuk rumor per tim', transfers: data }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getRumours error:', error.message);
      sendError(res, 'Failed to fetch transfer rumours');
    }
  },

  getOfficial: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10) || 50));
      const data = await fotmobService.getTransfers('official', limit);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getOfficial error:', error.message);
      sendError(res, 'Failed to fetch official transfers');
    }
  },

  getLoans: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10) || 50));
      const data = await fotmobService.getTransfers('loans', limit);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getLoans error:', error.message);
      sendError(res, 'Failed to fetch loan transfers');
    }
  },

  getFree: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) || '50', 10) || 50));
      const data = await fotmobService.getTransfers('free', limit);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getFree error:', error.message);
      sendError(res, 'Failed to fetch free transfers');
    }
  },

  getMostExpensive: async (req: Request, res: Response) => {
    try {
      const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '20', 10) || 20));
      const raw = await fotmobService.getTransfersRaw();
      const list: any[] = Array.isArray(raw?.transfers) ? raw.transfers : [];
      const sorted = [...list]
        .filter((t: any) => typeof t?.amountEuroEstimated === 'number')
        .sort((a, b) => (b.amountEuroEstimated || 0) - (a.amountEuroEstimated || 0))
        .slice(0, limit);
      sendSuccess(res, { transfers: sorted, total: sorted.length }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[TransferController] getMostExpensive error:', error.message);
      sendError(res, 'Failed to fetch most expensive transfers');
    }
  },
};
