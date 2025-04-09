import dotenv from "dotenv";
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../src/prisma";

dotenv.config();

const RefreshRouter = Router();

RefreshRouter.post('/', async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            res.status(401).json({ message: "no refresh token" });
        }

        const refreshCompare = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: refreshCompare.userId },
        });

        if (user?.refreshToken !== token) {
            res.status(403).json({ message: "invalid refresh token" });
        }

        const newAccessToken = jwt.sign({ userId: user?.id, email: user?.email }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });

        res.cookie("accessToken", newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });

        res.status(200).json({ message: "access token generated" });

    } catch (err) {
        res.status(403).json({ message: "Server error, Invalid refresh token" });
    }
});

export default RefreshRouter;
