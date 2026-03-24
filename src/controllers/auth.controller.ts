import type { Request, Response } from "express";
import { User, type IUSER } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "../utils/Token.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, whatsAppNumber, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({
        message: "Email already exist please check and try again..!",
      });

    const hashedPw = await bcrypt.hash(password,10)

    await User.create({
        email:email,
        userName:userName,
        whatsAppNumber:whatsAppNumber,
        password:hashedPw
    })

    return res.status(200).json({message:"Account created successfully"})
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const login = async(req:Request, res:Response)=>{
  try{
    const {email,password} = req.body

    const user = await User.findOne({email}).select("+password") as IUSER | null

    if(!user){
      return res.status(401).json({message:"Invalid credentials"})
    }

    const valid = await bcrypt.compare(password,user.password)

    if(!valid)return res.status(401).json({message:"Invalid credentials"})

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)
    const loggedInUserRole = user.roles

    return res.status(200).json({
      message:"Login succeful",
      data:{
        email:user.email,
        accessToken,
        refreshToken,
        loggedInUserRole
      }
    })
  }catch(err){
    return res.status(500).json({message:"Internal server error",err})
  }
}
