import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { config } from '../config/env';
import { sendSuccess, sendError } from '../utils/response';

export const homeController = {
  // GET /api/home — 1 panggilan untuk layar utama (jadwal hari ini + live + trending + transfer)
  getHome: async (req: Request, res: Response) => {
    try {
      const timezone = (req.query.timezone as string) || config.defaultTimezone;
      const ccode3 = (req.query.ccode3 as string) || config.defaultCcode3;
      const data = await fotmobService.getHome(timezone, ccode3);
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      console.error('[Home] error:', error.message);
      sendError(res, 'Failed to fetch home feed');
    }
  },
};
