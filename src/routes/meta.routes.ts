import { Router } from 'express';
import { docsController } from '../controllers/docs.controller';

const router = Router();

router.get('/health', docsController.getHealth);
router.get('/docs', docsController.getDocs);

export default router;
