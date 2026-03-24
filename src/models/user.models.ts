import mongoose, { Schema } from "mongoose"

export enum Role{
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface IUSER extends Document{
    _id:mongoose.Types.ObjectId
    email:string
    userName:string
    whatsAppNumber:string
    password:string
    roles:Role[]
}

const userSchema = new Schema<IUSER>({
    email:{type:String,unique:true,required:true},
    userName:{type:String,required:true},
    whatsAppNumber:{type:String,required:true},
    password:{type:String,required:true},
    roles:{
        type:[String],
        enum:Object.values(Role),
        default:[Role.USER]
    }
})

export const User = mongoose.model<IUSER>("User",userSchema)