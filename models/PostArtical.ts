import { ArticlaType } from "@/types/ArticlaType";
import mongoose from "mongoose";
const PostSchema = new mongoose.Schema<ArticlaType>({
  title: String,
  description: String,
  imageUrl: String,
  imagePublicId: String,
  content: String,
  UserName: { type: String, required: true },
  UserImage: { type: String, required: true },
  live: { type: Boolean, required: true, default: true },
  category: String,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.Articalblog ||
  mongoose.model("Articalblog", PostSchema);
