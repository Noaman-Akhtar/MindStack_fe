import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel, LinkModel } from "./db";
import cors from "cors";
const app = express();
import { JWT_PASSWORD } from "./config";
import { middleware } from "./middleware/auth";
import { random } from "lodash";
import { cloudinaryRouter } from "./utils/cloudinary";

const MAX_JSON_SIZE = process.env.MAX_JSON_SIZE || "1mb";
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_JSON_SIZE }));
app.use(cors());

// declare module 'express' {
//   interface Request {
//     userId?: string;
//   }
// }

app.use("/api/v1/cloudinary",cloudinaryRouter);//importing upload route from cloudinary.ts 

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            name: username,
            password: password,
        });
        res.json({
            message: "User created successfully",
        });
    } catch (error) {
        res.status(411).json({ message: "user already exists" });
    }
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        name: username,
        password,
    });
    if (existingUser) {
        const token = jwt.sign(
            {
                id: existingUser._id,
            },
            JWT_PASSWORD!
        );

        res.json({
            token,
        });
    } else {
        res.status(403).json({
            message: "Incorrrect credentials",
        });
    }
});

app.post("/api/v1/content", middleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    const note = req.body.note;
    await ContentModel.create({
        link,
        type,
        note,
        title: req.body.title,
        richNoteDelta: req.body.richNoteDelta,

        userId: req.userId,
        tags: [],
    });
    res.json({
        message: "Content created successfully",
    });
});
app.get("/api/v1/content", middleware, async (req, res) => {
    const userId = req.userId;
    const content = await ContentModel.find({ userId: userId }).populate(
        "userId",
        "username"
    );
    res.json({ content });
});

app.delete("/api/v1/content/:id", middleware, async (req, res) => {
    const contentId = req.params.id;
    await ContentModel.deleteOne({
        _id: contentId,
        userId: req.userId,
    });
    res.json({ message: "Content deleted successfully" });
});

app.put("/api/v1/content/:id", middleware, async (req, res) => {
    const contentId = req.params.id;
    const { title, link, type, note, richNoteDelta } = req.body;
    const doc = await ContentModel.findOne({
        _id: contentId,
        userId: req.userId,
    });
    if (!doc) {
        res.status(404).json({ message: "Content not found" });
        return;
    }
    if (title !== undefined) doc.title = title;
    if (link !== undefined) doc.link = link;
    if (type !== undefined) doc.type = type;
    if (note !== undefined) doc.note = note;
    if (richNoteDelta !== undefined) doc.richNoteDelta = richNoteDelta;

    await doc.save();
    res.json({ message: "Content updated", content: doc });
});

app.post("/api/v1/brain/share", middleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        //@ts-ignore
        const existingLink = await LinkModel.findOne({ userId: req.userId });
        if (existingLink) {
            res.json({
                hash: existingLink.hash,
            });
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash,
        });
        res.json({
            hash,
        });
    } else {
        //@ts-ignore
        await LinkModel.deleteMany({ userId: req.userId });
        res.json({
            message: "Share disabled",
        });
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash,
    });
    if (!link) {
        res.status(411).json({
            message: "sorry incorrect url",
        });
        return;
    }
    const content = await ContentModel.find({
        userId: link.userId,
    });
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
        res.status(411).json({
            message: "user not found",
        });
        return;
    }
    res.json({
        username: user.name,
        content: content,
    });
});
const PORT = process.env.PORT || 3020;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
