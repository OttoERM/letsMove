import { Types } from "mongoose";

type exercise = {
  workout: Types.ObjectId;
  time: string;
};

type weekdays = {
  su: exercise[];
  mo: exercise[];
  tu: exercise[];
  we: exercise[];
  th: exercise[];
  fr: exercise[];
  sa: exercise[];
};

interface calendarsInterface {
  calendar: weekdays;
}

export default calendarsInterface;
