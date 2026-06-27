import { Router } from 'express';
import { injuryController } from '../controllers/injury.controller';

const router = Router();

router.get('/injuries', injuryController.getAll);
router.get('/injuries/team/:id', injuryController.getByTeam);
router.get('/injuries/player/:id', injuryController.getByPlayer);

export default router;
