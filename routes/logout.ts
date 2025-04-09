import { Request, Response, Router } from "express";
import prisma from "../src/prisma";
import { tokenAuthorization } from "../middleware/authorization";

const LogoutRouter = Router();

LogoutRouter.post("/", tokenAuthorization, async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ message: "No refresh token found" });
    }

    await prisma.user.updateMany({
      where: {
        refreshToken,
      },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default LogoutRouter;
