import usersInterface from "../db/interfaces/usersInterface";
import usersSchema from "../db/schemas/usersSchema";
import calendarsRepository from "./calendarsRepository";
import mongoose from "mongoose";

class usersRepository {
  private usersModel: mongoose.Model<usersInterface>;
  private calendarInyector: calendarsRepository;

  constructor(
    dbInstance: mongoose.Connection,
    calendarInstance: calendarsRepository
  ) {
    this.usersModel = dbInstance.model<usersInterface>("users", usersSchema);
    this.calendarInyector = calendarInstance;
  }

  public async findAllUsers(filter?: object, options?: object) {
    return await this.usersModel
      .find({ ...filter }, {}, { ...options })
      .catch((e) => new Error(e.message));
  }

  public async findUser(id: string) {
    let result = await this.usersModel
      .findById(id)
      .catch((e) => new Error(e.message));

    return result;
  }

  public async findUserWorkouts(id: string) {
    let result = await this.usersModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "workouts",
          localField: "workoutsIds",
          foreignField: "_id",
          as: "workoutInfo",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorInfo",
                pipeline: [{ $project: { username: 1 } }],
              },
            },
            {
              $project: {
                title: 1,
                description: 1,
                authorInfo: 1,
                exercises: 1,
              },
            },
          ],
        },
      },
      { $project: { password: 0 } },
    ]);

    return result;
  }

  public async findTrainerWorkouts(id: string) {
    let result = await this.usersModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "workouts",
          localField: "_id",
          foreignField: "author",
          as: "workoutInfo",
          pipeline: [{ $project: { author: 0 } }],
        },
      },
      { $project: { password: 0 } },
    ]);

    return result;
  }

  public async insertUser(userData: usersInterface): Promise<string | Error> {
    if (userData.role == "user") {
      const calendarResult = await this.calendarInyector
        .insertCalendar({
          calendar: {
            su: [],
            mo: [],
            tu: [],
            we: [],
            th: [],
            fr: [],
            sa: [],
          },
        })
        .catch((e) => new Error(e.message));

      if (calendarResult instanceof Error) return calendarResult;

      userData.calendarId = new mongoose.Types.ObjectId(calendarResult);
    }

    const userResult = await this.usersModel.collection.insertOne({
      ...userData,
    });

    if (userResult instanceof Error) return userResult;

    return userResult.insertedId.toString();
  }

  public async updateUser(
    id: string,
    workoutData: usersInterface
  ): Promise<null | Error | usersInterface> {
    const result = await this.usersModel
      .updateOne({ _id: id }, { ...workoutData })
      .catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    if (!result.matchedCount) return null;

    return workoutData;
  }

  public async deleteUser(id: string): Promise<Error | number | null> {
    const result = await this.usersModel
      .deleteOne({ _id: id })
      .catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    if (result.acknowledged) return result.deletedCount;

    return null;
  }
}

export default usersRepository;
