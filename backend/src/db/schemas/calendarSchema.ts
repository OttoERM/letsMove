import { Schema } from "mongoose";
import calendarsInterface from "../interfaces/calendarInterface";

const calendarsSchema = new Schema<calendarsInterface>(
  {
    calendar: {
      su: { type: [Schema.Types.Mixed], required: true, default: [] },
      mo: { type: [Schema.Types.Mixed], required: true, default: [] },
      tu: { type: [Schema.Types.Mixed], required: true, default: [] },
      we: { type: [Schema.Types.Mixed], required: true, default: [] },
      th: { type: [Schema.Types.Mixed], required: true, default: [] },
      fr: { type: [Schema.Types.Mixed], required: true, default: [] },
      sa: { type: [Schema.Types.Mixed], required: true, default: [] },
    },
  },
  { autoCreate: false, collection: "calendars", versionKey: false }
);

export default calendarsSchema;
