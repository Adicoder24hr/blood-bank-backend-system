import * as controller from '../controller/admin-auth.controller';
import { Router } from 'express';
import { checkAuth } from '../helper';

const router = Router();

router.post('/admin-signup', controller.adminSignup);
router.post('/admin-login', controller.adminLogin);
router.post('/admin-logout', controller.adminLogout);
router.put('/refresh-token', checkAuth, controller.refreshToken);
export default router;