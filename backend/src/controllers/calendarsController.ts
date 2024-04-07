import { Request, Response } from "express";
import calendarsRepository from "../repositories/calendarsRepository";
// import { options, queryManager } from "./queryManager";

// enum filterParams {
//   tags = "tags",
//   "exercises.activity" = "exercises.activity",
// }

let calendars: calendarsRepository;
const calendarsController = {
  init: function (calendarsInstance: calendarsRepository) {
    calendars = calendarsInstance;
  },

  getCalendar: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid calendar id",
        },
      });

    let result = await calendars.findCalendar(req.params.id);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "Calendar id was not found",
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

  patchCalendar: async (req: Request, res: Response) => {
    if (req.params.id.length != 24)
      return res.status(401).json({
        status: {
          success: false,
          message: "Invalid calendar id",
        },
      });

    let result = await calendars.updateCalendar(req.params.id, req.body);

    if (!result)
      return res.status(404).json({
        status: {
          success: false,
          message: "Calendar id was not found",
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
};

export default calendarsController;
