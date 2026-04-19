import type { Request, Response } from "express";
import { User, type IUSER } from "../models/user.models.js";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../utils/Token.js";
import type { AuthRequest } from "../types/auth.js";

export const me = async (req: any, res: Response) => {
  const user = await User.findById(req.user.sub).select("-password");

  if (!user) { 
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    user: {
      name: user.userName,
      email: user.email,
      id: user._id,
      phone:user.whatsAppNumber
    },
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, whatsAppNumber, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({
        message: "Email already exist please check and try again..!",
      });

    const hashedPw = await bcrypt.hash(password, 10);

    await User.create({
      email: email,
      userName: userName,
      whatsAppNumber: whatsAppNumber,
      password: hashedPw,
    });

    return res.status(200).json({ message: "Account created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = (await User.findOne({ email }).select(
      "+password",
    )) as IUSER | null;

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path:"/",
      maxAge: 1000 * 60 * 60 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path:"/",
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({
      message: "Login successful",
      user:{
        name:user.userName,
        email:user.email,
        id:user._id,
        phone:user.whatsAppNumber,
        roles: user.roles
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
};

export const updateUser = async(req:AuthRequest,res:Response)=>{
  try{
    const userId = req.user?.sub

    const {userName,email,whatsAppNumber} = req.body

    const user = await User.findById(userId)

    if(!user){
      return res.status(404).json({message:"User not found"})
    }

    user.userName = userName
    user.whatsAppNumber = whatsAppNumber
    
    await user.save()

    return res.status(200).json({
      message:"User updated succefully",
      user:{
        name:user.userName,
        email:user.email,
        id:user._id,
        phone:user.whatsAppNumber
      },
    })
  }catch(err){
    return res.status(500).json({
      message:"Internal server error",
      err
    })
  }
}
