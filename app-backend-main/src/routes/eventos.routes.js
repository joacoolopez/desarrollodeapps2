import { Router } from 'express';
import { getEventos, postEvento, editEvento, getEvento, getImagen } from '../controllers/eventos.controller.js';
import multer from 'multer';
import upload from '../middlewares/multer.js';

const router = Router();

router.get('/', getEventos);
router.post('/', upload.single('imagenPrincipal'), postEvento);
router.put('/:idEvento', editEvento); 
router.get('/:idEvento', getEvento);
router.get('/imagen/:idEvento', getImagen);

export default router;
