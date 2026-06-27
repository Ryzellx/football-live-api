import { Request, Response } from 'express';
import { sofascoreService } from '../services/sofascore.service';
import { sendSuccess, sendError } from '../utils/response';

export const competitionController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await sofascoreService.getCompetitions();
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getAll error:', error.message);
      sendError(res, 'Failed to fetch competitions');
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionDetail(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch competition detail');
    }
  },

  getStandings: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionStandings(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getStandings error:', error.message);
      sendError(res, 'Failed to fetch standings');
    }
  },

  getFixtures: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionEvents(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getFixtures error:', error.message);
      sendError(res, 'Failed to fetch competition fixtures');
    }
  },

  getResults: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionResults(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getResults error:', error.message);
      sendError(res, 'Failed to fetch competition results');
    }
  },

  getTopScorers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionTopScorers(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getTopScorers error:', error.message);
      sendError(res, 'Failed to fetch top scorers');
    }
  },

  getTopAssists: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionTopAssists(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getTopAssists error:', error.message);
      sendError(res, 'Failed to fetch top assists');
    }
  },

  getTopKeepers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionTopKeepers(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getTopKeepers error:', error.message);
      sendError(res, 'Failed to fetch top keepers');
    }
  },

  getCards: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await sofascoreService.getCompetitionCards(id);
      sendSuccess(res, data);
    } catch (error: any) {
      console.error('[CompetitionController] getCards error:', error.message);
      sendError(res, 'Failed to fetch card rankings');
    }
  },
};
