import mongoose, { Schema, model } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
interface IUser {
  name: string;
  password: string;
}
if (!process.env.DATABASE_URL) {
  throw new Error("MongoDB_URL environment variable is missing!");
}
mongoose.connect(process.env.DATABASE_URL);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
const UserSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});
export const UserModel = model('User', UserSchema);

const ContentSchema = new Schema({
  type: String,
  title: String,
  link: String,
  note: String,
  richNoteDelta: Schema.Types.Mixed,
  documents: [
    {
      name: String,
      url: String,
      type:String,
      size:Number,
      cloudinaryId:String
      }
  ],


  tags: [{ type: mongoose.Schema.Types.ObjectId }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt:{type:Date,default:Date.now},
  updatedAt:{type:Date,default:Date.now}
});

export const ContentModel = model('Content', ContentSchema);


const linkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
})
export const LinkModel = model('Link', linkSchema);