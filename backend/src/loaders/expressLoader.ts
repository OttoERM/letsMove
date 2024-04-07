import express, { Express, Request, Response } from "express";
import cors from "cors";
import { corsOptions } from "../configs/corsConf";

import workoutsRouter from "../routes/workoutsRoutes";
import calendarsRouter from "../routes/calendarsRoutes";
import usersRouter from "../routes/usersRoutes";
import chatsRouter from "../routes/chatsRoutes";

export default (app: Express) => {
  app.use(cors(corsOptions));

  app.use(express.json());

  app.get("/", async (req: Request, res: Response) => {
    console.log(req);
    res.send("Siiiu");
  });

  app.use("/workouts", workoutsRouter);
  app.use("/calendars", calendarsRouter);
  app.use("/users", usersRouter);
  app.use("/chats", chatsRouter);

  app.use((req: Request, res: Response) => {
    const err = new Error("Not found 404");

    res.status(404).json({
      message: err.message,
    });
  });
};
