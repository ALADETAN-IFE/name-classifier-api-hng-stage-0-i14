import { Router } from "express";
import { classifyName } from "./classify.controller";
import { methodNotAllowedHandler } from "@/middlewares";

const router = Router();

router.use(methodNotAllowedHandler(["GET"]));
router.get("/", classifyName);

export default router;
