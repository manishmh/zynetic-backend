import { Router } from "express";
import RegisterRouter from "./register";
import LoginRouter from "./login";
import RefreshRouter from "./refresh-token";
import ProductsRouter from "./products";
import validateRouter from "./validate";
import LogoutRouter from "./logout";

const router = Router();

router.use("/register", RegisterRouter)
router.use('/login', LoginRouter)
router.use('/logout', LogoutRouter)
router.use('/refresh-token', RefreshRouter)
router.use('/products', ProductsRouter)
router.use('/validate', validateRouter)

export default router;
