import { Schema } from "mongoose";
import workoutsInterface from "../interfaces/workoutInterface";

function formatDate() {
  return new Date(Date.now()).toISOString().split("T")[0];
}

const workoutsSchema = new Schema<workoutsInterface>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    // author: { type: Schema.Types.ObjectId, required: true, ref: "users",  },
    author: { type: Schema.Types.ObjectId, required: true, immutable: true },
    tags: { type: [String], default: [] },
    createdAt: { type: String, default: formatDate, immutable: true },
    exercises: { type: Schema.Types.Mixed, default: [] },
  },
  { autoCreate: false, collection: "workouts", versionKey: false }
);

export default workoutsSchema;
