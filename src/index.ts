import express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import { ContentModel, UserModel,LinkModel } from "./db";
import cors from "cors";
const app = express();
import { JWT_PASSWORD } from "./config";

app.post("/api/v1/signup",async (req,res)=>{
const username= req.body.username;
const password= req.body.password;
try{
    await UserModel.create({
        name:username,
        password:password
    });
}
catch(error){
    res.status(411).json({message:"user already exists"});
}
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD! )

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})


app.post("/api/v1/content",async(req,res)=>{
    const link = req.body.link;
    const type = req.body.type;
await ContentModel.create({
    link,
    type,
    title:req.body.title,
    userId:req.userId,
    tags:[]
})
res.json({    message: "Content created successfully"
})

app.get("/api/v1/content",(req,res)=>{
const userId = req.userId;
const content=await ContentModel.find({userId:userId}).populate("userId","username")
res.json({content});
})

app.delete("/api/v1/content",async (req,res)=>{
const contentId = req.body.contentId;
await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId
})
res.json({ message: "Content deleted successfully" });
})

app.post("/api/v1/brain/share",async (req,res)=>{
const share = req.body.share;
if(share){
    const existingLink = await LinkModel.findOne({userId:req.userId});
    if(existingLink){
        res.json({
            hash: existingLink.hash
        })
        return;
    }
    const hash = random(10);
}

})

app.get("/api/v1/brain/:shareLink"){

}