import { Types } from "mongoose";

interface usersInterface {
  username: string;
  password: string;
  role: string;
  workoutsIds?: Types.ObjectId[];
  calendarId?: Types.ObjectId;
}

export default usersInterface;
