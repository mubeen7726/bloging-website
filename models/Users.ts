import { UserType } from "@/types/User"
import { Schema, model, models } from "mongoose"

const UserSchema = new Schema<UserType>(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    providerUserId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email:{
      type:String,
      unique:true,
    }
  },
  {
    timestamps: true,
  }
)

export const User = models.User || model("User", UserSchema)
