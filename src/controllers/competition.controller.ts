import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM, CACHE_LONG } from '../middleware/cache';

function statBlock(data: any, header: string): any {
  const players = data?.stats?.players || [];
  return players.find((p: any) => new RegExp(header, 'i').test(p.header || '')) || null;
}

export const competitionController = {
  getAll: async (_req: Request, res: Response) => {
    try {
      const data = await fotmobService.getAllLeagues();
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[CompetitionController] getAll error:', error.message);
      sendError(res, 'Failed to fetch competitions');
    }
  },

  getDetail: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueDetail(id);
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[CompetitionController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch competition detail');
    }
  },

  getOverview: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueOverview(id, req.query.season as string | undefined);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getOverview error:', error.message);
      sendError(res, 'Failed to fetch competition overview');
    }
  },

  getStandings: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueTable(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getStandings error:', error.message);
      sendError(res, 'Failed to fetch standings');
    }
  },

  getFixtures: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const season = (req.query.season as string) || '2026/2027';
      const data = await fotmobService.getLeagueFixtures(id, season);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getFixtures error:', error.message);
      sendError(res, 'Failed to fetch competition fixtures');
    }
  },

  getResults: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueDetail(id);
      sendSuccess(res, data?.fixtures || data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getResults error:', error.message);
      sendError(res, 'Failed to fetch competition results');
    }
  },

  getTopScorers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueDetail(id);
      sendSuccess(res, statBlock(data, 'scorer|goals') || data?.stats?.players || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getTopScorers error:', error.message);
      sendError(res, 'Failed to fetch top scorers');
    }
  },

  getTopAssists: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueDetail(id);
      sendSuccess(res, statBlock(data, 'assist') || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getTopAssists error:', error.message);
      sendError(res, 'Failed to fetch top assists');
    }
  },

  getTopKeepers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueDetail(id);
      sendSuccess(res, statBlock(data, 'clean sheet|keeper|save') || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getTopKeepers error:', error.message);
      sendError(res, 'Failed to fetch top keepers');
    }
  },

  getCards: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);
      const data = await fotmobService.getLeagueDetail(id);
      sendSuccess(res, statBlock(data, 'card|yellow|red') || null, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getCards error:', error.message);
      sendError(res, 'Failed to fetch card rankings');
    }
  },
};
