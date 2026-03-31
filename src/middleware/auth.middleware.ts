import type{ Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token){
        return res.status(401).json({ message: "Unauthorized" });
}
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};