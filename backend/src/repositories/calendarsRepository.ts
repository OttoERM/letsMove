import calendarsInterface from "../db/interfaces/calendarInterface";
import calendarsSchema from "../db/schemas/calendarSchema";
import mongoose from "mongoose";

class calendarsRepository {
  private calendarModel: mongoose.Model<calendarsInterface>;

  constructor(dbInstance: mongoose.Connection) {
    this.calendarModel = dbInstance.model<calendarsInterface>(
      "calendars",
      calendarsSchema
    );
  }

  public async findCalendar(id: string) {
    let result = await this.calendarModel
      .findById(id)
      .catch((e) => new Error(e.message));

    return result;
  }

  public async insertCalendar(
    calendarData: calendarsInterface
  ): Promise<string | Error> {
    const calendar = new this.calendarModel({ ...calendarData });
    const result = await calendar.save().catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    return result.id;
  }

  public async updateCalendar(
    id: string,
    calendarData: calendarsInterface
  ): Promise<null | Error | calendarsInterface> {
    const result = await this.calendarModel
      .updateOne({ _id: id }, { ...calendarData })
      .catch((e) => new Error(e.message));

    console.log(result);

    if (result instanceof Error) return result;

    if (!result.matchedCount) return null;

    return calendarData;
  }

  public async deleteCalendar(id: string): Promise<Error | number | null> {
    const result = await this.calendarModel
      .deleteOne({ _id: id })
      .catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    if (result.acknowledged) return result.deletedCount;

    return null;
  }
}

export default calendarsRepository;
