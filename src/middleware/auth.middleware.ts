import type{ Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
    console.log("Cookies: ",req.cookies)
  try {
    const token = req.cookies.accessToken;

    if (!token){
        console.log("No Access token found")
        return res.status(401).json({ message: "Unauthorized" });
}
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = payload; 
    next();
  } catch (err) {
    console.log("JWT verify failed: ",err)
    return res.status(401).json({ message: "Unauthorized" });
  }
};