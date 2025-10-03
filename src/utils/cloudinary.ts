
import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import  dotenv  from 'dotenv';
const cloudinaryRouter = Router();
dotenv.config();
cloudinaryRouter.post('/signature', async (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET!
  );
  res.json({ timestamp, signature });
});

export default cloudinaryRouter;