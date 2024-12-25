import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck.controller.js';

const router = Router();

// Ruta para el healthcheck
router.get('/health', healthcheck);

export default router;
