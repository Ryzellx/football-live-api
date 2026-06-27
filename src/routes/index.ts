import { Router } from 'express';
import matchRoutes from './match.routes';
import competitionRoutes from './competition.routes';
import teamRoutes from './team.routes';
import playerRoutes from './player.routes';
import searchRoutes from './search.routes';
import newsRoutes from './news.routes';
import transferRoutes from './transfer.routes';
import injuryRoutes from './injury.routes';
import statsRoutes from './stats.routes';
import fotmobRoutes from './fotmob.routes';

const router = Router();

router.use(matchRoutes);
router.use('/fotmob', fotmobRoutes);
router.use(competitionRoutes);
router.use(teamRoutes);
router.use(playerRoutes);
router.use(searchRoutes);
router.use(newsRoutes);
router.use(transferRoutes);
router.use(injuryRoutes);
router.use(statsRoutes);

export default router;
