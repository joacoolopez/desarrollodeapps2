import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { comprarEntradas, pagarEntradas, getEntradasPorUsuario, transferirEntrada, devolverEntrada } from '../controllers/entradas.controller.js';
const router = Router();


router.post('/', authMiddleware, comprarEntradas)
router.post('/pagar', pagarEntradas)
router.get('/', authMiddleware, getEntradasPorUsuario)
router.post('/transferir', transferirEntrada)
router.post('/devolver', authMiddleware, devolverEntrada);


export default router;