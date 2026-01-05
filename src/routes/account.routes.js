import { createAccount } from "../controllers/accounts.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import express from "express";

const router = express.Router();

router.post('/', authMiddleware, createAccount);

export default router;