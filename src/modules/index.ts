import { Router } from "express";
import V1Routes from "./v1";
import { classifyRoutes } from "./classify";

const router = Router();

router.use("/classify", classifyRoutes);
router.use("/v1", V1Routes);

export default router;
