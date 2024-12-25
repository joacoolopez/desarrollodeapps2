import { Router } from 'express';
import { snsHandler } from '../controllers/sns.controller';
const router = Router();

router.post('/handler', snsHandler);

export default router;