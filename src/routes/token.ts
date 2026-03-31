import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { refreshToken } from "../controllers/token.controller.js";

const tokenRouter = Router()

tokenRouter.post("/refresh-token",refreshToken)

export default tokenRouter