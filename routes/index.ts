import { Router } from "express";
import RegisterRouter from "./register";
import LoginRouter from "./login";

const router = Router();

router.use("/register", RegisterRouter)
router.use('/login', LoginRouter)

export default router;
