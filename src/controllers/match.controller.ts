import { Request, Response } from 'express';
import { sofascoreService } from '../services/sofascore.service';
import { sendSuccess, sendError } from '../utils/response';
import { getToday, getTomorrow, getYesterday } from '../parsers';

export const matchController = {
  getLive: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getLiveMatches();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getLive error:', error.message);
      sendError(res, 'Failed to fetch live matches');
    }
  },

  getToday: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getScheduledEvents(getToday());
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getToday error:', error.message);
      sendError(res, 'Failed to fetch today\'s matches');
    }
  },

  getTomorrow: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getScheduledEvents(getTomorrow());
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getTomorrow error:', error.message);
      sendError(res, 'Failed to fetch tomorrow\'s matches');
    }
  },

  getYesterday: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getScheduledEvents(getYesterday());
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getYesterday error:', error.message);
      sendError(res, 'Failed to fetch yesterday\'s matches');
    }
  },

  getByDate: async (req: Request, res: Response) => {
    try {
      const date = String(req.params.date);
      const data = await sofascoreService.getScheduledEvents(date);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getByDate error:', error.message);
      sendError(res, 'Failed to fetch matches by date');
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchDetail(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch match detail');
    }
  },

  getEvents: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchEvents(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getEvents error:', error.message);
      sendError(res, 'Failed to fetch match events');
    }
  },

  getStatistics: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchStatistics(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getStatistics error:', error.message);
      sendError(res, 'Failed to fetch match statistics');
    }
  },

  getLineups: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchLineups(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getLineups error:', error.message);
      sendError(res, 'Failed to fetch match lineups');
    }
  },

  getPlayerStats: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchPlayerStats(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getPlayerStats error:', error.message);
      sendError(res, 'Failed to fetch player stats');
    }
  },

  getCommentary: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchCommentary(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getCommentary error:', error.message);
      sendError(res, 'Failed to fetch match commentary');
    }
  },

  getHighlights: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchHighlights(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getHighlights error:', error.message);
      sendError(res, 'Failed to fetch match highlights');
    }
  },

  getH2H: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchH2H(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getH2H error:', error.message);
      sendError(res, 'Failed to fetch head-to-head');
    }
  },

  getOdds: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchOdds(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getOdds error:', error.message);
      sendError(res, 'Failed to fetch match odds');
    }
  },

  getPredictions: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getMatchPredictions(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[MatchController] getPredictions error:', error.message);
      sendError(res, 'Failed to fetch match predictions');
    }
  },
};
