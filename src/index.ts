import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser"
import tokenRouter from "./routes/token.js";

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:8080",
        credentials:true,
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"]
    })
)
app.use("/sweet-rose/auth",authRouter)
app.use("/sweet-rose/token",tokenRouter)

mongoose
    .connect(MONGO_URI)
    .then(()=>{
        console.log("DB is connected")
    })
    .catch((err)=>{
        console.log("DB isnt conected : ",err)
        process.exit(1)
    })

    app.listen(PORT,()=>{
        console.log("Server is connected ",PORT)
    })

    export default app  