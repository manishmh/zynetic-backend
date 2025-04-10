import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import prisma from "../src/prisma";
import { generateDummyProducts } from '../src/constant';

dotenv.config();

const LoginRouter = Router();

LoginRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "email and password are required" });
    } else {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        res.status(400).json({ message: "user with this credentials does not exist" });
      } else {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          res.status(401).json({ message: "incorrect credentials" });
        } else {
          const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '15m' });
          const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string,{ expiresIn: '30d' });

          await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
          });

          const existingProducts = await prisma.product.findFirst({
            where: { userId: user.id }
          });

          if (!existingProducts) {
            const products = generateDummyProducts(user.id);
            await prisma.product.createMany({ data: products });
          }

          res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
          res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

          res.status(200).json({
            message: "login successful",
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            }
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "something went wrong." });
  }
});


export default LoginRouter;