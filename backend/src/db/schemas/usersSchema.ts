import mongoose, { Schema } from "mongoose";
import usersInterface from "../interfaces/usersInterface";

const usersSchema = new Schema<usersInterface>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    workoutsIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
    },
    calendarId: { type: Schema.Types.ObjectId, required: false },
  },
  { autoCreate: false, collection: "users", versionKey: false }
);

export default usersSchema;
