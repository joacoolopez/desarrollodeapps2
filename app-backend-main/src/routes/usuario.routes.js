import { Router } from 'express';
import { getImagen} from '../controllers/usuario.controller.js';
const router = Router();

router.get('/imagen/:idUsuario', getImagen);

export default router;