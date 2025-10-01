
import {v2 as cloudinary} from 'cloudinary'
import multer from "multer";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
export const upload = multer({dest:"uploads/"});

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,

});

export const cloudinaryRouter = express.Router();

cloudinaryRouter.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "second-brain",
            resource_type: "auto",
        });

        res.json({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            resource_type: result.resource_type,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Cloudinary upload failed" });
    }
});