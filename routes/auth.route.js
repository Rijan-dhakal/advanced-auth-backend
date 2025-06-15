import { Router } from "express";
import { forgotPassword, homePage, login, logout, resetPassword, signup, verifyEmail } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.get("/homepage", authorize, homePage)

authRouter.post("/signup", signup);

authRouter.post("/verify", verifyEmail);

authRouter.post("/login", login);

authRouter.post("/logout", logout)

authRouter.post("/forgot-password", forgotPassword) 

authRouter.post ("/reset-password", resetPassword)

export default authRouter;