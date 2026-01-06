import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { creditAmount, getAllTransactions } from '../controllers/transaction.controller.js';
import { debitAmount } from '../controllers/transaction.controller.js';
import { getTransactionsbyAccount } from '../controllers/transaction.controller.js';

const router = express.Router();

router.post('/credit', authMiddleware, creditAmount);
router.post('/debit', authMiddleware, debitAmount);
router.get('/', authMiddleware, getAllTransactions);
router.get('/:accountId', authMiddleware, getTransactionsbyAccount);

export default router;