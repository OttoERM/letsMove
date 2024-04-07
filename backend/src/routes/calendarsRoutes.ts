import calendarsController from "../controllers/calendarsController";
import { Router } from "express";

const calendarsRouter = Router();

calendarsRouter.get("/:id", calendarsController.getCalendar);

calendarsRouter.patch("/:id", calendarsController.patchCalendar);

export default calendarsRouter;
