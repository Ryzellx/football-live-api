import { Router } from 'express';
import { transferController } from '../controllers/transfer.controller';

const router = Router();

router.get('/transfers', transferController.getAll);
router.get('/transfers/latest', transferController.getLatest);
router.get('/transfers/rumours', transferController.getRumours);
router.get('/transfers/official', transferController.getOfficial);
router.get('/transfers/loans', transferController.getLoans);
router.get('/transfers/free', transferController.getFree);
router.get('/transfers/most-expensive', transferController.getMostExpensive);

export default router;
