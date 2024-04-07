import usersController from "../controllers/usersController";
import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/all", usersController.getAllUsers);

usersRouter.get("/:id", usersController.getUser);

usersRouter.get("/exercises/:id", usersController.getUserWorkouts);

usersRouter.get("/workouts/:id", usersController.getTrainerWorkouts);

usersRouter.post("/signup", usersController.postUser);

usersRouter.post("/login", usersController.postLogin);

usersRouter.patch("/:id", usersController.patchUser);

usersRouter.delete("/:id", usersController.deleteUser);

export default usersRouter;
