import { Router } from "express";
import { loginSchema, registerSchema } from "../validate/auth.schema.js";
import { validate } from "../middleware/validate.middleware.js";
import { login, register } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/register",validate(registerSchema),register)
authRouter.post("/login",validate(loginSchema),login)

export default authRouter