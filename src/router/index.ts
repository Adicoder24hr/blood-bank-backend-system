import { Router } from "express";
import  adminRoute  from "./admin.router"
import userRoute from "./user.router"
import superAdminRoute from "./superAdmin.router"

const router = Router();

router.use("/user", userRoute);
router.use("/admin", adminRoute);
router.use("/superAdmin", superAdminRoute);

export default router;