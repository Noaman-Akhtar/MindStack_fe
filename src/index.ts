import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel, LinkModel } from "./db";
import cors from "cors";
const app = express();
import { JWT_PASSWORD } from "./config";
import { middleware } from "./middleware/auth";
import { random } from "lodash";
import cloudinaryRouter from './utils/cloudinary';
import { upsertToPinecone, deleteFromPinecone, searchInPinecone } from './utils/pinecone';
import { buildEmbeddingText } from "./utils/textExtractor";
import { Pinecone } from "@pinecone-database/pinecone";

const MAX_JSON_SIZE = process.env.MAX_JSON_SIZE || "1mb";
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ extended: true, limit: MAX_JSON_SIZE }));
app.use(cors());

// declare module 'express' {
//   interface Request {
//     userId?: string;
//   }
// }

app.use('/api/v1/cloudinary', cloudinaryRouter);

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
    const { link, type, note, title, richNoteDelta } = req.body;
    const documents = req.body.documents;
    // Runtime diagnostics to help debug incorrect payload shape
    // console.log("[CREATE_CONTENT] userId=", req.userId, "documents typeof=", typeof documents, Array.isArray(documents) ? `array(length=${documents.length})` : 'not-array');
    try {
        const doc = await ContentModel.create({
            link,
            type,
            note,
            title,
            richNoteDelta,
            documents: Array.isArray(documents) ? documents : (documents ? [documents] : []),
            userId: req.userId,
            tags: [],
        });

        const embeddingText = buildEmbeddingText({
            title,
            note,
            richNoteDelta,
            documents: Array.isArray(documents) ? documents : (documents ? [documents] : []),
        });

        await upsertToPinecone({
            userId: req.userId!,
            contentId: doc._id.toString(),
            embeddingText: embeddingText,
            metadata: {
                title,
                type
            }
        });

        res.json({
            message: "Content created successfully",
            id: doc._id
        });
    } catch (e: any) {
        // console.error("[CREATE_CONTENT][ERROR]", e?.message, e?.errors || e);
        res.status(400).json({ message: "Content validation failed", error: e?.message, details: e?.errors });
        return;
    }
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
    deleteFromPinecone(req.userId!,contentId).catch(err =>{
        console.error('Failed to delete from Pinecone',err);
    });

    res.json({ message: "Content deleted successfully" });
});

app.put("/api/v1/content/:id", middleware, async (req, res) => {
    const contentId = req.params.id;
    const { title, link, type, note, richNoteDelta, documents } = req.body;
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
    if (documents !== undefined) doc.documents = documents;
    await doc.save();
    //for pinecone embedding text updating 
    const embeddingText = buildEmbeddingText({
        title: doc.title ?? undefined,
        note: doc.note ?? undefined,
        richNoteDelta: doc.richNoteDelta,
        documents: doc.documents,
    });

    await upsertToPinecone({
        userId: req.userId!,
        contentId: doc._id.toString(),
        embeddingText: embeddingText,
        metadata: {
            title: doc.title || 'Untitled',
            type: doc.type || 'random'
        }
    });
    res.json({ message: "Content updated", content: doc });
});

app.post("/api/v1/search",middleware,async(req,res)=>{
    const {query} = req.body;
    if(!query || !query.trim()){
     res.status(400).json({error:'Query is required'});
     return;
    }
    try{
        const pineconeResults = await searchInPinecone(req.userId!,query);
        console.log(`Found ${pineconeResults.length} Pinecone results`);

        if(pineconeResults.length === 0){
             res.json({results:[]});
             return;
        }  

       
const results = pineconeResults
      .map((h: any) => ({
        _id: String(h.id ?? h._id),
        score: Number(h.score ?? h._score),
      }))
      .filter(r => r._id && !Number.isNaN(r.score));

    res.json({ results, count: results.length, query });
    return;
  } catch (error: any) {
    console.error("Search Error:", error);
    res.status(500).json({ error: "Search failed", details: error.message });
    return;
  }
});
// ...exis
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