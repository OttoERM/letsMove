import workoutsController from "../controllers/workoutsController";
import { Router } from "express";

const workoutsRouter = Router();

workoutsRouter.get("/all", workoutsController.getAllWorkouts);

workoutsRouter.get("/:id", workoutsController.getWorkout);

workoutsRouter.post("/new", workoutsController.postWorkout);

workoutsRouter.patch("/:id", workoutsController.patchWorkout);

workoutsRouter.delete("/:id", workoutsController.deleteWorkout);

export default workoutsRouter;
