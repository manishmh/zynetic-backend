import { Response, Request, NextFunction } from "express";
import jwt,{ Secret } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;  
    }
  }
}

export const tokenAuthorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers['Authorization'] as string;

        if (!accessToken) {
            res.status(401).json({ message: "no access token" });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as Secret);
        console.log('decoded', decoded)
        req.user = decoded;
        next()
    } catch (error) {
        console.error(error)
        res.status(403).json({ message: "invalid access token"})
    }
}