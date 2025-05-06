import { wishlistType } from "@/types/wishlistType";
import { Schema, model, models } from "mongoose";


const wishlistSchema = new Schema<wishlistType>(
  {
    title: { type: String },
    image: {
      type: String,
    },
    blogId: { type: String },
    userId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const wishlist = models.wishlist || model("wishlist", wishlistSchema);
