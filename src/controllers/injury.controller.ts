import { Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

export const injuryController = {
  getAll: async (_req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Sofascore does not provide a global injuries listing endpoint. Use /api/team/:id/injuries for team-specific injuries.',
      injuries: [],
    });
  },

  getByTeam: async (req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Use /api/team/:id/injuries instead for team-specific injuries.',
      teamId: req.params.id,
      injuries: [],
    });
  },

  getByPlayer: async (req: Request, res: Response) => {
    sendSuccess(res, {
      message: 'Use /api/player/:id/injuries instead for player-specific injuries.',
      playerId: req.params.id,
      injuries: [],
    });
  },
};
