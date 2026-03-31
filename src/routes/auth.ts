import { Router } from "express";
import { loginSchema, registerSchema, updateUserSchema } from "../validate/auth.schema.js";
import { validate } from "../middleware/validate.middleware.js";
import { login, me, register, updateUser } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register",validate(registerSchema),register)
authRouter.post("/login",validate(loginSchema),login)
authRouter.get("/me",authenticate,me)
authRouter.post("/updateUser",authenticate,validate(updateUserSchema),updateUser)
export default authRouter