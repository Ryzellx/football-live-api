import { Router } from 'express';
import { fotmobController } from '../controllers/fotmob.controller';

const router = Router();

// Match details from FotMob
router.get('/match/:id', fotmobController.getMatchDetail);

// Search matches on FotMob
router.get('/search', fotmobController.search);

export default router;
