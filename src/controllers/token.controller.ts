import type { Request,Response } from "express"
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { signAccessToken, signRefreshToken } from "../utils/Token.js";



export const refreshToken = async(req:Request,res:Response)=>{
 try{
    const token = req.cookies.refreshToken
    if(!token) return res.status(401).json({message:"No refresh token"})

        const decoded = jwt.verify(token,process.env.REFRESH_SECRET as string)as {sub:string}

        const user = await User.findById(decoded.sub)

        if(!user) return res.status(404).json({message:"User not found"})

        const newAccessToken = signAccessToken(user)

        res.cookie("accessToken",newAccessToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            path:"/",
            maxAge: 1000 * 60 * 5,
        })

        return res.status(200).json({ message: "Token refreshed" });
 }catch(err){
        return res.status(401).json({ message: "Invalid refresh token" });
 }
}