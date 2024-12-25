import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { postEntrada, pagarEntrada, comprarEntrada, getPublicaciones, deletePublicacion } from '../controllers/mercadosecundario.controller.js';
const router = Router();

router.post('/entrada', authMiddleware, postEntrada);
router.post('/comprarEntrada', authMiddleware, comprarEntrada)
//router.post('/pagarEntrada', authMiddleware, pagarEntrada)
router.get('/', getPublicaciones)
router.delete('/publicacion/:idEntrada',authMiddleware, deletePublicacion)


export default router;