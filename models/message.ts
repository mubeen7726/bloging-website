import mongoose from "mongoose";
import { MessageType } from "@/types/Messagetype";

const MessageSchema = new mongoose.Schema<MessageType>({
  message: { type: String, required: true },
  email: { type: String, required: true },
});

export const Message =
  mongoose.models.Message ||
  mongoose.model<MessageType>("Message", MessageSchema);
export default Message;
