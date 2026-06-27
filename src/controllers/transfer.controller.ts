import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const transferController = {
  getAll: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a global transfers listing endpoint. Use /api/team/:id/transfers for team-specific transfers.',
      transfers: [],
    });
  },

  getLatest: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a latest transfers endpoint. Use /api/team/:id/transfers for team-specific transfers.',
      transfers: [],
    });
  },

  getRumours: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a transfer rumours endpoint.',
      transfers: [],
    });
  },

  getOfficial: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide an official transfers listing endpoint. Use /api/team/:id/transfers for team-specific transfers.',
      transfers: [],
    });
  },
};
