import { NextFunction,Request,Response } from "express";
import jwt,{JwtPayload} from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
// interface MyPayload extends JwtPayload {
//   userId: string;
//  password : string;
// }

export const middleware =(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization;
    
    const decoded= jwt.verify(token as string, JWT_PASSWORD as string) as JwtPayload;
    if (!decoded) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    req.userId= (decoded as JwtPayload).id;
    next();

}