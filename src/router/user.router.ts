import * as controller from '../controller/user-auth.controller';
import { Router } from 'express';
import { checkAuth } from '../helper';

const router = Router();

router.post('/user-signup', controller.userSignup);
router.post('/user-login', controller.userLogin);
router.post('/user-logout', checkAuth, controller.userLogout);
router.put('/refresh-token', checkAuth, controller.refresh_token);

export default router;