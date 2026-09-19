import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';

export const toolsController = {
  getFifaRankings: async (_req: Request, res: Response) => {
    try {
      sendSuccess(res, fotmobService.fifaRankingsStub(), 'fotmob');
    } catch (error: any) {
      sendError(res, 'Failed to fetch FIFA rankings');
    }
  },

  getTeamOfTheWeek: async (_req: Request, res: Response) => {
    try {
      sendSuccess(res, fotmobService.teamOfTheWeekStub(), 'fotmob');
    } catch (error: any) {
      sendError(res, 'Failed to fetch team of the week');
    }
  },

  getPredictor: async (_req: Request, res: Response) => {
    try {
      sendSuccess(res, fotmobService.predictorStub(), 'fotmob');
    } catch (error: any) {
      sendError(res, 'Failed to fetch predictor info');
    }
  },

  getLineupBuilder: async (_req: Request, res: Response) => {
    try {
      sendSuccess(res, fotmobService.lineupBuilderMeta(), 'fotmob');
    } catch (error: any) {
      sendError(res, 'Failed to fetch lineup builder meta');
    }
  },

  getTv: async (req: Request, res: Response) => {
    try {
      const matchId = String(req.query.matchId || '');
      if (!matchId) {
        sendError(res, 'matchId query required', 400);
        return;
      }
      const data = await fotmobService.getTvListings(matchId, (req.query.countryCode as string) || 'ID');
      sendSuccess(res, data, 'fotmob');
    } catch (error: any) {
      sendError(res, 'Failed to fetch TV schedule');
    }
  },
};
