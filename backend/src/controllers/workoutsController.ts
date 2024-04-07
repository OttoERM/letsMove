import { Request, Response } from "express";
import workoutsRepository from "../repositories/workoutsRepository";
import { paginationOptions, queryManager } from "./queryManager";

enum filterParams {
  tags = "tags",
  "exercises.activity" = "exercises.activity",
}

let workouts: workoutsRepository;
const workoutsController = {
  init: function (workoutsInstance: workoutsRepository) {
    workouts = workoutsInstance;
  },

  getAllWorkouts: async (req: Request, res: Response) => {
    let qM = new queryManager(
      req.query,
      [filterParams.tags, filterParams["exercises.activity"]],
      [paginationOptions.limit, paginationOptions.skip]
    );

    console.log("filter:", qM.getFilter());

    const result = await workouts.findAllWorkouts(
      qM.getFilter(),
      qM.getOptions()
    );

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Request completed succesfully",
      },
      workouts: result,
    });
  },

  getWorkout: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid workout id",
        },
      });

    let result = await workouts.findWorkout(req.params.id);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "Workout id was not found",
        },
      });

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Request completed succesfully",
      },
      data: result,
    });
  },

  postWorkout: async (req: Request, res: Response) => {
    let result = await workouts.insertWorkout(req.body);

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(201).json({
      status: {
        success: true,
        message: "Inserted workout succesfully",
      },
      resource: `workouts/${result}`,
    });
  },

  patchWorkout: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid workout id",
        },
      });

    let result = await workouts.updateWorkout(req.params.id, req.body);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "Workout id was not found",
        },
      });

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(200).json({
      status: {
        success: true,
        message: "Updated workout succesfully",
      },
      updatedFields: result,
    });
  },

  deleteWorkout: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid workout id",
        },
      });

    let result = await workouts.deleteWorkout(req.params.id);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "Workout id wasn't found",
        },
      });

    if (result instanceof Error)
      return res.status(500).json({
        status: {
          success: false,
          message: result.message,
        },
      });

    return res.status(201).json({
      status: {
        success: true,
        message: "Deleted workout succesfully",
      },
      deletedCount: result,
    });
  },
};

export default workoutsController;
