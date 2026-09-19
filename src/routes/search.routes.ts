import { Router } from 'express';
import { searchController } from '../controllers/search.controller';

const router = Router();

router.get('/search', searchController.search);
router.get('/search/all', searchController.search);
router.get('/search/suggest', searchController.suggest);

export default router;
