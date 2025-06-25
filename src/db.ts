import mongoose, {Schema, model} from 'mongoose';
import dotenv from 'dotenv';
if (!process.env.MongoDB_URL) {
  throw new Error("MongoDB_URL environment variable is missing!");
}
mongoose.connect(process.env.MongoDB_URL);

const UserSchema = new Schema({
    name:{type:String,required:true},
    password:{type:String,required:true},
});
export const UserModel = model('User', UserSchema);

const ContentSchema= new Schema({
   type:String,
    title:String,
    link:String,
tags:[{type:mongoose.Schema.Types.ObjectId}],
userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
})

 export const ContentModel = model('Content', ContentSchema);
 const linkSchema = new Schema({
    hash:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 })
 export const LinkModel = model('Link', linkSchema);