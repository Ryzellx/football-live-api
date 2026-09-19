import { Request, Response } from 'express';
import { fotmobService } from '../services/fotmob.service';
import { sendSuccess, sendError } from '../utils/response';
import { CACHE_MEDIUM, CACHE_LONG } from '../middleware/cache';

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
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueDetail(id);
      if (!data) {
        sendError(res, `Competition not found: ${id}`, 404);
        return;
      }
      sendSuccess(res, data, 'fotmob', CACHE_LONG);
    } catch (error: any) {
      console.error('[CompetitionController] getDetail error:', error.message);
      sendError(res, 'Failed to fetch competition detail');
    }
  },

  getOverview: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueOverview(id, req.query.season as string | undefined);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getOverview error:', error.message);
      sendError(res, 'Failed to fetch competition overview');
    }
  },

  getStandings: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const scope = (req.query.scope as string) || 'all';
      if (!['all', 'home', 'away', 'form', 'xg'].includes(scope)) {
        sendError(res, 'scope must be one of all|home|away|form|xg', 400);
        return;
      }
      const data = await fotmobService.getLeagueTableNormalized(id, scope as any);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getStandings error:', error.message);
      sendError(res, 'Failed to fetch standings');
    }
  },

  getFixtures: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
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
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const season = (req.query.season as string) || '2026/2027';
      const fixtures: any = await fotmobService.getLeagueFixtures(id, season);
      const list: any[] = Array.isArray(fixtures) ? fixtures : fixtures?.allMatches || [];
      const results = list.filter((f: any) => f?.status?.finished === true || f?.notStarted === false);
      sendSuccess(res, { results, total: results.length }, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getResults error:', error.message);
      sendError(res, 'Failed to fetch competition results');
    }
  },

  getTopScorers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const full = (req.query.full as string) === '1';
      const data = await fotmobService.getLeagueStatFull(id, full ? 'Top scorer|Goals' : 'Top scorer');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getTopScorers error:', error.message);
      sendError(res, 'Failed to fetch top scorers');
    }
  },

  getTopAssists: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueStatFull(id, 'Assist');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getTopAssists error:', error.message);
      sendError(res, 'Failed to fetch top assists');
    }
  },

  getTopKeepers: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueStatFull(id, 'Clean sheet|Save|Goals prevented');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getTopKeepers error:', error.message);
      sendError(res, 'Failed to fetch top keepers');
    }
  },

  getCards: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueStatFull(id, 'Yellow|Red|card');
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getCards error:', error.message);
      sendError(res, 'Failed to fetch card rankings');
    }
  },

  getStats: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueStats(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getStats error:', error.message);
      sendError(res, 'Failed to fetch competition stats');
    }
  },

  getXgTable: async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || '').trim();
      if (!id) {
        sendError(res, 'Competition ID is required', 400);
        return;
      }
      const data = await fotmobService.getLeagueXGTable(id);
      sendSuccess(res, data, 'fotmob', CACHE_MEDIUM);
    } catch (error: any) {
      console.error('[CompetitionController] getXgTable error:', error.message);
      sendError(res, 'Failed to fetch xG table');
    }
  },
};
