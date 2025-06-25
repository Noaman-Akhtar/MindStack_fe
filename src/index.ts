import express from "express";
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import { ContentModel, UserModel, LinkModel } from "./db";
import cors from "cors";
const app = express();
import { JWT_PASSWORD } from "./config";
import { middleware } from "./middleware/auth";
import { random } from "lodash";
app.use(express.json());
app.use(cors());
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            name: username,
            password: password
        });
    }
    catch (error) {
        res.status(411).json({ message: "user already exists" });
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
        }, JWT_PASSWORD!)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})


app.post("/api/v1/content",middleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "Content created successfully"
    })
})
    app.get("/api/v1/content",middleware, async (req, res) => {
        const userId = req.userId;
        const content = await ContentModel.find({ userId: userId }).populate("userId", "username")
        res.json({ content });
    })

    app.delete("/api/v1/content",middleware, async (req, res) => {
        const contentId = req.body.contentId;
        await ContentModel.deleteMany({
            _id: contentId,
            userId: req.userId
        })
        res.json({ message: "Content deleted successfully" });
    })

    app.post("/api/v1/brain/share",middleware, async (req, res) => {
        const share = req.body.share;
        if (share) {
            const existingLink = await LinkModel.findOne({ userId: req.userId });
            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                userId: req.userId,
                hash: hash
            })
            res.json({
                hash
            })
        } else {
            await LinkModel.deleteMany({ userId: req.userId });
            res.json({
                message: "Share disabled"
            })
        }

    })

    app.get("/api/v1/brain/:shareLink", async (req, res) => {
        const hash = req.params.shareLink;
        const link = await LinkModel.findOne({
            hash
        });
        if (!link) {
            res.status(411).json({
                message: "sorry incorrect url"
            })
            return;
        }
        const content = await ContentModel.find({
            userId: link.userId
        })
        const user = await UserModel.findOne({ _id: link.userId })

        if (!user) {
            res.status(411).json({
                message: "user not found"
            })
            return;

        }
        res.json({
            username: user.name,
            content: content
        })
    })
