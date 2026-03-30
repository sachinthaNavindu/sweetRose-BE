import { Router } from "express";
import { loginSchema, registerSchema } from "../validate/auth.schema.js";
import { validate } from "../middleware/validate.middleware.js";
import { login, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register",validate(registerSchema),register)
authRouter.post("/login",validate(loginSchema),login)
authRouter.get("/me",authenticate,me)
export default authRouter