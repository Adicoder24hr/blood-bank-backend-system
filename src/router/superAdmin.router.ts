import { Router } from "express";
import * as controller from "../controller";
import { checkAuth } from "../helper";

const router = Router();

router.post('/superAdmin-signup', controller.superAdminSignup);
router.post('/superAdmin-login', controller.superAdminLogin);
router.post('/superAdmin-logout', controller.superAdminLogout);
router.put('/refresh-token', checkAuth, controller.refreshToken);

///dashboard CRUD operations

router.get('/superAdmin-dashboard', controller.S_dashboard);
router.put('/update-superAdmin', controller.updateSuperAdmin);

export default router;