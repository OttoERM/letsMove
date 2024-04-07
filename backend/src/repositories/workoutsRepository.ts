import workoutsInterface from "../db/interfaces/workoutInterface";
import workoutsSchema from "../db/schemas/workoutSchema";
import mongoose from "mongoose";
import { options } from "../controllers/queryManager";

class workoutsRepository {
  private workoutModel: mongoose.Model<workoutsInterface>;

  constructor(dbInstance: mongoose.Connection) {
    this.workoutModel = dbInstance.model<workoutsInterface>(
      "workouts",
      workoutsSchema
    );
  }

  public async findAllWorkouts(filter?: object, options?: options) {
    // return await this.workoutModel
    //   .find({ ...filter }, {}, { ...options })
    //   .catch((e) => new Error(e.message));
    return await this.workoutModel.aggregate(
      [
        { $match: { ...filter } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorInfo",
            pipeline: [{ $project: { username: 1 } }],
          },
        },
        { $skip: options?.skip ? options.skip : 0 },
        { $limit: options?.limit ? options.limit : 6 },
      ],
      {}
    );
  }

  public async findWorkout(id: string) {
    let result = await this.workoutModel
      .findById(id)
      .catch((e) => new Error(e.message));

    return result;
  }

  public async insertWorkout(
    workoutData: workoutsInterface
  ): Promise<string | Error> {
    const workout = new this.workoutModel({ ...workoutData });
    const result = await workout.save().catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    return result.id;
  }

  public async updateWorkout(
    id: string,
    workoutData: workoutsInterface
  ): Promise<null | Error | workoutsInterface> {
    const result = await this.workoutModel
      .updateOne({ _id: id }, { ...workoutData })
      .catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    if (!result.matchedCount) return null;

    return workoutData;
  }

  public async deleteWorkout(id: string): Promise<Error | number | null> {
    const result = await this.workoutModel
      .deleteOne({ _id: id })
      .catch((e) => new Error(e.message));

    if (result instanceof Error) return result;

    if (result.acknowledged) return result.deletedCount;

    return null;
  }
}

export default workoutsRepository;
