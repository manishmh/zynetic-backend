import { Request, Response, Router } from "express";
import prisma from "../src/prisma";
import bcrypt from 'bcrypt'

const RegisterRouter = Router();

RegisterRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      res.status(409).json({ message: "user already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword }, 
    });

    res.status(201).json({ message: "user created successfully", user: newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default RegisterRouter;
