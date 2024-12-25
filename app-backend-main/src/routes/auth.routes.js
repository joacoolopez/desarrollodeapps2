import { Router } from 'express';
import { loginWithGoogle, googleCallback, logout} from '../controllers/auth.controller.js';

const router = Router();

router.get('/google', loginWithGoogle);
router.get('/google/callback', googleCallback);
router.get('/logout', logout);

export default router;