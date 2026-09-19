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
import toolsRoutes from './tools.routes';
import fotmobRoutes from './fotmob.routes';

const router = Router();

// Urutan penting: rute spesifik (match/team/player/...) dulu,
// kompat mentah FotMob terakhir agar tidak menimpa normalizer PRD.
router.use(matchRoutes);
router.use(competitionRoutes);
router.use(teamRoutes);
router.use(playerRoutes);
router.use(searchRoutes);
router.use(newsRoutes);
router.use(transferRoutes);
router.use(injuryRoutes);
router.use(statsRoutes);
router.use(toolsRoutes);
router.use(fotmobRoutes);

export default router;
