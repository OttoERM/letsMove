import { Schema } from "mongoose";
import chatsInterface from "../interfaces/chatsInterface";

const chatsSchema = new Schema<chatsInterface>(
  {
    emisor: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { autoCreate: false, collection: "chats", versionKey: false }
);

export default chatsSchema;
