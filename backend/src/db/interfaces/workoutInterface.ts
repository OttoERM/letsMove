import { Types } from "mongoose";

type exercise = {
  activity: string;
  directions: string;
};

interface workoutsInterface {
  title: string;
  description: string;
  author: Types.ObjectId;
  tags?: Array<string>;
  createdAt?: string;
  exercises: exercise[];
}

export default workoutsInterface;
