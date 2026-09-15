import { Router } from 'express';
import { liveStream } from '../controllers/stream.controller';

const router = Router();

router.get('/matches/live/stream', liveStream);

export default router;
