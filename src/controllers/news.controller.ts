import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const newsController = {
  getAll: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a news API endpoint. News content is only available through their web interface.',
      articles: [],
    });
  },

  getLatest: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a news API endpoint.',
      articles: [],
    });
  },

  getTrending: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a news API endpoint.',
      articles: [],
    });
  },

  getByTeam: async (req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a news API endpoint.',
      teamId: req.params.id,
      articles: [],
    });
  },

  getByPlayer: async (req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a news API endpoint.',
      playerId: req.params.id,
      articles: [],
    });
  },

  getByCompetition: async (req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a news API endpoint.',
      competitionId: req.params.id,
      articles: [],
    });
  },
};
