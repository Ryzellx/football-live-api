import { Router } from 'express';
import { searchController } from '../controllers/search.controller';

const router = Router();

router.get('/search', searchController.search);

export default router;
